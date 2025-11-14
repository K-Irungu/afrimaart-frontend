<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const { product } = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

// Proper authentication check
const isAuthenticated = () => {
  return !!localStorage.getItem('user')
}

const navigateToProduct = () => {
  router.push(`/product/${product.id}`)
}

const addToCart = async (event) => {
  event.stopPropagation()

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to auth page with return URL
    router.push(`/auth?redirect=/product/${product.id}`)
    return
  }

  // User is authenticated, add to cart
  console.log('Added to cart:', product.name)

  // Show success feedback
  showAddToCartFeedback(event.target)
}

const showAddToCartFeedback = (button) => {
  const originalText = button.innerHTML
  button.innerHTML = '✅ Added!'
  button.classList.add('bg-green-600')

  setTimeout(() => {
    button.innerHTML = originalText
    button.classList.remove('bg-green-600')
  }, 1500)
}
</script>

<template>
  <div
    class="card bg-[#E8B6D5] rounded-2xl shadow-md overflow-hidden transition-shadow hover:shadow-xl mb-8 relative cursor-pointer"
    @click="navigateToProduct"
  >
    <!-- NEW badge -->
    <span
      v-if="product.isNew"
      class="badge absolute top-3 right-3 bg-[#CE7F57] text-gray-900 text-xs font-bold px-[6px] py-1 rounded-full z-20 shadow-md"
    >
      NEW
    </span>

    <!-- Product Image -->
    <div class="card-img w-full h-[65%] bg-gray-100 overflow-hidden relative">
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
    </div>

    <!-- Product Details -->
    <div class="card-details h-[35%]">
      <div class="p-[6px]">
        <h4 class="card-name">{{ product.name }}</h4>

        <div class="flex justify-between items-center mt-1 mb-3">
          <span class="card-price text-lg">${{ product.price }}</span>
          <span class="card-brand text-xs text-[#5D3471] bg-[#E8B6D5] px-2 py-0.5 rounded-full">
            {{ product.brand }}
          </span>
        </div>

        <div class="flex items-center mb-3">
          <span
            v-if="product.tag"
            class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="{
              'bg-green-100 text-[#5D3471]': product.tag === 'Handpicked',
              'bg-blue-100 text-[#804D91]': product.tag.includes('Arrived'),
            }"
          >
            {{ product.tag }}
          </span>
        </div>

        <div class="flex justify-center">
          <button
            @click="addToCart"
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
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

.card:hover {
  box-shadow: 0 10px 25px rgba(93, 52, 113, 0.4);
  transform: translateY(-6px);
  transition: all 0.25s ease-in-out;
}

.card-img img {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.card-details button {
  background: #804d91; /* Royal Purple button */
  border: none;
  border-radius: 10px;
  margin-top: 5px;
  color: #ffffff;
  transition: background-color 0.3s ease;
}

.card-details button:hover {
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
  color: #7b8593;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    width: 100%;
    height: auto;
  }
  .card-img {
    height: 200px;
  }
}
</style>
