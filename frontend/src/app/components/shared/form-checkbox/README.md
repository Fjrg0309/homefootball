# Componente Form Checkbox

## Descripción

Checkbox personalizado con label y texto de ayuda. Compatible con Angular Forms (ControlValueAccessor).

## Uso

```html
<!-- Checkbox básico -->
<app-form-checkbox
  label="Acepto los términos y condiciones"
  name="terms">
</app-form-checkbox>

<!-- Con texto de ayuda -->
<app-form-checkbox
  label="Recibir notificaciones por email"
  name="notifications"
  helpText="Te enviaremos actualizaciones de tus equipos favoritos">
</app-form-checkbox>

<!-- Con ngModel -->
<app-form-checkbox
  label="Recordar mi sesión"
  name="remember"
  [(ngModel)]="formData.remember">
</app-form-checkbox>

<!-- Deshabilitado -->
<app-form-checkbox
  label="Esta opción no está disponible"
  name="unavailable"
  [disabled]="true">
</app-form-checkbox>

<!-- Con control desde código -->
<app-form-checkbox
  label="Modo oscuro"
  name="darkMode"
  [checked]="isDarkMode"
  (checkChange)="toggleDarkMode($event)">
</app-form-checkbox>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| label | string | '' | Texto del label |
| name | string | '' | Atributo name del checkbox |
| disabled | boolean | false | Si el checkbox está deshabilitado |
| helpText | string | '' | Texto de ayuda debajo del checkbox |
| inputId | string | auto | ID único del checkbox (se genera automáticamente) |

## Eventos

| Evento | Parámetro | Descripción |
|--------|-----------|-------------|
| checkChange | boolean | Se emite cuando cambia el estado (checked/unchecked) |

## Estados

- **unchecked**: Borde gris, fondo blanco
- **checked**: Fondo azul con checkmark blanco
- **hover**: Borde azul
- **focus**: Sombra azul alrededor
- **disabled**: Opacidad reducida, no clickeable

## Accesibilidad

- Label asociado con el checkbox mediante `for` e `id`
- Input checkbox nativo oculto pero funcional
- Checkmark personalizado con SVG
- Navegación por teclado habilitada
- Focus visible
- `user-select: none` en el label

## Notas de implementación

- Implementa ControlValueAccessor para trabajar con Angular Forms
- IDs únicos generados automáticamente
- Checkbox nativo oculto (opacity: 0) pero funcional para accesibilidad
- Checkmark personalizado con SVG inline
- Compatible con ngModel y Reactive Forms
- Icono de check solo se muestra cuando está marcado
