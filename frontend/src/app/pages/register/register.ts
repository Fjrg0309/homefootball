import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoginModalService } from '../../services/login-modal.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private loginModalService = inject(LoginModalService);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Validador para confirmar que las contraseñas coinciden
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastService.error('Por favor, completa todos los campos correctamente');
      return;
    }

    const { username, email, password } = this.registerForm.value;
    this.isLoading = true;
    
    this.auth.register({ username: username!, email: email!, password: password! }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.id) {
          this.toastService.success(`¡Cuenta creada! Bienvenido, ${response.username}`);
          this.router.navigate(['/home']);
        } else {
          this.toastService.error(response.message || 'Error al registrar usuario');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Error al conectar con el servidor');
      }
    });
  }

  openLoginModal(): void {
    this.loginModalService.openLogin();
  }
}
