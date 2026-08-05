import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.obtenerToken();

  // Validar que el token exista y no sea una cadena literal de error/undefined
  if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
    return true;
  }

  // Si no hay token válido, redirigir al login
  router.navigate(['/login']);
  return false;
};