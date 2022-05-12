import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Answer, Question, Quizz } from 'src/app/models/quizz.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { QuizzService } from 'src/app/services/quizz.service';
import { QuestionService } from 'src/app/services/question.service';
import { AnswerService } from 'src/app/services/answer.service';
import { Observable, forkJoin } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-quizz-edit',
  templateUrl: './quizz-edit.component.html',
  styleUrls: ['./quizz-edit.component.css'],
})
export class QuizzEditComponent implements OnInit {
  isLoading: boolean = false;
  isAdmin = false;
  currentUser!: User;
  quizzForm!: FormGroup;

  constructor(
    private quizzService: QuizzService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '{}');
    this.isLoading = true;
    this.authService.isCurrentUserAdmin().subscribe((result) => (this.isAdmin = result));
    this.initQuizz();
    this.fillQuizz(id);
  }

  /**
   * Initialize the quizz with empty data
   */
  private initQuizz() {
    this.quizzForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      isRandomQuestions: [''],
      questions: this.fb.array([this.newQuestion()]),
    });
    this.questions.removeAt(0);
  }

  /**
   * Fill the quizz with data from database
   */
  private fillQuizz(id: number): void {
    let getQuizz = this.quizzService.getQuizzById(id);
    let getQuestions = this.questionService.getQuestionsByQuizzId(id);
    let getAnswers = this.answerService.getAnswersByQuizzId(id);

    forkJoin([getQuizz, getQuestions, getAnswers]).subscribe((results) => {
      let quizzResponse = results[0];
      let questionsResponse = results[1];
      let answersResponse = results[2];

      //quizz
      this.quizzForm.patchValue({
        id: quizzResponse.id,
        title: quizzResponse.title,
        description: quizzResponse.description,
        isRandomQuestions: quizzResponse.isRandomQuestions,
      });

      // questions and answers
      questionsResponse.forEach((q) => {
        let answersFormArray: FormArray = this.fb.array([this.newAnswer()]);
        answersFormArray.removeAt(0);

        answersResponse
          .filter((a) => a.questionId === q.id)
          .forEach((a) => {
            let answerFormGroup: FormGroup = this.fb.group({
              id: a.id,
              title: a.title,
              position: a.position,
              questionId: a.questionId,
              quizzId: quizzResponse.id,
            });
            answersFormArray.push(answerFormGroup);
          });

        let question: FormGroup = this.fb.group({
          id: q.id,
          title: [q.title, Validators.required],
          isRandomAnswers: [q.isRandomAnswers],
          quizzId: q.quizzId,
          answers: answersFormArray,
        });
        this.questions.push(question);
      });
      this.isLoading = false;
    });
  }

  editQuizzTitle(event: any) {
    this.quizzForm.patchValue({
      title: event.target.value,
    });

    this.saveQuizz(this.quizzForm.value);
  }

  editQuizzDescription(event: any) {
    this.quizzForm.patchValue({
      description: event.target.value,
    });

    this.saveQuizz(this.quizzForm.value);
  }

  editQuizzIsRandomQuestions(event: MatSlideToggleChange) {
    console.log(event.checked);
    this.quizzForm.patchValue({
      isRandomQuestions: event.checked,
    });

    this.saveQuizz(this.quizzForm.value);
  }

  /**
   * Getter for questions as FormArray
   */
  get questions(): FormArray {
    return this.quizzForm.get('questions') as FormArray;
  }

  /**
   * Create a form group for Question
   */
  private newQuestion(): FormGroup {
    return this.fb.group({
      id: [''],
      title: ['', Validators.required],
      isRandomAnswers: [''],
      quizzId: [''],
      answers: this.fb.array([this.newAnswer()]),
    });
  }

  /**
   * Add a question to existing quizz
   */
  addQuestion() {
    this.questions.push(this.newQuestion());
  }

  /**
   * Remove a question from the quizz
   * @param questionIndex - index of the question to be removed
   */
  removeQuestion(questionIndex: number) {
    let questionValue = this.questions.controls[questionIndex].value;
    let question: Question = {
      id: questionValue.id,
      title: questionValue.title,
      quizzId: questionValue.quizzId,
      isRandomAnswers: questionValue.isRandomAnswers,
    };
    this.questionService.delete(question).subscribe(() => this.questions.removeAt(questionIndex));
  }

  editQuestionTitle(event: any, question: AbstractControl) {
    question.patchValue({
      title: event.target.value,
    });

    this.saveQuizz(this.quizzForm.value);
  }

  /**
   * Create a form group for Answer
   */
  private newAnswer(): FormGroup {
    return this.fb.group({
      id: [''],
      title: ['', Validators.required],
      position: [''],
      questionId: [''],
    });
  }

  /**
   * Add answer to the selected question
   * @param questionIndex - index of the question selected
   */
  addAnswer(questionIndex: number) {
    this.getAnswersFormArray(questionIndex).push(this.newAnswer());
  }

  /**
   * Remove an answer from the question
   * @param questionIndex - index of the selected question
   * @param answerIndex - index of answer to delete
   */
  removeAnswer(questionIndex: number, answerIndex: number) {
    let answerValue = this.getAnswersFormArray(questionIndex).controls[answerIndex].value;
    let answer: Answer = {
      id: answerValue.id,
      title: answerValue.title,
      position: answerValue.position,
      questionId: answerValue.questionId,
      quizzId: answerValue.quizzId,
    };
    this.answerService.delete(answer).subscribe(() => this.getAnswersFormArray(questionIndex).removeAt(answerIndex));
  }

  editAnswerTitle(event: any, answer: AbstractControl) {
    answer.patchValue({
      title: event.target.value,
    });

    this.saveQuizz(this.quizzForm.value);
  }

  /**
   * Get answers of a particular index as FormArray
   * @param questionIndex - index of the question
   */
  getAnswersFormArray(questionIndex: number): FormArray {
    return this.questions.controls[questionIndex].get('answers') as FormArray;
  }

  /**
   * Get Form Controls of the answers array
   * @param questionIndex - index of the question
   */
  getAnswerControls(questionIndex: number): AbstractControl[] {
    return this.getAnswersFormArray(questionIndex).controls;
  }

  /**
   * Return to the previous page
   */
  return() {
    this.router.navigate(['/quizz']);
  }

  /**
   * Submit the form
   */
  submit() {
    if (this.quizzForm.status === 'VALID') {
      this.saveQuizz(this.quizzForm.value);
    }
  }

  /**
   * Save the quizz to the database
   */
  private saveQuizz(quizz: Quizz) {
    if (this.quizzForm.status === 'VALID') {
      this.quizzService.save(quizz).subscribe((quizzResponse) => {
        quizz.questions?.forEach((q) => {
          q.quizzId = quizzResponse.id;
          this.questionService.save(q).subscribe((questionResponse) => {
            let answerPosition = 1;
            q.answers?.forEach((a) => {
              a.quizzId = questionResponse.quizzId;
              a.questionId = questionResponse.id;
              a.position = answerPosition;
              this.answerService.save(a).subscribe(() => answerPosition++);
            });
          });
        });
      });
    }
  }
}
