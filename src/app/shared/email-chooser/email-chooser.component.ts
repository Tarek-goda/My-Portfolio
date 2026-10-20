import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EmailService } from '../../core/services/email-service';

/** نافذة اختيار طريقة إرسال الإيميل على الآيفون */
@Component({
  selector: 'app-email-chooser',
  templateUrl: './email-chooser.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'mail.closeChooser()' },
})
export class EmailChooserComponent {
  readonly mail = inject(EmailService);
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    this.copied.set(await this.mail.copyAddress());
    setTimeout(() => this.copied.set(false), 2000);
  }
}