<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const emit = defineEmits(['update:filters'])
const props = defineProps({
  categories: { 
    type: Array, 
    default: () => ["All", "Shoes", "Clothes", "Electronics", "Accessories"] 
  },
  brands: {
    type: Array,
    default: () => ["Any", "Acme", "Nimbus", "Orbit"]
  }
})

// Enhanced ratings with more options
const ratings = [
  { label: '5 Stars', value: '5', minRating: 5 },
  { label: '4+ Stars', value: '4+', minRating: 4 },
  { label: '3+ Stars', value: '3+', minRating: 3 },
  { label: '2+ Stars', value: '2+', minRating: 2 },
  { label: '1+ Stars', value: '1+', minRating: 1 },
  { label: 'Any Rating', value: 'Any', minRating: 0 }
]

// Reactive state for selected filters
const selectedFilters = ref({
  category: 'All',
  brands: ['Any'],
  priceRange: [0, 1000],
  rating: 'Any',
})

const updateFilters = () => {
  emit('update:filters', selectedFilters.value)
}

const selectCategory = (cat) => {
  selectedFilters.value.category = cat
  updateFilters()
}

const toggleBrand = (brand) => {
  const index = selectedFilters.value.brands.indexOf(brand)
  
  if (brand === 'Any') {
    selectedFilters.value.brands = ['Any']
  } else {
    if (index > -1) {
      selectedFilters.value.brands.splice(index, 1)
      if (selectedFilters.value.brands.length === 0) {
        selectedFilters.value.brands = ['Any']
      }
    } else {
      const anyIndex = selectedFilters.value.brands.indexOf('Any')
      if (anyIndex > -1) {
        selectedFilters.value.brands.splice(anyIndex, 1)
      }
      selectedFilters.value.brands.push(brand)
    }
  }
  updateFilters()
}

const selectRating = (ratingValue) => {
  selectedFilters.value.rating = ratingValue
  updateFilters()
}

// Helper to display stars visually
const getStarDisplay = (ratingValue) => {
  if (ratingValue === 'Any') return '★'
  if (ratingValue === '5') return '★★★★★'
  if (ratingValue === '4+') return '★★★★☆'
  if (ratingValue === '3+') return '★★★☆☆'
  if (ratingValue === '2+') return '★★☆☆☆'
  if (ratingValue === '1+') return '★☆☆☆☆'
  return '★'
}

// Initial emit
updateFilters()
</script>

<template>
  <aside class="sidefilter w-64 bg-white p-6 rounded-lg shadow-md space-y-8 px-[5px]">
    <h2 class="text-xl font-bold text-[#5D3471] border-b pb-2">Filter Products</h2>

    <!-- Categories -->
    <section class="my-[20px]">
      <h3 class="categories text-lg mb-[5px]">Categories</h3>
      <div class="grid grid-cols-3 gap-[5px]">
        <button
          v-for="cat in props.categories"
          :key="cat"
          @click="selectCategory(cat)"
          :class="[ 
            's-btn px-3 py-1 text-sm rounded-full transition',
            selectedFilters.category === cat
              ? 'bg-[#5D3471] text-white'
              : 'bg-[#E8B6D5] text-[#5D3471] hover:bg-[#AA69AF]'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Brands -->
    <section class="mb-[20px]">
      <h3 class="brand text-lg mb-3">Brand</h3>
      <div class="space-y-2">
        <label
          v-for="brand in props.brands"
          :key="brand"
          class="flex gap-[10px] items-center space-x-2 text-sm text-[#5D3471]"
        >
          <input
            type="checkbox"
            :checked="selectedFilters.brands.includes(brand)"
            @change="toggleBrand(brand)"
            class="accent-[#AA69AF]"
          />
          <span>{{ brand }}</span>
        </label>
      </div>
    </section>

    <!-- Enhanced Rating Section -->
    <section class="mb-[20px]">
      <h3 class="rating text-lg mb-3">Customer Rating</h3>
      
      <!-- Current Selection Display -->
      <div class="mb-3 p-2 bg-[#F8F0F5] rounded-lg">
        <p class="text-sm text-[#5D3471] font-medium">
          {{ selectedFilters.rating === 'Any' ? 'Showing all ratings' : `Showing ${selectedFilters.rating} stars & above` }}
        </p>
      </div>
      
      <!-- Rating Options -->
      <div class="space-y-2">
        <button
          v-for="rate in ratings"
          :key="rate.value"
          @click="selectRating(rate.value)"
          :class="[
            'rating-btn w-full flex items-center justify-between px-[6px] py-[4px] text-sm rounded-lg transition mb-[6px]',
            selectedFilters.rating === rate.value
              ? 'bg-[#804D91] text-white'
              : 'bg-[#E8B6D5] text-[#5D3471] hover:bg-[#AA69AF] hover:text-white',
          ]"
        >
          <span class="flex items-center">
            <span class="text-yellow-400 mr-[6px]">{{ getStarDisplay(rate.value) }}</span>
            {{ rate.label }}
          </span>
          <span v-if="selectedFilters.rating === rate.value" class="text-white">✓</span>
        </button>
      </div>
    </section>

    <!-- Active Filters Summary -->
    <section v-if="selectedFilters.rating !== 'Any'" class="mb-[20px] p-3 bg-[#F0E6F5] rounded-lg">
      <h4 class="text-sm font-semibold text-[#5D3471] mb-2">Active Rating Filter:</h4>
      <div class="flex items-center justify-between">
        <span class="inline-flex items-center">
          <span class="text-yellow-400 mr-1">{{ getStarDisplay(selectedFilters.rating) }}</span>
          {{ selectedFilters.rating }} stars & above
        </span>
        <button 
          @click="selectRating('Any')" 
          class="text-[#804D91] hover:text-[#5D3471] text-sm font-medium"
          title="Clear rating filter"
        >
          Clear
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
  color: #5d3471;
  font-weight: 600;
}

.s-btn {
  padding: 5px;
  border: none;
  width: auto;
  cursor: pointer;
}

.rating-btn{
  border: none;
  border-radius: 6px;
}

/* Custom styles for star ratings */
.text-yellow-400 {
  color: #fbbf24;
}
</style>