<script setup>
import { ref, computed } from 'vue'
import NewArrivalSidebar from '@/components/NewArrivalSidebar.vue'
import NewArrivalProductCard from '@/components/NewArrivalProductCard.vue'
import NewArrivalProductGrid from '@/components/NewArrivalProductGrid.vue'
import '@/assets/base.css'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

// Import your images
import vueKnitRunner from '@/assets/images/convers.jpg'
import orionWatch from '@/assets/images/orion-watch.png'
import nomadTote from '@/assets/images/nomad-tot.jpg'
import pulseBudsX from '@/assets/images/pulse-buds.png'
import cloudKnitSweater from '@/assets/images/cloud-knit.jpg'
import arcCeramicVase from '@/assets/images/ceramic-vase.jpg'
import sprintShorts from '@/assets/images/sprint-shorts.jpg'
import haloStarShades from '@/assets/images/halo-shades.png'
import beatGoMini from '@/assets/images/beatgo-mini.png'

// --- Mock Product Data for New Arrivals ---
const newProducts = ref([
  {
    id: 10,
    name: 'Vue Knit Runner',
    price: 139,
    brand: 'Acme',
    isNew: true,
    tag: 'Arrived 1d ago',
    image: vueKnitRunner,
  },
  {
    id: 11,
    name: 'Orion Watch S2',
    price: 229,
    brand: 'Nimbus',
    isNew: true,
    tag: 'Arrived 3d ago',
    image: orionWatch,
  },
  {
    id: 12,
    name: 'Nomad Tote',
    price: 179,
    brand: 'Orbit',
    isNew: true,
    tag: 'Arrived 5d ago',
    image: nomadTote,
  },
  {
    id: 13,
    name: 'Pulse Buds X',
    price: 129,
    brand: 'Orbit',
    isNew: true,
    tag: 'Arrived 1w ago',
    image: pulseBudsX,
  },
  {
    id: 14,
    name: 'Cloud Knit Sweater',
    price: 89,
    brand: 'Acme',
    isNew: true,
    tag: 'Arrived 2w ago',
    image: cloudKnitSweater,
  },
  {
    id: 15,
    name: 'Arc Ceramic Vase',
    price: 49,
    brand: 'Nimbus',
    isNew: true,
    tag: 'Arrived 1d ago',
    image: arcCeramicVase,
  },
  {
    id: 16,
    name: 'SprintLife Shorts',
    price: 59,
    brand: 'Acme',
    isNew: true,
    tag: 'Arrived 3w ago',
    image: sprintShorts,
  },
  {
    id: 17,
    name: 'Halo Star Shades',
    price: 95,
    brand: 'Nimbus',
    isNew: true,
    tag: 'Arrived 1d ago',
    image: haloStarShades,
  },
  {
    id: 18,
    name: 'BeatGo Mini',
    price: 89,
    brand: 'Orbit',
    isNew: true,
    tag: 'Arrived 4d ago',
    image: beatGoMini,
  },
])

// --- Filter Logic ---
const currentFilters = ref({})

const handleFilterUpdate = (newFilters) => {
  currentFilters.value = newFilters
}

const filteredNewProducts = computed(() => {
  return newProducts.value
})

console.log('New Products:', newProducts.value)
</script>

<template>
  <div class="home min-h-screen bg-gray-50 place-items-center">
    <!-- Navbar -->
    <Navbar />

    <!-- Banner (Retained from your original) -->
    <div class="banner bg-gray-800 text-white py-[5px] px-4 my-[10px]">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-[20px] py-[10px]">
        <div class="">
          <h1 class="banner-ttl text-3xl font-bold mb-1">Fresh drops for the season</h1>
          <p class="text-gray-400">Curated products added this week. | Limited quantities.</p>
        </div>
        <button
          class="bg-indigo-600 hover:bg-indigo-700 font-medium py-2 px-4 rounded-lg px-[20px]"
        >
          Update daily
        </button>
      </div>
    </div>

    <!-- Main Content Area (Matches HomeView layout) -->
    <div class="main-content flex gap-[20px] w-full max-w-7xl mx-auto px-4 mt-[20px]">
      <!-- Sidebar Filters -->
      <NewArrivalSidebar @update:filters="handleFilterUpdate" />

      <!-- Main content -->
      <main class="flex-1 py-8">
        <NewArrivalProductGrid :products="filteredNewProducts" :currentPage="1" :totalPages="2" />

        <!-- Show message if no products -->
        <div v-if="filteredNewProducts.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No products match your filters.</p>
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

.banner {
  background: #0f1724;
  width: 90%;
  border-radius: 20px;
}

.banner-ttl {
  font-weight: 600;
  color: #ffffff;
}

.banner button {
  height: 36px;
  border-radius: 15px;
  border: none;
}
</style>
