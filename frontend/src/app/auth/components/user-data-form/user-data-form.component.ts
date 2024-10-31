import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { namePattern, phonePattern } from '../../../shared/validators/patterns';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'auth-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrl: './user-data-form.component.css'
})
export class UserDataFormComponent implements OnInit {

  @Input() public user?: User;

  private formBuilder = inject(FormBuilder);

  public userDataForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(namePattern)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern(namePattern)]],
    notifyme: [0],
    phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern(phonePattern)]],
  });

  ngOnInit(): void {
    if (this.user) {
      if (this.user) {
        this.userDataForm.patchValue({
          name: this.user.name,
          lastname: this.user.lastname,
          phone: this.user.phone,
          notifyme: this.user.notifyme
        });
      }
    }
  }

  onNotifyMeChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.userDataForm.get('notifyme')?.setValue(isChecked ? 1 : 0);
  }

}
