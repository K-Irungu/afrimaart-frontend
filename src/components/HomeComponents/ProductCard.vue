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

const navigateToProduct = () => {
  router.push(`/product/${product.id}`)
}

const addToCart = (event) => {
  event.stopPropagation() // Prevent navigating when clicking "Add to Cart"
  console.log('Added to cart:', product.name)
  // Add your cart logic here
}
</script>

<template>
  <div
    class="card bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl mb-8 cursor-pointer"
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
          <span class="card-brand text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {{ product.brand }}
          </span>
        </div>

        <!-- Add rating display -->
        <div class="flex items-center mb-3">
          <span class="text-sm text-yellow-500">★</span>
          <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
        </div>

        <div class="flex justify-center">
          <button
            @click="addToCart"
            class="w-[95%] h-[40px] py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-150"
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
  background: #ffffff;
  width: 90%;
  height: 400px;
  border: 1px solid #e6e9ee;
  border-radius: 20px;
  margin-bottom: 2rem;
  color: black;
  transition: all 0.3s ease;
  cursor: pointer;
}

button {
  background: #0066ff;
  border: none;
  border-radius: 10px;
}

.card-name,
.card-price {
  font-size: 1rem;
  font-weight: 700;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-brand {
  font-size: 0.75rem;
  color: #7b8593;
  font-weight: 600;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transform: translateY(-4px);
}
</style>
