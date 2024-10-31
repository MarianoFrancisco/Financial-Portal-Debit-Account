import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UpdatePwrdFormComponent } from './components/update-pwrd-form/update-pwrd-form.component';
import { UpdateInfoComponent } from './pages/update-info/update-info.component';
import { UserDataFormComponent } from './components/user-data-form/user-data-form.component';
import { PinReminderPageComponent } from './pages/pin-reminder-page/pin-reminder-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginPageComponent,
    PinReminderPageComponent,
    UserDataFormComponent,
    AuthLayoutComponent,
    UpdatePwrdFormComponent,
    UpdateInfoComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
