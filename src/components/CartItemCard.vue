<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  item: Object,
})

const emit = defineEmits(['remove', 'update-quantity', 'move-to-wishlist', 'save-for-later'])

const handleQuantityChange = (event) => {
  const newQuantity = parseInt(event.target.value)
  // Use productId instead of id
  emit('update-quantity', props.item.productId, newQuantity)
}

const handleRemove = () => {
  // Use productId instead of id
  emit('remove', props.item.productId)
}
</script>

<template>
  <div
    class="item-details group flex p-4 mb-[10px] border-2 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <!-- Product Image -->
    <div class="w-[100px] h-[120px] flex-shrink-0 mr-[5px]">
      <div
        class="w-full h-full bg-[#E8E7FC] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden"
      >
        <!-- Display actual product image if available -->
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="w-full h-full object-cover rounded-xl"
        />
        <!-- Fallback placeholder if no image -->
        <div
          v-else
          class="w-full h-full bg-[#E8E7FC] rounded-lg flex items-center justify-center"
        >
          <span class="text-xs font-semibold text-blue-800 uppercase text-center px-2">
            {{ item.name.substring(0, 15) }}{{ item.name.length > 15 ? '...' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-[5px]">
        <div class="flex-1">
          <h3
            class="text-xl font-[500] text-[#5858E0] group-hover:text-blue-700 transition-colors duration-200 mb-2"
          >
            {{ item.name }}
          </h3>
          <div class="item-desc flex items-center gap-4 text-sm flex-wrap">
            <!-- Color -->
            <span 
              v-if="item.color && item.color !== ''" 
              class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
            >
              <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
              <span class="text-gray-700 font-medium">color: {{ item.color }}</span>
            </span>
            
            <!-- Warranty -->
            <span 
              v-if="item.warranty && item.warranty !== ''" 
              class="flex items-center gap-[8px] bg-gray-100 px-3 py-1 rounded-full"
            >
              <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
              <span class="text-gray-700 font-medium">warranty: {{ item.warranty }}</span>
            </span>
            
            <!-- Brand -->
            <span 
              v-if="item.brand" 
              class="flex items-center gap-[8px] bg-gray-100 px-3 py-1 rounded-full"
            >
              <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
              <span class="text-gray-700 font-medium">brand: {{ item.brand }}</span>
            </span>
            
            <!-- Category -->
            <span 
              v-if="item.category" 
              class="flex items-center gap-[8px] bg-gray-100 px-3 py-1 rounded-full"
            >
              <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
              <span class="text-gray-700 font-medium">{{ item.category }}</span>
            </span>
          </div>
        </div>
        <div class="text-right">
          <p class="price-tag text-2xl font-bold text-blue-700 ml-4">
            Ksh{{ (item.price * item.quantity).toFixed(2) }}
          </p>
          <p v-if="item.quantity > 1" class="text-sm text-gray-500 mt-1">
            Ksh{{ item.price.toFixed(2) }} each
          </p>
        </div>
      </div>

      <!-- Actions -->
      <hr class="my-[10px]" />
      <div class="flex items-center justify-between pt-4 border-gray-200">
        <!-- Quantity Selector -->
        <div class="qty-selector flex items-center gap-[10px]">
          <label :for="`qty-${item.productId}`" class="text-sm font-semibold text-gray-700">Quantity</label>
          <div class="flex items-center gap-2 bg-white border-gray-300 rounded-lg px-3 py-1">
            <select
              :id="`qty-${item.productId}`"
              :value="item.quantity"
              @change="handleQuantityChange"
              class="qty-dropdown p-[5px] bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-900 cursor-pointer"
            >
              <option v-for="n in 10" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>
          <span class="text-sm text-gray-500">
            {{ item.quantity }} item{{ item.quantity !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-[10px]">
          <!-- Remove Button -->
          <button
            @click="handleRemove"
            class="remove-btn flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 bg-[#dc2626] text-white hover:bg-[#b91c1c] border border-[#b91c1c]"
          >
            <font-awesome-icon :icon="['fas', 'trash']" class="w-4 h-4" />
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
  border: 1px solid #E8E7FC; /* Soft Pink border */
}

.item-details:hover {
  border-color: #5858E0; /* Deep Purple hover border */
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
  color: #2A2A6B; /* Royal Purple */
}

/* Quantity selector */
.qty-selector {
  border: 1px solid #FFAC1E; /* Warm Brownish Orange */
  padding: 3px;
  border-radius: 10px;
}
.qty-dropdown {
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #5858E0; /* Deep Purple */
}

/* Price tag */
.price-tag {
  background: #5858E0; /* Deep Purple */
  padding: 8px 12px;
  border-radius: 8px;
  color: white;
  display: inline-block;
}

/* Action buttons */
.remove-btn {
  background:rgb(223, 22, 22);
  color: #ffffff;
  border: 1px solid #b91c1c;
}
.remove-btn:hover {
  background:rgb(74, 7, 7);
  color: #ffffff;
  border-color: #b91c1c;
}

.save-btn {
  background: #E8E7FC; /* Soft Pink */
  color: #2A2A6B; /* Royal Purple text */
  border: 1px solid #E8E7FC;
}

.wishlist-btn {
  background: #7272E8; /* Medium Orchid */
  color: #ffffff;
  border: 1px solid #7272E8;
}

/* Button hover effects */
.save-btn:hover {
  background: #2A2A6B; /* Royal Purple hover */
  color: #ffffff;
  border-color: #2A2A6B;
}

.wishlist-btn:hover {
  background: #5858E0; /* Deep Purple hover */
  border-color: #5858E0;
}

/* Image container styling */
img {
  border-radius: 15px;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/* Responsive design */
@media (max-width: 768px) {
  .item-details {
    flex-direction: column;
    padding: 15px;
  }
  
  .item-desc {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .qty-selector {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .flex.items-center.justify-between {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .flex.items-center.gap-\[10px\] {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>