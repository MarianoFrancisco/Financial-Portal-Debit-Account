import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { noAuthGuard } from './auth/guards/no-auth.guard';

//User

import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';

const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [noAuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [ authGuard, roleGuard ],
    data: { role_id: 1 }
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    data: { role_id: 2 },
    canActivate: [ authGuard, roleGuard ],
  }, {
    path: '**',
    redirectTo: '/user'
  }
];
  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
