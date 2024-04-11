import { Injectable } from '@angular/core';
import { BehaviorSubject, takeWhile, timer, Subject, switchMap, startWith, scan, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloginTimerService {
  private action$ = new Subject<number>();
  private canResendSource = new BehaviorSubject<boolean>(true);
  public canResend$ = this.canResendSource.asObservable();

  countdown$ = this.action$.pipe(
    switchMap(seconds => timer(0, 1000).pipe(
      startWith(seconds),
      scan(time => time - 1),
      takeWhile(time => time >= 0),
      finalize(() => this.canResendSource.next(true))
    ))
  );

  startCountdown(seconds: number): void {
    this.canResendSource.next(false);
    this.action$.next(seconds);
  }

  stopCountdown(): void {
    this.action$.next(0);
    this.canResendSource.next(false);
  }
}
