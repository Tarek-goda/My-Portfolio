import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ResumeService } from '../../core/services/resume-service';
import { SpinnerComponent } from '../../shared/spinner/spinner-component';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

@Component({
  selector: 'app-resume-manager',
  imports: [SpinnerComponent],
  templateUrl: './resume-manager-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeManagerComponent implements OnInit {
  protected readonly resume = inject(ResumeService);
  protected readonly busy = signal(false);
  protected readonly message = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.resume.load();
  }

  protected async onFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.message.set(null);
    this.error.set(null);

    if (file.type !== 'application/pdf') {
      this.error.set('Please choose a PDF file.');
      return;
    }
    if (file.size > MAX_SIZE) {
      this.error.set('File is larger than 5MB.');
      return;
    }

    await this.run(() => this.resume.upload(file), 'CV updated.');
    input.value = '';
  }

  protected async remove(): Promise<void> {
    if (!confirm('Delete the current CV?')) return;
    await this.run(() => this.resume.remove(), 'CV deleted.');
  }

  private async run(action: () => Promise<void>, success: string): Promise<void> {
    this.busy.set(true);
    this.message.set(null);
    this.error.set(null);
    try {
      await action();
      this.message.set(success);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      this.busy.set(false);
    }
  }
}
