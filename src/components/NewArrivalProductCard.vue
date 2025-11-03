<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    class="card bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl mb-8"
  >
    <div class="card-img w-full h-[65%] bg-gray-100 overflow-hidden relative">
      <!-- Display the actual image -->
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />

      <!-- NEW badge -->
      <span
        v-if="product.isNew"
        class="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
      >
        NEW
      </span>
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

        <!-- Tag display (replaces rating for new arrivals) -->
        <div class="flex items-center mb-3">
          <span
            v-if="product.tag"
            class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="{
              'bg-green-100 text-green-700': product.tag === 'Handpicked',
              'bg-blue-100 text-blue-700': product.tag.includes('Arrived'),
            }"
          >
            {{ product.tag }}
          </span>
        </div>

        <div class="flex justify-center">
          <button
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
  transition: box-shadow 0.3s ease;
}

button {
  background: #0066ff;
  border: none;
  border-radius: 10px;
  margin-top: 5px;
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
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
</style>
