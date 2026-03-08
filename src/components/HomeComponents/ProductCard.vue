<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart.js';

const { product } = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const { addToCart,
        // showSuccessMessage,
        // successMessage
      } = useCart()

// Proper authentication check
const isAuthenticated = () => {
  return !!localStorage.getItem('user')
}

const navigateToProduct = () => {
  router.push(`/product/${product._id}`)
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
    class="card bg-[#E8B6D5] rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl mb-8 cursor-pointer relative"
    @click="navigateToProduct"
  >

    <!-- Success Message -->


    <!-- Start of change by Kevin Irungu -->

     <!-- Commented this out. The success message should be a toast and not a message on each product card  -->
    <!-- <div
      v-if="showSuccessMessage"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out"
    >

      {{ successMessage }}
    </div> -->

    <!-- End of change by Kevin Irungu -->


    <!-- NEW Badge -->
    <span
      v-if="product.is_new"
      class="badge absolute top-[10px] right-[10px] py-[2px] px-[6px] text-white text-xs font-bold drop-shadow-md rounded-full z-20 shadow-md"
    >
      NEW
    </span>

    <div class="card-img w-full h-[65%] bg-gray-100 overflow-hidden">
      <!-- Display the actual image -->
      <img :src="product.product_image_url" :alt="product.name" class="w-full h-full object-cover" />
    </div>

    <!-- card-details -->
    <div class="card-details h-[35%]">
      <div class="p-[6px]">
        <h4 class="card-name">{{ product.name }}</h4>
        <div class="flex justify-between items-center mt-1 mb-3">
          <span class="card-price text-lg">Ksh.{{ product.price }}</span>
          <span class="card-brand text-xs text-[#5D3471] bg-[#E8B6D5] px-2 py-0.5 rounded-full">
            {{ product.brand }}
          </span>
        </div>

        <!-- Add rating display -->
        <div class="flex items-center mb-3">
          <span class="text-sm text-[#CE7F57]">★</span>
          <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
        </div>

        <div class="flex justify-center">
          <button
            @click="addToCartHandler"
            class="w-[95%] h-[40px] py-2 bg-[#804D91] text-white font-medium rounded-xl hover:bg-[#AA69AF] transition duration-150"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #e8b6d5;
  width: 90%;
  height: 400px;
  border: 1px solid #aa69af;
  border-radius: 20px;
  margin-bottom: 2rem;
  color: #5d3471;
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

.card-img img {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

button {
  background: #804d91; /* Royal Purple button */
  border: none;
  border-radius: 10px;
  margin-top: 5px;
  color: #ffffff;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #aa69af;
}

.card-name,
.card-price {
  font-size: 1rem;
  font-weight: 700;
  color: #5d3471;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-brand {
  font-size: 0.75rem;
  color: #5d3471;
  font-weight: 600;
}

.badge {
  margin-top: 12px;
  margin-left: 5px;
  border-radius: 10px;
  background: #ce7f57; /* Warm Brownish Orange badge */
  color: #ffffff;
  font-weight: 700;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  z-index: 20;
  animation: pulse 2s infinite;
}


/* Pulse for badge */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Fade-in animation for cards */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card:hover {
  box-shadow: 0 8px 25px #5d34714d;
  transform: translateY(-4px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    width: 100%;
    height: auto;
  }
  .card-img {
    height: 200px;
  }
  .badge {
    font-size: 0.6rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>
