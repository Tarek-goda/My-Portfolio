import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ProjectsService } from '../../core/services/projects-service';
import { SeoService } from '../../core/services/seo-service';
import { ProjectCardComponent } from '../../shared/project-card/project-card-component';
import { SpinnerComponent } from '../../shared/spinner/spinner-component';

@Component({
  selector: 'app-projects',
  imports: [ProjectCardComponent, SpinnerComponent],
  templateUrl: './projects-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  protected readonly store = inject(ProjectsService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Projects | Tarek Goda',
      description: 'Angular projects by Tarek Goda: live demos, source code and project details.',
      path: '/projects',
    });
    this.store.load();
  }
}
