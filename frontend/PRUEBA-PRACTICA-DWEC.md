# PRUEBA PRÁCTICA DWEC - Desarrollo en Entorno Cliente

## 📋 Información General

**Bloque**: DESARROLLO EN ENTORNO CLIENTE (DWEC)  
**Resultados de Aprendizaje**: RA4, RA5.d, RA6, RA7  
**Autor**: Estudiante  
**Fecha**: Febrero 2026

---

## 1. 🗺️ Routing y Navegación

### 1.1 Nueva Ruta Implementada

Se ha definido una nueva ruta `/landing` en el sistema de routing de Angular:

**Archivo:** `src/app/app.routes.ts`

```typescript
{ 
  path: 'landing', 
  loadComponent: () => import('./pages/landing/landing').then(m => m.Landing),
  data: { breadcrumb: 'Landing' }
}
```

### 1.2 Lazy Loading

La ruta utiliza **carga perezosa (Lazy Loading)** mediante `loadComponent`:

- El componente `Landing` NO se importa al inicio de la aplicación
- Solo se carga cuando el usuario navega a `/landing`
- Mejora el rendimiento inicial de la aplicación
- Reduce el tamaño del bundle principal

### 1.3 Integración en Header y Footer

**Header (`src/app/components/layout/header/header.html`):**
```html
<li>
  <a routerLink="/landing" 
     class="header__nav-link" 
     routerLinkActive="header__nav-link--active">
    Landing
  </a>
</li>
```

**Footer (`src/app/components/layout/footer/footer.html`):**
```html
<nav class="footer__nav">
  <a routerLink="/landing" class="footer__link">Landing</a>
  <a routerLink="/about" class="footer__link">Acerca de</a>
  <a routerLink="/ajustes" class="footer__link">Ajustes</a>
</nav>
```

---

## 2. 🏗️ Arquitectura de Componentes

### 2.1 Jerarquía Padre-Hijo

```
┌─────────────────────────────────────────────────────────────┐
│                    Landing (PADRE)                           │
│                 Componente Contenedor                        │
├─────────────────────────────────────────────────────────────┤
│  - Inyecta LandingService                                   │
│  - Recupera datos del backend                               │
│  - Gestiona estados: loading, error, datos                  │
│  - Pasa datos al hijo vía @Input                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ @Input
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Minilanding (HIJO)                         │
│              Componente Presentacional                       │
├─────────────────────────────────────────────────────────────┤
│  - Componente Standalone                                    │
│  - Recibe datos vía decoradores @Input                      │
│  - NO inyecta servicios                                     │
│  - Solo renderiza información                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Componente Contenedor (Padre): Landing

**Archivo:** `src/app/pages/landing/landing.ts`

**Responsabilidades:**
- Inyectar el servicio `LandingService`
- Recuperar datos del backend al inicializar
- Gestionar el control de flujo (loading, error, datos)
- Pasar datos al componente hijo mediante propiedades

**Código clave:**
```typescript
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer, Minilanding],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
})
export class Landing implements OnInit {
  private landingService = inject(LandingService);
  
  // Signals reactivos
  loading = computed(() => this.landingService.loading());
  error = computed(() => this.landingService.error());
  landingData = computed(() => this.landingService.landingData());
  
  // Datos para el hijo
  equipoDestacado = computed<EquipoDestacado | null>(() => {
    return this.landingData()?.equipoDestacado ?? null;
  });

  ngOnInit(): void {
    this.loadLandingData();
  }
}
```

### 2.3 Componente Presentacional (Hijo): Minilanding

**Archivo:** `src/app/pages/minilanding/minilanding.ts`

**Características:**
- **Standalone**: `standalone: true`
- **Sin inyección de servicios**
- **Datos vía @Input**

**Código clave:**
```typescript
@Component({
  selector: 'app-minilanding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minilanding.html',
  styleUrl: './minilanding.scss',
})
export class Minilanding {
  @Input() equipoDestacado: EquipoDestacado | null = null;
  @Input() usuarios: UsuarioPublico[] = [];
  @Input() totalUsuarios: number = 0;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
}
```

**Uso en el padre (landing.html):**
```html
<app-minilanding
  [equipoDestacado]="equipoDestacado()"
  [usuarios]="usuariosRegistrados()"
  [totalUsuarios]="totalUsuarios()"
  [loading]="loading()"
  [error]="error()">
</app-minilanding>
```

---

## 3. 📝 Tipado con Interfaces

### 3.1 Interfaces Definidas

**Archivo:** `src/app/models/landing.model.ts`

```typescript
// Información pública de usuario
export interface UsuarioPublico {
  id: number;
  username: string;
}

// Equipo destacado con escudo
export interface EquipoDestacado {
  id: number;
  nombre: string;
  fechaFundacion: string;
  ligaNombre: string;
  entrenadorNombre: string;
  totalJugadores: number;
  escudoUrl: string;
}

// DTO principal de la Landing Page
export interface LandingPageData {
  totalUsuarios: number;
  usuariosRegistrados: UsuarioPublico[] | null;
  equipoDestacado: EquipoDestacado;
  mensajeBienvenida: string;
}
```

**Nota:** NO se usa `any` en ningún momento. Todo el código está correctamente tipado.

---

## 4. 📁 Estructura de Archivos

```
frontend/src/app/
├── models/
│   └── landing.model.ts          (NUEVO - Interfaces)
├── services/
│   └── landing.service.ts        (NUEVO - Servicio HTTP)
├── pages/
│   ├── landing/
│   │   ├── landing.ts            (MODIFICADO - Componente Padre)
│   │   ├── landing.html          (MODIFICADO - Template)
│   │   └── landing.scss          (MODIFICADO - Estilos)
│   └── minilanding/
│       ├── minilanding.ts        (MODIFICADO - Componente Hijo)
│       ├── minilanding.html      (MODIFICADO - Template)
│       └── minilanding.scss      (MODIFICADO - Estilos)
├── components/layout/
│   ├── header/
│   │   └── header.html           (MODIFICADO - Navegación)
│   └── footer/
│       ├── footer.ts             (MODIFICADO - RouterModule)
│       ├── footer.html           (MODIFICADO - Navegación)
│       └── footer.scss           (MODIFICADO - Estilos nav)
└── app.routes.ts                 (MODIFICADO - Lazy Loading)
```

---

## 5. 🚀 Instrucciones de Ejecución

### 5.1 Prerrequisitos

- Node.js 18+ instalado
- Angular CLI instalado (`npm install -g @angular/cli`)
- Backend ejecutándose en `http://localhost:8080`

### 5.2 Instalación

```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install
```

### 5.3 Ejecución en Desarrollo

```bash
# Iniciar servidor de desarrollo
ng serve

# O con npm
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

### 5.4 Probar la Landing Page

1. Abrir `http://localhost:4200`
2. Navegar a "Landing" desde el menú de navegación (Header)
3. O acceder directamente a `http://localhost:4200/landing`

### 5.5 Flujo de Prueba Completo

1. **Sin autenticación:**
   - Navegar a `/landing`
   - Ver mensaje indicando que debe iniciar sesión
   - Datos por defecto mostrados

2. **Con autenticación:**
   - Registrarse o iniciar sesión
   - Navegar a `/landing`
   - Ver usuarios registrados y equipo destacado con escudo

---

## 6. ✅ Requisitos Cumplidos

| Requisito | Estado | Descripción |
|-----------|--------|-------------|
| Nueva ruta | ✅ | `/landing` implementada |
| Lazy Loading | ✅ | `loadComponent()` utilizado |
| Navegación Header | ✅ | Link añadido con `routerLink` |
| Navegación Footer | ✅ | Link añadido con `routerLink` |
| Componente Padre | ✅ | `Landing` - Contenedor |
| Componente Hijo | ✅ | `Minilanding` - Presentacional |
| Standalone | ✅ | `Minilanding` es standalone |
| @Input decoradores | ✅ | 5 inputs definidos |
| Interfaces tipadas | ✅ | `landing.model.ts` |
| Sin `any` | ✅ | Todo tipado correctamente |

---

## 7. 📊 Diagrama de Flujo de Datos

```
┌─────────────┐    HTTP GET     ┌─────────────┐
│   Backend   │ ◄────────────── │  Landing    │
│  /api/land  │                 │  Service    │
└─────────────┘                 └──────┬──────┘
                                       │
                                       │ Signal
                                       ▼
                               ┌───────────────┐
                               │    Landing    │
                               │   (Padre)     │
                               └───────┬───────┘
                                       │
                                       │ @Input
                                       ▼
                               ┌───────────────┐
                               │  Minilanding  │
                               │    (Hijo)     │
                               └───────────────┘
```

---

*Documento generado para la prueba práctica DWEC - Desarrollo en Entorno Cliente*