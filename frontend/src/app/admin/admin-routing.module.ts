import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateInfoComponent } from '../auth/pages/update-info/update-info.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminExchangeRateComponent } from './pages/admin-exchange-rate/admin-exchange-rate.component';
import { AdminAccountsComponent } from './pages/admin-accounts/admin-accounts.component';
import { AdminBalanceComponent } from './pages/admin-balance/admin-balance.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'reports',
        title: 'Reportes',
        component: AdminReportsComponent
      },
      {
        path: 'balance',
        title: 'Saldo',
        component: AdminBalanceComponent
      },
      {
        path: 'exchange-rate',
        title: 'Cambios de divisa',
        component: AdminExchangeRateComponent
      },
      {
        path: 'accounts',
        title: 'Cuentas',
        component: AdminAccountsComponent
      },
      {
        path: 'users',
        title: 'Usuarios',
        component: AdminUsersComponent
      },
      {
        path: 'my-profile',
        title: 'Perfil',
        component: UpdateInfoComponent
      },
      {
        path: '**',
        redirectTo: 'exchange-rate',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
