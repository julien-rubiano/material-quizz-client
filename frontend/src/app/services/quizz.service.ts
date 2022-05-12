import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Quizz } from '../models/quizz.model';
import { handleError } from './services.utils';

@Injectable()
export class QuizzService {
  private quizzUrl = 'https://soat-agile.000webhostapp.com/api/quizz';

  constructor(private http: HttpClient) {}

  getQuizz(): Observable<Quizz[]> {
    return this.http.get<Quizz[]>(`${this.quizzUrl}/read.php`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  getQuizzById(id: number): Observable<Quizz> {
    return this.http.get<Quizz>(`${this.quizzUrl}/read-single.php?id=${id}`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  save(quizz: Quizz): Observable<Quizz> {
    if (quizz.id) {
      return this.update(quizz);
    }
    return this.create(quizz);
  }

  private create(quizz: Quizz): Observable<Quizz> {
    return this.http.post<Quizz>(`${this.quizzUrl}/create.php`, JSON.stringify(quizz)).pipe(catchError(handleError));
  }

  private update(quizz: Quizz): Observable<Quizz> {
    return this.http.post<Quizz>(`${this.quizzUrl}/update.php`, JSON.stringify(quizz)).pipe(catchError(handleError));
  }

  delete(quizz: Quizz): Observable<Quizz> {
    return this.http.post<Quizz>(`${this.quizzUrl}/delete.php`, JSON.stringify(quizz)).pipe(catchError(handleError));
  }
}
