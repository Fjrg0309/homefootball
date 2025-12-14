# Componente Button

## Descripción

Componente de botón reutilizable con diferentes variantes, tamaños y estados.

## Uso

```html
<!-- Botón primary por defecto -->
<app-button>Clickeame</app-button>

<!-- Botón secondary -->
<app-button variant="secondary">Secundario</app-button>

<!-- Botón ghost -->
<app-button variant="ghost">Ghost</app-button>

<!-- Botón danger -->
<app-button variant="danger">Eliminar</app-button>

<!-- Tamaños -->
<app-button size="sm">Pequeño</app-button>
<app-button size="md">Mediano</app-button>
<app-button size="lg">Grande</app-button>

<!-- Botón deshabilitado -->
<app-button [disabled]="true">Deshabilitado</app-button>

<!-- Botón tipo submit -->
<app-button type="submit">Enviar</app-button>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' \| 'danger' | 'primary' | Estilo del botón |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Tamaño del botón |
| disabled | boolean | false | Si el botón está deshabilitado |
| type | 'button' \| 'submit' \| 'reset' | 'button' | Tipo de botón HTML |

## Variantes

### Primary
Color principal azul marino. Para acciones principales de la interfaz.

### Secondary
Color verde (action). Para acciones secundarias importantes.

### Ghost
Sin fondo, solo borde y texto. Para acciones terciarias o de menor importancia.

### Danger
Color rojo. Para acciones destructivas como eliminar o cancelar.

## Tamaños

- **sm**: Pequeño, para espacios reducidos
- **md**: Mediano, tamaño por defecto
- **lg**: Grande, para CTAs importantes

## Estados

- **hover**: Cambia color de fondo, se eleva ligeramente
- **focus**: Muestra outline azul para navegación por teclado
- **active**: Efecto de "presionado"
- **disabled**: Opacidad reducida, no clickeable

## Notas de implementación

- Usa BEM para las clases CSS (.button, .button--primary, .button--sm)
- Transiciones suaves de 200ms
- Focus visible para accesibilidad
- Soporta contenido con `<ng-content>`
