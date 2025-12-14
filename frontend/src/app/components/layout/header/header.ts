import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDropdown } from '../../shared/user-dropdown/user-dropdown';
import { Modal } from '../../shared/modal/modal';
import { LoginForm } from '../../shared/login-form/login-form';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserDropdown, Modal, LoginForm],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None
})
export class Header {
  isLoggedIn = false;
  showLoginModal = false;
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
    this.closeMobileMenu();
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  onLoginSuccess(credentials: {username: string, password: string}): void {
    this.isLoggedIn = true;
    this.closeLoginModal();
  }

  onLogout(): void {
    this.isLoggedIn = false;
    // Simular recarga de página
    window.location.reload();
  }
}
