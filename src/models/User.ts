export enum UserRole {
  root = 'root',
  admin = 'admin',
  user = 'user'
}

export interface User {
  id: number;
  login: string;
  password: string;
  role: UserRole;
}

export interface Token {
  id: number;
  token: string;
  userId: User['id'];
  isActive: boolean;
}
