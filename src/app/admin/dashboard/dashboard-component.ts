import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../core/services/projects-service';
import { ResumeService } from '../../core/services/resume-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly store = inject(ProjectsService);
  protected readonly resume = inject(ResumeService);

  ngOnInit(): void {
    this.store.load();
    this.resume.load();
  }
}
