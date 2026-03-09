<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import CartItemCard from '@/components/CartItemCard.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import OrderSummary from '@/components/OrderSummary.vue'

// Get router instance
const router = useRouter()
const { cartItems, cartCount, cartTotal, clearCart, removeFromCart, updateQuantity } = useCart()

const handleClearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    clearCart()
  }
}

// Calculate cart totals
const subtotal = computed(() => cartTotal.value)
const shipping = computed(() => {
  // Fixed shipping amount
  return subtotal.value > 0 ? 200 : 0 // Ksh 200 fixed shipping
})
const tax = computed(() => subtotal.value * 0.14) // 14% tax
const discount = computed(() => 0) // You can add discount logic here

// Checkout handler
const handleCheckout = () => {
  const cartData = {
    items: cartItems.value,
    subtotal: subtotal.value,
    shipping: shipping.value,
    tax: tax.value,
    discount: discount.value
  }
  
  // Save to localStorage as backup
  localStorage.setItem('checkoutCartData', JSON.stringify(cartData))
  
  // Navigate to checkout with cart data
  router.push({
    path: '/checkout',
    query: {
      cartData: JSON.stringify(cartData)
    }
  })
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
          <h1 class="banner-ttl text-3xl font-bold text-white mb-2">Your Cart</h1>
          <p class="text-gray-200 text-lg">{{ cartCount }} item{{ cartCount !== 1 ? 's' : '' }} in your cart</p>
        </div>

        <!-- Clear Cart Button -->
        <div class="text-right pt-4" v-if="cartCount > 0">
          <button
            @click="handleClearCart"
            class="clear-cart inline-flex items-center gap-2 py-[8px] px-4 text-sm font-semibold text-white bg-[#dc2626] border border-[#b91c1c] rounded-lg hover:bg-[#b91c1c] transition-colors duration-200"
          >
            <font-awesome-icon :icon="['fas', 'trash']" class="w-4 h-4" />
            Clear Cart
          </button>
        </div>
      </div>

      <div class="items grid grid-cols-2 lg:grid-cols-2 gap-8 my-[20px] p-[10px]">
        <!-- Cart Items -->
        <main class="space-y-6" v-if="cartCount > 0">
          <div class="item-list flex flex-col">
            <h2 class="text-xl font-[500] mb-4">Items ({{ cartCount }})</h2>
            <CartItemCard 
              v-for="item in cartItems" 
              :key="item.id" 
              :item="item"
              @remove="removeFromCart"
              @update-quantity="updateQuantity"
            />
          </div>
        </main>

        <!-- Empty Cart State -->
        <div v-else class="col-span-2 text-center py-12">
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <h2 class="text-2xl font-bold text-gray-900 mb-[4px]">Your cart is empty</h2>
            <p class="text-gray-600 mb-[6px]">Add some products to your cart to see them here.</p>
            <button
              @click="handleContinueShopping"
              class="empty-cart bg-[#2A2A6B] hover:bg-[#7272E8] text-white font-medium py-[8px] px-[10px] rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <OrderSummary
          v-if="cartCount > 0"
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
  background: #5858E0; /* Deep Purple */
  border-radius: 20px;
  color: white;
}

.banner-ttl {
  font-weight: 600;
}

.clear-cart {
  border-radius: 10px;
  color: #ffffff;
  background: #dc2626;
  border: 1px solid #b91c1c;
}
.clear-cart:hover {
  color: #ffffff;
  background: #b91c1c;
  border-color: #b91c1c;
}

h2 {
  color: #5858E0; /* Deep Purple headings */
}
.empty-cart{
  border: 1.5px solid #E8E7FC;
  border-radius: 15px;
}
</style>