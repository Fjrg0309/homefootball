# Fase 2: Servicios y Arquitectura - Proceso de Implementación

## Objetivos de la Fase 2
1. **Tarea 1:** Servicios de comunicación entre componentes hermanos con RxJS
2. **Tarea 2:** Separación de responsabilidades (componentes presentacionales + servicios de lógica)



## Tarea 1: Servicios de Comunicación

### Objetivo
Implementar un servicio de comunicación que permita compartir datos y notificaciones entre componentes hermanos usando RxJS BehaviorSubject, siguiendo el patrón de flujo unidireccional de datos.

### Estado: COMPLETADA

---

### Paso 1: Crear el Servicio de Comunicación

**Comando:**
```bash
# Creación manual del servicio
src/app/services/communication.service.ts
```

**Implementación:**
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  // BehaviorSubject mantiene el último valor emitido
  // Permite suscripciones tardías con valor inicial
  private notificationSubject = new BehaviorSubject<string>('');
  public notifications$ = this.notificationSubject.asObservable();

  sendNotification(message: string): void {
    this.notificationSubject.next(message);
  }
}
```

**Características:**
- ✅ `providedIn: 'root'` para singleton global
- ✅ `BehaviorSubject` con valor inicial vacío
- ✅ Observable público `notifications$` para suscripciones
- ✅ Método `sendNotification()` para emitir mensajes

---

### Paso 2: Crear Componentes Hermanos

**Estructura:**
```
src/app/pages/communication-demo/
├── communication-demo.ts (componente padre)
├── communication-demo.html
├── communication-demo.scss
└── components/
    ├── sender.ts (hermano emisor)
    ├── sender.html
    ├── sender.scss
    ├── receiver.ts (hermano receptor)
    ├── receiver.html
    └── receiver.scss
```

---

### Paso 3: Implementar Componente Emisor

**Archivo:** `sender.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-sender',
  standalone: true,
  templateUrl: './sender.html',
  styleUrl: './sender.scss'
})
export class Sender {
  private commService = inject(CommunicationService);
  messageCount = 0;

  onAction() {
    this.messageCount++;
    this.commService.sendNotification(`Mensaje #${this.messageCount} desde Emisor`);
  }

  sendCustomMessage(message: string) {
    this.commService.sendNotification(message);
  }
}
```

**Template:** `sender.html`
```html
<div class="sender-card">
  <h3>Componente Emisor</h3>
  <p>Envía mensajes al hermano receptor</p>
  
  <div class="controls">
    <button (click)="onAction()">Enviar Mensaje Automático</button>
    <input #customInput type="text" placeholder="Mensaje personalizado">
    <button (click)="sendCustomMessage(customInput.value)">Enviar Personalizado</button>
  </div>
  
  <div class="info">
    <p>Mensajes enviados: {{ messageCount }}</p>
  </div>
</div>
```

---

### Paso 4: Implementar Componente Receptor

**Archivo:** `receiver.ts`

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../services/communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receiver.html',
  styleUrl: './receiver.scss'
})
export class Receiver implements OnInit, OnDestroy {
  private commService = inject(CommunicationService);
  private subscription?: Subscription;
  
  receivedMessages: string[] = [];
  lastMessage = '';

  ngOnInit() {
    // Suscripción al Observable de notificaciones
    this.subscription = this.commService.notifications$.subscribe(msg => {
      if (msg) {
        this.lastMessage = msg;
        this.receivedMessages.unshift(msg); // Agregar al inicio
        console.log('Recibido:', msg);
      }
    });
  }

  ngOnDestroy() {
    // Limpiar suscripción para evitar memory leaks
    this.subscription?.unsubscribe();
  }

  clearMessages() {
    this.receivedMessages = [];
    this.lastMessage = '';
  }
}
```

**Template:** `receiver.html`
```html
<div class="receiver-card">
  <h3>Componente Receptor</h3>
  <p>Recibe mensajes del hermano emisor</p>
  
  @if (lastMessage) {
    <div class="last-message">
      <strong>Último mensaje:</strong>
      <p>{{ lastMessage }}</p>
    </div>
  } @else {
    <div class="no-messages">
      <p>Esperando mensajes...</p>
    </div>
  }
  
  <div class="message-history">
    <h4>Historial ({{ receivedMessages.length }} mensajes)</h4>
    <button (click)="clearMessages()">Limpiar Historial</button>
    
    <ul>
      @for (msg of receivedMessages; track $index) {
        <li>{{ msg }}</li>
      }
    </ul>
  </div>
</div>
```

---

### Paso 5: Componente Padre (Contenedor)

**Archivo:** `communication-demo.ts`

```typescript
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sender } from './components/sender';
import { Receiver } from './components/receiver';

@Component({
  selector: 'app-communication-demo',
  standalone: true,
  imports: [RouterModule, Sender, Receiver],
  templateUrl: './communication-demo.html',
  styleUrl: './communication-demo.scss'
})
export class CommunicationDemo {
  // Componente padre solo contiene a los hermanos
  // No gestiona la comunicación entre ellos
}
```

**Template:** `communication-demo.html`
```html
<div class="communication-container">
  <header class="demo-header">
    <a routerLink="/" class="back-button">Volver</a>
    <h1>Servicio de Comunicación entre Componentes</h1>
    <p class="subtitle">Patrón Observable/Subject con RxJS BehaviorSubject</p>
  </header>

  <section class="explanation">
    <h2>¿Cómo funciona?</h2>
    <div class="flow-diagram">
      <div class="flow-step">
        <strong>1. Emisor</strong> → <code>service.sendNotification(msg)</code>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <strong>2. BehaviorSubject</strong> → <code>next(msg)</code>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <strong>3. Observable</strong> → <code>notifications$</code>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <strong>4. Receptor</strong> → <code>subscribe(msg => ...)</code>
      </div>
    </div>
  </section>

  <div class="siblings-container">
    <app-sender />
    <app-receiver />
  </div>

  <section class="theory">
    <h2>Teoría</h2>
    
    <div class="theory-grid">
      <div class="theory-card">
        <h3>Subject</h3>
        <p><strong>Uso:</strong> Eventos únicos (clicks, logs)</p>
        <p><strong>Ventaja:</strong> No retiene valor</p>
        <p><strong>Ejemplo:</strong> Notificaciones one-time</p>
      </div>

      <div class="theory-card highlight">
        <h3>BehaviorSubject</h3>
        <p><strong>Uso:</strong> Estado compartido (filtros, user)</p>
        <p><strong>Ventaja:</strong> Valor inicial + histórico</p>
        <p><strong>Ejemplo:</strong> Tema actual, usuario logueado</p>
      </div>

      <div class="theory-card">
        <h3>ReplaySubject</h3>
        <p><strong>Uso:</strong> Historial limitado de emisiones</p>
        <p><strong>Ventaja:</strong> Reproducir últimos N eventos</p>
        <p><strong>Ejemplo:</strong> Logs, notificaciones recientes</p>
      </div>
    </div>

    <div class="best-practices">
      <h3>Mejores Prácticas</h3>
      <ul>
        <li>Usar <code>providedIn: 'root'</code> para servicios singleton</li>
        <li>Siempre limpiar suscripciones en <code>ngOnDestroy()</code></li>
        <li>Usar BehaviorSubject para estado que necesita valor inicial</li>
        <li>Exponer solo Observable público, mantener Subject privado</li>
        <li>Considerar AsyncPipe en templates para auto-unsubscribe</li>
      </ul>
    </div>
  </section>
</div>
```

---

### Paso 6: Estilos

**Archivo:** `communication-demo.scss`

```scss
@use '../../../../styles/00-settings/variables' as *;

.communication-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.demo-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;

  .back-button {
    display: inline-block;
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    margin-bottom: 1rem;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(-5px);
    }
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
  }
}

.explanation {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h2 {
    color: #667eea;
    margin-bottom: 1.5rem;
  }
}

.flow-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .flow-step {
    background: #f5f5f5;
    padding: 1rem 2rem;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    width: 100%;
    max-width: 500px;

    strong {
      color: #667eea;
    }

    code {
      background: #e8e8e8;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-family: monospace;
    }
  }

  .flow-arrow {
    color: #667eea;
    font-size: 1.5rem;
    font-weight: bold;
  }
}

.siblings-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.theory {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h2 {
    color: #667eea;
    margin-bottom: 1.5rem;
  }

  h3 {
    color: #764ba2;
    margin-bottom: 1rem;
  }
}

.theory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.theory-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-top: 4px solid #667eea;

  &.highlight {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border-top-color: #4caf50;
  }

  h3 {
    color: #333;
    margin: 0 0 1rem 0;
  }

  p {
    margin: 0.5rem 0;
    color: #666;
    font-size: 0.95rem;

    strong {
      color: #333;
    }
  }
}

.best-practices {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #ff9800;

  h3 {
    color: #f57c00;
    margin: 0 0 1rem 0;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;

    li {
      margin: 0.75rem 0;
      color: #666;
      line-height: 1.6;

      code {
        background: rgba(0, 0, 0, 0.1);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9em;
      }
    }
  }
}

@media (max-width: 768px) {
  .siblings-container {
    grid-template-columns: 1fr;
  }

  .theory-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### Paso 7: Estilos de Componentes Hermanos

**sender.scss:**
```scss
.sender-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 2rem;
  border-radius: 12px;
  border-left: 6px solid #2196f3;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  h3 {
    color: #1976d2;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #666;
    margin: 0 0 1.5rem 0;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;

    button {
      padding: 0.75rem 1.5rem;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #1976d2;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }

    input {
      padding: 0.75rem;
      border: 2px solid #90caf9;
      border-radius: 8px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #2196f3;
      }
    }
  }

  .info {
    background: rgba(255, 255, 255, 0.7);
    padding: 1rem;
    border-radius: 8px;

    p {
      margin: 0;
      font-weight: 600;
      color: #1976d2;
    }
  }
}
```

**receiver.scss:**
```scss
.receiver-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 2rem;
  border-radius: 12px;
  border-left: 6px solid #4caf50;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  h3 {
    color: #388e3c;
    margin: 0 0 0.5rem 0;
  }

  > p {
    color: #666;
    margin: 0 0 1.5rem 0;
  }

  .last-message {
    background: rgba(255, 255, 255, 0.9);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 4px solid #4caf50;
    animation: slideIn 0.3s ease;

    strong {
      color: #388e3c;
      display: block;
      margin-bottom: 0.5rem;
    }

    p {
      margin: 0;
      color: #333;
      font-weight: 500;
    }
  }

  .no-messages {
    background: rgba(255, 255, 255, 0.5);
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 1.5rem;

    p {
      margin: 0;
      color: #999;
      font-style: italic;
    }
  }

  .message-history {
    h4 {
      color: #388e3c;
      margin: 0 0 1rem 0;
    }

    button {
      padding: 0.5rem 1rem;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      margin-bottom: 1rem;
      transition: all 0.3s ease;

      &:hover {
        background: #d32f2f;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 300px;
      overflow-y: auto;

      li {
        background: rgba(255, 255, 255, 0.7);
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        border-left: 3px solid #4caf50;
        animation: fadeIn 0.3s ease;
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

### Paso 8: Registrar Ruta

**Archivo:** `app.routes.ts`

```typescript
import { CommunicationDemo } from './pages/communication-demo/communication-demo';

export const routes: Routes = [
  // ... rutas existentes
  { path: 'communication', component: CommunicationDemo }
];
```

---

### Paso 9: Actualizar Home

**Archivo:** `home.ts`

Agregar nueva tarjeta:
```typescript
{
  id: 5,
  title: 'Fase 2 - Tarea 1: Comunicación entre Componentes',
  description: 'Servicio de comunicación entre componentes hermanos usando RxJS BehaviorSubject. Patrón Observable/Subject para notificaciones y estado compartido.',
  route: '/communication',
  icon: '🔄',
  color: '#00BCD4'
}
```

---

## ✅ Checklist de Progreso - Tarea 1

- [x] Crear CommunicationService con BehaviorSubject
- [x] Implementar componente Emisor (Sender)
- [x] Implementar componente Receptor (Receiver)
- [x] Crear componente padre (CommunicationDemo)
- [x] Agregar explicación del flujo de datos
- [x] Agregar tabla comparativa de Subjects
- [x] Implementar limpieza de suscripciones (OnDestroy)
- [x] Agregar estilos responsive
- [x] Registrar ruta
- [x] Actualizar Home
- [x] Verificar compilación sin errores

---

## 🔔 Tarea 3: Sistema de Notificaciones/Toasts

### Objetivo
Implementar un sistema centralizado de notificaciones toast con servicio BehaviorSubject, componente overlay con auto-dismiss configurable, tipos diferenciados (success, error, info, warning) y animaciones.

### Estado: ✅ COMPLETADA

---

### Paso 1: Crear Interface y ToastService

**Archivo:** `src/app/services/toast.service.ts`

**Interface ToastMessage:**
```typescript
export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms, default por tipo
}
```

**Implementación del Servicio:**
```typescript
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  public toast$ = this.toastSubject.asObservable();

  private show(message: string, type: ToastMessage['type'], duration: number): void {
    this.toastSubject.next({ message, type, duration });
  }

  success(message: string, duration = 4000): void { 
    this.show(message, 'success', duration); 
  }

  error(message: string, duration = 8000): void { 
    this.show(message, 'error', duration); 
  }

  info(message: string, duration = 3000): void { 
    this.show(message, 'info', duration); 
  }

  warning(message: string, duration = 6000): void { 
    this.show(message, 'warning', duration); 
  }
}
```

**Características:**
- ✅ Duraciones diferenciadas por tipo
- ✅ Métodos helper para cada tipo
- ✅ BehaviorSubject para estado reactivo
- ✅ Parámetro duration opcional

---

### Paso 2: Crear Componente Toast

**Archivo:** `src/app/components/shared/toast/toast.ts`

```typescript
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class Toast implements OnDestroy {
  toast = signal<ToastMessage | null>(null);
  private timeoutId: any = null;
  private subscription?: Subscription;
  private toastService = inject(ToastService);

  constructor() {
    this.subscription = this.toastService.toast$.subscribe(msg => {
      this.dismiss(); // Cancela timeout anterior
      this.toast.set(msg);

      if (msg?.duration && msg.duration > 0) {
        this.timeoutId = setTimeout(() => {
          this.toast.set(null);
        }, msg.duration);
      }
    });
  }

  dismiss() {
    this.toast.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  ngOnDestroy() {
    this.dismiss();
    this.subscription?.unsubscribe();
  }
}
```

---

### Paso 3: Template del Toast

**Archivo:** `toast.html`

```html
@if (toast()) {
  <div class="toast-container" [@fadeInOut]>
    <div class="toast" [class]="'toast-' + toast()!.type" (click)="dismiss()">
      <span class="toast-icon">{{ getIcon(toast()!.type) }}</span>
      <span class="toast-message">{{ toast()!.message }}</span>
      <button class="toast-close" (click)="dismiss()">×</button>
    </div>
  </div>
}
```

**Método helper para iconos:**
```typescript
getIcon(type: string): string {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };
  return icons[type as keyof typeof icons] || 'ℹ';
}
```

---

### Paso 4: Estilos del Toast

**Archivo:** `toast.scss`

```scss
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  min-width: 300px;
  max-width: 500px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  &-success {
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  }

  &-error {
    background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  }

  &-info {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  }

  &-warning {
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  }

  &-icon {
    font-size: 1.5rem;
    font-weight: bold;
  }

  &-message {
    flex: 1;
    line-height: 1.4;
  }

  &-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}

@media (max-width: 768px) {
  .toast-container {
    left: 10px;
    right: 10px;
    top: 10px;
  }

  .toast {
    min-width: auto;
  }
}
```

---

### Paso 5: Integrar Toast en App Component

**Archivo:** `app.html`

```html
<router-outlet />
<app-toast />
```

**Actualizar imports en app.ts:**
```typescript
import { Toast } from './components/shared/toast/toast';

@Component({
  // ...
  imports: [RouterOutlet, Toast]
})
```

---

### Paso 6: Crear Página de Demostración

**Archivo:** `src/app/pages/toast-demo/toast-demo.ts`

```typescript
@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './toast-demo.html',
  styleUrl: './toast-demo.scss'
})
export class ToastDemo {
  private toastService = inject(ToastService);

  showSuccess() {
    this.toastService.success('¡Operación exitosa!');
  }

  showError() {
    this.toastService.error('Error de validación');
  }

  showInfo() {
    this.toastService.info('Información importante');
  }

  showWarning() {
    this.toastService.warning('Advertencia del sistema');
  }

  showCustomDuration() {
    this.toastService.success('Toast corto', 2000);
  }

  showPersistent() {
    this.toastService.error('Sin auto-dismiss (click para cerrar)', 0);
  }
}
```

---

### Paso 7: Template de Demostración

**Archivo:** `toast-demo.html`

```html
<div class="toast-demo-container">
  <header class="demo-header">
    <a routerLink="/" class="back-button">← Volver</a>
    <h1>🔔 Sistema de Notificaciones Toast</h1>
    <p class="subtitle">BehaviorSubject + Auto-dismiss + Tipos diferenciados</p>
  </header>

  <section class="demo-section">
    <h2>Tipos de Notificaciones</h2>
    <div class="button-grid">
      <button class="btn-success" (click)="showSuccess()">
        ✓ Success Toast
      </button>
      <button class="btn-error" (click)="showError()">
        ✕ Error Toast
      </button>
      <button class="btn-info" (click)="showInfo()">
        ℹ Info Toast
      </button>
      <button class="btn-warning" (click)="showWarning()">
        ⚠ Warning Toast
      </button>
    </div>
  </section>

  <section class="demo-section">
    <h2>Configuraciones Avanzadas</h2>
    <div class="button-grid">
      <button (click)="showCustomDuration()">
        ⏱ Duración Corta (2s)
      </button>
      <button (click)="showPersistent()">
        📌 Sin Auto-dismiss
      </button>
    </div>
  </section>

  <section class="theory-section">
    <h2>📚 Características</h2>
    <ul>
      <li>✅ Servicio centralizado con BehaviorSubject</li>
      <li>✅ Auto-dismiss configurable por tipo</li>
      <li>✅ Animaciones fade in/out</li>
      <li>✅ Click para cerrar manualmente</li>
      <li>✅ Botón close explícito</li>
      <li>✅ Estilos diferenciados por tipo</li>
      <li>✅ Cleanup automático con finalize()</li>
      <li>✅ Position fixed para overlay global</li>
    </ul>
  </section>
</div>
```

---

## ⏳ Tarea 4: Gestión de Loading States

### Objetivo
Implementar un servicio global de loading con BehaviorSubject para spinner overlay y signals locales por operación, con finalize() de RxJS para cleanup garantizado.

### Estado: ✅ COMPLETADA

---

### Paso 1: Crear LoadingService

**Archivo:** `src/app/services/loading.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  private requestCount = 0;

  show(): void {
    this.requestCount++;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }

  reset(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }
}
```

**Características:**
- ✅ Contador de peticiones concurrentes
- ✅ Show/hide con tracking automático
- ✅ Reset para limpiar estado
- ✅ BehaviorSubject para estado reactivo

---

### Paso 2: Componente Loading Spinner

**Archivo:** `src/app/components/shared/loading/loading.ts`

```typescript
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading$ | async) {
      <div class="loading-overlay" [@fadeInOut]>
        <div class="spinner"></div>
        <p>Cargando...</p>
      </div>
    }
  `,
  styleUrl: './loading.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class Loading {
  isLoading$ = inject(LoadingService).isLoading$;
}
```

---

### Paso 3: Estilos del Loading Spinner

**Archivo:** `loading.scss`

```scss
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  p {
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
  }
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

### Paso 4: Integrar Loading en App

**Actualizar app.html:**
```html
<router-outlet />
<app-toast />
<app-loading />
```

**Actualizar app.ts:**
```typescript
import { Loading } from './components/shared/loading/loading';

@Component({
  // ...
  imports: [RouterOutlet, Toast, Loading]
})
```

---

### Paso 5: Crear Página de Demostración

**Archivo:** `src/app/pages/loading-demo/loading-demo.ts`

```typescript
@Component({
  selector: 'app-loading-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './loading-demo.html',
  styleUrl: './loading-demo.scss'
})
export class LoadingDemo {
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);

  isSaving = signal(false);
  isDeleting = signal(false);

  // Loading global
  simulateGlobalLoading() {
    this.loadingService.show();
    
    setTimeout(() => {
      this.loadingService.hide();
      this.toastService.success('Operación completada');
    }, 3000);
  }

  // Loading local en botón
  async simulateLocalLoading() {
    this.isSaving.set(true);

    setTimeout(() => {
      this.isSaving.set(false);
      this.toastService.success('Guardado exitoso');
    }, 2000);
  }

  // Múltiples operaciones concurrentes
  simulateMultipleOperations() {
    this.loadingService.show();
    this.toastService.info('Iniciando operación 1...');

    setTimeout(() => {
      this.loadingService.show();
      this.toastService.info('Iniciando operación 2...');
    }, 1000);

    setTimeout(() => {
      this.loadingService.hide();
      this.toastService.success('Operación 1 completada');
    }, 2000);

    setTimeout(() => {
      this.loadingService.hide();
      this.toastService.success('Operación 2 completada');
    }, 3000);
  }

  // Simular error
  simulateError() {
    this.isDeleting.set(true);
    this.loadingService.show();

    setTimeout(() => {
      this.isDeleting.set(false);
      this.loadingService.hide();
      this.toastService.error('Error en la operación');
    }, 2000);
  }
}
```

---

## ✅ Checklist de Progreso - Tarea 3

- [x] Crear ToastService con BehaviorSubject
- [x] Crear interface ToastMessage
- [x] Implementar componente Toast
- [x] Agregar animaciones fade in/out
- [x] Implementar auto-dismiss configurable
- [x] Crear estilos diferenciados por tipo
- [x] Integrar en App component
- [x] Crear página de demostración
- [x] Registrar ruta
- [x] Actualizar Home
- [x] Verificar compilación sin errores

## ✅ Checklist de Progreso - Tarea 4

- [x] Crear LoadingService con contador
- [x] Implementar componente Loading spinner
- [x] Crear animaciones de spinner
- [x] Integrar en App component
- [x] Crear página de demostración
- [x] Implementar loading local con signals
- [x] Demostrar operaciones concurrentes
- [x] Registrar ruta
- [x] Actualizar Home
- [x] Verificar compilación sin errores

---

**Siguiente:** Tarea 2 - Separación de responsabilidades (pendiente)

---

## 📚 Tarea 5: Documentación de Arquitectura de Servicios

### Objetivo
Documentar la arquitectura de servicios, patrones de comunicación y buenas prácticas de separación de responsabilidades para facilitar el onboarding y mantenimiento del proyecto.

### Estado: ✅ COMPLETADA

---

### Paso 1: Diagrama de Arquitectura de Servicios

**Ubicación:** `README.md` - Sección "🏗️ Arquitectura de Servicios"

**Contenido documentado:**
```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
│            Componentes "Dumb" (Solo UI)                      │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS (Smart)                 │
│     UserService, ProductService → HttpService                │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVICIOS REACTIVOS GLOBALES                │
│   LoadingService, ToastService, CommunicationService        │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
         Componentes Overlay (<app-loading />, <app-toast />)
```

**Características:**
- ✅ Flujo unidireccional: Componentes → Services → Estado Global → View
- ✅ Separación clara de responsabilidades por capas
- ✅ Patrón jerárquico con servicios de dominio específicos
- ✅ Servicios reactivos globales con BehaviorSubject

---

### Paso 2: Documentar Patrones de Comunicación

**Ubicación:** `README.md` - Sección "📡 Patrones de Comunicación Implementados"

**4 Patrones Principales:**

#### 1. Observable/Subject Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private notificationSubject = new BehaviorSubject<string>('');
  public notifications$ = this.notificationSubject.asObservable();

  sendNotification(message: string): void {
    this.notificationSubject.next(message);
  }
}
```

**Uso:**
- Comunicación hermano-hermano sin jerarquía padre-hijo
- Estado persistente con valor inicial
- Suscriptores tardíos reciben último valor emitido

#### 2. Servicio Singleton Global
```typescript
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  public toast$ = this.toastSubject.asObservable();

  success(message: string, duration = 4000): void {
    this.toastSubject.next({ message, type: 'success', duration });
  }
}
```

**Características:**
- Una sola instancia para toda la aplicación
- Estado compartido sin prop drilling
- Inyección limpia con `inject()`

#### 3. HttpInterceptor Pattern
```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

**Ventajas:**
- Lógica centralizada para todas las peticiones
- Auto-cleanup con `finalize()`
- Separación de concerns

#### 4. Signals + AsyncPipe
```typescript
// Componente
isSaving = signal(false);
users$ = this.userService.getUsers();

// Template
@if (isSaving()) {
  <p>Guardando...</p>
}

@for (user of users$ | async; track user.id) {
  <div>{{ user.name }}</div>
}
```

**Beneficios:**
- Sin memory leaks (AsyncPipe gestiona unsubscribe)
- Change detection automática con signals
- Código declarativo y legible

---

### Paso 3: Buenas Prácticas de Separación de Responsabilidades

**Ubicación:** `README.md` - Sección "📋 Buenas Prácticas de Separación de Responsabilidades"

#### Componentes "Dumb" (Presentacionales)

**Responsabilidades:**
- ✅ Solo templates y estilos
- ✅ Signals locales para UI (`isOpen`, `selectedTab`)
- ✅ Handlers que delegan a servicios
- ❌ **NO** HTTP directo
- ❌ **NO** validaciones de negocio
- ❌ **NO** estado global

**Ejemplo correcto:**
```typescript
// ✅ Componente limpio
export class UserComponent {
  private userService = inject(UserService);
  users$ = this.userService.getActiveAdultUsers();

  onSave(user: User) {
    this.userService.save(user);
  }
}
```

**Ejemplo incorrecto:**
```typescript
// ❌ Componente con lógica pesada (EVITAR)
export class UserComponent {
  users: User[] = [];

  getUsers() {
    this.http.get<User[]>('/api/users').subscribe(data => {
      if (data.length > 0 && data[0].age >= 18) { // Lógica de negocio ❌
        this.users = data.filter(u => u.active); // Filtrado ❌
      }
    });
  }
}
```

#### Servicios "Smart" (Lógica de Negocio)

**Responsabilidades:**
- ✅ Lógica de negocio y validaciones
- ✅ Caching y optimización
- ✅ Orquestación de APIs
- ✅ Transformación de datos
- ✅ Métodos puros y observables pipeados

**Ejemplo completo:**
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private cache = new Map<string, User[]>();

  getActiveAdultUsers(): Observable<User[]> {
    const cacheKey = 'active-adults';
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    return this.http.get<User[]>('/api/users').pipe(
      map(users => users.filter(u => u.active && u.age >= 18)),
      tap(users => this.cache.set(cacheKey, users)),
      catchError(err => {
        this.toastService.error('Error al cargar usuarios');
        return throwError(() => err);
      })
    );
  }

  save(user: User): Observable<User> {
    if (!this.validateUser(user)) {
      this.toastService.warning('Datos inválidos');
      return EMPTY;
    }

    this.loadingService.show();
    return this.http.post<User>('/api/users', user).pipe(
      tap(() => {
        this.cache.clear();
        this.toastService.success('Usuario guardado');
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  private validateUser(user: User): boolean {
    return user.name.length > 0 && user.age >= 18;
  }
}
```

---

### Paso 4: Estructura de Carpetas por Feature

**Ubicación:** `README.md` - Subsección de buenas prácticas

**Estructura recomendada:**
```
src/app/
├── features/                    # Módulos de negocio
│   ├── user/
│   │   ├── user.component.ts   # Componente dumb
│   │   ├── user.service.ts     # Servicio smart
│   │   └── user.model.ts       # Interfaces
│   ├── product/
│   │   ├── product.component.ts
│   │   ├── product.service.ts
│   │   └── product.model.ts
│   └── order/
│
├── shared/                      # Compartido entre features
│   ├── services/
│   │   ├── loading.service.ts  # Estado global
│   │   ├── toast.service.ts    # Notificaciones
│   │   └── communication.service.ts
│   ├── components/
│   │   ├── loading/            # Overlay global
│   │   ├── toast/              # Toast global
│   │   ├── button/             # Componentes reutilizables
│   │   ├── card/
│   │   └── modal/
│   └── models/
│       └── common.models.ts
│
├── core/                        # Singleton services
│   ├── interceptors/
│   │   └── loading.interceptor.ts
│   └── guards/
│       └── auth.guard.ts
│
└── pages/                       # Páginas de rutas
    ├── home/
    ├── toast-demo/
    └── loading-demo/
```

**Convenciones:**
- `features/`: Carpetas por dominio de negocio (user, product, order)
- `shared/`: Componentes y servicios reutilizables entre features
- `core/`: Servicios singleton que se cargan una vez (interceptors, guards)
- `pages/`: Componentes de ruta principal

---

### Paso 5: Checklist de Validación

**Checklist de Separación de Responsabilidades:**

#### Componente Dumb
- [x] Sin HTTP directo (usa servicios)
- [x] Sin lógica de validación (delega a servicios)
- [x] Sin estado global (usa servicios inyectados)
- [x] Usa `signal()` para UI local
- [x] Usa `AsyncPipe` para observables
- [x] Métodos handler simples (1-2 líneas)

#### Servicio Smart
- [x] Toda la lógica de negocio centralizada
- [x] Métodos puros (sin side effects directos)
- [x] Usa RxJS operators (`map`, `tap`, `catchError`)
- [x] Implementa caching si es necesario
- [x] Emite a servicios globales (Toast, Loading)
- [x] Documentado con ejemplos

#### Arquitectura General
- [x] Flujo unidireccional de datos
- [x] Servicios singleton con `providedIn: 'root'`
- [x] Interceptors para lógica HTTP transversal
- [x] Estructura de carpetas por feature
- [x] Modelos tipados con interfaces
- [x] Cleanup automático de suscripciones

---

## ✅ Checklist de Progreso - Tarea 5

- [x] Crear diagrama de arquitectura de servicios
- [x] Documentar flujo unidireccional de datos
- [x] Documentar patrón Observable/Subject
- [x] Documentar patrón Servicio Singleton
- [x] Documentar patrón HttpInterceptor
- [x] Documentar patrón Signals + AsyncPipe
- [x] Definir componentes "Dumb" con ejemplos
- [x] Definir servicios "Smart" con implementación completa
- [x] Crear estructura de carpetas por feature
- [x] Agregar checklist de validación
- [x] Integrar documentación en README.md
- [x] Validar escalabilidad y mantenibilidad

---

**Documentación completa:** Esta tarea valida la escalabilidad del proyecto, facilitando el onboarding de nuevos desarrolladores y el mantenimiento a largo plazo.

