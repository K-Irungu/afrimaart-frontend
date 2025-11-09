<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['update:filters'])

// Mock Data for the Filters
const categories = ['All', 'Apparel', 'Shoes', 'Accessories', 'Home', 'Tech']
const brands = ['Any', 'Acme', 'Nimbus', 'Orbit']
const ratings = ['4+', '3+', 'All']

// Reactive state for selected filters
const selectedFilters = ref({
  category: 'All',
  brands: ['Any'], // Using an array for potential multi-select
  priceRange: [0, 250],
  rating: '4+',
})

// Function to handle filter updates and emit the change
const updateFilters = () => {
  emit('update:filters', selectedFilters.value)
}

// Functions to handle specific filter changes
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

const selectRating = (rating) => {
  selectedFilters.value.rating = rating
  updateFilters()
}

// Initial emit to set the starting state
updateFilters()
</script>

<template>
  <aside class="sidefilter w-64 bg-white p-6 rounded-lg shadow-md space-y-8 px-[5px]">
    <h2 class="text-xl font-bold text-gray-800 border-b pb-2">Filter Products</h2>

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
      <h3 class="price-rage text-lg mb-3">Price</h3>
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

    <!-- Rating -->
    <section class="mb-[20px]">
      <h3 class="rating text-lg mb-3">Rating</h3>
      <div class="flex gap-[10px]">
        <button
          v-for="rate in ratings"
          :key="rate"
          @click="selectRating(rate)"
          :class="[
            's-btn px-3 py-1 text-sm rounded-full transition',
            selectedFilters.rating === rate
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ rate }}
        </button>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.sidefilter {
  padding: 10px;
  background: #ffffff;
  height: fit-content;
  border-radius: 20px;
}
.categories,
.price-rage,
.rating,
.brand {
  color: #000000;
  font-weight: 600;
}

.s-btn {
  padding: 5px;
  border: none;
  width: auto;
  cursor: pointer;
  background: #0f1724;
  color: #ffffff;
}
</style>
