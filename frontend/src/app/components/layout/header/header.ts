import { Component, ViewEncapsulation, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserDropdown } from '../../shared/user-dropdown/user-dropdown';
import { Modal } from '../../shared/modal/modal';
import { LoginForm } from '../../shared/login-form/login-form';
import { RegisterForm } from '../../shared/register-form/register-form';
import { ThemeService } from '../../../services/theme.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { LoginModalService } from '../../../services/login-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, UserDropdown, Modal, LoginForm, RegisterForm],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None
})
export class Header implements OnInit {
  private themeService = inject(ThemeService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private loginModalService = inject(LoginModalService);
  private router = inject(Router);
  
  // Usamos computed para reactividad con signals del AuthService
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.currentUser());
  
  // Conectar con el servicio de modal global
  showLoginModal = computed(() => this.loginModalService.showLoginModal());
  showRegisterModal = computed(() => this.loginModalService.showRegisterModal());
  
  mobileMenuOpen = false;
  
  // Computed para saber si el tema es oscuro
  isDarkTheme = computed(() => this.themeService.currentTheme() === 'dark');
  
  ngOnInit(): void {
    // Verificar sesión existente al iniciar
    this.authService.checkSession();
  }

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
    this.loginModalService.openLogin();
    this.closeMobileMenu();
  }

  closeLoginModal(): void {
    this.loginModalService.closeLogin();
  }

  openRegisterModal(): void {
    this.loginModalService.openRegister();
  }

  closeRegisterModal(): void {
    this.loginModalService.closeRegister();
  }

  // Navegar de Login a Registro
  onGoToRegister(): void {
    this.loginModalService.closeLogin();
    this.loginModalService.openRegister();
  }

  // Navegar de Registro a Login
  onGoToLogin(): void {
    this.loginModalService.closeRegister();
    this.loginModalService.openLogin();
  }

  onLoginSuccess(): void {
    const returnUrl = this.loginModalService.returnUrl();
    this.loginModalService.closeLogin();
    const user = this.authService.currentUser();
    if (user) {
      this.toastService.success(`¡Bienvenido, ${user.username}!`);
    }
    // Si hay una URL de retorno, navegar a ella
    if (returnUrl) {
      this.router.navigate([returnUrl]);
    }
  }

  onRegisterSuccess(): void {
    const returnUrl = this.loginModalService.returnUrl();
    this.loginModalService.closeRegister();
    const user = this.authService.currentUser();
    if (user) {
      this.toastService.success(`¡Cuenta creada exitosamente! Bienvenido, ${user.username}`);
    }
    // Si hay una URL de retorno, navegar a ella
    if (returnUrl) {
      this.router.navigate([returnUrl]);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.toastService.info('Has cerrado sesión');
  }
}
