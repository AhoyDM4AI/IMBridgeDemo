import { createRouter, createWebHistory } from 'vue-router'
import DemoView from '../views/DemoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'demo',
      component: DemoView
    },
  ]
})

export default router
