# Fase 1: Proceso de Implementación

## Resumen Ejecutivo
La Fase 1 consistió en implementar 5 tareas funcionales en Angular para dominar manipulación del DOM, sistema de eventos, componentes interactivos, sistema de temas y documentación técnica.

---

## Tarea 1: Manipulación del DOM

### Objetivo
Implementar ejemplos de manipulación del DOM usando ViewChild, ElementRef y Renderer2 de forma segura y compatible con SSR.

### Pasos Implementados

#### 1. Creación del Componente
```bash
# Estructura creada manualmente (standalone component)
src/app/pages/dom-manipulation/
├── dom-manipulation.ts
├── dom-manipulation.html
└── dom-manipulation.scss
```

#### 2. Implementación de ViewChild y ElementRef
**Archivo:** `dom-manipulation.ts`

- Importé `ViewChild`, `ElementRef`, `Renderer2` desde `@angular/core`
- Declaré referencias a elementos del DOM:
  ```typescript
  @ViewChild('targetBox') targetBox!: ElementRef;
  @ViewChild('targetText') targetText!: ElementRef;
  @ViewChild('dynamicContainer') dynamicContainer!: ElementRef;
  ```

#### 3. Métodos de Manipulación Implementados

**Modificación de Estilos:**
```typescript
changeColor() {
  this.renderer.setStyle(this.targetBox.nativeElement, 'background', '#4CAF50');
}
```

**Modificación de Propiedades:**
```typescript
changeText() {
  this.renderer.setProperty(this.targetText.nativeElement, 'textContent', '¡Texto modificado!');
}
```

**Creación Dinámica de Elementos:**
```typescript
addElement() {
  const newElement = this.renderer.createElement('div');
  this.renderer.addClass(newElement, 'dynamic-element');
  this.renderer.setProperty(newElement, 'textContent', `Elemento #${this.elementCounter}`);
  this.renderer.appendChild(this.dynamicContainer.nativeElement, newElement);
}
```

**Eliminación de Elementos:**
```typescript
removeElement() {
  const container = this.dynamicContainer.nativeElement;
  if (container.lastChild) {
    this.renderer.removeChild(container, container.lastChild);
  }
}
```

#### 4. Template HTML
- Sección 1: Acceso a elementos con `#targetBox` y `#targetText`
- Sección 2: Modificación de estilos y propiedades con botones
- Sección 3: Creación/eliminación dinámica de elementos con `#dynamicContainer`

#### 5. Estilos SCSS
- Importación de variables: `@use '../../../../styles/00-settings/variables' as *;`
- Grid layout responsive
- Animaciones para elementos dinámicos (fadeIn)
- Estados hover y active en botones

#### 6. Registro de Ruta
**Archivo:** `app.routes.ts`
```typescript
{ path: 'dom-manipulation', component: DomManipulation }
```

### Resultado
Manipulación segura del DOM con Renderer2  
Ejemplos visuales interactivos  
Compatible con SSR  

---

## Tarea 2: Sistema de Eventos

### Objetivo
Implementar un sistema completo de eventos de Angular con todos los tipos de eventos, modificadores y control de propagación.

### Pasos Implementados

#### 1. Creación del Componente
```
src/app/pages/event-system/
├── event-system.ts
├── event-system.html
└── event-system.scss
```

#### 2. Estado del Componente
**Archivo:** `event-system.ts`

```typescript
export class EventSystem {
  clickCount = 0;
  lastKey = '';
  mouseX = 0;
  mouseY = 0;
  focusCount = 0;
  eventLog: string[] = [];
}
```

#### 3. Handlers de Eventos Implementados

**Eventos de Click:**
```typescript
onClick() {
  this.clickCount++;
  this.addLog('Click básico detectado');
}
```

**Eventos de Teclado:**
```typescript
onKeyUp(event: KeyboardEvent) {
  this.lastKey = event.key;
  this.addLog(`Tecla presionada: ${event.key}`);
}

onEnterKey() {
  this.addLog('Enter presionado');
}

onCtrlEnter() {
  this.addLog('Ctrl + Enter presionado');
}
```

**Eventos de Mouse:**
```typescript
onMouseMove(event: MouseEvent) {
  this.mouseX = event.clientX;
  this.mouseY = event.clientY;
}
```

**Control de Propagación:**
```typescript
onParentClick() {
  this.addLog('Click en padre');
}

onChildClick(event: MouseEvent) {
  event.stopPropagation();
  this.addLog('Click en hijo (propagación detenida)');
}

onPreventDefault(event: Event) {
  event.preventDefault();
  this.addLog('Comportamiento por defecto prevenido');
}
```

#### 4. Bindings en Template
- `(click)="onClick()"` - Click básico
- `(keyup)="onKeyUp($event)"` - Teclado con acceso al evento
- `(keyup.enter)="onEnterKey()"` - Modificador Enter
- `(keyup.control.enter)="onCtrlEnter()"` - Modificador Ctrl+Enter
- `(mousemove)="onMouseMove($event)"` - Movimiento del mouse
- `(focus)="onFocus()"` y `(blur)="onBlur()"` - Focus/Blur
- `(click.stop)` - Detener propagación

#### 5. Console de Eventos
Implementé un log visual que muestra todos los eventos en tiempo real:
```html
<div class="event-console">
  @for (log of eventLog; track $index) {
    <div class="log-entry">{{ log }}</div>
  }
</div>
```

#### 6. Correcciones de Errores
- **Problema:** Errores de tipo con `KeyboardEvent` vs `Event`
- **Solución:** Eliminé parámetros `$event` innecesarios en handlers
- **Problema:** Sintaxis `{{ '{' }}` causaba errores de template
- **Solución:** Usé HTML entities `&#123;` y `&#125;`

### Resultado
Sistema de eventos completo  
Modificadores de teclado funcionando  
Control de propagación implementado  
Console de eventos en tiempo real  

---

## Tarea 3: Componentes Interactivos

### Objetivo
Crear componentes interactivos funcionales: menú hamburguesa, modal, tabs y tooltips.

### Pasos Implementados

#### 1. Creación del Componente
```
src/app/pages/interactive-components/
├── interactive-components.ts
├── interactive-components.html
└── interactive-components.scss
```

#### 2. Estado del Componente
```typescript
export class InteractiveComponents implements OnDestroy {
  menuOpen = false;
  modalOpen = false;
  activeTab = signal<number>(0);
  tooltipVisible: { [key: string]: boolean } = {};
}
```

#### 3. Menú Hamburguesa con Click-Outside

**Método Toggle:**
```typescript
toggleMenu() {
  this.menuOpen = !this.menuOpen;
}
```

**@HostListener para Click-Outside:**
```typescript
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.hamburger-menu') && this.menuOpen) {
    this.menuOpen = false;
  }
}
```

#### 4. Modal con Cierre ESC

**Apertura/Cierre:**
```typescript
openModal() {
  this.modalOpen = true;
}

closeModal() {
  this.modalOpen = false;
}
```

**ESC para Cerrar:**
```typescript
@HostListener('document:keydown.escape')
onEscapeKey() {
  if (this.modalOpen) {
    this.closeModal();
  }
}
```

**Template con Backdrop:**
```html
@if (modalOpen) {
  <div class="modal-backdrop" (click)="closeModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <!-- Contenido del modal -->
    </div>
  </div>
}
```

#### 5. Sistema de Tabs con Signals

**Signal para Tab Activo:**
```typescript
activeTab = signal<number>(0);
```

**Método para Cambiar Tab:**
```typescript
setActiveTab(index: number) {
  this.activeTab.set(index);
}
```

**Template con @if:**
```html
<div class="tabs-buttons">
  <button (click)="setActiveTab(0)" [class.active]="activeTab() === 0">Tab 1</button>
  <button (click)="setActiveTab(1)" [class.active]="activeTab() === 1">Tab 2</button>
</div>

<div class="tabs-content">
  @if (activeTab() === 0) {
    <div>Contenido Tab 1</div>
  } @else if (activeTab() === 1) {
    <div>Contenido Tab 2</div>
  }
</div>
```

#### 6. Tooltips con Múltiples Posiciones

**Método Toggle:**
```typescript
toggleTooltip(id: string) {
  this.tooltipVisible[id] = !this.tooltipVisible[id];
}
```

**Template con Diferentes Posiciones:**
```html
<div class="tooltip-container">
  <button (mouseenter)="toggleTooltip('top')" (mouseleave)="toggleTooltip('top')">
    Hover me
  </button>
  @if (tooltipVisible['top']) {
    <div class="tooltip tooltip-top">Tooltip arriba</div>
  }
</div>
```

#### 7. Limpieza con OnDestroy
```typescript
ngOnDestroy() {
  this.menuOpen = false;
  this.modalOpen = false;
}
```

### Resultado
Menú hamburguesa con click-outside automático  
Modal con cierre ESC y backdrop  
Tabs con signals reactivos  
Tooltips con 4 posiciones  

---

## Tarea 4: Theme Switcher

### Objetivo
Implementar un sistema completo de temas con detección del sistema, persistencia y toggle automático.

### Pasos Implementados

#### 1. Creación del Servicio de Temas
**Archivo:** `src/app/services/theme.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  
  currentTheme = signal<Theme>('light');
}
```

#### 2. Detección de Preferencia del Sistema
```typescript
detectSystemPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
```

#### 3. Inicialización del Tema
```typescript
initializeTheme(): void {
  const storedTheme = this.getStoredTheme();
  
  if (storedTheme) {
    this.setTheme(storedTheme);
  } else {
    const prefersDark = this.detectSystemPreference();
    this.setTheme(prefersDark ? 'dark' : 'light');
  }
}
```

#### 4. Persistencia en localStorage
```typescript
private getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : null;
}

private storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
}
```

#### 5. Aplicación del Tema al DOM
```typescript
private applyThemeToDOM(theme: Theme): void {
  const htmlElement = this.document.documentElement;
  
  if (theme === 'dark') {
    this.renderer.addClass(htmlElement, 'theme-dark');
    this.renderer.removeClass(htmlElement, 'theme-light');
  } else {
    this.renderer.addClass(htmlElement, 'theme-light');
    this.renderer.removeClass(htmlElement, 'theme-dark');
  }
}
```

#### 6. Toggle entre Temas
```typescript
toggleTheme(): void {
  const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
  this.setTheme(newTheme);
}
```

#### 7. Escucha de Cambios del Sistema
```typescript
listenToSystemPreference(): void {
  if (typeof window === 'undefined') return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!this.getStoredTheme()) {
      this.setTheme(e.matches ? 'dark' : 'light');
    }
  });
}
```

#### 8. Creación del Componente Theme Switcher
**Archivo:** `src/app/pages/theme-switcher/theme-switcher.ts`

```typescript
export class ThemeSwitcher implements OnInit {
  themeService = inject(ThemeService);
  systemPreference: 'light' | 'dark' = 'light';
  hasStoredTheme = false;

  ngOnInit() {
    this.systemPreference = this.themeService.detectSystemPreference() ? 'dark' : 'light';
    this.hasStoredTheme = localStorage.getItem('theme') !== null;
    this.themeService.listenToSystemPreference();
  }
}
```

#### 9. Variables CSS para Temas
**Archivo:** `src/styles/themes.scss`

```scss
.theme-light {
  --bg-primary: #ffffff;
  --text-primary: #333333;
  --border-color: #e0e0e0;
  --shadow: rgba(0, 0, 0, 0.1);
}

.theme-dark {
  --bg-primary: #1e1e1e;
  --text-primary: #ffffff;
  --border-color: #404040;
  --shadow: rgba(0, 0, 0, 0.3);
}

@media (prefers-color-scheme: dark) {
  :root:not(.theme-light) {
    --bg-primary: #1e1e1e;
    --text-primary: #ffffff;
  }
}
```

#### 10. Integración en App
**Archivo:** `src/app/app.ts`

```typescript
export class App implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.initializeTheme();
    this.themeService.listenToSystemPreference();
  }
}
```

#### 11. Importación de Estilos
**Archivo:** `src/styles/main.scss`
```scss
@use 'themes';
```

### Resultado
Detección automática de preferencia del sistema  
Persistencia en localStorage  
Toggle manual entre temas  
Variables CSS reactivas  
Escucha de cambios del sistema en tiempo real  
SSR-safe con verificaciones de window  

---

## Tarea 5: Documentación

### Objetivo
Crear documentación técnica explicando la arquitectura de eventos y el flujo de datos.

### Pasos Implementados

#### 1. Sección en README.md
**Archivo:** `README.md`

**Contenido Agregado:**

1. **Arquitectura de Eventos:**
   - Explicación del patrón unidireccional de datos
   - Event binding nativo con sintaxis `(eventName)="handler($event)"`
   - Uso de Zone.js para detección automática
   - Servicios centralizados con RxJS Subjects
   - Modificadores de eventos
   - Custom events vía EVENT_MANAGER_PLUGINS

2. **Diagrama de Flujo de Eventos Principales:**
```
Usuario → DOM Event (click/keydown) 
      → Template Binding (event) 
      → Component Handler ($event) 
      → Service/State Update (signals/RxJS)
      → View Re-render (OnPush/Zone.js)
```

3. **Características Principales:**
   - Event Binding Nativo
   - Detección Automática
   - Servicios Centralizados
   - Modificadores de Eventos
   - Control de Propagación
   - Custom Events

4. **Ejemplos de Implementación:**
   - Event binding básico
   - Uso de modificadores
   - Control de propagación con preventDefault() y stopPropagation()
   - Servicio centralizado con RxJS Subject

### Resultado
Documentación técnica completa en README.md  
Diagrama de flujo de eventos  
Ejemplos de código  
Explicación de arquitectura  

---

## Página de Inicio

### Implementación

#### 1. Creación del Componente Home
**Archivo:** `src/app/pages/home/home.ts`

```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
}

export class Home {
  tasks: Task[] = [
    { id: 1, title: 'Tarea 1: Manipulación del DOM', ... },
    { id: 2, title: 'Tarea 2: Sistema de Eventos', ... },
    { id: 3, title: 'Tarea 3: Componentes Interactivos', ... },
    { id: 4, title: 'Tarea 4: Theme Switcher', ... }
  ];
}
```

#### 2. Template con Tarjetas
- Hero section con título y subtítulo
- Grid de tarjetas con `@for`
- RouterLink para navegación
- Sección informativa con objetivos, tecnologías y características

### Resultado
Página de inicio con navegación  
Tarjetas para cada tarea  
Diseño responsive  

---

## Configuración y Correcciones

### Rutas Configuradas
**Archivo:** `app.routes.ts`

```typescript
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'dom-manipulation', component: DomManipulation },
  { path: 'event-system', component: EventSystem },
  { path: 'interactive-components', component: InteractiveComponents },
  { path: 'theme-switcher', component: ThemeSwitcher }
];
```

### Errores Corregidos Durante la Implementación

1. **SCSS Import Paths:**
   - Error: `@use '../../../styles/00-settings/variables'`
   - Corrección: `@use '../../../../styles/00-settings/variables'`

2. **TypeScript Type Errors:**
   - Error: KeyboardEvent incompatible con Event
   - Corrección: Eliminé parámetros $event innecesarios

3. **Angular Template Syntax:**
   - Error: `{{ '{' }}` causaba "Unclosed block @if"
   - Corrección: Usé HTML entities `&#123;` y `&#125;`
   - Error: `@if` en texto causaba "Incomplete block"
   - Corrección: Usé `&#64;if`

4. **Componente Innecesario:**
   - Eliminé carpeta `documentation/` (componente extra no solicitado)
   - La documentación solo debía estar en README.md

---

## Estructura Final del Proyecto

```
src/app/
├── pages/
│   ├── home/
│   ├── dom-manipulation/
│   ├── event-system/
│   ├── interactive-components/
│   └── theme-switcher/
├── services/
│   └── theme.service.ts
├── app.routes.ts
└── app.ts

src/styles/
├── themes.scss
└── main.scss (importa themes)

README.md (con documentación técnica)
```

---

## Verificación Final

- **Compilación:** Sin errores
- **Rutas:** Todas funcionando
- **Temas:** Toggle y persistencia funcionando
- **Eventos:** Todos los tipos implementados
- **Interactividad:** Componentes funcionando
- **Documentación:** README.md completo

---

## Conocimientos Aplicados

1. **Angular Standalone Components**
2. **Signals para Estado Reactivo**
3. **Renderer2 para Manipulación Segura del DOM**
4. **ViewChild y ElementRef**
5. **Event Binding con Modificadores**
6. **@HostListener para Eventos Globales**
7. **RxJS BehaviorSubject (en preparación para Fase 2)**
8. **localStorage API**
9. **window.matchMedia para Detección del Sistema**
10. **CSS Custom Properties (Variables CSS)**
11. **SCSS con Arquitectura ITCSS**
12. **TypeScript con Strict Typing**

---

**Fase 1 Completada:** Diciembre 2025  
**Próximo Paso:** Fase 2 - Servicios de Comunicación y Separación de Responsabilidades
