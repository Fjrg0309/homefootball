# Componente Form Select

## Descripción

Dropdown/select con label, opciones configurables y mensajes de error. Compatible con Angular Forms (ControlValueAccessor).

## Uso

```typescript
// En tu componente TypeScript
import { SelectOption } from './components/shared/form-select/form-select';

options: SelectOption[] = [
  { value: 'laliga', label: 'LaLiga' },
  { value: 'premier', label: 'Premier League' },
  { value: 'serie-a', label: 'Serie A' },
  { value: 'bundesliga', label: 'Bundesliga', disabled: true }
];
```

```html
<!-- Select básico -->
<app-form-select
  label="Competición"
  name="competition"
  [options]="options">
</app-form-select>

<!-- Con validación requerida -->
<app-form-select
  label="País"
  name="country"
  [options]="countryOptions"
  [required]="true"
  [errorMessage]="errors.country"
  placeholder="Selecciona tu país">
</app-form-select>

<!-- Con texto de ayuda -->
<app-form-select
  label="Liga favorita"
  name="favorite"
  [options]="leagueOptions"
  helpText="Elige tu competición preferida">
</app-form-select>

<!-- Con ngModel -->
<app-form-select
  label="Equipo"
  name="team"
  [options]="teamOptions"
  [(ngModel)]="formData.team"
  [errorMessage]="submitted && !formData.team ? 'Campo obligatorio' : ''">
</app-form-select>

<!-- Con opción deshabilitada -->
<app-form-select
  label="Temporada"
  name="season"
  [options]="[
    { value: '2024', label: '2024/2025' },
    { value: '2023', label: '2023/2024' },
    { value: '2022', label: '2022/2023', disabled: true }
  ]">
</app-form-select>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| label | string | '' | Texto del label |
| name | string | '' | Atributo name del select |
| options | SelectOption[] | [] | Array de opciones del select |
| required | boolean | false | Si el campo es obligatorio |
| disabled | boolean | false | Si el campo está deshabilitado |
| placeholder | string | 'Selecciona una opción' | Texto de la opción por defecto |
| helpText | string | '' | Texto de ayuda debajo del campo |
| errorMessage | string | '' | Mensaje de error a mostrar |
| inputId | string | auto | ID único del select (se genera automáticamente) |

## Interface SelectOption

```typescript
interface SelectOption {
  value: string | number;  // Valor que se guarda
  label: string;           // Texto que se muestra
  disabled?: boolean;      // Si la opción está deshabilitada
}
```

## Eventos

| Evento | Parámetro | Descripción |
|--------|-----------|-------------|
| selectionChange | string \| number | Se emite cuando cambia la selección |

## Estados

- **normal**: Borde gris
- **hover**: Borde azul
- **focus**: Borde azul con sombra, icono rota 180°
- **error**: Borde rojo con mensaje
- **disabled**: Opacidad reducida, no clickeable

## Accesibilidad

- Label asociado con el select mediante `for` e `id`
- Asterisco (*) para campos requeridos con `aria-label`
- Mensajes de error con `role="alert"`
- `aria-describedby` conecta el select con ayuda/error
- `aria-invalid` indica estado de error
- Navegación por teclado habilitada

## Notas de implementación

- Implementa ControlValueAccessor para trabajar con Angular Forms
- IDs únicos generados automáticamente
- Icono de chevron personalizado (SVG inline)
- El icono rota al hacer focus
- Compatible con ngModel y Reactive Forms
- Opciones individuales pueden estar deshabilitadas
