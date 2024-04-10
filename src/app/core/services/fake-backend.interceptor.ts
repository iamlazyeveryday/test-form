import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, defer, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { environment } from "../../../environments/environment.development";
import { AuthResponse, User } from "../interfaces/user-login.interface";

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<User>, next: HttpHandler): Observable<HttpEvent<AuthResponse>> {
      if (req.url.endsWith(environment.url) && req.method === 'POST') {
        return defer(() => {
          const user = req.body as User;

          if (user.username === 'admin') {
            return of(new HttpResponse<AuthResponse>({
              status: 200,
              body: {
                token: 'fake-jwt-token',
                username: user.username
              }
            })).pipe(delay(500));
            } else {
              return throwError(() => new HttpErrorResponse({
                status: 401,
                statusText: 'Unauthorized',
                error: { message: 'Некорректное имя пользователя' }
              }));
            }
          });
      }

      return next.handle(req) as Observable<HttpEvent<AuthResponse>>;
  }
}
