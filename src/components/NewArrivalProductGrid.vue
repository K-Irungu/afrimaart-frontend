<script setup>
import { defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import NewArrivalProductCard from './NewArrivalProductCard.vue' // Make sure this import is correct

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 3,
  },
})

const route = useRoute()
const router = useRouter()

// Generate page numbers for pagination
const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= props.totalPages; i++) {
    pages.push(i)
  }
  return pages
})

const navigateToPage = (page) => {
  router.push({
    query: { ...route.query, page },
  })
}
</script>

<template>
  <div class="lg:col-span-4 md:col-span-3 px-[5px] mb-[20px]">
    <div class="flex justify-between items-center mb-6 h-[80px]">
      <p class="text-sm text-gray-600">Showing 1-9 of 38 new items</p>
      <div class="flex items-center space-x-2 select-wrapper">
        <label for="sort" class="text-sm text-gray-700">Sort by:</label>
        <select id="sort" class="p-2 border rounded-lg text-sm h-[30px] ml-[5px] select">
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-[5px]">
      <!-- Make sure this is NewArrivalProductCard -->
      <NewArrivalProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-10 space-x-2">
      <!-- Previous Button -->
      <button
        @click="navigateToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="previous-btn px-4 py-2 mx-[10px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
      >
        <svg class="icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Previous</span>
      </button>

      <!-- Page Numbers -->
      <button
        v-for="page in pageNumbers"
        :key="page"
        @click="navigateToPage(page)"
        :class="[
          'page-btn px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-w-[44px]',
          currentPage === page
            ? 'bg-indigo-600 text-white shadow-md scale-105'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-sm',
        ]"
      >
        {{ page }}
      </button>

      <!-- Next Button -->
      <button
        @click="navigateToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="next-btn px-4 py-2 mx-[10px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
      >
        <span>Next</span>
        <svg class="icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.select-wrapper {
  color: #000000;
  height: 100%;
}

.select {
  border-radius: 8px;
}

.previous-btn,
.next-btn {
  border-radius: 8px;
  height: 30px;
  width: 100px;
  place-content: center;
  font-weight: 400;
}
.page-btn {
  border-radius: 4px;
  height: 30px;
  margin: 0 4px;
  place-content: center;
}

.icon {
  width: 20px;
  height: 30px;
}
</style>
