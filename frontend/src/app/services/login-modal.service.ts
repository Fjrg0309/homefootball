import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginModalService {
  // Estado del modal de login
  showLoginModal = signal(false);
  showRegisterModal = signal(false);
  
  // URL de retorno después del login
  returnUrl = signal<string | null>(null);

  openLogin(returnUrl?: string): void {
    if (returnUrl) {
      this.returnUrl.set(returnUrl);
    }
    this.showRegisterModal.set(false);
    this.showLoginModal.set(true);
  }

  closeLogin(): void {
    this.showLoginModal.set(false);
  }

  openRegister(): void {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(true);
  }

  closeRegister(): void {
    this.showRegisterModal.set(false);
  }

  closeAll(): void {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(false);
    this.returnUrl.set(null);
  }

  getReturnUrlAndClear(): string | null {
    const url = this.returnUrl();
    this.returnUrl.set(null);
    return url;
  }
}
