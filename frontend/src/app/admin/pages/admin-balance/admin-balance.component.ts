import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BankService } from '../../services/accounts.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-balance',
  templateUrl: './admin-balance.component.html',
  styles: []
})
export class AdminBalanceComponent implements OnInit, OnDestroy {

  private banksService = inject(BankService);
  private notifService = inject(NotificationService);

  public accountForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.accountForm = this.formBuilder.group({
      account_number: [null, [Validators.required, Validators.min(1)]],
      amount: [null, [Validators.required]],
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  adjustBalance(): void {
    if (this.accountForm.valid) {
      const { account_number, amount } = this.accountForm.value;
      const operation = amount > 0 ? 'increase' : 'decrease';
      const body = {
        account_number,
        amount
      };
      this.banksService.updateBalance(body).subscribe({
        next: () => {
          const action = operation === 'increase' ? 'aumentado' : 'reducido';
          this.notifService.show(`El balance ha sido ${action} exitosamente.`, 'success');
          this.accountForm.reset();
        },
        error: () => this.notifService.show('Algo salió mal.', 'error')
      });
    } else {
      Object.values(this.accountForm.controls).forEach(control => {
        if (!control.touched) {
          control.markAsTouched();
        }
      });
      this.notifService.show('Campos inválidos o vacíos.', 'warning');
    }
  }
}
