# Componente Form Radio Group

## Descripción

Grupo de radio buttons con label, opciones configurables y layout flexible (vertical u horizontal). Compatible con Angular Forms (ControlValueAccessor).

## Uso

```typescript
// En tu componente TypeScript
import { RadioOption } from './components/shared/form-radio-group/form-radio-group';

genderOptions: RadioOption[] = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' }
];

subscriptionOptions: RadioOption[] = [
  { value: 'free', label: 'Gratis' },
  { value: 'pro', label: 'Pro - $9.99/mes' },
  { value: 'premium', label: 'Premium - $19.99/mes', disabled: true }
];
```

```html
<!-- Radio group vertical (por defecto) -->
<app-form-radio-group
  label="Género"
  name="gender"
  [options]="genderOptions">
</app-form-radio-group>

<!-- Radio group horizontal (inline) -->
<app-form-radio-group
  label="Suscripción"
  name="subscription"
  [options]="subscriptionOptions"
  [inline]="true">
</app-form-radio-group>

<!-- Con texto de ayuda -->
<app-form-radio-group
  label="Notificaciones"
  name="notifications"
  [options]="notificationOptions"
  helpText="Elige cómo quieres recibir actualizaciones">
</app-form-radio-group>

<!-- Con validación -->
<app-form-radio-group
  label="Equipo favorito"
  name="team"
  [options]="teamOptions"
  [errorMessage]="submitted && !formData.team ? 'Selecciona un equipo' : ''">
</app-form-radio-group>

<!-- Con ngModel -->
<app-form-radio-group
  label="Idioma"
  name="language"
  [options]="languageOptions"
  [(ngModel)]="formData.language">
</app-form-radio-group>

<!-- Deshabilitado completo -->
<app-form-radio-group
  label="Opciones bloqueadas"
  name="locked"
  [options]="options"
  [disabled]="true">
</app-form-radio-group>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| label | string | '' | Texto del legend del fieldset |
| name | string | auto | Atributo name compartido por todos los radios |
| options | RadioOption[] | [] | Array de opciones del grupo |
| disabled | boolean | false | Si todo el grupo está deshabilitado |
| inline | boolean | false | Si las opciones se muestran en línea (horizontal) |
| helpText | string | '' | Texto de ayuda debajo del grupo |
| errorMessage | string | '' | Mensaje de error a mostrar |

## Interface RadioOption

```typescript
interface RadioOption {
  value: string | number;  // Valor que se guarda
  label: string;           // Texto que se muestra
  disabled?: boolean;      // Si esta opción específica está deshabilitada
}
```

## Eventos

| Evento | Parámetro | Descripción |
|--------|-----------|-------------|
| selectionChange | string \| number | Se emite cuando cambia la selección |

## Estados

- **unselected**: Borde gris, sin dot interno
- **selected**: Borde azul, dot azul interno visible
- **hover**: Borde azul
- **focus**: Sombra azul alrededor
- **disabled**: Opacidad reducida, no clickeable

## Layout

- **Vertical (default)**: Opciones en columna con gap de 16px
- **Inline (horizontal)**: Opciones en fila con gap de 24px y wrap

## Accesibilidad

- Usa `<fieldset>` y `<legend>` semánticos
- Labels asociados con inputs mediante `for` e `id`
- Input radio nativo oculto pero funcional
- Radio personalizado con dot animado
- Navegación por teclado habilitada (flechas arriba/abajo)
- Focus visible
- `user-select: none` en los labels
- Mensajes de error con `role="alert"`

## Notas de implementación

- Implementa ControlValueAccessor para trabajar con Angular Forms
- IDs únicos generados automáticamente para cada opción
- Radios nativos ocultos (opacity: 0) pero funcionales
- Dot interno con animación scale
- Compatible con ngModel y Reactive Forms
- Opciones individuales pueden estar deshabilitadas
- Name único generado automáticamente si no se proporciona
