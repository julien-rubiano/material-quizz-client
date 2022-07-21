import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Quizz } from '../models/quizz.model';
import { handleError } from './services.utils';

@Injectable()
export class QuizzService {
  private quizzUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient) {}

  getAllQuizzes(): Observable<Quizz[]> {
    return this.http.get<Quizz[]>(`${this.quizzUrl}/quizzes`).pipe(catchError(handleError));
  }

  getQuizzById(quizzId: string): Observable<Quizz> {
    return this.http.get<Quizz>(`${this.quizzUrl}/quizzes/${quizzId}`).pipe(catchError(handleError));
  }

  save(quizz: Quizz): Observable<Quizz> {
    if (quizz.id) {
      return this.update(quizz);
    }
    return this.create(quizz);
  }

  private create(quizz: Quizz): Observable<Quizz> {
    return this.http.post<Quizz>(`${this.quizzUrl}/quizzes`, quizz).pipe(catchError(handleError));
  }

  private update(quizz: Quizz): Observable<Quizz> {
    return this.http.put<Quizz>(`${this.quizzUrl}/quizzes/${quizz.id}`, quizz).pipe(catchError(handleError));
  }

  delete(quizz: Quizz): Observable<Quizz[]> {
    return this.http.delete<Quizz[]>(`${this.quizzUrl}/quizzes/${quizz.id}`).pipe(catchError(handleError));
  }
}
