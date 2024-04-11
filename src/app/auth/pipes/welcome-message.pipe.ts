import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'welcomeMessage'
})
export class WelcomeMessagePipe implements PipeTransform {

  transform(userName: string): string {
    return `Добро пожаловать, ${userName}!`;
  }

}
