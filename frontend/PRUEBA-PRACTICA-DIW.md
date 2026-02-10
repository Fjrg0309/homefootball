# PRUEBA PRACTICA DIW - Diseno de Interfaces Web

## Informacion General

**Bloque**: DISENO DE INTERFACES WEB (DIW)  
**Resultados de Aprendizaje**: RA2  
**Autor**: Estudiante  
**Fecha**: Febrero 2026

---

## 1. Arquitectura de Estilos y Preprocesadores

### 1.1 Evolucion Cromatica - Nuevas Variables de Color

Se han definido 2 nuevas variables de color que complementan la identidad visual existente:

**Archivo:** `src/styles/00-settings/_variables.scss`

```scss
/* NUEVOS COLORES DIW - Complementarios para Landing */
--color-landing-accent: #4A90D9;       // Azul complementario para elementos interactivos
--color-landing-highlight: #F4A261;    // Naranja calido para destacados y hover states
```

**Justificacion de los colores:**
- **Azul (#4A90D9)**: Transmite confianza y profesionalidad, complementa el azul marino del header existente
- **Naranja (#F4A261)**: Color calido que genera contraste y atrae la atencion en estados hover

### 1.2 Integracion ITCSS

Las variables se han ubicado en la **capa Settings** (00-settings), que es la primera capa de la arquitectura ITCSS y contiene solo configuracion sin output CSS.

**Estructura de capas utilizada:**

```
00-settings/     <- Variables de color (aqui)
01-tools/        <- Mixins y funciones  
02-generic/      <- Reset y normalizacion
03-elements/     <- Estilos base HTML
04-layout/       <- Grid y layouts (aqui: _grid-landingpage.scss)
components/      <- Estilos visuales (aqui: _landing.scss)
utilities/       <- Clases de utilidad
```

### 1.3 Archivos Parciales Creados

| Archivo | Capa | Proposito |
|---------|------|-----------|
| `_grid-landingpage.scss` | 04-layout | CSS Grid bidimensional y Flexbox |
| `_landing.scss` | components | Estilos visuales de landing y minilanding |

### 1.4 Importaciones en el Manifiesto Principal

**Archivo:** `src/styles/main.scss`

```scss
// LAYOUT - Respetando orden de cascada
@layer objects {
  @use '04-layout/layouts';
  @use '04-layout/grid-landingpage';  // NUEVO
}

// COMPONENTS - Despues de layouts
@layer components {
  @use 'components/header';
  @use 'components/footer';
  @use 'components/buttons';
  @use 'components/container-queries';
  @use 'components/landing';           // NUEVO
}
```

---

## 2. Metodologia y Naming (BEM)

### 2.1 Nomenclatura BEM Aplicada

Se aplica estrictamente la metodologia BEM (Block Element Modifier):

**Ejemplos en landing.html:**
```html
<!-- Bloque -->
<main class="landing">

<!-- Elementos -->
<header class="landing__hero">
<h1 class="landing__title">
<nav class="landing__buttons">

<!-- Modificadores -->
<a class="landing__btn landing__btn--primary">
<a class="landing__btn landing__btn--secondary">
<a class="landing__btn landing__btn--large">
```

**Ejemplos en minilanding.html:**
```html
<!-- Bloque -->
<section class="minilanding">

<!-- Elementos -->
<article class="minilanding__equipo">
<figure class="minilanding__equipo-content">
<img class="minilanding__escudo">

<!-- Modificadores de icono -->
<span class="minilanding__icon minilanding__icon--trophy">
<span class="minilanding__icon minilanding__icon--users">
```

### 2.2 Estados Interactivos

Definidos en `_grid-landingpage.scss` usando las nuevas variables:

```scss
// Botones
.landing__btn--primary {
  background: var(--color-landing-accent);
  
  &:hover {
    background: var(--color-landing-highlight);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 217, 0.3);
  }
  
  &:focus {
    outline: 3px solid var(--color-landing-highlight);
    outline-offset: 2px;
  }
  
  &:active {
    transform: translateY(0);
  }
}

// Cards de usuario
.minilanding__usuario-item {
  &:hover {
    background-color: var(--color-landing-highlight);
    border-color: var(--color-landing-highlight);
  }
  
  &:focus-within {
    outline: 2px solid var(--color-landing-accent);
  }
}

// Feature cards
.landing__feature-card {
  &:hover {
    border-color: var(--color-landing-accent);
  }
}
```

---

## 3. Layout y Responsive Design

### 3.1 Sistema de Rejilla Bidimensional (CSS Grid)

**Archivo:** `src/styles/04-layout/_grid-landingpage.scss`

```scss
.landing__features-grid {
  display: grid;
  
  // Mobile: 1 columna
  grid-template-columns: 1fr;
  
  // Tablet (768px): 2 columnas
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop (1024px): 3 columnas
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 3.2 Caja Flexible (Flexbox) para Items

Cada elemento del listado usa Flexbox con comportamiento adaptativo:

```scss
.landing__feature-card {
  display: flex;
  
  // Mobile: eje principal vertical (apilado)
  flex-direction: column;
  align-items: center;
  
  // Desktop: eje principal horizontal (lateral)
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
}
```

### 3.3 Puntos de Ruptura

| Breakpoint | Columnas Grid | Flexbox Direction |
|------------|---------------|-------------------|
| < 768px (Mobile) | 1 | column (apilado) |
| >= 768px (Tablet) | 2 | row (lateral) |
| >= 1024px (Desktop) | 3 | row (lateral) |

---

## 4. Semantica HTML5

### 4.1 Etiquetas Semanticas Utilizadas

**Evitando uso generico de div:**

| Etiqueta | Uso | Archivo |
|----------|-----|---------|
| `<main>` | Contenido principal | landing.html |
| `<header>` | Cabecera hero | landing.html |
| `<section>` | Secciones tematicas | landing.html, minilanding.html |
| `<article>` | Contenido independiente | minilanding.html |
| `<aside>` | Contenido complementario (CTA) | landing.html |
| `<nav>` | Navegacion de botones | landing.html |
| `<figure>` | Imagen con caption | minilanding.html |
| `<figcaption>` | Pie de figura | minilanding.html |
| `<dl>, <dt>, <dd>` | Lista de definiciones | minilanding.html |

### 4.2 Atributos de Accesibilidad

```html
<main role="main">
<section aria-labelledby="features-title">
<article aria-labelledby="equipo-title">
<nav aria-label="Acciones principales">
<aside aria-busy="true" aria-live="polite">
<span aria-hidden="true">
```

---

## 5. Justificacion DIW

### Pregunta 1: Arquitectura

**¿Por que has colocado tus variables en la capa Settings y tus estilos en Components?**

Las variables se colocan en Settings (00-settings) porque es la primera capa de ITCSS, disenada exclusivamente para configuracion sin generar CSS de salida. Esto permite que todas las demas capas puedan acceder a estas variables mediante `@use`.

Los estilos visuales se colocan en Components porque representan piezas de UI especificas y reutilizables con diseno visual propio. La capa Components tiene mayor especificidad que Settings, Tools, Generic y Elements, lo que permite sobrescribir estilos base cuando sea necesario.

**¿Que pasaria si importaras Components antes que Settings en el manifiesto?**

El compilador SCSS fallaria porque las variables definidas en Settings no estarian disponibles cuando se procese Components. Los estilos que usan `var(--color-landing-accent)` no tendrian referencia a esa variable CSS, resultando en valores invalidos o por defecto. Ademas, se romperia el principio de cascada de ITCSS donde la especificidad debe aumentar gradualmente de arriba hacia abajo.

### Pregunta 2: Metodologia BEM

**Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados:**

BEM me ha permitido identificar inmediatamente la relacion entre elementos y su componente padre sin necesidad de revisar el contexto HTML. Por ejemplo, al ver `.minilanding__usuario-item` se que es un elemento del bloque minilanding, mientras que un selector como `section > ul > li` no proporciona esa informacion semantica.

Otra ventaja practica: al buscar en el codigo `.landing__btn--primary`, encuentro exactamente ese boton especifico. Con selectores anidados como `div > button` tendria multiples coincidencias en todo el proyecto, complicando el mantenimiento y la depuracion.

---

## 6. Estructura de Archivos Modificados

```
frontend/src/
├── styles/
│   ├── 00-settings/
│   │   └── _variables.scss       (MODIFICADO - 2 nuevas variables)
│   ├── 04-layout/
│   │   └── _grid-landingpage.scss (MODIFICADO - Grid + Flexbox)
│   ├── components/
│   │   └── _landing.scss         (NUEVO - Estilos visuales)
│   └── main.scss                 (MODIFICADO - Importaciones)
└── app/pages/
    ├── landing/
    │   ├── landing.html          (MODIFICADO - HTML semantico)
    │   └── landing.scss          (VACIADO - Sin CSS en componente)
    └── minilanding/
        ├── minilanding.html      (MODIFICADO - HTML semantico)
        └── minilanding.scss      (VACIADO - Sin CSS en componente)
```

---

## 7. Requisitos Cumplidos

| Requisito | Estado | Descripcion |
|-----------|--------|-------------|
| 2 nuevas variables color | SI | `--color-landing-accent` y `--color-landing-highlight` |
| Variables en Settings | SI | Ubicadas en `00-settings/_variables.scss` |
| Archivos parciales | SI | `_grid-landingpage.scss` y `_landing.scss` |
| Importaciones ITCSS | SI | Orden correcto en `main.scss` |
| Sin CSS en componentes | SI | SCSS de componentes Angular vaciados |
| BEM estricto | SI | Bloques, elementos y modificadores |
| Estados interactivos | SI | hover, focus, active con nuevos colores |
| CSS Grid responsive | SI | 1/2/3 columnas por breakpoint |
| Flexbox para items | SI | Apilado mobile, lateral desktop |
| HTML5 semantico | SI | main, section, article, figure, dl |
| Sin divs innecesarios | SI | Etiquetas semanticas apropiadas |
| Justificacion documentada | SI | Seccion 5 de este documento |

---

*Documento generado para la prueba practica DIW - Diseno de Interfaces Web*