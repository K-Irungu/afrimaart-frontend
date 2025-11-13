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
  { id: 'notifications', name: 'Notifications', icon: 'bell' },
]
</script>

<template>
  <div class="sidenav bg-white rounded-lg shadow-sm p-4 h-fit sticky top-4">
    <div class="flex items-center border-b pb-4 mb-[20px] p-[10px]">
      <div class="h-14 w-14 rounded-full bg-gray-200 overflow-hidden mr-4">
        <img
          :src="user.img"
          :alt="`${user.firstName} ${user.lastName}`"
          class="w-full h-full object-cover"
        />
      </div>
      <div>
        <div class="font-semibold text-gray-800">{{ user.firstName }} {{ user.lastName }}</div>
        <div class="text-sm text-gray-500">{{ user.username }}</div>
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
  border: 1px solid #aa69af; /* Medium Orchid for borders */
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-btn.active {
  background-color: #5d3471; /* Deep Purple */
  color: white;
  border-color: #5d3471; /* Deep Purple */
}

.nav-btn.inactive {
  color: #804d91; /* Royal Purple */
  border-color: #aa69af; /* Medium Orchid */
}

.nav-btn.inactive:hover {
  background-color: #ce7f57; /* Warm Brownish Orange */
}
</style>
