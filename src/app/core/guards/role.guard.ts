import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard che verifica se l'utente corrente possiede almeno uno dei ruoli richiesti.
 * Utilizzo nelle rotte:
 *   canActivate: [roleGuard('ROLE_ADMIN')]
 *   canActivate: [roleGuard('ROLE_MANAGER', 'ROLE_ADMIN')]
 */
export function roleGuard(...allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const hasAccess = allowedRoles.some(role => auth.hasRole(role));

    if (hasAccess) {
      return true;
    }

    return router.createUrlTree(['/access-denied']);
  };
}
