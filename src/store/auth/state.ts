import { User } from 'src/models/User';

export type AuthToken = string;
export type AuthData = Omit<User, 'password' | 'token'>;

export interface AuthStateInterface {
  token: AuthToken | null;
  data: AuthData | null;
  isSigningIn: boolean,
  isSigningOut: boolean,
}

function state(): AuthStateInterface {
  return {
    token: null,
    data: null,
    isSigningIn: false,
    isSigningOut: false,
  };
}

export default state;
