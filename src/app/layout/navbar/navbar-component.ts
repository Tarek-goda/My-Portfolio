import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ResumeService } from '../../core/services/resume-service';
import { LogoComponent } from '../../shared/logo/logo-component';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './navbar-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly doc = inject(DOCUMENT);
  protected readonly resume = inject(ResumeService);

  protected readonly links = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];
  protected readonly menuOpen = signal(false);
  protected readonly theme = signal<Theme>(this.initialTheme());

  constructor() {
    this.resume.load();
    effect(() => {
      const theme = this.theme();
      this.doc.documentElement.dataset['theme'] = theme;
      try {
        localStorage.setItem('theme', theme);
      } catch {
        /* التخزين غير متاح، مش مشكلة */
      }
    });
  }

  protected toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private initialTheme(): Theme {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }
}
