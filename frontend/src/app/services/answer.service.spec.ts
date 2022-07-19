import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Answer } from '../models/quizz.model';
import { AnswerService } from './answer.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let answerService: AnswerService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  answerService = new AnswerService(httpClientSpy);
});

it('getAllAnswers should return expected answers', (done: DoneFn) => {
  const expectedAnswers: Answer[] = [
    { id: 32, title: 'True', questionId: 82, quizzId: 1, isValid: true },
    { id: 33, title: 'False', questionId: 82, quizzId: 1, isValid: false },
    { id: 34, title: 'True', questionId: 83, quizzId: 1, isValid: true },
    { id: 35, title: 'False', questionId: 83, quizzId: 1, isValid: false },
    { id: 36, title: 'True', questionId: 84, quizzId: 1, isValid: true },
    { id: 37, title: 'False', questionId: 84, quizzId: 1, isValid: false },
    { id: 38, title: 'True', questionId: 85, quizzId: 1, isValid: true },
    { id: 39, title: 'False', questionId: 85, quizzId: 1, isValid: false },
    { id: 40, title: 'True', questionId: 86, quizzId: 1, isValid: true },
  ];

  httpClientSpy.get.and.returnValue(of(expectedAnswers));

  answerService.getAllAnswers().subscribe({
    next: (response) => {
      expect(response).withContext('expected answers').toEqual(expectedAnswers);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('getAnswersByQuestionId should return expected answers corresponding to the given question', (done: DoneFn) => {
  const expectedAnswers: Answer[] = [
    { id: 32, title: 'True', questionId: 82, quizzId: 1, isValid: true },
    { id: 33, title: 'False', questionId: 82, quizzId: 1, isValid: false },
  ];
  httpClientSpy.get.and.returnValue(of(expectedAnswers));

  answerService.getAnswersByQuestionId(82).subscribe({
    next: (response) => {
      expect(response).withContext('expected answers').toEqual(expectedAnswers);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('getAnswersByQuizzId should return expected answers corresponding to the given quizz', (done: DoneFn) => {
  const expectedAnswers: Answer[] = [
    { id: 32, title: 'True', questionId: 82, quizzId: 1, isValid: true },
    { id: 33, title: 'False', questionId: 82, quizzId: 1, isValid: false },
  ];
  httpClientSpy.get.and.returnValue(of(expectedAnswers));

  answerService.getAnswersByQuizzId(1).subscribe({
    next: (response) => {
      expect(response).withContext('expected answers').toEqual(expectedAnswers);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('save answer without id should create a new answer ands return it', (done: DoneFn) => {
  const answer: Answer = { title: 'True', questionId: 82, quizzId: 1, isValid: true };
  const newAnswer: Answer = { id: 32, title: 'True', questionId: 82, quizzId: 1, isValid: true };
  httpClientSpy.post.and.returnValue(of(newAnswer));

  answerService.save(answer).subscribe({
    next: (response) => {
      expect(response).withContext('expected answer').toEqual(newAnswer);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});

it('save answer with id should update corresponding answer and return it', (done: DoneFn) => {
  const answer: Answer = { id: 32, title: 'True', questionId: 82, quizzId: 1, isValid: true };
  const newAnswer: Answer = answer;
  httpClientSpy.post.and.returnValue(of(newAnswer));

  answerService.save(answer).subscribe({
    next: (response) => {
      expect(response).withContext('expected answer').toEqual(newAnswer);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});

it('delete answer should delete the corresponding answer and return a message', (done: DoneFn) => {
  const answer: Answer = { id: 32, title: 'True', questionId: 82, quizzId: 1, isValid: true };
  const newAnswer = { message: 'Answer was deleted.' };
  httpClientSpy.post.and.returnValue(of(newAnswer));

  answerService.delete(answer).subscribe({
    next: (response) => {
      expect(response).withContext('expected message').toEqual(newAnswer);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});
