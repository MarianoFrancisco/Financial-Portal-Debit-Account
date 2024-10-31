import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { ExchangeRate } from '../interfaces/exchange-rate.interface';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private readonly exchangeRateURL: string = `${environment.API_URL}/exchange-rate`;

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  private _exchangeRates: BehaviorSubject<ExchangeRate[]> = new BehaviorSubject<ExchangeRate[]>([]);

  constructor() { }

  public getExchangeRates(): Observable<boolean> {
    const url: string = `${this.exchangeRateURL}`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<ExchangeRate[]>(url, { headers }).pipe(
      map(exchange_rates => {
        this._exchangeRates.next(exchange_rates);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public updateExchangeRate(body: any): Observable<boolean> {
    const url: string = this.exchangeRateURL;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.put<{ message: string }>(url, body, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public exchangeRates(): Observable<ExchangeRate[]> {
    return this._exchangeRates.asObservable();
  }

}
