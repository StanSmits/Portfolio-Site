const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  { 
    path: '/', 
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'home',
        alias: '',
        name: 'home',
        component: () => import('@/pages/Home.vue')
      },
      {
        path: 'education',
        alias: '',
        name: 'education',
        component: () => import('@/pages/Education.vue'),
      },
      {
        path: 'new-education',
        alias: '',
        name: 'new-education',
        component: () => import('@/pages/AddEducation.vue')
      },
      {
        path: 'projects',
        alias: '',
        name: 'projects',
        component: () => import('@/pages/Projects.vue')
      },
      {
        path: 'new-project',
        alias: '',
        name: 'new-projects',
        component: () => import('@/pages/AddProject.vue')
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
]

export default routes