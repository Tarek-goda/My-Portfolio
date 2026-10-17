import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'gmail' | 'linkedin' | 'github';

/** أيقونات العلامات التجارية. gmail بلونه الأصلي، والباقي بلون النص الحالي */
@Component({
  selector: 'app-icon',
  templateUrl: './icon-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(20);
}
