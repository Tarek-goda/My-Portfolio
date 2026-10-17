import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Project } from '../../core/models/project-model';

/** صف مشروع قابل للفتح: يعرض البوستر والوصف والروابط (تفتح في تاب جديد) */
@Component({
  selector: 'app-project-card',
  templateUrl: './project-card-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  protected readonly open = signal(false);
}
