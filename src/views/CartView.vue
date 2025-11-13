<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CartItemCard from '@/components/CartItemCard.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import OrderSummary from '@/components/OrderSummary.vue'

// Get router instance
const router = useRouter()

// Mock Cart Data
const cartItems = ref([
  {
    id: 1,
    name: 'Aero Wireless Headphones',
    color: 'Black',
    size: '—',
    qty: 1,
    price: 199.0,
    image: '', // Placeholder
  },
  {
    id: 2,
    name: 'Stride Runner Sneakers',
    color: 'White',
    size: 9,
    qty: 2,
    price: 258.0,
    image: '', // Placeholder
  },
  {
    id: 3,
    name: 'Urban Leather Backpack',
    color: 'Brown',
    size: '20L',
    qty: 1,
    price: 129.0,
    image: '', // Placeholder
  },
])

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartItems.value = []
  }
}

// Calculate cart totals
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})

const shipping = computed(() => {
  return subtotal.value > 0 ? 12.0 : 0
})

// Checkout handler
const handleCheckout = () => {
  try {
    const isAuthenticated = !!localStorage.getItem('user')
    if (!isAuthenticated) {
      router.push('/auth?redirect=/checkout')
      return
    }
    router.push('/checkout')
  } catch (error) {
    console.error('Error during checkout:', error)
  }
}

// Continue shopping handler
const handleContinueShopping = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-[90%]">
      <!-- banner -->
      <div class="banner mb-8 p-[20px] flex justify-between items-center">
        <div>
          <h1 class="banner-tt1 text-3xl font-bold text-white mb-2">Your Cart</h1>
          <p class="text-gray-200 text-lg">Review items before checkout</p>
        </div>

        <!-- Clear Cart Button -->
        <div class="text-right pt-4">
          <button
            @click="clearCart"
            class="clear-cart inline-flex items-center gap-2 py-[8px] px-[10px] text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50"
          >
            <span class="text-base">🗑️</span>
            Clear Cart
          </button>
        </div>
      </div>

      <div class="items grid grid-cols-2 lg:grid-cols-2 gap-8 my-[20px] p-[10px]">
        <!-- Cart Items -->
        <main class="space-y-6">
          <div class="item-list flex flex-col">
            <h2 class="text-xl font-[500] mb-4">Items</h2>
            <CartItemCard v-for="item in cartItems" :key="item.id" :item="item" />
          </div>
        </main>

        <!-- Order Summary -->
        <OrderSummary
          :subtotal="subtotal"
          :shipping="shipping"
          :tax="0"
          :discount="0"
          :show-checkout-button="true"
          :show-continue-shopping="true"
          @checkout="handleCheckout"
          @continue-shopping="handleContinueShopping"
        />
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
.items {
  background: #ffffff;
  border-radius: 20px;
}

.banner {
  margin-top: 10px;
  background: #5d3471; /* Deep Purple */
  border-radius: 20px;
  color: white;
}

.banner-ttl {
  font-weight: 600;
}

.clear-cart {
  border-radius: 10px;
  border: none;
  color: #5d3471; /* Deep Purple text */
  background: #e8b6d5; /* Soft Pink button bg */
}
.clear-cart:hover {
  color: #ce7f57; /* Warm Brownish Orange hover text */
  background: #f3d0df; /* lighter soft pink hover */
  border-color: #ce7f57;
}

h2 {
  color: #5d3471; /* Deep Purple headings */
}
</style>
