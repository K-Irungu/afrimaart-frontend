<script setup>
import { defineProps, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from './ProductCard.vue'
import { useCart } from '@/composables/useCart.js'

// Start of Change by Kevin Irungu
const { showSuccessMessage, successMessage } = useCart()
// End of Change by Kevin Irungu

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

// Sort options
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
]

const currentSort = ref(route.query.sort || 'newest')

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
      page: page,
    },
  })
}

// Handle sort change
const handleSortChange = (event) => {
  const newSort = event.target.value
  currentSort.value = newSort

  // Update URL with sort parameter and reset to page 1
  router.push({
    query: { ...route.query, sort: newSort, page: 1 },
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

      <!-- Start of change by Kevin Irungu -->
      <!-- Toast Notification -->
      <Transition name="toast">
        <div v-if="showSuccessMessage" class="success-toast">
          <span class="toast-icon-wrapper">
            <svg
              class="toast-checkmark"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8L6.5 11.5L13 4.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="toast-text">{{ successMessage }}</span>
        </div>
      </Transition>
      <!-- End of change by Kevin Irungu -->

      <div class="flex items-center space-x-2 select-wrapper">
        <label for="sort" class="text-sm text-[#5D3471]">Sort by:</label>
        <select
          id="sort"
          v-model="currentSort"
          @change="handleSortChange"
          class="p-[6px] border rounded-lg text-sm h-[30px] ml-[5px] select bg-[#E8B6D5] border-[#AA69AF] text-[#5D3471] cursor-pointer"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-[5px]">
      <ProductCard v-for="product in products" :key="product._id" :product="product" />
    </div>

    <!-- Pagination - Only show if there are multiple pages -->
    <div v-if="totalPages > 1" class="flex justify-center mt-10 space-x-2">
      <!-- Previous Button -->
      <button
        @click="navigateToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="previous-btn px-4 py-2 mx-[10px] text-sm font-medium text-[#5D3471] bg-[#E8B6D5] border border-[#AA69AF] rounded-lg hover:bg-[#AA69AF] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        class="next-btn px-4 py-2 mx-[10px] text-sm font-medium text-[#5D3471] bg-[#E8B6D5] border border-[#AA69AF] rounded-lg hover:bg-[#AA69AF] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
  min-width: 100px;
}

.page-btn {
  border-radius: 4px;
  height: 30px;
  margin: 0 4px;
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


/* ── Toast Notification ── */
.success-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px 10px 12px;
  background: linear-gradient(135deg, #f9f0fc 0%, #f0dff7 100%);
  border: 1px solid #c88fd4;
  border-left: 4px solid #5D3471;
  border-radius: 10px;
  box-shadow:
    0 4px 16px rgba(93, 52, 113, 0.14),
    0 1px 4px rgba(93, 52, 113, 0.08);
  color: #5D3471;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
  pointer-events: none;
}

.toast-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background-color: #5D3471;
  border-radius: 50%;
  flex-shrink: 0;
}

.toast-checkmark {
  width: 13px;
  height: 13px;
  color: #fff;
}

.toast-text {
  color: #4a2659;
}

/* Vue Transition for toast */
.toast-enter-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
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
