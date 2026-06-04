import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { QuizListComponent } from './features/quiz/quiz-list.component';
import { QuizPlayComponent } from './features/quiz/quiz-play.component';
import { HistoryComponent } from './features/quiz/history.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    data: { mode: 'login' }
  },
  {
    path: 'register',
    component: AuthComponent,
    data: { mode: 'register' }
  },
  {
    path: 'quizzes',
    component: QuizListComponent
  },
  {
    path: 'quizzes/:id',
    component: QuizPlayComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'admin',
    component: AdminDashboardComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'quizzes'
  }
];
