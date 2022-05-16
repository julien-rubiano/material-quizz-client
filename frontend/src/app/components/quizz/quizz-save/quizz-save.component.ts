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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-quizz-save',
  templateUrl: './quizz-save.component.html',
  styleUrls: ['./quizz-save.component.css'],
})
export class QuizzSaveComponent implements OnInit {
  isAdmin = false;
  isEditing = false;
  currentUser!: User;
  quizzForm!: FormGroup;

  constructor(
    private quizzService: QuizzService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const quizzId = parseInt(this.route.snapshot.paramMap.get('id') || '{}');
    this.authService.isCurrentUserAdmin().subscribe((result) => (this.isAdmin = result));
    this.initQuizz();
    if (quizzId) {
      this.isEditing = true;
      this.fillQuizz(quizzId);
    }
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
      duration: ['', Validators.pattern('^[0-9]*$')],
      questions: this.fb.array([this.newQuestion()]),
    });
    this.questions.removeAt(0);
  }

  /**
   * Fill the quizz with data from database
   */
  private fillQuizz(quizzId: number): void {
    let getQuizz = this.quizzService.getQuizzById(quizzId);
    let getQuestions = this.questionService.getQuestionsByQuizzId(quizzId);
    let getAnswers = this.answerService.getAnswersByQuizzId(quizzId);

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
        duration: quizzResponse.duration,
      });

      // questions and answers
      if (questionsResponse?.length > 0) {
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
                isValid: a.isValid,
                questionId: a.questionId,
                quizzId: quizzResponse.id,
              });
              answersFormArray.push(answerFormGroup);
            });

          let questionFormGroup: FormGroup = this.fb.group({
            id: q.id,
            title: [q.title],
            isRandomAnswers: [q.isRandomAnswers],
            quizzId: q.quizzId,
            answers: answersFormArray,
          });
          this.questions.push(questionFormGroup);
        });
      }
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
    this.quizzForm.patchValue({
      isRandomQuestions: event.checked,
    });
    this.saveQuizz(this.quizzForm.value);
  }

  editQuizzDuration(event: MatSliderChange) {
    this.quizzForm.patchValue({
      duration: event.value,
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
      title: [''],
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
    this.saveQuizz(this.quizzForm.value);
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

  editQuestionIsRandomAnswers(event: MatSlideToggleChange, question: AbstractControl) {
    question.patchValue({
      isRandomAnswers: event.checked,
    });

    this.saveQuizz(this.quizzForm.value);
  }

  /**
   * Create a form group for Answer
   */
  private newAnswer(): FormGroup {
    return this.fb.group({
      id: [''],
      title: [''],
      position: [''],
      isValid: [''],
      questionId: [''],
    });
  }

  /**
   * Add answer to the selected question
   * @param questionIndex - index of the question selected
   */
  addAnswer(questionIndex: number) {
    this.getAnswersFormArray(questionIndex).push(this.newAnswer());
    this.saveQuizz(this.quizzForm.value);
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
      isValid: answerValue.isValid,
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

  isAnswerValid(answer: AbstractControl) {
    return answer.value.isValid;
  }

  editAnswerIsValid(answer: AbstractControl) {
    let newValue = !answer.value.isValid;
    answer.patchValue({
      isValid: newValue,
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

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
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
  createQuizz() {
    if (this.quizzForm.status === 'VALID') {
      this.quizzService.save(this.quizzForm.value).subscribe((quizzResponse) => {
        this.snackBar.open('Le quizz a bien été créé, vous passez en mode édition');
        this.router.navigate([`/quizz/edit/${quizzResponse.id}`]);
      });
    }
  }

  /**
   * Save the quizz to the database
   */
  private saveQuizz(quizz: Quizz) {
    if (this.isEditing && this.quizzForm.status === 'VALID') {
      // save quizz
      this.quizzService.save(quizz).subscribe((quizzResponse) => {
        //save questions
        if (!!quizz.questions?.length && quizz.questions?.length > 0) {
          quizz.questions?.forEach((q) => {
            q.quizzId = quizzResponse.id;
            this.questionService.save(q).subscribe((questionResponse) => {
              let questionIndex = this.questions.controls.findIndex((c) => c.value.id === q.id);
              this.questions.at(questionIndex).patchValue({ id: questionResponse.id });

              //save answers
              if (!!q.answers?.length && q.answers?.length > 0) {
                let answerPosition = 1;
                q.answers?.forEach((a) => {
                  a.quizzId = questionResponse.quizzId;
                  a.questionId = questionResponse.id;
                  a.position = answerPosition;
                  this.answerService.save(a).subscribe((answerResponse) => {
                    let answerIndex = this.getAnswersFormArray(questionIndex).controls.findIndex(
                      (c) => c.value.id === a.id
                    );
                    this.getAnswersFormArray(questionIndex).at(answerIndex).patchValue({ id: answerResponse.id });
                    answerPosition++;
                  });
                });
              }
            });
          });
        }
      });
      console.log(this.questions);
    }
  }
}
