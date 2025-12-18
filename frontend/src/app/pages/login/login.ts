import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.error('Por favor, completa todos los campos correctamente');
      return;
    }

    const { email, password } = this.loginForm.value;
    
    if (this.auth.login(email!, password!)) {
      this.toastService.success(`¡Bienvenido! ${email}`);
      
      // Obtener returnUrl de query params
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
      
      // Navegar a la URL de retorno
      this.router.navigateByUrl(returnUrl);
    } else {
      this.toastService.error('Credenciales inválidas');
    }
  }

  quickLogin(type: 'user' | 'admin'): void {
    if (type === 'admin') {
      this.loginForm.patchValue({
        email: 'admin@demo.com',
        password: 'admin123'
      });
    } else {
      this.loginForm.patchValue({
        email: 'user@demo.com',
        password: 'user123'
      });
    }
  }
}
