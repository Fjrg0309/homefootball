# 🎨 Fase 5 Diseño: Optimización de Imágenes y Animaciones CSS

## Estado: ✅ Completado

## 📋 Resumen de Tareas

| Tarea | Estado | Descripción |
|-------|--------|-------------|
| 1. Optimización de imágenes | ✅ | Guía completa + componentes responsive |
| 2. Optimización de SVGs | ✅ | Documentación SVGO + iconos optimizados |
| 3. Imágenes responsive | ✅ | Componentes con srcset, sizes, picture |
| 4. Animaciones CSS optimizadas | ✅ | 3+ spinners, 5+ transiciones hover/focus |

---

## 1. ✅ Optimización de Imágenes

### Estructura de Directorios Creada
```
src/assets/images/
├── README.md              # Guía completa de optimización
├── original/              # Imágenes originales
├── optimized/             # Versiones JPG optimizadas
│   ├── small/            # 400px de ancho
│   ├── medium/           # 800px de ancho
│   └── large/            # 1200px de ancho
├── webp/                  # Versiones WebP
│   ├── small/
│   ├── medium/
│   └── large/
├── avif/                  # Versiones AVIF
│   ├── small/
│   ├── medium/
│   └── large/
└── svg/                   # SVGs optimizados
```

### Herramientas Recomendadas
- **Squoosh** (https://squoosh.app/) - Conversión y optimización web
- **TinyPNG** (https://tinypng.com/) - Compresión PNG/JPG
- **FileOptimizer** (Windows) - Procesamiento por lotes

### Configuración de Compresión
| Formato | Calidad | Peso máximo |
|---------|---------|-------------|
| JPG | 80-85% | < 200KB |
| WebP | 80-85% | < 150KB |
| AVIF | 65-75% | < 100KB |

### Tamaños Estándar
- **Small**: 400px (móviles, thumbnails)
- **Medium**: 800px (tablets, cards)
- **Large**: 1200px (desktop, hero images)

---

## 2. ✅ Optimización de SVGs

### Herramienta Principal
**SVGOMG** (https://jakearchibald.github.io/svgomg/)

### Configuración SVGO Aplicada
```js
plugins: [
  'removeDoctype',
  'removeXMLProcInst',
  'removeComments',
  'removeMetadata',
  'cleanupNumericValues',
  'convertColors',
  'removeUnknownsAndDefaults',
  'collapseGroups',
  'convertPathData',
  'removeEmptyContainers'
]
```

### Checklist SVG
- ✅ Usar `currentColor` para iconos monocromáticos
- ✅ Mantener `viewBox` para escalabilidad
- ✅ Eliminar metadatos de editores
- ✅ Optimizar paths numéricos

---

## 3. ✅ Imágenes Responsive

### Componentes Creados

#### 3.1 ResponsiveImage Component
**Archivo**: `src/app/components/shared/responsive-image/responsive-image.ts`

```html
<app-responsive-image
  basePath="/assets/images/optimized/"
  imageName="hero-banner"
  alt="Banner principal"
  [aspectRatio]="16/9"
  [priority]="true"
/>
```

**Características**:
- ✅ Soporte AVIF, WebP, JPG/PNG
- ✅ srcset automático (400w, 800w, 1200w)
- ✅ Lazy loading por defecto
- ✅ Placeholder con spinner durante carga
- ✅ Fallback en caso de error

#### 3.2 Picture Component (Art Direction)
**Archivo**: `src/app/components/shared/picture/picture.ts`

```html
<app-picture
  [sources]="[
    { src: '/images/hero-mobile.webp', media: '(max-width: 600px)' },
    { src: '/images/hero-tablet.webp', media: '(max-width: 1024px)' },
    { src: '/images/hero-desktop.webp', media: '(min-width: 1025px)' }
  ]"
  fallbackSrc="/images/hero-desktop.jpg"
  alt="Banner principal"
/>
```

**Características**:
- ✅ Art direction (imagen diferente por breakpoint)
- ✅ Soporte para múltiples sources
- ✅ Overlay opcional
- ✅ Caption/figcaption

#### 3.3 Card Component Actualizado
**Archivo**: `src/app/components/shared/card/card.ts`

```html
<app-card
  imageSrc="/assets/images/product.jpg"
  imageWebp="/assets/images/product.webp"
  imageSrcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
  imageSizes="(max-width: 600px) 100vw, 50vw"
  [lazyLoad]="true"
/>
```

---

## 4. ✅ Animaciones CSS Optimizadas

### Archivo Principal
**Archivo**: `src/styles/components/_animations.scss`

### Reglas de Rendimiento Aplicadas
- ✅ Solo animamos `transform` y `opacity`
- ✅ Duraciones entre 150ms y 500ms
- ✅ Respeto a `prefers-reduced-motion`

### 4.1 Loading Spinners (4 variantes)

#### Spinner Circular
```scss
.spinner {
  animation: spin 800ms linear infinite;
}
```

#### Spinner de Puntos (Dots)
```scss
.spinner-dots__dot {
  animation: bounce-dots 500ms ease-in-out infinite;
}
```

#### Spinner de Pulso
```scss
.spinner-pulse {
  animation: pulse 500ms ease-in-out infinite alternate;
}
```

#### Spinner de Barras
```scss
.spinner-bars__bar {
  animation: bar-bounce 400ms ease-in-out infinite;
}
```

#### Skeleton Loader
```scss
.skeleton {
  animation: skeleton-shimmer 500ms ease-in-out infinite;
}
```

### 4.2 Transiciones Hover/Focus (8+ elementos)

| Clase | Efecto | Duración |
|-------|--------|----------|
| `.hover-lift` | translateY + shadow | 200ms |
| `.hover-underline` | scaleX underline | 250ms |
| `.hover-scale` | scale(1.02) | 300ms |
| `.hover-rotate` | rotate(15deg) | 300ms |
| `.hover-zoom` | scale(1.08) img | 400ms |
| `.hover-pulse` | scale pulse | 400ms |
| `.hover-avatar` | scale(1.1) | 200ms |
| `.focus-glow` | box-shadow glow | 200ms |

### 4.3 Micro-interacciones

| Clase | Efecto | Uso |
|-------|--------|-----|
| `.animate-bounce` | Rebote vertical | Notificaciones |
| `.animate-slide-in-left` | Entrada lateral | Paneles |
| `.animate-slide-in-up` | Entrada desde abajo | Modales |
| `.animate-fade-in` | Fade suave | Contenido |
| `.animate-scale-in` | Zoom in | Modales |
| `.animate-shake` | Vibración | Errores |
| `.animate-pop-in` | Pop elástico | Toasts |
| `.animate-heartbeat` | Latido | Favoritos |
| `.animate-wiggle` | Meneo | Llamar atención |

### 4.4 Utilidades de Animación

```scss
// Delays
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }

// Duraciones
.animate-duration-150 { animation-duration: 150ms; }
.animate-duration-300 { animation-duration: 300ms; }
.animate-duration-500 { animation-duration: 500ms; }

// Fill modes
.animate-fill-forwards { animation-fill-mode: forwards; }
.animate-fill-both { animation-fill-mode: both; }
```

### 4.5 Accesibilidad - Movimiento Reducido

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
| Archivo | Descripción |
|---------|-------------|
| `src/assets/images/README.md` | Guía completa de optimización |
| `src/app/components/shared/responsive-image/responsive-image.ts` | Componente imagen responsive |
| `src/app/components/shared/responsive-image/responsive-image.scss` | Estilos del componente |
| `src/app/components/shared/picture/picture.ts` | Componente art direction |
| `src/styles/components/_animations.scss` | Animaciones CSS optimizadas |

### Archivos Modificados
| Archivo | Cambios |
|---------|---------|
| `src/styles/styles.scss` | Importación de animations |
| `src/app/components/shared/loading/loading.scss` | Animaciones optimizadas |
| `src/app/components/shared/card/card.scss` | Transiciones hover mejoradas |

---

## 🎯 Uso Práctico

### Ejemplo: Hero Banner Responsive
```html
<app-picture
  [sources]="[
    { 
      src: '/assets/images/avif/small/hero-small.avif',
      media: '(max-width: 480px)',
      type: 'image/avif'
    },
    { 
      src: '/assets/images/webp/medium/hero-medium.webp',
      media: '(max-width: 1024px)',
      type: 'image/webp'
    },
    { 
      src: '/assets/images/webp/large/hero-large.webp',
      media: '(min-width: 1025px)',
      type: 'image/webp'
    }
  ]"
  fallbackSrc="/assets/images/optimized/large/hero-large.jpg"
  alt="Banner de HomeFootball"
  [aspectRatio]="21/9"
  loading="eager"
/>
```

### Ejemplo: Card con Animación
```html
<article class="card hover-lift">
  <picture class="card__picture hover-zoom">
    <source srcset="product.avif" type="image/avif">
    <source srcset="product.webp" type="image/webp">
    <img 
      src="product.jpg"
      srcset="product-400.jpg 400w, product-800.jpg 800w"
      sizes="(max-width: 600px) 100vw, 400px"
      alt="Producto"
      loading="lazy"
      class="card__image"
    >
  </picture>
  <div class="card__content animate-fade-in">
    <h3 class="card__title">Título</h3>
    <p class="card__description">Descripción</p>
  </div>
</article>
```

### Ejemplo: Botón con Spinner
```html
<button class="btn btn--primary btn--loading" disabled>
  <span class="spinner spinner--sm"></span>
  Cargando...
</button>
```

---

## ✅ Checklist Final

### Imágenes
- [x] Guía de optimización documentada
- [x] Estructura de directorios creada
- [x] Componente ResponsiveImage implementado
- [x] Componente Picture para art direction
- [x] srcset y sizes configurados
- [x] Lazy loading implementado
- [x] Formatos AVIF/WebP soportados

### SVGs
- [x] Documentación SVGO
- [x] Iconos usando currentColor
- [x] viewBox preservado

### Animaciones
- [x] 4 loading spinners diferentes
- [x] 8+ transiciones hover/focus
- [x] 9 micro-interacciones
- [x] Solo transform y opacity animados
- [x] Duraciones 150ms-500ms
- [x] prefers-reduced-motion respetado

---

## 🔗 Referencias

- [Squoosh - Image Optimization](https://squoosh.app/)
- [SVGOMG - SVG Optimizer](https://jakearchibald.github.io/svgomg/)
- [web.dev - Responsive Images](https://web.dev/responsive-images/)
- [MDN - CSS Animations Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/CSS_JavaScript_animation_performance)
- [WCAG - Motion Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
