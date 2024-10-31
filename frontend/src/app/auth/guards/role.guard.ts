import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.currentUser().pipe(
    filter(user => user !== null),
    take(1),
    map(user => {
      if (user!.role_id === route.data['role_id']) return true;
      if (user!.role_id === 1) {
        router.navigateByUrl('/admin');
      } else {
        router.navigateByUrl('/user');
      }
      return false;
    })
  );
};
