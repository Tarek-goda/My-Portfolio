import { ChangeDetectionStrategy, Component } from '@angular/core';

/** شارة "Present" بنقطة نابضة: بتدل إن العمل لسه شغال */
@Component({
  selector: 'app-present-badge',
  templateUrl: './present-badge-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentBadgeComponent {}
