<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
// import AccountSidebar from './AccountSidebar.vue'
// import ProfileDetails from './ProfileDetails.vue'
// import RecentOrders from './RecentOrders.vue'
// import AddressSection from './AddressSection.vue'
// import PreferencesSection from './PreferencesSection.vue'

// --- Mock User Data ---
const user = ref({
  firstName: 'Ava',
  lastName: 'Thompson',
  email: 'ava.t@example.com',
  phone: '+1 415 555 0132',
  username: 'ava.t@example.com',
})

// --- Mock Orders Data ---
const orders = ref([
  { id: 58421, date: 'Aug 12, 2025', items: 2, total: 28.4, status: 'Shipped' },
  { id: 57902, date: 'Jul 28, 2025', items: 3, total: 62.0, status: 'Preparing' },
  { id: 57102, date: 'Jun 11, 2025', items: 5, total: 279.5, status: 'Returned' },
])

// --- Mock Addresses Data ---
const addresses = ref({
  home: {
    street: '369 Market St, Apt 7C',
    cityStateZip: 'San Francisco, CA 94103',
    isDefault: true,
  },
  work: {
    street: '240 Townsend St, Floor 4',
    cityStateZip: 'San Francisco, CA 94107',
    isDefault: false,
  },
})

// --- Mock Preferences Data ---
const preferences = ref({
  orderUpdates: true,
  productReviews: true,
  dealsPromos: false,
  twoStepVerification: true,
})

const activeTab = ref('Profile') // Controls which section is visible
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="text-sm text-gray-500 mb-6">
        Home / <span class="font-medium text-gray-700">Account</span> /
        <span class="text-indigo-600">{{ activeTab }}</span>
      </div>

      <div class="bg-gray-800 text-white p-4 rounded-lg flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-semibold mb-1">Your account</h1>
          <p class="text-sm text-gray-400">Manage your profile, addresses, orders, and security.</p>
        </div>
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
        >
          Sign out
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <AccountSidebar :user="user" :active-tab="activeTab" @change-tab="activeTab = $event" />

        <div class="lg:col-span-3 space-y-8">
          <template v-if="activeTab === 'Profile'">
            <ProfileDetails
              :user="user"
              @save-changes="console.log('Save profile changes', user)"
            />
            <RecentOrders :orders="orders" />
            <AddressSection :addresses="addresses" />
            <PreferencesSection :preferences="preferences" />
          </template>

          <div v-else class="p-8 bg-white rounded-lg shadow-sm">
            <h2 class="text-xl font-bold">{{ activeTab }} Content Placeholder</h2>
            <p class="text-gray-600 mt-2">
              Content for the {{ activeTab }} section would load here.
            </p>
          </div>
        </div>
      </div>
    </main>

    <div class="mt-12 text-center text-xs text-gray-500 p-4 border-t">
      © 2025 ShopSwift • Secure Checkout • Easy Returns
    </div>
  </div>
</template>
