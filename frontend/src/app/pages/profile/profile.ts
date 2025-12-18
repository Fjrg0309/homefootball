import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { FormComponent } from '../../guards/pending-changes.guard';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements FormComponent {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  form: FormGroup = this.fb.group({
    name: [this.auth.currentUser()?.name || '', [Validators.required, Validators.minLength(3)]],
    email: [this.auth.currentUser()?.email || '', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^[0-9]{9}$/)]],
    bio: ['', [Validators.maxLength(200)]],
    notifications: [true],
    newsletter: [false]
  });

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
