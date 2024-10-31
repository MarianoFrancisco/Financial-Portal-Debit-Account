import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BankService } from '../../services/accounts.service';
import { BankAccount } from '../../interfaces/bank-account.interface';
import { NotificationService } from '../../../shared/services/notification.service';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styles: ``
})
export class AdminAccountsComponent implements OnInit, OnDestroy {

  private banksService = inject(BankService);
  private notifService = inject(NotificationService);
  private bankAccountsSub?: Subscription;

  public accounts: BankAccount[] = [];
  public showForm = false;
  public accountForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.accountForm = this.formBuilder.group({
      username: [0, [Validators.required, Validators.min(1)]],
      account_tier_id: [0, [Validators.required, Validators.min(1)]],
      balance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.bankAccountsSub = this.banksService.getAccounts().pipe(
      switchMap(() => this.banksService.accounts())
    ).subscribe(users => {
      this.accounts = users;
    });
  }

  ngOnDestroy(): void {
    this.bankAccountsSub?.unsubscribe();
  }

  openAddBankAccountModal(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.accountForm.reset();
    }
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const newUser = this.accountForm.value;
      this.showForm = false;
      this.banksService.register(newUser).subscribe({
        next: () => {
          this.notifService.show('Cuenta agregada exitosamente.', 'success');
          location.reload();
        },
        error: () => this.notifService.show('Algo salio mal.', 'error')
      });
    } else {
      Object.values(this.accountForm.controls).forEach(control => {
        if (!control.touched) {
          control.markAsTouched();
        }
      });
      this.notifService.show('Invalid or empty fields.', 'warning');
    }
  }
}
