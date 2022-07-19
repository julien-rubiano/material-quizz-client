import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Question } from '../models/quizz.model';
import { QuestionService } from './question.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let questionService: QuestionService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  questionService = new QuestionService(httpClientSpy);
});

it('getAllQuestions should return expected answers', (done: DoneFn) => {
  const expectedQuestions: Question[] = [
    {
      id: 82,
      title: 'True or False: Cross-functional teams are optimized to work on one component or layer of a system only.',
      quizzId: 1,
      isRandomAnswers: true,
    },
    {
      id: 83,
      title: 'True or False: Cross-functional teams are optimized to work on one component or layer of a system only.',
      quizzId: 1,
      isRandomAnswers: true,
    },
  ];

  httpClientSpy.get.and.returnValue(of(expectedQuestions));

  questionService.getAllQuestions().subscribe({
    next: (response) => {
      expect(response).withContext('expected questions').toEqual(expectedQuestions);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('getQuestionsByQuizzId should return expected questions corresponding to the given quizz', (done: DoneFn) => {
  const expectedQuestions: Question[] = [
    {
      id: 82,
      title: 'True or False: Cross-functional teams are optimized to work on one component or layer of a system only.',
      quizzId: 1,
      isRandomAnswers: true,
    },
    {
      id: 83,
      title: 'True or False: Cross-functional teams are optimized to work on one component or layer of a system only.',
      quizzId: 1,
      isRandomAnswers: true,
    },
  ];
  httpClientSpy.get.and.returnValue(of(expectedQuestions));

  questionService.getQuestionsByQuizzId(1).subscribe({
    next: (response) => {
      expect(response).withContext('expected answers').toEqual(expectedQuestions);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('save question without id should create a new question ands return it', (done: DoneFn) => {
  const question: Question = {
    title: 'True or False: Cross-functional teams are optimized to work on one component or layer of a system only.',
    quizzId: 1,
    isRandomAnswers: true,
  };
  const newQuestion: Question = {
    id: 82,
    title: 'True or False: Cross-functional teams are optimized to work on one component or layer of a system only.',
    quizzId: 1,
    isRandomAnswers: true,
  };
  httpClientSpy.post.and.returnValue(of(newQuestion));

  questionService.save(question).subscribe({
    next: (response) => {
      expect(response).withContext('expected question').toEqual(newQuestion);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});

it('save question with id should update corresponding question and return it', (done: DoneFn) => {
  const question: Question = {
    id: 82,
    title: 'True or False: Cross-functional teams are optimized to work on one component or layer of a system only.',
    quizzId: 1,
    isRandomAnswers: true,
  };
  const newQuestion: Question = question;
  httpClientSpy.post.and.returnValue(of(newQuestion));

  questionService.save(question).subscribe({
    next: (response) => {
      expect(response).withContext('expected question').toEqual(newQuestion);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});

it('delete question should delete the corresponding question and return a message', (done: DoneFn) => {
  const question: Question = {
    id: 82,
    title: 'True or False: Cross-functional teams are optimized to work on one component or layer of a system only.',
    quizzId: 1,
    isRandomAnswers: true,
  };
  const newQuestion = { message: 'Answer was deleted.' };
  httpClientSpy.post.and.returnValue(of(newQuestion));

  questionService.delete(question).subscribe({
    next: (response) => {
      expect(response).withContext('expected message').toEqual(newQuestion);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});
