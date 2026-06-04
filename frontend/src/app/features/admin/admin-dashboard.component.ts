import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="card">
      <h2>Admin Dashboard</h2>
      <div class="grid">
        <article class="card">
          <h3>Categories</h3>
          <input [(ngModel)]="newCategory" placeholder="Category name" />
          <button (click)="createCategory()">Add Category</button>
          @for (category of categories; track category._id) {
            <p>{{ category.name }}</p>
          }
        </article>

        <article class="card">
          <h3>Users</h3>
          @for (user of users; track user._id) {
            <p>{{ user.name }} ({{ user.role }})</p>
          }
        </article>
      </div>
    </section>
  `
})
export class AdminDashboardComponent {
  categories: Array<{ _id: string; name: string }> = [];
  users: Array<{ _id: string; name: string; role: string }> = [];
  newCategory = '';

  constructor(private readonly api: ApiService) {
    this.refresh();
  }

  refresh() {
    this.api.get<Array<{ _id: string; name: string }>>('/admin/categories').subscribe((response) => {
      this.categories = response;
    });

    this.api.get<Array<{ _id: string; name: string; role: string }>>('/admin/users').subscribe((response) => {
      this.users = response;
    });
  }

  createCategory() {
    if (!this.newCategory.trim()) return;
    this.api.post('/admin/categories', { name: this.newCategory.trim() }).subscribe(() => {
      this.newCategory = '';
      this.refresh();
    });
  }
}
