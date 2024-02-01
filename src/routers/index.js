import { createWebHistory, createRouter } from 'vue-router';

// 公共路由
export const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
    hidden: true,
  },
  {
    path: '/home',
    component: () => import('@/views/home/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
