import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take, tap } from 'rxjs';
import { AuthStatus } from '../interfaces/user.interface';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isLoggedIn().pipe(
    filter((status) => status !== AuthStatus.Checking),
    take(1),
    map((status) => {
      if (status === AuthStatus.NotAuthenticated) {
        return true;
      }
      router.navigateByUrl('/user');
      return false;
    })
  );
};
