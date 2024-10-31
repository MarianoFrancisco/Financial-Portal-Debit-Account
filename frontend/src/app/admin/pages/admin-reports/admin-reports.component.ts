import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { Transaction } from '../../interfaces/transaction.interface';
import { FrozenAccount } from '../../interfaces/frozen-account.interface';
import { Account } from '../../interfaces/account.interface';
import { Summary } from '../../interfaces/summary.interface';
import { Closure } from '../../interfaces/closure';
import { NotificationService } from '../../../shared/services/notification.service';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styles: []
})
export class AdminReportsComponent implements OnInit, OnDestroy {

  private reportsService = inject(ReportsService);
  private notifService = inject(NotificationService);
  private transactionSub?: Subscription;
  private frozenAccountsSub?: Subscription;
  private accountSub?: Subscription;
  private summarySub?: Subscription;
  private closuresSub?: Subscription;

  public transactions: Transaction[] = [];
  public frozenAccounts: FrozenAccount[] = [];
  public account: Account = {
    id: 0,
    account_name: "",
    account_number: 0,
    user_id: 0,
    account_tier_id: 0,
    currency_id: 0,
    balance: "0.00",
    creation_date: 0,
    close: 0,
    username: "",
    tier_name: ""
  };
  public summary: Summary[] = [];
  public closure: Closure[] = [];
  public accountForm: FormGroup;
  public selectedDate: string = '';
  public dateInput: number | null = null;

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      accountNumber: [null, Validators.required],
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.transactionSub?.unsubscribe();
    this.frozenAccountsSub?.unsubscribe();
    this.accountSub?.unsubscribe();
    this.summarySub?.unsubscribe();
    this.closuresSub?.unsubscribe();
  }

  private loadTransactions(timestamp: number): void {
    this.transactionSub = this.reportsService.getAllAccountTransactions(timestamp).pipe(
      switchMap(() => this.reportsService.transactions())
    ).subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  private loadFrozenAccounts(timestamp: number): void {
    this.frozenAccountsSub = this.reportsService.getFrozenAccounts(timestamp).pipe(
      switchMap(() => this.reportsService.frozenAccounts())
    ).subscribe(frozenAccounts => {
      this.frozenAccounts = frozenAccounts;
    });
  }

  private loadAccountDetails(accountNumber: number): void {
    this.accountSub = this.reportsService.getAccountDetail(accountNumber).pipe(
      switchMap(() => this.reportsService.account())
    ).subscribe(account => {
      this.account = account;
      this.notifService.show('Detalles de la cuenta cargados exitosamente.', 'success');
    }, () => {
      this.notifService.show('Error al cargar los detalles de la cuenta.', 'error');
    });
  }

  private loadAccountSummary(): void {
    this.summarySub = this.reportsService.getAccountStatusSummary().pipe(
      switchMap(() => this.reportsService.summary())
    ).subscribe(summary => {
      this.summary = summary;
      this.notifService.show('Resumen de cuentas cargado exitosamente.', 'success');
    }, () => {
      this.notifService.show('Error al cargar el resumen de cuentas.', 'error');
    });
  }

  private loadAccountClosures(timestamp: number): void {
    this.closuresSub = this.reportsService.getAccountClosures(timestamp).pipe(
      switchMap(() => this.reportsService.closures())
    ).subscribe(closures => {
      this.closure = closures;
      this.notifService.show('Cierres de cuentas cargados exitosamente.', 'success');
    }, () => {
      this.notifService.show('Error al cargar los cierres de cuentas.', 'error');
    });
  }

  public onLoadTransactions(): void {
    if (this.dateInput) {
      this.loadTransactions(this.dateInput);
      this.clearOtherData();
    }
  }

  public onLoadFrozenAccounts(): void {
    if (this.dateInput) {
      this.loadFrozenAccounts(this.dateInput);
      this.clearOtherData();
    }
  }

  public onLoadAccountDetails(): void {
    const accountNumber = this.accountForm.get('accountNumber')?.value;
    if (accountNumber) {
      this.loadAccountDetails(accountNumber);
      this.clearOtherData();
    }
  }

  public onLoadSummary(): void {
    this.loadAccountSummary();
    this.clearOtherData();
  }

  public onLoadClosures(): void {
    if (this.dateInput) {
      this.loadAccountClosures(this.dateInput);
      this.clearOtherData();
    }
  }

  private clearOtherData(): void {
    this.transactions = [];
    this.frozenAccounts = [];
    this.account = {
      id: 0,
      account_name: "",
      account_number: 0,
      user_id: 0,
      account_tier_id: 0,
      currency_id: 0,
      balance: "0.00",
      creation_date: 0,
      close: 0,
      username: "",
      tier_name: ""
    };
    this.summary = [];
    this.closure = [];
  }

  public onDateChange(): void {
    let timestamp: number = 0;
    if (this.selectedDate) {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + 1);
      date.setHours(23, 59, 59, 59);
      timestamp = Math.floor(date.getTime() / 1000);
    }
    this.dateInput = timestamp;
    console.log(this.dateInput)
  }
}
