# 📋 Fase 3: Formularios Reactivos y Validaciones - Proceso de Implementación

## 🎯 Objetivos de la Fase 3
1. **Tarea 1:** Formularios reactivos básicos con FormBuilder y validadores síncronos ✅
2. **Tarea 2:** Validadores personalizados (contraseña, confirmación, formatos españoles, cross-field) ✅
3. **Tarea 3:** Validadores asíncronos con debounce para simulación de API ✅
4. **Tarea 4:** FormArray para gestión de contenido dinámico ✅
5. **Tarea 5:** UX de validación (touched/dirty, pending states, feedback visual) ✅
6. **Tarea 6:** Documentación completa (catálogo validadores, guía FormArray, ejemplos async) ✅

---

## 📝 Tarea 1: Formularios Reactivos Básicos

### Objetivo
Implementar formularios reactivos usando **FormBuilder** para declarar `FormGroup` y `FormControl` programáticamente, con validadores síncronos integrados que actualizan `errors` reactivamente. Esta aproximación facilita testing, validación dinámica y reutilización vs template-driven forms.

### Estado: ✅ COMPLETADA

---

### Paso 1: Configurar ReactiveFormsModule

**Archivo:** `src/app/app.config.ts`

Los formularios reactivos requieren `provideClientHydration` y `ReactiveFormsModule` en la configuración global de la aplicación.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration()
  ]
};
```

**Nota:** `ReactiveFormsModule` se importa directamente en cada componente standalone que lo necesite, no en `app.config.ts`.

---

### Paso 2: Crear Validadores Personalizados

**Estructura de carpetas:**
```
src/app/
└── validators/
    ├── password-strength.validator.ts
    ├── password-match.validator.ts
    ├── spanish-formats.validator.ts
    └── cross-field.validators.ts
```

#### Validador de Contraseña Fuerte

**Archivo:** `src/app/validators/password-strength.validator.ts`

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida que la contraseña tenga:
 * - Mínimo 12 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const minLength = value.length >= 12;

    const errors: ValidationErrors = {};
    if (!hasUpper) errors['noUppercase'] = true;
    if (!hasLower) errors['noLowercase'] = true;
    if (!hasNumber) errors['noNumber'] = true;
    if (!hasSpecial) errors['noSpecial'] = true;
    if (!minLength) errors['minLength'] = true;

    return Object.keys(errors).length ? errors : null;
  };
}
```

**Características:**
- ✅ Retorna `null` si es válido
- ✅ Retorna objeto con múltiples errores
- ✅ Permite mostrar mensajes específicos por error

---

#### Validador de Confirmación de Contraseña

**Archivo:** `src/app/validators/password-match.validator.ts`

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Cross-field validator que compara dos campos de contraseña
 * Se aplica a nivel FormGroup
 */
export function passwordMatch(controlName: string, matchControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchControl = group.get(matchControlName);

    if (!control || !matchControl) return null;
    
    // No validar si matchControl ya tiene errores y no ha sido tocado
    if (matchControl.errors && !matchControl.touched) return null;

    const mismatch = control.value !== matchControl.value;
    
    // Agregar o quitar error del control de confirmación
    if (mismatch) {
      matchControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      matchControl.setErrors(null);
      return null;
    }
  };
}
```

**Características:**
- ✅ Validación cross-field
- ✅ Aplica error al campo de confirmación
- ✅ Se limpia automáticamente cuando coinciden

---

#### Validadores de Formatos Españoles

**Archivo:** `src/app/validators/spanish-formats.validator.ts`

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida NIF español con letra correcta
 * Formato: 12345678Z
 */
export function nif(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toUpperCase();
    if (!value) return null;

    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    if (!nifRegex.test(value)) return { invalidNif: true };

    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const position = parseInt(value.substring(0, 8)) % 23;
    
    return letters[position] === value[8] ? null : { invalidNif: true };
  };
}

/**
 * Valida teléfono móvil español
 * Formato: 6XXXXXXXX o 7XXXXXXXX
 */
export function telefono(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^(6|7)[0-9]{8}$/.test(control.value) ? null : { invalidTelefono: true };
  };
}

/**
 * Valida código postal español
 * Formato: 5 dígitos (00000-52999)
 */
export function codigoPostal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const cp = parseInt(control.value);
    return /^\d{5}$/.test(control.value) && cp >= 1000 && cp <= 52999 
      ? null 
      : { invalidCP: true };
  };
}
```

---

#### Validadores Cross-Field

**Archivo:** `src/app/validators/cross-field.validators.ts`

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida que el total (price * quantity) sea >= mínimo
 */
export function totalMinimo(min: number): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price = group.get('price')?.value || 0;
    const quantity = group.get('quantity')?.value || 0;
    const total = price * quantity;

    return total >= min ? null : { totalMinimo: { min, actual: total } };
  };
}

/**
 * Valida que un campo de edad sea mayor que otro
 */
export function edadMayor(controlName: string, minAgeControl: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const ageControl = group.get(minAgeControl);

    if (!control?.value || !ageControl?.value) return null;
    
    return parseInt(control.value) > parseInt(ageControl.value) 
      ? null 
      : { edadMenor: true };
  };
}

/**
 * Valida que al menos uno de los campos especificados tenga valor
 */
export function atLeastOneRequired(...fields: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const hasOne = fields.some(field => {
      const value = group.get(field)?.value;
      return value !== null && value !== undefined && value !== '';
    });
    
    return hasOne ? null : { atLeastOneRequired: { fields } };
  };
}

/**
 * Valida que una fecha de fin sea posterior a la de inicio
 */
export function dateRange(startField: string, endField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startField)?.value;
    const end = group.get(endField)?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate > startDate ? null : { invalidRange: true };
  };
}
```

---

### Paso 3: Crear Componente de Formulario

**Archivo:** `src/app/pages/user-form/user-form.ts`

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { passwordStrength } from '../../validators/password-strength.validator';
import { passwordMatch } from '../../validators/password-match.validator';
import { nif, telefono, codigoPostal } from '../../validators/spanish-formats.validator';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserForm {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  userForm: FormGroup;
  isSubmitted = signal(false);

  constructor() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      nif: ['', [Validators.required, nif()]],
      telefono: ['', [Validators.required, telefono()]],
      codigoPostal: ['', [Validators.required, codigoPostal()]],
      password: ['', [Validators.required, passwordStrength()]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: passwordMatch('password', 'confirmPassword') 
    });
  }

  onSubmit() {
    this.isSubmitted.set(true);

    if (this.userForm.invalid) {
      this.toastService.error('Por favor, corrija los errores del formulario');
      this.markAllAsTouched();
      return;
    }

    console.log('Formulario válido:', this.userForm.value);
    this.toastService.success('Usuario registrado correctamente');
    this.userForm.reset();
    this.isSubmitted.set(false);
  }

  onReset() {
    this.userForm.reset();
    this.isSubmitted.set(false);
    this.toastService.info('Formulario reiniciado');
  }

  private markAllAsTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  // Helpers para el template
  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return `${this.getFieldLabel(controlName)} es requerido`;
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
    if (errors['invalidNif']) return 'NIF inválido (formato: 12345678Z)';
    if (errors['invalidTelefono']) return 'Teléfono inválido (formato: 6XXXXXXXX)';
    if (errors['invalidCP']) return 'Código postal inválido (5 dígitos)';
    if (errors['mismatch']) return 'Las contraseñas no coinciden';

    return 'Campo inválido';
  }

  getPasswordErrors(): string[] {
    const errors = this.userForm.get('password')?.errors;
    if (!errors) return [];

    const messages: string[] = [];
    if (errors['noUppercase']) messages.push('Debe contener mayúsculas');
    if (errors['noLowercase']) messages.push('Debe contener minúsculas');
    if (errors['noNumber']) messages.push('Debe contener números');
    if (errors['noSpecial']) messages.push('Debe contener caracteres especiales');
    if (errors['minLength']) messages.push('Mínimo 12 caracteres');

    return messages;
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      email: 'Email',
      age: 'Edad',
      nif: 'NIF',
      telefono: 'Teléfono',
      codigoPostal: 'Código Postal',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña'
    };
    return labels[controlName] || controlName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.isSubmitted()));
  }
}
```

**Características:**
- ✅ FormBuilder con todos los validadores
- ✅ Validación cross-field (passwordMatch)
- ✅ Helpers para mensajes de error
- ✅ Signal para estado de submit
- ✅ Integración con ToastService

---

### Paso 4: Template del Formulario

**Archivo:** `src/app/pages/user-form/user-form.html`

```html
<div class="form-container">
  <header class="form-header">
    <a routerLink="/" class="back-button">← Volver</a>
    <h1>📝 Formulario de Usuario</h1>
    <p class="subtitle">Formularios Reactivos con Validaciones Personalizadas</p>
  </header>

  <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
    
    <!-- Nombre -->
    <div class="form-field">
      <label for="name">Nombre *</label>
      <input 
        id="name"
        formControlName="name" 
        placeholder="Juan Pérez"
        [class.invalid]="isFieldInvalid('name')">
      
      @if (isFieldInvalid('name')) {
        <div class="error-message">
          {{ getErrorMessage('name') }}
        </div>
      }
    </div>

    <!-- Email -->
    <div class="form-field">
      <label for="email">Email *</label>
      <input 
        id="email"
        type="email"
        formControlName="email" 
        placeholder="juan@ejemplo.com"
        [class.invalid]="isFieldInvalid('email')">
      
      @if (isFieldInvalid('email')) {
        <div class="error-message">
          {{ getErrorMessage('email') }}
        </div>
      }
    </div>

    <!-- Edad -->
    <div class="form-field">
      <label for="age">Edad *</label>
      <input 
        id="age"
        type="number"
        formControlName="age" 
        placeholder="25"
        [class.invalid]="isFieldInvalid('age')">
      
      @if (isFieldInvalid('age')) {
        <div class="error-message">
          {{ getErrorMessage('age') }}
        </div>
      }
    </div>

    <!-- NIF -->
    <div class="form-field">
      <label for="nif">NIF *</label>
      <input 
        id="nif"
        formControlName="nif" 
        placeholder="12345678Z"
        maxlength="9"
        [class.invalid]="isFieldInvalid('nif')">
      
      @if (isFieldInvalid('nif')) {
        <div class="error-message">
          {{ getErrorMessage('nif') }}
        </div>
      }
    </div>

    <!-- Teléfono -->
    <div class="form-field">
      <label for="telefono">Teléfono Móvil *</label>
      <input 
        id="telefono"
        formControlName="telefono" 
        placeholder="612345678"
        maxlength="9"
        [class.invalid]="isFieldInvalid('telefono')">
      
      @if (isFieldInvalid('telefono')) {
        <div class="error-message">
          {{ getErrorMessage('telefono') }}
        </div>
      }
    </div>

    <!-- Código Postal -->
    <div class="form-field">
      <label for="codigoPostal">Código Postal *</label>
      <input 
        id="codigoPostal"
        formControlName="codigoPostal" 
        placeholder="28001"
        maxlength="5"
        [class.invalid]="isFieldInvalid('codigoPostal')">
      
      @if (isFieldInvalid('codigoPostal')) {
        <div class="error-message">
          {{ getErrorMessage('codigoPostal') }}
        </div>
      }
    </div>

    <!-- Contraseña -->
    <div class="form-field">
      <label for="password">Contraseña *</label>
      <input 
        id="password"
        type="password"
        formControlName="password" 
        placeholder="••••••••••••"
        [class.invalid]="isFieldInvalid('password')">
      
      @if (userForm.get('password')?.touched && getPasswordErrors().length > 0) {
        <div class="error-list">
          <p class="error-title">La contraseña debe cumplir:</p>
          <ul>
            @for (error of getPasswordErrors(); track error) {
              <li class="error-item">{{ error }}</li>
            }
          </ul>
        </div>
      }
    </div>

    <!-- Confirmar Contraseña -->
    <div class="form-field">
      <label for="confirmPassword">Confirmar Contraseña *</label>
      <input 
        id="confirmPassword"
        type="password"
        formControlName="confirmPassword" 
        placeholder="••••••••••••"
        [class.invalid]="isFieldInvalid('confirmPassword')">
      
      @if (isFieldInvalid('confirmPassword')) {
        <div class="error-message">
          {{ getErrorMessage('confirmPassword') }}
        </div>
      }
    </div>

    <!-- Botones -->
    <div class="form-actions">
      <button 
        type="submit" 
        class="btn-primary"
        [disabled]="userForm.invalid">
        <span class="btn-icon">✓</span>
        Registrar Usuario
      </button>
      <button 
        type="button" 
        class="btn-secondary"
        (click)="onReset()">
        <span class="btn-icon">↻</span>
        Limpiar
      </button>
    </div>

    <!-- Estado del formulario -->
    <div class="form-status">
      <div class="status-item">
        <strong>Estado:</strong>
        @if (userForm.valid) {
          <span class="status-valid">✓ Válido</span>
        } @else {
          <span class="status-invalid">✕ Inválido</span>
        }
      </div>
      <div class="status-item">
        <strong>Pristine:</strong> {{ userForm.pristine ? 'Sí' : 'No' }}
      </div>
      <div class="status-item">
        <strong>Touched:</strong> {{ userForm.touched ? 'Sí' : 'No' }}
      </div>
    </div>

  </form>

  <!-- Sección de teoría -->
  <section class="theory-section">
    <h2>📚 Conceptos de Formularios Reactivos</h2>
    
    <div class="concept-grid">
      <div class="concept-card">
        <h3>FormBuilder</h3>
        <p>Servicio para crear FormGroup y FormControl programáticamente con sintaxis simplificada</p>
      </div>
      
      <div class="concept-card">
        <h3>FormGroup</h3>
        <p>Agrupa múltiples controles relacionados con validación sincronizada</p>
      </div>
      
      <div class="concept-card">
        <h3>FormControl</h3>
        <p>Representa un campo individual con valor, estado (valid/invalid) y errores</p>
      </div>
      
      <div class="concept-card">
        <h3>Validadores Síncronos</h3>
        <p>required, minLength, email, pattern, min, max - evaluación instantánea</p>
      </div>
      
      <div class="concept-card">
        <h3>Cross-Field Validation</h3>
        <p>Validadores a nivel FormGroup que comparan múltiples campos</p>
      </div>
      
      <div class="concept-card">
        <h3>ValidationErrors</h3>
        <p>Objeto con claves de error personalizadas para mensajes específicos</p>
      </div>
    </div>
  </section>
</div>
```

---

### Paso 5: Estilos del Formulario

**Archivo:** `src/app/pages/user-form/user-form.scss`

```scss
@use '../../../../styles/00-settings/variables' as *;

.form-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.form-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;

  .back-button {
    display: inline-block;
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    margin-bottom: 1rem;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(-5px);
    }
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
  }
}

.user-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.form-field {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &.invalid {
      border-color: #f44336;
    }

    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
  }
}

.error-message {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: '⚠';
  }
}

.error-list {
  background: #ffebee;
  border-left: 4px solid #f44336;
  padding: 1rem;
  margin-top: 0.5rem;
  border-radius: 4px;

  .error-title {
    font-weight: 600;
    color: #d32f2f;
    margin: 0 0 0.5rem 0;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .error-item {
    color: #c62828;
    margin: 0.25rem 0;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-icon {
      font-size: 1.25rem;
    }
  }

  .btn-primary {
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    }
  }

  .btn-secondary {
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
    }
  }
}

.form-status {
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  gap: 2rem;

  .status-item {
    strong {
      color: #666;
      margin-right: 0.5rem;
    }
  }

  .status-valid {
    color: #4caf50;
    font-weight: 600;
  }

  .status-invalid {
    color: #f44336;
    font-weight: 600;
  }
}

.theory-section {
  max-width: 1200px;
  margin: 3rem auto 0;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  h2 {
    color: #667eea;
    margin: 0 0 1.5rem 0;
  }
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.concept-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-radius: 10px;
  border-top: 4px solid #667eea;

  h3 {
    color: #764ba2;
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
  }

  p {
    color: #666;
    margin: 0;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }

  .form-header h1 {
    font-size: 1.75rem;
  }

  .user-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-status {
    flex-direction: column;
    gap: 0.5rem;
  }

  .concept-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### Paso 6: Registrar Ruta

**Archivo:** `app.routes.ts`

```typescript
import { UserForm } from './pages/user-form/user-form';

export const routes: Routes = [
  // ... rutas existentes
  { path: 'user-form', component: UserForm }
];
```

---

### Paso 7: Actualizar Home

**Archivo:** `home.ts`

Agregar nueva tarjeta:
```typescript
{
  id: 8,
  title: 'Fase 3 - Tarea 1 & 2: Formularios Reactivos',
  description: 'FormBuilder con validadores síncronos (required, email, pattern) y personalizados (contraseña fuerte, NIF, teléfono, CP). Cross-field validation para confirmar contraseña.',
  route: '/user-form',
  icon: '📝',
  color: '#9B59B6'
}
```

---

## ✅ Checklist de Progreso - Tarea 1

- [x] Configurar ReactiveFormsModule en componentes standalone
- [x] Crear estructura de carpeta validators/
- [x] Implementar FormBuilder con FormGroup
- [x] Agregar validadores síncronos (required, email, min, max)
- [x] Crear helpers para mensajes de error
- [x] Implementar template con formControlName
- [x] Agregar clases CSS condicionales ([class.invalid])
- [x] Mostrar errores solo cuando touched o submitted
- [x] Deshabilitar botón submit cuando invalid
- [x] Verificar compilación sin errores

## ✅ Checklist de Progreso - Tarea 2

- [x] Crear passwordStrength validator
- [x] Crear passwordMatch validator cross-field
- [x] Implementar validador NIF con letra correcta
- [x] Implementar validador teléfono móvil español
- [x] Implementar validador código postal
- [x] Crear validadores cross-field (totalMinimo, edadMayor)
- [x] Aplicar validadores en FormBuilder
- [x] Mostrar errores específicos por validador
- [x] Crear lista de errores para password
- [x] Integrar con ToastService
- [x] Registrar ruta
- [x] Actualizar Home
- [x] Verificar compilación sin errores

---

## 📊 Tabla de Validadores Implementados

| Validador | Tipo | Aplicación | Error Retornado |
|-----------|------|------------|-----------------|
| `required` | Síncrono | FormControl | `{required: true}` |
| `email` | Síncrono | FormControl | `{email: true}` |
| `minLength(n)` | Síncrono | FormControl | `{minlength: {requiredLength: n, actualLength: x}}` |
| `min(n)` | Síncrono | FormControl | `{min: {min: n, actual: x}}` |
| `max(n)` | Síncrono | FormControl | `{max: {max: n, actual: x}}` |
| `pattern(regex)` | Síncrono | FormControl | `{pattern: {requiredPattern: '^...', actualValue: '...'}}` |
| `passwordStrength()` | Personalizado | FormControl | `{noUppercase: true, noLowercase: true, ...}` |
| `nif()` | Personalizado | FormControl | `{invalidNif: true}` |
| `telefono()` | Personalizado | FormControl | `{invalidTelefono: true}` |
| `codigoPostal()` | Personalizado | FormControl | `{invalidCP: true}` |
| `passwordMatch()` | Cross-field | FormGroup | `{mismatch: true}` |
| `totalMinimo(n)` | Cross-field | FormGroup | `{totalMinimo: {min: n, actual: x}}` |
| `atLeastOneRequired()` | Cross-field | FormGroup | `{atLeastOneRequired: {fields: [...]}}` |

---

## 💡 Patrones y Mejores Prácticas

### 1. Estructura del Validador
```typescript
export function myValidator(param?: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Validación temprana (null/undefined)
    if (!control.value) return null;
    
    // Lógica de validación
    const isValid = /* ... */;
    
    // Retorno
    return isValid ? null : { myError: true };
  };
}
```

### 2. Cross-Field Validation
```typescript
this.fb.group({
  field1: [''],
  field2: ['']
}, { 
  validators: crossFieldValidator('field1', 'field2') 
});
```

### 3. Mensajes de Error Dinámicos
```typescript
getErrorMessage(controlName: string): string {
  const control = this.form.get(controlName);
  if (!control?.errors) return '';
  
  const error = Object.keys(control.errors)[0];
  return this.errorMessages[error] || 'Error de validación';
}
```

### 4. Validación Condicional
```typescript
this.userForm.get('field1')?.valueChanges.subscribe(value => {
  if (value === 'option1') {
    this.userForm.get('field2')?.setValidators([Validators.required]);
  } else {
    this.userForm.get('field2')?.clearValidators();
  }
  this.userForm.get('field2')?.updateValueAndValidity();
});
```

---

**Estado actual:** Todas las tareas de la Fase 3 ✅ COMPLETADAS. Implementación verificada sin errores de compilación.

## 📝 Tarea 3: Validadores Asíncronos

### Objetivo
Implementar validadores asíncronos que simulan llamadas a API para verificar disponibilidad de username y email. Los validadores deben usar debounce para evitar spam de peticiones y mostrar estados de carga (pending) en el template.

### Estado: ✅ COMPLETADA

---

### Paso 1: Crear AsyncValidatorsService

**Archivo:** `src/app/services/async-validators.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorsService {
  private debounceTime = 500; // Debounce de 500ms

  /**
   * Valida si el email ya está registrado (simula llamada API)
   * Retorna null si está disponible, {emailTaken: true} si está ocupado
   */
  emailUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Debounce + simulación de llamada API
      return timer(this.debounceTime).pipe(
        switchMap(() => {
          // Simular delay de red (600-800ms)
          const delay = Math.random() * 200 + 600;
          return timer(delay).pipe(
            map(() => {
              // Lista de emails "ocupados" para simulación
              const takenEmails = ['admin@example.com', 'test@example.com', 'taken@example.com'];
              const isTaken = takenEmails.includes(control.value.toLowerCase());
              return isTaken ? { emailTaken: true } : null;
            })
          );
        }),
        catchError(() => of(null)),
        take(1)
      );
    };
  }

  /**
   * Valida si el username está disponible (simula llamada API)
   * Retorna null si está disponible, {usernameTaken: true} si está ocupado
   */
  usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(this.debounceTime).pipe(
        switchMap(() => {
          const delay = Math.random() * 200 + 600;
          return timer(delay).pipe(
            map(() => {
              const takenUsernames = ['admin', 'root', 'test', 'user'];
              const isTaken = takenUsernames.includes(control.value.toLowerCase());
              return isTaken ? { usernameTaken: true } : null;
            })
          );
        }),
        catchError(() => of(null)),
        take(1)
      );
    };
  }
}
```

**Características:**
- ✅ Debounce de 500ms con `timer()`
- ✅ `switchMap()` cancela peticiones anteriores
- ✅ Simula delay de red realista (600-800ms)
- ✅ `take(1)` completa el observable automáticamente
- ✅ `catchError()` maneja errores de red

---

### Paso 2: Integrar en user-form.ts

**Actualizaciones en:** `src/app/pages/user-form/user-form.ts`

```typescript
import { AsyncValidatorsService } from '../../services/async-validators.service';

export class UserForm {
  private asyncValidators = inject(AsyncValidatorsService);

  ngOnInit(): void {
    this.userForm = this.fb.group({
      // ... otros campos

      username: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [this.asyncValidators.usernameAvailable()],
        updateOn: 'blur' // Solo valida al perder foco
      }],

      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.asyncValidators.emailUnique()],
        updateOn: 'blur'
      }],

      // ... otros campos
    });
  }

  // Getters para acceso en template
  get email() {
    return this.userForm.get('email');
  }

  get username() {
    return this.userForm.get('username');
  }
}
```

**Configuración clave:**
- `updateOn: 'blur'`: Valida solo al salir del campo, no en cada tecla
- `asyncValidators`: Array de validadores asíncronos
- Getters facilitan acceso en template para pending state

---

### Paso 3: Actualizar Template con Estados Pending

**Actualizaciones en:** `src/app/pages/user-form/user-form.html`

```html
<!-- Campo Username con validación asíncrona -->
<div class="form-group">
  <label for="username">Usuario *</label>
  <input
    type="text"
    id="username"
    formControlName="username"
    [class.invalid]="username?.invalid && username?.touched"
    [class.valid]="username?.valid && username?.touched"
  />
  
  @if (username?.pending) {
    <div class="loading-message">⏳ Comprobando disponibilidad...</div>
  }
  
  @if (username?.invalid && username?.touched) {
    <div class="error-message">
      @if (username?.errors?.['required']) {
        <span>El usuario es obligatorio</span>
      }
      @if (username?.errors?.['minlength']) {
        <span>Mínimo 3 caracteres</span>
      }
      @if (username?.errors?.['usernameTaken']) {
        <span>Este usuario ya está ocupado</span>
      }
    </div>
  }
</div>

<!-- Campo Email con validación asíncrona -->
<div class="form-group">
  <label for="email">Email *</label>
  <input
    type="email"
    id="email"
    formControlName="email"
    [class.invalid]="email?.invalid && email?.touched"
    [class.valid]="email?.valid && email?.touched"
  />
  
  @if (email?.pending) {
    <div class="loading-message">⏳ Verificando email...</div>
  }
  
  @if (email?.invalid && email?.touched) {
    <div class="error-message">
      @if (email?.errors?.['required']) {
        <span>El email es obligatorio</span>
      }
      @if (email?.errors?.['email']) {
        <span>Email inválido</span>
      }
      @if (email?.errors?.['emailTaken']) {
        <span>Este email ya está registrado</span>
      }
    </div>
  }
</div>
```

---

### Paso 4: Agregar Estilos para Loading State

**Actualizaciones en:** `src/app/pages/user-form/user-form.scss`

```scss
.loading-message {
  color: #2196f3;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 📝 Tarea 4: FormArray para Contenido Dinámico

### Objetivo
Implementar FormArray para gestionar colecciones dinámicas (agregar/eliminar elementos). Crear un formulario de factura con 3 FormArrays: teléfonos, direcciones e items de factura con cálculo de total.

### Estado: ✅ COMPLETADA

---

### Paso 1: Crear InvoiceForm Component

**Archivo:** `src/app/pages/invoice-form/invoice-form.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.scss'
})
export class InvoiceForm implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  
  invoiceForm!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      
      // FormArray para teléfonos
      phones: this.fb.array([]),
      
      // FormArray para direcciones
      addresses: this.fb.array([]),
      
      // FormArray para items de factura
      items: this.fb.array([])
    });

    // Agregar elementos iniciales
    this.addPhone();
    this.addAddress();
    this.addItem();
  }

  // Getters para acceso en template
  get phones(): FormArray {
    return this.invoiceForm.get('phones') as FormArray;
  }

  get addresses(): FormArray {
    return this.invoiceForm.get('addresses') as FormArray;
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  // Métodos para teléfonos
  addPhone(): void {
    const phoneGroup = this.fb.group({
      number: ['', [Validators.required, Validators.pattern(/^(6|7)[0-9]{8}$/)]]
    });
    this.phones.push(phoneGroup);
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    } else {
      this.toastService.showToast('error', 'Debe haber al menos un teléfono');
    }
  }

  // Métodos para direcciones
  addAddress(): void {
    const addressGroup = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
    });
    this.addresses.push(addressGroup);
  }

  removeAddress(index: number): void {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
    } else {
      this.toastService.showToast('error', 'Debe haber al menos una dirección');
    }
  }

  // Métodos para items
  addItem(): void {
    const itemGroup = this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    } else {
      this.toastService.showToast('error', 'Debe haber al menos un item');
    }
  }

  // Cálculo de totales
  getItemTotal(index: number): number {
    const item = this.items.at(index).value;
    return item.quantity * item.price;
  }

  getTotal(): number {
    return this.items.controls.reduce((total, control) => {
      const item = control.value;
      return total + (item.quantity * item.price);
    }, 0);
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.invoiceForm.valid) {
      console.log('Invoice data:', this.invoiceForm.value);
      this.toastService.showToast('success', '✅ Factura guardada correctamente');
      
      // Reset opcional
      // this.invoiceForm.reset();
      // this.submitted = false;
    } else {
      this.invoiceForm.markAllAsTouched();
      this.toastService.showToast('error', '❌ Por favor corrija los errores del formulario');
    }
  }
}
```

---

### Paso 2: Crear Template con FormArray

**Archivo:** `src/app/pages/invoice-form/invoice-form.html`

```html
<div class="invoice-container">
  <h1>🧾 Formulario de Factura</h1>
  <p class="subtitle">Demostración de FormArray para contenido dinámico</p>

  <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()" class="invoice-form">
    
    <!-- Datos del Cliente -->
    <section class="section">
      <h2>👤 Datos del Cliente</h2>
      
      <div class="form-group">
        <label for="customerName">Nombre *</label>
        <input
          type="text"
          id="customerName"
          formControlName="customerName"
          [class.invalid]="invoiceForm.get('customerName')?.invalid && 
                           (invoiceForm.get('customerName')?.touched || submitted)"
        />
        @if (invoiceForm.get('customerName')?.invalid && 
             (invoiceForm.get('customerName')?.touched || submitted)) {
          <div class="error-message">Nombre requerido (mínimo 3 caracteres)</div>
        }
      </div>

      <div class="form-group">
        <label for="customerEmail">Email *</label>
        <input
          type="email"
          id="customerEmail"
          formControlName="customerEmail"
          [class.invalid]="invoiceForm.get('customerEmail')?.invalid && 
                           (invoiceForm.get('customerEmail')?.touched || submitted)"
        />
        @if (invoiceForm.get('customerEmail')?.invalid && 
             (invoiceForm.get('customerEmail')?.touched || submitted)) {
          <div class="error-message">Email válido requerido</div>
        }
      </div>
    </section>

    <!-- FormArray: Teléfonos -->
    <section class="section">
      <h2>📱 Teléfonos de Contacto</h2>
      
      <div formArrayName="phones" class="array-container">
        @for (phone of phones.controls; track $index) {
          <div [formGroupName]="$index" class="array-item">
            <div class="form-group flex-grow">
              <label [for]="'phone-' + $index">Teléfono {{ $index + 1 }} *</label>
              <input
                type="tel"
                [id]="'phone-' + $index"
                formControlName="number"
                placeholder="6XX XXX XXX o 7XX XXX XXX"
                [class.invalid]="phone.get('number')?.invalid && 
                                 (phone.get('number')?.touched || submitted)"
              />
              @if (phone.get('number')?.invalid && 
                   (phone.get('number')?.touched || submitted)) {
                <div class="error-message">
                  @if (phone.get('number')?.errors?.['required']) {
                    <span>El teléfono es obligatorio</span>
                  }
                  @if (phone.get('number')?.errors?.['pattern']) {
                    <span>Formato: 6XX XXX XXX o 7XX XXX XXX</span>
                  }
                </div>
              }
            </div>
            
            <button
              type="button"
              class="btn-remove"
              (click)="removePhone($index)"
              [disabled]="phones.length === 1"
              title="Eliminar teléfono"
            >
              🗑️
            </button>
          </div>
        }
      </div>
      
      <button type="button" class="btn-add" (click)="addPhone()">
        ➕ Agregar Teléfono
      </button>
    </section>

    <!-- FormArray: Direcciones -->
    <section class="section">
      <h2>📍 Direcciones de Envío</h2>
      
      <div formArrayName="addresses" class="array-container">
        @for (address of addresses.controls; track $index) {
          <div [formGroupName]="$index" class="array-item">
            <div class="address-grid">
              <div class="form-group">
                <label [for]="'street-' + $index">Calle *</label>
                <input
                  type="text"
                  [id]="'street-' + $index"
                  formControlName="street"
                  [class.invalid]="address.get('street')?.invalid && 
                                   (address.get('street')?.touched || submitted)"
                />
              </div>

              <div class="form-group">
                <label [for]="'city-' + $index">Ciudad *</label>
                <input
                  type="text"
                  [id]="'city-' + $index"
                  formControlName="city"
                  [class.invalid]="address.get('city')?.invalid && 
                                   (address.get('city')?.touched || submitted)"
                />
              </div>

              <div class="form-group">
                <label [for]="'postalCode-' + $index">CP *</label>
                <input
                  type="text"
                  [id]="'postalCode-' + $index"
                  formControlName="postalCode"
                  placeholder="12345"
                  maxlength="5"
                  [class.invalid]="address.get('postalCode')?.invalid && 
                                   (address.get('postalCode')?.touched || submitted)"
                />
              </div>
            </div>
            
            <button
              type="button"
              class="btn-remove"
              (click)="removeAddress($index)"
              [disabled]="addresses.length === 1"
              title="Eliminar dirección"
            >
              🗑️
            </button>
          </div>
        }
      </div>
      
      <button type="button" class="btn-add" (click)="addAddress()">
        ➕ Agregar Dirección
      </button>
    </section>

    <!-- FormArray: Items de Factura -->
    <section class="section">
      <h2>📦 Items de la Factura</h2>
      
      <div formArrayName="items" class="array-container">
        @for (item of items.controls; track $index) {
          <div [formGroupName]="$index" class="array-item">
            <div class="item-grid">
              <div class="form-group">
                <label [for]="'desc-' + $index">Descripción *</label>
                <input
                  type="text"
                  [id]="'desc-' + $index"
                  formControlName="description"
                  [class.invalid]="item.get('description')?.invalid && 
                                   (item.get('description')?.touched || submitted)"
                />
              </div>

              <div class="form-group">
                <label [for]="'qty-' + $index">Cantidad *</label>
                <input
                  type="number"
                  [id]="'qty-' + $index"
                  formControlName="quantity"
                  min="1"
                  [class.invalid]="item.get('quantity')?.invalid && 
                                   (item.get('quantity')?.touched || submitted)"
                />
              </div>

              <div class="form-group">
                <label [for]="'price-' + $index">Precio €*</label>
                <input
                  type="number"
                  [id]="'price-' + $index"
                  formControlName="price"
                  min="0"
                  step="0.01"
                  [class.invalid]="item.get('price')?.invalid && 
                                   (item.get('price')?.touched || submitted)"
                />
              </div>

              <div class="form-group">
                <label>Total</label>
                <div class="total-display">{{ getItemTotal($index) | number:'1.2-2' }} €</div>
              </div>
            </div>
            
            <button
              type="button"
              class="btn-remove"
              (click)="removeItem($index)"
              [disabled]="items.length === 1"
              title="Eliminar item"
            >
              🗑️
            </button>
          </div>
        }
      </div>
      
      <button type="button" class="btn-add" (click)="addItem()">
        ➕ Agregar Item
      </button>

      <div class="invoice-total">
        <strong>Total Factura:</strong>
        <span class="total-amount">{{ getTotal() | number:'1.2-2' }} €</span>
      </div>
    </section>

    <!-- Botones de Acción -->
    <div class="form-actions">
      <button type="submit" class="btn-submit">
        💾 Guardar Factura
      </button>
    </div>
  </form>
</div>
```

---

### Paso 3: Estilos para InvoiceForm

**Archivo:** `src/app/pages/invoice-form/invoice-form.scss`

```scss
.invoice-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  h1 {
    color: white;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    margin-bottom: 2rem;
  }
}

.invoice-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
}

.section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }

  h2 {
    color: #667eea;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &.invalid {
      border-color: #f44336;
    }

    &.valid {
      border-color: #4caf50;
    }
  }
}

.array-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.array-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;

  .flex-grow {
    flex: 1;
  }
}

.address-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr 100px;
  gap: 1rem;
}

.item-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 100px 120px 120px;
  gap: 1rem;
  align-items: end;
}

.total-display {
  padding: 0.75rem;
  background: #e3f2fd;
  border-radius: 8px;
  text-align: right;
  font-weight: bold;
  color: #1976d2;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

.btn-remove {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background: #d32f2f;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.invoice-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-top: 1rem;
  color: white;
  font-size: 1.25rem;

  .total-amount {
    font-size: 1.75rem;
    font-weight: bold;
  }
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-submit {
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
}

.error-message {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: '⚠';
  }
}

@media (max-width: 768px) {
  .address-grid,
  .item-grid {
    grid-template-columns: 1fr;
  }

  .array-item {
    flex-direction: column;
  }

  .btn-remove {
    align-self: flex-end;
  }
}
```

---

## ✅ Checklist de Progreso - Tarea 3

- [x] Crear AsyncValidatorsService
- [x] Implementar emailUnique() con debounce
- [x] Implementar usernameAvailable() con debounce
- [x] Usar timer() + switchMap() para cancelar peticiones
- [x] Simular delay de API (600-800ms)
- [x] Configurar updateOn: 'blur' en campos
- [x] Integrar en user-form.ts
- [x] Mostrar estado pending en template
- [x] Agregar estilos para loading-message
- [x] Agregar mensajes de error específicos
- [x] Verificar compilación sin errores

## ✅ Checklist de Progreso - Tarea 4

- [x] Crear InvoiceForm component
- [x] Configurar 3 FormArrays (phones, addresses, items)
- [x] Implementar métodos add/remove para cada array
- [x] Crear getters para acceso en template
- [x] Implementar getItemTotal() y getTotal()
- [x] Usar @for con track $index en template
- [x] Aplicar formArrayName y [formGroupName]
- [x] Validar cada elemento del array
- [x] Deshabilitar remove cuando length === 1
- [x] Agregar estilos con grid layouts
- [x] Integrar con ToastService
- [x] Registrar ruta en app.routes.ts
- [x] Actualizar Home con Task 9
- [x] Verificar compilación sin errores

---

## 📝 Tarea 5: UX de Validación y Estados del Formulario

### Objetivo
Mejorar la experiencia de usuario implementando patrones de validación progresivos: mostrar errores solo cuando sea apropiado (touched/dirty), deshabilitar submit cuando hay validaciones pendientes, y proporcionar feedback visual claro del estado de validación.

### Estado: ✅ COMPLETADA

---

### 1. Mostrar Errores Solo Tras Touched/Dirty

**Problema:** Mostrar errores inmediatamente al cargar el formulario crea una "pantalla roja" que intimida al usuario antes de interactuar con el formulario.

**Solución:** Mostrar errores solo cuando el campo ha sido tocado (`touched`) o modificado (`dirty`).

**Implementación aplicada en user-form.html:**

```html
<!-- Errores condicionales -->
@if (email?.invalid && (email?.touched || email?.dirty)) {
  <div class="error-message">
    @if (email?.errors?.['required']) {
      <span>El email es obligatorio</span>
    }
    @if (email?.errors?.['email']) {
      <span>Formato de email inválido</span>
    }
  </div>
}
```

**Características:**
- ✅ Errores solo visibles después de interacción
- ✅ Clases CSS condicionales para feedback visual
- ✅ No muestra errores en carga inicial

---

### 2. Deshabilitar Submit Si Formulario Inválido o Pending

**Implementación aplicada:**

```html
<button 
  type="submit" 
  class="btn-primary"
  [disabled]="userForm.invalid || userForm.pending">
  <span class="btn-icon">
    @if (userForm.pending) {
      ⏳
    } @else {
      ✓
    }
  </span>
  {{ userForm.pending ? 'Validando...' : 'Registrar Usuario' }}
</button>
```

**Estados del botón:**
- **`form.invalid`**: Botón deshabilitado
- **`form.pending`**: Botón deshabilitado + texto "Validando..."
- **`form.valid`**: Botón habilitado

---

### 3. Loading Durante Validación Asíncrona

**Implementación aplicada en user-form.html:**

```html
@if (username?.pending) {
  <div class="loading-message">⏳ Comprobando disponibilidad...</div>
}

@if (username?.invalid && username?.touched && !username?.pending) {
  <div class="error-message">
    <!-- errores -->
  </div>
}
```

**Estilos con animación:**

```scss
.loading-message {
  color: #2196f3;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

### 4. Feedback Visual con Clases de Angular

**Implementación aplicada en user-form.scss y invoice-form.scss:**

```scss
// Campo inválido después de ser tocado
input.ng-touched.ng-invalid {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

// Campo válido después de ser tocado
input.ng-touched.ng-valid {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

// Campo con validación asíncrona en curso
input.ng-pending {
  border-style: dashed;
  border-color: #2196f3;
  background-color: #e3f2fd;
}
```

**Clases automáticas de Angular:**
- `ng-untouched` / `ng-touched`
- `ng-pristine` / `ng-dirty`
- `ng-valid` / `ng-invalid`
- `ng-pending`

---

## 📝 Tarea 6: Documentación Completa

### Objetivo
Crear documentación exhaustiva del sistema de validación implementado.

### Estado: ✅ COMPLETADA

---

## 📋 Catálogo de Validadores Implementados

| Validador | Tipo | Nivel | Descripción | Error | Uso |
|-----------|------|-------|-------------|-------|-----|
| `Validators.required` | Síncrono | Campo | Valor no vacío obligatorio | `{required: true}` | Campos obligatorios |
| `Validators.email` | Síncrono | Campo | Formato email RFC 5322 | `{email: true}` | Email |
| `Validators.minLength(n)` | Síncrono | Campo | Longitud mínima | `{minlength: {...}}` | Password |
| `Validators.min(n)` | Síncrono | Campo | Valor mínimo | `{min: {...}}` | Edad, precio |
| `Validators.max(n)` | Síncrono | Campo | Valor máximo | `{max: {...}}` | Límites |
| `Validators.pattern(regex)` | Síncrono | Campo | Patrón regex | `{pattern: {...}}` | Formatos |
| `passwordStrength()` | Personalizado | Campo | 12+ chars, upper/lower/num/special | `{noUppercase, ...}` | Password |
| `nif()` | Personalizado | Campo | NIF español con letra | `{invalidNif: true}` | Documento |
| `telefono()` | Personalizado | Campo | Móvil 6/7 + 8 dígitos | `{invalidTelefono}` | Teléfono |
| `codigoPostal()` | Personalizado | Campo | CP 5 dígitos | `{invalidCP: true}` | Dirección |
| `passwordMatch(c1,c2)` | Cross-field | FormGroup | Passwords coinciden | `{mismatch: true}` | Registro |
| `totalMinimo(min)` | Cross-field | FormGroup | Total mínimo | `{totalMinimo: {...}}` | Factura |
| `atLeastOneRequired()` | Cross-field | FormGroup | Al menos un campo | `{atLeastOneRequired}` | Tel/Email |
| `emailUnique()` | Asíncrono | Campo | Email disponible (API) | `{emailTaken: true}` | Registro |
| `usernameAvailable()` | Asíncrono | Campo | Username disponible (API) | `{usernameTaken}` | Registro |

---

## 📦 Guía de FormArray

### Definición

```typescript
this.form = this.fb.group({
  customer: ['', Validators.required],
  phones: this.fb.array([]),
  addresses: this.fb.array([])
});
```

### Getters

```typescript
get phones(): FormArray {
  return this.form.get('phones') as FormArray;
}
```

### Agregar Elementos

```typescript
addPhone(): void {
  const phoneGroup = this.fb.group({
    number: ['', [Validators.required, telefono()]]
  });
  this.phones.push(phoneGroup);
}
```

### Eliminar Elementos

```typescript
removePhone(index: number): void {
  if (this.phones.length > 1) {
    this.phones.removeAt(index);
  }
}
```

### Template

```html
<div formArrayName="phones">
  @for (phone of phones.controls; track $index) {
    <div [formGroupName]="$index">
      <input formControlName="number" />
      <button (click)="removePhone($index)">🗑️</button>
    </div>
  }
  <button (click)="addPhone()">➕ Agregar</button>
</div>
```

---

## 🔄 Validación Asíncrona: Flujo Completo

### Servicio (Simulación API)

```typescript
@Injectable({ providedIn: 'root' })
export class ValidationService {
  private usedEmails = ['admin@ejemplo.com'];

  checkEmailUnique(email: string): Observable<boolean> {
    return of(!this.usedEmails.includes(email.toLowerCase()))
      .pipe(delay(800));
  }
}
```

### Validador Asíncrono con Debounce

```typescript
emailUnique(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return timer(500).pipe(
      switchMap(() => this.checkEmailUnique(control.value)),
      map(isUnique => isUnique ? null : { emailTaken: true }),
      catchError(() => of(null)),
      take(1)
    );
  };
}
```

**Operadores RxJS:**
- `timer(500)`: Debounce de 500ms
- `switchMap()`: Cancela peticiones previas
- `map()`: Transforma resultado
- `catchError()`: Maneja errores
- `take(1)`: Completa automáticamente

### Uso en Formulario

```typescript
this.form = this.fb.group({
  email: ['', {
    validators: [Validators.required, Validators.email],
    asyncValidators: [this.asyncValidators.emailUnique()],
    updateOn: 'blur'
  }]
});
```

### Template con Estados

```html
<input formControlName="email" />

@if (email?.pending) {
  <div class="loading-message">⏳ Comprobando email...</div>
}

@if (email?.errors?.['emailTaken'] && !email?.pending && email?.touched) {
  <div class="error">Este email ya está registrado</div>
}

<button [disabled]="form.invalid || form.pending">
  {{ form.pending ? 'Validando...' : 'Guardar' }}
</button>
```

### Flujo de Estados

```
Usuario escribe → Timer(500ms) → switchMap → API → Resultado
                   ↓                          ↓
                pending: true            pending: false
                                         + errors/null
```

---

## ✅ Checklist - Tarea 5

- [x] Errores solo tras touched/dirty
- [x] Clases CSS condicionales
- [x] Submit deshabilitado con invalid || pending
- [x] Texto dinámico en botón submit
- [x] Loading durante async validation
- [x] Estilos .loading-message con pulse
- [x] Feedback con ng-touched.ng-invalid
- [x] Feedback con ng-touched.ng-valid
- [x] Feedback con ng-pending (dashed border)
- [x] Aplicado en user-form
- [x] Aplicado en invoice-form

## ✅ Checklist - Tarea 6

- [x] Catálogo de 15 validadores
- [x] Guía de FormArray completa
- [x] Ejemplo validación asíncrona
- [x] Diagrama de flujo
- [x] Operadores RxJS explicados
- [x] Mejores prácticas documentadas

---

**Estado final:** Fase 3 completa con 6 tareas ✅ (Formularios reactivos, validadores síncronos/personalizados/asíncronos/cross-field, FormArray, UX de validación, documentación exhaustiva).
