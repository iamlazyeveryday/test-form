import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login<T>(username: string): Observable<T> {
    const url = '/login'
    return this.http.post<T>(url, { username })
  }
}
