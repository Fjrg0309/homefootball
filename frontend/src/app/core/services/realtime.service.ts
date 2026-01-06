// =============================================
// TAREA 6: Servicio de Tiempo Real con WebSockets
// =============================================
// Este servicio proporciona comunicación bidireccional
// en tiempo real usando WebSocket de RxJS.
//
// NOTA: Este es un servicio OPCIONAL para proyectos
// que necesiten actualización instantánea de datos
// (chat, notificaciones, paneles en vivo, etc.)
// =============================================

import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { 
  Observable, 
  Subject, 
  BehaviorSubject,
  timer,
  retry,
  catchError,
  EMPTY,
  takeUntil,
  tap
} from 'rxjs';

// =============================================
// Interfaces
// =============================================
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ConnectionState {
  connected: boolean;
  reconnecting: boolean;
  lastConnected: Date | null;
  error: string | null;
}

// =============================================
// Servicio de WebSocket
// =============================================
@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  // =============================================
  // WebSocket Subject (conexión bidireccional)
  // =============================================
  private socket$: WebSocketSubject<WebSocketMessage> | null = null;
  private destroy$ = new Subject<void>();

  // Estado de conexión como Signal (alternativa con BehaviorSubject)
  private connectionState$ = new BehaviorSubject<ConnectionState>({
    connected: false,
    reconnecting: false,
    lastConnected: null,
    error: null
  });

  // Notificaciones acumuladas
  private notifications$ = new BehaviorSubject<Notification[]>([]);

  // URL del WebSocket (configurable)
  private wsUrl = 'wss://api.example.com/ws/notifications';

  // =============================================
  // MÉTODOS PÚBLICOS
  // =============================================

  /**
   * Conectar al WebSocket
   * 
   * El WebSocketSubject de RxJS maneja:
   * - Serialización/deserialización JSON automática
   * - Eventos de apertura/cierre
   * - Reconexión automática con retry()
   */
  connect(url?: string): WebSocketSubject<WebSocketMessage> {
    if (url) {
      this.wsUrl = url;
    }

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<WebSocketMessage>({
        url: this.wsUrl,
        openObserver: {
          next: () => {
            console.log('[WebSocket] Conectado a', this.wsUrl);
            this.updateConnectionState({
              connected: true,
              reconnecting: false,
              lastConnected: new Date(),
              error: null
            });
          }
        },
        closeObserver: {
          next: () => {
            console.log('[WebSocket] Desconectado');
            this.updateConnectionState({
              connected: false,
              reconnecting: false,
              error: null
            });
          }
        }
      });
    }

    return this.socket$;
  }

  /**
   * Escuchar mensajes del WebSocket
   * 
   * Uso típico en un componente:
   * ```
   * this.realtime.listen().subscribe(msg => {
   *   this.notifications = [msg.payload, ...this.notifications];
   * });
   * ```
   */
  listen(): Observable<WebSocketMessage> {
    return this.connect().pipe(
      // Reconexión automática con backoff exponencial
      retry({
        count: 5,
        delay: (error, retryCount) => {
          const delayMs = Math.min(1000 * Math.pow(2, retryCount), 30000);
          console.log(`[WebSocket] Reintentando en ${delayMs}ms (intento ${retryCount})`);
          this.updateConnectionState({ reconnecting: true });
          return timer(delayMs);
        }
      }),
      catchError(error => {
        console.error('[WebSocket] Error:', error);
        this.updateConnectionState({
          connected: false,
          reconnecting: false,
          error: error.message || 'Error de conexión'
        });
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    );
  }

  /**
   * Escuchar solo mensajes de un tipo específico
   * 
   * Ejemplo:
   * ```
   * this.realtime.listenToType('product-updated').subscribe(msg => {
   *   console.log('Producto actualizado:', msg.payload);
   * });
   * ```
   */
  listenToType(messageType: string): Observable<WebSocketMessage> {
    return new Observable(subscriber => {
      this.listen().subscribe({
        next: (msg) => {
          if (msg.type === messageType) {
            subscriber.next(msg);
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
    });
  }

  /**
   * Enviar mensaje al servidor
   * 
   * Ejemplo:
   * ```
   * this.realtime.send({
   *   type: 'subscribe',
   *   payload: { channel: 'products' },
   *   timestamp: Date.now()
   * });
   * ```
   */
  send(message: WebSocketMessage): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(message);
    } else {
      console.warn('[WebSocket] No conectado, mensaje no enviado:', message);
    }
  }

  /**
   * Enviar mensaje tipado (helper)
   */
  sendTyped<T>(type: string, payload: T): void {
    this.send({
      type,
      payload,
      timestamp: Date.now()
    });
  }

  /**
   * Cerrar conexión
   */
  close(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
      this.updateConnectionState({
        connected: false,
        reconnecting: false,
        error: null
      });
    }
  }

  /**
   * Obtener estado de conexión como Observable
   */
  getConnectionState(): Observable<ConnectionState> {
    return this.connectionState$.asObservable();
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.connectionState$.value.connected;
  }

  // =============================================
  // MÉTODOS ESPECÍFICOS PARA NOTIFICACIONES
  // =============================================

  /**
   * Obtener notificaciones como Observable
   */
  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  /**
   * Añadir notificación (llamado internamente cuando llega un mensaje)
   */
  addNotification(notification: Notification): void {
    const current = this.notifications$.value;
    this.notifications$.next([notification, ...current]);
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(id: string): void {
    const updated = this.notifications$.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications$.next(updated);
  }

  /**
   * Marcar todas como leídas
   */
  markAllAsRead(): void {
    const updated = this.notifications$.value.map(n => ({ ...n, read: true }));
    this.notifications$.next(updated);
  }

  /**
   * Limpiar notificaciones
   */
  clearNotifications(): void {
    this.notifications$.next([]);
  }

  /**
   * Contar notificaciones no leídas
   */
  getUnreadCount(): number {
    return this.notifications$.value.filter(n => !n.read).length;
  }

  // =============================================
  // HELPERS PRIVADOS
  // =============================================

  private updateConnectionState(partial: Partial<ConnectionState>): void {
    this.connectionState$.next({
      ...this.connectionState$.value,
      ...partial
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.close();
  }
}

// =============================================
// EJEMPLO DE USO EN UN COMPONENTE
// =============================================
/*
@Component({...})
export class NotificationsComponent implements OnInit, OnDestroy {
  private realtime = inject(RealtimeService);
  
  notifications: Notification[] = [];
  connectionState$ = this.realtime.getConnectionState();

  ngOnInit() {
    // Conectar y escuchar notificaciones
    this.realtime.listenToType<Notification>('notification').subscribe(msg => {
      this.notifications = [msg.payload, ...this.notifications];
    });
  }

  ngOnDestroy() {
    this.realtime.close();
  }
}
*/
