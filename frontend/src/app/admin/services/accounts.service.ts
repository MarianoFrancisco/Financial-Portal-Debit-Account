import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BankAccount } from '../interfaces/bank-account.interface';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private readonly bankAccountURL: string = `${environment.API_URL}/bank-account`;

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  private _accounts: BehaviorSubject<BankAccount[]> = new BehaviorSubject<BankAccount[]>([]);

  constructor() { }

  public getAccounts(): Observable<boolean> {
    const url: string = `${this.bankAccountURL}`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<BankAccount[]>(url, { headers }).pipe(
      map(bank_accounts => {
        this._accounts.next(bank_accounts);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public register(body: any): Observable<boolean> {
    const url: string = `${this.bankAccountURL}`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.post<{ message: string }>(url, body, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public changeType(body: any): Observable<boolean> {
    const url: string = `${this.bankAccountURL}/change-type`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.put<{ message: string }>(url, body, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public updateBalance(body: any): Observable<boolean> {
    const url: string = `${this.bankAccountURL}/update-balance`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.put<{ message: string }>(url, body, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public accounts(): Observable<BankAccount[]> {
    return this._accounts.asObservable();
  }

}
