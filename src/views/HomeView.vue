<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'
import '@/assets/base.css'
import ProductGrid from '@/components/HomeComponents/ProductGrid.vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/HomeComponents/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import sneakersImage from '@/assets/images/sneakers.jpg'
import slateWatchImage from '@/assets/images/slate-watch.jpg'
import headphonesImage from '@/assets/images/headphones.jpg'
import cozyHoodieImage from '@/assets/images/cozyhood.jpg'
import nomadBackpackImage from '@/assets/images/nomadic-backpack.jpg'
import brewMugImage from '@/assets/images/brew-mag.jpg'
import sprintShortsImage from '@/assets/images/sprint-shorts.jpg'
import haloSunglassesImage from '@/assets/images/halo-glasses.jpg'
import beatGoSpeakerImage from '@/assets/images/beatgo-speaker.jpg'

// --- Mock Product Data (Same as before) ---
const allProducts = [
  {
    id: 1,
    name: 'AeroRun Sneakers',
    price: 129,
    brand: 'Acme',
    category: 'Shoes',
    rating: 4.5,
    image: sneakersImage,
  },
  {
    id: 2,
    name: 'Slate Watch',
    price: 199,
    brand: 'Nimbus',
    category: 'Accessories',
    rating: 4.0,
    image: slateWatchImage,
  },
  {
    id: 3,
    name: 'Pulse Headphones',
    price: 149,
    brand: 'Orbit',
    category: 'Tech',
    rating: 4.2,
    image: headphonesImage,
  },
  {
    id: 4,
    name: 'Cozy Hoodie',
    price: 79,
    brand: 'Acme',
    category: 'Apparel',
    rating: 3.8,
    image: cozyHoodieImage,
  },
  {
    id: 5,
    name: 'Nomad Backpack',
    price: 219,
    brand: 'Nimbus',
    category: 'Accessories',
    rating: 4.6,
    image: nomadBackpackImage,
  },
  {
    id: 6,
    name: 'Brew Mug',
    price: 24,
    brand: 'Orbit',
    category: 'Home',
    rating: 3.5,
    image: brewMugImage,
  },
  {
    id: 7,
    name: 'Sprint Shorts',
    price: 49,
    brand: 'Acme',
    category: 'Apparel',
    rating: 4.1,
    image: sprintShortsImage,
  },
  {
    id: 8,
    name: 'Halo Sunglasses',
    price: 89,
    brand: 'Nimbus',
    category: 'Accessories',
    rating: 4.7,
    image: haloSunglassesImage,
  },
  {
    id: 9,
    name: 'BeatGo Speaker',
    price: 99,
    brand: 'Orbit',
    category: 'Tech',
    rating: 3.9,
    image: beatGoSpeakerImage,
  },
]

// --- Reactive State and Filter Logic (Same as before) ---
const currentFilters = ref({
  category: 'All',
  brands: ['Any'],
  priceRange: [0, 250],
  rating: '4+',
})

const handleFilterUpdate = (newFilters) => {
  currentFilters.value = newFilters
}

const filteredProducts = computed(() => {
  return allProducts.filter((product) => {
    // ... filtering logic remains here ...
    const categoryMatch =
      currentFilters.value.category === 'All' || product.category === currentFilters.value.category
    const brandMatch =
      currentFilters.value.brands.includes('Any') ||
      currentFilters.value.brands.includes(product.brand)
    const priceMatch = product.price <= currentFilters.value.priceRange[1]
    let minRating = 0
    if (currentFilters.value.rating === '4+') minRating = 4
    if (currentFilters.value.rating === '3+') minRating = 3
    const ratingMatch = product.rating >= minRating
    return categoryMatch && brandMatch && priceMatch && ratingMatch
  })
})
</script>

<template>
  <div class="home min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />

    <div class="main-content flex gap-[20px] w-full max-w-7xl mx-auto px-4 mt-[20px]">
      <!-- Sidebar Filters -->
      <Sidebar @update:filters="handleFilterUpdate" />

      <!-- Main content -->
      <main class="flex-1 py-8">
        <!-- Use ProductGrid component -->
        <ProductGrid :products="filteredProducts" />

        <!-- Show message if no products
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No products match your filters.</p>
        </div> -->
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
</style>
