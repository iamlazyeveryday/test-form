import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReloginTimerService } from '../../services/relogin-timer.service';
import { BehaviorSubject, EMPTY, catchError, finalize, switchMap, tap, timer } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  public config = inject(ConfigService);
  private readonly authService = inject(AuthService);
  private readonly reloginTimerService = inject(ReloginTimerService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private isLoadingSource = new BehaviorSubject<boolean>(false);
  private errorMessageSource = new BehaviorSubject<string>('');

  public isLoading$ = this.isLoadingSource.asObservable();
  public errorMessage$ = this.errorMessageSource.asObservable();
  public countdown$ = this.reloginTimerService.countdown$;
  public canResend$ = this.reloginTimerService.canResend$;

  public userName = '';

  public form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
  });

  public getResendMessage(count: number): string {
    return `Подождите ${count} секунд перед повторной отправкой`;
  };

  submitLogin(): void {
    if (this.form.invalid) {
      this.errorMessageSource.next(this.config.usernameError);
      return;
    }

    this.isLoadingSource.next(true);
    const username = this.form.get('username')!.value;

    this.authService.login(username).pipe(
      catchError(error => {
        this.isLoadingSource.next(false);
        this.errorMessageSource.next(error);
        this.form.reset();
        this.reloginTimerService.startCountdown(60);
        return timer(5000).pipe(
          tap(() => this.errorMessageSource.next('')),
          switchMap(() => EMPTY)
        );
      }),
      tap(response => {
        this.userName = response.username;
      }),
      finalize(() => {
        this.isLoadingSource.next(false);
        this.form.reset();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
