import { Component, ViewEncapsulation, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Header, Footer],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  encapsulation: ViewEncapsulation.None
})
export class Settings {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Estado del usuario
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.currentUser());

  // Configuraciones
  selectedLanguage = signal('Español');
  notificationsEnabled = signal(true);

  // Opciones disponibles
  languages = ['Español', 'English', 'Français', 'Deutsch', 'Italiano', 'Português'];

  // Toggle notificaciones
  toggleNotifications(): void {
    this.notificationsEnabled.set(!this.notificationsEnabled());
    const status = this.notificationsEnabled() ? 'activadas' : 'desactivadas';
    this.toastService.info(`Notificaciones ${status}`);
  }

  // Cambiar idioma
  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedLanguage.set(select.value);
    this.toastService.info(`Idioma cambiado a ${select.value}`);
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.toastService.success('Has cerrado sesión correctamente');
    this.router.navigate(['/']);
  }

  // Borrar cuenta
  deleteAccount(): void {
    if (confirm('¿Estás seguro de que quieres borrar tu cuenta? Esta acción no se puede deshacer.')) {
      // Simulación de borrado de cuenta
      this.authService.logout();
      this.toastService.warning('Tu cuenta ha sido eliminada');
      this.router.navigate(['/']);
    }
  }
}
