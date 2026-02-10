import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  showPassword = false;
  isLoading = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.error('Por favor, completa todos los campos correctamente');
      return;
    }

    const { username, password } = this.loginForm.value;
    this.isLoading = true;
    
    this.auth.login(username!, password!).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.id) {
          this.toastService.success(`¡Bienvenido, ${response.username}!`);
          
          // Obtener returnUrl de query params
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
          
          // Navegar a la URL de retorno
          this.router.navigateByUrl(returnUrl);
        } else {
          this.toastService.error(response.message || 'Error al iniciar sesión');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error('Error al conectar con el servidor');
      }
    });
  }

  quickLogin(type: 'user' | 'admin'): void {
    if (type === 'admin') {
      this.loginForm.patchValue({
        username: 'admin',
        password: 'admin123'
      });
    } else {
      this.loginForm.patchValue({
        username: 'usuario',
        password: 'user123'
      });
    }
  }
}
