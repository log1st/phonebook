import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: {
      name: 'index',
    },
    children: [
      {
        path: ':id?/:personId?',
        name: 'index',
        component: () => import('pages/Index.vue'),
        props: (route) => ({
          id: route.params.id ? +route.params.id : null,
          personId: route.params.personId ? +route.params.personId : null,
        }),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
