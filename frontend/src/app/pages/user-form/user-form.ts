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
import { AsyncValidatorsService } from '../../services/async-validators.service';
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
  private asyncValidators = inject(AsyncValidatorsService);

  userForm: FormGroup;
  isSubmitted = signal(false);

  constructor() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [this.asyncValidators.usernameAvailable()],
        updateOn: 'blur'
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.asyncValidators.emailUnique()],
        updateOn: 'blur'
      }],
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
    if (errors['emailTaken']) return 'Email ya registrado';
    if (errors['usernameTaken']) return 'Nombre de usuario no disponible';

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
      username: 'Nombre de usuario',
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
    return !!(field && field.invalid && (field.touched || this.isSubmitted()) && !field.pending);
  }

  // Getters para acceso en template
  get email() { return this.userForm.get('email'); }
  get username() { return this.userForm.get('username'); }
}
