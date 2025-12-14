# Componente Form Textarea

## Descripción

Campo de texto multilínea (textarea) con label, validación y mensajes de error. Compatible con Angular Forms (ControlValueAccessor).

## Uso

```html
<!-- Textarea básica -->
<app-form-textarea
  label="Comentario"
  name="comment"
  placeholder="Escribe tu comentario aquí">
</app-form-textarea>

<!-- Con validación requerida -->
<app-form-textarea
  label="Descripción"
  name="description"
  [required]="true"
  [errorMessage]="errors.description"
  placeholder="Describe tu experiencia">
</app-form-textarea>

<!-- Con ayuda y filas personalizadas -->
<app-form-textarea
  label="Mensaje"
  name="message"
  [rows]="8"
  helpText="Máximo 500 caracteres"
  placeholder="Escribe tu mensaje">
</app-form-textarea>

<!-- Con ngModel -->
<app-form-textarea
  label="Observaciones"
  name="notes"
  [(ngModel)]="formData.notes"
  [errorMessage]="submitted && !formData.notes ? 'Campo obligatorio' : ''">
</app-form-textarea>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| label | string | '' | Texto del label |
| name | string | '' | Atributo name del textarea |
| placeholder | string | '' | Texto placeholder |
| required | boolean | false | Si el campo es obligatorio |
| disabled | boolean | false | Si el campo está deshabilitado |
| rows | number | 4 | Número de filas visibles |
| helpText | string | '' | Texto de ayuda debajo del campo |
| errorMessage | string | '' | Mensaje de error a mostrar |
| inputId | string | auto | ID único del textarea (se genera automáticamente) |

## Eventos

| Evento | Parámetro | Descripción |
|--------|-----------|-------------|
| inputChange | string | Se emite cuando cambia el valor |
| inputBlur | FocusEvent | Se emite al perder el foco |
| inputFocus | FocusEvent | Se emite al ganar el foco |

## Estados

- **normal**: Borde gris
- **hover**: Borde azul
- **focus**: Borde azul con sombra
- **error**: Borde rojo con mensaje
- **disabled**: Opacidad reducida, no editable

## Accesibilidad

- Label asociado con el textarea mediante `for` e `id`
- Asterisco (*) para campos requeridos con `aria-label`
- Mensajes de error con `role="alert"`
- `aria-describedby` conecta el textarea con ayuda/error
- `aria-invalid` indica estado de error
- Resize vertical habilitado

## Notas de implementación

- Implementa ControlValueAccessor para trabajar con Angular Forms
- IDs únicos generados automáticamente
- Mínimo de altura: 80px
- El usuario puede ajustar la altura verticalmente
- Compatible con ngModel y Reactive Forms
