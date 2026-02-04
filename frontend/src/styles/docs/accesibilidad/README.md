# Documentación de Accesibilidad - HomeFootball

## Índice

1. [Fundamentos de accesibilidad](#1-fundamentos-de-accesibilidad)
2. [Componente multimedia implementado](#2-componente-multimedia-implementado)
3. [Auditoría automatizada inicial](#3-auditoría-automatizada-inicial)
4. [Análisis y corrección de errores](#4-análisis-y-corrección-de-errores)
5. [Análisis de estructura semántica](#5-análisis-de-estructura-semántica)
6. [Verificación manual](#6-verificación-manual)
7. [Resultados finales después de correcciones](#7-resultados-finales-después-de-correcciones)
8. [Conclusiones y reflexión](#8-conclusiones-y-reflexión)

---

## 1. Fundamentos de accesibilidad

### ¿Por qué es necesaria la accesibilidad web?

La accesibilidad web garantiza que todas las personas, independientemente de sus capacidades, puedan acceder y utilizar los contenidos digitales. Esto incluye usuarios con discapacidades visuales (ceguera, baja visión), auditivas (sordera), motoras (dificultad para usar ratón) y cognitivas (dislexia, TDAH). Además de beneficiar a estos colectivos, la accesibilidad mejora la experiencia para todos los usuarios, como personas mayores o quienes usan dispositivos móviles en condiciones adversas. En España y Europa, la accesibilidad web es obligatoria según la Directiva (UE) 2016/2102 y el Real Decreto 1112/2018.

### Los 4 principios de WCAG 2.1

Las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 se basan en cuatro principios fundamentales:

1. **Perceptible:** La información y los componentes de la interfaz deben presentarse de forma que los usuarios puedan percibirlos.
   - *Ejemplo en el proyecto:* Los escudos de los equipos en el carrusel de partidos tienen atributos `alt` descriptivos con el nombre del equipo para usuarios que utilizan lectores de pantalla.

2. **Operable:** Los componentes de la interfaz y la navegación deben ser operables por todos los usuarios.
   - *Ejemplo en el proyecto:* El carrusel de partidos puede navegarse completamente con las teclas de flecha izquierda y derecha, sin necesidad de usar el ratón.

3. **Comprensible:** La información y el funcionamiento de la interfaz de usuario deben ser comprensibles.
   - *Ejemplo en el proyecto:* Los botones del carrusel tienen etiquetas claras como "Ver partidos anteriores" y "Ver siguientes partidos" que describen exactamente su función.

4. **Robusto:** El contenido debe ser lo suficientemente robusto para ser interpretado por una amplia variedad de agentes de usuario, incluidas las tecnologías de asistencia.
   - *Ejemplo en el proyecto:* Se utilizan roles ARIA semánticos como `role="region"`, `role="tablist"` y `aria-roledescription="carrusel"` para asegurar compatibilidad con diferentes lectores de pantalla.

### Niveles de conformidad

WCAG define tres niveles de conformidad:

| Nivel | Descripción |
|-------|-------------|
| **A** | Nivel mínimo de accesibilidad. Requisitos básicos que deben cumplirse para que el contenido sea accesible. |
| **AA** | Nivel intermedio recomendado. Aborda las barreras más significativas para usuarios con discapacidad. Es el nivel exigido legalmente en España y la UE. |
| **AAA** | Nivel máximo de accesibilidad. Incluye mejoras adicionales, aunque no siempre es posible alcanzarlo para todo el contenido. |

**Objetivo del proyecto:** El proyecto HomeFootball tiene como meta alcanzar el **nivel AA de conformidad**, cumpliendo con los requisitos legales europeos y garantizando una experiencia accesible para la mayoría de usuarios.

### Recursos consultados

- [W3C WAI - Introducción a la Accesibilidad Web](https://www.w3.org/WAI/fundamentals/accessibility-intro/es)
- [Accesible.es - Portal de accesibilidad](https://accesible.es)
- [WCAG 2.1 - Pautas completas](https://www.w3.org/TR/WCAG21/)

---

## 2. Componente multimedia implementado

### Tipo de componente

**Carrusel de partidos** (`MatchCarousel`)

### Descripción breve

El carrusel de partidos es un componente interactivo que muestra los partidos principales de la jornada en formato horizontal deslizable. Permite a los usuarios navegar entre diferentes partidos mostrando información clave como equipos, marcador y estado del partido (en vivo, finalizado, programado). El carrusel incluye navegación automática con pausa inteligente y soporte completo para navegación manual.

### Características de accesibilidad implementadas

| Característica | Implementación | Beneficio |
|----------------|----------------|-----------|
| **Roles ARIA semánticos** | `role="region"`, `aria-roledescription="carrusel"`, `role="tablist"` en indicadores | Los lectores de pantalla identifican correctamente el componente como un carrusel interactivo |
| **Navegación por teclado** | Soporte para `ArrowLeft` y `ArrowRight` mediante `@HostListener` | Usuarios que no pueden usar ratón pueden navegar completamente con teclado |
| **Textos alternativos descriptivos** | `[alt]="match.homeTeam"` en imágenes de escudos | Usuarios ciegos conocen qué equipo representa cada escudo |
| **Etiquetas accesibles en botones** | `aria-label="Ver partidos anteriores"`, `aria-label="Ver siguientes partidos"` | El propósito de cada botón es claro sin depender del contexto visual |
| **Pausa automática en interacción** | Auto-play se pausa con `mouseenter`, `focusin` | Usuarios con discapacidad cognitiva o motora tienen tiempo suficiente para leer el contenido |
| **Región live para anuncios** | `<div aria-live="polite" aria-atomic="true">` | Los cambios de slide se anuncian a usuarios de lectores de pantalla |
| **Indicadores de posición accesibles** | `role="tab"`, `aria-selected`, `aria-label` descriptivo | Los usuarios saben en qué posición del carrusel se encuentran |
| **Elementos decorativos ocultos** | `aria-hidden="true"` en placeholders y puntos decorativos | No se confunde a los usuarios con elementos que no aportan información |

### Código relevante de accesibilidad

```html
<!-- Estructura principal del carrusel -->
<section 
  role="region"
  aria-roledescription="carrusel"
  [attr.aria-label]="title"
  (focusin)="pauseAutoPlay()"
  (focusout)="resumeAutoPlay()"
>
```

```html
<!-- Tarjeta de partido accesible -->
<article 
  tabindex="0"
  role="button"
  [attr.aria-label]="match.homeTeam + ' contra ' + match.awayTeam"
  (keydown.enter)="goToMatch(match.id)"
>
```

```typescript
// Navegación por teclado
@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      this.previous();
      break;
    case 'ArrowRight':
      event.preventDefault();
      this.next();
      break;
  }
}
```

---

## 3. Auditoría automatizada inicial

### Herramientas utilizadas

Se han ejecutado tres herramientas de análisis de accesibilidad para obtener una evaluación inicial del estado del proyecto:

#### Lighthouse (Chrome DevTools)
- **Acceso:** F12 → pestaña "Lighthouse" → marcar solo "Accessibility" → "Analyze page load"
- **Funcionalidad:** Analiza automáticamente la página en busca de problemas de accesibilidad según estándares WCAG

#### WAVE (Web Accessibility Evaluation Tool)
- **Extensión:** [https://wave.webaim.org/extension/](https://wave.webaim.org/extension/)
- **Funcionalidad:** Proporciona feedback visual sobre errores y alertas de accesibilidad directamente en la página

#### TAW (Test de Accesibilidad Web)
- **Plataforma:** [https://www.tawdis.net/?lang=es](https://www.tawdis.net/?lang=es)
- **Funcionalidad:** Análisis completo de conformidad con WCAG 2.1 niveles A, AA y AAA

### Resultados del análisis

| Herramienta | Puntuación/Errores | Captura |
|-------------|-------------------|---------|
| **Lighthouse** | 93/100 | ![Lighthouse inicial](./capturas/lighthouse-antes.png) |
| **WAVE** | 0 errores, 3 alertas | ![WAVE inicial](./capturas/wave-antes.png) |
| **TAW** | 10 errores críticos, 26 alertas | ![TAW](./capturas/taw.png) |

### Problemas más graves detectados

Las herramientas de análisis automatizado han identificado los siguientes problemas prioritarios según el informe TAW:

#### 1. Controles de formulario sin etiquetar
- **Herramienta que lo detecta:** TAW
- **Descripción:** Múltiples controles de formulario carecen de etiquetas asociadas (`<label>`) o atributos descriptivos apropiados
- **Impacto:** Los usuarios de lectores de pantalla no pueden identificar el propósito de los campos de formulario, dificultando enormemente la navegación e interacción
- **Criterio WCAG:** 1.3.1 Información y relaciones (Nivel A), 4.1.2 Nombre, función, valor (Nivel A)

#### 2. Ausencia de encabezado principal (h1)
- **Herramienta que lo detecta:** TAW  
- **Descripción:** La página no contiene un elemento `<h1>` que identifique claramente el contenido principal
- **Impacto:** Los usuarios con tecnologías de asistencia pierden la referencia jerárquica de la página, dificultando la comprensión de la estructura del contenido
- **Criterio WCAG:** 1.3.1 Información y relaciones (Nivel A)

#### 3. Enlaces sin contenido
- **Herramienta que lo detecta:** TAW
- **Descripción:** Se detectaron 4 enlaces que no contienen texto descriptivo o alternativo que indique su destino
- **Impacto:** Los usuarios de lectores de pantalla no pueden determinar el propósito del enlace, especialmente problemático durante la navegación por elementos
- **Criterio WCAG:** 2.4.4 Propósito de los enlaces en contexto (Nivel A)

### Problemas adicionales identificados

| Tipo de problema | Cantidad | Nivel de gravedad | Criterio WCAG |
|------------------|----------|-------------------|---------------|
| **Imágenes sin descripción larga** | 21 alertas | Medio | 1.1.1 Contenido no textual |
| **Contenido generado por CSS** | 1 alerta | Medio | 1.3.1 Información y relaciones |
| **Encabezados y etiquetas inadecuados** | 3 alertas | Medio | 2.4.6 Encabezados y etiquetas |
| **Orden lógico de navegación** | 1 advertencia | Bajo | 2.4.3 Orden del foco |
| **Múltiples medios de localización** | 1 advertencia | Bajo | 2.4.5 Múltiples vías |

### Resumen de la evaluación

- **Total de problemas críticos:** 10 errores que deben corregirse para conformidad básica
- **Total de alertas y advertencias:** 26 elementos que requieren revisión
- **Áreas prioritarias:** Formularios, estructura semántica y navegación por enlaces

### Siguiente paso: Análisis detallado

Los resultados de esta auditoría automatizada servirán como línea base para:
- Identificar las áreas de mejora prioritarias
- Planificar las correcciones necesarias
- Realizar un análisis manual más profundo
- Verificar el progreso tras implementar las mejoras

**Nota:** Los análisis automatizados detectan aproximadamente el 30-40% de los problemas de accesibilidad. Es necesario completar con análisis manual y pruebas con usuarios reales.

---

## 4. Análisis y corrección de errores

### Tabla resumen de errores corregidos

| # | Error | Criterio WCAG | Herramienta | Solución aplicada |
|---|-------|---------------|-------------|-------------------|
| 1 | Controles de formulario sin etiquetas | 1.3.1, 4.1.2 | TAW | Añadidos atributos `aria-label` y `aria-describedby` |
| 2 | Ausencia de encabezado h1 | 1.3.1 | TAW | Añadido h1 oculto visualmente en página principal |
| 3 | Enlaces sin contenido descriptivo | 2.4.4 | TAW | Mejorados `aria-label` en enlaces de navegación |
| 4 | Referencia ARIA rota | 4.1.2 | WAVE | Sustituido `aria-labelledby` por `aria-label` directo |
| 5 | Imágenes sin texto alternativo | 1.1.1 | TAW | Añadidos atributos `alt` descriptivos |

### Detalle de errores corregidos

#### Error #1: Controles de formulario sin etiquetas

**Problema:** Los campos de búsqueda y otros formularios carecían de etiquetas asociadas (`<label>`) o atributos ARIA descriptivos.
**Impacto:** Usuarios de lectores de pantalla no pueden identificar el propósito de los campos de entrada.
**Criterio WCAG:** 1.3.1 Información y relaciones (Nivel A), 4.1.2 Nombre, función, valor (Nivel A)

**Código ANTES:**
```html
<input 
  type="search" 
  class="main__search-input" 
  placeholder="Buscar equipos, ligas, jugadores..."
>
```

**Código DESPUÉS:**
```html
<input 
  type="search" 
  class="main__search-input" 
  placeholder="Buscar equipos, ligas, jugadores..."
  aria-label="Buscar contenido"
>
```

#### Error #2: Ausencia de encabezado principal (h1)

**Problema:** La página principal no contenía un elemento `<h1>` que identificara claramente el contenido principal.
**Impacto:** Los usuarios pierden la referencia jerárquica de la página, dificultando la comprensión de la estructura.
**Criterio WCAG:** 1.3.1 Información y relaciones (Nivel A)

**Código ANTES:**
```html
<main class="main">
  <!-- Sin encabezado principal -->
  <section class="main__container">
```

**Código DESPUÉS:**
```html
<main class="main">
  <h1 class="visually-hidden">HomeFootball - Portal de fútbol</h1>
  <section class="main__container">
```

#### Error #3: Enlaces sin contenido descriptivo

**Problema:** Enlaces de navegación y social media con texto insuficiente o genérico.
**Impacto:** Usuarios de lectores de pantalla no pueden determinar el destino del enlace.
**Criterio WCAG:** 2.4.4 Propósito de los enlaces en contexto (Nivel A)

**Código ANTES:**
```html
<a href="https://twitter.com" target="_blank">
  <svg>...</svg>
</a>
```

**Código DESPUÉS:**
```html
<a 
  href="https://twitter.com" 
  target="_blank" 
  rel="noopener noreferrer"
  aria-label="Síguenos en Twitter"
>
  <svg>...</svg>
</a>
```

#### Error #4: Referencia ARIA rota

**Problema:** El atributo `aria-labelledby="matches-heading"` apuntaba a un ID que no siempre existía en el DOM.
**Impacto:** Lectores de pantalla no pueden localizar la referencia, causando confusión.
**Criterio WCAG:** 4.1.2 Nombre, función, valor (Nivel A)

**Código ANTES:**
```html
<section class="matches" aria-labelledby="matches-heading">
  @if (matches().length > 0) {
    <!-- matches-heading solo existe en @else -->
```

**Código DESPUÉS:**
```html
<section class="matches" aria-label="Partidos principales">
  @if (matches().length > 0) {
    <!-- Referencia directa sin dependencias -->
```

#### Error #5: Imágenes sin texto alternativo

**Problema:** Múltiples imágenes de escudos y logos carecían de atributos `alt` descriptivos.
**Impacto:** Usuarios ciegos no pueden identificar el contenido visual de las imágenes.
**Criterio WCAG:** 1.1.1 Contenido no textual (Nivel A)

**Código ANTES:**
```html
<img src="assets/images/teams/barcelona.png" class="team-logo">
```

**Código DESPUÉS:**
```html
<img 
  src="assets/images/teams/barcelona.png" 
  alt="FC Barcelona"
  class="team-logo"
  loading="lazy"
>
```

---

## 5. Análisis de estructura semántica

### Landmarks HTML5 utilizados

Evaluación de elementos semánticos implementados en el proyecto:

- [x] `<header>` - Cabecera del sitio con navegación principal y logo
- [x] `<nav>` - Menú de navegación principal y navegación de redes sociales
- [x] `<main>` - Contenido principal de cada página
- [x] `<article>` - Usado para tarjetas de partidos en el carrusel
- [x] `<section>` - Usado para agrupar contenido relacionado (competiciones, matches, etc.)
- [x] `<aside>` - Sidebar de noticias en la página principal
- [x] `<footer>` - Pie de página con enlaces a redes sociales

### Jerarquía de encabezados

La estructura jerárquica de encabezados en la página principal es la siguiente:

```
H1: HomeFootball - Portal de fútbol (oculto visualmente)
  H2: Competiciones a seguir
  H2: Noticias (sidebar)
  H2: Partidos principales (título del carrusel)
```

**Estado:** ⚠️ **Parcialmente correcta con mejoras necesarias**
- ✅ Tiene H1 principal (añadido para accesibilidad)
- ✅ Los H2 están bien jerarquizados
- ⚠️ Faltan H3 para subsecciones específicas
- ⚠️ Algunas páginas secundarias necesitan revisión jerárquica

### Análisis de imágenes

| Tipo de imagen | Cantidad | Estado |
|----------------|----------|---------|
| **Total de imágenes** | ~45 | Revisadas |
| **Con texto alternativo** | 38 | ✅ Corregido |
| **Decorativas (alt="")** | 5 | ✅ Apropiado |
| **Sin alt (corregidas)** | 7 | ✅ Añadido alt descriptivo |

#### Desglose por categorías:

**Imágenes funcionales:**
- Logo del sitio: `alt="HomeFootball"`
- Escudos de equipos: `alt="[Nombre del equipo]"`
- Iconos de navegación: `aria-label` descriptivo

**Imágenes decorativas:**
- Elementos gráficos de fondo: `alt=""` o `aria-hidden="true"`
- Separadores visuales: Manejados por CSS

**Imágenes informativas:**
- Capturas de análisis: `alt="Resultados de [herramienta]"`
- Diagramas: Textos alternativos descriptivos del contenido

### Mejoras implementadas en estructura semántica

1. **Landmarks mejorados:** Añadidos `aria-label` específicos a elementos `<nav>` y `<section>`
2. **Jerarquía de encabezados:** Incorporado H1 principal oculto visualmente
3. **Semántica de listas:** Carrusel implementado con `<ul>` y `<li>` apropiados
4. **Roles ARIA:** Añadidos roles específicos como `role="region"` y `role="tablist"`

**Estado general:** ✅ **Estructura semántica robusta** con mejoras significativas en accesibilidad

**Criterio evaluado:** RA5.b

---

## 6. Verificación manual

### 6.1 Test de navegación por teclado

Se ha realizado una prueba completa de navegación usando exclusivamente el teclado (sin ratón):

#### Checklist de navegación por teclado

- [x] Puedo llegar a todos los enlaces y botones con Tab
- [x] El orden de navegación con Tab es lógico (no salta caóticamente)
- [x] Veo claramente qué elemento tiene el focus (borde, sombra, color)
- [x] Puedo usar mi componente multimedia solo con teclado
- [x] No hay "trampas" de teclado donde quedo bloqueado
- [x] Los menús/modals se pueden cerrar con Esc (si aplica)

#### Problemas encontrados

1. **Indicador de focus poco visible en algunos botones:** El outline predeterminado del navegador era difícil de ver en ciertos fondos.
2. **Orden de tabulación en el footer:** Los enlaces de redes sociales se tabulaban antes del copyright.

#### Soluciones aplicadas

1. **Focus visible mejorado:** Añadido estilo personalizado `:focus-visible` con outline de alto contraste:
```css
:focus-visible {
  outline: 3px solid var(--color-focus, #4a90d9);
  outline-offset: 2px;
}
```

2. **Orden del DOM corregido:** Reorganizado el HTML del footer para que el flujo de navegación sea lógico (navegación social → copyright).

3. **Navegación por teclado en carrusel:** Implementados handlers para `ArrowLeft` y `ArrowRight` que permiten navegar entre slides sin usar el ratón.

### 6.2 Test con lector de pantalla

**Herramienta utilizada:** NVDA 2024.1 (Windows)
**Descarga:** [https://www.nvaccess.org/](https://www.nvaccess.org/)

#### Pasos realizados:
1. Abierto el lector de pantalla NVDA
2. Navegado la web completa usando Tab
3. Escuchado qué anuncia el lector en cada elemento
4. Probado específicamente el carrusel de partidos (componente multimedia)

#### Resultados de la evaluación

| Aspecto evaluado | Resultado | Observación |
|------------------|-----------|-------------|
| ¿Se entiende la estructura sin ver la pantalla? | ✅ | H1 oculto visualmente anuncia "HomeFootball - Portal de fútbol", estructura con `<header>`, `<main>`, `<nav>`, `<footer>` correcta |
| ¿Los landmarks se anuncian correctamente? | ✅ | `nav aria-label="Navegación principal"`, `aria-label="Redes sociales"`, `role="search"`, `role="region"` en carrusel se anuncian correctamente |
| ¿Las imágenes tienen descripciones adecuadas? | ✅ | Logo con `alt="HomeFootball"`, iconos decorativos con `aria-hidden="true"`, escudos de equipos con nombre del equipo |
| ¿Los enlaces tienen textos descriptivos? | ✅ | Todos los enlaces tienen `aria-label` descriptivo: "Ir a Favoritos", "Ver competición LaLiga", "Leer noticia: [título]" |
| ¿El componente multimedia es accesible? | ✅ | Carrusel con `aria-roledescription="carrusel"`, flechas con `aria-label`, indicadores con `role="tablist"`, región `aria-live` para anuncios |

#### Principales problemas detectados

1. **Modal sin `aria-labelledby`**: El diálogo modal no tenía vinculación con el título del formulario, por lo que NVDA no anunciaba el propósito del modal al abrirlo.

2. **Formulario de registro sin `aria-describedby`**: Los inputs no estaban vinculados a los mensajes de error, por lo que los usuarios de lectores de pantalla no sabían qué campo tenía error ni cuál era el mensaje.

3. **Indicadores de contraseña sin retroalimentación**: El indicador de fortaleza de contraseña no anunciaba el estado de cada requisito (cumplido/pendiente), haciendo imposible para usuarios ciegos saber si cumplían los requisitos.

#### Mejoras aplicadas

1. **Modal mejorado con ARIA**: 
   - Añadido `aria-labelledby="modal-title"` para vincular el modal con su título
   - Añadido `aria-describedby="modal-content"` para describir el contenido
   - Ahora NVDA anuncia: "Diálogo, Iniciar sesión" al abrir el modal

   ```html
   <!-- ANTES -->
   <section class="modal" role="dialog" aria-modal="true">
   
   <!-- DESPUÉS -->
   <section class="modal" role="dialog" aria-modal="true"
     aria-labelledby="modal-title"
     aria-describedby="modal-content">
   ```

2. **Formulario de registro con vinculación de errores**:
   - Añadido `aria-describedby` vinculando inputs con mensajes de error
   - Añadido `role="alert"` a mensajes de error para anuncio automático
   - Añadido `aria-invalid` dinámico en campos con error
   - Añadido `autocomplete` para mejor experiencia de usuario
   
   ```html
   <!-- ANTES -->
   <input type="email" id="reg-email" formControlName="email" />
   @if (isFieldInvalid('email')) {
     <span class="register-form__error">{{ getErrorMessage('email') }}</span>
   }
   
   <!-- DESPUÉS -->
   <input type="email" id="reg-email" formControlName="email"
     autocomplete="email"
     [attr.aria-invalid]="isFieldInvalid('email')"
     [attr.aria-describedby]="isFieldInvalid('email') ? 'email-error' : null" />
   @if (isFieldInvalid('email')) {
     <span class="register-form__error" id="email-error" role="alert">
       {{ getErrorMessage('email') }}
     </span>
   }
   ```

3. **Indicador de fortaleza de contraseña accesible**:
   - Añadido `aria-live="polite"` al contenedor de requisitos
   - Cada requisito tiene su propio `aria-label` con estado "cumplido/pendiente"
   - NVDA ahora anuncia: "6 o más caracteres: cumplido", "Mayúscula: pendiente", etc.

   ```html
   <!-- ANTES -->
   <section class="register-form__password-hints" aria-label="Requisitos de contraseña">
     <span [class.valid]="passwordControl.value.length >= 6">✓ 6+ caracteres</span>
   </section>
   
   <!-- DESPUÉS -->
   <section class="register-form__password-hints" id="password-hints" 
     aria-label="Requisitos de contraseña" aria-live="polite">
     <span [class.valid]="passwordControl.value.length >= 6"
       [attr.aria-label]="passwordControl.value.length >= 6 ? 
         '6 o más caracteres: cumplido' : '6 o más caracteres: pendiente'">
       ✓ 6+ caracteres
     </span>
   </section>
   ```

4. **Carrusel con mejoras de accesibilidad**:
   - Añadido `title` a botones de navegación
   - Corregido `aria-hidden="true"` en imágenes decorativas de flechas
   - Estados de carga con `aria-busy="true"` para indicar contenido cargando

   ```html
   <!-- ANTES -->
   <button class="match-carousel__arrow" (click)="previous()" 
     aria-label="Ver partidos anteriores">
     <img src="assets/images/flechaback.svg" alt="Anterior">
   </button>
   
   <!-- DESPUÉS -->
   <button class="match-carousel__arrow" (click)="previous()"
     aria-label="Ver partidos anteriores"
     title="Ir a partidos anteriores">
     <img src="/assets/images/flechaback.svg" alt="" aria-hidden="true">
   </button>
   ```

#### Archivos modificados

| Archivo | Cambios realizados |
|---------|-------------------|
| `modal.html` | Añadido `aria-labelledby` y `aria-describedby` |
| `login-form.html` | Añadido `id="modal-title"` al legend |
| `register-form.html` | Añadido `aria-describedby`, `aria-invalid`, `role="alert"`, `aria-live` |
| `match-carousel.html` | Añadido `title`, corregido `aria-hidden` en imágenes, rutas absolutas |
| `main.html` | Añadido `aria-busy="true"` al estado de carga |
| `match-detail.html` | Añadido `role="status"` y `aria-busy` al spinner de carga |

### 6.3 Verificación cross-browser

Se ha verificado el funcionamiento de la aplicación en tres navegadores principales:

| Navegador | Versión | Layout correcto | Multimedia funciona | Observaciones |
|-----------|---------|-----------------|---------------------|---------------|
| Chrome | 131.0 | ✅ | ✅ | Sin problemas. Renderizado óptimo |
| Firefox | 133.0 | ✅ | ✅ | Sin problemas. Focus visible correcto |
| Edge | 131.0 | ✅ | ✅ | Sin problemas. Compatible 100% |

#### Capturas de pantalla

- [Captura en Chrome](./capturas/chrome.png)
- [Captura en Firefox](./capturas/firefox.png)
- [Captura en Edge](./capturas/edge.png)

#### Observaciones adicionales

- **CSS Grid y Flexbox:** Funcionan correctamente en los tres navegadores
- **Animaciones del carrusel:** Transiciones suaves sin diferencias apreciables
- **Focus styles:** El outline personalizado se muestra correctamente en todos los navegadores
- **Responsive design:** El layout se adapta correctamente en diferentes resoluciones

### Resumen de verificación manual

| Área de prueba | Estado | Notas |
|----------------|--------|-------|
| Navegación por teclado | ✅ Aprobado | Orden lógico, focus visible, sin trampas |
| Lector de pantalla (NVDA) | ✅ Aprobado | Anuncios claros, estructura comprensible |
| Cross-browser | ✅ Aprobado | Compatible con Chrome, Firefox, Edge |

**Criterios evaluados:** RA5.g, RA4.g

---

## 7. Resultados finales después de correcciones

### Auditoría final con herramientas automatizadas

Tras aplicar todas las correcciones de accesibilidad, se han ejecutado nuevamente las tres herramientas de análisis:

### Tabla comparativa de resultados

| Herramienta | Antes | Después | Mejora |
|-------------|-------|---------|--------|
| **Lighthouse** | 93/100 | 94/100 | +1 puntos |
| **WAVE** | 0 errores, 3 alertas | 0 errores, 0 alertas | -3 alertas |
| **TAW** | 10 errores, 26 alertas | 0 errores, 29 alertas | -10 errores, +2 alertas |

### Capturas de resultados finales

- ![Lighthouse después](./capturas/lighthouse-despues.png)
- ![WAVE después](./capturas/wave-despues.png)

### Checklist de conformidad WCAG 2.1 Nivel AA

#### Perceptible:
- [x] **1.1.1 - Contenido no textual:** Todas las imágenes tienen atributo `alt` descriptivo o `alt=""` con `role="presentation"` para imágenes decorativas
- [x] **1.3.1 - Información y relaciones:** HTML semántico con landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`), jerarquía de encabezados correcta, formularios etiquetados
- [x] **1.4.3 - Contraste mínimo:** Ratio de contraste superior a 4.5:1 en texto normal, verificado con herramientas automáticas
- [x] **1.4.4 - Redimensionar texto:** La aplicación soporta zoom hasta 200% sin pérdida de funcionalidad ni contenido

#### Operable:
- [x] **2.1.1 - Teclado:** Toda la funcionalidad accesible mediante teclado (Tab, Enter, flechas, Esc)
- [x] **2.1.2 - Sin trampas de teclado:** No existen elementos que atrapen el foco; los modales se cierran con Esc
- [x] **2.4.1 - Saltar bloques:** Implementado skip-link "Saltar al contenido principal"
- [x] **2.4.3 - Orden del foco:** El orden de tabulación es lógico y predecible siguiendo el flujo visual
- [x] **2.4.7 - Foco visible:** Indicador de foco personalizado con outline de alto contraste

#### Comprensible:
- [x] **3.1.1 - Idioma de la página:** Atributo `lang="es"` en el elemento `<html>`
- [x] **3.2.3 - Navegación consistente:** Menú de navegación idéntico en todas las páginas
- [x] **3.3.1 - Identificación de errores:** Errores de formulario claramente identificados con `role="alert"` y `aria-invalid`
- [x] **3.3.2 - Etiquetas o instrucciones:** Todos los campos de formulario tienen etiquetas asociadas y mensajes de ayuda

#### Robusto:
- [x] **4.1.1 - Procesamiento:** HTML válido sin errores de sintaxis
- [x] **4.1.2 - Nombre, función, valor:** Componentes interactivos con ARIA apropiado (`aria-label`, `aria-expanded`, `aria-selected`, etc.)

### Nivel de conformidad alcanzado

**Nivel alcanzado: WCAG 2.1 AA**

**Justificación:** El proyecto cumple completamente con todos los criterios de conformidad de Nivel A y Nivel AA de WCAG 2.1. Se han implementado mejoras significativas en:
- Estructura semántica con landmarks y jerarquía de encabezados
- Navegación por teclado completa con focus visible
- Formularios accesibles con etiquetas, errores y estados ARIA
- Carrusel multimedia con navegación alternativa y anuncios para lectores de pantalla
- Skip-link para saltar navegación repetitiva

No se ha alcanzado el nivel AAA completo porque algunos criterios como 1.4.8 (presentación visual) requieren funcionalidades avanzadas de personalización de texto que exceden el alcance del proyecto.

**Criterios evaluados:** RA5.e, RA5.f

---

## 8. Conclusiones y reflexión

### ¿Es accesible mi proyecto?

Sí, el proyecto HomeFootball es accesible después de las mejoras implementadas. La auditoría final con Lighthouse alcanza 94/100 en accesibilidad, WAVE no reporta errores y TAW muestra 29 alertas menores informativas. Sin embargo, la accesibilidad real va más allá de las puntuaciones automáticas.

Lo más difícil de corregir fue la vinculación correcta de los mensajes de error en formularios con `aria-describedby` dinámico, ya que requería coordinar el estado del formulario con los IDs de los elementos de error. También resultó complejo hacer el carrusel de partidos completamente accesible manteniendo su funcionalidad visual.

Lo que más me sorprendió al usar NVDA fue descubrir que elementos que parecían accesibles visualmente (como los indicadores de requisitos de contraseña) eran completamente inútiles para usuarios ciegos sin los atributos `aria-live` adecuados. Esta experiencia ha cambiado mi forma de pensar sobre el diseño web: ahora considero la accesibilidad desde el inicio del desarrollo, no como una mejora posterior.

### Principales mejoras aplicadas

1. **Skip-link para navegación** - Permite a usuarios de teclado saltar directamente al contenido principal, evitando navegar repetidamente por el menú en cada página

2. **Formularios con ARIA completo** - Vinculación de errores con `aria-describedby`, estados `aria-invalid`, y mensajes con `role="alert"` para anuncio automático en lectores de pantalla

3. **Carrusel accesible por teclado** - Navegación con flechas izquierda/derecha, indicadores con `role="tablist"`, y región `aria-live` para anunciar cambios de slide

4. **Eliminación de CSS `content` informativo** - Movidos todos los iconos y textos generados por CSS a HTML con `aria-hidden="true"` para cumplir con el criterio F87

5. **Imágenes decorativas con `role="presentation"`** - Diferenciación clara entre imágenes informativas (con alt descriptivo) y decorativas (con alt vacío y role presentation)

### Mejoras futuras

Si tuviera más tiempo, implementaría las siguientes mejoras:

1. **Transcripciones para videos** - Añadir subtítulos y transcripciones completas para cualquier contenido multimedia de video

2. **Preferencias de usuario persistentes** - Guardar configuraciones de accesibilidad del usuario (tamaño de fuente, contraste alto, reducir movimiento)

3. **Test con usuarios reales** - Realizar pruebas de usabilidad con personas que usen tecnologías de asistencia habitualmente para identificar problemas que las herramientas automáticas no detectan

### Aprendizaje clave

La lección más importante que me llevo es que **la accesibilidad no es un checklist que marcar al final, sino una forma de pensar durante todo el desarrollo**. Diseñar para la accesibilidad desde el principio es más eficiente y produce mejor código. Además, las mejoras de accesibilidad benefician a todos los usuarios, no solo a personas con discapacidad: un buen contraste ayuda en exteriores, la navegación por teclado beneficia a usuarios avanzados, y una estructura semántica mejora el SEO.

**Criterio evaluado:** RA5.b
