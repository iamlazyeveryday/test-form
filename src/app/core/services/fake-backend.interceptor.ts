import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap } from "rxjs/operators";

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (req.url.endsWith('/login') && req.method === 'POST') {
        return of(null).pipe(
          delay(500), // имитация задержки бэкенда
          mergeMap(() => {
            const { username } = req.body;

            if (username === 'admin') {
              return of(new HttpResponse({
                status: 200,
                body: {
                  token: 'fake-jwt-token',
                  username
                }
              }));
            } else {
              return throwError(() => new HttpErrorResponse({
                status: 401,
                statusText: 'Unauthorized',
                error: { message: 'Некорректное имя пользователя' }
              }));
            }
          })
        );
      }

      return next.handle(req); // для всех остальных запросов пропускаем запрос без изменений
  }
}
