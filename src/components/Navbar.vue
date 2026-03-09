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
      <RouterLink to="/" class="logo-link flex items-center gap-2 my-[10px] no-underline text-inherit hover:opacity-90">
        <img :src="logo" alt="Afrimart" class="logo" />
        <h2 class="text-2xl font-bold" :class="{ 'admin-text': isAdmin }">Afrimart</h2>
      </RouterLink>

      <!-- Search form - Different placeholder for admin -->
      <form class="search-form flex items-center gap-[5px] max-w-lg mx-auto" :class="{ 'admin-search': isAdmin }">
        <div class="w-full">
          <input
            type="text"
            id="voice-search"
            class="search-input text-sm rounded-lg block w-full ps-10 p-2.5 placeholder:text-[#3D3D8B]/70"
            :placeholder="isAdmin ? 'Search orders, products...' : 'Search products...'"
            required
            aria-label="Search"
          />
        </div>
        <button
          type="submit"
          class="search-btn inline-flex items-center py-2.5 px-4 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Search"
        >
          <font-awesome-icon :icon="['fas', 'search']" class="w-[20px] h-[20px] mr-[6px]" />
        </button>
      </form>

      <div class="top-links flex items-center gap-[10px] my-[10px]">
        <!-- User Account Dropdown -->
        <div class="relative" v-if="isAuthenticated">
          <button
            @click="toggleDropdown"
            type="button"
            class="user-dropdown-btn flex items-center gap-2 no-underline space-x-2 cursor-pointer transition-colors rounded-lg p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5858E0]"
            :class="isAdmin ? 'admin-dropdown-btn' : 'customer-dropdown-btn'"
            :aria-expanded="showDropdown"
            aria-haspopup="true"
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
              type="button"
              @click="navigateToAccount"
              class="dropdown-item w-full text-left px-4 py-3 text-sm text-[#2A2A6B] transition-colors flex items-center gap-2 rounded-none focus:outline-none focus-visible:bg-[#E8E7FC]"
            >
              <font-awesome-icon :icon="['fas', 'user-circle']" class="w-4 h-4 text-[#5858E0]" />
              {{ isAdmin ? 'Admin Dashboard' : 'My Account' }}
            </button>

            <!-- Admin-specific dropdown items -->
            <div v-if="isAdmin" class="border-t border-[#E8E7FC] my-1"></div>

            <button
              v-if="isAdmin"
              type="button"
              @click="navigateToAdminDashboard"
              class="dropdown-item w-full text-left px-4 py-3 text-sm text-[#2A2A6B] transition-colors flex items-center gap-2 rounded-none focus:outline-none focus-visible:bg-[#E8E7FC]"
            >
              <font-awesome-icon :icon="['fas', 'cog']" class="w-4 h-4 text-[#5858E0]" />
              Admin Settings
            </button>

            <div class="border-t border-[#E8E7FC] my-1"></div>

            <button
              type="button"
              @click="handleLogout"
              class="dropdown-item dropdown-item-danger w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 rounded-none focus:outline-none focus-visible:bg-[#FEE2E2]"
            >
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="w-4 h-4 text-[#dc2626]" />
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
    <nav class="nav-links bg-white w-[90%] max-w-7xl mx-auto" :class="{ 'admin-nav': isAdmin && isAuthenticated }">
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
              class="link px-2 py-1 flex justify-center items-center rounded no-underline min-w-[100px] whitespace-nowrap mr-[0px] flex items-center gap-1"
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
.navbar {
  min-height: 140px;
  background: #ffffff;
  color: #2A2A6B;
}
.header {
  border-bottom: 1px solid #E8E7FC;
  box-shadow: 0 1px 0 rgba(42, 42, 107, 0.06);
}
.admin-header {
  border-bottom: 1px solid #5858E0;
  background: #ffffff;
}
.logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
  border-radius: 12px;
}
.logo-link h2,
.logo h2 {
  color: #5858E0;
  font-weight: 600;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
}
.admin-text {
  color: #5858E0 !important;
}
.link {
  height: 100%;
  font-weight: 500;
  color: #2A2A6B;
}
.cart-span {
  background: #5858E0;
  min-width: 18px;
  height: 18px;
  color: white;
  text-align: center;
  border-radius: 9px;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.search-form {
  padding: 3px;
  width: 60%;
  max-width: 420px;
  border: 1px solid #E8E7FC;
  border-radius: 12px;
  background: #E8E7FC;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.search-form:focus-within {
  border-color: #5858E0;
  box-shadow: 0 0 0 3px rgba(88, 88, 224, 0.15);
}

.admin-search {
  background: #E8E7FC;
  border: 1px solid #5858E0;
}

.search-input {
  padding: 8px 12px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #2A2A6B;
}
.search-input::placeholder {
  color: #3D3D8B;
  opacity: 0.8;
}
.search-input:focus {
  outline: none;
}

.search-btn {
  margin-right: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 10px;
  background: #5858E0;
  color: #ffffff;
  transition: background-color 0.2s ease;
}
.search-btn:hover {
  background: #4545C7;
}
.search-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #5858E0;
}

.account {
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}
.account:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #5858E0;
}

.customer-account {
  background: #5858E0;
}
.customer-account:hover {
  background: #4545C7;
}

.admin-account {
  background: #2A2A6B;
}
.admin-account:hover {
  background: #1a1a4a;
}

.cart {
  background: #5858E0;
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}
.cart:hover {
  background: #4545C7;
}

.active-link {
  padding: 8px 14px;
  background-color: #5858E0;
  color: #ffffff !important;
  border-radius: 10px;
  font-weight: 600;
}

.inactive-link {
  padding: 8px 14px;
  color: #2A2A6B;
  border-radius: 10px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.inactive-link:hover {
  color: #ffffff;
  background-color: #5858E0;
}

/* Admin Navigation Styles */
.admin-nav {
  background: #F0EFFC;
  border-bottom: 1px solid #E8E7FC;
}

.admin-nav-link {
  color: #2A2A6B !important;
  font-weight: 600;
}

.admin-nav-link.active-link {
  background-color: #5858E0 !important;
  color: #ffffff !important;
}

.admin-nav-link.inactive-link:hover {
  background-color: #E8E7FC !important;
  color: #5858E0 !important;
}

.nav-links {
  border-bottom: 1px solid #E8E7FC;
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
  background-color: #5858E0;
  color: #ffffff;
}

.customer-dropdown-btn:hover {
  background-color: #4545C7;
}

.admin-dropdown-btn {
  background-color: #2A2A6B;
  color: #ffffff;
}

.admin-dropdown-btn:hover {
  background-color: #1a1a4a;
}

/* Dropdown Container */
.dropdown-menu {
  border-radius: 12px;
  border: 1px solid #E8E7FC;
  box-shadow: 0 10px 40px rgba(42, 42, 107, 0.12);
  overflow: hidden;
  min-width: 200px;
}

.admin-dropdown {
  border: 1px solid #E8E7FC;
  box-shadow: 0 10px 40px rgba(42, 42, 107, 0.12);
}

/* Dropdown items */
.dropdown-item {
  font-size: 0.875rem;
  padding: 12px 16px;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-item:hover {
  background-color: #E8E7FC;
}

.dropdown-item-danger {
  color: #dc2626 !important;
}
.dropdown-item-danger:hover {
  background-color: #FEE2E2 !important;
}

/* Divider */
.dropdown-menu .border-t {
  border-color: #E8E7FC;
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