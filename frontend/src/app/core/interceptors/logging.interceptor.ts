import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

/**
 * Interceptor funcional para logging de peticiones HTTP
 * 
 * Registra:
 * - Petición: método, URL, body
 * - Respuesta: status, duración
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  
  console.log(`🚀 HTTP ${req.method} ${req.url}`);
  
  if (req.body) {
    console.log('📦 Body:', req.body);
  }
  
  return next(req).pipe(
    tap({
      next: (event: any) => {
        // Solo loguear respuestas completas (no progress events)
        if (event.type === 4) { // HttpEventType.Response
          const duration = Date.now() - startTime;
          console.log(
            `✅ HTTP ${req.method} ${req.url} - ${event.status} (${duration}ms)`
          );
        }
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.error(
          `❌ HTTP ${req.method} ${req.url} - ${error.status} (${duration}ms)`,
          error
        );
      }
    })
  );
};
