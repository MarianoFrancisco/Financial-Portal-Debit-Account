import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserAccountsComponent } from './pages/user-accounts/user-accounts.component';
import { UserExchangeRateComponent } from './pages/user-exchange-rate/user-exchange-rate.component';
import { UserMovementsComponent } from '../user/pages/user-movements/user-movements.component';
import { AccountComponent } from './components/account/account.component';
import { ExchangeRateComponent } from './components/exchange-rate/exchange-rate.component';
import { UserRoutingModule } from './user-routing.module';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    UserLayoutComponent,
    UserAccountsComponent,
    AccountComponent,
    UserExchangeRateComponent,
    ExchangeRateComponent,
    UserMovementsComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxChartsModule
  ]
})
export class UserModule { }
