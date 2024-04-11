import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthResponse } from '../interfaces/user-login.interface';
import { AUTH_API_URL } from '../../lib/api-url.token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authApiUrl = inject(AUTH_API_URL);

  login(username: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authApiUrl, { username }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => (error.error?.message || 'Произошла ошибка авторизации'));
      })
    )
  }
}
