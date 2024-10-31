import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly authenticatorURL: string = `${environment.API_URL}/authenticator`;
  private readonly userURL: string = `${environment.API_URL}/user`;

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor() { }

  public getUsers(): Observable<boolean> {
    const url: string = `${this.userURL}`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.get<User[]>(url, { headers }).pipe(
      map(users => {
        this._users.next(users);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public updateStatus(body: any): Observable<boolean> {
    const url: string = `${this.userURL}/status`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.patch<{ message: string }>(url, body, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public register(body: any): Observable<boolean> {
    const url: string = `${this.authenticatorURL}/register`;
    const headers: HttpHeaders = this.authService.setHeaders();
    return this.httpClient.post<{ message: string }>(url, body, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public users(): Observable<User[]> {
    return this._users.asObservable();
  }

}
