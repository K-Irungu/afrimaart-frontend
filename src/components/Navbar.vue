<script setup>
import logo from '@/assets/images/Afrimart2.png'
import { useRoute } from 'vue-router'

// Call useRoute() to get the route object
const route = useRoute()

const isActive = (path) => {
  return route.path === path
    ? 'text-blue-600 font-medium bg-blue-50'
    : 'text-gray-700 hover:text-blue-600'
}
</script>

<template>
  <div class="navbar w-full grid grid-flow-col grid-rows-2 gap-0 place-items-center">
    <!-- Header -->
    <header
      class="header shadow-sm bg-white p-5 flex justify-between items-center w-[90%] max-w-7xl"
    >
      <div class="logo flex items-center gap-2 my-[10px]">
        <img :src="logo" alt="Afrimart" class="logo" />
        <h2 class="text-2xl font-bold">Afrimart</h2>
      </div>
      <input
        type="text"
        placeholder="Search for products, brands and more"
        class="input w-1/2 px-4 my-[10px] border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 hover:shadow-md transition-all duration-200"
      />
      <div class="flex items-center gap-[10px] my-[10px]">
        <!-- Account with Icon -->
        <div
          class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
        >
          <!-- User Icon -->
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          <span class="text-sm">Account</span>
        </div>

        <!-- Shopping Cart with Icon -->
        <div
          class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors relative"
        >
          <!-- Shopping Cart Icon -->
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          <span class="text-sm">Cart</span>
          <div
            class="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
          >
            3
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation links -->
    <nav class="bg-white border-gray-500 w-[90%]">
      <div class="max-w-7xl mx-auto px-4 py-3 place my-[5px] w-full">
        <div class="flex justify-start space-x-6 text-sm">
          <RouterLink
            to="/"
            class="link px-2 py-1 rounded no-underline w-[70px] mr-[30px]"
            :class="isActive('/')"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/new-arrivals"
            class="link px-2 py-1 rounded no-underline w-[110px] mr-[30px]"
            :class="isActive('/new-arrivals')"
          >
            New Arrivals
          </RouterLink>
          <RouterLink
            to="/deals"
            class="link px-2 py-1 rounded no-underline w-[70px] mr-[30px]"
            :class="isActive('/deals')"
          >
            Deals
          </RouterLink>
          <RouterLink
            to="/about"
            class="link px-2 py-1 rounded no-underline w-[70px] mr-[30px]"
            :class="isActive('/about')"
          >
            About
          </RouterLink>
          <RouterLink
            to="/contact"
            class="link px-2 py-1 rounded no-underline w-[70px] mr-[0px]"
            :class="isActive('/contact')"
          >
            Contact
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
  font-weight: 600;
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
</style>
