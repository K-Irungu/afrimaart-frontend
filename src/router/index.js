import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import NewArrivalsView from '@/views/NewArrivalsView.vue'
import DealsView from '@/views/DealsView.vue'
import AccountProfileView from '@/views/AccountView.vue'
import CartView from '@/views/CartView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ContactView from '@/views/ContactView.vue'
import AuthView from '@/views/AuthView.vue'
import CheckoutView from '@/views/CheckoutView.vue'

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
      path: '/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductDetailView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      meta: { requiresAuth: true },
    },
    {
      // Redirect any unmatched routes to home
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Simple auth check function (you can enhance this later)
const isAuthenticated = () => {
  return !!localStorage.getItem('user')
}

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // Redirect to auth page with return URL
    next({
      path: '/auth',
      query: { redirect: to.fullPath },
    })
  } else {
    next()
  }
})

export default router
