// =============================================
// TAREA 6: Servicio de Polling con RxJS
// =============================================
// Alternativa a WebSockets cuando la API no los soporta.
// Usa timer() + switchMap() para hacer peticiones periódicas.
//
// NOTA: Este es un servicio OPCIONAL. El polling es menos
// eficiente que WebSockets pero más simple de implementar
// y funciona con cualquier API REST.
// =============================================

import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  Observable, 
  Subject, 
  BehaviorSubject,
  timer,
  switchMap,
  shareReplay,
  catchError,
  of,
  takeUntil,
  tap,
  retry,
  map
} from 'rxjs';

// =============================================
// Interfaces
// =============================================
export interface PollingConfig {
  intervalMs: number;      // Intervalo entre peticiones (default: 30000)
  retryCount: number;      // Reintentos en caso de error (default: 3)
  retryDelayMs: number;    // Delay entre reintentos (default: 1000)
}

export interface PollingState {
  active: boolean;
  lastFetch: Date | null;
  errorCount: number;
  lastError: string | null;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Configuración por defecto
const DEFAULT_CONFIG: PollingConfig = {
  intervalMs: 30000,  // 30 segundos
  retryCount: 3,
  retryDelayMs: 1000
};

// =============================================
// Servicio de Polling
// =============================================
@Injectable({ providedIn: 'root' })
export class PollingService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private stopPolling$ = new Subject<void>();

  // Estado del polling
  private pollingState$ = new BehaviorSubject<PollingState>({
    active: false,
    lastFetch: null,
    errorCount: 0,
    lastError: null
  });

  // Cache de la última respuesta
  private notificationsCache$ = new BehaviorSubject<Notification[]>([]);

  constructor(private http: HttpClient) {}

  // =============================================
  // POLLING GENÉRICO
  // =============================================

  /**
   * Crear un Observable que hace polling a una URL
   * 
   * El patrón es:
   * 1. timer(0, interval) - emite inmediatamente y luego cada X ms
   * 2. switchMap() - cancela la petición anterior si hay una nueva
   * 3. shareReplay(1) - comparte la respuesta entre suscriptores
   * 
   * Ejemplo:
   * ```
   * this.polling.poll<Product[]>('/api/products', { intervalMs: 10000 })
   *   .subscribe(products => this.products = products);
   * ```
   */
  poll<T>(url: string, config: Partial<PollingConfig> = {}): Observable<T> {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    return timer(0, finalConfig.intervalMs).pipe(
      tap(() => {
        this.updateState({ active: true });
        console.log(`[Polling] Fetching ${url}...`);
      }),
      switchMap(() => 
        this.http.get<T>(url).pipe(
          retry({
            count: finalConfig.retryCount,
            delay: finalConfig.retryDelayMs
          }),
          catchError(error => {
            console.error(`[Polling] Error fetching ${url}:`, error);
            this.updateState({
              errorCount: this.pollingState$.value.errorCount + 1,
              lastError: error.message || 'Error de red'
            });
            return of(null as unknown as T);
          })
        )
      ),
      tap((response) => {
        if (response !== null) {
          this.updateState({
            lastFetch: new Date(),
            errorCount: 0,
            lastError: null
          });
        }
      }),
      shareReplay(1), // Reutiliza la última respuesta
      takeUntil(this.stopPolling$)
    );
  }

  /**
   * Polling específico para notificaciones
   * 
   * Uso:
   * ```
   * notifications$ = this.polling.pollNotifications(30000);
   * 
   * // En template:
   * @for (notification of notifications$ | async) { ... }
   * ```
   */
  pollNotifications(intervalMs = 30000): Observable<Notification[]> {
    return timer(0, intervalMs).pipe(
      tap(() => console.log('[Polling] Fetching notifications...')),
      switchMap(() => 
        this.http.get<Notification[]>('/api/notifications').pipe(
          catchError(error => {
            console.error('[Polling] Error:', error);
            // Devolver el cache si hay error
            return of(this.notificationsCache$.value);
          })
        )
      ),
      tap(notifications => {
        // Actualizar cache
        this.notificationsCache$.next(notifications);
        this.updateState({ lastFetch: new Date() });
      }),
      shareReplay(1),
      takeUntil(this.stopPolling$)
    );
  }

  /**
   * Polling con comparación de cambios
   * 
   * Solo emite si los datos han cambiado desde la última vez.
   * Útil para evitar re-renders innecesarios.
   */
  pollWithChanges<T>(
    url: string, 
    config: Partial<PollingConfig> = {},
    compareFn: (a: T, b: T) => boolean = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  ): Observable<T> {
    let lastValue: T | null = null;

    return this.poll<T>(url, config).pipe(
      map(value => {
        if (lastValue !== null && compareFn(lastValue, value)) {
          // Sin cambios, devolver el valor anterior
          return lastValue;
        }
        lastValue = value;
        return value;
      })
    );
  }

  // =============================================
  // CONTROL DEL POLLING
  // =============================================

  /**
   * Detener todo el polling
   */
  stopAll(): void {
    console.log('[Polling] Detenido');
    this.stopPolling$.next();
    this.updateState({ active: false });
  }

  /**
   * Reiniciar el polling (después de detenerlo)
   */
  restart(): void {
    // Recrear el subject para permitir nuevas suscripciones
    this.stopPolling$ = new Subject<void>();
  }

  /**
   * Obtener estado del polling
   */
  getState(): Observable<PollingState> {
    return this.pollingState$.asObservable();
  }

  /**
   * Verificar si el polling está activo
   */
  isActive(): boolean {
    return this.pollingState$.value.active;
  }

  /**
   * Obtener notificaciones cacheadas
   */
  getCachedNotifications(): Notification[] {
    return this.notificationsCache$.value;
  }

  // =============================================
  // HELPERS PRIVADOS
  // =============================================

  private updateState(partial: Partial<PollingState>): void {
    this.pollingState$.next({
      ...this.pollingState$.value,
      ...partial
    });
  }

  ngOnDestroy(): void {
    this.stopAll();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// =============================================
// EJEMPLO DE USO EN UN COMPONENTE
// =============================================
/*
@Component({...})
export class DashboardComponent implements OnInit, OnDestroy {
  private polling = inject(PollingService);
  
  // Observable de notificaciones con polling cada 30 segundos
  notifications$ = this.polling.pollNotifications(30000);
  
  // Estado del polling para mostrar en UI
  pollingState$ = this.polling.getState();

  ngOnDestroy() {
    // Detener polling al salir del componente
    this.polling.stopAll();
  }
}

// En el template:
<div *ngIf="pollingState$ | async as state">
  <span *ngIf="state.active">🟢 Actualizando automáticamente</span>
  <span *ngIf="state.lastFetch">Última actualización: {{ state.lastFetch | date:'short' }}</span>
</div>

<ul>
  <li *ngFor="let n of notifications$ | async">{{ n.message }}</li>
</ul>
*/
