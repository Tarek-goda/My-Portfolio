import { Injectable, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

/** يعرض الـ spinner أثناء تحميل الصفحات الـ lazy فقط لو التنقل أخد وقت (يمنع الوميض) */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly router = inject(Router);
  private timer?: ReturnType<typeof setTimeout>;

  readonly routeLoading = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.routeLoading.set(true), 150);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        clearTimeout(this.timer);
        this.routeLoading.set(false);
      }
    });
  }
}
