import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Certificate, CertificateInput } from '../../core/models/certificate-model';
import { CertificatesService } from '../../core/services/certificates-service';
import { SpinnerComponent } from '../../shared/spinner/spinner-component';

const URL_PATTERN = /^(https?:\/\/.+)?$/;

@Component({
  selector: 'app-certificate-form',
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './certificate-form-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(CertificatesService);
  private image?: File;

  /** null = شهادة جديدة */
  readonly certificate = input<Certificate | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    title: ['', Validators.required],
    issuer: ['', Validators.required],
    issued_on: [''],
    credential_url: ['', Validators.pattern(URL_PATTERN)],
    image_url: ['', Validators.pattern(URL_PATTERN)],
    skills: [''],
    sort_order: [0],
    in_progress: [false],
  });

  constructor() {
    effect(() => {
      const c = this.certificate();
      this.image = undefined;
      this.form.reset({
        title: c?.title ?? '',
        issuer: c?.issuer ?? '',
        issued_on: c?.issued_on ?? '',
        credential_url: c?.credential_url ?? '',
        image_url: c?.image_url ?? '',
        skills: c?.skills.join(', ') ?? '',
        sort_order: c?.sort_order ?? 0,
        in_progress: c?.in_progress ?? false,
      });
    });
  }

  protected onFile(event: Event): void {
    this.image = (event.target as HTMLInputElement).files?.[0];
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    const input: CertificateInput = {
      title: v.title.trim(),
      issuer: v.issuer.trim(),
      issued_on: v.issued_on || null,
      credential_url: v.credential_url.trim() || null,
      image_url: v.image_url.trim() || null,
      skills: v.skills.split(',').map((s) => s.trim()).filter(Boolean),
      sort_order: Number(v.sort_order) || 0,
      in_progress: v.in_progress,
    };

    try {
      const current = this.certificate();
      if (current) await this.store.update(current.id, input, this.image);
      else await this.store.create(input, this.image);
      this.saved.emit();
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Save failed');
    } finally {
      this.saving.set(false);
    }
  }
}
