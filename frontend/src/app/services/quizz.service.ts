import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Quizz } from '../models/quizz.model';
import { handleError } from './services.utils';
import { HttpDeleteResponse } from '../models/http.model';

@Injectable()
export class QuizzService {
  private quizzUrl = 'http://localhost/api/quizz';

  constructor(private http: HttpClient) {}

  getAllQuizz(): Observable<Quizz[]> {
    return this.http.get<Quizz[]>(`${this.quizzUrl}/read.php`).pipe(catchError(handleError<Quizz[]>('getAllQuizz')));
  }

  getQuizzById(quizzId: number): Observable<Quizz> {
    return this.http
      .get<Quizz>(`${this.quizzUrl}/read-single.php?id=${quizzId}`)
      .pipe(catchError(handleError<Quizz>('getQuizzById')));
  }

  save(quizz: Quizz): Observable<Quizz> {
    if (quizz.id) {
      return this.update(quizz);
    }
    return this.create(quizz);
  }

  private create(quizz: Quizz): Observable<Quizz> {
    return this.http
      .post<Quizz>(`${this.quizzUrl}/create.php`, JSON.stringify(quizz))
      .pipe(catchError(handleError<Quizz>('create')));
  }

  private update(quizz: Quizz): Observable<Quizz> {
    return this.http
      .post<Quizz>(`${this.quizzUrl}/update.php`, JSON.stringify(quizz))
      .pipe(catchError(handleError<Quizz>('update')));
  }

  delete(quizz: Quizz): Observable<HttpDeleteResponse> {
    return this.http
      .post<HttpDeleteResponse>(`${this.quizzUrl}/delete.php`, JSON.stringify(quizz))
      .pipe(catchError(handleError<HttpDeleteResponse>('delete')));
  }
}
