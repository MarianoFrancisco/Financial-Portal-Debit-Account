import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PinReminderPageComponent } from './pages/pin-reminder-page/pin-reminder-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sign-in',
        title: 'Iniciar Sesión',
        component: LoginPageComponent
      },
      {
        path: 'pin-reminder',
        title: 'Recordar PIN',
        component: PinReminderPageComponent
      },
      {
        path: '**',
        redirectTo: 'sign-in',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
