import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';

import { AuthStateInterface } from 'src/store/auth/state';
import createPersistedState from 'vuex-persistedstate';
import { Cookies } from 'quasar';
import { Signal } from 'src/hooks/useSignal';
import auth from './auth';
import departments from './departments';

export interface StateInterface {
  isEditing: boolean;
  auth?: AuthStateInterface;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>
  }
}

export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key');

export default store(({ ssrContext }) => {
  const cookies = ssrContext
    ? Cookies.parseSSR(ssrContext)
    : Cookies;

  return createStore<StateInterface>({
    state: {
      isEditing: false,
    },
    getters: {
      isEditing: (state) => state.isEditing,
    },
    mutations: {
      setIsEditing: (state, isEditing: boolean) => {
        state.isEditing = isEditing;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      signal: (state, payload: Signal) => {
        //
      },
    },
    modules: {
      auth,
      departments,
    },
    strict: false,
    plugins: [
      createPersistedState({
        key: 'vuex',
        paths: ['auth.token', 'auth.data', 'isEditing'],
        storage: {
          getItem: (key) => JSON.stringify(cookies.get(key)),
          setItem: (key, value) => cookies.set(key, value, {
            path: '/',
          }),
          removeItem: (key) => cookies.remove(key),
        },
      }),
    ],
  });
});

export function useStore() {
  return vuexUseStore(storeKey);
}
