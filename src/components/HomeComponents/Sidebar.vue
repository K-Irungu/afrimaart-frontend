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

const ratings = ['4+', '3+', 'All']

// Reactive state for selected filters
const selectedFilters = ref({
  category: 'All',
  brands: ['Any'],
  priceRange: [0, 1000],
  rating: '4+',
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

const selectRating = (rating) => {
  selectedFilters.value.rating = rating
  updateFilters()
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

    <!-- Price Range -->
    <section class="mb-[20px]">
      <h3 class="price-rage text-lg mb-3">Price</h3>
      <div class="relative h-1 bg-[#E8B6D5] rounded-full my-4">
        <div class="absolute h-1 bg-[#AA69AF] rounded-full" style="left: 0%; width: 100%"></div>
        <div class="absolute h-4 w-4 bg-[#804D91] rounded-full -top-1.5" style="left: 0%"></div>
        <div class="absolute h-4 w-4 bg-[#804D91] rounded-full -top-1.5" style="right: 0%"></div>
      </div>
      <div class="flex justify-between text-sm text-[#5D3471]">
        <span class="px-2 py-1 border rounded border-[#E8B6D5]"
          >${{ selectedFilters.priceRange[0] }}</span
        >
        <span class="px-2 py-1 border rounded border-[#E8B6D5]"
          >${{ selectedFilters.priceRange[1] }}</span
        >
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
              ? 'bg-[#804D91] text-white'
              : 'bg-[#E8B6D5] text-[#5D3471] hover:bg-[#AA69AF]',
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
  color: #5d3471;
  font-weight: 600;
}

.s-btn {
  padding: 5px;
  border: none;
  width: auto;
  cursor: pointer;
}
</style>
