import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Answer } from '../models/quizz.model';
import { handleError } from './services.utils';

@Injectable()
export class AnswerService {
  private answerUrl = 'https://soat-agile.000webhostapp.com/api/answers';

  constructor(private http: HttpClient) {}

  getAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.answerUrl}/read.php`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  getAnswersByQuestionId(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.answerUrl}/read-by-question.php?id=${questionId}`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  getAnswersByQuizzId(quizzId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.answerUrl}/read-by-quizz.php?id=${quizzId}`).pipe(
      map((data) => data),
      catchError(handleError)
    );
  }

  save(answer: Answer): Observable<Answer> {
    if (answer.id) {
      return this.update(answer);
    }
    return this.create(answer);
  }

  private create(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.answerUrl}/create.php`, JSON.stringify(answer)).pipe(catchError(handleError));
  }

  private update(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.answerUrl}/update.php`, JSON.stringify(answer)).pipe(catchError(handleError));
  }

  delete(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.answerUrl}/delete.php`, JSON.stringify(answer)).pipe(catchError(handleError));
  }
}
