const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    requiresAuth: true,
    children: [
      { path: '', name: 'Home', component: () => import('pages/HomePage.vue') },
      { path: '/competencias', name: 'competenciasForm', component: () => import('pages/CompetenciasForm.vue') },
      { path: '/perfil', name: 'perfilDetalhes', component: () => import('pages/PerfilDetalhes.vue') },
      { path: '/aptidoes', name: 'elementosForm', component: () => import('pages/ElementosForm.vue') }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'Register', component: () => import('src/pages/CadastroLogin.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'Login', component: () => import('pages/LoginPage.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
export default routes
