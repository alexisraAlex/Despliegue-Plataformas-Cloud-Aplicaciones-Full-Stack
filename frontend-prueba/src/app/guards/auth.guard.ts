import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token && token !== 'undefined') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};