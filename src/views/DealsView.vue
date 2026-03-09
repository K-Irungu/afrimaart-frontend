<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import '@/assets/base.css'
import Navbar from '@/components/Navbar.vue'
import DealsSidebar from '@/components/DealsComponets/DealsSidebar.vue'
import DealsProductGrid from '@/components/DealsComponets/DealsProductGrid.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

const API_BASE_URL = 'https://afrimart-backend-5fxf.onrender.com/products'

// Products from API
const allProducts = ref([])
const isLoading = ref(true)
const error = ref(null)

const route = useRoute()

// Extract numeric value from MongoDB Decimal128 objects
const extractNumericValue = (value) => {
  if (!value) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  if (value.$numberDecimal) return Number(value.$numberDecimal) || 0
  return Number(value) || 0
}

// Transform product data
const transformProductData = (products) => {
  return products.map(product => ({
    ...product,
    price: extractNumericValue(product.price),
    rating: extractNumericValue(product.rating),
  }))
}

// Fetch products from backend
const fetchProducts = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await axios.get(API_BASE_URL)

    if (response.data && Array.isArray(response.data)) {
      allProducts.value = transformProductData(response.data)
    } else {
      allProducts.value = []
    }

  } catch (err) {
    console.error("Error fetching products:", err)
    error.value = err.message
    allProducts.value = []
  } finally {
    isLoading.value = false
  }
}

// Run fetch when page loads
onMounted(() => {
  fetchProducts()
})

// --- Filter Logic ---
const currentFilters = ref({
  dealType: 'All deals',
  category: 'All',
  discount: '10%+',
  priceRange: [0, 1000],
})

const handleFilterUpdate = (newFilters) => {
  currentFilters.value = newFilters
}

// Filter products based on selected filters
const filteredProducts = computed(() => {
  if (!allProducts.value.length) return []

  return allProducts.value.filter(product => {
    // Filter by deal type
    if (currentFilters.value.dealType !== 'All deals') {
      if (product.deal_tag !== currentFilters.value.dealType) {
        return false
      }
    }

    // Filter by category
    if (currentFilters.value.category !== 'All') {
      if (product.category !== currentFilters.value.category) {
        return false
      }
    }

    // Filter by discount percentage
    const discountValue = parseInt(currentFilters.value.discount)
    if (product.discount_percentage < discountValue) {
      return false
    }

    // Filter by price range
    const productPrice = product.price
    if (productPrice < currentFilters.value.priceRange[0] ||
        productPrice > currentFilters.value.priceRange[1]) {
      return false
    }

    // Only show products that have either discount or deal tag
    if (product.discount_percentage === 0 && !product.deal_tag) {
      return false
    }

    return true
  })
})

// SORTING LOGIC
const sortedProducts = computed(() => {
  let sorted = [...filteredProducts.value]
  const sortBy = route.query.sort || 'discount-high-low'

  switch (sortBy) {
    case 'discount-high-low':
      // Sort by discount percentage (highest first)
      sorted.sort((a, b) => b.discount_percentage - a.discount_percentage)
      break
    case 'price-low-high':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-high-low':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'rating-high-low':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    default:
      // Default: discount high to low
      sorted.sort((a, b) => b.discount_percentage - a.discount_percentage)
      break
  }

  return sorted
})

// Get current page from route
const currentPage = computed(() => {
  return Number(route.query.page) || 1
})

// Calculate total pages
const totalPages = computed(() => {
  const itemsPerPage = 9
  return Math.ceil(sortedProducts.value.length / itemsPerPage)
})

// Get paginated products
const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * 9
  const endIndex = startIndex + 9
  return sortedProducts.value.slice(startIndex, endIndex)
})

// Count products by filter for display
const filterStats = computed(() => {
  const total = allProducts.value.length
  const filtered = filteredProducts.value.length
  const withDiscounts = allProducts.value.filter(p => p.discount_percentage > 0).length
  const withDealTags = allProducts.value.filter(p => p.deal_tag).length

  return { total, filtered, withDiscounts, withDealTags }
})
</script>

<template>
  <div class="home min-h-screen bg-gray-50 place-items-center">
    <!-- Navbar -->
    <Navbar />

    <!-- Banner  -->
    <div class="banner bg-gray-800 text-white py-[5px] px-4 my-[20px] mx-auto">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-[20px] py-[10px]">
        <div class="">
          <h1 class="banner-ttl text-3xl font-bold mb-1">Save big on top products</h1>
          <p class="text-gray-400">
            {{ filterStats.withDiscounts }} products with discounts •
            {{ filterStats.withDealTags }} special deals available
          </p>
        </div>
        <button
          class="bg-[#5858E0] hover:bg-[#7272E8] text-[#ffff] font-medium py-[5px] px-[8px] rounded-lg transition-all duration-200"
        >
          Hot Deals
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-700 mb-4">Error loading deals: {{ error }}</p>
        <button
          @click="fetchProducts"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div v-else class="main-content flex gap-[20px] w-full max-w-7xl mx-auto px-4 mt-[20px]">
      <!-- Sidebar Filters -->
      <DealsSidebar @update:filters="handleFilterUpdate" />

      <!-- Main content -->
      <main class="flex-1 py-8">
        <DealsProductGrid
          :products="paginatedProducts"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :totalProducts="sortedProducts.length"
          :isLoading="isLoading"
        />

        <!-- Show message if no products -->
        <div v-if="filteredProducts.length === 0 && !isLoading" class="show-msg flex justify-center items-center text-center py-12">
          <div class="bg-gray-50 p-8 max-w-md mx-auto">
            <p class="text-gray-500 text-lg mb-2">No deals match your filters.</p>
            <p class="text-gray-400 text-sm mb-4">Try adjusting your filter criteria.</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
.home {
  background: #F0EFFC;
  color: #1f2937;
}

.main-content {
  width: 90%;
  color: #000000;
}

.banner {
  background: rgb(58, 58, 191);
  width: 90%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  color: white;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
}

.banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(93, 52, 113, 0.3);
}

.banner-ttl {
  letter-spacing: 0.5px;
}

.banner button {
  height: 36px;
  border-radius: 15px;
  border: none;
}
.show-msg{
  border-radius: 20px;
  border: 1.5px solid #E8E7FC;
  height: 300px;
  background: #E8E7FC;
}
.show-msg p{
  font-size: 2rem;
  font-weight: 400;
}
</style>
