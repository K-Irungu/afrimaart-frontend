<script setup>
import { defineProps, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from './ProductCard.vue'

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
    default: 1,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
})

const route = useRoute()
const router = useRouter()

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

// Navigate to a page
const navigateToPage = (page) => {
  if (page < 1 || page > props.totalPages) return
  
  // Update the URL with the new page
  router.push({ 
    query: { 
      ...route.query, 
      page: page 
    } 
  })
}

// Showing text
const showingText = computed(() => {
  if (props.totalProducts === 0) return 'No results found'
  
  const itemsPerPage = 9
  const start = (props.currentPage - 1) * itemsPerPage + 1
  const end = Math.min(props.currentPage * itemsPerPage, props.totalProducts)
  return `Showing ${start}-${end} of ${props.totalProducts} results`
})
</script>

<template>
  <div class="lg:col-span-4 md:col-span-3 px-[5px] mb-[20px]">
    <!-- Top Info and Sort -->
    <div class="flex justify-between items-center mb-6 h-[80px]">
      <p class="text-sm text-[#804D91]">{{ showingText }}</p>
      <div class="flex items-center space-x-2 select-wrapper">
        <label for="sort" class="text-sm text-[#5D3471]">Sort by:</label>
        <select
          id="sort"
          class="p-2 border rounded-lg text-sm h-[30px] ml-[5px] select bg-[#E8B6D5] border-[#AA69AF] text-[#5D3471]"
        >
          <option>Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-[5px]">
      <ProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
      />
    </div>

    <!-- Pagination - Only show if there are multiple pages -->
    <div v-if="totalPages > 1" class="flex justify-center mt-10 space-x-2">
      <!-- Previous Button -->
      <button
        @click="navigateToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="previous-btn px-4 py-2 mx-[10px] text-sm font-medium text-[#5D3471] bg-[#E8B6D5] border border-[#AA69AF] rounded-lg hover:bg-[#AA69AF] hover:text-white transition-colors duration-200"
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
            : 'text-[#5D3471] bg-[#E8B6D5] border border-[#AA69AF] hover:bg-[#AA69AF] hover:text-white hover:shadow-sm'
        ]"
      >
        {{ page }}
      </button>

      <!-- Next Button -->
      <button
        @click="navigateToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="next-btn px-4 py-2 mx-[10px] text-sm font-medium text-[#5D3471] bg-[#E8B6D5] border border-[#AA69AF] rounded-lg hover:bg-[#AA69AF] hover:text-white transition-colors duration-200"
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
}

.previous-btn,
.next-btn {
  border-radius: 8px;
  height: 30px;
  min-width: 100px;
}

.page-btn {
  border-radius: 4px;
  height: 30px;
  margin: 0 4px;
}


@media (max-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>