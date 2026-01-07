import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor para manejar errores de la API de Football
 * Proporciona mensajes de error más claros y específicos
 */
export const footballApiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Error desconocido';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error del cliente: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        if (error.status === 0) {
          errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080';
        } else if (error.status === 404) {
          errorMessage = 'Endpoint no encontrado. Verifica la URL de la API.';
        } else if (error.status === 500) {
          errorMessage = error.error?.message || 'Error interno del servidor. Puede que no haya datos disponibles para esta temporada/liga.';
        } else if (error.status === 401 || error.status === 403) {
          errorMessage = 'Error de autenticación con la API de Football. Verifica la API key.';
        } else {
          errorMessage = error.error?.message || `Error del servidor: ${error.status} ${error.statusText}`;
        }
      }

      console.error('Error interceptado:', {
        status: error.status,
        message: errorMessage,
        url: error.url,
        error: error.error
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
