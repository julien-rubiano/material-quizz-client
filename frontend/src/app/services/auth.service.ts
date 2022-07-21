import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, Credentials } from '../models/user.model';
import { Router } from '@angular/router';
import { handleError } from './services.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersUrl = 'http://localhost:4200/api';
  private storageKey = 'user';

  constructor(private http: HttpClient, private router: Router) {}

  private clear(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.storageKey) != null;
  }

  isCurrentUserAdmin(): Observable<boolean> {
    const currentUser = this.getCurrentUser();
    return this.http.get<boolean>(`${this.usersUrl}/users/${currentUser.id}/isAdmin`).pipe(catchError(handleError));
  }

  login(credentials: Credentials): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/users/auth`, credentials).pipe(catchError(handleError));
  }

  validateLogin(request: Observable<User>): void {
    request.subscribe((user) => {
      this.setCurrentUser(user);
      this.router.navigate(['/']);
    });
  }

  logout(): void {
    this.clear();
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}') as User;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
}
