import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordStrength } from '../../../validators/password-strength.validator';
import { passwordMatch } from '../../../validators/password-match.validator';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss'
})
export class RegisterForm {
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() goToLogin = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  isLoading = signal(false);
  errorMessage = signal('');

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrength()]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: [passwordMatch('password', 'confirmPassword')]
  });

  submitted = false;

  get nameControl() { return this.registerForm.controls.name; }
  get emailControl() { return this.registerForm.controls.email; }
  get passwordControl() { return this.registerForm.controls.password; }
  get confirmPasswordControl() { return this.registerForm.controls.confirmPassword; }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched || this.submitted) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['email']) return 'El email no es válido';
    
    // Password strength errors
    if (errors['minLength']) return 'La contraseña debe tener al menos 6 caracteres';
    if (errors['noUppercase']) return 'Debe contener al menos una mayúscula';
    if (errors['noLowercase']) return 'Debe contener al menos una minúscula';
    if (errors['noNumber']) return 'Debe contener al menos un número';
    if (errors['noSpecial']) return 'Debe contener al menos un carácter especial (!@#$%^&*)';

    return 'Campo inválido';
  }

  getPasswordMatchError(): string {
    const confirmControl = this.confirmPasswordControl;
    if (confirmControl.errors?.['mismatch'] && 
        (confirmControl.dirty || confirmControl.touched || this.submitted)) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.value;
    
    this.isLoading.set(true);
    
    this.authService.register({
      username: name!,
      email: email!,
      password: password!
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        
        if (response.id) {
          // Registro exitoso
          this.registerSuccess.emit();
          this.registerForm.reset();
          this.submitted = false;
        } else {
          // Error del backend (usuario o email ya existe)
          this.errorMessage.set(response.message || 'Error al registrar usuario');
          this.toastService.error(response.message || 'Error al registrar usuario');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error de conexión. Intenta de nuevo.');
        this.toastService.error('Error de conexión');
      }
    });
  }

  onGoToLogin(): void {
    this.goToLogin.emit();
  }
}
