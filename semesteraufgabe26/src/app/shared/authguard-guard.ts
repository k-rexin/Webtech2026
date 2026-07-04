import { inject } from '@angular/core';
import { Auth } from './auth';
import { CanActivateFn, Router } from '@angular/router';

export const authguardGuard: CanActivateFn = (route, state) => {
  return inject(Auth).isAuthenticated() // aus dem script
    ? true
    : inject(Router).navigate(['/login']); // wenn auth true dann true wenn false dann zu login
};
