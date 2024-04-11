import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './auth/components/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FakeBackendInterceptor } from './auth/services/fake-backend.interceptor';
import { environment } from '../environments/environment.development';
import { AUTH_API_URL } from './lib/api-url.token';
import { WelcomeMessagePipe } from './auth/pipes/welcome-message.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    WelcomeMessagePipe,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true
    },
    {
      provide: AUTH_API_URL,
      useValue: environment.url
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
