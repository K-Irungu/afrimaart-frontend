<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  user: Object,
  activeTab: String,
})

const emit = defineEmits(['change-tab'])

const tabs = [
  { id: 'profile', name: 'Profile', icon: 'user' },
  { id: 'orders', name: 'Orders', icon: 'shopping-bag' },
  { id: 'addresses', name: 'Addresses', icon: 'map-pin' },
  { id: 'payment', name: 'Payment methods', icon: 'credit-card' },
  // { id: 'notifications', name: 'Notifications', icon: 'bell' },
]
</script>

<template>
  <div class="sidenav bg-white rounded-lg shadow-sm p-4 h-fit sticky top-4">
    <div class="flex items-center border-b pb-4 mb-[20px] p-[10px]">
      <div class="h-14 w-14 rounded-full bg-gray-200 overflow-hidden mr-[10px]">
        <img
          :src="user.img"
          :alt="`${user.firstName} ${user.lastName}`"
          class="w-[50px] h-[50px] object-cover"
        />
      </div>
      <div>
        <div class="text-[1.5rem] font-[500] text-gray-800 mb-[5px]">{{ user.firstName }} {{ user.lastName }}</div>
        <div class="text-sm text-gray-500">{{ user.email }}</div>
      </div>
    </div>

    <nav class="space-y-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="emit('change-tab', tab.id)"
        :class="[
          'nav-btn flex items-center gap-[8px] w-full px-3 py-2 mb-[10px] text-sm font-medium rounded-lg transition duration-150',
          activeTab === tab.id ? 'active' : 'inactive',
        ]"
      >
        <font-awesome-icon v-if="tab.icon" :icon="['fas', tab.icon]" class="w-4 h-4" />
        <span>{{ tab.name }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.sidenav {
  background: #ffffff;
  padding: 10px;
  border-radius: 20px;
}

.nav-btn {
  padding: 15px;
  border: 1px solid #7272E8; /* Medium Orchid for borders */
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-btn.active {
  background-color: #5858E0; /* Deep Purple */
  color: white;
  border-color: #5858E0; /* Deep Purple */
}

.nav-btn.inactive {
  color: #2A2A6B; /* Royal Purple */
  border-color: #7272E8; /* Medium Orchid */
}

.nav-btn.inactive:hover {
  background-color: #FFAC1E; /* Warm Brownish Orange */
}
</style>
