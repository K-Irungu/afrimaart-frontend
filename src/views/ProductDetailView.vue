<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import sneakersImage from '@/assets/images/sneakers.jpg'
import slateWatchImage from '@/assets/images/slate-watch.jpg'
import headphonesImage from '@/assets/images/headphones.jpg'
import cozyHoodieImage from '@/assets/images/cozyhood.jpg'
import nomadBackpackImage from '@/assets/images/nomadic-backpack.jpg'
import brewMugImage from '@/assets/images/brew-mag.jpg'
import sprintShortsImage from '@/assets/images/sprint-shorts.jpg'
import haloSunglassesImage from '@/assets/images/halo-glasses.jpg'
import beatGoSpeakerImage from '@/assets/images/beatgo-speaker.jpg'
import Footer from '@/components/Footer.vue'

const route = useRoute()

// Your actual products database with images
const productsDatabase = {
  1: {
    id: 1,
    name: 'AeroRun Sneakers',
    price: 129,
    brand: 'Acme',
    category: 'Shoes',
    rating: 4.5,
    image: sneakersImage,
    description:
      'Premium running sneakers with advanced cushioning technology for maximum comfort and performance during your workouts.',
    features: [
      'Advanced cushioning technology',
      'Breathable mesh upper',
      'Non-slip rubber sole',
      'Lightweight design',
      'Multiple color options',
    ],
    specifications: {
      Material: 'Mesh & Synthetic',
      Weight: '280 g',
      Sole: 'Rubber',
      Closure: 'Lace-up',
      Style: 'Running Shoes',
    },
    colors: [
      { name: 'Black', available: true, popular: true },
      { name: 'White', available: true, popular: false },
      { name: 'Blue', available: true, popular: false },
    ],
    warranties: [
      { name: 'Standard', price: 0, duration: '6 months' },
      { name: 'Extended', price: 25, duration: '2 years' },
    ],
  },
  2: {
    id: 2,
    name: 'Slate Watch',
    price: 199,
    brand: 'Nimbus',
    category: 'Accessories',
    rating: 4.0,
    image: slateWatchImage,
    description:
      'Elegant and sophisticated timepiece with premium materials and precision movement for the modern professional.',
    features: [
      'Premium stainless steel case',
      'Sapphire crystal glass',
      'Water resistant up to 50m',
      'Quartz movement',
      'Genuine leather strap',
    ],
    specifications: {
      'Case Material': 'Stainless Steel',
      Glass: 'Sapphire Crystal',
      'Water Resistance': '50m',
      Movement: 'Quartz',
      Strap: 'Genuine Leather',
    },
    colors: [
      { name: 'Silver', available: true, popular: true },
      { name: 'Black', available: true, popular: false },
      { name: 'Rose Gold', available: false, popular: false },
    ],
    warranties: [{ name: 'Standard', price: 0, duration: '2 years' }],
  },
  3: {
    id: 3,
    name: 'Pulse Headphones',
    price: 149,
    brand: 'Orbit',
    category: 'Tech',
    rating: 4.2,
    image: headphonesImage,
    description:
      'Immersive sound experience with active noise cancellation and all-day comfort for music lovers and professionals.',
    features: [
      'Active Noise Cancellation (ANC)',
      '40-hour battery life',
      'Bluetooth 5.3 connectivity',
      'Foldable design',
      'Voice assistant compatible',
    ],
    specifications: {
      'Driver Size': '40 mm',
      'Battery Life': '40 hours',
      Charging: 'USB-C',
      Connectivity: 'Bluetooth 5.3',
      Weight: '250 g',
    },
    colors: [
      { name: 'Black', available: true, popular: true },
      { name: 'White', available: true, popular: false },
      { name: 'Blue', available: false, popular: false },
    ],
    warranties: [
      { name: 'Standard', price: 0, duration: '1 year' },
      { name: 'Extended', price: 29, duration: '3 years' },
    ],
  },
  4: {
    id: 4,
    name: 'Cozy Hoodie',
    price: 79,
    brand: 'Acme',
    category: 'Apparel',
    rating: 3.8,
    image: cozyHoodieImage,
    description:
      'Ultra-soft and comfortable hoodie made from premium cotton blend, perfect for casual wear and lounging.',
    features: [
      'Premium cotton blend',
      'Kangaroo pocket',
      'Ribbed cuffs and hem',
      'Available in multiple colors',
      'Machine washable',
    ],
    specifications: {
      Material: '80% Cotton, 20% Polyester',
      Fit: 'Regular',
      Care: 'Machine Wash',
      Style: 'Pullover',
      Neck: 'Hooded',
    },
    colors: [
      { name: 'Gray', available: true, popular: true },
      { name: 'Black', available: true, popular: false },
      { name: 'Navy', available: true, popular: false },
    ],
    warranties: [{ name: 'Standard', price: 0, duration: '1 year' }],
  },
  5: {
    id: 5,
    name: 'Nomad Backpack',
    price: 219,
    brand: 'Nimbus',
    category: 'Accessories',
    rating: 4.6,
    image: nomadBackpackImage,
    description:
      'Durable and spacious backpack designed for travelers and commuters with multiple compartments and laptop sleeve.',
    features: [
      'Water-resistant material',
      'Laptop compartment',
      'Multiple organization pockets',
      'Padded shoulder straps',
      'TSA-friendly design',
    ],
    specifications: {
      Material: 'Nylon',
      Capacity: '30L',
      'Laptop Size': 'Up to 17"',
      Weight: '1.1 kg',
      Color: 'Black',
    },
    colors: [
      { name: 'Black', available: true, popular: true },
      { name: 'Gray', available: true, popular: false },
      { name: 'Green', available: false, popular: false },
    ],
    warranties: [
      { name: 'Standard', price: 0, duration: '2 years' },
      { name: 'Lifetime', price: 49, duration: 'Lifetime' },
    ],
  },
  6: {
    id: 6,
    name: 'Brew Mug',
    price: 24,
    brand: 'Orbit',
    category: 'Home',
    rating: 3.5,
    image: brewMugImage,
    description:
      'Perfect ceramic mug for your morning coffee or tea, featuring a comfortable handle and elegant design.',
    features: [
      'High-quality ceramic',
      'Dishwasher safe',
      'Microwave safe',
      'Comfortable handle',
      '12oz capacity',
    ],
    specifications: {
      Material: 'Ceramic',
      Capacity: '12 oz',
      Care: 'Dishwasher Safe',
      Style: 'Classic',
      Weight: '350 g',
    },
    colors: [
      { name: 'White', available: true, popular: true },
      { name: 'Black', available: true, popular: false },
      { name: 'Blue', available: true, popular: false },
    ],
    warranties: [{ name: 'Standard', price: 0, duration: '6 months' }],
  },
  7: {
    id: 7,
    name: 'Sprint Shorts',
    price: 49,
    brand: 'Acme',
    category: 'Apparel',
    rating: 4.1,
    image: sprintShortsImage,
    description:
      'Lightweight and breathable running shorts with moisture-wicking technology for optimal performance.',
    features: [
      'Moisture-wicking fabric',
      'Built-in liner',
      'Zippered pocket',
      'Elastic waistband',
      'Reflective details',
    ],
    specifications: {
      Material: 'Polyester',
      Fit: 'Regular',
      Length: '7-inch',
      Care: 'Machine Wash',
      Style: 'Athletic',
    },
    colors: [
      { name: 'Black', available: true, popular: true },
      { name: 'Navy', available: true, popular: false },
      { name: 'Red', available: true, popular: false },
    ],
    warranties: [{ name: 'Standard', price: 0, duration: '1 year' }],
  },
  8: {
    id: 8,
    name: 'Halo Sunglasses',
    price: 89,
    brand: 'Nimbus',
    category: 'Accessories',
    rating: 4.7,
    image: haloSunglassesImage,
    description:
      'Stylish and protective sunglasses with UV400 protection and polarized lenses for crystal-clear vision.',
    features: [
      'UV400 protection',
      'Polarized lenses',
      'Lightweight frame',
      'Scratch-resistant',
      'Includes case',
    ],
    specifications: {
      'Lens Type': 'Polarized',
      'UV Protection': 'UV400',
      'Frame Material': 'Acetate',
      'Lens Material': 'Polycarbonate',
      Style: 'Aviator',
    },
    colors: [
      { name: 'Black', available: true, popular: true },
      { name: 'Brown', available: true, popular: false },
      { name: 'Tortoise', available: false, popular: false },
    ],
    warranties: [{ name: 'Standard', price: 0, duration: '1 year' }],
  },
  9: {
    id: 9,
    name: 'BeatGo Speaker',
    price: 99,
    brand: 'Orbit',
    category: 'Tech',
    rating: 3.9,
    image: beatGoSpeakerImage,
    description:
      'Portable Bluetooth speaker with 360° sound, waterproof design, and long battery life for music on the go.',
    features: [
      '360° surround sound',
      'IPX7 waterproof',
      '12-hour battery',
      'Bluetooth 5.0',
      'Built-in microphone',
    ],
    specifications: {
      'Battery Life': '12 hours',
      Waterproof: 'IPX7',
      Connectivity: 'Bluetooth 5.0',
      Weight: '450 g',
      Charging: 'USB-C',
    },
    colors: [
      { name: 'Black', available: true, popular: true },
      { name: 'Blue', available: true, popular: false },
      { name: 'Red', available: true, popular: false },
    ],
    warranties: [
      { name: 'Standard', price: 0, duration: '1 year' },
      { name: 'Extended', price: 19, duration: '2 years' },
    ],
  },
}

// Reactive product data
const product = ref({})
const selectedColor = ref('')
const selectedWarranty = ref('')
const quantity = ref(1)

// Fetch product when component mounts or route changes
const fetchProduct = () => {
  const productId = route.params.id
  product.value = productsDatabase[productId] || productsDatabase['1']

  // Set default selections
  selectedColor.value = product.value.colors?.[0]?.name || ''
  selectedWarranty.value = product.value.warranties?.[0]?.name || ''
}

onMounted(() => {
  fetchProduct()
})

// Watch for route changes
watch(() => route.params.id, fetchProduct)

const incrementQuantity = () => quantity.value++
const decrementQuantity = () => (quantity.value > 1 ? quantity.value-- : null)

const addToCart = () => {
  console.log('Added to cart:', {
    product: product.value.name,
    color: selectedColor.value,
    warranty: selectedWarranty.value,
    quantity: quantity.value,
  })
  // Add cart logic here
}

const addToWishlist = () => {
  console.log('Added to wishlist:', product.value.name)
  // Add wishlist logic here
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Navbar -->
    <Navbar />

    <div class="detail-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="breadcrumbs mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li><a href="#" class="hover:text-blue-600 transition-colors">Home</a></li>
          <li class="flex items-center">
            <span class="mx-2">›</span>
            <a href="#" class="hover:text-blue-600 transition-colors">{{ product.category }}</a>
          </li>
          <li class="flex items-center">
            <span class="mx-2">›</span>
            <span class="text-gray-900 font-medium">{{ product.name }}</span>
          </li>
        </ol>
      </nav>

      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div class="grid grid-cols-2 lg:grid-cols-2 gap-[10px] p-8">
          <!-- Image Gallery - Simplified -->
          <div class="image-gallery">
            <div class="relative rounded-2xl overflow-hidden bg-gray-100">
              <img
                :src="product.image"
                :alt="product.name"
                class="main-img w-full h-[600px] h-96 lg:h-[500px] object-cover"
              />
            </div>
          </div>

          <!-- Product Details -->
          <div class="product-details">
            <!-- Header with Price -->
            <div class="flex justify-between items-center mb-[10px]">
              <h1 class="text-4xl font-[600] text-gray-900 leading-tight">{{ product.name }}</h1>
              <div class="text-right">
                <p class="text-4xl font-[600] text-blue-700">Ksh{{ product.price?.toFixed(2) }}</p>
              </div>
            </div>

            <!-- Rating and Stock -->
            <div class="rating flex items-center gap-[8px] mb-[10px]">
              <div class="flex items-center">
                <div class="flex text-yellow-400 mr-2">
                  <span v-for="star in 5" :key="star" class="text-xl">
                    {{ star <= Math.floor(product.rating || 0) ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-gray-700 font-semibold ml-1">{{ product.rating }}</span>
                <span class="text-gray-500 ml-2">{{ product.reviewCount }}</span>
              </div>
              <div class="flex items-center text-green-600 font-semibold">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                In Stock • Ready to ship
              </div>
            </div>

            <!-- Description -->
            <p class="product-desc text-[1rem] leading-relaxed mb-[20px] bg-blue-50 p-4 rounded-xl">
              {{ product.description }}
            </p>

            <!-- Color Selection -->
            <div class="color-selection mb-[20px]" v-if="product.colors && product.colors.length > 0">
              <p class="text-lg font-semibold text-gray-900 mb-[8px]">Color</p>
              <div class="flex gap-[5px]">
                <button
                  v-for="color in product.colors"
                  :key="color.name"
                  @click="selectedColor = color.name"
                  :class="[
                    'px-4 py-2 rounded-[10px] text-sm font-semibold transition-all duration-200 transform hover:scale-105 border-2',
                    selectedColor === color.name
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : color.available
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50',
                  ]"
                  :disabled="!color.available"
                >
                  {{ color.name }}
                  <span v-if="color.popular" class="text-xs text-orange-500 ml-1">🔥</span>
                </button>
              </div>
            </div>

            <!-- Warranty Selection -->
            <div
              class="warranty mb-[20px]"
              v-if="product.warranties && product.warranties.length > 0"
            >
              <p class="text-[1.2rem] font-[500] text-gray-900 mb-[6px]">Warranty Protection</p>
              <div class="warranty-details flex gap-[10px]">
                <div
                  v-for="warranty in product.warranties"
                  :key="warranty.name"
                  @click="selectedWarranty = warranty.name"
                  :class="[
                    'flex-1 px-4 py-4 text-center transition-all duration-200 transform border-[1.5px] border-[#e1e0e0] rounded-[20px]',
                    selectedWarranty === warranty.name
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                  ]"
                >
                  <div class="font-semibold">{{ warranty.name }}</div>
                  <div class="text-sm mt-1">{{ warranty.duration }}</div>
                  <div v-if="warranty.price > 0" class="text-sm font-bold text-green-600 mt-1">
                    +${{ warranty.price }}
                  </div>
                  <div v-else class="text-sm text-green-600 mt-1">FREE</div>
                </div>
              </div>
            </div>

            <!-- Quantity and Actions -->
            <div class="qty-actions bg-gray-50 rounded-2xl p-6 mb-[40px]">
              <div class="flex items-center justify-between">
                <!-- Quantity Selector -->
                <div class="quantity-selector flex items-center gap-[6px]">
                  <p class="text-lg font-semibold text-gray-900">Quantity</p>
                  <div class="qty-btns flex items-center gap-[5px] rounded-xl bg-white">
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
                <div class="action-btns flex gap-[8px]">
                  <button
                    @click="addToCart"
                    class="add-btn flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-[6px] transform hover:scale-105"
                  >
                    <font-awesome-icon :icon="['fas', 'shopping-cart']" class="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    @click="addToWishlist"
                    class="wishlist-btn px-4 py-3 border-2 border-gray-300 rounded-xl transition-all duration-200 transform hover:scale-105"
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
        <div
          class="features-specifications mt-[10px] p-[18px]"
          v-if="product.features || product.specifications"
        >
          <div class="grid lg:grid-cols-2 gap-8 p-8">
            <!-- Features -->
            <div
              class="features bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl"
              v-if="product.features"
            >
              <h2 class="text-2xl font-[500] text-gray-900 mb-6">Key Features</h2>
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
            <div
              class="specifications bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl"
              v-if="product.specifications"
            >
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

    <!-- Footer CTA -->
    <div class="mt-8">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  width: 90%;
  padding-top: 20px;
  color: #5d3471;
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

.product-details {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px;
}

.rating {
  background: #aa69af;
  width: fit-content;
  padding: 8px;
  margin-bottom: 10px;
  color: white;
  border-radius: 15px;
}

.product-desc {
  color: #5d3471;
}

.color-selection p {
  color: #804d91;
  font-size: 1.2rem;
  font-weight: 500;
}

.warranty p {
  color: #804d91;
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

/* Smooth scrolling for the page */
html {
  scroll-behavior: smooth;
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