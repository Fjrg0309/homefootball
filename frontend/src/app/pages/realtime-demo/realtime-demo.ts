// =============================================
// TAREA 6: Demo de WebSockets y Polling
// =============================================
// Componente que demuestra ambas técnicas para
// actualización de datos en tiempo real sin
// intervención del usuario.
//
// NOTA: Esta es una funcionalidad OPCIONAL.
// Se incluye como documentación educativa.
// =============================================

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, interval, takeUntil, timer, switchMap, of, delay } from 'rxjs';

// =============================================
// Interfaces
// =============================================
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ConnectionState {
  mode: 'disconnected' | 'websocket' | 'polling';
  connected: boolean;
  lastUpdate: Date | null;
  messageCount: number;
}

// =============================================
// Datos simulados
// =============================================
const MOCK_MESSAGES = [
  { type: 'success', title: 'Pedido confirmado', message: 'Tu pedido #12345 ha sido confirmado' },
  { type: 'info', title: 'Nuevo producto', message: 'Camiseta Real Madrid 2025 disponible' },
  { type: 'warning', title: 'Stock bajo', message: 'Solo quedan 3 unidades de Balón Champions' },
  { type: 'error', title: 'Pago rechazado', message: 'La tarjeta terminada en 4242 fue rechazada' },
  { type: 'success', title: 'Envío en camino', message: 'Tu paquete salió del almacén' },
  { type: 'info', title: 'Oferta flash', message: '20% de descuento en botas Nike' },
];

@Component({
  selector: 'app-realtime-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './realtime-demo.html',
  styleUrl: './realtime-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtimeDemo implements OnInit, OnDestroy {
  // =============================================
  // ESTADO
  // =============================================
  connectionState = signal<ConnectionState>({
    mode: 'disconnected',
    connected: false,
    lastUpdate: null,
    messageCount: 0
  });

  notifications = signal<Notification[]>([]);

  // Computadas
  unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  isConnected = computed(() => this.connectionState().connected);
  currentMode = computed(() => this.connectionState().mode);

  // Control de suscripciones
  private destroy$ = new Subject<void>();
  private stopSimulation$ = new Subject<void>();

  // Intervalo de polling (en segundos)
  pollingInterval = signal(5);

  ngOnInit(): void {
    // No conectar automáticamente - esperar acción del usuario
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =============================================
  // SIMULACIÓN DE WEBSOCKET
  // =============================================
  connectWebSocket(): void {
    this.disconnect(); // Limpiar conexión anterior

    console.log('[WebSocket] Conectando...');
    
    this.updateConnectionState({
      mode: 'websocket',
      connected: true,
      lastUpdate: new Date()
    });

    // Simular mensajes WebSocket cada 3-8 segundos (aleatorio)
    this.simulateWebSocketMessages();
  }

  private simulateWebSocketMessages(): void {
    const randomInterval = () => Math.floor(Math.random() * 5000) + 3000;

    const scheduleNext = () => {
      timer(randomInterval())
        .pipe(takeUntil(this.stopSimulation$))
        .subscribe(() => {
          if (this.connectionState().mode === 'websocket') {
            this.addRandomNotification();
            scheduleNext();
          }
        });
    };

    scheduleNext();
  }

  // =============================================
  // SIMULACIÓN DE POLLING
  // =============================================
  startPolling(): void {
    this.disconnect(); // Limpiar conexión anterior

    console.log(`[Polling] Iniciando polling cada ${this.pollingInterval()} segundos`);

    this.updateConnectionState({
      mode: 'polling',
      connected: true,
      lastUpdate: new Date()
    });

    // Polling periódico
    interval(this.pollingInterval() * 1000)
      .pipe(takeUntil(this.stopSimulation$))
      .subscribe(() => {
        console.log('[Polling] Fetching...');
        this.updateConnectionState({ lastUpdate: new Date() });
        
        // 50% de probabilidad de recibir una notificación
        if (Math.random() > 0.5) {
          this.addRandomNotification();
        }
      });
  }

  // =============================================
  // DESCONEXIÓN
  // =============================================
  disconnect(): void {
    this.stopSimulation$.next();
    this.stopSimulation$ = new Subject<void>();

    this.updateConnectionState({
      mode: 'disconnected',
      connected: false
    });

    console.log('[Realtime] Desconectado');
  }

  // =============================================
  // GESTIÓN DE NOTIFICACIONES
  // =============================================
  private addRandomNotification(): void {
    const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
    
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: randomMsg.type as Notification['type'],
      title: randomMsg.title,
      message: randomMsg.message,
      timestamp: new Date(),
      read: false
    };

    // Añadir al inicio (inmutable)
    this.notifications.update(current => [notification, ...current]);
    
    this.updateConnectionState({
      messageCount: this.connectionState().messageCount + 1,
      lastUpdate: new Date()
    });
  }

  markAsRead(id: string): void {
    this.notifications.update(current =>
      current.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead(): void {
    this.notifications.update(current =>
      current.map(n => ({ ...n, read: true }))
    );
  }

  clearNotifications(): void {
    this.notifications.set([]);
  }

  // =============================================
  // CONFIGURACIÓN DE POLLING
  // =============================================
  setPollingInterval(seconds: number): void {
    this.pollingInterval.set(seconds);
    
    // Si está en modo polling, reiniciar
    if (this.currentMode() === 'polling') {
      this.startPolling();
    }
  }

  // =============================================
  // HELPERS
  // =============================================
  private updateConnectionState(partial: Partial<ConnectionState>): void {
    this.connectionState.update(current => ({
      ...current,
      ...partial
    }));
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌'
    };
    return icons[type] || '📬';
  }

  trackById(index: number, item: Notification): string {
    return item.id;
  }
}
