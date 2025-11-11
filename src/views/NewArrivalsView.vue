<script setup>
import { ref, computed } from 'vue'
import NewArrivalSidebar from '@/components/NewArrivalComponents/NewArrivalSidebar.vue'
import NewArrivalProductGrid from '@/components/NewArrivalComponents/NewArrivalProductGrid.vue'
import '@/assets/base.css'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

// Import product images
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

// --- Filters ---
const currentFilters = ref({})
const handleFilterUpdate = (newFilters) => (currentFilters.value = newFilters)

// --- Filtered Products (for now all) ---
const filteredNewProducts = computed(() => newProducts.value)
</script>

<template>
  <div class="home min-h-screen bg-[#FFF7FC]">
    <!-- Navbar -->
    <Navbar />

    <!-- Banner -->
    <div
      class="banner my-[20px] mx-auto flex items-center justify-between max-w-7xl px-[20px] py-[15px] rounded-2xl shadow-md"
    >
      <div>
        <h1 class="banner-ttl text-3xl font-bold text-white mb-1">Fresh drops for the season</h1>
        <p class="text-[#E8B6D5] font-medium">Curated new arrivals | Limited quantities.</p>
      </div>
      <button
        class="bg-[#5d3471] hover:bg-[#AA69AF] text-[#ffff] font-medium py-[5px] px-[8px] rounded-lg transition-all duration-200"
      >
        Update Daily
      </button>
    </div>

    <!-- Main Content -->
    <div class="main-content flex gap-[20px] w-full max-w-7xl mx-auto px-4 mt-[20px]">
      <!-- Sidebar -->
      <NewArrivalSidebar @update:filters="handleFilterUpdate" />

      <!-- Product Grid -->
      <main class="flex-1 py-8">
        <NewArrivalProductGrid :products="filteredNewProducts" :currentPage="1" :totalPages="2" />

        <!-- Empty State -->
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
.home {
  background: #fff7fc;
  color: #1f2937;
}

/* Banner */
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
  border: none;
  border-radius: 10px;
}

.main-content {
  width: 90%;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    width: 95%;
  }
  .banner {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>
