<script setup>
import { ref, defineEmits, computed } from 'vue'

const emit = defineEmits(['update:filters'])

// Use actual categories from your schema
const categories = [
  'All', 
  'Shoes', 
  'Clothes', 
  'Food', 
  'Electronics', 
  'Accessories', 
  'Furniture', 
  'Home', 
  'Sports & Outdoors'
]

// Use actual deal tags from your schema
const dealTypes = ['All deals', 'Flash', 'Clearance', 'Deal', 'Bundle']

// Discount ranges
const discounts = ['10%+', '25%+', '40%+', '50%+']

// Reactive state for selected filters
const selectedFilters = ref({
  dealType: 'All deals',
  category: 'All',
  discount: '10%+',
  priceRange: [0, 1000], // Adjust based on your product price range
})

const updateFilters = () => {
  emit('update:filters', selectedFilters.value)
}

// Filter handlers
const selectDealType = (type) => {
  selectedFilters.value.dealType = type
  updateFilters()
}

const selectCategory = (cat) => {
  selectedFilters.value.category = cat
  updateFilters()
}

const selectDiscount = (discount) => {
  selectedFilters.value.discount = discount
  updateFilters()
}

// Price range handler
const updatePriceRange = (min, max) => {
  selectedFilters.value.priceRange = [min, max]
  updateFilters()
}

// Initialize filters
updateFilters()
</script>

<template>
  <div class="sidefilter lg:col-span-1 md:col-span-1 space-y-8 p-4 bg-white rounded-lg shadow-sm">
    <!-- Deal Type Filter -->
    <section class="mb-[20px]">
      <h3 class="dealframe font-bold mb-3 text-lg">Deal Type</h3>
      <div class="grid grid-cols-2 gap-[5px]">
        <button
          v-for="type in dealTypes"
          :key="type"
          @click="selectDealType(type)"
          :class="[
            's-btn px-3 py-1 text-sm rounded-full transition duration-150',
            selectedFilters.dealType === type
              ? 'bg-[#5D3471] text-white'
              : 'bg-[#E8B6D5] text-[#5D3471] hover:bg-[#AA69AF]',
          ]"
        >
          {{ type }}
        </button>
      </div>
    </section>

    <!-- Categories Filter -->
    <section class="mb-[20px]">
      <h3 class="categories font-bold mb-3 text-lg">Categories</h3>
      <div class="grid grid-cols-2 gap-[5px] max-h-40 overflow-y-auto">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectCategory(cat)"
          :class="[
            's-btn px-3 py-1 text-sm rounded-full transition duration-150',
            selectedFilters.category === cat
              ? 'bg-[#5D3471] text-white'
              : 'bg-[#E8B6D5] text-[#5D3471] hover:bg-[#AA69AF]',
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Discount Filter -->
    <section class="mb-[20px]">
      <h3 class="discount font-bold mb-3 text-lg">Discount</h3>
      <div class="grid grid-cols-2 gap-[5px]">
        <button
          v-for="discount in discounts"
          :key="discount"
          @click="selectDiscount(discount)"
          :class="[
            's-btn px-3 py-1 text-sm rounded transition duration-150 text-left',
            selectedFilters.discount === discount
              ? 'bg-[#5D3471] text-white'
              : 'bg-[#E8B6D5] text-[#5D3471] hover:bg-[#AA69AF]',
          ]"
        >
          {{ discount }} off
        </button>
      </div>
    </section>

    <!-- Price Range Filter -->
    <section class="mb-[20px]">
      <h3 class="price-range font-bold mb-3 text-lg">Price Range</h3>
      <div class="space-y-4">
        <div class="flex gap-2">
          <input
            type="number"
            v-model.number="selectedFilters.priceRange[0]"
            @change="updateFilters"
            class="w-20 p-1 border border-[#AA69AF] rounded text-sm text-center"
            placeholder="Min"
          />
          <span class="self-center text-[#5D3471]">to</span>
          <input
            type="number"
            v-model.number="selectedFilters.priceRange[1]"
            @change="updateFilters"
            class="w-20 p-1 border border-[#AA69AF] rounded text-sm text-center"
            placeholder="Max"
          />
        </div>
        <div class="text-xs text-[#5D3471] text-center">
          Ksh.{{ selectedFilters.priceRange[0] }} - Ksh.{{ selectedFilters.priceRange[1] }}
        </div>
      </div>
    </section>

    <!-- Clear Filters Button -->
    <section>
      <button
        @click="() => {
          selectedFilters.dealType = 'All deals'
          selectedFilters.category = 'All'
          selectedFilters.discount = '10%+'
          selectedFilters.priceRange = [0, 1000]
          updateFilters()
        }"
        class="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 font-medium"
      >
        Clear All Filters
      </button>
    </section>
  </div>
</template>

<style scoped>
.sidefilter {
  padding: 10px;
  background: #ffffff;
  height: fit-content;
  width: 25%;
  border-radius: 20px;
}

.dealframe,
.categories,
.discount,
.price-range {
  color: #5d3471;
  font-weight: 600;
  margin-bottom: 10px;
}

.s-btn {
  width: auto;
  cursor: pointer;
  border: none;
  padding: 5px;
  white-space: nowrap;
}

/* Scrollbar styling for categories */
.max-h-40::-webkit-scrollbar {
  width: 4px;
}

.max-h-40::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.max-h-40::-webkit-scrollbar-thumb {
  background: #E8B6D5;
  border-radius: 10px;
}

.max-h-40::-webkit-scrollbar-thumb:hover {
  background: #AA69AF;
}
</style>