<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <header class="hero">
      <h1>Welcome to Afrimart</h1>
      <p>Your one-stop shop for quality African products</p>
      <RouterLink to="/products" class="btn">Shop Now</RouterLink>
    </header>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}
.hero {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: white;
  border-radius: 12px;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}
p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}
.btn {
  display: inline-block;
  background-color: white;
  color: #ff8c00;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s;
}
.btn:hover {
  background-color: #ffe4b5;
}
</style>
