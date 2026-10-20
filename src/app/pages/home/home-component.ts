import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../core/services/projects-service';
import { ResumeService } from '../../core/services/resume-service';
import { SeoService } from '../../core/services/seo-service';
import { HeroDrawNameComponent } from '../../shared/hero-draw-name/hero-draw-name-component';
import { ProjectCardComponent } from '../../shared/project-card/project-card-component';
import { SpinnerComponent } from '../../shared/spinner/spinner-component';
import { CertificatesService } from '../../core/services/certificates-service';
import { CertificateCardComponent } from '../../shared/certificate-card/certificate-card-component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeroDrawNameComponent, ProjectCardComponent, SpinnerComponent, CertificateCardComponent],
  templateUrl: './home-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);
  protected readonly store = inject(ProjectsService);
  protected readonly resume = inject(ResumeService);
  protected readonly certs = inject(CertificatesService);

  protected readonly featured = computed(() => this.store.projects().slice(0, 3));
  protected readonly email = 'tarrekgoda@gmail.com';

  protected readonly skills = [
    {
      group: 'Front-End',
      items: ['Angular', 'TypeScript', 'JavaScript', 'RxJS', 'Tailwind CSS', 'HTML5', 'CSS3'],
    },
    {
      group: 'Back-End (learning)',
      items: ['C#', 'MS SQL Server', 'LINQ', 'Entity Framework Core'],
    },
    {
      group: 'Tools & Automation',
      items: ['Git', 'GitHub', 'Google Apps Script', 'Google Sheets & Forms', 'Figma (basics)'],
    },
  ];

  protected readonly experience = [
    {
      role: '.NET Back-End Development Track',
      org: 'ITI, self-study / auditing',
      period: '08/2026 – Present',
      points: [
        'SQL Server: ERD design, normalization, DDL/DML, joins and aggregations.',
        'C# and OOP: encapsulation, inheritance and polymorphism.',
      ],
    },
    {
      role: 'Technical Solutions & Workspace Administration',
      org: 'Athar Accelerator, Creativa Fayoum',
      period: '05/2025 – Present',
      points: [
        'Built and deployed a QR code scanner web app that replaced manual attendance tracking.',
        'Linked it to Google Forms and Sheets with Google Apps Script for real-time data and automated reports.',
      ],
    },
    {
      role: 'Frontend Web Master Training',
      org: 'Quires Hub, Round 10',
      period: '',
      points: [
        'Built a modular restaurant landing page with Angular components.',
        'Built a ToDo app with Angular 17 in an agile team of five.',
      ],
    },
    {
      role: 'Front-end Development Trainee',
      org: 'Digital Egypt Pioneers Initiative (DEPI)',
      period: '',
      points: [
        'Added responsive design to 15 web pages.',
        'Managed collaboration for 4 developers across 12 branches and 10 pull requests.',
      ],
    },
  ];

  ngOnInit(): void {
    this.seo.set({
      title: 'Tarek Goda | Front-End Developer (Angular)',
      description:
        'Tarek Goda is a front-end developer building Angular applications connected to real APIs. See projects, experience and download the CV.',
      path: '/',
    });
    this.seo.setPersonJsonLd();
    this.store.load();
    this.resume.load();
    this.certs.load();
  }
}
