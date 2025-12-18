import { Component, ViewEncapsulation, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserDropdown } from '../../shared/user-dropdown/user-dropdown';
import { Modal } from '../../shared/modal/modal';
import { LoginForm } from '../../shared/login-form/login-form';
import { RegisterForm } from '../../shared/register-form/register-form';
import { ThemeService } from '../../../services/theme.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, UserDropdown, Modal, LoginForm, RegisterForm],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None
})
export class Header {
  private themeService = inject(ThemeService);
  private toastService = inject(ToastService);
  
  isLoggedIn = false;
  showLoginModal = false;
  showRegisterModal = false;
  mobileMenuOpen = false;
  
  // Computed para saber si el tema es oscuro
  isDarkTheme = computed(() => this.themeService.currentTheme() === 'dark');

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openLoginModal(): void {
    this.showLoginModal = true;
    this.showRegisterModal = false;
    this.closeMobileMenu();
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
    this.showLoginModal = false;
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }

  // Navegar de Login a Registro
  onGoToRegister(): void {
    this.closeLoginModal();
    this.openRegisterModal();
  }

  // Navegar de Registro a Login
  onGoToLogin(): void {
    this.closeRegisterModal();
    this.openLoginModal();
  }

  onLoginSuccess(credentials: {username: string, password: string}): void {
    this.isLoggedIn = true;
    this.closeLoginModal();
    this.toastService.success(`¡Bienvenido, ${credentials.username}!`);
  }

  onRegisterSuccess(data: {name: string, email: string, password: string}): void {
    this.closeRegisterModal();
    this.toastService.success(`¡Cuenta creada exitosamente! Bienvenido, ${data.name}`);
    this.isLoggedIn = true;
  }

  onLogout(): void {
    this.isLoggedIn = false;
    this.toastService.info('Has cerrado sesión');
  }
}
