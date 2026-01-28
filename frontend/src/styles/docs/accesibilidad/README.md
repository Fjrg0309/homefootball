# Documentación de Accesibilidad - HomeFootball

## Índice

1. [Fundamentos de accesibilidad](#1-fundamentos-de-accesibilidad)
2. [Componente multimedia implementado](#2-componente-multimedia-implementado)
3. [Navegación por teclado](#3-navegación-por-teclado)
4. [Textos alternativos y ARIA](#4-textos-alternativos-y-aria)
5. [Contraste y legibilidad](#5-contraste-y-legibilidad)
6. [Formularios accesibles](#6-formularios-accesibles)
7. [Testing de accesibilidad](#7-testing-de-accesibilidad)
8. [Mejoras futuras](#8-mejoras-futuras)

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

## 3. Navegación por teclado

*Sección pendiente de completar*

---

## 4. Textos alternativos y ARIA

*Sección pendiente de completar*

---

## 5. Contraste y legibilidad

*Sección pendiente de completar*

---

## 6. Formularios accesibles

*Sección pendiente de completar*

---

## 7. Testing de accesibilidad

*Sección pendiente de completar*

---

## 8. Mejoras futuras

*Sección pendiente de completar*

---

**Criterios evaluados:** RA5.a, RA5.c
