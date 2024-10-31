import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { filter, map, take } from 'rxjs';
import { AuthStatus } from '../interfaces/user.interface';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isLoggedIn().pipe(
    filter((status) => status !== AuthStatus.Checking),
    take(1),
    map((status) => {
      if (status === AuthStatus.Authenticated) {
        return true;
      }
      router.navigateByUrl('/auth')
      return false;
    })
  );
};
