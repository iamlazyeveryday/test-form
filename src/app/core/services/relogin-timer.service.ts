import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, takeWhile, timer, tap, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloginTimerService {
  public countdown$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private countdownSubscription: Subscription | null = null;

  get countdown(): Observable<number> {
    return this.countdown$.asObservable();
  }

  startCountdown(seconds: number):void {
    this.stopCountdown();

    this.countdown$.next(seconds);
    this.countdownSubscription = timer(0, 1000).pipe(
      tap(() => {
        seconds -= 1;
        this.countdown$.next(seconds);
      }),
      takeWhile(() => seconds > 0, true)
    ).subscribe();
  }

  stopCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = null;
    }
      this.countdown$.next(0);
  }
}
