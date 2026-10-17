import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner-component.html',
  styleUrl: './spinner-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly label = input('Loading');
}
