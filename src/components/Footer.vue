<template>
  <footer class="footer bg-gray-800 text-gray-300 p-[12px]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-4 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold text-white mb-4">Afrimart</h3>
          <p class="text-gray-400 text-sm leading-relaxed">
            High-quality products curated for everyday life. Fast shipping, easy returns, and secure
            checkout.
          </p>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-white mb-4">Company</h4>
          <ul class="space-y-2 list-none">
            <li>
              <RouterLink
                to="/about"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >About</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/careers"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >Careers</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/press"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >Press</RouterLink
              >
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-white mb-4">Support</h4>
          <ul class="space-y-2 list-none">
            <li>
              <RouterLink
                to="/contact"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >Contact</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/help-center"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >Help Center</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/returns"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >Returns</RouterLink
              >
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-white mb-4">Legal</h4>
          <ul class="space-y-2 list-none">
            <li>
              <RouterLink
                to="/privacy-policy"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >Privacy Policy</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/terms-of-service"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >Terms of Service</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/cookie-policy"
                class="text-gray-400 hover:text-white transition-colors duration-200 text-sm no-underline"
                >Cookie Policy</RouterLink
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.footer {
  background: #ffffff;
  color: #282f37;
}
h4,
h3 {
  color: #000000;
  font-weight: 700;
  font-size: 1.125rem;
}
</style>
