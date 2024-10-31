import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Movement } from '../../user/interfaces/movement.interface';
import { BehaviorSubject, Observable, catchError, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovementService {

  private readonly movementURL: string = `${environment.API_URL}/report`;

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private _myMovements: BehaviorSubject<Movement> = new BehaviorSubject<Movement>({
    total_ingresos: '0',
    total_egresos: '0',
    count_ingresos: 0,
    count_egresos: 0
  });

  constructor() { }

  public getMyMovements(timestamp: number, id: number): Observable<boolean> {
    const url: string = `${this.movementURL}/transactions/${id}`;
    const headers: HttpHeaders = this.authService.setHeaders();
    const params: HttpParams = new HttpParams().set('date', timestamp);
    return this.httpClient.get<Movement>(url, { headers, params }).pipe(
      map(movements => {
        this._myMovements.next(movements);
        return true;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  public myMovements(): Observable<Movement> {
    return this._myMovements.asObservable();
  }

}
