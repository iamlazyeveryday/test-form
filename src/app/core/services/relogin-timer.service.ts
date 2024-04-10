import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, takeWhile, timer, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloginTimerService {
  private countdown$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private canResendSubject = new BehaviorSubject<boolean>(true);

  get countdown(): Observable<number> {
    return this.countdown$.asObservable();
  }

  get canResend(): Observable<boolean> {
    return this.canResendSubject.asObservable();
  }

  startCountdown(seconds: number):void {
    this.stopCountdown();

    this.canResendSubject.next(false);
    this.countdown$.next(seconds);

    const countdownTimer$ = timer(0, 1000).pipe(
      tap(() => {
        seconds -= 1;
        this.countdown$.next(seconds);
      }),
      takeWhile(() => seconds > 0),
      finalize(() => this.canResendSubject.next(true))
    );

    countdownTimer$.subscribe();
  }

  stopCountdown(): void {
      this.countdown$.next(0);
  }
}
