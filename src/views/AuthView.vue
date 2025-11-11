<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authIllustration from '@/assets/images/authIllustration.jpg'

const router = useRouter()

// Toggle between login and signup
const isLogin = ref(true)

// Form data
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const signupForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  newsletter: true,
})

// Form validation states
const errors = ref({})
const isLoading = ref(false)

// Toggle function
const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  errors.value = {}
}

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  return password.length >= 6
}

const validatePhone = (phone) => {
  // Allows international format with +, and numbers with/without spaces/dashes
  const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{8,}$/
  return phoneRegex.test(phone)
}

const validateForm = () => {
  errors.value = {}

  if (isLogin.value) {
    // Login validation
    if (!loginForm.value.email) {
      errors.value.email = 'Email is required'
    } else if (!validateEmail(loginForm.value.email)) {
      errors.value.email = 'Please enter a valid email address'
    }

    if (!loginForm.value.password) {
      errors.value.password = 'Password is required'
    } else if (!validatePassword(loginForm.value.password)) {
      errors.value.password = 'Password must be at least 6 characters'
    }
  } else {
    // Signup validation
    if (!signupForm.value.firstName) {
      errors.value.firstName = 'First name is required'
    }

    if (!signupForm.value.lastName) {
      errors.value.lastName = 'Last name is required'
    }

    if (!signupForm.value.email) {
      errors.value.email = 'Email is required'
    } else if (!validateEmail(signupForm.value.email)) {
      errors.value.email = 'Please enter a valid email address'
    }

    if (!signupForm.value.phone) {
      errors.value.phone = 'Phone number is required'
    } else if (!validatephone(signupForm.value.phone)) {
      errors.value.phone = 'Please enter a valid phone number'
    }

    if (!signupForm.value.password) {
      errors.value.password = 'Password is required'
    } else if (!validatePassword(signupForm.value.password)) {
      errors.value.password = 'Password must be at least 6 characters'
    }

    if (!signupForm.value.confirmPassword) {
      errors.value.confirmPassword = 'Please confirm your password'
    } else if (signupForm.value.password !== signupForm.value.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match'
    }

    if (!signupForm.value.agreeToTerms) {
      errors.value.agreeToTerms = 'You must agree to the terms and conditions'
    }
  }

  return Object.keys(errors.value).length === 0
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (isLogin.value) {
      console.log('Logging in:', loginForm.value)
      // Store user data in localStorage
      const userData = {
        id: 1,
        email: loginForm.value.email,
        name: 'User Name', // You can get this from your API response
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      console.log('Signing up:', signupForm.value)
      // Store user data in localStorage
      const userData = {
        id: Date.now(),
        email: signupForm.value.email,
        name: `${signupForm.value.firstName} ${signupForm.value.lastName}`,
        phone: signupForm.value.phone,
        signupTime: new Date().toISOString(),
      }
      localStorage.setItem('user', JSON.stringify(userData))
    }

    // Redirect to home or intended page
    router.push('/')
  } catch (error) {
    console.error('Auth error:', error)
    errors.value.submit = isLogin.value
      ? 'Login failed. Please check your credentials.'
      : 'Signup failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Password visibility toggle
const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>

<template>
  <div
    class="auth-main min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="auth-forms max-w-md w-full">
      <!-- Auth Card -->
      <div class="flex justify-center item-center gap-[20px]">
        <!-- Left side -->
        <div
          class="left relative w-2/5 bg-indigo-100 flex flex-col items-center justify-center text-center p-10"
        >
          <img :src="authIllustration" alt="Tasky Illustration" class="w-full h-[600px] mb-6" />
          <div class="left-text absolute">
            <h2 class="text-2xl font-semibold text-indigo-800 mb-2">Manage your tasks easily</h2>
            <p class="text-gray-600">
              Manage your task in an easy and more efficient way with
              <span class="font-semibold text-indigo-700">Tasky</span>.
            </p>
          </div>
        </div>

        <!-- Right side -->
        <div class="right w-3/5 bg-white rounded-3xl shadow-2xl overflow-hidden">
          <!-- Header with Toggle -->
          <div
            class="header-toggle bg-gradient-to-r from-blue-600 to-purple-700 p-8 py-[5px] text-center mb-[15px]"
          >
            <h1 class="text-3xl font-bold text-white mb-2">
              {{ isLogin ? 'Welcome Back' : 'Join Us Today' }}
            </h1>
            <p class="text-blue-100">
              {{ isLogin ? 'Sign in to your account' : 'Create your account in seconds' }}
            </p>
          </div>

          <!-- Toggle Buttons -->
          <div class="toggle-btns flex gap-[25px] border-b border-gray-200 mb-[12px]">
            <button
              @click="toggleAuthMode"
              :class="[
                'flex-1 py-4 font-semibold transition-all duration-300',
                isLogin
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              Sign In
            </button>
            <button
              @click="toggleAuthMode"
              :class="[
                'flex-1 py-4 font-semibold transition-all duration-300',
                !isLogin
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              Sign Up
            </button>
          </div>

          <!-- Form Container -->
          <div class="form-container p-8">
            <!-- Error Message -->
            <div
              v-if="errors.submit"
              class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {{ errors.submit }}
            </div>

            <!-- Login Form -->
            <form v-if="isLogin" @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Email -->
              <div class="input-group">
                <label for="loginEmail" class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  v-model="loginForm.email"
                  type="email"
                  placeholder="Enter your email"
                  :class="[
                    'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200',
                    errors.email
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
                  ]"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Password -->
              <div class="input-group">
                <label for="loginPassword" class="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div class="">
                  <input
                    id="loginPassword"
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter your password"
                    :class="[
                      'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-12',
                      errors.password
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
                    ]"
                  />
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                  {{ errors.password }}
                </p>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="input-group flex items-center justify-between">
                <label class="flex items-center">
                  <input
                    v-model="loginForm.rememberMe"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" class="text-sm no-underline"> Forgot password? </a>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                :class="[
                  'submit-btn w-full py-[8px] px-[6px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-200',
                  isLoading ? 'opacity-50 cursor-not-allowed' : '',
                ]"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </span>
                <span v-else>Sign In</span>
              </button>
            </form>

            <!-- Signup Form -->
            <form v-else @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name Fields -->
              <div class="grid grid-cols-2 gap-[20px]">
                <div class="input-group">
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    v-model="signupForm.firstName"
                    type="text"
                    placeholder="First name"
                    :class="[
                      'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200',
                      errors.firstName
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
                    ]"
                  />
                  <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
                    {{ errors.firstName }}
                  </p>
                </div>
                <div class="input-group">
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    v-model="signupForm.lastName"
                    type="text"
                    placeholder="Last name"
                    :class="[
                      'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200',
                      errors.lastName
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
                    ]"
                  />
                  <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
                    {{ errors.lastName }}
                  </p>
                </div>
              </div>

              <!-- Email -->
              <div class="input-group">
                <label for="signupEmail" class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="signupEmail"
                  v-model="signupForm.email"
                  type="email"
                  placeholder="Enter your email"
                  :class="[
                    'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200',
                    errors.email
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
                  ]"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Phone Number -->
              <div class="input-group">
                <label for="Phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number:
                </label>
                <input
                  id="phoneNumber"
                  v-model="signupForm.phone"
                  type="phone"
                  placeholder="Enter your phone number"
                  :class="[
                    'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200',
                    errors.phone
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
                  ]"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>

              <div class="grid grid-cols-2 gap-[20px]">
                <!-- Password -->
                <div class="input-group password">
                  <label for="signupPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div class="relative">
                    <input
                      id="signupPassword"
                      v-model="signupForm.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Create a password"
                      :class="[
                        'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-12',
                        errors.password
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
                      ]"
                    />
                  </div>
                  <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                    {{ errors.password }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="w-4 h-4" />
                    Must be at least 6 characters
                  </p>
                </div>

                <!-- Confirm Password -->
                <div class="input-group confirm-password">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div>
                    <input
                      id="confirmPassword"
                      v-model="signupForm.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="Confirm your password"
                      :class="[
                        'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-12',
                        errors.confirmPassword
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
                      ]"
                    />
                  </div>
                  <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
                    {{ errors.confirmPassword }}
                  </p>
                </div>
              </div>

              <!-- Terms and Newsletter
              <div class="space-y-4">
                <label class="flex items-start">
                  <input
                    v-model="signupForm.agreeToTerms"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <span class="ml-2 text-sm text-gray-600">
                    I agree to the
                    <a href="#" class="text-blue-600 hover:text-blue-700 transition-colors"
                      >Terms of Service</a
                    >
                    and
                    <a href="#" class="text-blue-600 hover:text-blue-700 transition-colors"
                      >Privacy Policy</a
                    >
                  </span>
                </label>
                <p v-if="errors.agreeToTerms" class="text-sm text-red-600">
                  {{ errors.agreeToTerms }}
                </p>

                <label class="flex items-center">
                  <input
                    v-model="signupForm.newsletter"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-600">
                    Send me product updates and marketing communications
                  </span>
                </label>
              </div> -->

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                :class="[
                  'submit-btn w-full py-[6px] px-[8px] my-[5px] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5',
                  isLoading ? 'opacity-50 cursor-not-allowed' : '',
                ]"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  Creating Account...
                </span>
                <span v-else>Create Account</span>
              </button>
            </form>

            <!-- Footer Links -->
            <div class="footer-links mt-[8px] text-center">
              <p class="text-sm">
                {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
                <button
                  @click="toggleAuthMode"
                  class="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {{ isLogin ? 'Sign up' : 'Sign in' }}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-main {
  background: #c2d9fc;
}
.auth-forms {
  background: #ffffff;
  padding: 30px;
  width: 90%;
  border-radius: 30px;
}
.left img {
  border-radius: 20px;
}
.left-text h2 {
  font-size: 2rem;
  font-weight: 600;
}
.right {
  padding: 10px;
}
.header-toggle h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #5d3471;
}
.header-toggle p {
  font-size: 1.2rem;
  color: #804d91;
}
.toggle-btns {
  padding: 5px;
}
.toggle-btns button {
  padding: 8px;
  border: 1.5px solid #804d91;
  border-radius: 20px;
  font-size: 1rem;
  background: #5d3471;
  color: #ffffff;
}

.input-group {
  margin-bottom: 10px;
}
.input-group input {
  padding: 8px;
  border-radius: 10px;
  background: #eebefe;
}
.input-group label {
  color: #5d3471;
  font-weight: 500;
}
.password p {
  color: #2d1638;
}
.submit-btn {
  border: 1.5px solid #804d91;
  background: #5d3471;
  border-radius: 15px;
  font-size: 1rem;
  color: #ffffff;
}
form {
  animation: fadeIn 0.3s ease-in-out;
}

.footer-links p {
  color: #2d1638;
  font-weight: 400;
}
.footer-links button {
  border: none;
  background: transparent;
  color: #804d91;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid.grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .grid.grid-cols-2 > div:first-child {
    margin-bottom: 1rem;
  }
}
</style>
