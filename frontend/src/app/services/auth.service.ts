import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Estado de autenticación con signals
  isLoggedIn = signal(false);
  currentUser = signal<User | null>(null);

  // Simular login
  login(email: string, password: string): boolean {
    // Simulación simple: cualquier email/password funciona
    if (email && password) {
      const mockUser: User = {
        id: 1,
        name: 'Usuario Demo',
        email: email,
        role: email.includes('admin') ? 'admin' : 'user'
      };

      this.isLoggedIn.set(true);
      this.currentUser.set(mockUser);
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      return true;
    }
    return false;
  }

  // Logout
  logout(): void {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    localStorage.removeItem('auth_user');
  }

  // Verificar si tiene rol admin
  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  // Restaurar sesión desde localStorage
  checkSession(): void {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.isLoggedIn.set(true);
      this.currentUser.set(user);
    }
  }

  // Obtener token para interceptores (por ahora mock, luego será real)
  getToken(): string | null {
    // Mock token - en producción vendría del login real
    if (typeof window !== 'undefined' && this.isLoggedIn()) {
      return 'mock-jwt-token-' + Date.now();
    }
    return null;
  }
}
