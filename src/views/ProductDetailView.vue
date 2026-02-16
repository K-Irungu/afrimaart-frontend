<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useCart } from '@/composables/useCart.js';

const route = useRoute()
const router = useRouter()
const { addToCart, showSuccessMessage, successMessage } = useCart()

// Base URL for your products API
const API_BASE_URL = 'http://localhost:5050/products'

// Reactive product data
const product = ref({})
const selectedColor = ref('')
const selectedWarranty = ref('')
const quantity = ref(1)
const isLoading = ref(true)
const error = ref(null)

// Check if user is authenticated
const isAuthenticated = () => {
  // Check for user data in localStorage or sessionStorage
  const user = localStorage.getItem('user') || sessionStorage.getItem('user')
  return !!user
}

// Extract numeric value from MongoDB Decimal128 objects
const extractNumericValue = (value) => {
  if (!value) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  if (value.$numberDecimal) return Number(value.$numberDecimal) || 0
  return Number(value) || 0
}

// Transform product data
const transformProductData = (productData) => {
  return {
    ...productData,
    price: extractNumericValue(productData.price),
    rating: extractNumericValue(productData.rating),
    // Ensure arrays exist for optional fields
    colors: productData.color || [],
    warranties: productData.warranty ? [productData.warranty] : [],
    features: productData.features || [],
    specifications: productData.specifications || {}
  }
}

// Fetch product when component mounts or route changes
const fetchProduct = async () => {
  try {
    isLoading.value = true
    error.value = null
    const productId = route.params.id

    const response = await axios.get(`${API_BASE_URL}/${productId}`)

    if (response.data) {
      product.value = transformProductData(response.data)

      // Set default selections
      if (product.value.colors && product.value.colors.length > 0) {
        selectedColor.value = typeof product.value.colors[0] === 'string'
          ? product.value.colors[0]
          : product.value.colors[0]?.name || ''
      }

      if (product.value.warranties && product.value.warranties.length > 0) {
        selectedWarranty.value = typeof product.value.warranties[0] === 'string'
          ? product.value.warranties[0]
          : product.value.warranties[0]?.name || ''
      }
    } else {
      error.value = 'Product not found'
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = err.response?.data?.message || 'Failed to load product'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProduct()
})

// Watch for route changes
watch(() => route.params.id, fetchProduct)

const incrementQuantity = () => quantity.value++
const decrementQuantity = () => (quantity.value > 1 ? quantity.value-- : null)

const addToCartHandler = async (event) => {
  event.stopPropagation()

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to auth page with return URL
    router.push(`/auth?redirect=/product/${product.value._id || product.value.id}`)
    return
  }

  // Prepare product data for cart
  const cartProduct = {
    _id: product.value._id,
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    product_image_url: product.value.product_image_url,
    brand: product.value.brand,
    selectedColor: selectedColor.value,
    selectedWarranty: selectedWarranty.value,
    quantity: quantity.value
  }

  // User is authenticated, add to cart
  addToCart(cartProduct, selectedColor.value, selectedWarranty.value, quantity.value)
}

const addToWishlist = () => {
  console.log('Added to wishlist:', product.value.name)
  // Add wishlist logic here
}

// Helper to check if color is available
const isColorAvailable = (color) => {
  if (typeof color === 'string') return true
  return color.available !== false
}

// Helper to check if color is popular
const isColorPopular = (color) => {
  if (typeof color === 'string') return false
  return color.popular === true
}

// Get color name
const getColorName = (color) => {
  return typeof color === 'string' ? color : color.name
}

// Calculate original price if there's a discount
const originalPrice = computed(() => {
  if (product.value.discount_percentage > 0) {
    return (product.value.price / (1 - product.value.discount_percentage / 100)).toFixed(2)
  }
  return null
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Navbar -->
    <Navbar />

    <div class="detail-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="flex items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-3 text-lg text-gray-600">Loading product...</span>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="showSuccessMessage"
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out"
      >
        {{ successMessage }}
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p class="text-red-700 mb-4">Error: {{ error }}</p>
          <button
            @click="fetchProduct"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Product Content -->
      <div v-else>
        <!-- Breadcrumb -->
        <nav class="breadcrumbs mb-8">
          <ol class="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" class="hover:text-blue-600 transition-colors">Home</a></li>
            <li class="flex items-center">
              <span class="mx-2">›</span>
              <a href="/" class="hover:text-blue-600 transition-colors">{{ product.category }}</a>
            </li>
            <li class="flex items-center">
              <span class="mx-2">›</span>
              <span class="text-gray-900 font-medium">{{ product.name }}</span>
            </li>
          </ol>
        </nav>

        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="grid grid-cols-2 lg:grid-cols-2 gap-[10px] p-8">
            <!-- Image Gallery -->
            <div class="image-gallery">
              <div class="relative rounded-2xl overflow-hidden bg-gray-100">
                <img
                  :src="product.product_image_url"
                  :alt="product.name"
                  class="main-img w-full h-[700px] lg:h-[500px] object-cover"
                />
                <!-- Discount Badge -->
                <span
                  v-if="product.discount_percentage > 0"
                  class="discount-badge absolute top-[6px] left-[6px] bg-red-600 text-white text-sm font-semibold px-[8px] py-[4px] rounded-lg z-20"
                >
                  -{{ product.discount_percentage }}%
                </span>
                <!-- NEW Badge -->
                <span
                  v-if="product.is_new"
                  class="new-badge absolute top-[6px] left-[6px] bg-[#CE7F57] text-white text-sm font-semibold px-[8px] py-[4px] rounded-lg z-20"
                >
                  NEW
                </span>
              </div>
            </div>

            <!-- Product Details -->
            <div class="product-details">
              <!-- Header with Price -->
              <div class="flex justify-between items-start mb-[15px]">
                <div class="flex-1">
                  <h1 class="text-3xl font-[500] text-[#5d3471] leading-tight mb-2">{{ product.name }}</h1>
                  <p class="text-lg text-[#5d3471] mb-4">{{ product.brand }}</p>
                </div>
                <div class="text-right">
                  <p class="text-3xl font-[500] text-[#ce7f57]">Ksh{{ product.price?.toFixed(2) }}</p>
                  <p v-if="originalPrice" class="text-lg text-[#ce7f57] line-through">
                    Ksh{{ originalPrice }}
                  </p>
                </div>
              </div>

              <!-- Rating and Stock -->
              <div class="rating flex items-center gap-4 mb-[15px]">
                <div class="flex items-center">
                  <div class="flex text-yellow-400 mr-2">
                    <span v-for="star in 5" :key="star" class="text-xl">
                      {{ star <= Math.floor(product.rating || 0) ? '★' : '☆' }}
                    </span>
                  </div>
                  <span class="text-gray-700 font-semibold ml-1">{{ product.rating?.toFixed(1) }}</span>
                </div>
                <div class="flex items-center text-green-600 font-semibold">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  In Stock • Ready to ship
                </div>
              </div>

              <!-- Description -->
              <p class="product-desc text-lg leading-relaxed mb-[15px] bg-blue-50 p-4 rounded-xl text-gray-700">
                {{ product.description }}
              </p>

              <!-- Color Selection -->
              <div class="color-selection mb-[15px]" v-if="product.colors && product.colors.length > 0">
                <p class="text-[1.5rem] font-[450] mb-3">Color</p>
                <div class="flex flex-wrap gap-[10px]">
                  <button
                    v-for="color in product.colors"
                    :key="getColorName(color)"
                    @click="selectedColor = getColorName(color)"
                    :class="[
                      'py-[6px] px-[10px] rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 border-2',
                      selectedColor === getColorName(color)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                        : isColorAvailable(color)
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50',
                    ]"
                    :disabled="!isColorAvailable(color)"
                  >
                    {{ getColorName(color) }}
                    <span v-if="isColorPopular(color)" class="text-xs text-orange-500 ml-1">🔥</span>
                  </button>
                </div>
              </div>

              <!-- Warranty Selection -->
              <div class="warranty mb-[10px]" v-if="product.warranties && product.warranties.length > 0">
                <p class="text-lg font-semibold text-gray-900 mb-[5px]">Warranty Protection</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="warranty in product.warranties"
                    :key="warranty.name || warranty"
                    @click="selectedWarranty = warranty.name || warranty"
                    :class="[
                      'waranty-instance px-4 py-4 text-center transition-all duration-200 transform cursor-pointer',
                      selectedWarranty === (warranty.name || warranty)
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                    ]"
                  >
                    <div class="font-semibold">{{ warranty.name || warranty }}</div>
                    <div v-if="warranty.duration" class="text-sm mt-1">{{ warranty.duration }}</div>
                    <div v-if="warranty.price > 0" class="text-sm font-bold text-green-600 mt-1">
                      +Ksh{{ warranty.price }}
                    </div>
                    <div v-else class="text-sm text-green-600 mt-1">FREE</div>
                  </div>
                </div>
              </div>

              <!-- Quantity and Actions -->
              <div class="qty-actions bg-gray-50 rounded-2xl p-6 mb-[20px]">
                <div class="flex items-center justify-between gap-4">
                  <!-- Quantity Selector -->
                  <div class="quantity-selector flex items-center gap-[10px]">
                    <p class="text-lg font-semibold text-gray-900">Quantity</p>
                    <div class="qty-btns flex items-center rounded-xl bg-white">
                      <button
                        @click="decrementQuantity"
                        class="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors"
                        :disabled="quantity <= 1"
                      >
                        −
                      </button>
                      <span class="px-6 py-3 text-lg font-bold text-gray-900 min-w-12 text-center">
                        {{ quantity }}
                      </span>
                      <button
                        @click="incrementQuantity"
                        class="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-r-xl transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="action-btns flex gap-[6px] sm:w-auto">
                    <button
                      @click="addToCartHandler"
                      class="add-btn flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                        <font-awesome-icon :icon="['fas', 'shopping-cart']" class="w-4 h-4" />
                        Add to Cart
                    </button>
                    <button
                      @click="addToWishlist"
                      class="wishlist-btn px-4 py-3 border-2 border-gray-300 rounded-xl transition-all duration-200 transform hover:scale-105 hover:border-red-400"
                    >
                      <font-awesome-icon :icon="['fas', 'heart']" class="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Trust Badges -->
            <div class="trust-badges grid grid-cols-2 gap-[6px] text-center">
              <div
                class="badge bg-white flex flex-col items-center p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <div class="text-2xl mb-2 text-blue-600">
                  <font-awesome-icon :icon="['fas', 'truck']" />
                </div>
                <p class="text-sm font-semibold text-gray-900">Free Shipping</p>
                <p class="text-xs text-gray-500">Over $100</p>
              </div>
              <div
                class="badge bg-white flex flex-col items-center p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <div class="text-2xl mb-2 text-green-600">
                  <font-awesome-icon :icon="['fas', 'clock-rotate-left']" />
                </div>
                <p class="text-sm font-semibold text-gray-900">30-Day Returns</p>
                <p class="text-xs text-gray-500">Easy returns</p>
              </div>
            </div>

            </div>
          </div>

          <!-- Features & Specifications -->
          <div class="features-specifications my-[20px] p-[20px]">
            <div class="grid lg:grid-cols-2 gap-8">
              <!-- Features -->
              <div class="features bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl" v-if="product.features && product.features.length > 0">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <ul class="space-y-3">
                  <li
                    v-for="(feature, index) in product.features"
                    :key="index"
                    class="flex items-center gap-3 text-gray-700"
                  >
                    <span class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <!-- Specifications -->
              <div class="specifications bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl" v-if="product.specifications && Object.keys(product.specifications).length > 0">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
                <div class="space-y-4">
                  <div
                    v-for="(value, key) in product.specifications"
                    :key="key"
                    class="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <dt class="text-gray-600 font-medium">{{ key }}</dt>
                    <dd class="font-semibold text-gray-900">{{ value }}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
.detail-container {
  width: 90%;
  padding-top: 20px;
}

.breadcrumbs ol {
  list-style-type: none;
  color: #804d91;
}

.breadcrumbs a {
  text-decoration: none;
  color: #804d91;
}

.image-gallery {
  margin-top: 20px;
}

.main-img {
  width: 100%;
  border-radius: 20px;
}

.discount-badge,
.new-badge {
  z-index: 20; /* or any high number */
  margin-top: 12px;
  margin-left: 6px;
  border-radius: 10px;
  background: #ce7f57;
  color: #ffffff;
  font-weight: 700;
  animation: pulse 2s infinite;
}


.product-details {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px;
}

.rating {
  background: #aa69af;
  width: fit-content;
  padding: 8px 16px;
  margin-bottom: 10px;
  color: white;
  border-radius: 15px;
}

.product-desc {
  color: #5d3471;
}

.color-selection p,
.warranty p {
  color: #804d91;
  font-size: 1.5rem;
  font-weight: 500;
}

.color-selection button {
  border: 1.5px solid #aa69af;
  border-radius: 10px;
}

.waranty-instance{
  border: 1.5px solid #aa69af;
  border-radius: 10px;
}

.quantity-selector {
  border: 1px solid #5d3471;
  border-radius: 10px;
  padding: 2px 6px;
}
.qty-btns {
  padding: 2px;
}

.action-btns button {
  padding: 8px;
  border: none;
  border-radius: 5px;
}

.add-btn {
  color: white;
  background: linear-gradient(90deg, #5d3471 0%, #804d91 100%);
}

.wishlist-btn {
  background: #feb5b5;
}

.badge {
  border-radius: 10px;
  border: 1.5px solid #e1e0e0;
  color: #5e5e5e;
}

.features-specifications {
  background: #ffffff;
  border-radius: 20px;
}

.features,
.specifications {
  padding: 20px;
  border: 1.5px solid #919191;
  border-radius: 20px;
  margin-bottom: 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .breadcrumbs {
    padding: 12px 16px;
    font-size: 0.875rem;
  }

  .bg-white.rounded-3xl {
    border-radius: 1rem;
  }

  .grid.grid-cols-1.lg\:grid-cols-2 {
    gap: 2rem;
  }

  .action-btns {
    flex-direction: column;
    gap: 1rem;
  }

  .trust-badges {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
