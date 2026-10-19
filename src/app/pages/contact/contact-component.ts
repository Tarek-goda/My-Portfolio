import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../core/services/email-service';
import { SeoService } from '../../core/services/seo-service';
import { IconComponent } from '../../shared/icon/icon-component';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './contact-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly mail = inject(EmailService);

  protected readonly email = this.mail.address;
  protected readonly gmailUrl = this.mail.webUrl();
  protected readonly linkedin = 'https://www.linkedin.com/in/tarekgoda22/';
  protected readonly github = 'https://github.com/Tarek-goda';

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.seo.set({
      title: 'Contact | Tarek Goda',
      description: 'Get in touch with Tarek Goda for Angular front-end work.',
      path: '/contact',
    });
  }

  protected openEmail(event: Event): void {
    event.preventDefault();
    this.mail.open();
  }

  protected send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, message } = this.form.getRawValue();
    this.mail.open(`Portfolio message from ${name}`, message);
  }
}