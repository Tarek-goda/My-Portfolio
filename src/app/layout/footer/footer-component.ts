import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EmailService } from '../../core/services/email-service';
import { IconComponent } from '../../shared/icon/icon-component';

@Component({
  selector: 'app-footer',
  imports: [IconComponent],
  templateUrl: './footer-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly mail = inject(EmailService);

  protected readonly year = new Date().getFullYear();
  protected readonly gmailUrl = this.mail.webUrl();
  protected readonly linkedin = 'https://www.linkedin.com/in/tarekgoda22/';
  protected readonly github = 'https://github.com/Tarek-goda';

  protected openEmail(event: Event): void {
    event.preventDefault();
    this.mail.open();
  }
}