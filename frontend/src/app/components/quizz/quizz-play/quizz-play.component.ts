import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, interval, map, Observable, shareReplay } from 'rxjs';
import { Countdown } from 'src/app/models/countdown.model';
import { Answer, Question, Quizz } from 'src/app/models/quizz.model';
import { AnswerService } from 'src/app/services/answer.service';
import { QuestionService } from 'src/app/services/question.service';
import { QuizzService } from 'src/app/services/quizz.service';

@Component({
  selector: 'app-quizz-play',
  templateUrl: './quizz-play.component.html',
  styleUrls: ['./quizz-play.component.css'],
})
export class QuizzPlayComponent implements OnInit {
  quizz!: Quizz;
  isStarted = false;
  countdown!: Observable<Countdown>;
  countdownMinutes = 0;

  constructor(
    private route: ActivatedRoute,
    private quizzService: QuizzService,
    private questionService: QuestionService,
    private answerService: AnswerService
  ) {}

  ngOnInit() {
    const quizzId = parseInt(this.route.snapshot.paramMap.get('id') || '{}');
    if (quizzId) {
      this.fillQuizz(quizzId);
    }
  }

  private fillQuizz(quizzId: number): void {
    let getQuizz = this.quizzService.getQuizzById(quizzId);
    let getQuestions = this.questionService.getQuestionsByQuizzId(quizzId);
    let getAnswers = this.answerService.getAnswersByQuizzId(quizzId);

    forkJoin([getQuizz, getQuestions, getAnswers]).subscribe((results) => {
      let quizzResponse = results[0];
      let questionsResponse = results[1];
      let answersResponse = results[2];

      //quizz
      this.quizz = {
        id: quizzResponse.id,
        title: quizzResponse.title,
        description: quizzResponse.description.replace(new RegExp('\n', 'g'), '<br>'),
        isRandomQuestions: quizzResponse.isRandomQuestions,
        duration: quizzResponse.duration,
      };

      this.countdownMinutes = quizzResponse.duration;

      let questions: Question[] = [];

      // questions and answers
      if (questionsResponse?.length > 0) {
        let questionPosition = 1;
        questionsResponse.forEach((q) => {
          let answers: Answer[] = [];
          answersResponse
            .filter((a) => a.questionId === q.id)
            .forEach((a) => {
              answers.push(a);
            });

          let question: Question = {
            id: q.id,
            title: q.title.replace(new RegExp('\n', 'g'), '<br>'),
            isRandomAnswers: q.isRandomAnswers,
            quizzId: q.quizzId,
            answers: answers,
            position: questionPosition,
          };
          questions.push(question);
          questionPosition++;
        });
      }

      this.quizz.questions = questions;
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

  startQuizz(): void {
    this.startCountdown();
    this.isStarted = true;
  }

  startCountdown(): void {
    const startDate = new Date();
    const endDate = this.addMinutes(startDate, this.countdownMinutes);
    this.countdown = interval(1000).pipe(
      map((x) => this.setCountdown(startDate, endDate)),
      shareReplay(1)
    );
  }

  submitQuizz(): void {}
}
