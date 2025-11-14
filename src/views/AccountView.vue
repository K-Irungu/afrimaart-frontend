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
    tagColor: 'bg-[#E8B6D5] text-[#5D3471]',
    time: '2 hours ago',
    isUnread: true,
  },
  {
    id: 2,
    title: 'New deals available',
    subtitle: 'Check out our latest promotions',
    tagText: 'New deals',
    tagColor: 'bg-[#CE7F57] text-white',
    time: '1 day ago',
    isUnread: true,
  },
  {
    id: 3,
    title: 'Security alert',
    subtitle: 'New login from San Francisco, CA',
    tagText: 'Security',
    tagColor: 'bg-[#AA69AF] text-white',
    time: '2 days ago',
    isUnread: false,
  },
  {
    id: 4,
    title: 'Payment method updated',
    subtitle: 'Your credit card has been updated',
    tagText: 'Payment',
    tagColor: 'bg-[#804D91] text-white',
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
  <div class="min-h-screen">
    <!-- Navbar -->
    <Navbar />

    <main class="main max-w-7xl mx-auto px-4 py-8">
      <div class="text-sm text-[#804D91] mb-6 pb-[10px] my-[10px]">
        Home / <span class="font-medium text-[#5D3471]">Account</span> /
        <span class="text-[#AA69AF]">{{ getTabDisplayName(activeTab) }}</span>
      </div>

      <!-- Banner -->
      <div class="banner text-white p-[20px] rounded-lg flex justify-between items-center mb-6">
        <div>
          <h1 class="banner-ttl text-xl font-semibold mb-1">Your account</h1>
          <p class="text-sm text-[#E8B6D5]">
            Manage your profile, addresses, orders, and security.
          </p>
        </div>
        <button
          class="signout-btn bg-[#5d3471] text-[#ffff] font-medium py-[8px] px-[10px] rounded-lg transition text-sm flex items-center gap-2 hover:bg-[#AA69AF]"
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
          <div v-if="activeTab === 'profile'">
            <ProfileDetails
              :user="user"
              @save-changes="console.log('Save profile changes', user)"
            />
          </div>

          <!-- Order History tab -->
          <div v-else-if="activeTab === 'orders'">
            <OrderHistory :orders="orders" :loading="ordersLoading" />
          </div>

          <!-- Addresses tab -->
          <div v-else-if="activeTab === 'addresses'">
            <Addresses :addresses="addresses" :loading="addressesLoading" />
          </div>

          <!-- Payment Methods tab -->
          <div v-else-if="activeTab === 'payment'" class="bg-white rounded-lg shadow-sm p-6">
            <PaymentMethods />
          </div>

          <!-- Notifications tab -->
          <div v-else-if="activeTab === 'notifications'">
            <Notifications :notifications="notifications" />
          </div>

          <div v-else class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold mb-4 text-[#5D3471]">
              {{ getTabDisplayName(activeTab) }}
            </h2>
            <p class="text-[#804D91]">Content for this section is coming soon.</p>
          </div>
        </div>
      </div>
    </main>

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
  background: linear-gradient(135deg, #5d3471, #804d91, #aa69af);
  color: white;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
}
.banner-ttl {
  font-weight: 600;
}
.banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(93, 52, 113, 0.3);
}

.signout-btn {
  border-radius: 10px;
  border: none;
  transition: all 0.3s ease-in-out;
}
</style>
