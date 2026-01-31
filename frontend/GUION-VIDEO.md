# GUIÓN VIDEO - HomeFootball (6:30 min)

## ARCHIVOS ABIERTOS EN VS CODE
1. `src/styles/main.scss`
2. `src/styles/01-tools/_mixins.scss` (línea 122)
3. `src/styles/components/_header.scss`
4. `src/styles/00-settings/_variables.scss`
5. `src/styles/components/_container-queries.scss`
6. `src/app/components/shared/card/card.html`

---

## 1. FLUJO MVP (0:00 - 0:40)
**[Navegador + F12 abierto]**

"Flujo principal: buscar el partido de mi equipo. Soy del Villarreal.

Esto es el header, clase `.header` con BEM. Bajo a Competiciones, clic en LaLiga.

Estos botones verdes son `.btn--primary`. Clic en Partidos.

Listado de jornada. Busco Villarreal... aquí, contra Sevilla. Clic.

Detalle del partido. Tres clics: liga, partidos, mi equipo."

---

## 2. ARQUITECTURA SASS (0:40 - 1:40)
**[VS Code → main.scss]**

"Main.scss, punto de entrada. Arquitectura ITCSS, triángulo invertido.

Orden de menor a mayor especificidad: Settings son variables, Tools son mixins, Generic el reset, Elements estilos base, Layout los grids, Components el header y botones, Utilities al final.

También uso CSS Layers aquí arriba para controlar especificidad.

¿Por qué ITCSS? Evita conflictos, cada cosa en su sitio."

---

## 3. MIXIN (1:40 - 2:30)
**[VS Code → _mixins.scss línea 122]**

"Mixin `responsive-grid`. Tres parámetros: ancho mínimo, gap, y booleano fill.

Si fill es true usa auto-fill, mantiene columnas vacías. Si es false usa auto-fit, las colapsa.

Lo uso en el grid de competiciones. Se adapta solo sin media queries manuales."

---

## 4. BEM (2:30 - 3:30)
**[VS Code → _header.scss]**

"Header, componente más complejo. BEM: Bloque, Elemento, Modificador.

Bloque `.header`. Elementos con doble guión bajo: `header__container`, `header__logo`, `header__nav`. Modificadores con doble guión: `header__nav--open`.

Evito anidar selectores. No escribo `.header .nav .link`, escribo `.header__nav-link` directo.

¿Por qué? Especificidad baja y constante. Nombres autodocumentados."

---

## 5. TEMAS (3:30 - 4:20)
**[VS Code → _variables.scss]**

"Variables de tema. En `:root` tema claro, en `[data-theme="dark"]` el oscuro.

¿Por qué variables CSS y no SASS? SASS se compila, valor fijo. CSS se evalúa en el navegador.

Cuando cambio data-theme a dark, el navegador recalcula todos los colores instantáneamente. Sin recargar."

---

## 6. CONTAINER QUERIES (4:20 - 5:10)
**[VS Code → _container-queries.scss]**

"Container Queries. Defino contenedor con `container-type` y `container-name`.

Uso `@container` en vez de `@media`. Diferencia: media query mira el viewport, container query mira el contenedor padre.

Una tarjeta en sidebar de 300px o en zona principal de 800px tiene mismo viewport. Con media queries se ve igual. Con container queries se adapta al espacio real.

Componentes verdaderamente reutilizables."

---

## 7. IMÁGENES (5:10 - 6:00)
**[Navegador → F12 → Network → Img]**
**[Luego VS Code → card.html]**

"Network, filtro imágenes. El logo carga en WebP.

En el código uso `<picture>`. Primer source para WebP, fallback en PNG.

El navegador elige el mejor formato. WebP ahorra 30%.

`srcset` para diferentes densidades. `loading="lazy"` para cargar solo lo visible. `decoding="async"` para no bloquear renderizado."

---

## 8. CIERRE (6:00 - 6:30)

"Resumen: ITCSS para arquitectura, BEM sin anidamiento, variables CSS para temas, container queries para componentes modulares, picture y lazy loading para imágenes. Mobile-first. Gracias."
