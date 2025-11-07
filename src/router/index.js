import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import NewArrivalsView from '@/views/NewArrivalsView.vue'
import DealsView from '@/views/DealsView.vue'
import AccountProfileView from '@/views/AccountProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView,
    },
    {
      path: '/new-arrivals',
      name: 'newArrivals',
      component: NewArrivalsView,
    },
    {
      path: '/deals',
      name: 'deals',
      component: DealsView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountProfileView,
    },
    {
      // Redirect any unmatched routes to home
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
