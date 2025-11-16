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

// Computed property for user display name
const userDisplayName = computed(() => {
  if (props.user?.firstName && props.user?.lastName) {
    return `${props.user.firstName} ${props.user.lastName}`
  }
  return props.user?.name || 'Account'
})

// Check authentication status
const checkAuthStatus = () => {
  const userData = localStorage.getItem('user')
  if (userData || props.user?.firstName) {
    isAuthenticated.value = true
  } else {
    isAuthenticated.value = false
  }
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
  router.push('/')
}

// Navigate to account
const navigateToAccount = () => {
  if (!isAuthenticated.value) {
    router.push('/auth')
  } else {
    router.push('/account')
  }
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
    <header
      class="header shadow-sm bg-white p-5 flex justify-between items-center w-[90%] max-w-7xl"
    >
      <div class="logo flex items-center gap-2 my-[10px]">
        <img :src="logo" alt="Afrimart" class="logo" />
        <h2 class="text-2xl font-bold">Afrimart</h2>
      </div>

      <form class="search-form flex items-center gap-[5px] max-w-lg mx-auto">
        <div class="w-full">
          <input
            type="text"
            id="voice-search"
            class="search-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
            placeholder="Search products..."
            required
          />
        </div>
        <button
          type="submit"
          class="search-btn inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg"
        >
          <font-awesome-icon :icon="['fas', 'search']" class="w-[20px] h-[20px] mr-[6px]" />
        </button>
      </form>

      <div class="top-links flex items-center gap-[10px] my-[10px]">
        <!-- User Account Dropdown -->
        <div class="relative" v-if="isAuthenticated">
          <button
            @click="toggleDropdown"
            class="user-dropdown-btn flex items-center gap-2 no-underline space-x-2 cursor-pointer transition-colors outline outline-offset-2 rounded-[5px] p-2 hover:bg-gray-100"
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
          >
            <button
              @click="navigateToAccount"
              class="dropdown-item w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'user-circle']" class="w-4 h-4" />
              My Account
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
        >
          <font-awesome-icon :icon="['fa', 'user']" class="icon h-[16px] w-[15px]" />
          <span class="text-lg font-[400]">Sign In</span>
        </RouterLink>

        <!-- Cart -->
        <RouterLink
          to="/cart"
          class="link cart px[8px] flex items-center gap-[5px] no-underline ursor-pointer transition-colors rounded-[5px] p-[2px]"
        >
          <font-awesome-icon :icon="['fas', 'shopping-cart']" class="icon h-[20px] w-[20px]" />
          <span class="cart-span text-lg font-[400]">
            {{ cartCount }}
          </span>
        </RouterLink>
      </div>
    </header>

    <nav class="bg-white border-gray-500 w-[90%]">
      <div class="max-w-7xl mx-auto px-4 py-3 place my-[5px] w-full">
        <div class="flex justify-start space-x-6 text-sm">
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
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar {
  height: 150px;
  background: #ffffff;
  color: black;
}
.header {
  border-bottom: 1px solid #e6e9ee;
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
  background: #eebefe;
  color: black;
}
.account,
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

/* Dropdown Styles */
.user-dropdown-btn {
  font-size: 0.9rem;
  background-color: #5d3471;
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

.user-dropdown-btn:hover {
  background-color: #804d91;
  box-shadow: 0 2px 6px rgba(128, 77, 145, 0.3);
}

/* Dropdown Container */
.dropdown-menu {
  border-radius: 12px;
  border: 1px solid #e8d7ef;
  box-shadow: 0px 8px 20px rgba(93, 52, 113, 0.18);
  overflow: hidden; /* Smooth rounded edges */
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
  padding-left: 22px; /* Smooth slide effect on hover */
}

/* Divider */
.dropdown-menu .border-t {
  border-color: #e6d2ef;
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
