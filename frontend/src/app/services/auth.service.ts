import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number | null;
  username: string | null;
  email: string | null;
  token: string | null;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/auth';

  // Estado de autenticación con signals
  isLoggedIn = signal(false);
  currentUser = signal<User | null>(null);

  // Registro de usuario
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        if (response.id) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(error => {
        console.error('Error en registro:', error);
        return of({
          id: null,
          username: null,
          email: null,
          token: null,
          message: error.error?.message || 'Error al registrar usuario'
        });
      })
    );
  }

  // Login con backend
  login(username: string, password: string): Observable<AuthResponse> {
    const request: LoginRequest = { username, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.id) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return of({
          id: null,
          username: null,
          email: null,
          token: null,
          message: error.error?.message || 'Error al iniciar sesión'
        });
      })
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const user: User = {
      id: response.id!,
      username: response.username!,
      email: response.email!,
      role: response.email?.includes('admin') ? 'admin' : 'user'
    };

    this.isLoggedIn.set(true);
    this.currentUser.set(user);

    // Guardar en localStorage para persistencia
    localStorage.setItem('auth_user', JSON.stringify(user));
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
  }

  // Logout
  logout(): void {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }

  // Verificar si tiene rol admin
  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  // Restaurar sesión desde localStorage
  checkSession(): void {
    if (typeof window === 'undefined') return;
    
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.isLoggedIn.set(true);
        this.currentUser.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  // Obtener token para interceptores
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Obtener ID del usuario actual
  getUserId(): number | null {
    return this.currentUser()?.id || null;
  }
}

