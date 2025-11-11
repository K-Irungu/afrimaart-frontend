<script setup>
import { ref, computed } from 'vue'
import '@/assets/base.css'
import Navbar from '@/components/Navbar.vue'
import DealsSidebar from '@/components/DealsComponets/DealsSidebar.vue'
import DealsProductGrid from '@/components/DealsComponets/DealsProductGrid.vue'
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
const dealProducts = ref([
  {
    id: 1,
    name: 'Vue Knit Runner',
    price: 90,
    originalPrice: 139,
    discount: 35,
    dealTag: 'Flash',
    image: vueKnitRunner,
  },
  {
    id: 2,
    name: 'Orion Watch S2',
    price: 169,
    originalPrice: 229,
    discount: 26,
    dealTag: 'Clearance',
    image: orionWatch,
  },
  {
    id: 3,
    name: 'Nomad Tote',
    price: 139,
    originalPrice: 179,
    discount: 22,
    dealTag: 'Deal',
    image: nomadTote,
  },
  {
    id: 4,
    name: 'Pulse Buds X',
    price: 90,
    originalPrice: 129,
    discount: 30,
    dealTag: 'Flash',
    image: pulseBudsX,
  },
  {
    id: 5,
    name: 'Cloud Knit Sweater',
    price: 74,
    originalPrice: 99,
    discount: 25,
    dealTag: 'Deal',
    image: cloudKnitSweater,
  },
  {
    id: 6,
    name: 'Arc Ceramic Vase',
    price: 39,
    originalPrice: 49,
    discount: 20,
    dealTag: 'Clearance',
    image: arcCeramicVase,
  },
  {
    id: 7,
    name: 'SprintLife Shorts',
    price: 39,
    originalPrice: 59,
    discount: 33,
    dealTag: 'Deal',
    image: sprintShorts,
  },
  {
    id: 8,
    name: 'Halo Slim Shades',
    price: 66,
    originalPrice: 95,
    discount: 30,
    dealTag: 'Bundle',
    image: haloStarShades,
  },
  {
    id: 9,
    name: 'BeatGo Mini',
    price: 65,
    originalPrice: 89,
    discount: 26,
    dealTag: 'Deal',
    image: beatGoMini,
  },
])

// --- Filter Logic Handler ---
const currentFilters = ref({})

const handleFilterUpdate = (newFilters) => {
  currentFilters.value = newFilters
  // Filtering logic would be applied here in a real application
}

const filteredDealProducts = computed(() => {
  // For simplicity, returning all products
  return dealProducts.value
})
</script>

<template>
  <div class="home min-h-screen bg-gray-50 place-items-center">
    <!-- Navbar -->
    <Navbar />

    <!-- Banner  -->
    <div class="banner bg-gray-800 text-white py-[5px] px-4 my-[20px]">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-[20px] py-[10px]">
        <div class="">
          <h1 class="banner-ttl text-3xl font-bold mb-1">Save big on top products</h1>
          <p class="text-gray-400">Curated products added this week. | Limited quantities.</p>
        </div>
        <button
          class="bg-[#5d3471] hover:bg-[#AA69AF] text-[#ffff] font-medium py-[5px] px-[8px] rounded-lg transition-all duration-200"
        >
          Update daily
        </button>
      </div>
    </div>

    <!-- Main Content Area (Matches HomeView layout) -->
    <div class="main-content flex gap-[20px] w-full max-w-7xl mx-auto px-4 mt-[20px]">
      <!-- Sidebar Filters -->
      <DealsSidebar @update:filters="handleFilterUpdate" />

      <!-- Main content -->
      <main class="flex-1 py-8">
        <DealsProductGrid :products="filteredDealProducts" :currentPage="1" :totalPages="2" />

        <!-- Show message if no products -->
        <div v-if="filteredDealProducts.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No products match your filters.</p>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
.home {
  background: #fff7fc;
  color: #1f2937;
}

.main-content {
  width: 90%;
  color: #000000;
}

.banner {
  background: linear-gradient(135deg, #5d3471, #804d91, #aa69af);
  width: 90%;
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
</style>
