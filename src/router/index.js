import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import about from '../views/about.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/Map',
      name: 'Map',
      component: () => import('../views/Map.vue')
    }, 
    {
      path: '/Information/:id',
      name: 'Information',
      component: () => import('../views/Information.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/about.vue')
    },
    {
      path: '/aboutme',
      name: 'aboutme',
      component: () => import('../views/aboutView.vue')
    }
  ]
})

export default router
