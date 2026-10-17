import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon-component';

@Component({
  selector: 'app-footer',
  imports: [IconComponent],
  templateUrl: './footer-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
  protected readonly email = 'tarrekgoda@gmail.com';
  protected readonly gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.email}`;
  protected readonly linkedin = 'https://www.linkedin.com/in/tarek-goda';
  protected readonly github = 'https://github.com/Tarek-goda';
}
