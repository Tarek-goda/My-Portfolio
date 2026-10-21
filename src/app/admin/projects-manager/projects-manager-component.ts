import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Project } from '../../core/models/project-model';
import { ProjectsService } from '../../core/services/projects-service';
import { PresentBadgeComponent } from '../../shared/present-badge/present-badge-component';
import { SpinnerComponent } from '../../shared/spinner/spinner-component';
import { ProjectFormComponent } from '../project-form/project-form-component';

@Component({
  selector: 'app-projects-manager',
  imports: [ProjectFormComponent, SpinnerComponent, PresentBadgeComponent],
  templateUrl: './projects-manager-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsManagerComponent implements OnInit {
  protected readonly store = inject(ProjectsService);

  /** null = لا شيء مفتوح، 'new' = مشروع جديد، Project = تعديل */
  protected readonly editing = signal<Project | 'new' | null>(null);
  protected readonly formProject = computed(() => {
    const current = this.editing();
    return current === 'new' || current === null ? null : current;
  });
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.store.load();
  }

  protected async remove(project: Project): Promise<void> {
    if (!confirm(`Delete "${project.title}"?`)) return;
    this.error.set(null);
    try {
      await this.store.remove(project.id);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Delete failed');
    }
  }
}
