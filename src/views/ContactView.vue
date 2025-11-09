<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const submitForm = () => {
  alert('Message sent! (Form submission logic goes here)')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f9fafb] text-black">
    <Navbar />

    <main class="flex-grow py-12 flex justify-center">
      <div class="main-content w-[90%] py-[20px] max-w-5xl">
        <!-- Breadcrumb -->
        <div class="breadcrumps text-sm mb-[10px]">
          <ul class="flex items-center space-x-2">
            <li><a href="#" class="hover:underline">Home</a></li>
            <li class="mr-[10px]">/</li>
            <li>Contact</li>
          </ul>
        </div>

        <!-- Header Section -->
        <div class="banner bg-[#0f172a] text-white p-8 rounded-2xl mb-[10px]">
          <h1 class="text-2xl sm:text-3xl font-semibold mb-2">Send us a message</h1>
          <p class="text-gray-400 text-sm">Our team typically replies within 24 hours.</p>
        </div>

        <!-- Contact Form -->
        <div class="contact-form bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form @submit.prevent="submitForm" class="form space-y-6 text-black">
            <div class="input-group">
              <label for="email" class="block text-sm font-medium mb-2 text-black">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autocomplete="email"
                required
                placeholder="name@example.com"
                class="input-field"
              />
            </div>

            <div class="input-group">
              <label for="subject" class="block text-sm font-medium mb-2 text-black">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="Write a short subject"
                class="input-field"
              />
            </div>

            <div class="input-group">
              <label for="message" class="block text-sm font-medium mb-2 text-black">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                placeholder="Type your message to the company..."
                class="textarea-field"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="submit-btn w-full flex justify-center items-center gap-2 py-3 px-4 text-base font-medium text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <font-awesome-icon :icon="['fas', 'paper-plane']" class="w-4 h-4" />
              Send message
            </button>
          </form>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* --- Breadcrumb --- */
.breadcrumps {
  color: #000000;
}
.breadcrumps ul {
  list-style-type: none;
}
.breadcrumps ul li a {
  text-decoration: none;
  color: #000000;
  margin-right: 10px;
}

/* --- Banner --- */
.banner {
  background: #0f172a;
  border-radius: 20px;
  padding: 10px;
}

/* --- Contact Form --- */
.contact-form {
  background: white;
  padding: 15px;
  transition: all 0.3s ease;
}
.contact-form:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

/* --- Input Fields --- */
.input-group {
  margin-bottom: 10px;
}

.input-group label {
  color: #000000;
  font-size: 1rem;
  font-weight: 500;
}

.input-field,
.textarea-field {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  color: #111827;
}

.input-field::placeholder,
.textarea-field::placeholder {
  color: #9ca3af;
}

.input-field:focus,
.textarea-field:focus {
  background-color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  outline: none;
}

/* --- Submit Button --- */
.submit-btn {
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #1d4ed8, #2563eb);
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
}

.submit-btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.3);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .main-content {
    width: 95%;
    padding: 0 1rem;
  }
}
</style>
