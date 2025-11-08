<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import AccountSidebar from '@/components/Account/AccountSidebar.vue'
import ProfileDetails from '@/components/Account/ProfileDetails.vue'
import OrderHistory from '@/components/Account/OrderHistory.vue'
// import PreferencesSection from './PreferencesSection.vue'
import Footer from '@/components/Footer.vue'
import Addresses from '@/components/Account/Addresses.vue'

// --- Mock User Data ---
const user = ref({
  firstName: 'Ava',
  lastName: 'Thompson',
  email: 'ava.t@example.com',
  phone: '+1 415 555 0132',
  username: 'ava.t@example.com',
  img: '/path/to/avatar.jpg',
})

// --- Mock Orders Data ---
const orders = ref([
  { id: 58421, date: 'Aug 12, 2025', items: 2, total: 28.4, status: 'Shipped' },
  { id: 57902, date: 'Jul 28, 2025', items: 3, total: 62.0, status: 'Preparing' },
  { id: 57102, date: 'Jun 11, 2025', items: 5, total: 279.5, status: 'Returned' },
])

// --- Mock Addresses Data ---
const addresses = ref({})
const addressesLoading = ref(true)

// Simulate loading addresses
onMounted(() => {
  setTimeout(() => {
    addresses.value = {
      home: {
        street: '369 Market St, Apt 7C',
        cityStateZip: 'San Francisco, CA 94103',
        country: 'United States',
        isDefault: true,
      },
      work: {
        street: '240 Townsend St, Floor 4',
        cityStateZip: 'San Francisco, CA 94107',
        country: 'United States',
        isDefault: false,
      },
      parents: {
        street: '123 Oak Street',
        cityStateZip: 'Los Angeles, CA 90210',
        country: 'United States',
        isDefault: false,
      },
      vacation: {
        street: '456 Beach Road',
        cityStateZip: 'Miami, FL 33139',
        country: 'United States',
        isDefault: false,
      },
    }
    addressesLoading.value = false
  }, 2000) // 2 second loading simulation
})

// --- Mock Preferences Data ---
const preferences = ref({
  orderUpdates: true,
  productReviews: true,
  dealsPromos: false,
  twoStepVerification: true,
})

// Use the same tab IDs as in AccountSidebar
const activeTab = ref('profile')

const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

// Get display name for breadcrumb
const getTabDisplayName = (tabId) => {
  const tabNames = {
    profile: 'Profile',
    orders: 'Orders',
    addresses: 'Addresses',
    payment: 'Payment Methods',
    notifications: 'Notifications',
    security: 'Security',
    help: 'Help & Support',
  }
  return tabNames[tabId] || tabId
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />

    <main class="main max-w-7xl mx-auto px-4 py-8">
      <div class="text-sm text-gray-500 mb-6 pb-[10px] my-[10px]">
        Home / <span class="font-medium text-gray-700">Account</span> /
        <span class="text-indigo-600">{{ getTabDisplayName(activeTab) }}</span>
      </div>

      <!-- Banner -->
      <div
        class="banner bg-gray-800 text-white p-[20px] rounded-lg flex justify-between items-center mb-6"
      >
        <div>
          <h1 class="banner-ttl text-xl font-semibold mb-1">Your account</h1>
          <p class="text-sm text-gray-400">Manage your profile, addresses, orders, and security.</p>
        </div>
        <button
          class="signout-btn bg-indigo-600 text-white font-medium py-[8px] px-[10px] rounded-lg transition text-sm flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="w-4 h-4 mr-[6px]" />
          Sign out
        </button>
      </div>

      <!-- Fixed Grid Layout -->
      <div class="flex gap-[10px] mt-[12px]">
        <!-- Sidebar - Fixed width -->
        <div class="w-1/4">
          <AccountSidebar :user="user" :active-tab="activeTab" @change-tab="handleTabChange" />
        </div>

        <!-- Content - Flexible width -->
        <div class="flex-1">
          <!-- Profile Tab - Only Profile Details -->
          <div v-if="activeTab === 'profile'">
            <ProfileDetails
              :user="user"
              @save-changes="console.log('Save profile changes', user)"
            />
          </div>

          <!-- Orders Tab - Only Order History -->
          <div v-else-if="activeTab === 'orders'">
            <OrderHistory :orders="orders" :loading="addressesLoading" />
          </div>

          <!-- Addresses Tab - Only Address Section -->
          <div v-else-if="activeTab === 'addresses'" class="bg-white rounded-lg shadow-sm p-6">
            <Addresses :addresses="addresses" />
          </div>

          <!-- Payment Methods Tab -->
          <div v-else-if="activeTab === 'payment'" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold mb-6">Payment Methods</h2>
            <div class="text-center py-12">
              <p class="text-gray-500">No payment methods saved yet.</p>
              <button
                class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Payment Method
              </button>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div v-else-if="activeTab === 'notifications'" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold mb-6">Notification Preferences</h2>
            <!-- <PreferencesSection :preferences="preferences" /> -->
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 class="font-semibold">Order Updates</h3>
                  <p class="text-sm text-gray-600">Get notified about your order status</p>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" v-model="preferences.orderUpdates" class="mr-2" />
                  <span class="text-sm">{{ preferences.orderUpdates ? 'On' : 'Off' }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 class="font-semibold">Product Reviews</h3>
                  <p class="text-sm text-gray-600">Reminders to review purchased products</p>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" v-model="preferences.productReviews" class="mr-2" />
                  <span class="text-sm">{{ preferences.productReviews ? 'On' : 'Off' }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 class="font-semibold">Deals & Promotions</h3>
                  <p class="text-sm text-gray-600">Special offers and discount notifications</p>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" v-model="preferences.dealsPromos" class="mr-2" />
                  <span class="text-sm">{{ preferences.dealsPromos ? 'On' : 'Off' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Fallback for unknown tabs -->
          <div v-else class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold mb-4">{{ getTabDisplayName(activeTab) }}</h2>
            <p class="text-gray-600">Content for this section is coming soon.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <div class="mt-[30px]">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 90%;
  color: #000000;
}
.banner {
  background: #0f1724;
  border-radius: 20px;
  color: white;
}
.banner-ttl {
  font-weight: 600;
}
.signout-btn {
  border-radius: 10px;
  border: none;
}
</style>
