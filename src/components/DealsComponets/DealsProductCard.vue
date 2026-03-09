<script setup>
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart.js';

const { product } = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const { addToCart, showSuccessMessage, successMessage } = useCart()

// Calculate original price based on discount percentage
const originalPrice = computed(() => {
  if (product.discount_percentage > 0) {
    const currentPrice = typeof product.price === 'number' ? product.price : Number(product.price)
    return (currentPrice / (1 - product.discount_percentage / 100)).toFixed(2)
  }
  return null
})

// Proper authentication check
const isAuthenticated = () => {
  return !!localStorage.getItem('user')
}

const navigateToProduct = () => {
  router.push(`/product/${product._id || product.id}`)
}

const addToCartHandler = async (event) => {
  event.stopPropagation()

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to auth page with return URL
    router.push(`/auth?redirect=/product/${product._id || product.id}`)
    return
  }

  // User is authenticated, add to cart
  addToCart(product, '', '', 1)
}

</script>

<template>
  <div
    class="card bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl cursor-pointer relative"
    @click="navigateToProduct"
  >

    <!-- Success Message -->
    <div
      v-if="showSuccessMessage"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out"
    >
      {{ successMessage }}
    </div>

    <!-- Discount Badge -->
    <span
      v-if="product.discount_percentage > 0"
      class="badge absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-[6px] py-0.5 rounded-sm z-20"
    >
      -{{ product.discount_percentage }}%
    </span>

    <div class="card-img w-full h-48 bg-gray-100 overflow-hidden relative h-[65%]">
      <img :src="product.product_image_url" :alt="product.name" class="w-full h-full object-cover" />
    </div>

    <!-- Card details -->
    <div class="card-content p-[6px] h-[35%]">

      <!-- Updated layout START -->
      <div class="m-[5px]">
        <!-- Name + Deal Tag Row -->
        <div class="flex justify-between items-start gap-2 mb-[5px]">
          <h4 class="card-name text-sm font-semibold line-clamp-2 flex-1">
            {{ product.name }}
          </h4>

          <span
            v-if="product.deal_tag"
            class="tag text-white text-xs px-[5px] py-0.5 rounded-full font-medium shrink-0"
            :class="{
              'bg-red-500': product.deal_tag === 'Flash',
              'bg-green-500': product.deal_tag === 'Clearance',
              'bg-yellow-600': product.deal_tag === 'Deal',
              'bg-blue-600': product.deal_tag === 'Bundle',
            }"
          >
            {{ product.deal_tag }}
          </span>
        </div>

        <!-- Prices -->
        <div class="flex gap-[6px] mt-1 mb-3 items-center">
          <span class="card-price text-lg font-bold text-gray-900">
            Ksh.{{ typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2) }}
          </span>

          <span v-if="originalPrice" class="card-orprice text-sm text-gray-400 line-through ml-2">
            Ksh.{{ originalPrice }}
          </span>
        </div>

        <!-- Rating + Brand -->
        <div class="flex items-center gap-[5px] mb-2">
          <div class="flex items-center mr-[2px]">
            <span class="text-sm text-[#FFAC1E]">★</span>
            <span class="text-sm text-gray-600 ml-1">
              {{ typeof product.rating === 'number' ? product.rating.toFixed(1) : Number(product.rating).toFixed(1) }}
            </span>
          </div>
          <span class="card-brand text-xs text-[#5858E0] bg-[#E8E7FC] px-2 py-0.5 rounded-full ml-2">
            {{ product.brand }}
          </span>
        </div>
      </div>
      <!-- Updated layout END -->

      <div class="flex justify-center">
        <button
          @click="addToCartHandler"
          class="w-[95%] h-[40px] py-2 bg-[#2A2A6B] text-white font-medium rounded-lg hover:bg-[#7272E8] transition duration-150"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #E8E7FC;
  width: 90%;
  height: 510px;
  border: 1px solid #7272E8;
  border-radius: 20px;
  margin-bottom: 2rem;
  color: #5858E0;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(93, 52, 113, 0.3);
  transform: translateY(-4px);
}

.card-img img {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.card-content button {
  background: #2A2A6B;
  border: none;
  border-radius: 10px;
  margin-top: 5px;
  color: #ffffff;
  transition: background-color 0.3s ease;
}

.card-content button:hover {
  background: #7272E8;
}

.card-name,
.card-price {
  font-size: 1rem;
  font-weight: 700;
  color: #5858E0;
}

.card-orprice {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2A2A6B;
}

.card-brand {
  font-size: 0.75rem;
  color: #5858E0;
  font-weight: 600;
}

.badge {
  margin-top: 12px;
  margin-left: 6px;
  border-radius: 10px;
  background: #FFAC1E;
  color: #ffffff;
  font-weight: 700;
  animation: pulse 2s infinite;
}

.tag {
  height: 25px;
  background: #2A2A6B;
  color: #ffffff;
  font-weight: 700;
  border-radius: 10px;
  white-space: nowrap;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
