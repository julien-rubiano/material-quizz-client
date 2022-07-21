import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, interval, map, Observable, shareReplay } from 'rxjs';
import { Countdown } from 'src/app/models/countdown.model';
import { Answer, Game, Question, Quizz } from 'src/app/models/quizz.model';
import { QuizzService } from 'src/app/services/quizz.service';

@Component({
  selector: 'app-quizz-play',
  templateUrl: './quizz-play.component.html',
  styleUrls: ['./quizz-play.component.css'],
})
export class QuizzPlayComponent implements OnInit {
  quizz!: Quizz;
  game!: Game;
  countdown!: Observable<Countdown>;
  countdownMinutes = 0;
  isQuestionsDisplay = false;

  constructor(private route: ActivatedRoute, private quizzService: QuizzService, private renderer: Renderer2) {}

  ngOnInit() {
    const quizzId = this.route.snapshot.paramMap.get('id') || '{}';
    if (quizzId) {
      this.game = {
        isStarted: false,
        isFinished: false,
        score: 0,
        scorePercent: 0,
        correctAnswers: [],
        wrongAnswers: [],
      };
      this.fillQuizz(quizzId);
    }
  }

  private fillQuizz(quizzId: string): void {
    this.quizzService.getQuizzById(quizzId).subscribe((quizzResponse) => {
      //quizz
      this.quizz = {
        id: quizzResponse.id,
        title: quizzResponse.title,
        description: quizzResponse.description.replace(new RegExp('\n', 'g'), '<br>'),
        isRandomQuestions: quizzResponse.isRandomQuestions,
        duration: quizzResponse.duration,
        questions: quizzResponse.questions,
      };

      this.countdownMinutes = quizzResponse.duration;

      let questions: Question[] = [];

      // questions and answers
      this.quizz.questions!.forEach((q) => {
        if (q.isRandomAnswers) {
          q.answers = q
            .answers!.map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        }
      });

      if (this.quizz.isRandomQuestions) {
        this.quizz.questions = this.quizz
          .questions!.map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
      }
    });
  }

  private setCountdown(startDate: Date, endDate: Date): Countdown {
    const endDateValue = endDate.valueOf();
    const nowDateValue = Date.now();
    const startDateValue = startDate.valueOf();

    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const secondsInAMinute = 60;
    const timeBetweenNowAndEnd = endDateValue - nowDateValue;
    const timeBetweenStartAndNow = nowDateValue - startDateValue;
    const timeBetweenStartAndEnd = endDateValue - startDateValue;

    const hours = Math.floor(
      (timeBetweenNowAndEnd / (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) % hoursInADay
    );
    const minutes = Math.floor((timeBetweenNowAndEnd / (milliSecondsInASecond * minutesInAnHour)) % secondsInAMinute);
    const seconds = Math.floor(timeBetweenNowAndEnd / milliSecondsInASecond) % secondsInAMinute;
    const progress = Math.floor((timeBetweenStartAndNow / timeBetweenStartAndEnd) * 100);

    return { seconds, minutes, hours, progress };
  }

  private addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
  }

  startGame(): void {
    this.startCountdown();
    this.game.isStarted = true;
  }

  startCountdown(): void {
    const startDate = new Date();
    const endDate = this.addMinutes(startDate, this.countdownMinutes);
    this.countdown = interval(1000).pipe(
      map((x) => this.setCountdown(startDate, endDate)),
      shareReplay(1)
    );
  }

  showQuestions() {
    this.isQuestionsDisplay = true;
    this.renderer.addClass(document.getElementsByClassName('mat-horizontal-stepper-header-container')[0], 'show');
  }

  hideQuestions() {
    this.isQuestionsDisplay = false;
    this.renderer.removeClass(document.getElementsByClassName('mat-horizontal-stepper-header-container')[0], 'show');
  }

  questionsSize(): number {
    return this.quizz.questions?.length || 0;
  }

  updateGame(event: MatCheckboxChange, answer: Answer) {
    if (event.checked) {
      if (answer.isValid) {
        this.game.score++;
        this.game.correctAnswers.push(answer);
      } else {
        this.game.wrongAnswers.push(answer);
      }
    } else {
      if (answer.isValid) {
        this.game.score--;
        this.game.correctAnswers = this.game.correctAnswers.filter((a) => a != answer);
      } else {
        this.game.wrongAnswers = this.game.wrongAnswers.filter((a) => a != answer);
      }
    }
    this.game.scorePercent = Math.round((this.game.score / this.quizz.questions!.length) * 100);
  }

  finishGame(): void {
    this.game.isFinished = true;
  }

  isQuestionCorrect(question: Question): boolean {
    return (
      !this.game.wrongAnswers.some((a) => question.answers!.includes(a)) &&
      this.game.correctAnswers.some((a) => question.answers!.includes(a))
    );
  }

  isAnswerCorrect(answer: Answer): boolean {
    return (
      this.game.correctAnswers.filter((a) => a.id === answer.id).length > 0 ||
      this.game.wrongAnswers.filter((a) => a.id === answer.id).length === 0
    );
  }

  isAnswerChecked(answer: Answer): boolean {
    return (
      this.game.wrongAnswers.filter((a) => a.id === answer.id).length > 0 ||
      this.game.correctAnswers.filter((a) => a.id === answer.id).length > 0 ||
      answer.isValid
    );
  }

  isPlayerAnswer(answer: Answer): boolean {
    return (
      this.game.wrongAnswers.filter((a) => a.id === answer.id).length > 0 ||
      this.game.correctAnswers.filter((a) => a.id === answer.id).length > 0
    );
  }
}
