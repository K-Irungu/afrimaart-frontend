<script setup>
import { computed } from 'vue'

const props = defineProps({
  subtotal: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  deliveryText: {
    type: String,
    default: 'Estimated delivery: 3-5 business days',
  },
  showCheckoutButton: {
    type: Boolean,
    default: false,
  },
  showContinueShopping: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: 'Proceed to Checkout',
  },
  buttonVariant: {
    type: String,
    default: 'primary',
  },
})

const emit = defineEmits(['checkout', 'continue-shopping'])

const total = computed(() => {
  return props.subtotal + props.shipping + props.tax - props.discount
})

// ✅ Add handleCheckout function
const handleCheckout = () => {
  emit('checkout')
}

// ✅ Fix handleContinueShopping function
const handleContinueShopping = () => {
  emit('continue-shopping')
}
</script>

<template>
  <aside class="order-summary lg:w-1/3 p-[10px]">
    <h2 class="text-2xl font-[500] text-gray-900 mb-6">Order Summary</h2>
    <div
      class="summary-details bg-white p-[10px] rounded-2xl shadow-sm border border-gray-200 sticky top-8 content-center"
    >
      <dl class="space-y-4">
        <div class="mb-[20px]">
          <div class="flex justify-between items-center mb-[10px]">
            <dt class="text-gray-600 text-[1rem]">Subtotal</dt>
            <dd class="font-semibold text-gray-900 text-[1rem]">Ksh.{{ subtotal.toFixed(2) }}</dd>
          </div>

          <div class="flex justify-between items-center mb-[10px]">
            <dt class="text-gray-600 text-[1rem]">Shipping</dt>
            <dd class="font-semibold text-gray-900 text-[1rem]">Ksh.{{ shipping.toFixed(2) }}</dd>
          </div>

          <div class="flex justify-between items-center mb-[10px]">
            <dt class="text-gray-600 text-[1rem]">Discount</dt>
            <dd class="font-semibold text-gray-900 text-[1rem]">Ksh.{{ discount.toFixed(2) }}</dd>
          </div>
        </div>

        <div class="text-right mb-[10px]">
          <p class="text-sm text-gray-500">{{ deliveryText }}</p>
        </div>

        <hr />

        <div class="total border-gray-300 pt-4 my-[10px]">
          <div class="flex justify-between items-center">
            <dt class="text-xl font-bold text-gray-900">Total</dt>
            <dd class="text-xl font-bold text-gray-900">Ksh.{{ total.toFixed(2) }}</dd>
          </div>
        </div>
      </dl>

      <!-- Checkout Button -->
      <div v-if="showCheckoutButton" class="mt-6">
        <button
          @click="handleCheckout"
          :class="[
            'w-full font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200',
            buttonVariant === 'success'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'proceed-btn',
          ]"
        >
          <font-awesome-icon :icon="['fas', 'bag-shopping']" class="w-4 h-4 mr-2" />
          {{ buttonText }}
        </button>
      </div>

      <!-- Continue Shopping -->
      <div class="my-[10px] text-center">
        <button
          @click="handleContinueShopping"
          class="continue-link block w-full font-medium transition-colors duration-200 text-center"
        >
          <span class="inline-block mr-2">
            <font-awesome-icon :icon="['fas', 'arrow-left']" class="w-4 h-4" />
          </span>
          Continue Shopping
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.order-summary {
  color: #5858E0;
  border-radius: 20px;
}

.proceed-btn {
  padding: 8px;
  border: none;
  border-radius: 10px;
  background: #5858E0;
  font-size: medium;
  color: white;
}
.proceed-btn:hover {
  background: #2A2A6B;
}

.summary-details {
  border: 1px solid #FFAC1E;
  border-radius: 20px;
}

.total dt,
.total dd {
  font-weight: 600;
  font-size: medium;
  color: #5858E0; /* Deep Purple total */
}

.continue-link {
  text-decoration: none;
  background: #2A2A6B; /* Royal Purple */
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 10px;
  text-align: center;
  color: white;
}
.continue-link:hover {
  background: #7272E8; /* Medium Orchid hover */
}
</style>
