import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthData, AuthStateInterface, AuthToken } from './state';

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  isAuthorized: (state): boolean => !!state.token,
  data: (state): AuthData | null => state.data,
  token: (state): AuthToken | null => state.token,
  isSigningIn: (state): boolean => state.isSigningIn,
  isSigningOut: (state): boolean => state.isSigningOut,
};

export default getters;
