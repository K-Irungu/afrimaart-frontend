<script setup>
import { defineProps, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DealsProductCard from './DealsProductCard.vue'

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
  totalProducts: {
    type: Number,
    default: 0,
  },
})

const route = useRoute()
const router = useRouter()

// Sort options focused on deals
const sortOptions = [
  { value: 'discount-high-low', label: 'Discount: High to Low' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating-high-low', label: 'Rating: High to Low' },
]

const currentSort = ref(route.query.sort || 'discount-high-low')

// Generate page numbers for pagination
const pageNumbers = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1)
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

// Navigate to page
const navigateToPage = (page) => {
  router.push({
    query: { ...route.query, page },
  })
}

// Handle sort change
const handleSortChange = (event) => {
  const newSort = event.target.value
  currentSort.value = newSort
  
  // Update URL with sort parameter and reset to page 1
  router.push({
    query: { ...route.query, sort: newSort, page: 1 }
  })
}

// Showing text
const showingText = computed(() => {
  if (props.totalProducts === 0) return 'No deals found'
  
  const itemsPerPage = 9
  const start = (props.currentPage - 1) * itemsPerPage + 1
  const end = Math.min(props.currentPage * itemsPerPage, props.totalProducts)
  return `Showing ${start}-${end} of ${props.totalProducts} deals`
})
</script>

<template>
  <div class="lg:col-span-4 md:col-span-3 px-[5px] mb-[20px]">
    <div class="flex justify-between items-center mb-6 h-[80px]">
      <p class="text-sm text-[#804D91]">{{ showingText }}</p>
      <div class="flex items-center space-x-2 select-wrapper">
        <label for="sort" class="text-sm text-[#5D3471]">Sort by:</label>
        <select
          id="sort"
          v-model="currentSort"
          @change="handleSortChange"
          class="p-[6px] border rounded-lg text-sm h-[30px] ml-[5px] select bg-[#E8B6D5] border-[#AA69AF] text-[#5D3471] cursor-pointer"
        >
          <option 
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-[5px]">
      <DealsProductCard 
        v-for="product in products" 
        :key="product._id || product.id" 
        :product="product" 
      />
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-10 space-x-2">
      <!-- Previous Button -->
      <button
        @click="navigateToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="previous-btn px-4 py-2 mx-[10px] text-sm font-medium text-[#5D3471] bg-[#E8B6D5] border border-[#AA69AF] rounded-lg hover:bg-[#AA69AF] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
      >
        Previous
      </button>

      <!-- Page Numbers -->
      <button
        v-for="page in pageNumbers"
        :key="page"
        @click="navigateToPage(page)"
        :class="[
          'page-btn px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-w-[44px]',
          currentPage === page
            ? 'bg-[#5D3471] text-white shadow-md scale-105'
            : 'text-[#5D3471] bg-[#E8B6D5] border border-[#AA69AF] hover:bg-[#AA69AF] hover:text-white hover:shadow-sm',
        ]"
      >
        {{ page }}
      </button>

      <!-- Next Button -->
      <button
        @click="navigateToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="next-btn px-4 py-2 mx-[10px] text-sm font-medium text-[#5D3471] bg-[#E8B6D5] border border-[#AA69AF] rounded-lg hover:bg-[#AA69AF] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
      >
        Next
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
  cursor: pointer;
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

/* Improve select appearance */
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%235D3471' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  padding-right: 28px;
}
</style>