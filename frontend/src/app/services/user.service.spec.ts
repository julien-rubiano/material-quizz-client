import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let userService: UserService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  userService = new UserService(httpClientSpy);
});

it('getAllUsers should return expected answers', (done: DoneFn) => {
  const expectedUsers: User[] = [
    {
      id: 'c618e0e6-0835-11ed-861d-0242ac120002',
      firstName: 'Admin',
      lastName: 'Admin',
      login: 'admin',
      password: 'admin',
      isAdmin: true,
    },
    {
      id: '217da3b0-083e-11ed-b966-27ade4cfc250',
      firstName: 'Mark',
      lastName: 'Zuckerberg',
      login: 'mzuckerberg',
      password: 'bM@maHcUzjsTFv4',
      isAdmin: false,
    },
    {
      id: 'fea2f380-083e-11ed-943e-b37ae2fdd14b',
      firstName: 'Jeff',
      lastName: 'Bezos',
      login: 'jbezos',
      password: 'bM@maHcUzjsTFv4',
      isAdmin: false,
    },
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
    id: 'c618e0e6-0835-11ed-861d-0242ac120002',
    firstName: 'Admin',
    lastName: 'Admin',
    login: 'admin',
    password: 'admin',
    isAdmin: true,
  };
  httpClientSpy.get.and.returnValue(of(expectedUser));

  userService.getUserById('c618e0e6-0835-11ed-861d-0242ac120002').subscribe({
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
    firstName: 'Admin',
    lastName: 'Admin',
    login: 'admin',
    password: 'admin',
    isAdmin: true,
  };
  const newUser: User = {
    id: 'c618e0e6-0835-11ed-861d-0242ac120002',
    firstName: 'Admin',
    lastName: 'Admin',
    login: 'admin',
    password: 'admin',
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
    id: 'c618e0e6-0835-11ed-861d-0242ac120002',
    firstName: 'Admin',
    lastName: 'Admin',
    login: 'admin',
    password: 'admin',
    isAdmin: true,
  };
  const newUser: User = user;
  httpClientSpy.put.and.returnValue(of(newUser));

  userService.save(user).subscribe({
    next: (response) => {
      expect(response).withContext('expected user').toEqual(newUser);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.put.calls.count()).withContext('one call').toBe(1);
});

it('delete user should delete the corresponding user and return other users', (done: DoneFn) => {
  const user: User = {
    id: 'c618e0e6-0835-11ed-861d-0242ac120002',
    firstName: 'Admin',
    lastName: 'Admin',
    login: 'admin',
    password: 'admin',
    isAdmin: true,
  };
  const expectedResponse = [
    {
      id: '1e7ac750-0867-11ed-848f-2f7d7bb4d86d',
      firstName: 'Marillyn',
      lastName: 'Hewson',
      login: 'mhewson',
      password: 'bM@maHcUzjsTFv4',
      isAdmin: false,
    },
    {
      id: '2e4c4f00-0867-11ed-b88a-ffbce39bfaf8',
      firstName: 'Satya',
      lastName: 'Nadella',
      login: 'snadella',
      password: 'bM@maHcUzjsTFv4',
      isAdmin: false,
    },
    {
      id: '344cb750-0867-11ed-9bba-173884e85a83',
      firstName: 'Bill',
      lastName: 'Gates',
      login: 'bgates',
      password: 'bM@maHcUzjsTFv4',
      isAdmin: false,
    },
  ];
  httpClientSpy.delete.and.returnValue(of(expectedResponse));

  userService.delete(user).subscribe({
    next: (response) => {
      expect(response).withContext('expected response').toEqual(expectedResponse);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.delete.calls.count()).withContext('one call').toBe(1);
});
