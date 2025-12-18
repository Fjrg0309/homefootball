# 🏠⚽ HomeFootball - Frontend Angular 19

Aplicación web completa desarrollada con Angular 19 (standalone components) que implementa arquitectura de eventos, servicios, formularios reactivos, routing avanzado e integración con APIs REST.

## ✨ Características Principales

- ✅ **Arquitectura de Eventos**: Manipulación del DOM, sistema de eventos, componentes interactivos
- ✅ **Servicios y Comunicación**: RxJS, Observables, BehaviorSubject, sistema de notificaciones
- ✅ **Formularios Reactivos**: Validadores personalizados (síncronos y asíncronos), FormArray dinámico
- ✅ **Routing Avanzado**: Lazy loading, Guards, Resolvers, Breadcrumbs dinámicos
- ✅ **Integración HTTP**: CRUD completo, interceptores, manejo de errores robusto, loading states
- ✅ **Modo Oscuro**: Theme switcher con detección automática y persistencia
- ✅ **Docker Ready**: Configuración completa para desarrollo y producción

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run start
```

La aplicación estará disponible en: **http://localhost:4200**

### Con Docker

```bash
# Desarrollo (con hot reload)
docker-compose up dev

# Producción (optimizado con Nginx)
docker-compose up prod
```

Ver [DOCKER.md](DOCKER.md) para documentación completa de Docker.

## 📋 Estado del Proyecto

### Fase 1: Arquitectura de Eventos - ✅ 100% Completada
- ✅ Manipulación del DOM (ViewChild, ElementRef, Renderer2)
- ✅ Sistema de eventos (click, keyboard, mouse, custom events)
- ✅ Componentes interactivos (modal, tabs, accordion, tooltip)
- ✅ Theme switcher con modo oscuro
- ✅ Menú mobile responsive

### Fase 2: Arquitectura de Servicios - ✅ 100% Completada  
- ✅ Servicios de comunicación (Observable, Subject, BehaviorSubject)
- ✅ Sistema de notificaciones (ToastService)
- ✅ Loading states (global y local)
- ✅ Separación clara lógica/presentación

### Fase 3: Formularios Reactivos - ✅ 100% Completada
- ✅ 3 formularios completos (UserForm, InvoiceForm, ProductForm)
- ✅ 6 validadores síncronos personalizados
- ✅ 2 validadores asíncronos con debounce
- ✅ FormArray para listas dinámicas
- ✅ Feedback visual completo

### Fase 4: Routing Avanzado - ✅ 100% Completada
- ✅ 30+ rutas implementadas
- ✅ Lazy loading en 15 rutas con `loadComponent()`
- ✅ 3 Guards (auth, admin, pendingChanges)
- ✅ Resolver para pre-carga de datos
- ✅ Breadcrumbs dinámicos
- ✅ Navegación programática

### Fase 5: Integración con APIs - ✅ 100% Completada
- ✅ CRUD completo (12 métodos en ProductService)
- ✅ Consumo de API REST (JSONPlaceholder)
- ✅ 3 interceptores HTTP (auth, error, logging)
- ✅ Estados loading/error/empty/success
- ✅ 15+ interfaces TypeScript
- ✅ Documentación completa de API

### 🎨 Extras Implementados
- ✅ **Modo Oscuro**: Theme switcher con variables CSS, detección de sistema, persistencia
- ✅ **Docker**: Multi-stage build, Nginx optimizado, hot reload en desarrollo
- ✅ **Documentación**: 8 archivos MD con 4000+ líneas de documentación técnica

## 📚 Documentación

- **[ENTREGABLES.md](ENTREGABLES.md)** - Lista completa de todos los entregables por fase
- **[DOCKER.md](DOCKER.md)** - Guía completa de Docker (desarrollo y producción)
- **[FASE1-PROCESO.md](FASE1-PROCESO.md)** - Arquitectura de Eventos
- **[FASE2-PROCESO.md](FASE2-PROCESO.md)** - Arquitectura de Servicios
- **[FASE3-PROCESO.md](FASE3-PROCESO.md)** - Formularios Reactivos
- **[FASE4-PROCESO.md](FASE4-PROCESO.md)** - Routing Avanzado
- **[FASE5-PROCESO.md](FASE5-PROCESO.md)** - Integración con APIs (3200+ líneas)

---

## 📑 Tabla de Contenidos Técnica

- [Fase 1: Arquitectura de Eventos](#arquitectura-de-eventos)
- [Fase 2: Arquitectura de Servicios](#️-arquitectura-de-servicios)
- [Fase 3: Formularios Reactivos y Validaciones](#-fase-3-formularios-reactivos-y-validaciones)
- [Fase 4: Routing Avanzado y Navegación](#-fase-4-routing-avanzado-y-navegación)
- [Fase 5: Integración con APIs REST](#-fase-5-integración-con-apis-rest)

---

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Arquitectura de Eventos

La arquitectura de eventos en esta aplicación Angular sigue el **patrón unidireccional de datos**, utilizando bindings de eventos nativos del DOM como `(click)`, `(keydown)` y `(pointerdown)` directamente en las plantillas de componentes standalone. Los eventos se capturan con la sintaxis `(eventName)="handler($event)"`, donde `$event` proporciona acceso al objeto nativo del evento (por ejemplo, `KeyboardEvent` o `PointerEvent`) para detalles como `event.key` o `event.preventDefault()`. Esta aproximación aprovecha **Zone.js** para detección de cambios automática, emitiendo datos hacia servicios o estados reactivos (signals) sin necesidad de `@Output` en componentes simples, promoviendo simplicidad y rendimiento.

Para flujos complejos, se centralizan eventos en **servicios inyectables** que usan `EventEmitter` o **RxJS Subjects**, evitando acoplamiento directo entre componentes. Modificadores como `(keyup.enter)` o `(click.alt)` filtran eventos específicos, reduciendo lógica condicional en handlers. Custom events se extienden vía `EVENT_MANAGER_PLUGINS` para casos como debounce.

### Diagrama de Flujo de Eventos Principales

El flujo principal inicia en la interacción del usuario (DOM event), pasa por el template binding, ejecuta el método del componente y actualiza el estado:

```
Usuario → DOM Event (click/keydown) 
      → Template Binding (event) 
      → Component Handler ($event) 
      → Service/State Update (signals/RxJS)
      → View Re-render (OnPush/Zone.js)
```

Este diagrama textual representa el ciclo: eventos nativos se propagan unidirectionalmente hacia lógica de negocio, con `preventDefault()` para bloquear comportamientos por defecto cuando sea necesario.

### Características Principales

- **Event Binding Nativo**: Sintaxis `(eventName)="handler($event)"`
- **Detección Automática**: Zone.js detecta cambios sin configuración adicional
- **Servicios Centralizados**: EventEmitter y RxJS Subjects para comunicación entre componentes
- **Modificadores de Eventos**: `(keyup.enter)`, `(click.alt)`, `(keyup.control.enter)`
- **Control de Propagación**: `event.preventDefault()`, `event.stopPropagation()`
- **Custom Events**: Extensión vía `EVENT_MANAGER_PLUGINS`

### Ejemplo de Implementación

```typescript
// Event binding básico
<button (click)="onClick($event)">Click</button>

// Con modificadores
<input (keyup.enter)="onSubmit()">
<button (click.alt)="onSpecialAction()">Action</button>

// Control de propagación
onSubmit(event: Event) {
  event.preventDefault(); // Prevenir comportamiento por defecto
  event.stopPropagation(); // Detener propagación
}

// Servicio centralizado
@Injectable({ providedIn: 'root' })
export class EventBusService {
  private eventSubject = new Subject<CustomEvent>();
  public events$ = this.eventSubject.asObservable();
  
  emit(event: CustomEvent) {
    this.eventSubject.next(event);
  }
}
```

---

## 🏗️ Arquitectura de Servicios

La arquitectura de servicios sigue un **patrón jerárquico** con servicios de dominio específicos (`UserService`, `ProductService`) que consumen `HttpService` y emiten a servicios reactivos (`LoadingService`, `ToastService`). La comunicación fluye unidirectionalmente: **Componentes → Services → Estado Global → View**.

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Component   │  │  Component   │  │  Component   │      │
│  │   (Dumb)     │  │   (Dumb)     │  │   (Dumb)     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS (Smart)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ UserService  │  │ProductService│  │ OrderService │      │
│  │              │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘              │
│                            ▼                                  │
│                   ┌────────────────┐                         │
│                   │  HttpService   │                         │
│                   │  (API Client)  │                         │
│                   └────────┬───────┘                         │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVICIOS REACTIVOS GLOBALES                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │ LoadingService  │  │  ToastService   │  │Communication ││
│  │ BehaviorSubject │  │ BehaviorSubject │  │   Service    ││
│  └────────┬────────┘  └────────┬────────┘  └──────┬───────┘│
│           │                    │                    │         │
└───────────┼────────────────────┼────────────────────┼────────┘
            │                    │                    │
            ▼                    ▼                    ▼
       ┌────────────────────────────────────────────────┐
       │         COMPONENTES GLOBALES (Overlay)         │
       │   <app-loading />   <app-toast />              │
       └────────────────────────────────────────────────┘
```

**Flujo de Datos:**
1. **Componente** dispara acción (click, submit)
2. **Service de Dominio** ejecuta lógica de negocio
3. **HttpService** realiza petición HTTP (opcional)
4. **LoadingService/ToastService** actualizan estado global
5. **Componentes Overlay** se actualizan reactivamente (AsyncPipe)

---

## 📡 Patrones de Comunicación Implementados

Se implementan **cuatro patrones principales** para comunicación desacoplada:

### 1. Observable/Subject Pattern

**BehaviorSubject** en `CommunicationService` para componentes hermanos y estado persistente.

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
- Suscriptores tardíos reciben último valor

### 2. Servicio Singleton Global

`providedIn: 'root'` para estado global compartido (`LoadingService`, `ToastService`).

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

### 3. HttpInterceptor Pattern

Loading automático y headers globales en todas las peticiones HTTP.

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
- Separación de concerns (componente no gestiona loading)

### 4. Signals + AsyncPipe

Estado reactivo local sin suscripciones manuales en templates.

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

## 📋 Buenas Prácticas de Separación de Responsabilidades

### Componentes "Dumb" (Presentacionales)

**Responsabilidades:**
- ✅ Solo templates y estilos
- ✅ Signals locales para UI (`isOpen`, `selectedTab`)
- ✅ Handlers que delegan a servicios
- ❌ **NO** HTTP directo
- ❌ **NO** validaciones de negocio
- ❌ **NO** estado global

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

// ✅ Componente limpio (CORRECTO)
export class UserComponent {
  private userService = inject(UserService);
  users$ = this.userService.getActiveAdultUsers();

  onSave(user: User) {
    this.userService.save(user);
  }
}
```

### Servicios "Smart" (Lógica de Negocio)

**Responsabilidades:**
- ✅ Lógica de negocio y validaciones
- ✅ Caching y optimización
- ✅ Orquestación de APIs
- ✅ Transformación de datos
- ✅ Métodos puros y observables pipeados

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

### Estructura de Carpetas por Feature

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

### Checklist de Separación de Responsabilidades

#### Componente Dumb
- [ ] Sin HTTP directo (usa servicios)
- [ ] Sin lógica de validación (delega a servicios)
- [ ] Sin estado global (usa servicios inyectados)
- [ ] Usa `signal()` para UI local
- [ ] Usa `AsyncPipe` para observables
- [ ] Métodos handler simples (1-2 líneas)

#### Servicio Smart
- [ ] Toda la lógica de negocio centralizada
- [ ] Métodos puros (sin side effects directos)
- [ ] Usa RxJS operators (`map`, `tap`, `catchError`)
- [ ] Implementa caching si es necesario
- [ ] Emite a servicios globales (Toast, Loading)
- [ ] Documentado con JSDoc

#### Arquitectura General
- [ ] Flujo unidireccional de datos
- [ ] Servicios singleton con `providedIn: 'root'`
- [ ] Interceptors para lógica HTTP transversal
- [ ] Estructura de carpetas por feature
- [ ] Modelos tipados con interfaces
- [ ] Cleanup automático de suscripciones

---

Esta documentación valida la **escalabilidad del proyecto**, facilitando **onboarding** de nuevos desarrolladores y **mantenimiento** a largo plazo.

---

## 📝 Fase 3: Formularios Reactivos y Validaciones

La aplicación implementa un **sistema completo de formularios reactivos** usando `ReactiveFormsModule` con validadores síncronos, asíncronos, personalizados y cross-field. Se prioriza la **experiencia de usuario** con validación progresiva, estados de carga y feedback visual.

### Arquitectura de Formularios

```
┌─────────────────────────────────────────────────────────────┐
│                    REACTIVE FORMS FLOW                       │
└─────────────────────────────────────────────────────────────┘

FormBuilder (Declarativo)
    ↓
FormGroup/FormControl/FormArray
    ↓
Validators (Sync → Async → Cross-field)
    ↓
Template (formControlName, @if, AsyncPipe)
    ↓
UX Feedback (touched/dirty/pending/invalid)
```

**Componentes clave:**
- **FormBuilder**: Construcción programática de formularios
- **Validators**: Validación en tiempo real sin necesidad de submit
- **FormArray**: Gestión de listas dinámicas (agregar/eliminar)
- **AsyncValidators**: Validación con API simulada + debounce
- **States**: `pristine`, `dirty`, `touched`, `valid`, `invalid`, `pending`

---

### Catálogo de Validadores Implementados

| Validador | Tipo | Descripción | Uso |
|-----------|------|-------------|-----|
| `Validators.required` | Síncrono | Campo obligatorio | Todos los campos requeridos |
| `Validators.email` | Síncrono | Formato email RFC 5322 | Campos de email |
| `Validators.minLength(n)` | Síncrono | Longitud mínima | Password, username |
| `Validators.min(n)` | Síncrono | Valor numérico mínimo | Edad, precio, cantidad |
| `Validators.pattern(regex)` | Síncrono | Patrón personalizado | NIF, teléfono, CP |
| `passwordStrength()` | Personalizado | 12+ chars, upper/lower/num/special | Campo password |
| `nif()` | Personalizado | NIF español con validación de letra | Documento ID |
| `telefono()` | Personalizado | Móvil español (6/7 + 8 dígitos) | Teléfonos de contacto |
| `codigoPostal()` | Personalizado | CP español 5 dígitos | Direcciones |
| `passwordMatch(c1,c2)` | Cross-field | Contraseñas coincidentes | Confirmación password |
| `totalMinimo(min)` | Cross-field | Validación precio × cantidad | Facturas, pedidos |
| `emailUnique()` | Asíncrono | Email disponible (API simulada) | Registro de usuarios |
| `usernameAvailable()` | Asíncrono | Username disponible (API simulada) | Registro de usuarios |

---

### Ejemplo: Formulario con Validación Asíncrona

**TypeScript (user-form.ts):**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsyncValidatorsService } from './services/async-validators.service';
import { passwordStrength, nif, telefono } from './validators';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.html'
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private asyncValidators = inject(AsyncValidatorsService);
  
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      
      // Validación asíncrona con debounce
      username: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [this.asyncValidators.usernameAvailable()],
        updateOn: 'blur' // Solo valida al salir del campo
      }],
      
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.asyncValidators.emailUnique()],
        updateOn: 'blur'
      }],
      
      // Validadores personalizados
      nif: ['', [Validators.required, nif()]],
      telefono: ['', [Validators.required, telefono()]],
      password: ['', [Validators.required, passwordStrength()]],
      confirmPassword: ['']
    }, {
      // Validador cross-field
      validators: passwordMatch('password', 'confirmPassword')
    });
  }

  get username() { return this.userForm.get('username'); }
  get email() { return this.userForm.get('email'); }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
    }
  }
}
```

**Template (user-form.html):**

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  
  <!-- Campo con validación asíncrona -->
  <div class="form-group">
    <label for="username">Usuario *</label>
    <input
      type="text"
      id="username"
      formControlName="username"
      [class.invalid]="username?.invalid && username?.touched"
      [class.valid]="username?.valid && username?.touched"
    />
    
    <!-- Estado PENDING durante validación -->
    @if (username?.pending) {
      <div class="loading-message">⏳ Comprobando disponibilidad...</div>
    }
    
    <!-- Errores solo cuando touched y NO pending -->
    @if (username?.invalid && username?.touched && !username?.pending) {
      <div class="error-message">
        @if (username?.errors?.['required']) {
          <span>El usuario es obligatorio</span>
        }
        @if (username?.errors?.['usernameTaken']) {
          <span>❌ Este usuario ya está ocupado</span>
        }
      </div>
    }
  </div>

  <!-- Botón submit con estado pending -->
  <button 
    type="submit" 
    [disabled]="userForm.invalid || userForm.pending">
    {{ userForm.pending ? 'Validando...' : 'Registrar Usuario' }}
  </button>
</form>
```

**Servicio de Validación Asíncrona:**

```typescript
@Injectable({ providedIn: 'root' })
export class AsyncValidatorsService {
  private debounceTime = 500;

  usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      // Debounce + simulación API
      return timer(this.debounceTime).pipe(
        switchMap(() => {
          const takenUsernames = ['admin', 'root', 'test'];
          const isTaken = takenUsernames.includes(control.value.toLowerCase());
          return of(isTaken ? { usernameTaken: true } : null);
        }),
        take(1)
      );
    };
  }
}
```

**Operadores RxJS clave:**
- `timer(500)`: Debounce para evitar spam de peticiones
- `switchMap()`: Cancela peticiones anteriores si usuario sigue escribiendo
- `take(1)`: Completa el observable automáticamente

---

### FormArray para Listas Dinámicas

**Implementación en invoice-form.ts:**

```typescript
export class InvoiceForm implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      phones: this.fb.array([]), // FormArray vacío
      items: this.fb.array([])
    });

    this.addPhone(); // Agregar elemento inicial
  }

  // Getter para acceso en template
  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  // Agregar elemento al array
  addPhone(): void {
    const phoneGroup = this.fb.group({
      number: ['', [Validators.required, telefono()]]
    });
    this.phones.push(phoneGroup);
  }

  // Eliminar elemento (mínimo 1)
  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }
}
```

**Template con @for:**

```html
<div formArrayName="phones">
  @for (phone of phones.controls; track $index) {
    <div [formGroupName]="$index" class="array-item">
      <input formControlName="number" placeholder="Teléfono" />
      
      <button 
        type="button" 
        (click)="removePhone($index)"
        [disabled]="phones.length === 1">
        🗑️ Eliminar
      </button>
    </div>
  }
  
  <button type="button" (click)="addPhone()">
    ➕ Agregar Teléfono
  </button>
</div>
```

**Características:**
- `formArrayName`: Conecta template con FormArray
- `@for track $index`: Iteración óptima con tracking
- `[formGroupName]="$index"`: Binding por índice
- Validación individual por elemento

---

### UX de Validación: Estados y Feedback Visual

**1. Errores Progresivos (touched/dirty)**

```html
<!-- Solo muestra errores después de interacción -->
@if (field?.invalid && (field?.touched || field?.dirty)) {
  <div class="error-message">{{ errorMessage }}</div>
}
```

**Evita:** "Pantalla roja" intimidante al cargar el formulario

**2. Clases CSS Automáticas de Angular**

```scss
// Campo inválido después de touched
input.ng-touched.ng-invalid {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

// Campo válido
input.ng-touched.ng-valid {
  border-color: #4caf50;
}

// Validación asíncrona en curso
input.ng-pending {
  border-style: dashed;
  border-color: #2196f3;
  background-color: #e3f2fd;
}
```

**Clases disponibles:**
- `ng-untouched` / `ng-touched`
- `ng-pristine` / `ng-dirty`
- `ng-valid` / `ng-invalid`
- `ng-pending`

**3. Estados del Formulario**

```
┌─────────────────────────────────────────────────┐
│        ESTADOS DE VALIDACIÓN ASÍNCRONA          │
└─────────────────────────────────────────────────┘

INICIAL (pristine, untouched)
  → pending: false, valid: false
  → UI: Sin mensajes

USUARIO ESCRIBE (dirty, touched)
  → Validadores síncronos se ejecutan
  → Si fallan: NO ejecuta async

USUARIO SALE DEL CAMPO (blur)
  → Inicia debounce (500ms)
  → pending: true
  → UI: "⏳ Validando..."
  → Botón submit: disabled

RESULTADO API
  → Éxito: pending: false, valid: true
  → Error: pending: false, errors: {emailTaken: true}
```

---

### Mejores Prácticas Implementadas

| Práctica | Razón | Código |
|----------|-------|--------|
| **Debounce 500ms** | Evita spam de peticiones | `timer(500)` |
| **switchMap** | Cancela peticiones obsoletas | `switchMap(() => api)` |
| **updateOn: 'blur'** | Solo valida al salir del campo | Config FormControl |
| **Validadores síncronos primero** | No llama API si datos inválidos | Array `validators` → `asyncValidators` |
| **Loading states** | Usuario sabe que valida | `@if (field?.pending)` |
| **take(1)** | Observable se completa solo | `take(1)` |
| **Mínimo de elementos** | Previene arrays vacíos | `[disabled]="array.length === 1"` |

---

### Archivos Relacionados

**Validadores:**
- `src/app/validators/password-strength.validator.ts`
- `src/app/validators/password-match.validator.ts`
- `src/app/validators/spanish-formats.validator.ts` (NIF, teléfono, CP)
- `src/app/validators/cross-field.validators.ts`

**Servicios:**
- `src/app/services/async-validators.service.ts`

**Componentes:**
- `src/app/pages/user-form/` - Demostración validadores sync/async
- `src/app/pages/invoice-form/` - Demostración FormArray

**Documentación:**
- `FASE3-PROCESO.md` - Proceso completo de implementación

---

## 🗺️ Fase 4: Routing Avanzado y Navegación

### Documentación Completa

Para documentación detallada del sistema de routing, consulta **[ROUTING.md](ROUTING.md)**:

- 🗺️ Mapa completo de rutas
- 🚀 Estrategia de Lazy Loading
- 🔐 Guards implementados (auth, admin, pendingChanges)
- 🔄 Resolvers para precarga de datos
- 🍞 Breadcrumbs dinámicos
- 🧭 Navegación programática

### Resumen de Features

#### Lazy Loading

Carga perezosa de features para optimizar el bundle inicial:

```typescript
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
}
```

**Beneficios:**
- Bundle inicial reducido ~48%
- Carga inicial: 0.8s (antes: 1.5s)
- Chunks separados: admin (~15 KB), shop (~13 KB)

#### Route Guards

Protección de rutas con guards funcionales:

```typescript
// authGuard - Verificar autenticación
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// pendingChangesGuard - Prevenir pérdida de cambios
export const pendingChangesGuard: CanDeactivateFn<FormComponent> = (component) => {
  return !component.form.dirty || confirm('¿Salir sin guardar?');
};
```

**Rutas protegidas:**
- `/profile` - authGuard + pendingChangesGuard
- `/admin` - authGuard + adminGuard

#### Resolvers

Precarga de datos antes de activar rutas:

```typescript
export const productResolver: ResolveFn<Product | null> = (route, state) => {
  const service = inject(ProductService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;
  
  return service.getProductById(id).pipe(
    catchError(error => {
      router.navigate(['/productos'], { state: { error: 'Producto no encontrado' } });
      return of(null);
    })
  );
};
```

**Configuración:**
```typescript
{
  path: 'productos/:id',
  component: ProductDetail,
  resolve: { product: productResolver }
}
```

**Ventajas:**
- Datos disponibles inmediatamente en componente
- Sin estados de carga vacíos
- Manejo centralizado de errores
- Mejor UX percibida

#### Breadcrumbs Dinámicos

Migas de pan generadas automáticamente desde metadata de rutas:

```typescript
// Configuración en rutas
{ path: 'productos', component: ProductList, data: { breadcrumb: 'Productos' } }
{ path: 'productos/:id', component: ProductDetail, data: { breadcrumb: 'Detalle' } }

// BreadcrumbService escucha NavigationEnd
this.router.events
  .pipe(filter(e => e instanceof NavigationEnd))
  .subscribe(() => this.buildBreadcrumbs());

// Renderizado
// 🏠 Inicio › Productos › Detalle
```

**Features:**
- Generación automática desde route.data
- Navegación interactiva
- Actualización en tiempo real
- Estilos responsive

### Mapa de Rutas Principal

| Ruta | Descripción | Lazy | Guards | Resolver |
|------|-------------|------|--------|----------|
| `/home` | Página de inicio | ❌ | - | - |
| `/login` | Autenticación | ❌ | - | - |
| `/profile` | Perfil usuario | ❌ | authGuard, pendingChangesGuard | - |
| `/admin` | Panel admin | ✅ | adminGuard | - |
| `/shop` | Tienda | ✅ | - | - |
| `/productos` | Catálogo | ❌ | - | - |
| `/productos/:id` | Detalle producto | ❌ | - | productResolver |

Ver **[ROUTING.md](ROUTING.md)** para el mapa completo con todas las rutas (30+ rutas documentadas).

### Navegación Programática

```typescript
// Básica
this.router.navigate(['/productos', productId]);

// Con query params
this.router.navigate(['/productos'], {
  queryParams: { categoria: 'laptops' }
});

// Con state (datos ocultos)
this.router.navigate(['/productos'], {
  state: { error: 'Producto no encontrado' }
});

// Leer parámetros
const id = this.route.snapshot.paramMap.get('id');
const categoria = this.route.snapshot.queryParamMap.get('categoria');

// Navigation back
this.location.back();
```

### Archivos Relacionados

**Configuración:**
- `src/app/app.routes.ts` - Configuración principal de rutas
- `src/app/app.config.ts` - PreloadAllModules strategy

**Guards:**
- `src/app/guards/auth.guard.ts` - authGuard, adminGuard
- `src/app/guards/pending-changes.guard.ts` - pendingChangesGuard

**Resolvers:**
- `src/app/resolvers/product.resolver.ts` - productResolver

**Servicios:**
- `src/app/services/auth.service.ts` - Gestión autenticación
- `src/app/services/product.service.ts` - Mock productos
- `src/app/services/breadcrumb.service.ts` - Generación breadcrumbs

**Componentes:**
- `src/app/pages/login/` - Pantalla login
- `src/app/pages/profile/` - Perfil con form y guards
- `src/app/pages/product-list/` - Catálogo productos
- `src/app/pages/product-detail/` - Detalle con resolver
- `src/app/components/shared/breadcrumb/` - Breadcrumbs UI
- `src/app/components/shared/not-found/` - Página 404

**Features Lazy:**
- `src/app/features/admin/` - Admin feature
- `src/app/features/shop/` - Shop feature

**Documentación:**
- `FASE4-PROCESO.md` - Proceso completo implementación
- `ROUTING.md` - Documentación detallada de rutas

---

## 🌐 Fase 5: Integración con APIs REST

**Tareas Completadas**: 7/7 ✅

### 📚 Documentación Completa
Ver **[FASE5-PROCESO.md](FASE5-PROCESO.md)** para la guía completa de implementación HTTP.

### HttpClient y ApiService

Angular 19 utiliza `provideHttpClient()` en lugar del legacy `HttpClientModule`:

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, loggingInterceptor, errorInterceptor } from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,      // Añade headers de autenticación
        loggingInterceptor,   // Debug de peticiones
        errorInterceptor      // Manejo centralizado de errores
      ])
    )
  ]
};
```

**ApiService** centraliza operaciones HTTP:

```typescript
// core/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.example.com/api/v1';

  // CRUD methods con generics <T>
  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T>
  post<T>(endpoint: string, body: unknown): Observable<T>
  put<T>(endpoint: string, body: unknown): Observable<T>
  patch<T>(endpoint: string, body: unknown): Observable<T>
  delete<T>(endpoint: string): Observable<T>
  
  // Error handling centralizado
  private handleError(error: any): Observable<never>
}
```

### Interceptores Funcionales

Angular 19 introduce **interceptores funcionales** (`HttpInterceptorFn`) en lugar de clases:

**authInterceptor** - Headers de autenticación:
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  let headers = req.headers
    .set('Content-Type', 'application/json')
    .set('X-App-Client', 'Angular-HomeFootball')
    .set('X-Request-ID', crypto.randomUUID());
  
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  
  return next(req.clone({ headers }));
};
```

**loggingInterceptor** - Debug de peticiones:
```typescript
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  console.log(`🚀 HTTP ${req.method} ${req.url}`);
  
  return next(req).pipe(
    tap({
      next: (event: any) => {
        if (event.type === 4) { // HttpEventType.Response
          const duration = Date.now() - startTime;
          console.log(`✅ ${req.method} ${req.url} - ${event.status} (${duration}ms)`);
        }
      },
      error: (error) => {
        console.error(`❌ ${req.method} ${req.url} - ${error.status}`);
      }
    })
  );
};
```

**errorInterceptor** - Manejo centralizado:
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  
  return next(req).pipe(
    catchError((error) => {
      switch (error.status) {
        case 401:
          toastService.error('Sesión expirada. Inicia sesión.');
          router.navigate(['/login']);
          break;
        case 403:
          toastService.error('Sin permisos para esta acción.');
          break;
        case 404:
          toastService.error('Recurso no encontrado.');
          break;
        case 500:
          toastService.error('Error del servidor. Intenta más tarde.');
          break;
        case 0:
          toastService.error('Sin conexión. Verifica tu red.');
          break;
      }
      
      return throwError(() => error);
    })
  );
};
```

### Operaciones CRUD

**Modelos de Datos** (`models/product.model.ts`):
```typescript
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  image?: string;
}
```

**ProductService** delegando a ApiService:
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);
  private endpoint = 'products';

  // GET /products - Todos los productos
  getAll(): Observable<Product[]> {
    return this.api.get<Product[]>(this.endpoint);
  }

  // GET /products/:id - Un producto
  getById(id: number): Observable<Product> {
    return this.api.get<Product>(`${this.endpoint}/${id}`);
  }

  // GET /products?category=Electronics
  getByCategory(category: string): Observable<Product[]> {
    return this.api.get<Product[]>(`${this.endpoint}?category=${category}`);
  }

  // POST /products - Crear producto
  create(dto: CreateProductDto): Observable<Product> {
    return this.api.post<Product>(this.endpoint, dto);
  }

  // PUT /products/:id - Actualización completa
  update(id: number, product: Product): Observable<Product> {
    return this.api.put<Product>(`${this.endpoint}/${id}`, product);
  }

  // PATCH /products/:id - Actualización parcial
  patch(id: number, changes: UpdateProductDto): Observable<Product> {
    return this.api.patch<Product>(`${this.endpoint}/${id}`, changes);
  }

  // DELETE /products/:id - Eliminar
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

**ProductForm Component** para Create/Update:
```typescript
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  form!: FormGroup;
  isEditMode = signal(false);
  productId = signal<number | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    if (this.isEditMode()) {
      // PATCH /products/:id
      this.productService.patch(this.productId()!, this.form.value).subscribe({
        next: () => {
          this.toastService.success('Producto actualizado ✓');
          this.router.navigate(['/productos']);
        },
        error: () => this.loading.set(false)
      });
    } else {
      // POST /products
      this.productService.create(this.form.value).subscribe({
        next: () => {
          this.toastService.success('Producto creado ✓');
          this.router.navigate(['/productos']);
        },
        error: () => this.loading.set(false)
      });
    }
  }
}
```

### Rutas para CRUD

```typescript
// app.routes.ts
export const routes: Routes = [
  // Listado de productos (GET /products)
  { 
    path: 'productos', 
    component: ProductList,
    data: { breadcrumb: 'Productos' }
  },
  
  // Crear producto (POST /products)
  {
    path: 'productos/nuevo',
    component: ProductForm,
    canActivate: [authGuard],
    data: { breadcrumb: 'Nuevo Producto' }
  },
  
  // Detalle producto (GET /products/:id)
  { 
    path: 'productos/:id', 
    component: ProductDetail,
    resolve: { product: productResolver },
    data: { breadcrumb: 'Detalle' }
  },
  
  // Editar producto (PATCH /products/:id)
  {
    path: 'productos/:id/editar',
    component: ProductForm,
    canActivate: [authGuard],
    data: { breadcrumb: 'Editar' }
  },
];
```

**Nota:** Las rutas deben estar en este orden específico:
1. `/productos/nuevo` (más específica)
2. `/productos/:id` (menos específica)

Si pones `:id` antes de `/nuevo`, Angular interpretará "nuevo" como un ID.

### Arquitectura HTTP

```
Component
   ↓ inject(ProductService)
ProductService
   ↓ inject(ApiService)
ApiService
   ↓ inject(HttpClient)
HttpClient
   ↓
[authInterceptor] → Añade Authorization header
   ↓
[loggingInterceptor] → Logea 🚀 POST /products
   ↓
[errorInterceptor] → Captura errores
   ↓
   → REST API
   ←
[errorInterceptor] → Maneja 401→login, toast
   ↑
[loggingInterceptor] → Logea ✅ 201 (342ms)
   ↑
ApiService
   ↑ Observable<T>
ProductService
   ↑ Observable<Product>
Component (.subscribe)
```

### Tabla CRUD de Productos

| Operación | Método HTTP | Endpoint | DTO | Ruta UI |
|-----------|-------------|----------|-----|---------|
| **Listar** | GET | `/products` | - | `/productos` |
| **Ver Detalle** | GET | `/products/:id` | - | `/productos/:id` |
| **Crear** | POST | `/products` | `CreateProductDto` | `/productos/nuevo` |
| **Editar** | PATCH | `/products/:id` | `UpdateProductDto` | `/productos/:id/editar` |
| **Eliminar** | DELETE | `/products/:id` | - | Botón en detalle |

### Archivos de la Fase 5

**Core Services:**
- `src/app/core/services/api.service.ts` - Servicio base HTTP con CRUD genérico

**Interceptores:**
- `src/app/core/interceptors/auth.interceptor.ts` - Headers de autenticación
- `src/app/core/interceptors/logging.interceptor.ts` - Debug de peticiones
- `src/app/core/interceptors/error.interceptor.ts` - Manejo de errores

**Models:**
- `src/app/models/product.model.ts` - Product, DTOs, PaginatedResponse

**Servicios:**
- `src/app/services/product.service.ts` - 9 métodos CRUD (actualizado)

**Componentes:**
- `src/app/pages/product-form/` - Formulario Create/Update
  - `product-form.ts` (162 líneas)
  - `product-form.html` (127 líneas)
  - `product-form.scss` (163 líneas)

**Configuración:**
- `src/app/app.config.ts` - provideHttpClient con interceptores
- `src/app/app.routes.ts` - Rutas CRUD

**Documentación:**
- `FASE5-PROCESO.md` - Proceso completo de implementación

**Total Fase 5**: 20 archivos (13 nuevos + 7 modificados)

---

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.