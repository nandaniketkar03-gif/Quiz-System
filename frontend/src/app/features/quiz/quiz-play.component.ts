import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-quiz-play',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="card">
      <h2>{{ quiz?.title || 'Quiz' }}</h2>
      @for (question of questions; track question._id) {
        <article class="card">
          <p><strong>{{ question.text }}</strong></p>
          @for (option of question.options; track option) {
            <label style="display:block; margin-bottom:0.25rem;">
              <input
                type="radio"
                [name]="question._id"
                [value]="option"
                [(ngModel)]="selected[question._id]"
              />
              {{ option }}
            </label>
          }
        </article>
      }
      <button (click)="submit()">Submit Quiz</button>
      @if (result) {
        <p>Score: {{ result.score }}/{{ result.totalQuestions }} ({{ result.percentage }}%)</p>
      }
    </section>
  `
})
export class QuizPlayComponent {
  quizId = this.route.snapshot.paramMap.get('id') as string;
  quiz: { title: string } | null = null;
  questions: Array<{ _id: string; text: string; options: string[] }> = [];
  selected: Record<string, string> = {};
  result: { score: number; totalQuestions: number; percentage: number } | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService
  ) {
    this.api
      .get<{ quiz: { title: string }; questions: Array<{ _id: string; text: string; options: string[] }> }>(
        `/quizzes/${this.quizId}/questions`
      )
      .subscribe((data) => {
        this.quiz = data.quiz;
        this.questions = data.questions;
      });
  }

  submit() {
    const answers = this.questions
      .filter((q) => this.selected[q._id])
      .map((q) => ({ questionId: q._id, selectedAnswer: this.selected[q._id] }));

    this.api
      .post<{ score: number; totalQuestions: number; percentage: number }>(`/quizzes/${this.quizId}/submit`, {
        answers
      })
      .subscribe((res) => (this.result = res));
  }
}
