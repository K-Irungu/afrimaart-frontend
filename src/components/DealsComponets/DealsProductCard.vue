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
    class="card bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl cursor-pointer relative"
    @click="navigateToProduct"
  >
    <!-- Moved badge here -->
    <span
      class="badge absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-[6px] py-0.5 rounded-sm z-20"
    >
      -{{ product.discount }}%
    </span>

    <div class="card-img w-full h-48 bg-gray-100 overflow-hidden relative h-[65%]">
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
    </div>

    <!-- Card details -->
    <div class="card-content p-[6px] h-[35%]">
      <div class="flex gap-[5px] m-[10px]">
        <div>
          <h4 class="card-name font-semibold text-gray-800 mb-[5px]">{{ product.name }}</h4>
          <div class="flex gap-[6px] mt-1 mb-3">
            <span class="card-price text-lg font-bold text-gray-900">${{ product.price }}</span>
            <span class="card-orprice text-sm text-gray-400 line-through ml-2">
              ${{ product.originalPrice }}
            </span>
          </div>
        </div>

        <!-- Tag display -->
        <div class="grid grid-flow-col grid-rows-2 gap-4 mb-3 w-full place-items-end">
          <span
            v-if="product.dealTag"
            class="tag col-span-2 text-white text-xs px-[5px] py-0.5 rounded-full"
            :class="{
              'bg-red-500': product.dealTag === 'Flash',
              'bg-green-500': product.dealTag === 'Clearance',
              'bg-yellow-600': product.dealTag === 'Deal',
              'bg-blue-600': product.dealTag === 'Bundle',
            }"
          >
            {{ product.dealTag }}
          </span>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          @click="addToCart"
          class="w-[95%] h-[40px] w-full py-2 bg-[#804D91] text-white font-medium rounded-lg hover:bg-[#AA69AF] transition duration-150"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #e8b6d5; /* Soft Pink background */
  width: 90%;
  height: 400px;
  border: 1px solid #aa69af; /* Medium Orchid border */
  border-radius: 20px;
  margin-bottom: 2rem;
  color: #5d3471; /* Deep Purple text */
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(93, 52, 113, 0.3); /* Deep Purple glow */
  transform: translateY(-4px);
}

.card-img img {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.card-content button {
  background: #804d91; /* Royal Purple button */
  border: none;
  border-radius: 10px;
  margin-top: 5px;
  color: #ffffff;
  transition: background-color 0.3s ease;
}

.card-content button:hover {
  background: #aa69af; /* Medium Orchid hover */
}

.card-name,
.card-price {
  font-size: 1rem;
  font-weight: 700;
  color: #5d3471; /* Deep Purple */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-orprice {
  font-size: 0.8rem;
  font-weight: 700;
  color: #804d91; /* Royal Purple for contrast */
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

.tag {
  height: 25px;
  width: auto;
  background: #804d91; /* Royal Purple tag */
  color: #ffffff;
  font-weight: 700;
  border-radius: 10px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
