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
    images: [
      sneakersImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Side+View',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Top+View',
      'https://via.placeholder.com/600x400/9CA3AF/374151?text=Back+View',
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
    images: [
      slateWatchImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Side+View',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Close+Up',
    ],
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
    images: [
      headphonesImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Side+View',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Folded+View',
      'https://via.placeholder.com/600x400/9CA3AF/374151?text=Case+Included',
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
    images: [
      cozyHoodieImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Back+View',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Detail+View',
    ],
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
    images: [
      nomadBackpackImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Front+View',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Inside+View',
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
    images: [
      brewMugImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Side+View',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Top+View',
    ],
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
    images: [
      sprintShortsImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Back+View',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Detail+View',
    ],
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
    images: [
      haloSunglassesImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Case+Included',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Side+View',
    ],
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
    images: [
      beatGoSpeakerImage,
      'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Side+View',
      'https://via.placeholder.com/600x400/D1D5DB/4B5563?text=Back+View',
    ],
  },
}

// Reactive product data
const product = ref({})
const selectedColor = ref('')
const selectedWarranty = ref('')
const quantity = ref(1)
const selectedImage = ref(0)

// Fetch product when component mounts or route changes
const fetchProduct = () => {
  const productId = route.params.id
  product.value = productsDatabase[productId] || productsDatabase['1']

  // Set default selections
  selectedColor.value = product.value.colors?.[0]?.name || ''
  selectedWarranty.value = product.value.warranties?.[0]?.name || ''
  selectedImage.value = 0
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

const selectImage = (index) => {
  selectedImage.value = index
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

      <div class="bg-white rounded-3xl hadow-2xl overflow-hidden">
        <div class="grid grid-cols-2 gap-[10px] lg:flex lg:gap-8 p-8">
          <!-- Image Gallery -->
          <div class="image-gallery lg:w-1/2">
            <div class="relative rounded-2xl overflow-hidden mb-6 bg-gray-100">
              <img
                :src="product.images?.[selectedImage]"
                :alt="product.name"
                class="main-img w-full h-96 object-cover transition-opacity duration-300"
              />
              <!-- Badges -->
              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <span
                  class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                >
                  🚚 Free Shipping
                </span>
                <span
                  v-if="product.inStock !== false"
                  class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                >
                  ✅ In Stock
                </span>
              </div>
            </div>

            <!-- Thumbnail Gallery -->
            <div class="grid grid-cols-4 gap-[5px]">
              <div
                v-for="(image, index) in product.images"
                :key="index"
                @click="selectImage(index)"
                :class="[
                  'thumbnail cursor-pointer rounded-xl transition-all duration-200 transform hover:scale-105',
                  selectedImage === index
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <img
                  :src="image"
                  :alt="`Thumbnail ${index + 1}`"
                  class="thumbnail-img w-full h-20 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          <!-- Product Details -->
          <div class="product-details lg:w-1/2 mt-8 lg:mt-0">
            <!-- Header with Price -->
            <div class="flex justify-between items-start mb-[10px]">
              <h1 class="text-4xl font-[600] text-gray-900 leading-tight">{{ product.name }}</h1>
              <div class="text-right">
                <p class="text-4xl font-[600] text-blue-700">Ksh{{ product.price?.toFixed(2) }}</p>
              </div>
            </div>

            <!-- Rating and Stock -->
            <div class="rating flex items-center gap-[8px] mb-6">
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
            <p class="product-desc text-[1rem] leading-relaxed mb-[8px] bg-blue-50 p-4 rounded-xl">
              {{ product.description }}
            </p>

            <!-- Color Selection -->
            <div class="color-selection mb-8" v-if="product.colors && product.colors.length > 0">
              <p class="text-lg font-semibold text-gray-900 mb-4">Color</p>
              <div class="flex gap-[5px]">
                <button
                  v-for="color in product.colors"
                  :key="color.name"
                  @click="selectedColor = color.name"
                  :class="[
                    'px-[8px] py-[5px] rounded-[10px] text-sm font-semibold transition-all duration-200 transform hover:scale-105',
                    selectedColor === color.name
                      ? 'text-white shadow-lg'
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
              class="warranty my-[10px]"
              v-if="product.warranties && product.warranties.length > 0"
            >
              <p class="text-[1.2rem] font-[500] text-gray-900 mb-[4px]">Warranty Protection</p>
              <div class="warranty-details flex gap-[15px]">
                <button
                  v-for="warranty in product.warranties"
                  :key="warranty.name"
                  @click="selectedWarranty = warranty.name"
                  :class="[
                    'flex-1 px-4 py-4 rounded-xl text-center transition-all duration-200 transform',
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
                </button>
              </div>
            </div>

            <!-- Quantity and Actions -->
            <div class="qty-actions bg-gray-50 rounded-2xl p-6 mb-[10px] mt-[20px]">
              <div class="flex items-center justify-between">
                <!-- Quantity Selector -->
                <div class="dty-selector flex items-center gap-4">
                  <p class="text-lg font-semibold text-gray-900 mr-[10px]">Quantity</p>
                  <div class="qty-btns flex items-cente gap-[8px] rounded-xl bg-white">
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
                <div class="action-btns flex gap-[10px]">
                  <button
                    @click="addToCart"
                    class="add-btn flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-[6px] px-[8px] rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <font-awesome-icon :icon="['fas', 'shopping-cart']" class="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    @click="addToWishlist"
                    class="whishlist-btn px-[ppx] py-[4px] border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                  >
                    <span class="text-xl">
                      <font-awesome-icon :icon="['fas', 'heart']" class="w-4 h-4 text-red-300" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Trust Badges -->
            <div class="trust-badges grid grid-cols-3 gap-[20px] text-center mb-8 w-full">
              <div
                class="badge-1 bg-white flex item-center p-[5px] rounded-xl border border-gray-200 shadow-sm"
              >
                <div class="text-2xl mb-2">
                  <font-awesome-icon :icon="['fas', 'truck']" class="w-4 h-4" />
                </div>
                <p class="text-sm font-semibold text-gray-900">Free Shipping</p>
                <p class="text-xs text-gray-500">Over $100</p>
              </div>
              <div
                class="badge-2 bg-white flex item-center p-[5px] rounded-xl border border-gray-200 shadow-sm w-"
              >
                <div class="text-2xl mb-2">
                  <font-awesome-icon :icon="['fas', 'clock-rotate-left']" class="w-4 h-4" />
                </div>
                <p class="text-sm font-semibold text-gray-900">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Features & Specifications -->
        <div
          class="features-specifications mt-[20px]"
          v-if="product.features || product.specifications"
        >
          <div class="grid lg:grid-cols-2 gap-[10px] p-[10px]">
            <!-- Features -->
            <div
              class="features bg-gradient-to-br from-blue-50 to-indigo-50 p-[8px] rounded-2xl"
              v-if="product.features"
            >
              <h2 class="text-2xl font-[500] text-gray-900 mb-6 flex items-center gap-3">
                Key Features
              </h2>
              <ul class="space-y-3">
                <li
                  v-for="(feature, index) in product.features"
                  :key="index"
                  class="flex items-center gap-3 text-gray-700"
                >
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <!-- Specifications -->
            <div
              class="specifications bg-gradient-to-br from-gray-50 to-blue-50 p-[8px] rounded-2xl"
              v-if="product.specifications"
            >
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                Specifications
              </h2>
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
    <div class="mt-[10px]">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  width: 90%;
  padding-top: 20px;
  color: black;
}

.breadcrumbs ol {
  list-style-type: none;
  color: black;
}

.breadcrumbs a {
  text-decoration: none;
  color: black;
}

.image-gallery {
  margin-top: 20px;
}

.main-img {
  width: 100%;
  height: 500px;
  border-radius: 20px;
}

.thumbnail-img {
  border: none;
  width: 100%;
  height: 100px;
  border-radius: 20px;
}

.thumbnail {
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.thumbnail:hover {
  transform: translateY(-2px);
}

.product-details {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px;
}

.rating {
  background: #0f1724;
  width: fit-content;
  padding: 8px;
  margin-bottom: 10px;
  color: white;
  border-radius: 10px;
}

.product-desc {
  color: #919191;
}

.color-selection p {
  color: #868585;
  font-size: 1.2rem;
  font-weight: 500;
}

.color-selection button {
  border: none;
}
.warranty p {
  color: #868585;
}
.warranty-details button {
  width: 60px;
}

.qty-btns {
  border: 1.2px solid #efefef;
  padding: 2px;
}

.action-btns button {
  border: none;
  border-radius: 5px;
}

.add-btn {
  color: white;
  background: #0066ff;
}

.whishlist-btn {
  background: #feb5b5;
}

.badge-1,
.badge-2 {
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
  border: 1.5px solid #919191;
  border-radius: 20px;
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
}
</style>
