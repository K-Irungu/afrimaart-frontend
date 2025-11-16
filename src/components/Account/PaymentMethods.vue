<script setup>
import { ref, onMounted } from 'vue'

const BASE_URL = 'http://localhost:5000/payment-methods';

const paymentMethods = ref([])
const loading = ref(true)
const isAddingNewPayment = ref(false)
const selectedPaymentType = ref('mpesa')

const newPaymentForm = ref({
  type: 'mpesa',
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
  phoneNumber: '',
  paypalEmail: '',
  isDefault: false,
})

// Get current user ID
const getCurrentUserId = () => {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      return userData.id || userData._id
    } catch (e) {
      console.error('Error parsing stored user data:', e)
    }
  }
  return null
}

// Payment method options
const paymentOptions = [
  { value: 'mpesa', label: 'M-Pesa', icon: ['fas', 'mobile-screen'] },
  { value: 'card', label: 'Credit/Debit Card', icon: ['fas', 'credit-card'] },
  { value: 'paypal', label: 'PayPal', icon: ['fab', 'paypal'] },
]

// Fetch payment methods from API
const fetchPaymentMethods = async () => {
  loading.value = true
  try {
    const userId = getCurrentUserId()
    
    if (!userId) {
      throw new Error('No user ID found. Please log in again.')
    }

    const response = await fetch(`${BASE_URL}?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    console.log('Payment methods response status:', response.status)
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment methods')
    }

    const methods = await response.json()
    console.log('Payment methods result:', methods)
    
    paymentMethods.value = methods
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    
    // Use mock data as fallback
    console.log('Using mock data as fallback...')
    paymentMethods.value = getMockPaymentMethods()
  } finally {
    loading.value = false
  }
}

// Mock data for development
const getMockPaymentMethods = () => {
  const userId = getCurrentUserId()
  return [
    {
      _id: '1',
      user: userId,
      type: 'mpesa',
      phone_number: '+254712345678',
      isDefault: true,
    },
    {
      _id: '2',
      user: userId,
      type: 'card',
      card_holder: 'Ava Thompson',
      last_four: '4242',
      expiry: '12/25',
      isDefault: false,
    }
  ]
}

// Add new payment method
const addNewPayment = async () => {
  try {
    const userId = getCurrentUserId()
    
    if (!userId) {
      throw new Error('No user ID found. Please log in again.')
    }

    let paymentData = {
      user: userId,
      type: newPaymentForm.value.type,
      isDefault: newPaymentForm.value.isDefault,
    }

    // Add type-specific data
    switch (newPaymentForm.value.type) {
      case 'card':
        paymentData = {
          ...paymentData,
          card_holder: newPaymentForm.value.cardHolder,
          last_four: newPaymentForm.value.cardNumber.slice(-4),
          expiry: newPaymentForm.value.expiryDate,
        }
        break

      case 'mpesa':
        paymentData = {
          ...paymentData,
          phone_number: newPaymentForm.value.phoneNumber,
        }
        break

      case 'paypal':
        paymentData = {
          ...paymentData,
          paypal_email: newPaymentForm.value.paypalEmail,
        }
        break
    }

    console.log('Sending payment data:', paymentData)

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    console.log('Add payment response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create payment method')
    }

    const result = await response.json()
    console.log('Add payment result:', result)
    
    paymentMethods.value.push(result)
    isAddingNewPayment.value = false
    resetNewPaymentForm()
    alert('Payment method added successfully!')
    
  } catch (error) {
    console.error('Error adding payment method:', error)
    
    // Fallback: add to local state
    const newPayment = {
      _id: Date.now().toString(),
      user: getCurrentUserId(),
      type: newPaymentForm.value.type,
      phone_number: newPaymentForm.value.phoneNumber,
      card_holder: newPaymentForm.value.cardHolder,
      last_four: newPaymentForm.value.cardNumber.slice(-4),
      expiry: newPaymentForm.value.expiryDate,
      paypal_email: newPaymentForm.value.paypalEmail,
      isDefault: newPaymentForm.value.isDefault,
    }
    
    paymentMethods.value.push(newPayment)
    isAddingNewPayment.value = false
    resetNewPaymentForm()
    alert('Payment method added locally (API unavailable)')
  }
}

// Set as default payment method
const setAsDefault = async (paymentId) => {
  try {
    const response = await fetch(`${BASE_URL}/${paymentId}/default`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to set default payment method')
    }

    const result = await response.json()
    
    // Update local state
    paymentMethods.value.forEach((payment) => {
      payment.isDefault = payment._id === paymentId
    })
    
    alert('Default payment method updated successfully!')
  } catch (error) {
    console.error('Error setting default payment method:', error)
    alert(`Error setting default payment method: ${error.message}`)
  }
}

// Remove payment method
const removePayment = async (paymentId) => {
  if (!confirm('Are you sure you want to remove this payment method?')) {
    return
  }

  try {
    const response = await fetch(`${BASE_URL}/${paymentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to delete payment method')
    }

    paymentMethods.value = paymentMethods.value.filter((payment) => payment._id !== paymentId)
    alert('Payment method removed successfully!')
  } catch (error) {
    console.error('Error removing payment method:', error)
    alert(`Error removing payment method: ${error.message}`)
  }
}

const cancelAddPayment = () => {
  isAddingNewPayment.value = false
  resetNewPaymentForm()
}

const resetNewPaymentForm = () => {
  newPaymentForm.value = {
    type: 'mpesa',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    paypalEmail: '',
    isDefault: false,
  }
  selectedPaymentType.value = 'mpesa'
}

const getPaymentIcon = (paymentType) => {
  switch (paymentType) {
    case 'card':
      return ['fas', 'credit-card']
    case 'paypal':
      return ['fab', 'paypal']
    case 'mpesa':
      return ['fas', 'mobile-screen']
    default:
      return ['fas', 'credit-card-alt']
  }
}

const getPaymentColor = (paymentType) => {
  switch (paymentType) {
    case 'card':
      return 'text-blue-600'
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
      return `•••• ${payment.last_four} • ${payment.card_holder}`
    case 'paypal':
      return payment.paypal_email
    case 'mpesa':
      return payment.phone_number
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

// Load payment methods on component mount
onMounted(() => {
  fetchPaymentMethods()
})
</script>

<!-- The template remains exactly the same as your original -->
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
        :key="payment._id"
        class="payment-item bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="payment-icon">
              <font-awesome-icon
                :icon="getPaymentIcon(payment.type)"
                :class="['w-10 h-10', getPaymentColor(payment.type)]"
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
              <p v-if="payment.type === 'card' && payment.expiry" class="text-gray-500 text-sm mt-1">
                Expires {{ payment.expiry }}
              </p>
            </div>
          </div>
          <div class="payment-actions flex items-center gap-[7px]">
            <button
              v-if="!payment.isDefault"
              @click="setAsDefault(payment._id)"
              class="set-default-btn text-sm text-indigo-600 px-4 py-2 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'star']" class="w-4 h-4" />
              Set Default
            </button>
            <button
              @click="removePayment(payment._id)"
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

<!-- Keep your existing styles -->

<style scoped>
.payment-methods {
  background: #ffffff;
  padding: 25px;
  border-radius: 20px;
  border: 1px solid #e8b6d5;
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
  border: 2px solid #e8b6d5;
}

.add-payment-btn {
  border: none;
  color: #ffffff;
  border-radius: 12px;
  background: #5d3471;
  padding: 12px 24px;
}

.add-payment-btn:hover {
  background: #804d91;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(128, 77, 145, 0.3);
}

.set-default-btn,
.remove-btn {
  border-radius: 10px;
  font-weight: 500;
  padding: 10px 16px;
  transition: all 0.2s ease;
}

.set-default-btn:hover {
  background: #e8b6d5;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(170, 105, 175, 0.3);
}

.remove-btn:hover {
  background: #fef2f2;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(206, 127, 87, 0.3);
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

.form-input {
  border: 2px solid #e8b6d5;
  border-radius: 12px;
  background: #fdf7fb;
  transition: all 0.2s ease;
  font-size: 16px;
}

.form-input:focus {
  border-color: #5d3471;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(93, 52, 113, 0.15);
  transform: translateY(-2px);
}

.form-input::placeholder {
  color: #9ca3af;
}

.cancel-btn {
  background: #5d3471;
  color: #ffffff;
  border-radius: 12px;
  border: none;
  padding: 12px 24px;
}

.save-btn {
  color: #ffffff;
  border-radius: 12px;
  background: #804d91;
  border: none;
  padding: 12px 24px;
}

.save-btn:hover {
  background: #aa69af;
  box-shadow: 0 4px 12px rgba(170, 105, 175, 0.3);
}

.cancel-btn:hover {
  background: #aa69af;
  box-shadow: 0 4px 12px rgba(170, 105, 175, 0.3);
}

.payment-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-payment-form {
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(128, 77, 145, 0.1);
  border: 2px solid #e8b6d5;
}

.empty-state {
  padding: 60px 40px;
  background: #fdf7fb;
  border-color: #e8b6d5;
}

.close-btn {
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #5d3471;
}

.close-btn:hover {
  background: #e8b6d5;
  color: #804d91;
  transform: rotate(90deg);
}

.payment-details {
  flex: 1;
}

.payment-actions {
  flex-shrink: 0;
}
</style>
