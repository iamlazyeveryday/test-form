import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReloginTimerService } from '../../services/relogin-timer.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit, OnDestroy {
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
  });
  userName: string | null = null;
  countdown: number | null = null;
  canResend = true;
  isLoading = false;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private reloginTimerService: ReloginTimerService
  ) {}

  ngOnInit(): void {
    this.reloginTimerService.countdown.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.countdown = value;
      this.canResend = value === 0;
    });

    this.reloginTimerService.canResend.pipe(
      takeUntil(this.destroy$)
    ).subscribe(canSend => {
      this.canResend = canSend;
    });
  }

  submitLogin(): void {
    if(this.loginForm.valid && this.canResend) {
      this.isLoading = true;
      const username = this.loginForm.value.username;

      this.authService.login<{ username: string }>(username!).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.userName = response.username;
          this.loginForm.reset();
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
          this.loginForm.reset();
          this.errorMessage = 'Ошибка авторизации';
          setTimeout(() => this.errorMessage = '', 5000);
          this.reloginTimerService.startCountdown(60);
        }
      });
    }

  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
}
