<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['update:filters'])

// Mock Filter Data
const dealTypes = ['All deals', 'Flash', 'Clearance', 'Bundle']
const categories = ['All', 'Apparel', 'Shoes', 'Accessories', 'Home', 'Tech']
const discounts = ['10%+', '25%+', '40%+']

// Reactive state for selected filters
const selectedFilters = ref({
  dealType: 'All deals',
  category: 'All',
  discount: '10%+',
  priceRange: [20, 300],
})

const updateFilters = () => {
  emit('update:filters', selectedFilters.value)
}

// Simplified interaction handlers
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

updateFilters()
</script>

<template>
  <div class="sidefilter lg:col-span-1 md:col-span-1 space-y-8 p-4 bg-white rounded-lg shadow-sm">
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

    <section class="mb-[20px]">
      <h3 class="categories font-bold mb-3 text-lg">Categories</h3>
      <div class="grid grid-cols-2 gap-[5px]">
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

    <section class="mb-[20px]">
      <h3 class="discount font-bold mb-3 text-lg">Discount</h3>
      <div class="flex flex-wrap gap-[5px]">
        <button
          v-for="discount in discounts"
          :key="discount"
          @click="selectDiscount(discount)"
          :class="[
            's-btn px-3 py-1 text-sm rounded transition duration-150',
            selectedFilters.discount === discount
              ? 'bg-[#5D3471] text-white'
              : 'bg-[#E8B6D5] text-[#5D3471] hover:bg-[#AA69AF]',
          ]"
        >
          {{ discount }}
        </button>
      </div>
    </section>

    <section class="mb-[20px]">
      <h3 class="price-range font-bold mb-3 text-lg">Price</h3>
      <div class="w-full h-1 bg-indigo-200 rounded-full my-4 relative">
        <div
          class="absolute h-1 bg-indigo-600 rounded-full"
          :style="{ left: '0%', width: '100%' }"
        ></div>
        <div
          class="absolute h-4 w-4 rounded-full bg-indigo-600 -mt-1.5"
          :style="{ left: '0%' }"
        ></div>
        <div
          class="absolute h-4 w-4 rounded-full bg-indigo-600 -mt-1.5"
          :style="{ right: '0%' }"
        ></div>
      </div>
      <div class="flex justify-between text-sm mt-2">
        <span class="p-1 border rounded bg-[#804D91]">${{ selectedFilters.priceRange[0] }}</span>
        <span class="p-1 border rounded bg-[#804D91]">${{ selectedFilters.priceRange[1] }}</span>
      </div>
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
}
</style>
