import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { BankAccount } from '../../interfaces/bank-account.interface';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styles: ``
})
export class UserAccountsComponent implements OnInit, OnDestroy {

  private accountService = inject(AccountService);
  private bankAccountSub?: Subscription;

  public myAccounts: BankAccount[] = [];
  errorOccurred: boolean = false;

  ngOnInit(): void {
    this.bankAccountSub = this.accountService.getMyAccounts().pipe(
      switchMap(() => this.accountService.myAccounts())
    ).subscribe({
      next: (bank_accounts) => {
        this.myAccounts = bank_accounts;
        this.errorOccurred = false;
      },
      error: () => {
        this.myAccounts = [];
        this.errorOccurred = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.bankAccountSub?.unsubscribe();
  }

}
