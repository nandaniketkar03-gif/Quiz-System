import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterOutlet, RouterLink } from '@angular/router';
import { Component, signal } from '@angular/core';
import { routes } from './app/app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="container card" style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
      <strong>Quiz System</strong>
      <a routerLink="/login">Login</a>
      <a routerLink="/register">Register</a>
      <a routerLink="/quizzes">Quizzes</a>
      <a routerLink="/history">History</a>
      <a routerLink="/admin">Admin</a>
    </nav>
    <main class="container"><router-outlet /></main>
  `
})
class AppComponent {
  protected readonly _noop = signal(0);
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes)]
});
