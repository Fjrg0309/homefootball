import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { LoginModalService } from '../../services/login-modal.service';

/**
 * Interceptor funcional para manejo centralizado de errores HTTP
 * 
 * Maneja:
 * - 401: Abre modal de login
 * - 403: Muestra toast de acceso denegado
 * - 404: Muestra toast de recurso no encontrado
 * - 500+: Muestra toast de error del servidor
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const loginModalService = inject(LoginModalService);
  const toastService = inject(ToastService);
  
  return next(req).pipe(
    catchError((error) => {
      // Mensajes de error por código HTTP
      switch (error.status) {
        case 401:
          toastService.error('Sesión expirada. Por favor, inicia sesión.');
          loginModalService.openLogin();
          break;
          
        case 403:
          toastService.error('No tienes permisos para realizar esta acción.');
          break;
          
        case 404:
          toastService.error('El recurso solicitado no existe.');
          break;
          
        case 500:
        case 502:
        case 503:
          toastService.error('Error del servidor. Intenta más tarde.');
          break;
          
        case 0:
          // Error de conexión - puede ser CORS, timeout, o servidor caído
          console.error('Error de conexión - detalles:', error);
          console.error('URL intentada:', error.url);
          
          // Solo mostrar el mensaje de "sin conexión" si realmente no hay conexión
          // No mostrarlo para errores de timeout de la API externa
          if (error.status === 0) {
            toastService.error('Sin conexión con el servidor. Verifica tu conexión a internet.');
          } else {
            console.warn('Timeout o error en petición a:', error.url);
            // No mostrar toast, dejar que el componente maneje el error
          }
          break;
          
        default:
          if (error.status >= 400 && error.status < 500) {
            toastService.error(error.error?.message || 'Error en la petición.');
          }
      }
      
      // Re-lanzar error para que el componente pueda manejarlo también
      return throwError(() => error);
    })
  );
};
