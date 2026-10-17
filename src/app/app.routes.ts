import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';

// كل الصفحات Lazy: كل واحدة بتتحمّل في chunk منفصل عند أول زيارة
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout-component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home/home-component').then((m) => m.HomeComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects-component').then((m) => m.ProjectsComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact-component').then((m) => m.ContactComponent),
      },
    ],
  },
  {
    path: 'admin/login',
    title: 'Admin Login',
    loadComponent: () => import('./admin/login/login-component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout-component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Dashboard',
        loadComponent: () =>
          import('./admin/dashboard/dashboard-component').then((m) => m.DashboardComponent),
      },
      {
        path: 'projects',
        title: 'Manage Projects',
        loadComponent: () =>
          import('./admin/projects-manager/projects-manager-component').then(
            (m) => m.ProjectsManagerComponent,
          ),
      },
      {
        path: 'resume',
        title: 'Manage CV',
        loadComponent: () =>
          import('./admin/resume-manager/resume-manager-component').then(
            (m) => m.ResumeManagerComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () =>
      import('./pages/not-found/not-found-component').then((m) => m.NotFoundComponent),
  },
];
