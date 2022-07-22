import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Answer, Question, Quizz } from 'src/app/models/quizz.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { QuizzService } from 'src/app/services/quizz.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSliderChange } from '@angular/material/slider';
import { v1 as uuid } from 'uuid';

@Component({
  selector: 'app-quizz-save',
  templateUrl: './quizz-save.component.html',
  styleUrls: ['./quizz-save.component.css'],
})
export class QuizzSaveComponent implements OnInit {
  isAdmin: boolean = false;
  isEditing: boolean = false;
  currentUser!: User;
  quizzForm!: FormGroup;

  constructor(
    private quizzService: QuizzService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const quizzId = this.route.snapshot.paramMap.get('id');
    this.authService.isCurrentUserAdmin().subscribe((result) => (this.isAdmin = result));
    this.initQuizz();
    if (quizzId) {
      this.isEditing = true;
      this.fillQuizz(quizzId);
    }
  }

  private initQuizz(): void {
    this.quizzForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      isRandomQuestions: [false],
      duration: [0, Validators.pattern('^[0-9]*$')],
      questions: this.fb.array([]),
    });
  }

  private fillQuizz(quizzId: string): void {
    this.quizzService.getQuizzById(quizzId).subscribe((quizzResponse) => {
      this.quizzForm.patchValue({
        id: quizzResponse.id,
        title: quizzResponse.title,
        description: quizzResponse.description,
        isRandomQuestions: quizzResponse.isRandomQuestions,
        duration: quizzResponse.duration,
      });

      quizzResponse.questions?.forEach((question) => {
        let answersFormArray = this.fb.array([]);
        question.answers?.forEach((answer) => {
          answersFormArray.push(this.fb.group(answer));
        });

        let questionFormGroup: FormGroup = this.fb.group({
          id: question.id,
          title: question.title,
          isRandomAnswers: question.isRandomAnswers,
          answers: answersFormArray,
        });
        this.questions.push(questionFormGroup);
      });
    });
  }

  editQuizzTitle(event: FocusEvent): void {
    this.quizzForm.patchValue({
      title: (event.target as HTMLInputElement).value,
    });
    if (this.isEditing) {
      this.quizzService.save(this.quizzForm.value).subscribe();
    }
  }

  editQuizzDescription(event: FocusEvent): void {
    this.quizzForm.patchValue({
      description: (event.target as HTMLInputElement).value,
    });
    if (this.isEditing) {
      this.quizzService.save(this.quizzForm.value).subscribe();
    }
  }

  editQuizzIsRandomQuestions(event: MatSlideToggleChange): void {
    this.quizzForm.patchValue({
      isRandomQuestions: event.checked,
    });
    if (this.isEditing) {
      this.quizzService.save(this.quizzForm.value).subscribe();
    }
  }

  editQuizzDuration(event: MatSliderChange): void {
    this.quizzForm.patchValue({
      duration: event.value,
    });
    if (this.isEditing) {
      this.quizzService.save(this.quizzForm.value).subscribe();
    }
  }

  get questions(): FormArray {
    return this.quizzForm.get('questions') as FormArray;
  }

  private newQuestion(): FormGroup {
    return this.fb.group({
      id: [uuid()],
      title: [''],
      isRandomAnswers: [false],
      answers: this.fb.array([]),
    });
  }

  addQuestion(): void {
    let newQuestion = this.newQuestion();
    this.questions.push(newQuestion);
    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  duplicateQuestion(questionToDuplicate: AbstractControl): void {
    let answersFormArray = this.fb.array([]);
    questionToDuplicate.value.answers?.forEach((answer: Answer) => {
      answersFormArray.push(this.fb.group(answer));
    });

    let newQuestion: FormGroup = this.fb.group({
      id: questionToDuplicate.value.id,
      title: questionToDuplicate.value.title,
      isRandomAnswers: questionToDuplicate.value.isRandomAnswers,
      answers: answersFormArray,
    });
    this.questions.push(newQuestion);

    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  removeQuestion(questionIndex: number): void {
    this.questions.removeAt(questionIndex);
    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  editQuestionTitle(event: FocusEvent, question: AbstractControl): void {
    question.patchValue({
      title: (event.target as HTMLInputElement).value,
    });
    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  editQuestionIsRandomAnswers(event: MatSlideToggleChange, question: AbstractControl): void {
    question.patchValue({
      isRandomAnswers: event.checked,
    });
    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  private newAnswer(): FormGroup {
    return this.fb.group({
      id: [uuid()],
      title: [''],
      isValid: [false],
    });
  }

  addAnswer(questionIndex: number): void {
    let newAnswer = this.newAnswer();
    let question = this.questions.at(questionIndex);
    (<FormArray>question.get('answers')).push(newAnswer);
    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    this.getAnswersFormArray(questionIndex).removeAt(answerIndex);
    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  editAnswerTitle(event: FocusEvent, answer: AbstractControl): void {
    answer.patchValue({
      title: (event.target as HTMLInputElement).value,
    });
    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  isAnswerValid(answer: AbstractControl): boolean {
    return answer.value.isValid;
  }

  editAnswerIsValid(answer: AbstractControl): void {
    let newValue = !answer.value.isValid;
    answer.patchValue({
      isValid: newValue,
    });
    this.quizzService.save(this.quizzForm.value).subscribe();
  }

  getAnswersFormArray(questionIndex: number): FormArray {
    return this.questions.controls[questionIndex].get('answers') as FormArray;
  }

  getAnswerControls(questionIndex: number): AbstractControl[] {
    return this.getAnswersFormArray(questionIndex).controls;
  }

  formatLabel(value: number): string | number {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  goBack(): void {
    this.router.navigate(['/quizz']);
  }

  createQuizz(): void {
    if (this.quizzForm.status === 'VALID') {
      this.quizzService.save(this.quizzForm.value).subscribe((quizzResponse) => {
        this.snackBar.open('Le quizz a bien été créé, vous passez en mode édition');
        this.router.navigate([`/quizz/edit/${quizzResponse.id}`]);
      });
    }
  }
}
