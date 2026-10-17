import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { SeoService } from '../../core/services/seo-service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly links = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/projects', label: 'Projects', exact: false },
    { path: '/admin/resume', label: 'CV', exact: false },
  ];

  constructor() {
    inject(SeoService).set({ title: 'Admin', description: 'Admin area', path: '/admin', noindex: true });
  }

  protected async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/admin/login');
  }
}
