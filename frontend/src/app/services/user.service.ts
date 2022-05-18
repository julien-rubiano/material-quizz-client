import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { handleError } from './services.utils';

@Injectable()
export class UserService {
  private usersUrl = 'http://localhost/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/read.php`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/read-single.php?id=${userId}`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  save(user: User): Observable<User> {
    if (user.id) {
      return this.update(user);
    }
    return this.create(user);
  }

  private create(user: User): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/create.php`, JSON.stringify(user)).pipe(catchError(handleError));
  }

  private update(user: User): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/update.php`, JSON.stringify(user)).pipe(catchError(handleError));
  }

  delete(user: User): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/delete.php`, JSON.stringify(user)).pipe(catchError(handleError));
  }
}
