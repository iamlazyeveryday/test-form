import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  readonly loginTitle = 'Вход или регистрация';
  readonly usernameLabel = 'Логин';
  readonly usernamePlaceholder = 'Введите имя пользователя';
  readonly submitButtonLabel = 'Отправить';
  readonly loadingMessage = 'Загрузка...';
  readonly usernameError = 'Пожалуйста, введите корректное имя пользователя';
}
