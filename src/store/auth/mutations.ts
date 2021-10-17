import { MutationTree } from 'vuex';
import { AuthData, AuthStateInterface, AuthToken } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  setToken: (state, token: AuthToken) => {
    state.token = token;
  },
  setData: (state, data: AuthData) => {
    state.data = data;
  },
  setIsSigningIn: (state, isSigningIn: boolean) => {
    state.isSigningIn = isSigningIn;
  },
  setIsSigningOut: (state, isSigningOut: boolean) => {
    state.isSigningOut = isSigningOut;
  },
};

export default mutation;
