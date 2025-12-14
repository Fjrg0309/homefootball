# Componente Card

## Descripción

Componente de tarjeta reutilizable para mostrar contenido con imagen, título, descripción y acciones. Soporta layout vertical y horizontal.

## Uso

```html
<!-- Card básica vertical -->
<app-card
  imageSrc="/assets/imagen.jpg"
  imageAlt="Descripción de la imagen"
  title="Título de la tarjeta"
  description="Descripción del contenido de la tarjeta">
  <app-button>Ver más</app-button>
</app-card>

<!-- Card sin imagen -->
<app-card
  title="Solo texto"
  description="Esta tarjeta no tiene imagen">
  <app-button variant="secondary">Acción</app-button>
</app-card>

<!-- Card horizontal -->
<app-card
  [horizontal]="true"
  imageSrc="/assets/imagen.jpg"
  title="Tarjeta horizontal"
  description="La imagen aparece a la izquierda">
  <app-button variant="ghost">Leer más</app-button>
</app-card>

<!-- Card solo con acciones en slot -->
<app-card
  title="Partido de fútbol"
  description="Real Madrid vs Barcelona">
  <app-button size="sm">Detalles</app-button>
  <app-button variant="secondary" size="sm">Compartir</app-button>
</app-card>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| imageSrc | string | undefined | URL de la imagen |
| imageAlt | string | undefined | Texto alternativo de la imagen |
| title | string | undefined | Título de la tarjeta |
| description | string | undefined | Descripción o texto del contenido |
| horizontal | boolean | false | Si es true, usa layout horizontal |

## Variantes

### Vertical (por defecto)
Layout en columna: imagen arriba, contenido abajo. Ideal para grids de tarjetas.

### Horizontal
Layout en fila: imagen a la izquierda, contenido a la derecha. En móvil vuelve a vertical.

## Estados

- **hover**: Eleva la tarjeta y aumenta la sombra
- Transición suave de 200ms

## Slots

El componente usa `<ng-content>` para permitir insertar botones u otros elementos en la zona de acciones.

## Notas de implementación

- Usa BEM para las clases (.card, .card__image, .card--horizontal)
- La imagen es opcional
- El título y la descripción son opcionales
- Responsive: en móvil las cards horizontales se vuelven verticales
- Imagen con object-fit: cover para mantener proporciones
