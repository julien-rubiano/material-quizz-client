import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { handleError } from './services.utils';
import { HttpDeleteResponse } from '../models/http.model';

@Injectable()
export class UserService {
  private usersUrl = 'http://localhost/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/read.php`).pipe(catchError(handleError<User[]>('getAllUsers')));
  }

  getUserById(userId: number): Observable<User> {
    return this.http
      .get<User>(`${this.usersUrl}/read-single.php?id=${userId}`)
      .pipe(catchError(handleError<User>('getUserById')));
  }

  save(user: User): Observable<User> {
    if (user.id) {
      return this.update(user);
    }
    return this.create(user);
  }

  private create(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.usersUrl}/create.php`, JSON.stringify(user))
      .pipe(catchError(handleError<User>('create')));
  }

  private update(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.usersUrl}/update.php`, JSON.stringify(user))
      .pipe(catchError(handleError<User>('update')));
  }

  delete(user: User): Observable<HttpDeleteResponse> {
    return this.http
      .post<HttpDeleteResponse>(`${this.usersUrl}/delete.php`, JSON.stringify(user))
      .pipe(catchError(handleError<HttpDeleteResponse>('delete')));
  }
}
