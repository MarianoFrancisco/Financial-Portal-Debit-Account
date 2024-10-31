import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateInfoComponent } from '../auth/pages/update-info/update-info.component';
import { UserAccountsComponent } from './pages/user-accounts/user-accounts.component';
import { UserMovementsComponent } from '../user/pages/user-movements/user-movements.component';
import { UserExchangeRateComponent } from './pages/user-exchange-rate/user-exchange-rate.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: 'movements/:accountId/:timestamp',
        title: 'Movimientos',
        component: UserMovementsComponent
      },
      {
        path: 'exchange-rate',
        title: 'Cambios de divisa',
        component: UserExchangeRateComponent
      },
      {
        path: 'my-accounts',
        title: 'Mis cuentas',
        component: UserAccountsComponent
      },
      {
        path: 'my-profile',
        title: 'Perfil',
        component: UpdateInfoComponent
      },
      {
        path: '**',
        redirectTo: 'my-accounts',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
