<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import '@/assets/base.css'
import ProductGrid from '@/components/HomeComponents/ProductGrid.vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/HomeComponents/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

// Base URL for your products API
const API_BASE_URL = 'http://localhost:5000/products'

const categories = ref([
  "All", 
  "Shoes", 
  "Clothes", 
  "Food", 
  "Electronics", 
  "Accessories", 
  "Furniture", 
  "Home", 
  "Sports & Outdoors"
])

// PRODUCTS (FROM DB)
const allProducts = ref([])

// Reactive state
const isLoading = ref(true)
const error = ref(null)

const route = useRoute()

// FIXED: Change default rating to 'Any' to show all products initially
const currentFilters = ref({
  category: 'All',
  brands: ['Any'],
  priceRange: [0, 1000],
  rating: 'Any',
})

// Extract numeric value from MongoDB Decimal128 objects
const extractNumericValue = (value) => {
  if (!value) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  if (value.$numberDecimal) return Number(value.$numberDecimal) || 0
  return Number(value) || 0
}

// Transform product data to extract numeric values
const transformProductData = (products) => {
  return products.map(product => ({
    ...product,
    // Extract numeric price and rating from MongoDB Decimal128 objects
    price: extractNumericValue(product.price),
    rating: extractNumericValue(product.rating),
    // Keep the original for reference if needed
    _originalPrice: product.price,
    _originalRating: product.rating
  }))
}

// Fetch products from backend
const fetchProducts = async () => {
  try {
    isLoading.value = true
    error.value = null
    console.log('Fetching products from:', API_BASE_URL)

    const response = await axios.get(API_BASE_URL)
    console.log('Products received:', response.data)
    
    // Check if we got data
    if (response.data && Array.isArray(response.data)) {
      // Transform the data to extract numeric values
      allProducts.value = transformProductData(response.data)
      console.log('Products loaded successfully:', allProducts.value.length)
      
      // Debug: Log first product to see structure
      if (allProducts.value.length > 0) {
        console.log('First product sample (transformed):', allProducts.value[0])
      }
    } else {
      console.error('Invalid response format:', response.data)
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

const handleFilterUpdate = (newFilters) => {
  console.log('Filters received from Sidebar:', JSON.parse(JSON.stringify(newFilters)))
  currentFilters.value = newFilters
}

// Get unique brands from products
const availableBrands = computed(() => {
  if (!allProducts.value.length) return ['Any']
  const brands = [...new Set(allProducts.value.map(product => product.brand))].filter(brand => brand)
  return ['Any', ...brands]
})

// Get unique categories from products
const availableCategories = computed(() => {
  if (!allProducts.value.length) return ['All']
  const cats = [...new Set(allProducts.value.map(product => product.category))].filter(cat => cat)
  return ['All', ...cats]
})

// Helper function to get minimum rating from filter
const getMinRating = (ratingFilter) => {
  switch (ratingFilter) {
    case '5': return 5
    case '4+': return 4
    case '3+': return 3
    case '2+': return 2
    case '1+': return 1
    case 'Any': 
    default: return 0
  }
}

// FILTER PRODUCTS with proper data extraction
const filteredProducts = computed(() => {
  if (!allProducts.value.length) {
    return []
  }
  
  const filtered = allProducts.value.filter((product) => {
    // Using already transformed numeric values
    const productPrice = product.price
    const productRating = product.rating
    const productBrand = String(product.brand || '')
    const productCategory = String(product.category || '')

    // Category filter
    const categoryMatch =
      currentFilters.value.category === 'All' ||
      productCategory === currentFilters.value.category

    // Brand filter
    const brandMatch =
      currentFilters.value.brands.includes('Any') ||
      currentFilters.value.brands.length === 0 ||
      currentFilters.value.brands.includes(productBrand)

    // Price filter
    const priceMatch = 
      productPrice >= currentFilters.value.priceRange[0] &&
      productPrice <= currentFilters.value.priceRange[1]

    // IMPROVED: Rating filter with exact and minimum rating support
    let ratingMatch = true
    if (currentFilters.value.rating !== 'Any') {
      const minRating = getMinRating(currentFilters.value.rating)
      
      // For exact 5-star rating, show only 5-star products
      if (currentFilters.value.rating === '5') {
        ratingMatch = Math.floor(productRating) === 5
      } else {
        // For 4+, 3+, etc. show products with that minimum rating
        ratingMatch = productRating >= minRating
      }
    }

    console.log(`Product: ${product.name}, Rating: ${productRating}, Filter: ${currentFilters.value.rating}, Match: ${ratingMatch}`)
    
    return categoryMatch && brandMatch && priceMatch && ratingMatch
  })
  
  console.log(`Filtered ${filtered.length} products with rating filter: ${currentFilters.value.rating}`)
  return filtered
})


// SORTING LOGIC
const sortedProducts = computed(() => {
  let sorted = [...filteredProducts.value]
  const sortBy = route.query.sort || 'featured'

  switch (sortBy) {
    case 'newest':
      // Show new products first, then by creation date or ID
      sorted.sort((a, b) => {
        // If both are new or both are not new, maintain order
        if (a.is_new === b.is_new) return 0
        // Show new products first
        return a.is_new ? -1 : 1
      })
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
    case 'featured':
    default:
      // Featured: Show new products first, then by rating
      sorted.sort((a, b) => {
        // Show new products first
        if (a.is_new && !b.is_new) return -1
        if (!a.is_new && b.is_new) return 1
        // Then sort by rating (highest first)
        return b.rating - a.rating
      })
      break
  }
  
  return sorted
})

// PAGINATION LOGIC
const itemsPerPage = 9

// Get current page from route or default to 1
const currentPage = computed(() => {
  return Number(route.query.page) || 1
})

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / itemsPerPage)
})

// Get paginated products for current page
const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return sortedProducts.value.slice(startIndex, endIndex)
})

// Check if any filters are active (not default)
const areFiltersActive = computed(() => {
  return (
    currentFilters.value.category !== 'All' ||
    !(currentFilters.value.brands.length === 1 && currentFilters.value.brands[0] === 'Any') ||
    currentFilters.value.priceRange[0] > 0 ||
    currentFilters.value.priceRange[1] < 1000 ||
    currentFilters.value.rating !== 'Any'
  )
})

// Clear all filters
const clearAllFilters = () => {
  currentFilters.value = {
    category: 'All',
    brands: ['Any'],
    priceRange: [0, 1000],
    rating: 'Any',
  }
}
</script>

<template>
  <div class="home min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />

    <div class="main-content flex gap-[20px] w-full max-w-7xl mx-auto px-4 mt-[20px]">
      <!-- Sidebar Filters -->
      <Sidebar 
        :categories="availableCategories" 
        :brands="availableBrands"
        @update:filters="handleFilterUpdate" 
      />

      <!-- Main content -->
      <main class="flex-1 py-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="flex items-center justify-center">
            <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="ml-3 text-lg text-gray-600">Loading products...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p class="text-red-700 mb-4">Error loading products: {{ error }}</p>
            <button 
              @click="fetchProducts"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- No Products State -->
        <div v-else-if="allProducts.length === 0" class="text-center py-12">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p class="text-yellow-700 text-lg">No products found in the database.</p>
            <p class="text-yellow-600 text-sm mt-2">Check if your backend is running and has products.</p>
            <button 
              @click="fetchProducts"
              class="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reload Products
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else>
          <!-- Show filtered products -->
          <ProductGrid 
            :products="paginatedProducts" 
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-products="sortedProducts.length"
          />

          <!-- No Filter Results -->
          <div v-if="filteredProducts.length === 0 && areFiltersActive" class="text-center py-12">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <p class="text-gray-500 text-lg mb-2">No products match your filters.</p>
              <p class="text-gray-400 text-sm mb-4">Try adjusting your filter criteria.</p>
              <button 
                @click="clearAllFilters"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Show All Products
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
.main-content {
  width: 90%;
  color: #000000;
}

/* Smooth transitions for filter changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>