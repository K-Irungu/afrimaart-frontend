<script setup>
import { ref } from 'vue'
import CartItemCard from '@/components/CartItemCard.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

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
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-[90%]">
      <!-- banner -->
      <div class="banner mb-8 p-[20px] flex justify-between items-center">
        <div>
          <h1 class="banner-tt1 text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p class="text-gray-600 text-lg">Review items before checkout</p>
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

      <div class="items grid grid-cols-2 gap-4 my-[20px] p-[10px]">
        <!-- Cart Items -->
        <main class="lg:w-2/3 space-y-6">
          <div class="item-list flex flex-col">
            <h2 class="text-x1 font-[500]">Items</h2>
            <CartItemCard v-for="item in cartItems" :key="item.id" :item="item" />
          </div>
        </main>

        <!-- Order Summary -->
        <aside class="order-summary lg:w-1/3 p-[10px]">
          <h2 class="text-2xl font-[500] text-gray-900 mb-6">Order Summary</h2>
          <div
            class="summary-details bg-white p-[10px] rounded-2xl shadow-sm border border-gray-200 sticky top-8 content-center"
          >
            <dl class="space-y-4">
              <div class="mb-[20px]">
                <div class="flex justify-between items-center mb-[10px]">
                  <dt class="text-gray-600 text-[1rem]">Subtotal</dt>
                  <dd class="font-semibold text-gray-900 text-[1rem]">$586.00</dd>
                </div>

                <div class="flex justify-between items-center mb-[10px]">
                  <dt class="text-gray-600 text-[1rem]">Shipping</dt>
                  <dd class="font-semibold text-gray-900 text-[1rem]">$12.00</dd>
                </div>
              </div>

              <div class="text-right mb-[10px]">
                <p class="text-sm text-gray-500">Estimated delivery: 3-5 business days</p>
              </div>

              <hr />

              <div class="total border-gray-300 pt-4 my-[10px]">
                <div class="flex justify-between items-center">
                  <dt class="text-xl font-bold text-gray-900">Total</dt>
                  <dd class="text-xl font-bold text-gray-900">$598.00</dd>
                </div>
              </div>
            </dl>

            <!-- Checkout Button -->
            <div class="mt-8">
              <button
                class="proceed-btn w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Proceed to Checkout
              </button>
            </div>

            <!-- Continue Shopping -->
            <div class="my-[10px] text-center">
              <a
                href="#"
                class="continue-link block w-full font-medium transition-colors duration-200 text-center"
              >
                <span class="inline-block mr-2">
                  <font-awesome-icon :icon="['fas', 'arrow-left']" class="w-4 h-4" />
                </span>
                Continue Shopping
              </a>
            </div>
          </div>
        </aside>
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
  background: #0f1724;
  border-radius: 20px;
  color: white;
}
.banner-ttl {
  font-weight: 600;
}
.clear-cart {
  border-radius: 10px;
  border: none;
}
h2 {
  color: black;
}
.order-summary {
  color: black;
  border-radius: 20px;
}

.proceed-btn {
  padding: 8px;
  border: none;
  border-radius: 10px;
  background: #6366f1;
  font-size: medium;
}
.summary-details {
  border: 1px solid #e6e9ee;
  border-radius: 20px;
}
.total dt,
.total dd {
  font-weight: 600;
  font-size: medium;
}
.continue-link {
  text-decoration: none;
  background: #0f1724;
  width: 100%;
  padding: 8px;
  border-radius: 10px;
  text-align: center;
  color: white;
}
</style>
