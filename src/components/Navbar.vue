<script setup>
import logo from '@/assets/images/Afrimart2.png'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'

const route = useRoute()

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

      <form class="search-form flex items-center max-w-lg mx-auto">
        <label for="voice-search" class="sr-only">Search</label>
        <div class="relative w-full">
          <input
            type="text"
            id="voice-search"
            class="search-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
            placeholder="Search address"
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
        <RouterLink
          to="/account"
          class="link account flex items-center gap-[5px] no-underline space-x-2 cursor-pointer transition-colors outline outline-offset-2 rounded-[5px] p-[2px]"
        >
          <font-awesome-icon :icon="['fa', 'user']" class="h-[20px] w-[20px]" />
          <span class="text-lg font-[400]">Account</span>
        </RouterLink>

        <RouterLink
          to="/cart"
          class="link cart flex items-center gap-[5px] no-underline space-x-2 cursor-pointer transition-colors relative outline outline-offset-2 rounded-[5px] p-[2px]"
        >
          <font-awesome-icon :icon="['fas', 'shopping-cart']" class="h-[20px] w-[20px]" />
          <span class="cart-span text-lg font-[400]">3</span>
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
            to="/new-arrivals"
            class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[110px] mr-[30px] flex items-center gap-1"
            :class="isActive('/new-arrivals')"
          >
            <span>New Arrivals</span>
          </RouterLink>

          <RouterLink
            to="/deals"
            class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[70px] mr-[30px] flex items-center gap-1"
            :class="isActive('/deals')"
          >
            <span>Deals</span>
          </RouterLink>

          <!-- <RouterLink
            to="/about"
            class="link px-2 py-1 flex justify-center items-center rounded no-underline w-[70px] mr-[30px] flex items-center gap-1"
            :class="isActive('/about')"
          >
            <span>About</span>
          </RouterLink> -->

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
  border-radius: 10px;
  background: #f7f9fb;
  transition: all 0.2s ease;
}

.search-input {
  padding: 10px;
  border: none;
  background: #f7f9fb;
}

.search-input:focus {
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-btn {
  margin-right: 5px;
  padding: 10px;
  border: none;
  background: #f7f9fb;
  color: black;
}

.active-link {
  padding: 6px;
  background-color: #c0d9fd;
  color: #0066ff !important;
  border-radius: 6px;
  font-weight: 600;
}

.inactive-link {
  padding: 6px;
  color: #000000;
  transition:
    color 0.3s ease,
    background-color 0.3s ease;
}

.inactive-link:hover {
  color: #0066ff;
  background-color: rgba(123, 133, 147, 0.1);
}
</style>
