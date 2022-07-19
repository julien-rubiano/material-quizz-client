export interface Quizz {
  id?: number;
  title: string;
  description: string;
  isRandomQuestions: boolean;
  questions?: Question[];
  duration: number;
}

export interface Question {
  id?: number;
  title: string;
  isRandomAnswers: boolean;
  quizzId?: number;
  answers?: Answer[];
}

export interface Answer {
  id?: number;
  title: string;
  isValid: boolean;
  questionId?: number;
  quizzId?: number;
}

export interface Game {
  isStarted: boolean;
  isFinished: boolean;
  score: number;
  scorePercent: number;
  correctAnswers: Answer[];
  wrongAnswers: Answer[];
}
