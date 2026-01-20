import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInput } from '../form-input/form-input';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() goToRegister = new EventEmitter<void>();

  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  formData = {
    username: '',
    password: ''
  };

  submitted = false;
  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage.set('');

    if (!this.formData.username || !this.formData.password) {
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.formData.username, this.formData.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        
        if (response.id) {
          // Login exitoso
          this.loginSuccess.emit();
          this.formData = { username: '', password: '' };
          this.submitted = false;
        } else {
          // Error del backend
          this.errorMessage.set(response.message || 'Usuario o contraseña incorrectos');
          this.toastService.error(response.message || 'Usuario o contraseña incorrectos');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error de conexión. Intenta de nuevo.');
        this.toastService.error('Error de conexión');
      }
    });
  }

  onGoToRegister(): void {
    this.goToRegister.emit();
  }
}
