import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DealsView from '@/views/DealsView.vue'
import AccountProfileView from '@/views/AccountView.vue'
import CartView from '@/views/CartView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ContactView from '@/views/ContactView.vue'
import AuthView from '@/views/AuthView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import Admin from '@/views/Admin.vue'
import AdminProducts from '@/components/Admin/AdminProducts.vue'
import AdminOrders from '@/components/Admin/AdminOrders.vue'
import StaticPageView from '@/views/StaticPageView.vue'

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
      component: StaticPageView,
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
      path: '/careers',
      name: 'careers',
      component: StaticPageView,
    },
    {
      path: '/press',
      name: 'press',
      component: StaticPageView,
    },
    {
      path: '/help-center',
      name: 'helpCenter',
      component: StaticPageView,
    },
    {
      path: '/returns',
      name: 'returns',
      component: StaticPageView,
    },
    {
      path: '/privacy-policy',
      name: 'privacyPolicy',
      component: StaticPageView,
    },
    {
      path: '/terms-of-service',
      name: 'termsOfService',
      component: StaticPageView,
    },
    {
      path: '/cookie-policy',
      name: 'cookiePolicy',
      component: StaticPageView,
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
      path: '/adminDashboard',
      name: 'adminDashboard',
      component: Admin,
    },
    {
      path: '/admin/products',
      name: 'adminProducts',
      component: AdminProducts,
    },
    {
      path: '/admin/orders',
      name: 'adminOrders',
      component: AdminOrders,
    },


    // Start of change made by Kevin Irungu
    {
      path: '/order-confirmation',
      name: 'orderConfirmation',
      component: () => import('@/views/OrderConfirmationView.vue'),
    },
    // End of change made by Kevin Irungu


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
