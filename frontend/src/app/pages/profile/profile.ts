import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { FormComponent } from '../../guards/pending-changes.guard';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements FormComponent, OnInit {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Computed para obtener datos del usuario
  user = computed(() => this.auth.currentUser());
  isLoggedIn = computed(() => this.auth.isLoggedIn());

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^[0-9]{9}$/)]],
    bio: ['', [Validators.maxLength(200)]],
    notifications: [true],
    newsletter: [false]
  });

  ngOnInit(): void {
    this.auth.checkSession();
    
    // Pequeño delay para asegurar que la sesión se restaure
    setTimeout(() => {
      if (!this.auth.isLoggedIn()) {
        this.toastService.error('Debes iniciar sesión para ver tu perfil');
        this.router.navigate(['/']);
        return;
      }
      
      // Inicializar el formulario con los datos del usuario
      const user = this.auth.currentUser();
      if (user) {
        this.form.patchValue({
          username: user.username,
          email: user.email
        });
      }
    }, 50);
  }

  /**
   * Obtener las iniciales del usuario para el avatar
   */
  getUserInitials(): string {
    const username = this.user()?.username;
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Por favor, completa todos los campos correctamente');
      return;
    }

    // Simular guardado
    this.toastService.success('Perfil actualizado correctamente');
    
    // Marcar el formulario como pristine (sin cambios)
    this.form.markAsPristine();
  }

  onCancel(): void {
    if (this.form.dirty) {
      const confirmed = confirm('¿Descartar los cambios realizados?');
      if (confirmed) {
        this.form.reset();
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/home']);
    }
  }

  logout(): void {
    this.auth.logout();
    this.toastService.info('Sesión cerrada');
    this.router.navigate(['/home']);
  }
}
