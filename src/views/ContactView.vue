<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const submitForm = () => {
  alert('Message sent! (Form submission logic goes here)')
}
</script>

<template>
  <div class="min-h-screen flex flex-col text-black rounded-[20px]">
    <Navbar />

    <main class="flex-grow py-12 flex justify-center">
      <div class="main-content w-[90%] py-[20px] max-w-5xl">
        <!-- Breadcrumb -->
        <div class="breadcrumb text-sm mb-[10px]">
          <ul class="flex items-center space-x-2">
            <li><a href="#" class="hover:underline">Home</a></li>
            <li class="mr-[10px]">/</li>
            <li>Contact</li>
          </ul>
        </div>

        <!-- Header Section -->
        <div class="banner w-full text-white p-[10px] rounded-2xl mb-[10px]">
          <h1 class="text-2xl sm:text-3xl font-semibold mb-2">Send us a message</h1>
          <p class="text-[#E8B6D5] text-sm">Our team typically replies within 24 hours.</p>
        </div>

        <!-- Contact Form -->
        <div class="contact-form bg-white p-8 rounded-2xl shadow-sm border border-[#E8B6D5]">
          <form @submit.prevent="submitForm" class="form space-y-6 text-black">
            <div class="input-group">
              <label for="email" class="block text-sm font-medium mb-2 text-[#5D3471]">
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
              <label for="subject" class="block text-sm font-medium mb-2 text-[#5D3471]">
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
              <label for="message" class="block text-sm font-medium mb-2 text-[#5D3471]">
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
              class="submit-btn w-full flex justify-center items-center gap-2 py-3 px-4 text-base font-medium text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#804D91]"
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
.breadcrumb {
  color: #5d3471;
}
.breadcrumb ul {
  list-style-type: none;
}
.breadcrumb ul li a {
  text-decoration: none;
  color: #5d3471;
  margin-right: 10px;
}

/* --- Banner --- */
.banner {
  background: linear-gradient(135deg, #5d3471, #804d91, #aa69af);
  color: white;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
}

.banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(93, 52, 113, 0.3);
}

/* --- Contact Form --- */
.contact-form {
  background: #fff;
  padding: 15px;
  transition: all 0.3s ease;
  border-color: #e8b6d5;
}
.contact-form:hover {
  box-shadow: 0 6px 20px rgba(170, 105, 175, 0.2);
}

/* --- Input Fields --- */
.input-group {
  margin-bottom: 10px;
}

.input-group label {
  color: #5d3471;
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
  background-color: #f9f5f8;
  color: #111827;
}

.input-field::placeholder,
.textarea-field::placeholder {
  color: #9ca3af;
}

.input-field:focus,
.textarea-field:focus {
  background-color: #ffffff;
  border-color: #aa69af;
  box-shadow: 0 0 0 3px rgba(170, 105, 175, 0.3);
  outline: none;
}

/* --- Submit Button --- */
.submit-btn {
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #804d91, #aa69af);
  box-shadow: 0 4px 10px rgba(128, 77, 145, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #aa69af, #804d91);
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(93, 52, 113, 0.4);
}

.submit-btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 8px rgba(93, 52, 113, 0.3);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .main-content {
    width: 95%;
    padding: 0 1rem;
  }
}
</style>
