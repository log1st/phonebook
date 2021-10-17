import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: '/api', validateStatus: () => true });

export default boot(({ store, app }) => {
  api.interceptors.request.use((req) => {
    if (store.getters['auth/isAuthorized']) {
      req.headers.authorization = `bearer ${store.getters['auth/token'] as string}`;
    }
    return req;
  });

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
