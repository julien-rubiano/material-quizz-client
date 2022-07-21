export interface Quizz {
  id?: string;
  title: string;
  description: string;
  isRandomQuestions: boolean;
  questions?: Question[];
  duration: number;
}

export interface Question {
  id?: string;
  title: string;
  isRandomAnswers: boolean;
  answers?: Answer[];
}

export interface Answer {
  id?: string;
  title: string;
  isValid: boolean;
}

export interface Game {
  isStarted: boolean;
  isFinished: boolean;
  score: number;
  scorePercent: number;
  correctAnswers: Answer[];
  wrongAnswers: Answer[];
}
