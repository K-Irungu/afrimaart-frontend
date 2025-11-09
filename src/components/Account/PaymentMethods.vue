<script setup>
import { ref, onMounted } from 'vue'

// Mock payment methods data
const paymentMethods = ref([])
const loading = ref(true)
const isAddingNewPayment = ref(false)
const selectedPaymentType = ref('mpesa') // Default to M-Pesa

// New payment form
const newPaymentForm = ref({
  type: 'mpesa', // Default to M-Pesa
  // Card fields
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
  // M-Pesa fields
  phoneNumber: '',
  // PayPal fields
  paypalEmail: '',
  isDefault: false,
})

// Payment method options for dropdown
const paymentOptions = [
  { value: 'mpesa', label: 'M-Pesa', icon: ['fas', 'mobile-screen'] },
  { value: 'card', label: 'Credit/Debit Card', icon: ['fas', 'credit-card'] },
  { value: 'paypal', label: 'PayPal', icon: ['fab', 'paypal'] },
]

// Simulate loading payment methods
onMounted(() => {
  setTimeout(() => {
    paymentMethods.value = [
      {
        id: 1,
        type: 'mpesa',
        phoneNumber: '+254 712 345 678',
        isDefault: true,
      },
      {
        id: 2,
        type: 'card',
        cardType: 'visa',
        lastFour: '4242',
        cardHolder: 'Ava Thompson',
        expiryDate: '12/25',
        isDefault: false,
      },
      {
        id: 3,
        type: 'paypal',
        email: 'ava.thompson@example.com',
        isDefault: false,
      },
    ]
    loading.value = false
  }, 1500)
})

const addNewPayment = () => {
  console.log('Adding new payment method:', newPaymentForm.value)

  let newPayment = {}

  switch (newPaymentForm.value.type) {
    case 'card':
      newPayment = {
        id: Date.now(),
        type: 'card',
        cardType: 'visa', // Determine based on card number in real app
        lastFour: newPaymentForm.value.cardNumber.slice(-4),
        cardHolder: newPaymentForm.value.cardHolder,
        expiryDate: newPaymentForm.value.expiryDate,
        isDefault: newPaymentForm.value.isDefault,
      }
      break

    case 'mpesa':
      newPayment = {
        id: Date.now(),
        type: 'mpesa',
        phoneNumber: newPaymentForm.value.phoneNumber,
        isDefault: newPaymentForm.value.isDefault,
      }
      break

    case 'paypal':
      newPayment = {
        id: Date.now(),
        type: 'paypal',
        email: newPaymentForm.value.paypalEmail,
        isDefault: newPaymentForm.value.isDefault,
      }
      break
  }

  paymentMethods.value.push(newPayment)
  isAddingNewPayment.value = false
  resetNewPaymentForm()
}

const cancelAddPayment = () => {
  isAddingNewPayment.value = false
  resetNewPaymentForm()
}

const resetNewPaymentForm = () => {
  newPaymentForm.value = {
    type: 'mpesa', // Reset to M-Pesa
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    paypalEmail: '',
    isDefault: false,
  }
  selectedPaymentType.value = 'mpesa' // Reset to M-Pesa
}

const setAsDefault = (paymentId) => {
  paymentMethods.value.forEach((payment) => {
    payment.isDefault = payment.id === paymentId
  })
  console.log(`Setting payment ${paymentId} as default`)
}

const removePayment = (paymentId) => {
  if (confirm('Are you sure you want to remove this payment method?')) {
    paymentMethods.value = paymentMethods.value.filter((payment) => payment.id !== paymentId)
    console.log(`Removing payment ${paymentId}`)
  }
}

const getPaymentIcon = (paymentType, cardType = null) => {
  switch (paymentType) {
    case 'card':
      switch (cardType) {
        case 'visa':
          return ['fab', 'cc-visa']
        case 'mastercard':
          return ['fab', 'cc-mastercard']
        case 'amex':
          return ['fab', 'cc-amex']
        default:
          return ['fas', 'credit-card']
      }
    case 'paypal':
      return ['fab', 'paypal']
    case 'mpesa':
      return ['fas', 'mobile-screen']
    default:
      return ['fas', 'credit-card-alt']
  }
}

const getPaymentColor = (paymentType, cardType = null) => {
  switch (paymentType) {
    case 'card':
      switch (cardType) {
        case 'visa':
          return 'text-blue-600'
        case 'mastercard':
          return 'text-red-600'
        case 'amex':
          return 'text-blue-500'
        default:
          return 'text-gray-600'
      }
    case 'paypal':
      return 'text-blue-400'
    case 'mpesa':
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
}

const getPaymentDisplayName = (paymentType) => {
  switch (paymentType) {
    case 'card':
      return 'Credit/Debit Card'
    case 'paypal':
      return 'PayPal'
    case 'mpesa':
      return 'M-Pesa'
    default:
      return paymentType
  }
}

const getPaymentDetails = (payment) => {
  switch (payment.type) {
    case 'card':
      return `•••• ${payment.lastFour} • ${payment.cardHolder}`
    case 'paypal':
      return payment.email
    case 'mpesa':
      return payment.phoneNumber
    default:
      return ''
  }
}

// Format card number for display
const formatCardNumber = (number) => {
  return number.replace(/\d{4}(?=.)/g, '$& ')
}

// Format phone number for M-Pesa
const formatPhoneNumber = (number) => {
  const cleaned = number.replace(/\D/g, '')
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`
  } else if (cleaned.startsWith('7')) {
    return `+254${cleaned}`
  }
  return cleaned
}

// Handle payment type change
const handlePaymentTypeChange = (event) => {
  selectedPaymentType.value = event.target.value
  newPaymentForm.value.type = event.target.value
}
</script>

<template>
  <div class="payment-methods">
    <!-- Header -->
    <div class="flex justify-between items-center mb-[20px]">
      <h2 class="text-2xl font-[600] text-gray-900">Payment Methods</h2>
      <button
        @click="isAddingNewPayment = true"
        class="add-payment-btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition text-sm flex items-center gap-2"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="w-4 h-4" />
        Add Payment Method
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white p-6 rounded-lg border border-gray-200 animate-pulse"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-8 bg-gray-200 rounded"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-24"></div>
              <div class="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="h-8 bg-gray-200 rounded w-24"></div>
            <div class="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Saved Payment Methods -->
    <div v-else class="payment-methods-grid space-y-6">
      <div
        v-for="payment in paymentMethods"
        :key="payment.id"
        class="payment-item bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="payment-icon">
              <font-awesome-icon
                :icon="getPaymentIcon(payment.type, payment.cardType)"
                :class="['w-10 h-10', getPaymentColor(payment.type, payment.cardType)]"
              />
            </div>
            <div class="payment-details">
              <div class="flex items-center gap-3 mb-2">
                <p class="font-[500] text-gray-800 text-lg mr-[6px]">
                  {{ getPaymentDisplayName(payment.type) }}
                </p>
                <span
                  v-if="payment.isDefault"
                  class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  Default
                </span>
              </div>
              <p class="text-gray-600 text-base">{{ getPaymentDetails(payment) }}</p>
              <p v-if="payment.type === 'card'" class="text-gray-500 text-sm mt-1">
                Expires {{ payment.expiryDate }}
              </p>
            </div>
          </div>
          <div class="payment-actions flex items-center gap-[7px]">
            <button
              v-if="!payment.isDefault"
              @click="setAsDefault(payment.id)"
              class="set-default-btn text-sm text-indigo-600 px-4 py-2 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'star']" class="w-4 h-4" />
              Set Default
            </button>
            <button
              @click="removePayment(payment.id)"
              class="remove-btn text-sm text-red-600 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'trash']" class="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="paymentMethods.length === 0"
        class="empty-state text-center py-16 border-2 border-dashed border-gray-300 rounded-lg"
      >
        <div class="text-gray-400 mb-6">
          <font-awesome-icon :icon="['fas', 'credit-card']" class="w-16 h-16 mx-auto" />
        </div>
        <h3 class="text-xl font-semibold text-gray-600 mb-3">No payment methods</h3>
        <p class="text-gray-500 text-lg mb-6">Add a payment method to make checkout faster.</p>
        <button
          @click="isAddingNewPayment = true"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition text-sm flex items-center gap-2 mx-auto"
        >
          <font-awesome-icon :icon="['fas', 'plus']" class="w-4 h-4" />
          Add Payment Method
        </button>
      </div>
    </div>

    <!-- Add New Payment Method Form -->
    <div
      v-if="isAddingNewPayment"
      class="add-payment-form bg-white p-[25px] mt-[20px] rounded-lg border border-gray-200 space-y-8"
    >
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-[500] text-gray-900 mb-[8px]">Add Payment Method</h3>
        <button
          @click="cancelAddPayment"
          class="close-btn text-gray-500 hover:text-gray-700 transition p-[6px] rounded-lg hover:bg-gray-100"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" class="w-5 h-5" />
        </button>
      </div>

      <!-- Payment Type Selection Dropdown -->
      <div class="payment-type-selection mb-[10px]">
        <label class="text-sm font-medium text-gray-700 mb-[5px] block"
          >Select Payment Method</label
        >
        <div class="relative">
          <select
            v-model="selectedPaymentType"
            @change="handlePaymentTypeChange"
            class="payment-dropdown w-[70%] p-[6px] border-2 border-gray-200 rounded-lg bg-white text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option
              v-for="option in paymentOptions"
              :key="option.value"
              :value="option.value"
              class="flex items-center gap-2"
            >
              {{ option.label }}
            </option>
          </select>
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <font-awesome-icon :icon="['fas', 'chevron-down']" class="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Card Form -->
      <div v-if="selectedPaymentType === 'card'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Card Number -->
        <div class="form-group space-y-2 md:col-span-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-[5px]">
            <font-awesome-icon :icon="['fas', 'credit-card']" class="w-4 h-4 text-gray-400" />
            Card Number
          </label>
          <input
            v-model="newPaymentForm.cardNumber"
            type="text"
            maxlength="19"
            placeholder="1234 5678 9012 3456"
            class="form-input w-[70%] p-[6px] mt-[5px] mb-[10px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            @input="
              newPaymentForm.cardNumber = formatCardNumber(
                newPaymentForm.cardNumber.replace(/\s/g, ''),
              )
            "
          />
        </div>

        <!-- Card Holder -->
        <div class="form-group space-y-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-[5px]">
            <font-awesome-icon :icon="['fas', 'user']" class="w-4 h-4 text-gray-400" />
            Card Holder
          </label>
          <input
            v-model="newPaymentForm.cardHolder"
            type="text"
            placeholder="Ava Thompson"
            class="form-input w-[70%] p-[6px] mt-[5px] mb-[10px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <!-- Expiry Date and CVV -->
        <div class="form-group space-y-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-[5px]">
            <font-awesome-icon :icon="['fas', 'calendar']" class="w-4 h-4 text-gray-400" />
            Expiry Date
          </label>
          <input
            v-model="newPaymentForm.expiryDate"
            type="text"
            placeholder="MM/YY"
            maxlength="5"
            class="form-input w-[70%] p-[6px] mt-[5px] mb-[10px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <div class="form-group space-y-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'lock']" class="w-4 h-4 text-gray-400" />
            CVV
          </label>
          <input
            v-model="newPaymentForm.cvv"
            type="text"
            maxlength="4"
            placeholder="123"
            class="form-input w-[70%] p-[6px] mt-[5px] mb-[10px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      <!-- M-Pesa Form -->
      <div v-if="selectedPaymentType === 'mpesa'" class="form-group space-y-3 mb-[10px]">
        <label class="text-sm font-medium text-gray-700 flex items-center gap-2 mb-[5px]">
          <font-awesome-icon :icon="['fas', 'mobile-screen']" class="w-4 h-4 text-gray-400" />
          M-Pesa Phone Number
        </label>
        <input
          v-model="newPaymentForm.phoneNumber"
          type="tel"
          placeholder="+254 712 345 678"
          class="form-input w-[70%] p-[6px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          @input="newPaymentForm.phoneNumber = formatPhoneNumber(newPaymentForm.phoneNumber)"
        />
        <p class="text-sm text-gray-500 mt-2">
          Enter your M-Pesa registered phone number. We'll send a confirmation code.
        </p>
      </div>

      <!-- PayPal Form -->
      <div v-if="selectedPaymentType === 'paypal'" class="form-group space-y-3">
        <label class="text-sm font-medium text-gray-700 flex items-center gap-[5px]">
          <font-awesome-icon :icon="['fab', 'paypal']" class="w-4 h-4 text-gray-400" />
          PayPal Email
        </label>
        <input
          v-model="newPaymentForm.paypalEmail"
          type="email"
          placeholder="your.email@example.com"
          class="form-input w-[70%] p-[6px] mt-[5px] mb-[10px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
        <p class="text-sm text-gray-500 my-[8px]">
          You'll be redirected to PayPal to complete the setup.
        </p>
      </div>

      <!-- Set as Default -->
      <div class="form-group flex items-center gap-[10px] p-4 bg-gray-50 rounded-lg">
        <input
          v-model="newPaymentForm.isDefault"
          type="checkbox"
          id="setDefault"
          class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label for="setDefault" class="text-sm font-medium text-gray-700"
          >Set as default payment method</label
        >
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-[10px] space-x-4 pt-6 border-t border-gray-200 mt-[15px]">
        <button
          @click="cancelAddPayment"
          class="cancel-btn px-6 py-3 mt-[10px] text-sm font-medium rounded-lg text-gray-700 border-gray-300 hover:bg-gray-100 transition-all flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'circle-xmark']" class="w-4 h-4" />
          Cancel
        </button>
        <button
          @click="addNewPayment"
          class="save-btn px-6 py-3 mt-[10px] text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'circle-check']" class="w-4 h-4" />
          {{ selectedPaymentType === 'paypal' ? 'Connect PayPal' : 'Save Payment Method' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-methods {
  background: #ffffff;
  padding: 25px;
  border-radius: 20px;
  border: 1px solid #e6e9ee;
}

.payment-methods-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.payment-item {
  padding: 10px;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 2px solid #f1f5f9;
}

.add-payment-btn {
  border: none;
  color: #ffffff;
  border-radius: 12px;
  background: #0f1724;
  padding: 12px 24px;
}

.add-payment-btn:hover {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 36, 0.2);
}

.set-default-btn,
.remove-btn {
  border-radius: 10px;
  font-weight: 500;
  padding: 10px 16px;
  transition: all 0.2s ease;
}

.set-default-btn:hover {
  background: #e0e7ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}

.remove-btn:hover {
  background: #fef2f2;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.payment-dropdown {
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.payment-dropdown:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input {
  border: 2px solid #e6e9ee;
  border-radius: 12px;
  background: #f7f9fb;
  transition: all 0.2s ease;
  font-size: 16px;
}

.form-input:focus {
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.form-input::placeholder {
  color: #9ca3af;
}

.cancel-btn {
  background: #0f1724;
  color: #ffffff;
  border-radius: 12px;
  border: none;
  padding: 12px 24px;
}

.save-btn {
  color: #ffffff;
  border-radius: 12px;
  background: #0066ff;
  border: none;
  padding: 12px 24px;
}

.payment-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-payment-form {
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 2px solid #f1f5f9;
}

.empty-state {
  padding: 60px 40px;
}

.close-btn {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  transform: rotate(90deg);
}

.payment-details {
  flex: 1;
}

.payment-actions {
  flex-shrink: 0;
}
</style>
