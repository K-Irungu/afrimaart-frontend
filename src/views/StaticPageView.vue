<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()

const pageContent = computed(() => {
  const pathToKey = {
    '/about': 'about',
    '/careers': 'careers',
    '/press': 'press',
    '/help-center': 'help',
    '/returns': 'returns',
    '/privacy-policy': 'privacy',
    '/terms-of-service': 'terms',
    '/cookie-policy': 'cookies',
  }
  const key = pathToKey[route.path] || 'about'
  const pages = {
    about: {
      title: 'About Us',
      description: 'Learn more about Afrimart.',
      body: `
        <p class="mb-4">Afrimart brings you high-quality products curated for everyday life.</p>
        <p class="mb-4">We offer fast shipping, easy returns, and secure checkout so you can shop with confidence.</p>
      `,
    },
    careers: {
      title: 'Careers',
      description: 'Join the Afrimart team.',
      body: `
        <p class="mb-4">We're always looking for talented people to help us bring great products to our customers.</p>
        <p class="mb-4">Open roles and how to apply will be listed here. Check back soon or reach out via our Contact page.</p>
      `,
    },
    press: {
      title: 'Press',
      description: 'Media and press resources.',
      body: `
        <p class="mb-4">For press inquiries and media kit requests, please contact us through our Contact page.</p>
        <p class="mb-4">We're happy to provide information about Afrimart, our products, and company news.</p>
      `,
    },
    help: {
      title: 'Help Center',
      description: 'Find answers and get support.',
      body: `
        <p class="mb-4">Browse common questions about orders, shipping, returns, and account settings.</p>
        <p class="mb-4">Can't find what you need? Use our <a href="/contact" class="text-[#5858E0] hover:underline">Contact</a> page to get in touch.</p>
      `,
    },
    returns: {
      title: 'Returns',
      description: 'Easy returns and refunds.',
      body: `
        <p class="mb-4">We want you to be happy with your purchase. If something isn't right, you can return eligible items within 30 days.</p>
        <p class="mb-4">Start a return from your account order history or contact support for assistance.</p>
      `,
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'How we use and protect your data.',
      body: `
        <p class="mb-4">Afrimart respects your privacy. This policy describes what data we collect and how we use it.</p>
        <p class="mb-4">We use your information to process orders, improve our service, and communicate with you. We do not sell your personal data.</p>
      `,
    },
    terms: {
      title: 'Terms of Service',
      description: 'Terms governing use of Afrimart.',
      body: `
        <p class="mb-4">By using Afrimart, you agree to these terms. Please read them carefully.</p>
        <p class="mb-4">We reserve the right to update these terms. Continued use of the site after changes constitutes acceptance.</p>
      `,
    },
    cookies: {
      title: 'Cookie Policy',
      description: 'How we use cookies.',
      body: `
        <p class="mb-4">We use cookies and similar technologies to improve your experience, remember preferences, and analyze site traffic.</p>
        <p class="mb-4">You can manage cookie settings in your browser. Some features may not work correctly if cookies are disabled.</p>
      `,
    },
  }
  return pages[key] || { title: 'Page', description: '', body: '<p>Content not found.</p>' }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow py-12 flex justify-center">
      <div class="main-content w-[90%] max-w-4xl mx-auto px-4">
        <nav class="breadcrumb text-sm mb-6">
          <router-link to="/" class="text-[#5858E0] hover:underline">Home</router-link>
          <span class="mx-2">/</span>
          <span class="text-[#2A2A6B]">{{ pageContent.title }}</span>
        </nav>
        <div class="banner bg-[#5858E0] text-white p-8 rounded-2xl mb-8">
          <h1 class="text-2xl sm:text-3xl font-semibold mb-2">{{ pageContent.title }}</h1>
          <p class="text-white/90 text-sm">{{ pageContent.description }}</p>
        </div>
        <div class="content bg-white p-8 rounded-2xl shadow-sm border border-[#E8E7FC] text-[#2A2A6B] prose prose-sm max-w-none">
          <div v-html="pageContent.body" class="static-page-body"></div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.static-page-body :deep(a) {
  color: #5858E0;
}
.static-page-body :deep(p) {
  margin-bottom: 1rem;
}
</style>
