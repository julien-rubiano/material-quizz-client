import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LocalStorage } from '../models/storage.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let routerSpy: jasmine.SpyObj<Router>;
let authService: AuthService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  authService = new AuthService(httpClientSpy, routerSpy);

  let store: LocalStorage = {};
  const mockLocalStorage = {
    getItem: (key: string): string =>
      '{"id":"c618e0e6-0835-11ed-861d-0242ac120002","firstName":"Admin","lastName":"Admin","login": "admin","password": "admin","isAdmin": true}',
    setItem: (key: string, value: string) =>
      (store.user =
        '{"id":"c618e0e6-0835-11ed-861d-0242ac120002","firstName":"Admin","lastName":"Admin","login": "admin","password": "admin","isAdmin": true}'),
    removeItem: (key: string) => delete store.user,
    clear: () => (store = {}),
  };
  spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
  spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
  spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
});

it('setCurrentUser should store the user in localStorage', () => {
  const user: User = {
    id: 'c618e0e6-0835-11ed-861d-0242ac120002',
    firstName: 'Admin',
    lastName: 'Admin',
    login: 'admin',
    password: 'admin',
    isAdmin: true,
  };
  authService.setCurrentUser(user);
  expect(JSON.parse(localStorage.getItem('user') || '{}') as User).toEqual(user);
});

it('getCurrentUser should return the user from localStorage', () => {
  const user: User = {
    id: 'c618e0e6-0835-11ed-861d-0242ac120002',
    firstName: 'Admin',
    lastName: 'Admin',
    login: 'admin',
    password: 'admin',
    isAdmin: true,
  };
  expect(authService.getCurrentUser()).toEqual(user);
});

it('isCurrentUserAdmin should return true when current user is admin', (done: DoneFn) => {
  httpClientSpy.get.and.returnValue(of(true));

  authService.isCurrentUserAdmin().subscribe({
    next: (response) => {
      expect(response).withContext('expected answers').toEqual(true);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('isCurrentUserAdmin should return false when current user is not admin', (done: DoneFn) => {
  httpClientSpy.get.and.returnValue(of(false));

  authService.isCurrentUserAdmin().subscribe({
    next: (response) => {
      expect(response).withContext('expected answers').toEqual(false);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});
