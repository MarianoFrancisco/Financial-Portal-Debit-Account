import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BankAccount } from '../interfaces/bank-account.interface';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly bankAccountURL: string = `${environment.API_URL}/bank-account`;

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  private _myAccounts: BehaviorSubject<BankAccount[]> = new BehaviorSubject<BankAccount[]>([]);

  constructor() { }

  public getMyAccounts(): Observable<boolean> {
    const url: string = `${this.bankAccountURL}/user`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<BankAccount[]>(url, { headers }).pipe(
      map(bank_accounts => {
        this._myAccounts.next(bank_accounts);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public myAccounts(): Observable<BankAccount[]> {
    return this._myAccounts.asObservable();
  }

}
