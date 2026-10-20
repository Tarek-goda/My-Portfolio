import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Certificate } from '../../core/models/certificate-model';
import { CertificatesService } from '../../core/services/certificates-service';
import { SpinnerComponent } from '../../shared/spinner/spinner-component';
import { CertificateFormComponent } from '../certificate-form/certificate-form-component';

@Component({
  selector: 'app-certificates-manager',
  imports: [CertificateFormComponent, SpinnerComponent],
  templateUrl: './certificates-manager-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesManagerComponent implements OnInit {
  protected readonly store = inject(CertificatesService);

  /** null = لا شيء مفتوح، 'new' = شهادة جديدة، Certificate = تعديل */
  protected readonly editing = signal<Certificate | 'new' | null>(null);
  protected readonly formCertificate = computed(() => {
    const current = this.editing();
    return current === 'new' || current === null ? null : current;
  });
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.store.load();
  }

  protected async remove(certificate: Certificate): Promise<void> {
    if (!confirm(`Delete "${certificate.title}"?`)) return;
    this.error.set(null);
    try {
      await this.store.remove(certificate.id);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Delete failed');
    }
  }
}
