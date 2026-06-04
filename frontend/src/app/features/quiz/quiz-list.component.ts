import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';

interface Quiz {
  _id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="card">
      <h2>Available Quizzes</h2>
      <div class="grid">
        @for (quiz of quizzes; track quiz._id) {
          <article class="card">
            <h3>{{ quiz.title }}</h3>
            <p>{{ quiz.description }}</p>
            <a [routerLink]="['/quizzes', quiz._id]">Start Quiz</a>
          </article>
        }
      </div>
    </section>
  `
})
export class QuizListComponent {
  quizzes: Quiz[] = [];

  constructor(private readonly api: ApiService) {
    this.api.get<Quiz[]>('/quizzes').subscribe((data) => (this.quizzes = data));
  }
}
