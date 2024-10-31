import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private notifService = inject(NotificationService);

  public loginForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    pin: ['', [Validators.required]]
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      const { username, pin } = this.loginForm.value;
      this.authService.login(username, pin).pipe(
        switchMap(() => this.authService.currentUser())
      ).subscribe({
        next: (user) => {
          if (user) {
            this.notifService.show('Welcome to Kizuna Maya.', 'success');
            if (user.role_id === 1) {
              this.router.navigateByUrl('/admin');
            } else {
              this.router.navigateByUrl('/user/catalogue');
            }
          }
        },
        error: () => this.notifService.show('User not found.')
      });
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (!control.touched) {
          control.markAsTouched();
        }
      });
      this.notifService.show('Invalid or empty fields.', 'warning');
    }
  }

}
