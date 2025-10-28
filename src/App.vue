<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/products">Products</RouterLink>
    </nav>

    <!-- 👇 This displays the current route’s component -->
    <RouterView />
  </div>
</template>

<style scoped>
nav {
  background-color: #ff8c00;
  padding: 1rem;
  text-align: center;
}
nav a {
  color: white;
  margin: 0 1rem;
  text-decoration: none;
  font-weight: bold;
}
nav a:hover {
  text-decoration: underline;
}
</style>
