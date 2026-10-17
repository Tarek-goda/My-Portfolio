import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { SeoService } from '../../core/services/seo-service';
import { SpinnerComponent } from '../../shared/spinner/spinner-component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    inject(SeoService).set({ title: 'Admin Login', description: 'Admin login', noindex: true });
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();
    const error = await this.auth.signIn(email, password);
    this.loading.set(false);

    if (error) {
      this.error.set(error);
      return;
    }
    await this.router.navigateByUrl('/admin');
  }
}
