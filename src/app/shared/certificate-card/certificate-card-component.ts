import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Certificate } from '../../core/models/certificate-model';

const VISIBLE_SKILLS = 5;

@Component({
  selector: 'app-certificate-card',
  imports: [DatePipe],
  templateUrl: './certificate-card-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateCardComponent {
  readonly certificate = input.required<Certificate>();

  protected readonly visibleSkills = computed(() =>
    this.certificate().skills.slice(0, VISIBLE_SKILLS),
  );
  protected readonly extraSkills = computed(() =>
    Math.max(0, this.certificate().skills.length - VISIBLE_SKILLS),
  );
}
