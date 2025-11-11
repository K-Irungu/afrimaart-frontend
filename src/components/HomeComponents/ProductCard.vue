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
    class="card bg-[#E8B6D5] rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl mb-8 cursor-pointer"
    @click="navigateToProduct"
  >
    <div class="card-img w-full h-[65%] bg-gray-100 overflow-hidden">
      <!-- Display the actual image -->
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
    </div>

    <!-- card-details -->
    <div class="card-details h-[35%]">
      <div class="p-[6px]">
        <h4 class="card-name">{{ product.name }}</h4>
        <div class="flex justify-between items-center mt-1 mb-3">
          <span class="card-price text-lg">${{ product.price }}</span>
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
  cursor: pointer;
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

.card:hover {
  box-shadow: 0 8px 25px #5d34714d;
  transform: translateY(-4px);
}
</style>
