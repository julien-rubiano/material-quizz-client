import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Credentials } from '../models/credentials.model';
import { handleError } from './services.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersUrl = 'https://soat-agile.000webhostapp.com/api/users';
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
    return this.http.get<boolean>(`${this.usersUrl}/is_admin.php?id=${currentUser.id}`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  login(credentials: Credentials): Observable<User> {
    return this.http
      .post<User>(
        `${this.usersUrl}/login.php`,
        JSON.stringify({
          login: credentials.login,
          password: credentials.password,
        })
      )
      .pipe(catchError(handleError));
  }

  validateLogin(request: Observable<User>): void {
    request.subscribe((user) => {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
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
