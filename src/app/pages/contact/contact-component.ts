import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  protected readonly email = 'tarrekgoda@gmail.com';
  protected readonly gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.email}`;
  protected readonly linkedin = 'https://www.linkedin.com/in/tarek-goda';
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

  /** بيفتح Gmail على الويب في تاب جديد برسالة جاهزة */
  protected send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, message } = this.form.getRawValue();
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: this.email,
      su: `Portfolio message from ${name}`,
      body: message,
    });
    window.open(`https://mail.google.com/mail/?${params}`, '_blank', 'noopener');
  }
}
