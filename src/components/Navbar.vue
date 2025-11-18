<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'
import logo from '@/assets/images/Afrimart2.png'

const router = useRouter()
const route = useRoute()
const { cartCount } = useCart()

// Accept user as prop
const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

// Authentication state
const isAuthenticated = ref(false)
const showDropdown = ref(false)

// Debug function to check user data
const debugUserInfo = () => {
  console.log('=== DEBUG USER INFO ===')
  console.log('Props user:', props.user)
  console.log('User role:', props.user?.role)
  console.log('isAuthenticated:', isAuthenticated.value)
  console.log('isAdmin:', isAdmin.value)
  
  const localStorageUser = localStorage.getItem('user')
  console.log('LocalStorage user:', localStorageUser)
  
  if (localStorageUser) {
    try {
      const parsedUser = JSON.parse(localStorageUser)
      console.log('Parsed localStorage user:', parsedUser)
      console.log('LocalStorage user role:', parsedUser.role)
    } catch (e) {
      console.error('Error parsing localStorage user:', e)
    }
  }
  console.log('=== END DEBUG ===')
}

// Computed property for user display name
const userDisplayName = computed(() => {
  if (props.user?.firstName && props.user?.lastName) {
    return `${props.user.firstName} ${props.user.lastName}`
  }
  return props.user?.name || 'Account'
})

// Computed property to check if user is admin
const isAdmin = computed(() => {
  // Check both props.user and localStorage for admin role
  if (props.user?.role === 'admin') {
    return true
  }
  
  // Also check localStorage for admin role
  try {
    const localStorageUser = localStorage.getItem('user')
    if (localStorageUser) {
      const parsedUser = JSON.parse(localStorageUser)
      return parsedUser.role === 'admin'
    }
  } catch (e) {
    console.error('Error checking localStorage for admin role:', e)
  }
  
  return false
})

// Check authentication status
const checkAuthStatus = () => {
  const userData = localStorage.getItem('user')
  if (userData || props.user?.firstName) {
    isAuthenticated.value = true
  } else {
    isAuthenticated.value = false
  }
  
  // Debug logging
  debugUserInfo()
}

// Watch for user prop changes
watch(() => props.user, () => {
  checkAuthStatus()
}, { deep: true })

// Initialize auth status on component mount
onMounted(() => {
  checkAuthStatus()
  window.addEventListener('storage', checkAuthStatus)
})

// Logout function
const handleLogout = () => {
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')
  localStorage.removeItem('cart')
  isAuthenticated.value = false
  showDropdown.value = false
  // Redirect to appropriate page after logout
  router.push('/')
}

// Navigate to account
const navigateToAccount = () => {
  if (!isAuthenticated.value) {
    router.push('/auth')
  } else {
    if (isAdmin.value) {
      router.push('/adminDashboard')
    } else {
      router.push('/account')
    }
  }
  showDropdown.value = false
}

// Navigate to admin dashboard
const navigateToAdminDashboard = () => {
  router.push('/adminDashboard')
  showDropdown.value = false
}

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Close dropdown when clicking outside
const closeDropdown = () => {
  showDropdown.value = false
}

// Apply active and default styles
const isActive = (path) => {
  return route.path === path ? 'active-link' : 'inactive-link'
}
</script>

<template>
  <div class="navbar w-full grid grid-flow-col grid-rows-2 gap-0 place-items-center">
    <!-- Debug Button -->
    <!-- <button 
      @click="debugUserInfo"
      class="fixed top-2 left-2 z-50 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-50 hover:opacity-100"
      title="Debug User Info"
    >
      DEBUG
    </button> -->

    <header
      class="header shadow-sm bg-white p-5 flex justify-between items-center w-[90%] max-w-7xl"
      :class="{ 'admin-header': isAdmin }"
    >
      <div class="logo flex items-center gap-2 my-[10px]">
        <img :src="logo" alt="Afrimart" class="logo" />
        <h2 class="text-2xl font-bold" :class="{ 'admin-text': isAdmin }">Afrimart</h2>
        <!-- Role indicator -->
        <span 
          v-if="isAuthenticated" 
          class="text-xs px-2 py-1 rounded-full"
          :class="isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
        >
          {{ isAdmin ? 'ADMIN' : 'USER' }}
        </span>
      </div>

      <!-- Search form - Different placeholder for admin -->
      <form class="search-form flex items-center gap-[5px] max-w-lg mx-auto" :class="{ 'admin-search': isAdmin }">
        <div class="w-full">
          <input
            type="text"
            id="voice-search"
            class="search-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
            :placeholder="isAdmin ? 'Search orders, products...' : 'Search products...'"
            required
          />
        </div>
        <button
          type="submit"
          class="search-btn inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white rounded-lg"
          :class="isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-700 hover:bg-blue-800'"
        >
          <font-awesome-icon :icon="['fas', 'search']" class="w-[20px] h-[20px] mr-[6px]" />
        </button>
      </form>

      <div class="top-links flex items-center gap-[10px] my-[10px]">
        <!-- User Account Dropdown -->
        <div class="relative" v-if="isAuthenticated">
          <button
            @click="toggleDropdown"
            class="user-dropdown-btn flex items-center gap-2 no-underline space-x-2 cursor-pointer transition-colors outline outline-offset-2 rounded-[5px] p-2"
            :class="isAdmin ? 'admin-dropdown-btn' : 'customer-dropdown-btn'"
          >
            <font-awesome-icon :icon="['fa', 'user']" class="h-[20px] w-[20px]" />
            <span class="text-lg font-[400]">{{ userDisplayName }}</span>
            <font-awesome-icon
              :icon="['fas', 'chevron-down']"
              class="h-[12px] w-[12px] transition-transform duration-200"
              :class="{ 'rotate-180': showDropdown }"
            />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showDropdown"
            @click="closeDropdown"
            class="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-gray-200 z-50 py-1"
            :class="{ 'admin-dropdown': isAdmin }"
          >
            <button
              @click="navigateToAccount"
              class="dropdown-item w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
              :class="isAdmin ? 'text-purple-700' : 'text-gray-700'"
            >
              <font-awesome-icon :icon="['fas', 'user-circle']" class="w-4 h-4" />
              {{ isAdmin ? 'Admin Dashboard' : 'My Account' }}
            </button>

            <!-- Admin-specific dropdown items -->
            <div v-if="isAdmin" class="border-t border-gray-200 my-1"></div>

            <button
              v-if="isAdmin"
              @click="navigateToAdminDashboard"
              class="dropdown-item w-full text-left px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'cog']" class="w-4 h-4" />
              Admin Settings
            </button>

            <div class="border-t border-gray-200 my-1"></div>

            <button
              @click="handleLogout"
              class="dropdown-item w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <!-- Login/Signup Button (when not authenticated) -->
        <RouterLink
          v-else
          to="/auth"
          class="link account flex items-center gap-[5px] no-underline cursor-pointer transition-colors rounded-[5px] p-[2px]"
          :class="isAdmin ? 'admin-account' : 'customer-account'"
        >
          <font-awesome-icon :icon="['fa', 'user']" class="icon h-[16px] w-[15px]" />
          <span class="text-lg font-[400]">Sign In</span>
        </RouterLink>

        <!-- Cart (Only show for customers) -->
        <RouterLink
          v-if="!isAdmin && isAuthenticated"
          to="/cart"
          class="link cart px[8px] flex items-center gap-[5px] no-underline cursor-pointer transition-colors rounded-[5px] p-[2px]"
        >
          <font-awesome-icon :icon="['fas', 'shopping-cart']" class="icon h-[20px] w-[20px]" />
          <span class="cart-span text-lg font-[400]">
            {{ cartCount }}
          </span>
        </RouterLink>
      </div>
    </header>

    <!-- NAV LINKS -->
    <nav class="bg-white border-gray-500 w-[90%]" :class="{ 'admin-nav': isAdmin && isAuthenticated }">
      <div class="max-w-7xl mx-auto px-4 py-3 place my-[5px] w-full">
        <div class="flex justify-start space-x-6 text-sm">
          <!-- ADMIN NAVIGATION (Only when admin is authenticated) -->
          <template v-if="isAuthenticated && isAdmin">
            <RouterLink
              to="/adminDashboard"
              class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[90px] mr-[30px] flex items-center gap-1 admin-nav-link"
              :class="isActive('/adminDashboard')"
            >
              <font-awesome-icon :icon="['fas', 'chart-line']" class="w-4 h-4" />
              <span>Overview</span>
            </RouterLink>

            <RouterLink
              to="/admin/products"
              class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[90px] mr-[30px] flex items-center gap-1 admin-nav-link"
              :class="isActive('/admin/products')"
            >
              <font-awesome-icon :icon="['fas', 'box']" class="w-4 h-4" />
              <span>Products</span>
            </RouterLink>

            <RouterLink
              to="/admin/orders"
              class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[90px] mr-[30px] flex items-center gap-1 admin-nav-link"
              :class="isActive('/admin/orders')"
            >
              <font-awesome-icon :icon="['fas', 'shopping-bag']" class="w-4 h-4" />
              <span>Orders</span>
            </RouterLink>
          </template>

          <!-- CUSTOMER NAVIGATION (When customer is authenticated OR no one is authenticated) -->
          <template v-else>
            <RouterLink
              to="/"
              class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[70px] mr-[30px] flex items-center gap-1"
              :class="isActive('/')"
            >
              <span>Home</span>
            </RouterLink>

            <RouterLink
              to="/deals"
              class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[70px] mr-[30px] flex items-center gap-1"
              :class="isActive('/deals')"
            >
              <span>Deals</span>
            </RouterLink>

            <RouterLink
              to="/contact"
              class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[90px] mr-[0px] flex items-center gap-1"
              :class="isActive('/contact')"
            >
              <span>Contact us</span>
            </RouterLink>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* Your existing styles remain exactly the same */
.navbar {
  height: 150px;
  background: #ffffff;
  color: black;
}
.header {
  border-bottom: 1px solid #e6e9ee;
}
.admin-header {
  border-bottom: 1px solid #8b5cf6;
  background: linear-gradient(135deg, #faf5ff 0%, #ffffff 100%);
}
.logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
  border-radius: 20px;
}
.logo h2 {
  color: #5d3471;
  font-weight: 600;
  font-size: 2rem;
}
.admin-text {
  color: #8b5cf6 !important;
}
.input {
  height: 36px;
  border: 1px solid #e6e9ee;
}
.link {
  height: 100%;
  font-weight: 500;
  color: black;
}
.cart-span {
  background: #0f1724;
  width: 15px;
  height: 16.5px;
  color: white;
  text-align: center;
  border-radius: 10px;
  font-size: 0.65rem;
}

.search-form {
  padding: 2px;
  width: 60%;
  border: 1px solid #e6e9ee;
  border-radius: 15px;
  background: #eebefe;
  transition: all 0.2s ease;
}

.admin-search {
  background: #e9d5ff;
  border: 1px solid #8b5cf6;
}

.search-input {
  padding: 8px;
  border: none;
  border-radius: 15px;
  background: transparent;
}

.search-btn {
  margin-right: 5px;
  padding: 6px;
  border: none;
  background: transparent;
}

.account {
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #ffffff;
}

.customer-account {
  background: #5d3471;
}

.admin-account {
  background: #8b5cf6;
}

.cart {
  background: #5d3471;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #ffffff;
}

.active-link {
  padding: 6px;
  background-color: #eebefe;
  color: #804d91 !important;
  border-radius: 6px;
  font-weight: 600;
}

.inactive-link {
  padding: 6px;
  color: #5d3471;
  transition:
    color 0.3s ease,
    background-color 0.3s ease;
}

.inactive-link:hover {
  color: #804d91;
  background-color: #5d3471;
  border-radius: 6px;
}

/* Admin Navigation Styles */
.admin-nav {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-bottom: 2px solid #8b5cf6;
}

.admin-nav-link {
  color: #7c3aed !important;
  font-weight: 600;
}

.admin-nav-link.active-link {
  background-color: #8b5cf6 !important;
  color: white !important;
}

.admin-nav-link.inactive-link:hover {
  background-color: #ddd6fe !important;
  color: #7c3aed !important;
}

/* Dropdown Styles */
.user-dropdown-btn {
  font-size: 0.9rem;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

.customer-dropdown-btn {
  background-color: #5d3471;
  color: #ffffff;
}

.customer-dropdown-btn:hover {
  background-color: #804d91;
  box-shadow: 0 2px 6px rgba(128, 77, 145, 0.3);
}

.admin-dropdown-btn {
  background-color: #8b5cf6;
  color: #ffffff;
}

.admin-dropdown-btn:hover {
  background-color: #7c3aed;
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
}

/* Dropdown Container */
.dropdown-menu {
  border-radius: 12px;
  border: 1px solid #e8d7ef;
  box-shadow: 0px 8px 20px rgba(93, 52, 113, 0.18);
  overflow: hidden;
}

.admin-dropdown {
  border: 1px solid #ddd6fe;
  box-shadow: 0px 8px 20px rgba(139, 92, 246, 0.15);
}

/* Dropdown items */
.dropdown-item {
  font-size: 0.9rem;
  padding: 12px 16px;
  transition: background-color 0.25s ease, padding-left 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Hover effect */
.dropdown-item:hover {
  background-color: #f3e2fa;
  padding-left: 22px;
}

.admin-dropdown .dropdown-item:hover {
  background-color: #f3e8ff;
}

/* Divider */
.dropdown-menu .border-t {
  border-color: #e6d2ef;
}

.admin-dropdown .border-t {
  border-color: #ddd6fe;
}

/* Animation */
@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>