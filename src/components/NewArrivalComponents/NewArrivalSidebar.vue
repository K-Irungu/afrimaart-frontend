<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['update:filters'])

// New Mock Filter Data
const timeframes = ['Last 7 days', 'Last 30 days']
const highlights = ['Limited', 'Staff Picks', 'Eco-friendly']

// Shared Filter Data
const categories = ['All', 'Apparel', 'Shoes', 'Accessories', 'Home', 'Tech']
const brands = ['Any', 'Acme', 'Nimbus', 'Orbit']

const selectedFilters = ref({
  timeframe: 'Last 7 days',
  category: 'All',
  brands: ['Any'],
  highlights: [],
  priceRange: [0, 300],
})

// Function to handle filter updates and emit the change
const updateFilters = () => {
  emit('update:filters', selectedFilters.value)
}

// Functions to handle specific filter changes
const selectTimeframe = (time) => {
  selectedFilters.value.timeframe = time
  updateFilters()
}

const selectCategory = (cat) => {
  selectedFilters.value.category = cat
  updateFilters()
}

const toggleBrand = (brand) => {
  const index = selectedFilters.value.brands.indexOf(brand)
  if (index > -1) {
    selectedFilters.value.brands.splice(index, 1)
  } else {
    selectedFilters.value.brands.push(brand)
  }
  updateFilters()
}

const toggleHighlight = (highlight) => {
  const index = selectedFilters.value.highlights.indexOf(highlight)
  if (index > -1) {
    selectedFilters.value.highlights.splice(index, 1)
  } else {
    selectedFilters.value.highlights.push(highlight)
  }
  updateFilters()
}

// Initial emit to set the starting state
updateFilters()
</script>

<template>
  <aside class="sidefilter w-64 bg-white p-6 rounded-lg shadow-md space-y-8 px-[5px]">
    <h2 class="text-xl font-bold text-gray-800 border-b pb-2">Filter Products</h2>

    <!-- Timeframe -->
    <section class="my-[20px]">
      <h3 class="timeframe text-lg mb-3">Timeframe</h3>
      <div class="grid grid-cols-2 gap-4 gap-[5px]">
        <button
          v-for="time in timeframes"
          :key="time"
          @click="selectTimeframe(time)"
          :class="[
            's-btn px-3 py-1 text-sm rounded-full transition',
            selectedFilters.timeframe === time
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ time }}
        </button>
      </div>
    </section>

    <!-- Categories -->
    <section class="my-[20px]">
      <h3 class="categories text-lg mb-3">Categories</h3>
      <div class="grid grid-cols-3 gap-4 gap-[5px]">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectCategory(cat)"
          :class="[
            's-btn px-3 py-1 text-sm rounded-full transition',
            selectedFilters.category === cat
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Price Range -->
    <section class="mb-[20px]">
      <h3 class="price-range text-lg mb-3">Price</h3>
      <div class="relative h-1 bg-gray-200 rounded-full my-4">
        <div class="absolute h-1 bg-indigo-500 rounded-full" style="left: 0%; width: 100%"></div>
        <div class="absolute h-4 w-4 bg-indigo-500 rounded-full -top-1.5" style="left: 0%"></div>
        <div class="absolute h-4 w-4 bg-indigo-500 rounded-full -top-1.5" style="right: 0%"></div>
      </div>
      <div class="flex justify-between text-sm text-gray-600">
        <span class="px-2 py-1 border rounded">${{ selectedFilters.priceRange[0] }}</span>
        <span class="px-2 py-1 border rounded">${{ selectedFilters.priceRange[1] }}</span>
      </div>
    </section>

    <!-- Brands -->
    <section class="mb-[20px]">
      <h3 class="brand text-lg mb-3">Brand</h3>
      <div class="space-y-2">
        <label
          v-for="brand in brands"
          :key="brand"
          class="flex gap-[10px] items-center space-x-2 text-sm text-gray-700"
        >
          <input
            type="checkbox"
            :checked="selectedFilters.brands.includes(brand)"
            @change="toggleBrand(brand)"
            class="accent-indigo-600"
          />
          <span>{{ brand }}</span>
        </label>
      </div>
    </section>

    <!-- Highlights -->
    <section class="mb-[20px]">
      <h3 class="highlights text-lg mb-3">Highlights</h3>
      <div class="space-y-2">
        <label
          v-for="highlight in highlights"
          :key="highlight"
          class="flex gap-[10px] items-center space-x-2 text-sm text-gray-700"
        >
          <input
            type="checkbox"
            :checked="selectedFilters.highlights.includes(highlight)"
            @change="toggleHighlight(highlight)"
            class="accent-indigo-600"
          />
          <span>{{ highlight }}</span>
        </label>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.sidefilter {
  padding: 10px;
  background: #ffffff;
  height: fit-content;
  width: 20%;
  border-radius: 20px;
}

.timeframe,
.categories,
.price-range,
.brand,
.highlights {
  color: #000000;
  font-weight: 600;
}

.s-btn {
  width: auto;
  cursor: pointer;
  background: #0f1724;
  color: #ffffff;
  border: none;
  padding: 5px;
}
</style>
