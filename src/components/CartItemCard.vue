<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  item: Object,
})
</script>

<template>
  <div
    class="item-details group flex p-4 mb-[10px] border-2 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <!-- Product Image -->
    <div class="w-30 h-28 flex-shrink-0 mr-[5px]">
      <div
        class="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-blue-100"
      >
        <div
          class="w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-lg flex items-center justify-center"
        >
          <span class="text-xs font-semibold text-blue-800 uppercase">Product</span>
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-[5px]">
        <div class="flex-1">
          <h3
            class="text-xl font-[500] text-gray-900 group-hover:text-blue-700 transition-colors duration-200 mb-2"
          >
            {{ item.name }}
          </h3>
          <div class="item-desc flex items-center gap-4 text-sm">
            <span class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
              <span class="text-gray-700 font-medium">color: {{ item.color }}</span>
            </span>
            <span class="flex items-center gap-[8px] bg-gray-100 px-3 py-1 rounded-full">
              <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
              <span class="text-gray-700 font-medium">size: {{ item.size }}</span>
            </span>
          </div>
        </div>
        <p class="price-tag text-2xl font-bold text-blue-700 ml-4">${{ item.price.toFixed(2) }}</p>
      </div>

      <!-- Actions -->
      <hr />
      <div class="flex items-center justify-between pt-4 border-gray-200 mt-[5px]">
        <!-- Quantity Selector -->
        <div class="qty-selector flex items-center gap-[10px]">
          <label for="quantity" class="text-sm font-semibold text-gray-700">Quantity</label>
          <div class="flex items-center gap-2 bg-white border-gray-300 rounded-lg px-3 py-1">
            <select
              :id="`qty-${item.id}`"
              :value="item.qty"
              class="qty-dropdown p-[5px] bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-900 cursor-pointer"
            >
              <option v-for="n in 10" :key="n" :value="n" class="flex items-center gap-2">
                {{ n }}
              </option>
            </select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-[10px] mt-[5px]">
          <button
            v-if="item.id === 2"
            class="wishlist-btn flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg transition-all duration-200 group/wishlist"
          >
            <span class="text-lg group-hover/wishlist:scale-110 transition-transform duration-200">
              <font-awesome-icon :icon="['fas', 'heart']" class="w-4 h-4" />
            </span>
            Move to Wishlist
          </button>

          <button
            v-else
            class="save-btn flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 group/save"
          >
            <span class="text-lg group-hover/save:scale-110 transition-transform duration-200">
              <font-awesome-icon :icon="['fas', 'floppy-disk']" class="w-4 h-4" />
            </span>
            Save for Later
          </button>

          <!-- Remove Button -->
          <button
            class="remove-btn flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200 group/remove"
          >
            <span class="text-lg group-hover/remove:scale-110 transition-transform duration-200">
              <font-awesome-icon :icon="['fas', 'trash']" class="w-4 h-4" />
            </span>
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-details {
  color: black;
  background: #ffffff;
  padding: 25px;
  border-radius: 20px;
  border: 1px solid #e8b6d5; /* Soft Pink border */
}

.item-details:hover {
  border-color: #5d3471; /* Deep Purple hover border */
  box-shadow:
    0 10px 25px -5px rgba(93, 52, 113, 0.2),
    0 10px 10px -5px rgba(128, 77, 145, 0.1);
  transform: translateY(-2px);
}

.item-details button {
  border: none;
  border-radius: 8px;
  padding: 6px;
  font-weight: 500;
}

/* Description badges */
.item-desc {
  color: #804d91; /* Royal Purple */
}
/* Quantity selector */
.qty-selector {
  border: 1px solid #ce7f57; /* Warm Brownish Orange */
  padding: 3px;
  border-radius: 10px;
}
.qty-dropdown {
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #5d3471; /* Deep Purple */
}

/* Price tag */
.price-tag {
  background: #5d3471; /* Deep Purple */
  padding-inline: 4px;
  border-radius: 5px;
  color: white;
}

/* Action buttons */
.remove-btn {
  background: #fee8e8; /* Soft Pink variant */
  color: #ce7f57; /* Warm Brownish Orange */
}
.save-btn {
  background: #e8b6d5; /* Soft Pink */
  color: #804d91; /* Royal Purple text */
}
.wishlist-btn {
  background: #aa69af; /* Medium Orchid */
  color: #ffffff;
}

/* Button hover effects */
.save-btn:hover {
  background: #804d91; /* Royal Purple hover */
  color: #ffffff;
}
.wishlist-btn:hover {
  background: #5d3471; /* Deep Purple hover */
}
.remove-btn:hover {
  background: #ce7f57; /* Warm Brownish Orange hover */
  color: white;
}

/* Image container styling */
img {
  border-radius: 15px;
  object-fit: cover;
}
</style>
