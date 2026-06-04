import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:5000/api';

  constructor(private readonly http: HttpClient) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    const authHeader = token ? 'Bearer ' + token : '';
    return new HttpHeaders(authHeader ? { Authorization: authHeader } : {});
  }

  get<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.headers });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.headers });
  }

  put<T>(path: string, body: unknown) {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.headers });
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, { headers: this.headers });
  }

  delete(path: string) {
    return this.http.delete(`${this.baseUrl}${path}`, { headers: this.headers });
  }
}
