import { inject } from '@angular/core';
import { Auth } from './auth';
import { CanActivateFn, Router } from '@angular/router';

export const authguardGuard: CanActivateFn = () => { // wird aufgerufen in routes wenn URL /profil ist (damit profil nicht zu sehen ist falls in URL eingetippt)
  return inject(Auth).isAuthenticated() //ruft auth-service auf 
    ? true // ist true wenn .isAuthenticated() in auth-service ein token hat
    : inject(Router).navigate(['/']); // false wenn nciht dann zu login
};
