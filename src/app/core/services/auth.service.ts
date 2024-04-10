import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthResponse } from '../interfaces/user-login.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(username: string): Observable<AuthResponse> {
    const url = environment.url;
    return this.http.post<AuthResponse>(url, { username }).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || 'Произошла ошибка авторизации';
        return throwError(errorMessage);
      })
    )
  }
}
