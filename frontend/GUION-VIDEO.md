# 🎬 GUIÓN VIDEO-DEFENSA - HomeFootball (5-7 minutos)

---

## PREPARACIÓN ANTES DE GRABAR

**Navegador:**
- Tu web funcionando en localhost
- F12 abierto (DevTools) → pestaña Elements

**VS Code - Pestañas abiertas en este orden:**
1. `frontend/src/styles/main.scss`
2. `frontend/src/styles/01-tools/_mixins.scss`
3. `frontend/src/styles/components/_header.scss`
4. `frontend/src/styles/00-settings/_variables.scss`
5. `frontend/src/styles/components/_container-queries.scss`
6. `frontend/src/app/components/shared/card/card.html`

---

## 1. FLUJO MVP (0:00 - 0:45)

**[Navegador con F12 abierto → pestaña Console visible (puede estar vacía, no importa)]**

"Vale, vamos a ver el flujo principal de HomeFootball. Tengo la consola abierta como pide el enunciado.

Soy del Villarreal y quiero ver cómo le ha ido en su último partido.

Arriba tenemos el header, que usa la clase `.header` con la metodología BEM. Tiene la navegación con los enlaces a Favoritos, Noticias, Fichajes...

Aquí abajo en Competiciones a seguir vemos las tarjetas de las ligas. Cada una es un componente reutilizable. Voy a hacer clic en LaLiga.

*[Clic en LaLiga]*

Perfecto, página de LaLiga. Aquí tengo estos tres botones grandes: Partidos, Equipos y Clasificación. Son componentes Button con la clase `.btn--primary` que les da el color verde. Entro en Partidos.

*[Clic en Partidos]*

Y aquí tengo el listado de partidos de la jornada. Cada fila usa el componente de partido. Busco el del Villarreal... aquí está, Villarreal 4 - Sevilla 2.

*[Clic en el partido]*

Y listo, aquí tengo el detalle completo con el marcador, los goleadores, las estadísticas... 

Ese es el flujo MVP: entras en tu liga, ves los partidos, buscas tu equipo. Tres clics y ya está."

---

## 2. ARQUITECTURA SASS - ITCSS (0:45 - 2:00)

**[VS Code → main.scss]**
**Archivo:** `frontend/src/styles/main.scss`

"Bueno, vamos al código. Empiezo con la arquitectura de estilos.

Este es mi main.scss, el punto de entrada. Uso ITCSS, que organiza los estilos como un triángulo invertido, de menos a más especificidad.

Fijaos en el orden. Primero importo Settings, que son las variables. No genera CSS, solo definiciones. Luego Tools, que son mis mixins, tampoco genera CSS todavía.

Después viene Generic con el reset, que ya sí es CSS real. Elements para estilos base de etiquetas HTML. Layout para los patrones de diseño como grids.

Components es donde están el header, footer, botones... Y por último Utilities, las clases de ayuda con máxima especificidad.

También uso CSS Layers, fijaos aquí arriba: `@layer reset, base, objects, components, utilities`. Esto me da control extra sobre la especificidad. Aunque un selector sea más específico, el orden de los layers manda.

¿Por qué ITCSS? Porque evita conflictos de especificidad. Cada capa tiene su lugar y sé exactamente dónde va cada cosa."

---

## 3. MIXIN PROPIO (2:00 - 3:00)

**[VS Code → _mixins.scss → línea 122]**
**Archivo:** `frontend/src/styles/01-tools/_mixins.scss`

"Ahora vamos a ver un mixin. Abro el archivo de mixins y voy a la línea 122, el mixin `responsive-grid`.

¿Qué hace? Crea un grid CSS que se adapta automáticamente. Recibe tres parámetros: el ancho mínimo de columna, el gap, y un booleano `fill`.

La gracia está en el `@if`. Si fill es true, uso `auto-fill` que mantiene las columnas aunque estén vacías. Si es false, uso `auto-fit` que colapsa las vacías y estira las que tienen contenido.

¿Dónde lo uso? En el listado de competiciones de la home, en las grids de equipos... Básicamente donde necesito que las columnas se adapten solas sin escribir media queries para cada caso.

También tengo otros mixins como `flex-center` para centrar con flexbox, o los aliases de breakpoints: `@include tablet`, `@include desktop`... Hacen el código más legible."

---

## 4. BEM - COMPONENTE HEADER (3:00 - 4:00)

**[VS Code → _header.scss]**
**Archivo:** `frontend/src/styles/components/_header.scss`

"Vamos con BEM. Mi componente más complejo es el header, así que vamos a verlo.

El bloque es `.header`. Los elementos llevan doble guión bajo: `.header__container`, `.header__logo`, `.header__nav`, `.header__hamburger` para el menú móvil...

Los modificadores llevan doble guión: `.header__nav--open` cuando el menú está abierto en móvil, `.header__hamburger--active`...

Lo importante es que evito anidar selectores. No escribo `.header .nav .link`, escribo directamente `.header__nav-link`. ¿Por qué? Dos razones.

Primera, la especificidad. Con BEM plano siempre tengo una sola clase, especificidad constante y baja. Fácil de mantener y de sobrescribir si hace falta.

Segunda, los nombres son autodocumentados. Si veo `.header__nav-link` en cualquier parte del código, sé exactamente qué es y a qué pertenece sin buscar contexto."

---

## 5. TEMAS - VARIABLES CSS (4:00 - 4:45)

**[VS Code → _variables.scss]**
**Archivo:** `frontend/src/styles/00-settings/_variables.scss`

"Ahora los temas. Abro el archivo de variables.

Tengo todas las variables CSS en `:root` para el tema claro: colores principales, tipografía, espaciados...

Y más abajo tengo `[data-theme="dark"]` que sobrescribe los colores para el modo oscuro.

La pregunta clave: ¿por qué variables CSS y no variables SASS?

Las variables SASS se compilan. El navegador ve el valor final, por ejemplo `#F5F5F5`. Para cambiar de tema tendría que recompilar.

Las variables CSS se evalúan en el navegador. Cuando cambio el atributo `data-theme` a `dark`, el navegador recalcula todos los colores automáticamente. El cambio es instantáneo, sin recargar nada.

Por eso para colores y todo lo que cambie entre temas uso CSS nativo. Para cosas estáticas como breakpoints sí uso SASS."

---

## 6. CONTAINER QUERIES (4:45 - 5:30)

**[VS Code → _container-queries.scss]**
**Archivo:** `frontend/src/styles/components/_container-queries.scss`

"Container Queries, una de las partes más interesantes.

Mirad este componente, `.cq-match-card`. Defino el contenedor con `container-type: inline-size` y `container-name: match-card`.

Ahora en vez de `@media` uso `@container`. La diferencia es crucial: media query responde al viewport, al tamaño de la ventana. Container query responde al contenedor padre.

¿Por qué importa? Imaginad esta tarjeta de partido. Con media queries, si la pongo en un sidebar estrecho o en una zona principal ancha, se vería igual porque el viewport es el mismo.

Con container queries, la tarjeta mira cuánto espacio tiene su contenedor. Si está en 280 píxeles muestra una versión compacta. Si tiene 400, se expande y muestra más información.

Esto hace que los componentes sean realmente reutilizables. Los puedo poner en cualquier contexto y se adaptan solos."

---

## 7. OPTIMIZACIÓN DE IMÁGENES (5:30 - 6:30)

**[Navegador → DevTools → Network → filtrar por Img]**
**[Luego VS Code → card.html]**
**Archivo:** `frontend/src/app/components/shared/card/card.html`

"Por último, optimización de imágenes. Vuelvo al navegador.

Abro Network, filtro por imágenes. Podéis ver los escudos de los equipos cargándose...

*[Si cargan PNG de la API externa]*
Estas imágenes vienen de una API externa en PNG. Pero para las imágenes locales tengo implementada la optimización. Vamos al código.

*[Cambiar a VS Code]*

En el componente Card uso el elemento `<picture>`. Esto me permite definir múltiples formatos: primero AVIF si está disponible, luego WebP, y por último el fallback en PNG o JPG.

El navegador elige automáticamente el mejor formato que soporte. WebP ahorra un 25-35% de tamaño con la misma calidad visual.

También uso `srcset` para ofrecer diferentes tamaños según la densidad de pantalla. Y `sizes` para indicar qué tamaño necesita según el layout.

Muy importante: `loading="lazy"`. Las imágenes fuera del viewport no se cargan hasta que el usuario hace scroll. Mejora mucho la carga inicial.

Y `decoding="async"` para que la decodificación no bloquee el renderizado."

---

## 8. CIERRE (6:30 - 7:00)

"Para resumir las decisiones técnicas:

ITCSS con CSS Layers para una arquitectura escalable y sin conflictos de especificidad.

BEM sin anidamiento para nomenclatura clara y mantenible.

Variables CSS nativas para cambio de tema en tiempo real.

Container Queries para componentes que se adaptan a su contexto, no al viewport.

Y optimización de imágenes con picture, srcset y lazy loading.

Todo mobile-first. Gracias."

---

## RESUMEN RÁPIDO

| Sección | Archivo | DevTools |
|---------|---------|----------|
| MVP | - | F12 → Elements |
| ITCSS | `src/styles/main.scss` | - |
| Mixin | `src/styles/01-tools/_mixins.scss` (línea 122) | - |
| BEM | `src/styles/components/_header.scss` | - |
| Temas | `src/styles/00-settings/_variables.scss` | - |
| Container Queries | `src/styles/components/_container-queries.scss` | - |
| Imágenes | `src/app/components/shared/card/card.html` | F12 → Network → Img |
