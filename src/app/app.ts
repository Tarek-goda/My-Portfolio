import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading-service';
import { SpinnerComponent } from './shared/spinner/spinner-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly loading = inject(LoadingService);
}
