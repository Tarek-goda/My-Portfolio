import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** شعار TG: الإطار والحرفين بيتكتبوا بالتتابع عند التحميل */
@Component({
  selector: 'app-logo',
  templateUrl: './logo-component.html',
  styleUrl: './logo-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  readonly size = input(36);
}
