import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Answer } from '../models/quizz.model';
import { handleError } from './services.utils';
import { HttpDeleteResponse } from '../models/http.model';

@Injectable()
export class AnswerService {
  private answerUrl = 'http://localhost/api/answers';

  constructor(private http: HttpClient) {}

  getAllAnswers(): Observable<Answer[]> {
    return this.http
      .get<Answer[]>(`${this.answerUrl}/read.php`)
      .pipe(catchError(handleError<Answer[]>('getAllAnswers')));
  }

  getAnswersByQuestionId(questionId: number): Observable<Answer[]> {
    return this.http
      .get<Answer[]>(`${this.answerUrl}/read-by-question.php?id=${questionId}`)
      .pipe(catchError(handleError<Answer[]>('getAnswersByQuestionId')));
  }

  getAnswersByQuizzId(quizzId: number): Observable<Answer[]> {
    return this.http
      .get<Answer[]>(`${this.answerUrl}/read-by-quizz.php?id=${quizzId}`)
      .pipe(catchError(handleError<Answer[]>('getAnswersByQuizzId')));
  }

  save(answer: Answer): Observable<Answer> {
    if (answer.id) {
      return this.update(answer);
    }
    return this.create(answer);
  }

  private create(answer: Answer): Observable<Answer> {
    return this.http
      .post<Answer>(`${this.answerUrl}/create.php`, JSON.stringify(answer))
      .pipe(catchError(handleError<Answer>('create')));
  }

  private update(answer: Answer): Observable<Answer> {
    return this.http
      .post<Answer>(`${this.answerUrl}/update.php`, JSON.stringify(answer))
      .pipe(catchError(handleError<Answer>('update')));
  }

  delete(answer: Answer): Observable<HttpDeleteResponse> {
    return this.http
      .post<HttpDeleteResponse>(`${this.answerUrl}/delete.php`, JSON.stringify(answer))
      .pipe(catchError(handleError<HttpDeleteResponse>('delete')));
  }
}
