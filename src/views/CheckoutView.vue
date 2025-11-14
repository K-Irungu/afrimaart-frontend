<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import OrderSummary from '@/components/OrderSummary.vue'
import Addresses from '@/components/Account/Addresses.vue'
import PaymentMethods from '@/components/Account/PaymentMethods.vue'

const router = useRouter()

// User data (in a real app, this would come from Vuex/Pinia or API)
const userData = ref({
  isAuthenticated: true, // Would come from auth check
  hasPreviousOrders: false, // Would come from order history
  addresses: {},
  paymentMethods: [],
})

// Checkout state
const checkoutState = ref({
  currentStep: 1, // 1: Information, 2: Shipping, 3: Payment
  selectedAddress: null,
  selectedPaymentMethod: null,
  useNewAddress: false,
  useNewPayment: false,
})

// Form data for new address/payment
const newAddressForm = ref({
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: 'Kenya',
  type: 'Home',
})

const newPaymentForm = ref({
  type: 'mpesa',
  phoneNumber: '',
  isDefault: false,
})

// Mock order data
const orderData = ref({
  subtotal: 586.0,
  shipping: 12.0,
  tax: 46.88,
  discount: 25.0,
})

// Check if user has saved addresses/payment methods
const hasSavedAddresses = computed(() => {
  return Object.keys(userData.value.addresses).length > 0
})

const hasSavedPaymentMethods = computed(() => {
  return userData.value.paymentMethods.length > 0
})

// Load user data (simulated)
onMounted(() => {
  // Simulate loading user data
  setTimeout(() => {
    // If user has previous orders, load their saved data
    if (userData.value.hasPreviousOrders) {
      userData.value.addresses = {
        home: {
          street: '123 Main Street',
          cityStateZip: 'Nairobi, Nairobi County 00100',
          country: 'Kenya',
          isDefault: true,
        },
        work: {
          street: '456 Business Avenue',
          cityStateZip: 'Westlands, Nairobi County 00100',
          country: 'Kenya',
          isDefault: false,
        },
      }

      userData.value.paymentMethods = [
        {
          id: 1,
          type: 'mpesa',
          phoneNumber: '+254 712 345 678',
          isDefault: true,
        },
      ]

      // Auto-select default options
      checkoutState.value.selectedAddress = 'home'
      checkoutState.value.selectedPaymentMethod = 1
    }
  }, 1000)
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
const selectAddress = (addressType) => {
  checkoutState.value.selectedAddress = addressType
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

// Save new address
const saveNewAddress = () => {
  const addressType = newAddressForm.value.type.toLowerCase()

  userData.value.addresses[addressType] = {
    street: `${newAddressForm.value.addressLine1} ${newAddressForm.value.addressLine2}`.trim(),
    cityStateZip: `${newAddressForm.value.city}, ${newAddressForm.value.stateRegion} ${newAddressForm.value.postalCode}`,
    country: newAddressForm.value.country,
    isDefault: !hasSavedAddresses.value, // Set as default if first address
  }

  checkoutState.value.selectedAddress = addressType
  checkoutState.value.useNewAddress = false
  resetNewAddressForm()
}

// Save new payment method
const saveNewPayment = () => {
  const newPayment = {
    id: Date.now(),
    type: newPaymentForm.value.type,
    phoneNumber: newPaymentForm.value.phoneNumber,
    isDefault: !hasSavedPaymentMethods.value, // Set as default if first payment method
  }

  userData.value.paymentMethods.push(newPayment)
  checkoutState.value.selectedPaymentMethod = newPayment.id
  checkoutState.value.useNewPayment = false
  resetNewPaymentForm()
}

// Form reset functions
const resetNewAddressForm = () => {
  newAddressForm.value = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
    type: 'Home',
  }
}

const resetNewPaymentForm = () => {
  newPaymentForm.value = {
    type: 'mpesa',
    phoneNumber: '',
    isDefault: false,
  }
}

// Validation
const canProceedToShipping = computed(() => {
  return checkoutState.value.selectedAddress !== null || checkoutState.value.useNewAddress
})

const canProceedToPayment = computed(() => {
  return checkoutState.value.selectedPaymentMethod !== null || checkoutState.value.useNewPayment
})

const canPlaceOrder = computed(() => {
  return (
    checkoutState.value.selectedAddress !== null &&
    checkoutState.value.selectedPaymentMethod !== null
  )
})

// Handle form submission
const handleSubmit = (event) => {
  event.preventDefault()

  if (!canPlaceOrder.value) {
    alert('Please complete all required information')
    return
  }

  console.log('Checkout submitted:', {
    address: checkoutState.value.selectedAddress,
    paymentMethod: checkoutState.value.selectedPaymentMethod,
    orderData: orderData.value,
  })

  // Handle payment processing here
  alert('Order placed successfully!')
  router.push('/order-confirmation')
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

              <div class="contact_info-form grid grid-cols-1 md:grid-cols-2 gap-4 p-[10px]">
                <div class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                    placeholder="+254 712 345 678"
                    required
                  />
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

              <!-- Saved Addresses -->
              <div
                v-if="hasSavedAddresses && !checkoutState.useNewAddress"
                class="saved-address mb-[6px] p-[10px]"
              >
                <h3 class="text-lg font-[500] text-gray-800 mb-4">Select Saved Address</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="(address, type) in userData.addresses"
                    :key="type"
                    @click="selectAddress(type)"
                    class="p-4 cursor-pointer transition-all"
                    :class="
                      checkoutState.selectedAddress === type
                        ? 'border-deep-purple bg-purple-50'
                        : 'border-gray-200 hover:border-royal-purple'
                    "
                  >
                    <div class="flex justify-between items-start mb-2">
                      <span class="font-semibold text-gray-800 capitalize">{{ type }}</span>
                      <span
                        v-if="address.isDefault"
                        class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        Default
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ address.street }}</p>
                    <p class="text-sm text-gray-600">{{ address.cityStateZip }}</p>
                    <p class="text-sm text-gray-600">{{ address.country }}</p>
                  </div>
                </div>

                <div class="mt-4 text-center">
                  <button
                    type="button"
                    @click="useNewAddress"
                    class="text-royal-purple hover:text-deep-purple font-medium"
                  >
                    + Use a different address
                  </button>
                </div>
              </div>

              <!-- New Address Form -->
              <div
                v-if="!hasSavedAddresses || checkoutState.useNewAddress"
                class="new-address mb-6 p-[10px]"
              >
                <h3 class="text-lg font-[500] text-gray-800 mb-[6px]">
                  {{ hasSavedAddresses ? 'Add New Address' : 'Enter Shipping Address' }}
                </h3>

                <div class="form grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div class="form-group md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Address Line 1</label
                    >
                    <input
                      v-model="newAddressForm.addressLine1"
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
                      v-model="newAddressForm.addressLine2"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      v-model="newAddressForm.city"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      v-model="newAddressForm.postalCode"
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
                    class="form-btn bg-deep-purple text-white px-6 py-3 rounded-lg transition-colors ml-auto hover:bg-royal-purple"
                  >
                    Save Address & Continue
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
                  :disabled="!canProceedToShipping"
                  class="btn text-[#ffff] px-[8px] py-[6px] rounded-lg bg-[#5d3471] hover:bg-royal-purple transition-colors rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            </div>

            <!-- Step 3: Payment Method -->
            <div v-if="checkoutState.currentStep === 3" class="bg-white rounded-2xl shadow-sm">
              <h2 class="text-2xl font-[500] text-deep-purple mb-[10px]">Payment Method</h2>

              <!-- Saved Payment Methods -->
              <div
                v-if="hasSavedPaymentMethods && !checkoutState.useNewPayment"
                class="mb-6 p-[10px] saved-pm"
              >
                <h3 class="text-lg font-[500] text-gray-800 mb-4">Select Payment Method</h3>
                <div class="space-y-4">
                  <div
                    v-for="payment in userData.paymentMethods"
                    :key="payment.id"
                    @click="selectPaymentMethod(payment.id)"
                    class="p-[4px] border-b-[1px] cursor-pointer transition-all"
                    :class="
                      checkoutState.selectedPaymentMethod === payment.id
                        ? 'border-deep-purple bg-purple-50'
                        : 'border-gray-200 hover:border-royal-purple'
                    "
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
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
                                ? payment.phoneNumber
                                : `•••• ${payment.lastFour}`
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
                      >M-Pesa Phone Number</label
                    >
                    <input
                      v-model="newPaymentForm.phoneNumber"
                      type="tel"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-purple focus:border-deep-purple"
                      placeholder="+254 712 345 678"
                      required
                    />
                    <p class="text-sm text-gray-500 mt-2">
                      Enter your M-Pesa registered phone number. We'll send a confirmation code.
                    </p>
                  </div>

                  <!-- Add card form fields here if needed -->

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
                    class="btn bg-deep-purple text-[#ffff] px-6 py-3 rounded-[10px] hover:bg-royal-purple transition-colors ml-auto py-[8px] px-[10px]"
                  >
                    Save Payment Method
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
                <button
                  type="submit"
                  :disabled="!canPlaceOrder"
                  class="btn flex items-center px-8 py-4 rounded-[10px] shadow-lg text-lg font-semibold text-[#ffff] bg-deep-purple hover:from-royal-purple hover:to-medium-orchid focus:outline-none focus:ring-4 focus:ring-soft-pink/50 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="mr-3">🔒 </span> Pay Ksh.{{
                    (
                      orderData.subtotal +
                      orderData.shipping +
                      orderData.tax -
                      orderData.discount
                    ).toFixed(2)
                  }}
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
