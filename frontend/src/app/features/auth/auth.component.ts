import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>{{ mode === 'login' ? 'Login' : 'Register' }}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        @if (mode === 'register') {
          <label>Name</label>
          <input formControlName="name" />
        }
        <label>Email</label>
        <input formControlName="email" type="email" />
        <label>Password</label>
        <input formControlName="password" type="password" />
        <button [disabled]="form.invalid">{{ mode === 'login' ? 'Login' : 'Register' }}</button>
      </form>
      @if (error) {
        <p style="color:#dc2626;">{{ error }}</p>
      }
    </section>
  `
})
export class AuthComponent implements OnInit {
  mode: 'login' | 'register' = 'login';
  error = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', []],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    const mode = this.route.snapshot.data['mode'];
    this.setMode(mode === 'register' ? 'register' : 'login');
  }

  setMode(mode: 'login' | 'register') {
    this.mode = mode;
    if (mode === 'register') {
      this.form.controls.name.addValidators([Validators.required]);
    } else {
      this.form.controls.name.clearValidators();
    }
    this.form.controls.name.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) return;

    const endpoint = this.mode === 'login' ? '/auth/login' : '/auth/register';
    this.api.post<{ token: string }>(endpoint, this.form.getRawValue()).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigateByUrl('/quizzes');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Authentication failed';
      }
    });
  }
}
