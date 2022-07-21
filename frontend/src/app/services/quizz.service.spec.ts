import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Quizz } from '../models/quizz.model';
import { QuizzService } from './quizz.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let quizzService: QuizzService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  quizzService = new QuizzService(httpClientSpy);
});

it('getAllQuizz should return expected quizzes', (done: DoneFn) => {
  const expectedQuizz: Quizz[] = [
    {
      id: 'c08349be-0835-11ed-861d-0242ac120002',
      title: 'Quizz numéro 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at erat maximus, suscipit erat sit amet, rhoncus turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed hendrerit sapien diam, eget varius augue blandit at. Aenean nec purus leo. Mauris gravida hendrerit lorem, ut convallis mauris vulputate id. \n\nQuisque vestibulum, odio at dignissim fermentum, nulla lorem sodales tortor, vitae aliquet urna nibh quis lectus. Nunc gravida non velit a consectetur. Fusce mattis quam eget ipsum ullamcorper efficitur. Pellentesque suscipit sapien leo, quis pretium tortor vestibulum id. \n\nNam nunc velit, imperdiet egestas ligula ultricies, tempor consequat ligula. Aliquam mollis, nisl quis tincidunt vestibulum, lacus ante lacinia turpis, nec consequat erat magna sit amet ante. Mauris blandit quam in cursus aliquet. \n\nUt sed nunc at augue aliquet egestas. Nullam finibus nisl eu condimentum blandit. Etiam efficitur tellus vitae mattis ultrices.',
      isRandomQuestions: true,
      duration: 25,
      questions: [
        {
          id: 'ba7d9ca4-0835-11ed-861d-0242ac120002',
          title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
          isRandomAnswers: true,
          answers: [
            {
              id: 'ada66cea-0835-11ed-861d-0242ac120002',
              title: 'Duis at erat maximus, suscipit erat sit amet',
              isValid: true,
            },
            {
              id: 'b263f61c-0835-11ed-861d-0242ac120002',
              title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae',
              isValid: false,
            },
          ],
        },
        {
          id: 'b551eea0-0868-11ed-a2e9-49d03053f4c1',
          title:
            'Aliquam dui dui, pulvinar eget enim vel, luctus rhoncus nisi. Integer rhoncus vulputate mi nec imperdiet ?',
          isRandomAnswers: false,
          answers: [
            {
              id: 'b58385f0-0868-11ed-8252-d93ca655a502',
              title: 'Nulla at dolor ac mauris vehicula scelerisque',
              isValid: true,
            },
            {
              id: 'cd4d9c70-0868-11ed-97b5-95a8aa93e9f1',
              title: 'In mauris elit, condimentum vel commodo eget, porta non eros',
              isValid: true,
            },
          ],
        },
      ],
    },
  ];

  httpClientSpy.get.and.returnValue(of(expectedQuizz));

  quizzService.getAllQuizzes().subscribe({
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
    id: 'c08349be-0835-11ed-861d-0242ac120002',
    title: 'Quizz numéro 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at erat maximus, suscipit erat sit amet, rhoncus turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed hendrerit sapien diam, eget varius augue blandit at. Aenean nec purus leo. Mauris gravida hendrerit lorem, ut convallis mauris vulputate id. \n\nQuisque vestibulum, odio at dignissim fermentum, nulla lorem sodales tortor, vitae aliquet urna nibh quis lectus. Nunc gravida non velit a consectetur. Fusce mattis quam eget ipsum ullamcorper efficitur. Pellentesque suscipit sapien leo, quis pretium tortor vestibulum id. \n\nNam nunc velit, imperdiet egestas ligula ultricies, tempor consequat ligula. Aliquam mollis, nisl quis tincidunt vestibulum, lacus ante lacinia turpis, nec consequat erat magna sit amet ante. Mauris blandit quam in cursus aliquet. \n\nUt sed nunc at augue aliquet egestas. Nullam finibus nisl eu condimentum blandit. Etiam efficitur tellus vitae mattis ultrices.',
    isRandomQuestions: true,
    duration: 25,
    questions: [
      {
        id: 'ba7d9ca4-0835-11ed-861d-0242ac120002',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        isRandomAnswers: true,
        answers: [
          {
            id: 'ada66cea-0835-11ed-861d-0242ac120002',
            title: 'Duis at erat maximus, suscipit erat sit amet',
            isValid: true,
          },
          {
            id: 'b263f61c-0835-11ed-861d-0242ac120002',
            title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae',
            isValid: false,
          },
        ],
      },
      {
        id: 'b551eea0-0868-11ed-a2e9-49d03053f4c1',
        title:
          'Aliquam dui dui, pulvinar eget enim vel, luctus rhoncus nisi. Integer rhoncus vulputate mi nec imperdiet ?',
        isRandomAnswers: false,
        answers: [
          {
            id: 'b58385f0-0868-11ed-8252-d93ca655a502',
            title: 'Nulla at dolor ac mauris vehicula scelerisque',
            isValid: true,
          },
          {
            id: 'cd4d9c70-0868-11ed-97b5-95a8aa93e9f1',
            title: 'In mauris elit, condimentum vel commodo eget, porta non eros',
            isValid: true,
          },
        ],
      },
    ],
  };
  httpClientSpy.get.and.returnValue(of(expectedQuizz));

  quizzService.getQuizzById('c08349be-0835-11ed-861d-0242ac120002').subscribe({
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
    title: 'Quizz numéro 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at erat maximus, suscipit erat sit amet, rhoncus turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed hendrerit sapien diam, eget varius augue blandit at. Aenean nec purus leo. Mauris gravida hendrerit lorem, ut convallis mauris vulputate id. \n\nQuisque vestibulum, odio at dignissim fermentum, nulla lorem sodales tortor, vitae aliquet urna nibh quis lectus. Nunc gravida non velit a consectetur. Fusce mattis quam eget ipsum ullamcorper efficitur. Pellentesque suscipit sapien leo, quis pretium tortor vestibulum id. \n\nNam nunc velit, imperdiet egestas ligula ultricies, tempor consequat ligula. Aliquam mollis, nisl quis tincidunt vestibulum, lacus ante lacinia turpis, nec consequat erat magna sit amet ante. Mauris blandit quam in cursus aliquet. \n\nUt sed nunc at augue aliquet egestas. Nullam finibus nisl eu condimentum blandit. Etiam efficitur tellus vitae mattis ultrices.',
    isRandomQuestions: true,
    duration: 25,
    questions: [
      {
        id: 'ba7d9ca4-0835-11ed-861d-0242ac120002',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        isRandomAnswers: true,
        answers: [
          {
            id: 'ada66cea-0835-11ed-861d-0242ac120002',
            title: 'Duis at erat maximus, suscipit erat sit amet',
            isValid: true,
          },
          {
            id: 'b263f61c-0835-11ed-861d-0242ac120002',
            title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae',
            isValid: false,
          },
        ],
      },
      {
        id: 'b551eea0-0868-11ed-a2e9-49d03053f4c1',
        title:
          'Aliquam dui dui, pulvinar eget enim vel, luctus rhoncus nisi. Integer rhoncus vulputate mi nec imperdiet ?',
        isRandomAnswers: false,
        answers: [
          {
            id: 'b58385f0-0868-11ed-8252-d93ca655a502',
            title: 'Nulla at dolor ac mauris vehicula scelerisque',
            isValid: true,
          },
          {
            id: 'cd4d9c70-0868-11ed-97b5-95a8aa93e9f1',
            title: 'In mauris elit, condimentum vel commodo eget, porta non eros',
            isValid: true,
          },
        ],
      },
    ],
  };
  const newQuizz: Quizz = {
    id: 'c08349be-0835-11ed-861d-0242ac120002',
    title: 'Quizz numéro 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at erat maximus, suscipit erat sit amet, rhoncus turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed hendrerit sapien diam, eget varius augue blandit at. Aenean nec purus leo. Mauris gravida hendrerit lorem, ut convallis mauris vulputate id. \n\nQuisque vestibulum, odio at dignissim fermentum, nulla lorem sodales tortor, vitae aliquet urna nibh quis lectus. Nunc gravida non velit a consectetur. Fusce mattis quam eget ipsum ullamcorper efficitur. Pellentesque suscipit sapien leo, quis pretium tortor vestibulum id. \n\nNam nunc velit, imperdiet egestas ligula ultricies, tempor consequat ligula. Aliquam mollis, nisl quis tincidunt vestibulum, lacus ante lacinia turpis, nec consequat erat magna sit amet ante. Mauris blandit quam in cursus aliquet. \n\nUt sed nunc at augue aliquet egestas. Nullam finibus nisl eu condimentum blandit. Etiam efficitur tellus vitae mattis ultrices.',
    isRandomQuestions: true,
    duration: 25,
    questions: [
      {
        id: 'ba7d9ca4-0835-11ed-861d-0242ac120002',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        isRandomAnswers: true,
        answers: [
          {
            id: 'ada66cea-0835-11ed-861d-0242ac120002',
            title: 'Duis at erat maximus, suscipit erat sit amet',
            isValid: true,
          },
          {
            id: 'b263f61c-0835-11ed-861d-0242ac120002',
            title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae',
            isValid: false,
          },
        ],
      },
      {
        id: 'b551eea0-0868-11ed-a2e9-49d03053f4c1',
        title:
          'Aliquam dui dui, pulvinar eget enim vel, luctus rhoncus nisi. Integer rhoncus vulputate mi nec imperdiet ?',
        isRandomAnswers: false,
        answers: [
          {
            id: 'b58385f0-0868-11ed-8252-d93ca655a502',
            title: 'Nulla at dolor ac mauris vehicula scelerisque',
            isValid: true,
          },
          {
            id: 'cd4d9c70-0868-11ed-97b5-95a8aa93e9f1',
            title: 'In mauris elit, condimentum vel commodo eget, porta non eros',
            isValid: true,
          },
        ],
      },
    ],
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
    id: 'c08349be-0835-11ed-861d-0242ac120002',
    title: 'Quizz numéro 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at erat maximus, suscipit erat sit amet, rhoncus turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed hendrerit sapien diam, eget varius augue blandit at. Aenean nec purus leo. Mauris gravida hendrerit lorem, ut convallis mauris vulputate id. \n\nQuisque vestibulum, odio at dignissim fermentum, nulla lorem sodales tortor, vitae aliquet urna nibh quis lectus. Nunc gravida non velit a consectetur. Fusce mattis quam eget ipsum ullamcorper efficitur. Pellentesque suscipit sapien leo, quis pretium tortor vestibulum id. \n\nNam nunc velit, imperdiet egestas ligula ultricies, tempor consequat ligula. Aliquam mollis, nisl quis tincidunt vestibulum, lacus ante lacinia turpis, nec consequat erat magna sit amet ante. Mauris blandit quam in cursus aliquet. \n\nUt sed nunc at augue aliquet egestas. Nullam finibus nisl eu condimentum blandit. Etiam efficitur tellus vitae mattis ultrices.',
    isRandomQuestions: true,
    duration: 25,
    questions: [
      {
        id: 'ba7d9ca4-0835-11ed-861d-0242ac120002',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        isRandomAnswers: true,
        answers: [
          {
            id: 'ada66cea-0835-11ed-861d-0242ac120002',
            title: 'Duis at erat maximus, suscipit erat sit amet',
            isValid: true,
          },
          {
            id: 'b263f61c-0835-11ed-861d-0242ac120002',
            title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae',
            isValid: false,
          },
        ],
      },
      {
        id: 'b551eea0-0868-11ed-a2e9-49d03053f4c1',
        title:
          'Aliquam dui dui, pulvinar eget enim vel, luctus rhoncus nisi. Integer rhoncus vulputate mi nec imperdiet ?',
        isRandomAnswers: false,
        answers: [
          {
            id: 'b58385f0-0868-11ed-8252-d93ca655a502',
            title: 'Nulla at dolor ac mauris vehicula scelerisque',
            isValid: true,
          },
          {
            id: 'cd4d9c70-0868-11ed-97b5-95a8aa93e9f1',
            title: 'In mauris elit, condimentum vel commodo eget, porta non eros',
            isValid: true,
          },
        ],
      },
    ],
  };
  const newQuizz: Quizz = quizz;
  httpClientSpy.put.and.returnValue(of(newQuizz));

  quizzService.save(quizz).subscribe({
    next: (response) => {
      expect(response).withContext('expected quizz').toEqual(newQuizz);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.put.calls.count()).withContext('one call').toBe(1);
});

it('delete quizz should delete the corresponding quizz and return others quizzes', (done: DoneFn) => {
  const quizz: Quizz = {
    id: 'c08349be-0835-11ed-861d-0242ac120002',
    title: 'Quizz numéro 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at erat maximus, suscipit erat sit amet, rhoncus turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed hendrerit sapien diam, eget varius augue blandit at. Aenean nec purus leo. Mauris gravida hendrerit lorem, ut convallis mauris vulputate id. \n\nQuisque vestibulum, odio at dignissim fermentum, nulla lorem sodales tortor, vitae aliquet urna nibh quis lectus. Nunc gravida non velit a consectetur. Fusce mattis quam eget ipsum ullamcorper efficitur. Pellentesque suscipit sapien leo, quis pretium tortor vestibulum id. \n\nNam nunc velit, imperdiet egestas ligula ultricies, tempor consequat ligula. Aliquam mollis, nisl quis tincidunt vestibulum, lacus ante lacinia turpis, nec consequat erat magna sit amet ante. Mauris blandit quam in cursus aliquet. \n\nUt sed nunc at augue aliquet egestas. Nullam finibus nisl eu condimentum blandit. Etiam efficitur tellus vitae mattis ultrices.',
    isRandomQuestions: true,
    duration: 25,
    questions: [
      {
        id: 'ba7d9ca4-0835-11ed-861d-0242ac120002',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        isRandomAnswers: true,
        answers: [
          {
            id: 'ada66cea-0835-11ed-861d-0242ac120002',
            title: 'Duis at erat maximus, suscipit erat sit amet',
            isValid: true,
          },
          {
            id: 'b263f61c-0835-11ed-861d-0242ac120002',
            title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae',
            isValid: false,
          },
        ],
      },
      {
        id: 'b551eea0-0868-11ed-a2e9-49d03053f4c1',
        title:
          'Aliquam dui dui, pulvinar eget enim vel, luctus rhoncus nisi. Integer rhoncus vulputate mi nec imperdiet ?',
        isRandomAnswers: false,
        answers: [
          {
            id: 'b58385f0-0868-11ed-8252-d93ca655a502',
            title: 'Nulla at dolor ac mauris vehicula scelerisque',
            isValid: true,
          },
          {
            id: 'cd4d9c70-0868-11ed-97b5-95a8aa93e9f1',
            title: 'In mauris elit, condimentum vel commodo eget, porta non eros',
            isValid: true,
          },
        ],
      },
    ],
  };
  const expectedResponse = [
    {
      id: '08e628ec-0869-11ed-861d-0242ac120002',
      title: 'Quizz numéro 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at erat maximus, suscipit erat sit amet, rhoncus turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed hendrerit sapien diam, eget varius augue blandit at. Aenean nec purus leo. Mauris gravida hendrerit lorem, ut convallis mauris vulputate id. \n\nQuisque vestibulum, odio at dignissim fermentum, nulla lorem sodales tortor, vitae aliquet urna nibh quis lectus. Nunc gravida non velit a consectetur. Fusce mattis quam eget ipsum ullamcorper efficitur. Pellentesque suscipit sapien leo, quis pretium tortor vestibulum id. \n\nNam nunc velit, imperdiet egestas ligula ultricies, tempor consequat ligula. Aliquam mollis, nisl quis tincidunt vestibulum, lacus ante lacinia turpis, nec consequat erat magna sit amet ante. Mauris blandit quam in cursus aliquet. \n\nUt sed nunc at augue aliquet egestas. Nullam finibus nisl eu condimentum blandit. Etiam efficitur tellus vitae mattis ultrices.',
      isRandomQuestions: true,
      duration: 25,
      questions: [
        {
          id: 'ba7d9ca4-0835-11ed-861d-0242ac120002',
          title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
          isRandomAnswers: true,
          answers: [
            {
              id: 'ada66cea-0835-11ed-861d-0242ac120002',
              title: 'Duis at erat maximus, suscipit erat sit amet',
              isValid: true,
            },
            {
              id: 'b263f61c-0835-11ed-861d-0242ac120002',
              title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae',
              isValid: false,
            },
          ],
        },
        {
          id: 'b551eea0-0868-11ed-a2e9-49d03053f4c1',
          title:
            'Aliquam dui dui, pulvinar eget enim vel, luctus rhoncus nisi. Integer rhoncus vulputate mi nec imperdiet ?',
          isRandomAnswers: false,
          answers: [
            {
              id: 'b58385f0-0868-11ed-8252-d93ca655a502',
              title: 'Nulla at dolor ac mauris vehicula scelerisque',
              isValid: true,
            },
            {
              id: 'cd4d9c70-0868-11ed-97b5-95a8aa93e9f1',
              title: 'In mauris elit, condimentum vel commodo eget, porta non eros',
              isValid: true,
            },
          ],
        },
      ],
    },
  ];
  httpClientSpy.delete.and.returnValue(of(expectedResponse));

  quizzService.delete(quizz).subscribe({
    next: (response) => {
      expect(response).withContext('expected response').toEqual(expectedResponse);
      done();
    },
    error: done.fail,
  });
  expect(httpClientSpy.delete.calls.count()).withContext('one call').toBe(1);
});
