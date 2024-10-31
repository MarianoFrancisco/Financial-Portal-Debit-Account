import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { UserDataFormComponent } from '../../components/user-data-form/user-data-form.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { emailPattern } from '../../../shared/validators/patterns';
import { UpdatePwrdFormComponent } from '../../components/update-pwrd-form/update-pwrd-form.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrl: './update-info.component.css'
})
export class UpdateInfoComponent implements OnInit, OnDestroy {

  @ViewChild('updateUser') public updateUser: UserDataFormComponent =  new UserDataFormComponent();
  @ViewChild('updatePwd') public updatePwd: UpdatePwrdFormComponent = new UpdatePwrdFormComponent();

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private notifService = inject(NotificationService);

  private userSub?: Subscription;

  public user?: User;
  public email: FormControl = this.formBuilder.control('', [Validators.required, Validators.minLength(5)]);
  
  constructor() {
    
  }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.email.patchValue(this.user.email)
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  public onUpdateUser(): void {
    if (this.updateUser.userDataForm.valid && this.email.valid) {
      const newData: User = this.updateUser.userDataForm.value;
      newData['email'] = this.email.value;
      this.authService.updateUser(newData).subscribe({
        next: () => this.notifService.show('Informacion actualizada.', 'success'),
        error: () => this.notifService.show('Algo salio mal.', 'error')
      });
    } else {
      Object.values(this.updateUser.userDataForm.controls).forEach(control => {
        if (!control.touched) {
          control.markAsTouched();
        }
      });
      if (!this.email.touched) {
        this.email.markAsTouched();
      }
      this.notifService.show('Campos invalidos o vacios.', 'warning');
    }
  }

  public onUpdatePwd(): void {
    if (this.updatePwd.passwordForm.valid) {
      const valueForm = this.updatePwd.passwordForm.value;
      this.authService.updatePwd(valueForm.current_pin, valueForm.pin).subscribe({
        next: () => this.notifService.show('Contraseña actualizada.', 'success'),
        error: () => this.notifService.show('Algo salio mal.', 'error')
      });
    } else {
      Object.values(this.updatePwd.passwordForm.controls).forEach(control => {
        if (!control.touched) {
          control.markAsTouched();
        }
      });
      this.notifService.show('Campos invalidos o vacios.', 'warning');
    }
  }

}
