import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Quizz } from '../models/quizz.model';
import { QuizzService } from './quizz.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let quizzService: QuizzService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  quizzService = new QuizzService(httpClientSpy);
});

it('getAllQuizz should return expected answers', (done: DoneFn) => {
  const expectedQuizz: Quizz[] = [
    {
      id: 1,
      title: 'PSM I - Examen blanc 1',
      description:
        'You can re-visit any question until the time limit expires, but you must answer before proceeding to the next question.\n\nBookmark questions for review by clicking this button located near each question.\n\nClicking See all questions will allow you to see which questions you have bookmarked and navigate to that question or any other answered question for review.\n\nWhen you submit your test or your timer runs out, all answers will be saved even when you have unresolved bookmarks.',
      isRandomQuestions: true,
      duration: 10,
    },
  ];

  httpClientSpy.get.and.returnValue(of(expectedQuizz));

  quizzService.getAllQuizz().subscribe({
    next: (response) => {
      expect(response).withContext('expected quizz').toEqual(expectedQuizz);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('getQuizzById should return expected quizz', (done: DoneFn) => {
  const expectedQuizz: Quizz = {
    id: 1,
    title: 'PSM I - Examen blanc 1',
    description:
      'You can re-visit any question until the time limit expires, but you must answer before proceeding to the next question.\n\nBookmark questions for review by clicking this button located near each question.\n\nClicking See all questions will allow you to see which questions you have bookmarked and navigate to that question or any other answered question for review.\n\nWhen you submit your test or your timer runs out, all answers will be saved even when you have unresolved bookmarks.',
    isRandomQuestions: true,
    duration: 10,
  };
  httpClientSpy.get.and.returnValue(of(expectedQuizz));

  quizzService.getQuizzById(1).subscribe({
    next: (response) => {
      expect(response).withContext('expected answers').toEqual(expectedQuizz);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('save quizz without id should create a new quizz ands return it', (done: DoneFn) => {
  const quizz: Quizz = {
    title: 'PSM I - Examen blanc 1',
    description:
      'You can re-visit any question until the time limit expires, but you must answer before proceeding to the next question.\n\nBookmark questions for review by clicking this button located near each question.\n\nClicking See all questions will allow you to see which questions you have bookmarked and navigate to that question or any other answered question for review.\n\nWhen you submit your test or your timer runs out, all answers will be saved even when you have unresolved bookmarks.',
    isRandomQuestions: true,
    duration: 10,
  };
  const newQuizz: Quizz = {
    id: 1,
    title: 'PSM I - Examen blanc 1',
    description:
      'You can re-visit any question until the time limit expires, but you must answer before proceeding to the next question.\n\nBookmark questions for review by clicking this button located near each question.\n\nClicking See all questions will allow you to see which questions you have bookmarked and navigate to that question or any other answered question for review.\n\nWhen you submit your test or your timer runs out, all answers will be saved even when you have unresolved bookmarks.',
    isRandomQuestions: true,
    duration: 10,
  };
  httpClientSpy.post.and.returnValue(of(newQuizz));

  quizzService.save(quizz).subscribe({
    next: (response) => {
      expect(response).withContext('expected quizz').toEqual(newQuizz);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});

it('save quizz with id should update corresponding quizz and return it', (done: DoneFn) => {
  const quizz: Quizz = {
    id: 1,
    title: 'PSM I - Examen blanc 1',
    description:
      'You can re-visit any question until the time limit expires, but you must answer before proceeding to the next question.\n\nBookmark questions for review by clicking this button located near each question.\n\nClicking See all questions will allow you to see which questions you have bookmarked and navigate to that question or any other answered question for review.\n\nWhen you submit your test or your timer runs out, all answers will be saved even when you have unresolved bookmarks.',
    isRandomQuestions: true,
    duration: 10,
  };
  const newQuizz: Quizz = quizz;
  httpClientSpy.post.and.returnValue(of(newQuizz));

  quizzService.save(quizz).subscribe({
    next: (response) => {
      expect(response).withContext('expected quizz').toEqual(newQuizz);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});

it('delete quizz should delete the corresponding quizz and return a message', (done: DoneFn) => {
  const quizz: Quizz = {
    id: 1,
    title: 'PSM I - Examen blanc 1',
    description:
      'You can re-visit any question until the time limit expires, but you must answer before proceeding to the next question.\n\nBookmark questions for review by clicking this button located near each question.\n\nClicking See all questions will allow you to see which questions you have bookmarked and navigate to that question or any other answered question for review.\n\nWhen you submit your test or your timer runs out, all answers will be saved even when you have unresolved bookmarks.',
    isRandomQuestions: true,
    duration: 10,
  };
  const newQuizz = { message: 'Answer was deleted.' };
  httpClientSpy.post.and.returnValue(of(newQuizz));

  quizzService.delete(quizz).subscribe({
    next: (response) => {
      expect(response).withContext('expected message').toEqual(newQuizz);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});
