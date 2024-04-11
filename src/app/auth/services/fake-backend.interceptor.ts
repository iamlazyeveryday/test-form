import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError, timer } from "rxjs";
import { switchMap } from "rxjs/operators";
import { environment } from "../../../environments/environment.development";
import { AuthResponse, User } from "../interfaces/user-login.interface";

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<User>, next: HttpHandler): Observable<HttpEvent<AuthResponse>> {
    if (req.url.endsWith(environment.url) && req.method === 'POST') {
      return timer(500).pipe(
        switchMap(() => {
          const user = req.body as User;

          if (user.username === 'admin') {
            return of(new HttpResponse<AuthResponse>({
              status: 200,
              body: {
                status: 'success',
                token: 'fake-jwt-token',
                username: user.username
              }
            }));
          } else {
            return throwError(() => new HttpErrorResponse({
              status: 401,
              statusText: 'Unauthorized',
              error: {
                status: 'error',
                message: 'Некорректное имя пользователя'
              }
            }));
          }
        })
      );
    }

    return next.handle(req) as Observable<HttpEvent<AuthResponse>>;
  }
}
