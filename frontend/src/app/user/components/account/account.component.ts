import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccount } from '../../interfaces/bank-account.interface';

@Component({
  selector: 'user-account',
  templateUrl: './account.component.html',
  styles: ``
})
export class AccountComponent {

  @Input({ required: true }) public account_number!: number;
  @Input({ required: true }) public account!: BankAccount;
  private router = inject(Router);
  public selectedDate: string = '';

  viewMovements(accountId: number): void {
    if (this.selectedDate) {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + 1);
      date.setHours(23, 59, 59, 59);
      const timestamp = Math.floor(date.getTime() / 1000);
      this.router.navigate(['/user/movements', accountId, timestamp]);
    }
  }

}
