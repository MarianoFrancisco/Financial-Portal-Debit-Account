import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordPattern } from '../../../shared/validators/patterns';
import { isFieldOneEqualsFieldTwo } from '../../../shared/validators/validators';

@Component({
  selector: 'auth-update-pwrd-form',
  templateUrl: './update-pwrd-form.component.html',
  styles: ``
})
export class UpdatePwrdFormComponent {

  private formBuilder = inject(FormBuilder);

  public passwordForm: FormGroup = this.formBuilder.group({
    current_pin: ['', [Validators.required, Validators.minLength(4)]],
    pin: ['', [Validators.required, Validators.minLength(4), Validators.pattern(passwordPattern)]],
    confirmation_pin: ['', [Validators.required, Validators.minLength(4), Validators.pattern(passwordPattern)]],
  }, {
    validators: [
      isFieldOneEqualsFieldTwo('pin', 'confirmation_pin')
    ]
  });

  constructor() {}
  
}
