<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import AccountSidebar from '@/components/Account/AccountSidebar.vue'
import ProfileDetails from '@/components/Account/ProfileDetails.vue'
import OrderHistory from '@/components/Account/OrderHistory.vue'
import Notifications from '@/components/Account/Notifications.vue'
import PaymentMethods from '@/components/Account/PaymentMethods.vue'
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
const orders = ref([])
const ordersLoading = ref(true)

// --- Mock Addresses Data ---
const addresses = ref({})
const addressesLoading = ref(true)

// --- Mock Notifications Data ---
const notifications = ref([
  {
    id: 1,
    title: 'Your order has been shipped!',
    subtitle: 'Order #58421 is on its way to you',
    tagText: 'Order update',
    tagColor: 'bg-blue-100 text-blue-800',
    time: '2 hours ago',
    isUnread: true,
  },
  {
    id: 2,
    title: 'New deals available',
    subtitle: 'Check out our latest promotions',
    tagText: 'New deals',
    tagColor: 'bg-green-100 text-green-800',
    time: '1 day ago',
    isUnread: true,
  },
  {
    id: 3,
    title: 'Security alert',
    subtitle: 'New login from San Francisco, CA',
    tagText: 'Security',
    tagColor: 'bg-yellow-100 text-yellow-800',
    time: '2 days ago',
    isUnread: false,
  },
  {
    id: 4,
    title: 'Payment method updated',
    subtitle: 'Your credit card has been updated',
    tagText: 'Payment',
    tagColor: 'bg-purple-100 text-purple-800',
    time: '3 days ago',
    isUnread: false,
  },
])

// Simulate loading data
onMounted(() => {
  // Simulate loading orders
  setTimeout(() => {
    orders.value = [
      { id: 58421, date: 'Aug 12, 2025', items: 2, total: 28.4, status: 'Shipped' },
      { id: 57902, date: 'Jul 28, 2025', items: 3, total: 62.0, status: 'Preparing' },
      { id: 57102, date: 'Jun 11, 2025', items: 5, total: 279.5, status: 'Returned' },
    ]
    ordersLoading.value = false
  }, 1500)

  // Simulate loading addresses
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
  }, 2000)
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
            <OrderHistory :orders="orders" :loading="ordersLoading" />
          </div>

          <!-- Addresses Tab - Only Address Section -->
          <div v-else-if="activeTab === 'addresses'">
            <Addresses :addresses="addresses" :loading="addressesLoading" />
          </div>

          <!-- Payment Methods Tab -->
          <div v-else-if="activeTab === 'payment'" class="bg-white rounded-lg shadow-sm p-6">
            <PaymentMethods />
          </div>

          <!-- Notifications Tab -->
          <div v-else-if="activeTab === 'notifications'">
            <Notifications :notifications="notifications" />
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
