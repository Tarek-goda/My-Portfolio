import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project, ProjectInput } from '../../core/models/project-model';
import { ProjectsService } from '../../core/services/projects-service';
import { SpinnerComponent } from '../../shared/spinner/spinner-component';

const URL_PATTERN = /^(https?:\/\/.+)?$/;

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './project-form-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(ProjectsService);
  private poster?: File;

  /** null = مشروع جديد */
  readonly project = input<Project | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    live_url: ['', Validators.pattern(URL_PATTERN)],
    repo_url: ['', Validators.pattern(URL_PATTERN)],
    poster_url: ['', Validators.pattern(URL_PATTERN)],
    tags: [''],
    sort_order: [0],
  });

  constructor() {
    effect(() => {
      const p = this.project();
      this.poster = undefined;
      this.form.reset({
        title: p?.title ?? '',
        description: p?.description ?? '',
        live_url: p?.live_url ?? '',
        repo_url: p?.repo_url ?? '',
        poster_url: p?.poster_url ?? '',
        tags: p?.tags.join(', ') ?? '',
        sort_order: p?.sort_order ?? 0,
      });
    });
  }

  protected onFile(event: Event): void {
    this.poster = (event.target as HTMLInputElement).files?.[0];
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    const input: ProjectInput = {
      title: v.title.trim(),
      description: v.description.trim(),
      live_url: v.live_url.trim() || null,
      repo_url: v.repo_url.trim() || null,
      poster_url: v.poster_url.trim() || null,
      tags: v.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sort_order: Number(v.sort_order) || 0,
    };

    try {
      const current = this.project();
      if (current) await this.store.update(current.id, input, this.poster);
      else await this.store.create(input, this.poster);
      this.saved.emit();
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Save failed');
    } finally {
      this.saving.set(false);
    }
  }
}
