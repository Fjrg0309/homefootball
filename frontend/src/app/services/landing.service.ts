import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LandingPageData } from '../models/landing.model';
import { AuthService } from './auth.service';

/**
 * Servicio para obtener datos de la Landing Page desde el backend.
 * 
 * Este servicio:
 * - Se comunica con el endpoint /api/landing del backend
 * - Requiere autenticación JWT para acceder a los datos
 * - Proporciona signals para manejo reactivo del estado
 * 
 * @author DWEC - Prueba Práctica
 */
@Injectable({ providedIn: 'root' })
export class LandingService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl + '/landing';

  // Signals para estado reactivo
  loading = signal(false);
  error = signal<string | null>(null);
  landingData = signal<LandingPageData | null>(null);

  /**
   * Obtiene los datos completos de la landing page.
   * Requiere que el usuario esté autenticado (token JWT).
   * 
   * @returns Observable con los datos de la landing page
   */
  getLandingData(): Observable<LandingPageData> {
    this.loading.set(true);
    this.error.set(null);

    const headers = this.getAuthHeaders();

    return this.http.get<LandingPageData>(this.apiUrl, { headers }).pipe(
      tap(data => {
        this.landingData.set(data);
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Error obteniendo datos de landing:', error);
        this.loading.set(false);
        this.error.set(this.getErrorMessage(error));
        return of(this.getDefaultData());
      })
    );
  }

  /**
   * Obtiene el resumen de la landing page (sin lista de usuarios).
   * Requiere autenticación JWT.
   * 
   * @returns Observable con el resumen
   */
  getLandingSummary(): Observable<LandingPageData> {
    this.loading.set(true);
    this.error.set(null);

    const headers = this.getAuthHeaders();

    return this.http.get<LandingPageData>(`${this.apiUrl}/summary`, { headers }).pipe(
      tap(data => {
        this.landingData.set(data);
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Error obteniendo resumen de landing:', error);
        this.loading.set(false);
        this.error.set(this.getErrorMessage(error));
        return of(this.getDefaultData());
      })
    );
  }

  /**
   * Construye las cabeceras HTTP con el token JWT.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Obtiene el mensaje de error según el código de respuesta.
   */
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Debes iniciar sesión para ver esta información';
    }
    if (error.status === 403) {
      return 'No tienes permisos para acceder a esta información';
    }
    return 'Error al cargar los datos. Por favor, intenta de nuevo.';
  }

  /**
   * Retorna datos por defecto cuando hay un error.
   */
  private getDefaultData(): LandingPageData {
    return {
      totalUsuarios: 0,
      usuariosRegistrados: [],
      equipoDestacado: {
        id: 0,
        nombre: 'Equipo no disponible',
        fechaFundacion: 'N/A',
        ligaNombre: 'N/A',
        entrenadorNombre: 'N/A',
        totalJugadores: 0,
        escudoUrl: 'https://via.placeholder.com/150?text=No+disponible'
      },
      mensajeBienvenida: 'Bienvenido a HomeFootball'
    };
  }
}
