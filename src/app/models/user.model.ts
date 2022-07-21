export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  login?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface Credentials {
  login: string;
  password: string;
}
