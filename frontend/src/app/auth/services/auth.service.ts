import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError, timer } from 'rxjs';
import { AuthStatus, Tokens, User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly emailSenderURL: string = `${environment.API_URL}/email-sender`;
  private readonly authenticatorURL: string = `${environment.API_URL}/authenticator`;
  private readonly userURL: string = `${environment.API_URL}/user`;

  private httpClient = inject(HttpClient);
  private cookieService = inject(CookieService);

  private _currentUser: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
  private _isLoggedIn: BehaviorSubject<AuthStatus> = new BehaviorSubject<AuthStatus>(AuthStatus.Checking);

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private getToken(): string {
    return this.cookieService.get('token');
  }

  public setHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
  }

  private setAuth(user: User): void {
    this._currentUser.next(user);
    this._isLoggedIn.next(AuthStatus.Authenticated);
  }

  private processAuthRequest(request: Observable<Tokens>): Observable<boolean> {
    return request.pipe(
      switchMap(({ token, refreshToken }) => {
        this.cookieService.set('token', token);
        if (refreshToken) this.cookieService.set('refreshToken', refreshToken);
        return this.getUser();
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  private getUser(): Observable<boolean> {
    return this.httpClient.get<User>(this.userURL + '/single', { headers: this.setHeaders() })
    .pipe(
      map(user => {
        this.setAuth(user);
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public login(username: string, pin: string): Observable<boolean> {
    const url: string = `${this.authenticatorURL}/login`;
    const request = this.httpClient.post<Tokens>(url, { username, pin });
    return this.processAuthRequest(request);
  }
  
  public register(body: any): Observable<boolean> {
    const url: string = `${this.authenticatorURL}/register`;
    return this.httpClient.post<Tokens>(url, body).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public pinReminder(email: string): Observable<boolean> {
    const url: string = `${this.emailSenderURL}/pin-reminder`;
    return this.httpClient.post<Tokens>(url, {email}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  //public registerAdmin(regData: Register): Observable<boolean> {
  //  const url: string = `${this.authURL}/register`;
  //  return this.httpClient.post<Tokens>(url, regData).pipe(
  //    map(() => true),
  //    catchError((error: HttpErrorResponse) => throwError(() => error))
  //  );
  //}

  public logout() {
    this._currentUser.next(null);
    this._isLoggedIn.next(AuthStatus.NotAuthenticated);
    this.cookieService.delete('token');
  }

  public checkAuthStatus(): Observable<boolean> {
    return timer(500).pipe(
      switchMap(() => {
        if (this.cookieService.check('token')) {
          return this.getUser();
        } else {
          this.logout();
          return of(false);
        }
      })
    );
  }

  public updateUser(user: User): Observable<boolean> {
    const url: string = `${this.userURL}/update`;
    const headers: HttpHeaders = this.setHeaders();
    return this.httpClient.patch<{ message: string, user: User }>(url, user, { headers }).pipe(
        map(response => {
            this._currentUser.next(response.user);
            return true;
        }),
        catchError((error: HttpErrorResponse) => throwError(() => error))
    );
}

  public updatePwd(oldPin: string, newPin: string): Observable<boolean> {
    const url: string = `${this.userURL}/change-pin`;
    const headers: HttpHeaders = this.setHeaders();
    return this.httpClient.patch<{ message: string }>(url, { 
      oldPin, 
      newPin 
    }, { headers }).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public isLoggedIn(): Observable<AuthStatus> {
    return this._isLoggedIn.asObservable();
  }

  public currentUser(): Observable<User|null> {
    return this._currentUser.asObservable();
  }

}

export { AuthStatus };
