import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withPreloading, PreloadAllModules, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules), // Precarga todos los módulos lazy en segundo plano
      /**
       * TAREA 1: withInMemoryScrolling - Restauración de posición de scroll
       * 
       * ¿Qué hace scrollPositionRestoration: 'enabled'?
       * - Restaura la posición del scroll al navegar hacia atrás/adelante
       * - Al hacer back/forward en el navegador, vuelve a la posición exacta
       * - Útil cuando el usuario explora una lista larga y vuelve atrás
       * 
       * Otras opciones:
       * - 'disabled': No restaura el scroll (comportamiento por defecto)
       * - 'top': Siempre hace scroll al top al navegar
       * 
       * anchorScrolling: 'enabled' permite navegar a anclas (#seccion)
       */
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loggingInterceptor,
        errorInterceptor
      ])
    )
  ]
};
