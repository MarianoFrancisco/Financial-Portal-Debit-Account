import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pin-reminder-page',
  templateUrl: './pin-reminder-page.component.html',
})
export class PinReminderPageComponent {


  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private notifService = inject(NotificationService);

  public currentStep: number = 1;

  public pinReminderForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]]
  });

  onPinReminder(): void {
    if (this.pinReminderForm.valid) {
      const { email } = this.pinReminderForm.value;
      this.authService.pinReminder(email).subscribe({
        next: () => {
          this.notifService.show('Tu PIN ha sido enviado a tu correo.', 'success');
        },
        error: () => {
          this.notifService.show('Algo salio mal.');
        }
      });
    } else {
      Object.values(this.pinReminderForm.controls).forEach(control => {
        if (!control.touched) {
          control.markAsTouched();
        }
      });
      this.notifService.show('Campos invalidos o vacios.', 'warning');
    }
  }

}
