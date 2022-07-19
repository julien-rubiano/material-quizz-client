import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Question } from '../models/quizz.model';
import { handleError } from './services.utils';
import { HttpDeleteResponse } from '../models/http.model';

@Injectable()
export class QuestionService {
  private questionUrl = 'http://localhost/api/questions';

  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<Question[]> {
    return this.http
      .get<Question[]>(`${this.questionUrl}/read.php`)
      .pipe(catchError(handleError<Question[]>('getAllQuestions')));
  }

  getQuestionsByQuizzId(quizzId: number): Observable<Question[]> {
    return this.http
      .get<Question[]>(`${this.questionUrl}/read-by-quizz.php?id=${quizzId}`)
      .pipe(catchError(handleError<Question[]>('getQuestionsByQuizzId')));
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
      .pipe(catchError(handleError<Question>('create')));
  }

  private update(question: Question): Observable<Question> {
    return this.http
      .post<Question>(`${this.questionUrl}/update.php`, JSON.stringify(question))
      .pipe(catchError(handleError<Question>('update')));
  }

  delete(question: Question): Observable<HttpDeleteResponse> {
    return this.http
      .post<HttpDeleteResponse>(`${this.questionUrl}/delete.php`, JSON.stringify(question))
      .pipe(catchError(handleError<HttpDeleteResponse>('delete')));
  }
}
