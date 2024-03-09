import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/TransactionsView.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportView.vue')
    }
  ]
})

export default router
