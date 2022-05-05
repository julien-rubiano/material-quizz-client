export interface User {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  cost: number;
  isAdmin: boolean;
  hasCompletedTutorial: boolean;
}
