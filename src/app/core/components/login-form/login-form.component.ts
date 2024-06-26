import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReloginTimerService } from '../../services/relogin-timer.service';
import { Observable, Subscription, catchError, finalize, of, tap } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly reloginTimerService = inject(ReloginTimerService);

  public loginTitle = 'Вход или регистрация';
  public usernameLabel = 'Логин';
  public usernamePlaceholder = 'Введите имя пользователя';
  public submitButtonLabel = 'Отправить';
  public loadingMessage = 'Загрузка...';
  public userName: string | null = null;
  public canResend: boolean = true;
  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get welcomeMessage(): string {
    return `Добро пожаловать, ${this.userName}!`;
  };
  public getResendMessage(count: number): string {
    return `Подождите ${count} секунд перед повторной отправкой`;
  };

  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  public countdown$: Observable<number> = this.reloginTimerService.countdown$.pipe(
    tap(value => this.canResend = value === 0)
  );

  private loginSubscription?: Subscription;

  submitLogin(): void {
    if(!this.loginForm.valid || !this.canResend) return;

    this.isLoading = true;
    const username = this.loginForm.value.username?.replace(/\s+/g, '');

    this.loginSubscription = this.authService.login(username!).pipe(
      tap({
        next: (response) => {
          this.userName = response.username;
          this.changeDetector.detectChanges();
        },
        error: (errorMessage) => {
          this.errorMessage = errorMessage;
          this.userName = null;
          this.reloginTimerService.startCountdown(60);
          setTimeout(() => {
            this.errorMessage = '';
            this.changeDetector.detectChanges();
          }, 5000);
          this.changeDetector.detectChanges();
        }
      }),
      finalize(() => {
        this.isLoading = false;
        this.loginForm.reset();
        this.changeDetector.detectChanges();
      }),
      catchError(() => of())
    ).subscribe();
  }

  ngOnDestroy(): void {
      this.loginSubscription?.unsubscribe();
  }
}
