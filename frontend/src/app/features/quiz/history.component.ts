import { Component } from '@angular/core';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  template: `
    <section class="card">
      <h2>Result History</h2>
      @for (item of history; track item._id) {
        <p>{{ item.quiz?.title }} - {{ item.percentage }}% ({{ item.score }}/{{ item.totalQuestions }})</p>
      }
    </section>

    <section class="card">
      <h2>Performance Tracking</h2>
      <p>Attempts: {{ performance.attempts }}</p>
      <p>Average Score: {{ performance.averageScore }}%</p>
      <p>Best Score: {{ performance.bestScore }}%</p>
    </section>
  `
})
export class HistoryComponent {
  history: Array<{ _id: string; percentage: number; score: number; totalQuestions: number; quiz?: { title: string } }> = [];
  performance = { attempts: 0, averageScore: 0, bestScore: 0 };

  constructor(private readonly api: ApiService) {
    this.api
      .get<Array<{ _id: string; percentage: number; score: number; totalQuestions: number; quiz?: { title: string } }>>(
        '/quizzes/me/history'
      )
      .subscribe((response) => (this.history = response));

    this.api
      .get<{ attempts: number; averageScore: number; bestScore: number }>('/quizzes/me/performance')
      .subscribe((response) => (this.performance = response));
  }
}
