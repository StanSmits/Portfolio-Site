import router from '@/router';

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !localStorage.getItem('token')) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;