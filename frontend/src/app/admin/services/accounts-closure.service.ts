import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountClosureService {

  private readonly accountClosureURL: string = `${environment.API_URL}/account-closure`;

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() { }

  public close(id: number, body: any): Observable<boolean> {
    const url: string = `${this.accountClosureURL}/${id}/close`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.put<{ message: string }>(url, body, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public active(id: number): Observable<boolean> {
    const url: string = `${this.accountClosureURL}/${id}/activate`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.put<{ message: string }>(url, {}, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

}
