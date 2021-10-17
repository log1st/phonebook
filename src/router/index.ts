import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  useRouter as vueUseRouter,
  Router,
} from 'vue-router';
import { InjectionKey } from 'vue';
import { Store as VuexStore } from 'vuex';
import { StateInterface } from '../store';
import routes from './routes';

export const routerKey: InjectionKey<VuexStore<StateInterface>> = Symbol('router-key');

export default route<StateInterface>((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE,
    ),
  });

  return Router;
});

export function useRouter(): Router {
  return vueUseRouter();
}
