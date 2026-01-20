import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginModalService } from '../services/login-modal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const loginModalService = inject(LoginModalService);

  // Verificar si está autenticado
  if (auth.isLoggedIn()) {
    return true;
  }

  // Abrir modal de login con returnUrl
  loginModalService.openLogin(state.url);
  return false;
};

// Guard específico para admin
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const loginModalService = inject(LoginModalService);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }

  // Si está logueado pero no es admin, redirige a home
  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }

  // Si no está logueado, abrir modal de login
  loginModalService.openLogin(state.url);
  return false;
};
