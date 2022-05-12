import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Question } from '../models/quizz.model';
import { handleError } from './services.utils';

@Injectable()
export class QuestionService {
  private questionUrl = 'https://soat-agile.000webhostapp.com/api/questions';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.questionUrl}/read.php`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  getQuestionsByQuizzId(quizzId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.questionUrl}/read-by-quizz.php?id=${quizzId}`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  save(question: Question): Observable<Question> {
    if (question.id) {
      return this.update(question);
    }
    return this.create(question);
  }

  private create(question: Question): Observable<Question> {
    return this.http
      .post<Question>(`${this.questionUrl}/create.php`, JSON.stringify(question))
      .pipe(catchError(handleError));
  }

  private update(question: Question): Observable<Question> {
    return this.http
      .post<Question>(`${this.questionUrl}/update.php`, JSON.stringify(question))
      .pipe(catchError(handleError));
  }

  delete(question: Question): Observable<Question> {
    return this.http
      .post<Question>(`${this.questionUrl}/delete.php`, JSON.stringify(question))
      .pipe(catchError(handleError));
  }
}
