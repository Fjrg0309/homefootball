import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (auth.isLoggedIn()) {
    return true;
  }

  // Redirigir a login con returnUrl
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// Guard específico para admin
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }

  // Si está logueado pero no es admin, redirige a home
  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }

  // Si no está logueado, redirige a login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
