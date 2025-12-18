import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

/**
 * Interceptor funcional para añadir headers de autenticación
 * 
 * Añade:
 * - Authorization: Bearer <token>
 * - Content-Type: application/json
 * - X-App-Client: Angular-HomeFootball
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Obtener token del AuthService
  const token = authService.getToken();
  
  // Clonar headers y añadir los necesarios
  let headers = req.headers
    .set('Content-Type', 'application/json')
    .set('X-App-Client', 'Angular-HomeFootball')
    .set('X-Request-ID', crypto.randomUUID());
  
  // Si hay token, añadir Authorization
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Clonar request con nuevos headers
  const clonedRequest = req.clone({ headers });
  
  // Pasar al siguiente interceptor
  return next(clonedRequest);
};
