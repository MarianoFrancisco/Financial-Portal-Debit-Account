import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminExchangeRateComponent } from './pages/admin-exchange-rate/admin-exchange-rate.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminAccountsComponent } from './pages/admin-accounts/admin-accounts.component';
import { AdminBalanceComponent } from './pages/admin-balance/admin-balance.component';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';

import { ExchangeRateComponent } from './components/exchange-rate/exchange-rate.component';
import { UserComponent } from './components/users/users.component';
import { AccountComponent } from './components/accounts/accounts.component';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminExchangeRateComponent,
    AdminUsersComponent,
    AdminReportsComponent,
    AdminAccountsComponent,
    AdminBalanceComponent,
    ExchangeRateComponent,
    UserComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
