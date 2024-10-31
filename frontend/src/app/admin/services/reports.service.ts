import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';
import { Transaction } from '../interfaces/transaction.interface';
import { FrozenAccount } from '../interfaces/frozen-account.interface';
import { Account } from '../interfaces/account.interface';
import { Summary } from '../interfaces/summary.interface';
import { Closure } from '../interfaces/closure';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private readonly reportsURL: string = `${environment.API_URL}/report`;

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  private _transactions: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);
  private _frozenAccounts: BehaviorSubject<FrozenAccount[]> = new BehaviorSubject<FrozenAccount[]>([]);
  private _account: BehaviorSubject<Account> = new BehaviorSubject<Account>({
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
  });
  private _summary: BehaviorSubject<Summary[]> = new BehaviorSubject<Summary[]>([]);
  private _closures: BehaviorSubject<Closure[]> = new BehaviorSubject<Closure[]>([]);

  constructor() { }

  public getAllAccountTransactions(timestamp: number): Observable<boolean> {
    const url: string = `${this.reportsURL}/transactions`;
    const params: HttpParams = new HttpParams().set('date', timestamp);
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<Transaction[]>(url, { headers, params }).pipe(
      map(transactions => {
        this._transactions.next(transactions);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getFrozenAccounts(timestamp: number): Observable<boolean> {
    const url: string = `${this.reportsURL}/frozen-accounts`;
    const params: HttpParams = new HttpParams().set('date', timestamp);
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<FrozenAccount[]>(url, { headers, params }).pipe(
      map(frozenAccounts => {
        this._frozenAccounts.next(frozenAccounts);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getAccountDetail(account_number: number): Observable<boolean> {
    const url: string = `${this.reportsURL}/account-detail/${account_number}`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<Account>(url, { headers }).pipe(
      map(account => {
        this._account.next(account);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getAccountStatusSummary(): Observable<boolean> {
    const url: string = `${this.reportsURL}/account-status-summary`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<Summary[]>(url, { headers }).pipe(
      map(summary => {
        this._summary.next(summary);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public getAccountClosures(timestamp: number): Observable<boolean> {
    const url: string = `${this.reportsURL}/account-closures`;
    const params: HttpParams = new HttpParams().set('date', timestamp);
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<Closure[]>(url, { headers, params }).pipe(
      map(closures => {
        this._closures.next(closures);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public transactions(): Observable<Transaction[]> {
    return this._transactions.asObservable();
  }

  public frozenAccounts(): Observable<FrozenAccount[]> {
    return this._frozenAccounts.asObservable();
  }

  public account(): Observable<Account> {
    return this._account.asObservable();
  }

  public summary(): Observable<Summary[]> {
    return this._summary.asObservable();
  }

  public closures(): Observable<Closure[]> {
    return this._closures.asObservable();
  }
}
