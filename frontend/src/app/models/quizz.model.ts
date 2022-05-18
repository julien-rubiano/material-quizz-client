export interface Quizz {
  id: number;
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
  position?: number;
  answers?: Answer[];
}

export interface Answer {
  id?: number;
  title: string;
  position: number;
  isValid: boolean;
  questionId?: number;
  quizzId?: number;
}
