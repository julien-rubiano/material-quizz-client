import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let userService: UserService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  userService = new UserService(httpClientSpy);
});

it('getAllUsers should return expected answers', (done: DoneFn) => {
  const expectedUsers: User[] = [
    { id: 1, firstName: 'Julien', lastName: 'Rubiano', login: 'jrubiano', password: 'jrubiano', isAdmin: true },
  ];

  httpClientSpy.get.and.returnValue(of(expectedUsers));

  userService.getAllUsers().subscribe({
    next: (response) => {
      expect(response).withContext('expected users').toEqual(expectedUsers);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('getUserById should return expected user', (done: DoneFn) => {
  const expectedUser: User = {
    id: 1,
    firstName: 'Julien',
    lastName: 'Rubiano',
    login: 'jrubiano',
    password: 'jrubiano',
    isAdmin: true,
  };
  httpClientSpy.get.and.returnValue(of(expectedUser));

  userService.getUserById(1).subscribe({
    next: (response) => {
      expect(response).withContext('expected answers').toEqual(expectedUser);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
});

it('save user without id should create a new user ands return it', (done: DoneFn) => {
  const user: User = {
    firstName: 'Julien',
    lastName: 'Rubiano',
    login: 'jrubiano',
    password: 'jrubiano',
    isAdmin: true,
  };
  const newUser: User = {
    id: 1,
    firstName: 'Julien',
    lastName: 'Rubiano',
    login: 'jrubiano',
    password: 'jrubiano',
    isAdmin: true,
  };
  httpClientSpy.post.and.returnValue(of(newUser));

  userService.save(user).subscribe({
    next: (response) => {
      expect(response).withContext('expected user').toEqual(newUser);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});

it('save user with id should update corresponding user and return it', (done: DoneFn) => {
  const user: User = {
    id: 1,
    firstName: 'Julien',
    lastName: 'Rubiano',
    login: 'jrubiano',
    password: 'jrubiano',
    isAdmin: true,
  };
  const newUser: User = user;
  httpClientSpy.post.and.returnValue(of(newUser));

  userService.save(user).subscribe({
    next: (response) => {
      expect(response).withContext('expected user').toEqual(newUser);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});

it('delete user should delete the corresponding user and return a message', (done: DoneFn) => {
  const user: User = {
    id: 1,
    firstName: 'Julien',
    lastName: 'Rubiano',
    login: 'jrubiano',
    password: 'jrubiano',
    isAdmin: true,
  };
  const newUser = { message: 'Answer was deleted.' };
  httpClientSpy.post.and.returnValue(of(newUser));

  userService.delete(user).subscribe({
    next: (response) => {
      expect(response).withContext('expected message').toEqual(newUser);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
});
