import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { handleError } from './services.utils';

@Injectable()
export class UserService {
  private usersUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/users`).pipe(catchError(handleError));
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/users/${userId}`).pipe(catchError(handleError));
  }

  save(user: User): Observable<User> {
    if (user.id) {
      return this.update(user);
    }
    return this.create(user);
  }

  private create(user: User): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/users`, user).pipe(catchError(handleError));
  }

  private update(user: User): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/users/${user.id}`, user).pipe(catchError(handleError));
  }

  delete(user: User): Observable<User[]> {
    return this.http.delete<User[]>(`${this.usersUrl}/users/${user.id}`).pipe(catchError(handleError));
  }
}
