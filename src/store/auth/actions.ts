import { ActionTree } from 'vuex';
import {
  SignInFailureResponse,
  SignInPayload,
  SignInSuccessResponse,
  SignOutFailureResponse,
  SignOutSuccessResponse,
} from 'src/hooks/useAuth';
import { api } from 'boot/axios';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async signIn({ commit }, payload: SignInPayload) {
    commit('setIsSigningIn', true);
    const response = await api.post<SignInSuccessResponse | SignInFailureResponse>(
      '/auth/sign-in',
      payload,
    );

    if (response.status === 200) {
      commit('setToken', (response.data as SignInSuccessResponse).token);
      commit('setData', (response.data as SignInSuccessResponse).data);
    }

    commit('setIsSigningIn', false);
    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async signOut({ commit }) {
    commit('setIsSigningOut', true);
    const response = await api.post<SignOutSuccessResponse | SignOutFailureResponse>('/auth/sign-out');

    if (response.status === 200) {
      commit('setToken', null);
      commit('setData', null);
    }

    commit('setIsSigningOut', false);
    return {
      status: response.status === 200,
      response: response.data,
    };
  },
};

export default actions;
