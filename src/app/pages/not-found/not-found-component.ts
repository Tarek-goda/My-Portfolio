import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo-service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  constructor() {
    inject(SeoService).set({
      title: 'Page not found | Tarek Goda',
      description: 'This page does not exist.',
      noindex: true,
    });
  }
}
