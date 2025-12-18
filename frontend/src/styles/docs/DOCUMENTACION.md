# HomeFootball - Documentación de Diseño CSS

## Justificación del Cambio de Diseño

### Análisis de la Paleta Anterior

La paleta inicial con verdes pastel tenía problemas de contraste que no cumplían con WCAG 2.1, dificultando la lectura prolongada. Además, la estética resultaba poco profesional para una aplicación deportiva, sin transmitir la energía del fútbol.

### Nueva Propuesta de Diseño

El rediseño usa azul marino oscuro como color corporativo y verde brillante para acciones, resolviendo los problemas de contraste y transmitiendo profesionalidad deportiva.

**Colores principales:**
- **Azul marino oscuro (#363871):** Header y footer. Transmite profesionalidad y confianza, con un matiz violáceo que añade personalidad.
- **Verde brillante (#00D95F):** Títulos y CTAs. Aporta energía deportiva y visibilidad óptima.
- **Gris claro (#F5F5F5):** Fondo general que reduce fatiga visual.
- **Blanco (#FFFFFF):** Tarjetas y contenedores para crear jerarquía visual.

El contraste mejora drásticamente: texto sobre blanco alcanza 16.1:1 (AAA), y blanco sobre azul marino 7.8:1 (AAA).

---

## 1. Arquitectura CSS

### 1.1 Principios de Comunicación Visual

El diseño se basa en cinco principios que garantizan una interfaz coherente y usable.

#### 1. Jerarquía Visual

Establece el orden de importancia mediante tamaño, peso tipográfico y espaciado.

![Jerarquía Visual](images/wireframearreglado.png)

Usamos escala tipográfica base 8px: desde 8px para elementos pequeños hasta 48px para títulos. El tamaño base es 16px.

El espaciado sigue el mismo sistema: 8px (elementos relacionados), 16px (grupos), 24px (separaciones), 32px (componentes) y 48px (secciones).


#### 2. Contraste

El contraste diferencia elementos mediante color, tamaño y peso, mejorando la legibilidad y facilitando la identificación de acciones.

![Contraste Header](images/header.png)

![Contraste Partidos](images/contrastepartidos.png)

Las tarjetas blancas sobre fondo gris claro proporcionan contraste de 16.1:1. El header azul marino con texto blanco alcanza 7.8:1. Los botones primarios con fondo verde brillante mantienen contraste suficiente para elementos interactivos.

#### 3. Alineación

La alineación crea orden visual mediante la colocación estratégica de elementos en ejes comunes. Se utilizan sistemas de alineación consistentes en toda la interfaz.

![Alineación](images/alineacion.png)

El header utiliza alineación horizontal con distribución space-between para logo, navegación y usuario. Los contenedores principales están centrados con ancho máximo de 1280px. Las tarjetas de partidos usan alineación centrada, mientras que las listas de contenido se alinean a la izquierda.

#### 4. Proximidad

La proximidad agrupa elementos relacionados, facilitando la comprensión de relaciones entre contenidos. El espaciado variable comunica el nivel de relación entre elementos.

![Proximidad](images/wireframearreglado.png)

Los elementos que están relacionados tienen una separación de 16px (1rem), los que no tienen una relación 40 px (2.5rem)

#### 5. Repetición

La repetición establece patrones visuales consistentes que unifican la interfaz y facilitan el reconocimiento de elementos similares.

![Repetición](images/wireframearreglado.png)

Los bordes redondeados siguen un patrón consistente: 8px para inputs, 12px para botones, 16px para tarjetas y 24px para modales. Las sombras utilizan valores de Material Design (small, medium, large, extra-large) según la importancia del elemento. Todas las transiciones usan 300ms con curva de easing cubic-bezier para crear movimientos naturales.


### 1.2 Metodología CSS: BEM

BEM (Block Element Modifier) es una forma de nombrar las clases CSS para que sea más fácil entender qué hace cada una.

**Cómo funciona:**

- **Block:** El componente principal (header, match-card, news)
- **Element:** Una parte del bloque, se conecta con `__` (header__logo, match-card__score)
- **Modifier:** Una variación, se conecta con `--` (match-card--live, btn--primary)

**Por qué uso BEM:**

1. Todas las clases tienen la misma especificidad, así no hay problemas de estilos que se pisan
2. Solo con leer el nombre ya sabes qué hace (match-card__score es el marcador de una tarjeta de partido)
3. Puedo copiar un componente a otro sitio y funciona igual
4. Si cambio algo, solo afecta a ese elemento específico
5. Es más fácil trabajar en equipo porque los nombres no se repiten

---

### 1.3 Organización de Archivos: ITCSS

ITCSS (Inverted Triangle CSS) es básicamente ordenar los archivos CSS de lo más genérico a lo más específico. Así evito que los estilos se pisen entre ellos.

**Estructura del proyecto:**

El proyecto se organiza en cinco carpetas principales dentro de src/styles:
- **00-settings:** Variables CSS y tokens de diseño
- **01-tools:** Mixins y funciones SCSS
- **02-generic:** Normalización del navegador
- **03-elements:** Estilos de elementos HTML base
- **04-layout:** Componentes y layouts con clases BEM

**Descripción de cada capa:**

**00-settings:** Aquí están las variables (colores, tamaños, etc). No genera CSS final.

**01-tools:** Mixins que reutilizo en varios sitios (centrar cosas, hacer tarjetas, etc). Tampoco genera CSS.

**02-generic:** Reset básico del navegador para que todo empiece igual.

**03-elements:** Estilos por defecto de enlaces, títulos y párrafos.

**04-layout:** Los componentes con sus clases BEM (header, footer, etc).

**Control de la cascada con @layer:**

Uso `@layer` en el archivo principal para definir el orden: reset, elements, layout, components, utilities. Así las capas de arriba siempre ganan y no necesito usar `!important`.

**Ventajas de ITCSS:**

1. **Cascada predecible:** El orden de las capas es explícito y controlado.
2. **Escalabilidad:** Nuevos componentes se añaden en la capa correspondiente sin romper estilos existentes.
3. **Mantenibilidad:** Cada desarrollador sabe dónde buscar y añadir código.
4. **Reutilización:** Variables y mixins están centralizados y disponibles globalmente.
5. **Performance:** Los navegadores pueden optimizar mejor el CSS estructurado por capas.


### 1.4 Sistema de Design Tokens

Los Design Tokens son básicamente variables CSS donde guardo todos los colores, tamaños, etc. Así uso los mismos valores en toda la aplicación y todo queda consistente.

#### Colores

La paleta cromática se estructura en cuatro categorías: colores principales, colores de acción, colores semánticos y escala de grises.

**Colores principales:**

Elegí el azul marino (#363871) porque se ve profesional pero no tan aburrido como otros azules. Tiene buen contraste y queda bien en el header y footer.

**Colores de acción:**

Para los botones uso verde brillante (#00D95F) porque se ve bien y en deportes el verde siempre significa algo positivo. Tengo versiones dark y light para los hover.

**Colores semánticos:**

Verde (success), naranja (warning), rojo (error) y azul (info) siguen convenciones UI establecidas. Todos mantienen contraste suficiente sobre fondos blancos.

**Colores de texto:**

La escala de grises usa valores de Material Design. El texto principal (#212121) reduce fatiga visual, mientras el secundario (#757575) mantiene contraste 4.6:1 (mínimo AA).

#### Tipografía

El sistema tipográfico se basa en Inter, una fuente sans-serif diseñada específicamente para interfaces digitales y pantallas.

Uso la fuente Inter porque se ve bien en pantallas y es gratis. Tiene varias opciones de grosor (light, regular, bold...) y funciona bien para mostrar números de marcadores.

**Escala tipográfica:**

Sistema base 8px con saltos no lineales (8, 12, 16, 24, 32, 40, 48). El tamaño base de 16px facilita accesibilidad y legibilidad óptima.

**Pesos tipográficos:**

Light (300) para títulos grandes, Regular (400) para texto, Medium (500) para navegación, Bold (700) para títulos y Black (900) para elementos hero.

**Altura de línea:**

Normal (1.5) es el estándar WCAG para párrafos. Tight (1.25) para títulos, Relaxed (1.75) para textos largos.

#### Espaciado

Todos los espaciados son múltiplos de 8px (8, 16, 24, 32...). Es más fácil mantener todo consistente así.

#### Bordes redondeados

Múltiplos de 4px: Small (8px) en inputs, Medium (12px) en botones, Large (16px) en tarjetas, XL (24px) en modales. Valor 9999px garantiza elementos circulares perfectos.

#### Sombras

Valores de Material Design. Small para inputs, Medium para tarjetas, Large para modales, XL para elementos críticos. Opacidades bajas evitan sombras duras.

#### Transiciones

Fast (150ms) para hover, Base (200ms) para transiciones estándar, Slow (300ms) para modales. Easing con aceleración inicial y deceleración final.

#### Breakpoints

Small (640px) móviles landscape, Medium (768px) tablets portrait, Large (1024px) tablets landscape, XL (1280px) laptops, 2XL (1536px) monitores grandes.


### 1.5 Mixins y Funciones SCSS

Los mixins encapsulan patrones CSS repetitivos, reduciendo duplicación de código.

#### flex-center

Centra elementos con Flexbox. Elimina necesidad de recordar tres propiedades, usado en modales y loaders.

#### card

Estilo base para tarjetas: fondo blanco, bordes redondeados, padding, sombra y transición hover.

#### pill-button

Botones con forma de píldora para acciones secundarias. Usado en filtros y etiquetas.

#### responsive

Facilita media queries usando breakpoints del sistema (sm, md, lg, xl).


### 1.6 ViewEncapsulation en Angular

Dejo el ViewEncapsulation.Emulated por defecto en casi todos los componentes. Así los estilos no se mezclan entre componentes.

**Lo bueno:**

1. Los estilos de cada componente están aislados
2. Funciona en todos los navegadores
3. Puedo ver los estilos normalmente en el inspector
4. Las variables CSS globales funcionan igual

**Cuándo uso ViewEncapsulation.None:**

- En el componente raíz para los estilos base
- En header, footer y navigation porque necesitan ser consistentes en toda la app
- En modales y overlays

**Resumen:**

- **Emulated:** La mayoría de componentes (botones, tarjetas, formularios)
- **None:** Layout y cosas que comparten estilos


### 1.7 Sistema de Temas Light/Dark

El proyecto implementa un sistema completo de temas claro/oscuro usando CSS Custom Properties, con soporte para:
- Toggle manual entre temas
- Detección automática de preferencia del sistema (`prefers-color-scheme`)
- Persistencia de la elección del usuario en localStorage

#### Definición de Variables por Tema

**Archivo: themes.scss**

```scss
/* Tema Claro (por defecto) */
:root,
.theme-light {
  /* Colores de fondo */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #e0e0e0;
  
  /* Colores de texto */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  
  /* Bordes */
  --border-color: #e0e0e0;
  --border-color-hover: #bdbdbd;
  
  /* Sombras */
  --shadow: rgba(0, 0, 0, 0.1);
  --shadow-lg: rgba(0, 0, 0, 0.15);
  
  /* Colores de acento */
  --accent-primary: #2196F3;
  --accent-secondary: #4CAF50;
  --accent-danger: #f44336;
  --accent-warning: #ff9800;
  
  /* Estados */
  --hover-bg: rgba(0, 0, 0, 0.05);
  --active-bg: rgba(0, 0, 0, 0.1);
  
  /* Transiciones */
  --transition: all 0.3s ease;
}

/* Tema Oscuro */
.theme-dark {
  /* Colores de fondo */
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3d3d3d;
  
  /* Colores de texto */
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-tertiary: #808080;
  
  /* Bordes */
  --border-color: #404040;
  --border-color-hover: #606060;
  
  /* Sombras (más intensas en oscuro) */
  --shadow: rgba(0, 0, 0, 0.3);
  --shadow-lg: rgba(0, 0, 0, 0.5);
  
  /* Colores de acento (más suaves) */
  --accent-primary: #42a5f5;
  --accent-secondary: #66bb6a;
  --accent-danger: #ef5350;
  --accent-warning: #ffa726;
  
  /* Estados */
  --hover-bg: rgba(255, 255, 255, 0.1);
  --active-bg: rgba(255, 255, 255, 0.15);
}
```

#### Detección de Preferencia del Sistema

Usamos `prefers-color-scheme` para detectar automáticamente si el usuario prefiere modo oscuro:

```scss
@media (prefers-color-scheme: dark) {
  :root:not(.theme-light) {
    /* Solo aplica si no hay clase theme-light explícita */
    --bg-primary: #1e1e1e;
    --bg-secondary: #2d2d2d;
    /* ... resto de variables oscuras */
  }
}
```

#### Servicio Angular para Gestión de Temas

**ThemeService (theme.service.ts):**

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme = signal<Theme>('light');

  constructor() {
    this.initializeTheme();
  }

  initializeTheme(): void {
    // 1. Leer tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.setTheme(savedTheme as Theme);
    } else {
      // 2. Si no hay guardado, detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  detectSystemPreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // Escuchar cambios en la preferencia del sistema
  listenToSystemPreference(): void {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
  }
}
```

#### Componente ThemeSwitcher

El componente permite al usuario:
- Ver el tema actual
- Alternar entre temas
- Ver la preferencia del sistema
- Limpiar la preferencia guardada para usar la del sistema

#### Uso de Variables en Componentes

Los componentes usan las variables CSS que cambian automáticamente con el tema:

```scss
.card {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px var(--shadow);
  
  &:hover {
    background: var(--hover-bg);
    border-color: var(--border-color-hover);
  }
}

.button--primary {
  background: var(--accent-primary);
  
  &:hover {
    background: var(--accent-secondary);
  }
}
```

#### Transiciones Suaves entre Temas

Para evitar cambios bruscos, se aplican transiciones en las propiedades que cambian:

```scss
body {
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  transition: background-color 0.3s ease, 
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}
```

## 2. HTML Semántico y Estructura

### 2.1 Elementos Semánticos Utilizados

El proyecto utiliza elementos HTML5 semánticos para mejorar la accesibilidad, SEO y mantenibilidad del código. Cada elemento tiene un propósito específico que comunica su función tanto a navegadores como a tecnologías asistivas.

#### `<header>`

Define el encabezado de la aplicación o de una sección específica. Contiene elementos de navegación, logo y acciones principales.

**Uso en el proyecto:**

```html
<header class="header">
  <div class="header__container">
    <a href="/" class="header__logo">
      <img src="/logo.svg" alt="HomeFootball" class="header__logo-img">
    </a>
    
    <nav class="header__nav">
      <ul class="header__nav-list">
        <li><a href="/" class="header__nav-link">Inicio</a></li>
        <li><a href="/partidos" class="header__nav-link">Partidos</a></li>
        <li><a href="/noticias" class="header__nav-link">Noticias</a></li>
      </ul>
    </nav>
    
    <div class="header__utilities">
      <button class="header__login-btn">Iniciar sesión</button>
    </div>
  </div>
</header>
```

El `<header>` está posicionado como sticky para mantenerlo visible durante el scroll. Contiene la navegación principal y utilidades de usuario, estableciendo el contexto de toda la aplicación.

#### `<nav>`

Identifica secciones de navegación principal o secundaria. Mejora accesibilidad al permitir que lectores de pantalla identifiquen y salten a navegación rápidamente.

**Uso en el proyecto:**

```html
<nav class="header__nav">
  <ul class="header__nav-list">
    <li><a href="/" class="header__nav-link header__nav-link--active">Inicio</a></li>
    <li><a href="/partidos" class="header__nav-link">Partidos</a></li>
    <li><a href="/noticias" class="header__nav-link">Noticias</a></li>
  </ul>
</nav>
```

La navegación usa listas semánticas (`<ul>` y `<li>`) que comunican la estructura de opciones. Los enlaces incluyen clase `--active` para indicar la página actual.

#### `<main>`

Define el contenido principal de la página. Solo debe haber un `<main>` por página, excluyendo contenido repetido como header, footer o sidebars.

**Uso en el proyecto:**

```html
<main class="main">
  <div class="main__container">
    <div class="main__search">
      <input type="search" placeholder="Buscar partidos, equipos..." class="main__search-input">
      <button class="main__search-btn" aria-label="Buscar">
        <svg>...</svg>
      </button>
    </div>
    
    <div class="main__layout">
      <div class="main__content">
        <!-- Contenido principal -->
      </div>
      <aside class="main__sidebar">
        <!-- Contenido relacionado -->
      </aside>
    </div>
  </div>
</main>
```

El `<main>` contiene todo el contenido único de cada vista. Su altura mínima se calcula dinámicamente para mantener el footer en la parte inferior incluso con poco contenido.

#### `<article>`

Representa contenido independiente que podría distribuirse o reutilizarse por sí solo. Ideal para noticias, posts de blog o tarjetas de partidos.

**Uso en el proyecto:**

```html
<article class="match-card">
  <div class="match-card__teams">
    <div class="match-card__team">
      <span class="match-card__name">Real Madrid</span>
      <img src="/teams/madrid.png" alt="" class="match-card__shield">
    </div>
    
    <div class="match-card__score">2 - 1</div>
    
    <div class="match-card__team">
      <img src="/teams/barcelona.png" alt="" class="match-card__shield">
      <span class="match-card__name">Barcelona</span>
    </div>
  </div>
  
  <div class="match-card__meta">
    <time datetime="2025-12-12T20:00">12 Dic, 20:00</time>
    <span class="match-card__league">LaLiga</span>
  </div>
</article>
```

Cada tarjeta de partido es un `<article>` porque representa una unidad de contenido completa que tiene sentido de forma independiente.

#### `<section>`

Agrupa contenido temático relacionado, típicamente con un encabezado. Diferente de `<div>` porque tiene significado semántico.

**Uso en el proyecto:**

```html
<section class="matches">
  <h2 class="matches__title">Partidos Destacados</h2>
  <div class="matches__grid">
    <article class="match-card">...</article>
    <article class="match-card">...</article>
    <article class="match-card">...</article>
  </div>
</section>

<section class="competitions">
  <h2 class="competitions__title">Competiciones</h2>
  <div class="competitions__grid">
    <div class="competition-card">LaLiga</div>
    <div class="competition-card">Premier League</div>
  </div>
</section>
```

Cada `<section>` representa un grupo de contenido con tema común. Siempre incluyen un encabezado (`<h2>`) que describe el contenido de la sección.

#### `<aside>`

Contenido tangencialmente relacionado con el contenido principal. Ideal para sidebars, widgets o contenido complementario.

**Uso en el proyecto:**

La sección de noticias usa una estructura donde el título está **fuera** del recuadro blanco, alineado con los títulos de sección como "Partidos principales":

```html
<section class="main__sidebar-wrapper" aria-label="Noticias destacadas">
  <h2 class="main__sidebar-title">Noticias</h2>

  <aside class="main__sidebar">
    <ul class="main__sidebar-list">
      <li class="main__sidebar-item">
        <a href="/noticia-1" class="main__sidebar-link">
          Messi marca hat-trick en victoria del Inter Miami
        </a>
      </li>
      <li class="main__sidebar-item">
        <a href="/noticia-2" class="main__sidebar-link">
          Real Madrid clasifica a octavos de Champions
        </a>
      </li>
    </ul>
  </aside>
</section>
```

**Estilos de noticias :**
- **Padding del sidebar:** `var(--spacing-2)` (0.5rem)
- **Gap entre items:** `var(--spacing-1)` (0.25rem)
- **Padding de cada noticia:** `var(--spacing-2)` (0.5rem)
- **Tamaño de fuente:** `var(--font-size-sm)` (0.875rem)
- **Margen inferior del wrapper:** `var(--spacing-4)`

El sidebar usa `<aside>` porque contiene noticias relacionadas pero no esenciales para entender el contenido principal.

#### `<footer>`

Define el pie de página de la aplicación o sección. Contiene información de copyright, redes sociales, enlaces legales o contacto.

**Uso en el proyecto:**

```html
<footer class="footer">
  <div class="footer__container">
    <div class="footer__content">
      <p class="footer__text">© 2025 HomeFootball. Todos los derechos reservados.</p>
      
      <div class="footer__social">
        <a href="https://twitter.com" class="footer__social-link footer__social-link--twitter" 
           target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <svg>...</svg>
        </a>
        <a href="https://instagram.com" class="footer__social-link footer__social-link--instagram"
           target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg>...</svg>
        </a>
        <a href="https://tiktok.com" class="footer__social-link footer__social-link--tiktok"
           target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <svg>...</svg>
        </a>
      </div>
    </div>
  </div>
</footer>
```

El `<footer>` está siempre al final de la página. Los enlaces sociales incluyen `rel="noopener noreferrer"` por seguridad y `aria-label` para accesibilidad.

### 2.2 Jerarquía de Headings

La jerarquía de headings estructura el contenido de forma lógica, mejorando SEO, accesibilidad y navegación. Se siguen tres reglas fundamentales: un solo `<h1>` por página, `<h2>` para secciones principales, y nunca saltar niveles.

#### Reglas de jerarquía

1. **Un solo `<h1>` por página:** Identifica el tema principal de la página completa.
2. **`<h2>` para secciones principales:** Cada sección importante usa `<h2>`.
3. **`<h3>` para subsecciones:** Contenido que depende de una sección `<h2>`.
4. **Nunca saltar niveles:** De `<h2>` no se pasa directamente a `<h4>`.

#### Diagrama de jerarquía

```
Página: Inicio
│
├── <h1> HomeFootball - Portal de Fútbol
│
├── <h2> Partidos Destacados
│   ├── <h3> LaLiga
│   ├── <h3> Premier League
│   └── <h3> Champions League
│
├── <h2> Competiciones a Seguir
│   ├── <h3> Europa
│   │   ├── <h4> LaLiga
│   │   ├── <h4> Premier League
│   │   └── <h4> Serie A
│   └── <h3> América
│       ├── <h4> Liga MX
│       └── <h4> MLS
│
└── <h2> Últimas Noticias
    ├── <h3> Fichajes
    │   └── <h4> Real Madrid refuerza su delantera
    └── <h3> Resultados
        └── <h4> Barcelona gana clásico catalán
```

#### Ejemplo de código

```html
<!-- Página Inicio -->
<main class="main">
  <h1 class="sr-only">HomeFootball - Portal de Fútbol</h1>
  
  <section class="matches">
    <h2 class="matches__title">Partidos Destacados</h2>
    
    <div class="matches__category">
      <h3 class="matches__subtitle">LaLiga</h3>
      <!-- Tarjetas de partidos -->
    </div>
    
    <div class="matches__category">
      <h3 class="matches__subtitle">Premier League</h3>
      <!-- Tarjetas de partidos -->
    </div>
  </section>
  
  <section class="competitions">
    <h2 class="competitions__title">Competiciones a Seguir</h2>
    
    <div class="competitions__region">
      <h3 class="competitions__subtitle">Europa</h3>
      <div class="competitions__list">
        <h4 class="competition-card__title">LaLiga</h4>
        <h4 class="competition-card__title">Premier League</h4>
      </div>
    </div>
  </section>
  
  <section class="news">
    <h2 class="news__title">Últimas Noticias</h2>
    
    <div class="news__category">
      <h3 class="news__subtitle">Fichajes</h3>
      <article class="news__item">
        <h4 class="news__item-title">Real Madrid refuerza su delantera</h4>
        <p>El equipo merengue anuncia incorporación de estrella brasileña...</p>
      </article>
    </div>
  </section>
</main>
```

El `<h1>` usa clase `.sr-only` (screen reader only) para estar presente semánticamente pero oculto visualmente, ya que el logo cumple la función visual del título principal.

### 2.3 Estructura de Formularios

Los formularios utilizan elementos semánticos que mejoran accesibilidad y usabilidad. La estructura incluye `<fieldset>`, `<legend>`, asociación correcta de `<label>` con `<input>`, y mensajes de error contextuales.

#### Uso de `<fieldset>` y `<legend>`

`<fieldset>` agrupa campos relacionados dentro de un formulario. `<legend>` proporciona un título descriptivo para el grupo.

**Ejemplo: Formulario de login**

```html
<form class="login-form" (ngSubmit)="onSubmit()">
  <fieldset class="login-form__fieldset">
    <legend class="login-form__legend">Iniciar sesión</legend>
    
    <div class="login-form__field-group">
      <app-form-input
        label="Usuario"
        name="username"
        type="text"
        [(ngModel)]="formData.username"
        [required]="true"
        [error]="submitted && !formData.username ? 'El usuario es obligatorio' : ''"
        placeholder="Introduce tu usuario">
      </app-form-input>
    </div>
    
    <div class="login-form__field-group">
      <app-form-input
        label="Contraseña"
        name="password"
        type="password"
        [(ngModel)]="formData.password"
        [required]="true"
        [error]="submitted && !formData.password ? 'La contraseña es obligatoria' : ''"
        placeholder="Introduce tu contraseña">
      </app-form-input>
    </div>
    
    <div class="login-form__actions">
      <button type="submit" class="login-form__btn">Iniciar sesión</button>
    </div>
    
    <div class="login-form__footer">
      <p class="login-form__register-text">
        ¿No tienes cuenta? 
        <a href="/registro" class="login-form__register-link">Regístrate aquí</a>
      </p>
    </div>
  </fieldset>
</form>
```

El `<fieldset>` agrupa todos los campos del login. El `<legend>` "Iniciar sesión" describe el propósito del grupo. Esta estructura es especialmente importante para lectores de pantalla, que anuncian el legend al entrar en el fieldset.

#### Componente `form-input` con asociación `<label>` - `<input>`

El componente reutilizable `form-input` implementa la asociación correcta entre label e input usando `for` e `id`.

**Código TypeScript del componente:**

```typescript
@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() disabled: boolean = false;
  
  // Genera ID único para asociación label-input
  inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;
  
  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};
  
  writeValue(value: any): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }
  
  onBlur(): void {
    this.onTouched();
  }
}
```

**Template HTML del componente:**

```html
<div class="form-input" 
     [class.form-input--error]="error" 
     [class.form-input--disabled]="disabled">
  
  <label [for]="inputId" class="form-input__label">
    {{ label }}
    <span *ngIf="required" class="form-input__required" aria-label="Campo obligatorio">*</span>
  </label>
  
  <input
    [id]="inputId"
    [type]="type"
    [name]="name"
    [placeholder]="placeholder"
    [required]="required"
    [disabled]="disabled"
    [value]="value"
    (input)="onInput($event)"
    (blur)="onBlur()"
    class="form-input__field"
    [attr.aria-describedby]="error ? inputId + '-error' : null"
    [attr.aria-invalid]="error ? 'true' : 'false'"
  />
  
  <span *ngIf="error" 
        [id]="inputId + '-error'" 
        class="form-input__error"
        role="alert">
    {{ error }}
  </span>
</div>
```

**Características de accesibilidad:**

1. **Asociación label-input:** El atributo `for` del label apunta al `id` único del input. Esto permite que al hacer clic en el label, el foco vaya al input automáticamente.

2. **ID único:** Se genera un ID aleatorio para cada instancia del componente, evitando conflictos cuando hay múltiples inputs en la página.

3. **Indicador de obligatorio:** El asterisco (*) visual se complementa con `aria-label="Campo obligatorio"` para lectores de pantalla.

4. **Mensajes de error:** Usan `role="alert"` para que lectores de pantalla los anuncien inmediatamente. El atributo `aria-describedby` conecta el input con su mensaje de error.

5. **Estado de error:** `aria-invalid="true"` indica a tecnologías asistivas que el campo tiene un error.

6. **Placeholder:** Proporciona ejemplo de formato esperado pero NO reemplaza al label (accesibilidad).

Esta estructura garantiza que el formulario sea completamente accesible, navegable por teclado y compatible con lectores de pantalla, cumpliendo WCAG 2.1 nivel AA.

---

## 3. Sistema de Componentes UI

### 3.1 Componentes Implementados

Esta sección documenta todos los componentes UI reutilizables creados para el proyecto, siguiendo principios de diseño consistente y accesibilidad.

#### 3.1.1 Button (Botón)

**Propósito:** Componente de botón reutilizable para acciones principales y secundarias en la aplicación.

**Variantes disponibles:**
- `primary` - Botón principal con fondo verde brillante
- `secondary` - Botón secundario con borde
- `ghost` - Botón transparente sin borde
- `danger` - Botón de acción destructiva en rojo

**Tamaños disponibles:**
- `sm` (small) - 32px altura
- `md` (medium) - 40px altura (por defecto)
- `lg` (large) - 48px altura

**Estados que maneja:**
- Normal
- Hover (cambio de color)
- Focus (outline azul para accesibilidad)
- Disabled (opacidad reducida, no clickeable)

**Ejemplo de uso:**
```html
<app-button variant="primary" size="md">Guardar</app-button>
<app-button variant="secondary" size="sm">Cancelar</app-button>
<app-button variant="danger" [disabled]="true">Eliminar</app-button>
```

---

#### 3.1.2 Card (Tarjeta)

**Propósito:** Contenedor visual para agrupar información relacionada con elevación y bordes redondeados.

**Variantes disponibles:**
- Vertical (por defecto) - Imagen arriba, contenido abajo
- Horizontal - Imagen izquierda, contenido derecha

**Configuraciones:**
- Con imagen o sin imagen
- Título opcional
- Descripción opcional
- Slot de contenido para elementos personalizados

**Estados que maneja:**
- Normal
- Hover (elevación aumentada)

**Ejemplo de uso:**
```html
<!-- Card vertical con imagen -->
<app-card
  imageSrc="/assets/partido.jpg"
  imageAlt="Partido de fútbol"
  title="Real Madrid vs Barcelona"
  description="Final de Copa del Rey">
  <app-button size="sm">Ver detalles</app-button>
</app-card>

<!-- Card horizontal sin imagen -->
<app-card
  [horizontal]="true"
  title="Estadísticas del partido"
  description="Análisis completo">
</app-card>
```

---

#### 3.1.3 FormInput (Input de formulario)

**Propósito:** Campo de entrada de texto con validación y estados de error integrados.

**Tipos disponibles:**
- `text` (por defecto)
- `email`
- `password`
- `number`
- `tel`
- `url`

**Estados que maneja:**
- Normal
- Focus (borde resaltado)
- Error (borde rojo, mensaje de error)
- Disabled (gris claro, no editable)
- Required (asterisco rojo)

**Características:**
- Implementa `ControlValueAccessor` para integración con Angular Forms
- Label asociado correctamente
- Mensajes de error con `role="alert"`
- Placeholder opcional

**Ejemplo de uso:**
```html
<app-form-input
  label="Correo electrónico"
  type="email"
  placeholder="tu@email.com"
  [required]="true"
  errorMessage="El email es obligatorio">
</app-form-input>
```

---

#### 3.1.4 FormTextarea (Área de texto)

**Propósito:** Campo de entrada multilínea para textos largos como comentarios o descripciones.

**Configuraciones:**
- Altura ajustable mediante `rows`
- Texto de ayuda opcional
- Validación integrada

**Estados que maneja:**
- Normal
- Focus
- Error
- Disabled

**Características:**
- Resize vertical permitido
- `ControlValueAccessor` implementado
- Contador de caracteres opcional

**Ejemplo de uso:**
```html
<app-form-textarea
  label="Comentario"
  placeholder="Escribe tu opinión..."
  [rows]="4"
  helpText="Máximo 500 caracteres">
</app-form-textarea>
```

---

#### 3.1.5 FormSelect (Selector desplegable)

**Propósito:** Menú desplegable para seleccionar una opción de una lista predefinida.

**Configuraciones:**
- Lista de opciones mediante interface `SelectOption[]`
- Placeholder personalizable
- Icono de chevron animado

**Estados que maneja:**
- Normal
- Focus
- Error
- Disabled
- Open/Closed (estado del desplegable)

**Interfaz de opciones:**
```typescript
interface SelectOption {
  value: string | number;
  label: string;
}
```

**Ejemplo de uso:**
```html
<app-form-select
  label="Competición"
  [options]="competiciones"
  placeholder="Selecciona una liga">
</app-form-select>
```

```typescript
competiciones: SelectOption[] = [
  { value: 'laliga', label: 'La Liga' },
  { value: 'premier', label: 'Premier League' },
  { value: 'serie-a', label: 'Serie A' }
];
```

---

#### 3.1.6 FormCheckbox (Casilla de verificación)

**Propósito:** Control para opciones binarias (sí/no, activado/desactivado).

**Características visuales:**
- Borde negro de 2px siempre visible
- Tick negro cuando está seleccionado
- Fondo blanco en todos los estados
- Transición suave de opacidad

**Estados que maneja:**
- Unchecked (sin marcar)
- Checked (marcado con tick negro)
- Disabled
- Focus (sin shadow, solo outline sutil)

**Características:**
- `ControlValueAccessor` implementado
- Label clickeable
- Texto de ayuda opcional
- SVG personalizado para el tick

**Ejemplo de uso:**
```html
<app-form-checkbox
  label="Acepto los términos y condiciones"
  helpText="Debes aceptar para continuar">
</app-form-checkbox>

<app-form-checkbox
  label="Recordarme"
  [disabled]="false">
</app-form-checkbox>
```

---

#### 3.1.7 FormRadioGroup (Grupo de botones de radio)

**Propósito:** Selector de opción única entre múltiples alternativas mutuamente excluyentes.

**Configuraciones:**
- Lista de opciones mediante interface `RadioOption[]`
- Layout vertical (por defecto) o inline (horizontal)

**Características visuales:**
- Borde negro de 2px siempre visible
- Círculo interior azul celeste (#00BFFF) cuando está seleccionado
- Fondo blanco en todos los estados

**Estados que maneja:**
- Unselected
- Selected (círculo azul celeste interior)
- Disabled
- Focus (shadow azul celeste sutil)

**Interfaz de opciones:**
```typescript
interface RadioOption {
  value: string | number;
  label: string;
}
```

**Ejemplo de uso:**
```html
<!-- Layout vertical -->
<app-form-radio-group
  label="Género"
  [options]="generos">
</app-form-radio-group>

<!-- Layout horizontal -->
<app-form-radio-group
  label="Tipo de suscripción"
  [options]="suscripciones"
  [inline]="true">
</app-form-radio-group>
```

```typescript
generos: RadioOption[] = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' }
];
```

---

#### 3.1.8 Alert (Alerta/Mensaje)

**Propósito:** Mostrar mensajes de retroalimentación al usuario sobre el resultado de acciones.

**Variantes disponibles:**
- `success` - Verde, para operaciones exitosas
- `error` - Rojo, para errores y problemas
- `warning` - Naranja, para advertencias
- `info` - Azul, para información general

**Características:**
- Icono automático según variante
- Dismissible opcional (botón X para cerrar)
- Animación de slide-in al aparecer
- Animación de fade-out al cerrar

**Estados que maneja:**
- Visible
- Oculto (tras cerrar con X)

**Ejemplo de uso:**
```html
<app-alert variant="success">
  ¡Cambios guardados correctamente!
</app-alert>

<app-alert variant="error" [dismissible]="true">
  Error al conectar con el servidor
</app-alert>

<app-alert variant="warning">
  Esta acción no se puede deshacer
</app-alert>

<app-alert variant="info">
  Recuerda verificar tu correo electrónico
</app-alert>
```

---

#### 3.1.9 Badge (Insignia/Etiqueta)

**Propósito:** Pequeñas etiquetas para mostrar estados, categorías, contadores o metadatos.

**Variantes disponibles:**
- `primary` - Azul marino
- `secondary` - Gris
- `success` - Verde
- `warning` - Naranja
- `danger` - Rojo
- `info` - Azul claro

**Tamaños disponibles:**
- `sm` (small) - 12px font
- `md` (medium) - 14px font (por defecto)
- `lg` (large) - 16px font

**Configuraciones:**
- `rounded` - Para badges circulares (contadores)

**Ejemplo de uso:**
```html
<!-- Estados -->
<app-badge variant="success">Activo</app-badge>
<app-badge variant="danger">Suspendido</app-badge>

<!-- Categorías -->
<app-badge variant="primary" size="sm">Fútbol</app-badge>
<app-badge variant="info" size="sm">Destacado</app-badge>

<!-- Contadores circulares -->
<app-badge variant="danger" [rounded]="true">99+</app-badge>
<app-badge variant="secondary" [rounded]="true">5</app-badge>
```

---

#### 3.1.10 DataTable (Tabla Responsive)

**Propósito:** Mostrar datos tabulares que se adaptan a diferentes tamaños de pantalla con dos estrategias: cards en mobile o scroll horizontal.

**Modos responsive:**
- `cards` - Convierte la tabla en cards en dispositivos móviles
- `scroll` - Mantiene la tabla con scroll horizontal en mobile

**Características:**
- Ordenamiento (sort) por columnas configurables
- Filas rayadas (striped) opcional
- Hover effect opcional
- Tipos de datos: text, number, date, badge
- Totalmente responsive

**Interfaz de columnas:**
```typescript
interface TableColumn {
  key: string;           // Clave de la propiedad en los datos
  label: string;         // Texto del encabezado
  sortable?: boolean;    // Si la columna es ordenable
  type?: 'text' | 'number' | 'date' | 'badge';
}
```

**Ejemplo de uso:**
```html
<!-- Modo cards en mobile -->
<app-data-table
  [columns]="tableColumns"
  [data]="tableData"
  [responsive]="'cards'"
  [striped]="true"
  [hoverable]="true">
</app-data-table>

<!-- Modo scroll horizontal -->
<app-data-table
  [columns]="tableColumns"
  [data]="tableData"
  [responsive]="'scroll'"
  [striped]="false"
  [hoverable]="true">
</app-data-table>
```

```typescript
tableColumns: TableColumn[] = [
  { key: 'equipo', label: 'Equipo', sortable: true },
  { key: 'puntos', label: 'Puntos', sortable: true, type: 'number' },
  { key: 'estado', label: 'Estado', sortable: false, type: 'badge' }
];

tableData: TableData[] = [
  { equipo: 'FC Barcelona', puntos: 45, estado: 'Activo' },
  { equipo: 'Real Madrid', puntos: 42, estado: 'Activo' }
];
```

---

#### 3.1.11 Pagination (Paginación)

**Propósito:** Controles de navegación para dividir contenido en múltiples páginas.

**Configuraciones disponibles:**
- `currentPage` - Número de página actual
- `totalPages` - Total de páginas disponibles
- `maxVisiblePages` - Máximo de números de página visibles (default: 5)
- `showFirstLast` - Mostrar botones de primera/última página
- `showPrevNext` - Mostrar botones anterior/siguiente

**Características:**
- Elipsis automáticas cuando hay muchas páginas
- Botones con iconos SVG
- Estados disabled para primera/última página
- Evento de cambio de página
- Totalmente responsive (se adapta a móviles)

**Ejemplo de uso:**
```html
<!-- Paginación completa -->
<app-pagination
  [currentPage]="currentPage"
  [totalPages]="totalPages"
  [maxVisiblePages]="5"
  [showFirstLast]="true"
  [showPrevNext]="true"
  (pageChange)="onPageChange($event)">
</app-pagination>

<!-- Paginación simple -->
<app-pagination
  [currentPage]="3"
  [totalPages]="10"
  [showFirstLast]="false"
  [showPrevNext]="true"
  (pageChange)="onPageChange($event)">
</app-pagination>
```

```typescript
currentPage: number = 1;
totalPages: number = 10;

onPageChange(page: number): void {
  this.currentPage = page;
  // Cargar datos de la nueva página
}
```

---

### 3.2 Nomenclatura y Metodología BEM

La metodología BEM (Block Element Modifier) se aplica consistentemente en todos los componentes para mantener un CSS escalable y predecible.

#### Estructura BEM

**Block (Bloque):** Componente independiente y reutilizable.
```scss
.button { }
.card { }
.form-input { }
```

**Element (Elemento):** Parte de un bloque que no tiene sentido fuera de él.
```scss
.button__icon { }
.card__title { }
.form-input__label { }
```

**Modifier (Modificador):** Variación o estado de un bloque o elemento.
```scss
.button--primary { }
.card--horizontal { }
.form-input--error { }
```

#### Ejemplos Reales del Proyecto

**1. Componente Button:**
```scss
// Block
.button {
  display: inline-flex;
  padding: 10px 20px;
  border-radius: 8px;
}

// Elements
.button__icon {
  margin-right: 8px;
}

// Modifiers - Variantes
.button--primary {
  background-color: var(--color-accent);
  color: white;
}

.button--secondary {
  background-color: transparent;
  border: 2px solid var(--color-header);
}

.button--ghost {
  background-color: transparent;
}

// Modifiers - Tamaños
.button--sm {
  padding: 6px 12px;
  font-size: 14px;
}

.button--lg {
  padding: 14px 28px;
  font-size: 18px;
}

// Modifiers - Estados
.button--disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

**2. Componente Card:**
```scss
// Block
.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

// Elements
.card__image {
  width: 100%;
  border-radius: 12px 12px 0 0;
}

.card__content {
  padding: 20px;
}

.card__title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card__description {
  color: var(--color-text-secondary);
  font-size: 14px;
}

// Modifier - Layout
.card--horizontal {
  display: flex;
  
  .card__image {
    border-radius: 12px 0 0 12px;
    max-width: 200px;
  }
}
```

**3. Componente FormCheckbox:**
```scss
// Block
.form-checkbox {
  display: flex;
  flex-direction: column;
}

// Elements
.form-checkbox__label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.form-checkbox__input {
  position: absolute;
  opacity: 0;
}

.form-checkbox__checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  border-radius: 4px;
}

.form-checkbox__icon {
  display: block;
  opacity: 0;
}

.form-checkbox__text {
  margin-left: 8px;
  font-size: 16px;
}

// Modifier - Estado
.form-checkbox--disabled {
  opacity: 0.6;
  pointer-events: none;
}
```

#### Estrategia: Block vs Element vs Modifier

**¿Cuándo usar Block?**
- Cuando el componente puede existir independientemente
- Puede reutilizarse en diferentes contextos
- Ejemplo: `.button`, `.card`, `.alert`

**¿Cuándo usar Element?**
- Cuando la parte solo tiene sentido dentro del bloque
- No se reutiliza fuera del contexto del bloque
- Siempre usa doble guion bajo `__`
- Ejemplo: `.card__title` (solo existe dentro de `.card`)

**¿Cuándo usar Modifier?**
- Para variantes de estilo del bloque
- Para diferentes estados (hover, active, disabled)
- Para tamaños (sm, md, lg)
- Siempre usa doble guion `--`
- Ejemplo: `.button--primary`, `.button--disabled`

**Clases de Estado vs Modifiers:**

En este proyecto usamos **modifiers de BEM** para estados predecibles:
```scss
.button--disabled { }  // ✅ BEM modifier
.form-input--error { } // ✅ BEM modifier
```

En lugar de clases de estado globales:
```scss
.is-disabled { }  // ❌ Evitado
.has-error { }    // ❌ Evitado
```

**Ventajas de esta estrategia:**
1. **Especificidad predecible:** No hay conflictos de nombres
2. **Encapsulación:** Los estilos están aislados por componente
3. **Mantenibilidad:** Fácil localizar estilos relacionados
4. **Escalabilidad:** Puedes añadir componentes sin afectar los existentes

---

### 3.3 Style Guide

El Style Guide es una página especial creada para documentar visualmente todos los componentes UI del proyecto.

**Propósito:**
1. **Documentación visual:** Muestra todos los componentes con todas sus variantes, tamaños y estados en un solo lugar
2. **Testing visual:** Permite verificar rápidamente que todos los componentes se renderizan correctamente
3. **Referencia para desarrolladores:** Guía para saber qué componentes existen y cómo usarlos
4. **QA y diseño:** Facilita la revisión de consistencia visual y detección de bugs de estilo

**Estructura del Style Guide:**

La página está organizada en secciones temáticas:

1. **Botones:** Muestra las 4 variantes (primary, secondary, ghost, danger) en 3 tamaños (sm, md, lg) y estados (normal, disabled)

2. **Cards:** Presenta tarjetas verticales y horizontales, con y sin imagen

3. **Formularios:** Exhibe todos los elementos de formulario:
   - Input (normal, required, con error, disabled)
   - Textarea
   - Select con opciones
   - Checkbox
   - Radio Group (vertical e inline)

4. **Feedback:** Componentes de retroalimentación al usuario:
   - Alerts en 4 variantes (success, error, warning, info)
   - Badges en 6 variantes y 3 tamaños

5. **Tabla Responsive:** Tablas que se adaptan a mobile con dos modos:
   - Cards: Convierte la tabla en cards en dispositivos móviles
   - Scroll: Mantiene la tabla con scroll horizontal
   - Funcionalidad de ordenamiento por columnas

6. **Paginación:** Controles de navegación con:
   - Botones de primera/última página
   - Botones anterior/siguiente
   - Números de página con elipsis automáticas
   - Tres configuraciones: completa, simple y mínima

7. **Tipografía:** Muestra la escala tipográfica (H1-H6, párrafos)

8. **Colores:** Paleta de colores con códigos hexadecimales

**Características técnicas:**
- Ruta: `/style-guide`
- Header idéntico a la página principal para consistencia
- Secciones con sombreado diferenciado para mejor organización visual
- Subsecciones con fondo gris claro y borde izquierdo verde
- Responsive: Se adapta a móvil, tablet y desktop

**Capturas de pantalla del Style Guide:**

![Vista general del Style Guide mostrando el header y la sección de botones](images/cap1.png)

![Sección de Cards mostrando tarjetas verticales y horizontales](images/cap2.png)

![Sección de Formularios con todos los inputs, checkbox y radio buttons](images/cap3.png)

![Sección de Feedback con las 4 variantes de Alert](images/cap4.png)

![Sección de Badges mostrando todas las variantes y tamaños](images/cap5.png)

![Vista móvil del Style Guide demostrando responsividad](images/cap6.png)

**Beneficios del Style Guide:**
- Ahorra tiempo al buscar componentes existentes
- Evita duplicación de código al reutilizar componentes
- Detecta inconsistencias visuales rápidamente
- Facilita onboarding de nuevos desarrolladores
- Sirve como documentación viva que siempre está actualizada

---