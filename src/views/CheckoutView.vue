<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import OrderSummary from '@/components/OrderSummary.vue'

const router = useRouter()
const route = useRoute()

// API endpoints
const API_BASE = 'http://localhost:5050'
const ADDRESSES_API = `${API_BASE}/addresses`
const PAYMENT_METHODS_API = `${API_BASE}/payment-methods`
const ORDERS_API = `${API_BASE}/orders`

// User data
const currentUser = ref(null)
const userData = ref({
  isAuthenticated: true,
  userId: null,
  addresses: [],
  paymentMethods: [],
})

// Checkout state
const checkoutState = ref({
  currentStep: 1,
  selectedAddress: null,
  selectedPaymentMethod: null,
  useNewAddress: false,
  useNewPayment: false,
  useDifferentContact: false,
})

// Form data
const newAddressForm = ref({
  address_line_1: '',
  address_line_2: '',
  city: '',
  state_region: '',
  postal_code: '',
  country: 'Kenya',
  type: 'Home',
})

const newContactForm = ref({
  email: '',
  phone: '',
})

const newPaymentForm = ref({
  type: 'mpesa',
  phone_number: '',
  isDefault: false,
})

// Order data
const orderData = ref({
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
})

// Update order data with cart data from route
const loadCartData = () => {
  if (route.query.cartData) {
    try {
      const cartData = JSON.parse(route.query.cartData)
      console.log('Cart data received:', cartData)

      orderData.value.subtotal = cartData.subtotal || 0
      orderData.value.shipping = cartData.shipping || 0
      orderData.value.tax = cartData.tax || 0
      orderData.value.discount = cartData.discount || 0

      console.log('Updated order data:', orderData.value)
    } catch (error) {
      console.error('Error parsing cart data:', error)
    }
  } else {
    // If no cart data in route, try localStorage as fallback
    loadCartDataFromStorage()
  }
}

// Function to load cart data from localStorage as fallback - IMPROVED
const loadCartDataFromStorage = () => {
  try {
    // Try checkout data first
    const checkoutDataStr = localStorage.getItem('checkoutCartData')
    if (checkoutDataStr) {
      const cartData = JSON.parse(checkoutDataStr)

      orderData.value.subtotal = cartData.subtotal || cartData.total || 0
      orderData.value.shipping = cartData.shipping || 0
      orderData.value.tax = cartData.tax || 0
      orderData.value.discount = cartData.discount || 0

      console.log('Cart data loaded from checkout storage:', orderData.value)
      return
    }

    // Fallback to regular cart data
    const cartStr = localStorage.getItem('cart')
    if (cartStr) {
      const cartItems = JSON.parse(cartStr)
      const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

      orderData.value.subtotal = subtotal
      orderData.value.shipping = 0 // You might want to calculate this
      orderData.value.tax = subtotal * 0.14 // Example: 14% tax
      orderData.value.discount = 0

      console.log('Cart data calculated from cart storage:', orderData.value)
    }
  } catch (error) {
    console.error('Error loading cart data from storage:', error)
  }
}

// Computed total
const orderTotal = computed(() => {
  return orderData.value.subtotal +
         orderData.value.shipping +
         orderData.value.tax -
         orderData.value.discount
})

// Loading states
const loading = ref({
  addresses: false,
  paymentMethods: false,
  savingAddress: false,
  savingPayment: false,
  creatingOrder: false,
})

// Computed properties
const hasSavedAddresses = computed(() => {
  return userData.value.addresses.length > 0
})

const hasSavedPaymentMethods = computed(() => {
  return userData.value.paymentMethods.length > 0
})

const defaultAddress = computed(() => {
  return userData.value.addresses.find(addr => addr.isDefault)
})

const defaultPaymentMethod = computed(() => {
  return userData.value.paymentMethods.find(pm => pm.isDefault)
})

const contactEmail = computed(() => {
  if (checkoutState.value.useDifferentContact && newContactForm.value.email) {
    return newContactForm.value.email
  }
  return currentUser.value?.email || ''
})

const contactPhone = computed(() => {
  if (checkoutState.value.useDifferentContact && newContactForm.value.phone) {
    return newContactForm.value.phone
  }
  return currentUser.value?.phone || ''
})

// Get current user from storage
const getCurrentUser = () => {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (storedUser) {
    try {
      return JSON.parse(storedUser)
    } catch (e) {
      console.error('Error parsing stored user data:', e)
    }
  }
  return null
}

// Get current user ID from storage
const getCurrentUserId = () => {
  const user = getCurrentUser()
  return user?.id || user?._id || null
}

// Helper function to get cart items for order
const getCartItemsForOrder = () => {
  let cartItems = []

  // Try to get from route first
  if (route.query.cartData) {
    try {
      const cartData = JSON.parse(route.query.cartData)
      cartItems = cartData.items || []
      console.log('Cart items from route:', cartItems)
    } catch (error) {
      console.error('Error parsing cart data from route:', error)
    }
  }

  // Fallback to localStorage checkout data
  if (cartItems.length === 0) {
    try {
      const cartDataStr = localStorage.getItem('checkoutCartData')
      if (cartDataStr) {
        const cartData = JSON.parse(cartDataStr)
        cartItems = cartData.items || []
        console.log('Cart items from localStorage checkout:', cartItems)
      }
    } catch (error) {
      console.error('Error getting cart items from checkout storage:', error)
    }
  }

  // Fallback to regular cart storage (useCart structure)
  if (cartItems.length === 0) {
    try {
      const cartStr = localStorage.getItem('cart')
      if (cartStr) {
        cartItems = JSON.parse(cartStr)
        console.log('Cart items from useCart storage:', cartItems)
      }
    } catch (error) {
      console.error('Error getting cart items from cart storage:', error)
    }
  }

  console.log('Final cart items for order:', cartItems)

  // Transform items to match order schema - UPDATED FOR useCart STRUCTURE
  const transformedItems = cartItems.map(item => {
    // Extract product ID from useCart structure
    const productId = item.productId || item._id || item.id || item.product?._id || item.product?.id

    if (!productId) {
      console.error('Missing product ID for item:', item)
      return null
    }

    return {
      product: productId,
      quantity: item.quantity || 1,
      price_at_purchase: item.price || item.product?.price || 0
    }
  }).filter(item => item !== null) // Remove any items that failed transformation

  console.log('Transformed order items:', transformedItems)

  return transformedItems
}

// Helper function to clear cart after successful order
const clearCartAfterOrder = () => {
  try {
    // Clear localStorage cart data
    localStorage.removeItem('checkoutCartData')
    localStorage.removeItem('cart') // if you store cart in localStorage

    console.log('Cart cleared after order')
  } catch (error) {
    console.error('Error clearing cart:', error)
  }
}

// Validation function for order data
const validateOrderData = () => {
  const errors = []

  if (!getCurrentUserId()) {
    errors.push('User not authenticated')
  }

  if (!checkoutState.value.selectedAddress) {
    errors.push('Shipping address not selected')
  }

  if (!checkoutState.value.selectedPaymentMethod) {
    errors.push('Payment method not selected')
  }

  const cartItems = getCartItemsForOrder()
  if (cartItems.length === 0) {
    errors.push('Cart is empty')
  }

  return errors
}

// API functions
const fetchAddresses = async () => {
  const userId = getCurrentUserId()
  if (!userId) return

  loading.value.addresses = true
  try {
    const response = await fetch(`${ADDRESSES_API}?userId=${userId}`)
    if (!response.ok) throw new Error('Failed to fetch addresses')

    const data = await response.json()
    if (data.success) {
      userData.value.addresses = data.addresses || []
    }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    if (!error.message.includes('404')) {
      alert('Failed to load saved addresses')
    }
  } finally {
    loading.value.addresses = false
  }
}

const fetchPaymentMethods = async () => {
  const userId = getCurrentUserId()
  if (!userId) return

  loading.value.paymentMethods = true
  try {
    const response = await fetch(`${PAYMENT_METHODS_API}?userId=${userId}`)
    if (!response.ok) throw new Error('Failed to fetch payment methods')

    const data = await response.json()
    userData.value.paymentMethods = data || []
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    if (!error.message.includes('404')) {
      alert('Failed to load saved payment methods')
    }
  } finally {
    loading.value.paymentMethods = false
  }
}

const saveNewAddress = async () => {
  const userId = getCurrentUserId()
  if (!userId) {
    alert('Please log in to save address')
    return
  }

  // Validate required fields
  if (!newAddressForm.value.address_line_1.trim() || !newAddressForm.value.city.trim() || !newAddressForm.value.postal_code.trim()) {
    alert('Please fill in all required fields (Address Line 1, City, and Postal Code)')
    return
  }

  loading.value.savingAddress = true
  try {
    const response = await fetch(ADDRESSES_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...newAddressForm.value
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to save address')
    }

    const data = await response.json()

    if (data.success) {
      // Add new address to local state and select it
      userData.value.addresses.push(data.address)
      checkoutState.value.selectedAddress = data.address._id
      checkoutState.value.useNewAddress = false
      resetNewAddressForm()
      alert('Address saved successfully!')

      // Refresh addresses list
      fetchAddresses()
    } else {
      throw new Error(data.message || 'Failed to save address')
    }
  } catch (error) {
    console.error('Error saving address:', error)
    alert(`Error saving address: ${error.message}`)
  } finally {
    loading.value.savingAddress = false
  }
}

const saveNewPayment = async () => {
  const userId = getCurrentUserId()
  if (!userId) {
    alert('Please log in to save payment method')
    return
  }

  // Validate required fields
  if (newPaymentForm.value.type === 'mpesa' && !newPaymentForm.value.phone_number.trim()) {
    alert('Please enter your M-Pesa phone number')
    return
  }

  loading.value.savingPayment = true
  try {
    const response = await fetch(PAYMENT_METHODS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: userId,
        ...newPaymentForm.value
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to save payment method')
    }

    const data = await response.json()

    // Add new payment method to local state and select it
    userData.value.paymentMethods.push(data)
    checkoutState.value.selectedPaymentMethod = data._id
    checkoutState.value.useNewPayment = false
    resetNewPaymentForm()
    alert('Payment method saved successfully!')

    // Refresh payment methods list
    fetchPaymentMethods()
  } catch (error) {
    console.error('Error saving payment method:', error)
    alert(`Error saving payment method: ${error.message}`)
  } finally {
    loading.value.savingPayment = false
  }
}

// Initialize
onMounted(() => {
  const user = getCurrentUser()
  if (user) {
    currentUser.value = user
    userData.value.userId = getCurrentUserId()
    fetchAddresses()
    fetchPaymentMethods()

    // Load cart data from route
    loadCartData()

    // Pre-fill contact form with user data
    newContactForm.value.email = user.email || ''
    newContactForm.value.phone = user.phone || ''
  }
})

// Navigation functions
const nextStep = () => {
  if (checkoutState.value.currentStep < 3) {
    checkoutState.value.currentStep++
  }
}

const prevStep = () => {
  if (checkoutState.value.currentStep > 1) {
    checkoutState.value.currentStep--
  }
}

// Address selection
const selectAddress = (addressId) => {
  checkoutState.value.selectedAddress = addressId
  checkoutState.value.useNewAddress = false
}

const useNewAddress = () => {
  checkoutState.value.useNewAddress = true
  checkoutState.value.selectedAddress = null
}

// Payment method selection
const selectPaymentMethod = (paymentId) => {
  checkoutState.value.selectedPaymentMethod = paymentId
  checkoutState.value.useNewPayment = false
}

const useNewPayment = () => {
  checkoutState.value.useNewPayment = true
  checkoutState.value.selectedPaymentMethod = null
}

// Contact information
const useDifferentContact = () => {
  checkoutState.value.useDifferentContact = true
}

const useAccountContact = () => {
  checkoutState.value.useDifferentContact = false
  resetNewContactForm()
}

// Form reset functions
const resetNewAddressForm = () => {
  newAddressForm.value = {
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_region: '',
    postal_code: '',
    country: 'Kenya',
    type: 'Home',
  }
}

const resetNewContactForm = () => {
  newContactForm.value = {
    email: currentUser.value?.email || '',
    phone: currentUser.value?.phone || '',
  }
}

const resetNewPaymentForm = () => {
  newPaymentForm.value = {
    type: 'mpesa',
    phone_number: '',
    isDefault: false,
  }
}

// Validation
const canProceedToShipping = computed(() => {
  return true
})


const canProceedToPayment = computed(() => {
  if (checkoutState.value.selectedAddress !== null) {
    return true
  }

  if (checkoutState.value.useNewAddress) {
    return (
      newAddressForm.value.address_line_1.trim() &&
      newAddressForm.value.city.trim() &&
      newAddressForm.value.postal_code.trim()
    )
  }

  return false
})

const canPlaceOrder = computed(() => {
  return (
    checkoutState.value.selectedAddress !== null &&
    checkoutState.value.selectedPaymentMethod !== null
  )
})

// Get selected address object
const getSelectedAddress = computed(() => {
  return userData.value.addresses.find(addr => addr._id === checkoutState.value.selectedAddress)
})

// Get selected payment method object
const getSelectedPaymentMethod = computed(() => {
  return userData.value.paymentMethods.find(pm => pm._id === checkoutState.value.selectedPaymentMethod)
})

// Handle form submission - UPDATED WITH ORDER CREATION
const handleSubmit = async (event) => {
  event.preventDefault()

  if (!canPlaceOrder.value) {
    alert('Please complete all required information')
    return
  }

  // Validate order data
  const validationErrors = validateOrderData()
  if (validationErrors.length > 0) {
    alert(`Please fix the following issues:\n- ${validationErrors.join('\n- ')}`)
    return
  }

  console.log('Checkout submitted:', {
    contact: {
      email: contactEmail.value,
      phone: contactPhone.value
    },
    address: getSelectedAddress.value,
    paymentMethod: getSelectedPaymentMethod.value,
    orderData: orderData.value,
  })

  // Handle payment processing and order creation
  try {
    loading.value.creatingOrder = true

    // 1. Prepare order data
    const orderDataToSubmit = {
      user: getCurrentUserId(),
      items: getCartItemsForOrder(),
      total_amount: orderTotal.value,
      shipping_address: checkoutState.value.selectedAddress,
      payment_details: checkoutState.value.selectedPaymentMethod,
      status: "Pending"
    }

    console.log('Submitting order:', orderDataToSubmit)

    // 2. Create order in database
    const response = await fetch(ORDERS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDataToSubmit)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create order')
    }

    const createdOrder = await response.json()
    console.log('Order created successfully:', createdOrder)

    // 3. Clear cart after successful order
    clearCartAfterOrder()

    // 4. Redirect to order confirmation page
    alert('Order placed successfully!')
    router.push(`/order-confirmation?orderId=${createdOrder._id}`)

  } catch (error) {
    console.error('Payment/Order creation failed:', error)
    alert(`Order failed: ${error.message}`)
  } finally {
    loading.value.creatingOrder = false
  }
}

// Return to cart
const returnToCart = () => {
  router.push('/cart')
}
</script>

<template>
  <div class="min-h-screen flex justify-center items-center flex-col bg-white">
    <Navbar />

    <main class="main flex-grow py-8 w-[90%]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <div class="breadcrumb text-sm breadcrumbs mt-[10px] text-gray-500">
          <ul class="flex items-center space-x-2">
            <li><a href="/" class="hover:underline text-deep-purple">Home</a></li>
            <li class="mr-[10px]">/</li>
            <li><a href="/cart" class="hover:underline text-deep-purple">Cart</a></li>
            <li class="mr-[10px]">/</li>
            <li class="text-royal-purple font-medium">Checkout</li>
          </ul>
        </div>

        <!-- Banner -->
        <div class="banner flex justify-between items-center my-[20px] mb-8 px-[20px] py-[15px]">
          <h1 class="banner-tt text-3xl font-bold">Checkout</h1>
          <button
            @click="returnToCart"
            class="bg-[#5d3471] hover:bg-[#AA69AF] text-[#ffff] text-sm font-medium hover:text-royal-purple transition-colors"
          >
            Return to cart
          </button>
        </div>

        <!-- Progress Steps -->
        <div class="progress-steps flex justify-center items-center space-x-4 mb-8">
          <div class="flex flex-col items-center">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full"
              :class="
                checkoutState.currentStep >= 1
                  ? 'bg-deep-purple text-white shadow-lg p-[8px]'
                  : 'border-2 border-gray-300 text-gray-400 p-[8px]'
              "
            >
              1
            </div>
            <span
              class="text-xs mt-2 font-semibold"
              :class="checkoutState.currentStep >= 1 ? 'text-deep-purple' : 'text-gray-500'"
            >
              Information
            </span>
          </div>

          <div
            class="flex-1 h-1"
            :class="
              checkoutState.currentStep >= 2
                ? 'bg-gradient-to-r from-deep-purple to-royal-purple'
                : 'bg-gray-200'
            "
          ></div>

          <div class="flex flex-col items-center">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full"
              :class="
                checkoutState.currentStep >= 2
                  ? 'bg-deep-purple text-white shadow-lg p-[8px]'
                  : 'border-2 border-gray-300 text-gray-400 p-[8px]'
              "
            >
              2
            </div>
            <span
              class="text-xs mt-2 font-semibold"
              :class="checkoutState.currentStep >= 2 ? 'text-deep-purple' : 'text-gray-500'"
            >
              Shipping
            </span>
          </div>

          <div
            class="flex-1 h-1"
            :class="
              checkoutState.currentStep >= 3
                ? 'bg-gradient-to-r from-deep-purple to-royal-purple'
                : 'bg-gray-200'
            "
          ></div>

          <div class="flex flex-col items-center">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full"
              :class="
                checkoutState.currentStep >= 3
                  ? 'bg-deep-purple text-white shadow-lg p-[8px]'
                  : 'border-2 border-gray-300 text-gray-400 p-[8px]'
              "
            >
              3
            </div>
            <span
              class="text-xs mt-2 font-semibold"
              :class="checkoutState.currentStep >= 3 ? 'text-deep-purple' : 'text-gray-500'"
            >
              Payment
            </span>
          </div>
        </div>

        <form @submit="handleSubmit" class="checkout-main w-full flex lg:flex-row gap-8">
          <!-- Left Column - Checkout Steps -->
          <div class="w-2/3 lg:w-2/3 space-y-8">
            <!-- Step 1: Contact Information -->
            <div
              v-if="checkoutState.currentStep === 1"
              class="contact-info bg-white rounded-2xl p-[10px] shadow-sm"
            >
              <h2 class="text-2xl font-[500] text-deep-purple mb-6">Contact Information</h2>

              <div class="contact_info-form p-[10px]">
                <!-- Account Contact Information -->
                <div v-if="!checkoutState.useDifferentContact" class="mb-6">
                  <h3 class="text-lg font-[500] text-gray-800 mb-4">Your Account Information</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div class="account-contact-display p-3 bg-[#E8B6D5] rounded-lg text-gray-700">
                        {{ currentUser?.email || 'No email provided' }}
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div class="account-contact-display p-3 bg-[#E8B6D5] rounded-lg text-gray-700">
                        {{ currentUser?.phone || 'No phone number provided' }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 text-center">
                    <button
                      type="button"
                      @click="useDifferentContact"
                      class="text-royal-purple hover:text-deep-purple font-medium"
                    >
                      + Use different contact information
                    </button>
                  </div>
                </div>

                <!-- Different Contact Information Form -->
                <div v-else class="mb-6">
                  <h3 class="text-lg font-[500] text-gray-800 mb-4">Different Contact Information</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        v-model="newContactForm.email"
                        type="email"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        v-model="newContactForm.phone"
                        type="tel"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                        placeholder="+254 712 345 678"
                        required
                      />
                    </div>
                  </div>

                  <div class="mt-4 text-center">
                    <button
                      type="button"
                      @click="useAccountContact"
                      class="text-royal-purple hover:text-deep-purple font-medium"
                    >
                      ← Use my account information
                    </button>
                  </div>
                </div>

                <div class="flex justify-end mt-6">
                  <button
                    type="button"
                    @click="nextStep"
                    class="form-btn bg-deep-purple text-white px-6 py-3 rounded-lg hover:bg-royal-purple transition-colors"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 2: Shipping Address -->
            <div
              v-if="checkoutState.currentStep === 2"
              class="bg-white rounded-2xl p-[10px] shadow-sm"
            >
              <h2 class="text-2xl font-[500] text-deep-purple mb-[5px]">Shipping Address</h2>

              <!-- Loading State -->
              <div v-if="loading.addresses" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-purple mx-auto"></div>
                <p class="text-gray-600 mt-2">Loading addresses...</p>
              </div>

              <!-- Saved Addresses -->
              <div
                v-else-if="hasSavedAddresses && !checkoutState.useNewAddress"
                class="saved-address mb-[10px] p-[10px]"
              >
                <h3 class="text-lg font-[500] text-gray-800 mb-4">Select Shipping Address</h3>

                <!-- No selection message -->
                <div
                  v-if="!checkoutState.selectedAddress"
                  class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <p class="text-yellow-700 text-sm flex items-center">
                    Please select a shipping address to continue
                  </p>
                </div>

                <!-- Display all addresses in a grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
                  <div
                    v-for="address in userData.addresses"
                    :key="address._id"
                    @click="selectAddress(address._id)"
                    class="p-[10px] cursor-pointer transition-all border-[1.2px] rounded-[20px]"
                    :class="
                      checkoutState.selectedAddress === address._id
                        ? 'border-deep-purple bg-purple-50'
                        : 'border-gray-200 hover:border-royal-purple'
                    "
                  >
                    <div class="flex justify-between items-start mb-2">
                      <span class="font-semibold text-gray-800 capitalize">{{ address.type }}</span>
                      <span
                        v-if="address.isDefault"
                        class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        Default
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ address.address_line_1 }}</p>
                    <p v-if="address.address_line_2" class="text-sm text-gray-600">{{ address.address_line_2 }}</p>
                    <p class="text-sm text-gray-600">{{ address.city }}, {{ address.postal_code }}</p>
                    <p v-if="address.state_region" class="text-sm text-gray-600">{{ address.state_region }}</p>
                    <p class="text-sm text-gray-600">{{ address.country }}</p>
                  </div>
                </div>

                <div class="mt-4 text-center">
                  <button
                    type="button"
                    @click="useNewAddress"
                    class="text-royal-purple hover:text-deep-purple font-medium"
                  >
                    + Add another address
                  </button>
                </div>
              </div>

              <!-- New Address Form (shown when no addresses or when adding new) -->
              <div
                v-if="!hasSavedAddresses || checkoutState.useNewAddress"
                class="new-address mb-6 p-[10px]"
              >
                <h3 class="text-lg font-[500] text-gray-800 mb-[6px]">
                  {{ hasSavedAddresses ? 'Add New Address' : 'Enter Shipping Address' }}
                </h3>

                <div class="form grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                    <select
                      v-model="newAddressForm.type"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      v-model="newAddressForm.country"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                    </select>
                  </div>

                  <div class="form-group md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Address Line 1 *</label
                    >
                    <input
                      v-model="newAddressForm.address_line_1"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="Street address, P.O. box, company name"
                      required
                    />
                  </div>

                  <div class="form-group md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Address Line 2 (Optional)</label
                    >
                    <input
                      v-model="newAddressForm.address_line_2"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      v-model="newAddressForm.city"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">State/Region</label>
                    <input
                      v-model="newAddressForm.state_region"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="Enter state or region"
                    />
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                    <input
                      v-model="newAddressForm.postal_code"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="Enter postal code"
                      required
                    />
                  </div>
                </div>

                <div class="flex justify-between mt-6">
                  <button
                    type="button"
                    @click="checkoutState.useNewAddress = false"
                    v-if="hasSavedAddresses"
                    class="form-btn text-gray-600 bg-[#804d91] hover:text-gray-800 font-medium"
                  >
                    ← Back to saved addresses
                  </button>
                  <button
                    type="button"
                    @click="saveNewAddress"
                    :disabled="loading.savingAddress"
                    class="form-btn bg-deep-purple text-white px-6 py-3 rounded-lg transition-colors ml-auto hover:bg-royal-purple disabled:opacity-50"
                  >
                    {{ loading.savingAddress ? 'Saving...' : 'Save Address & Continue' }}
                  </button>
                </div>
              </div>

              <div class="flex justify-between mt-[6px]">
                <button
                  type="button"
                  @click="prevStep"
                  class="btn text-[#ffff] hover:text-gray-800 font-medium px-[8px] py-[6px] rounded-[10px] bg-[#ce7f57]"
                >
                  ← Back to Information
                </button>
                <button
                  type="button"
                  @click="nextStep"
                  :disabled="!canProceedToPayment"
                  class="btn text-[#ffff] px-[8px] py-[6px] rounded-lg bg-[#5d3471] hover:bg-royal-purple transition-colors rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            </div>

            <!-- Step 3: Payment Method -->
            <div v-if="checkoutState.currentStep === 3" class="bg-white rounded-2xl shadow-sm">
              <h2 class="text-2xl font-[500] text-deep-purple mb-[10px]">Payment Method</h2>

              <!-- Loading State -->
              <div v-if="loading.paymentMethods" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-purple mx-auto"></div>
                <p class="text-gray-600 mt-2">Loading payment methods...</p>
              </div>

              <!-- Saved Payment Methods -->
              <div
                v-else-if="hasSavedPaymentMethods && !checkoutState.useNewPayment"
                class="mb-6 p-[10px] saved-pm"
              >
                <h3 class="text-lg font-[500] text-gray-800 mb-[10px]">Select Payment Method</h3>
                <div class="space-y-4">
                  <div
                    v-for="payment in userData.paymentMethods"
                    :key="payment._id"
                    @click="selectPaymentMethod(payment._id)"
                    class="p-[4px] cursor-pointer transition-all"
                    :class="
                      checkoutState.selectedPaymentMethod === payment._id
                        ? 'border-deep-purple bg-purple-50'
                        : 'border-gray-200 hover:border-royal-purple'
                    "
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <font-awesome-icon
                          :icon="
                            payment.type === 'mpesa'
                              ? ['fas', 'mobile-screen']
                              : ['fas', 'credit-card']
                          "
                          class="w-6 h-6 text-royal-purple"
                        />
                        <div>
                          <p class="font-semibold text-gray-800">
                            {{ payment.type === 'mpesa' ? 'M-Pesa' : 'Credit Card' }}
                          </p>
                          <p class="text-sm text-gray-600">
                            {{
                              payment.type === 'mpesa'
                                ? payment.phone_number
                                : `•••• ${payment.last_four}`
                            }}
                          </p>
                        </div>
                      </div>
                      <span
                        v-if="payment.isDefault"
                        class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        Default
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-[5px] text-center">
                  <button
                    type="button"
                    @click="useNewPayment"
                    class="text-royal-purple hover:text-deep-purple font-medium"
                  >
                    + Use a different payment method
                  </button>
                </div>
              </div>

              <!-- New Payment Method Form -->
              <div
                v-if="!hasSavedPaymentMethods || checkoutState.useNewPayment"
                class="mb-[5px] p-[10px] new-pm"
              >
                <h3 class="text-lg font-[500] text-gray-800 mb-4">
                  {{ hasSavedPaymentMethods ? 'Add New Payment Method' : 'Enter Payment Details' }}
                </h3>

                <div class="space-y-4">
                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-[2px]"
                      >Payment Method</label
                    >
                    <select
                      v-model="newPaymentForm.type"
                      class="payment-dropdown w-full p-[6px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                    >
                      <option value="mpesa">M-Pesa</option>
                      <option value="card">Credit/Debit Card</option>
                    </select>
                  </div>

                  <div v-if="newPaymentForm.type === 'mpesa'" class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >M-Pesa Phone Number *</label
                    >
                    <input
                      v-model="newPaymentForm.phone_number"
                      type="tel"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="+254 712 345 678"
                      required
                    />
                    <p class="text-sm text-gray-500 mt-2">
                      Enter your M-Pesa registered phone number. We'll send a confirmation code.
                    </p>
                  </div>

                  <div class="form-group flex items-center gap-3">
                    <input
                      v-model="newPaymentForm.isDefault"
                      type="checkbox"
                      id="setDefaultPayment"
                      class="w-4 h-4 text-deep-purple border-gray-300 rounded focus:ring-deep-purple"
                    />
                    <label for="setDefaultPayment" class="text-sm font-medium text-gray-700">
                      Set as default payment method
                    </label>
                  </div>
                </div>

                <div class="flex justify-between mt-6">
                  <button
                    type="button"
                    @click="checkoutState.useNewPayment = false"
                    v-if="hasSavedPaymentMethods"
                    class="text-gray-600 hover:text-gray-800 font-medium py-[8px] px-[10px] rounded-[1px]"
                  >
                    ← Back to saved payment methods
                  </button>
                  <button
                    type="button"
                    @click="saveNewPayment"
                    :disabled="loading.savingPayment"
                    class="btn bg-deep-purple text-[#ffff] px-6 py-3 rounded-[10px] hover:bg-royal-purple transition-colors ml-auto py-[8px] px-[10px] disabled:opacity-50"
                  >
                    {{ loading.savingPayment ? 'Saving...' : 'Save Payment Method' }}
                  </button>
                </div>
              </div>

              <div class="flex justify-between mt-[6px]">
                <button
                  type="button"
                  @click="prevStep"
                  class="btn text-gray-600 hover:text-gray-800 font-medium py-[8px] px-[10px] rounded-[10px] bg-[#ce7f57]"
                >
                  ← Back to Shipping
                </button>
                <!-- UPDATED PAYMENT BUTTON WITH LOADING STATE -->
                <button
                  type="submit"
                  :disabled="!canPlaceOrder || loading.creatingOrder"
                  class="btn flex items-center px-8 py-4 rounded-[10px] shadow-lg text-lg font-semibold text-[#ffff] bg-deep-purple hover:from-royal-purple hover:to-medium-orchid focus:outline-none focus:ring-4 focus:ring-soft-pink/50 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loading.creatingOrder" class="mr-3">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-else class="mr-3">🔒</span>
                  {{ loading.creatingOrder ? 'Processing...' : `Pay Ksh.${orderTotal.toFixed(2)}` }}
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column - Order Summary -->
          <div class="w-1/3 lg:w-1/3">
            <OrderSummary
              :subtotal="orderData.subtotal"
              :shipping="orderData.shipping"
              :tax="orderData.tax"
              :discount="orderData.discount"
              :show-checkout-button="false"
              :show-continue-shopping="false"
              delivery-text="Express shipping: 1-2 business days"
            />
          </div>
        </form>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Your existing styles remain the same */
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
.progress-steps {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px #0000001a;
}

.checkout-main {
  background: #ffffff;
  margin: 18px 0;
  padding: 8px 6px;
  border-radius: 20px;
  box-shadow: 0 2px 8px #0000001a;
}

.contact_info-form,
.saved-address,
.new-address,
.saved-pm,
.new-pm {
  border: 1px solid #ce7f57;
  border-radius: 20px;
}

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

.banner-ttl {
  letter-spacing: 0.5px;
}

.banner button {
  padding: 10px 8px;
  border: none;
  border-radius: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  padding: 10px;
  border: none;
  background: #e8b6d5;
  border-radius: 10px;
}

.account-contact-display {
  padding: 12px;
  border: 1px solid #e7eaef;
  border-radius: 10px;
  background: #e8b6d5;
  margin-bottom: 10px;
}

.form-btn {
  padding: 8px 10px;
  border: 1px solid #ce7f57;
  border-radius: 20px;
  color: #ffffff;
  transition: all 0.3s ease-in-out;
}

.form-btn:hover {
  background: #aa69af;
}

.btn {
  border: 1px solid #ce7f57;
}

.payment-dropdown {
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.payment-dropdown:focus {
  border-color: #aa69af;
  box-shadow: 0 0 0 3px rgba(170, 105, 175, 0.2);
}

.text-deep-purple {
  color: #5d3471;
}

.text-medium-orchid {
  color: #aa69af;
}

.text-royal-purple {
  color: #804d91;
}

.bg-deep-purple {
  background-color: #5d3471;
}

.bg-royal-purple {
  background-color: #804d91;
}

.from-deep-purple {
  --tw-gradient-from: #5d3471;
}

.to-royal-purple {
  --tw-gradient-to: #804d91;
}

.to-medium-orchid {
  --tw-gradient-to: #aa69af;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #5d3471;
  box-shadow: 0 0 0 3px rgba(93, 52, 113, 0.1);
}
</style>
