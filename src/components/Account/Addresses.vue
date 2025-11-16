<script setup>
import { ref, onMounted } from 'vue'

const BASE_URL = 'http://localhost:5000/addresses';

const addresses = ref([])
const loading = ref(false)
const isAddingNewAddress = ref(false)
const formErrors = ref({})

const newAddressForm = ref({
  address_line_1: '',
  address_line_2: '',
  city: '',
  state_region: '',
  postal_code: '',
  country: 'Kenya',
  type: 'Home'
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

// Fetch addresses from API
const fetchAddresses = async () => {
  loading.value = true
  try {
    const userId = getCurrentUserId()
    
    if (!userId) {
      throw new Error('No user ID found. Please log in again.')
    }

    // Send user ID as query parameter
    const url = `${BASE_URL}?userId=${userId}`
    console.log('🔍 Fetching from URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response text:', errorText)
      throw new Error(`Failed to fetch addresses: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Addresses result:', result)
    console.log('Success:', result.success)
    console.log('Addresses array:', result.addresses)
    console.log('Number of addresses:', result.addresses ? result.addresses.length : 0)
    
    if (result.success) {
      addresses.value = result.addresses || []
      console.log('Final addresses array:', addresses.value)
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('❌ Error fetching addresses:', error)
    
    // Use mock data as fallback
    console.log('🔄 Using mock data as fallback...')
    addresses.value = getMockAddresses()
    
    alert(`Error loading addresses: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// Mock data for development
const getMockAddresses = () => {
  const userId = getCurrentUserId()
  return [
    {
      _id: '1',
      user: userId,
      address_line_1: '369 Market St, Apt 7C',
      address_line_2: '',
      city: 'San Francisco',
      state_region: 'CA',
      postal_code: '94103',
      country: 'United States',
      type: 'Home',
      isDefault: true
    },
    {
      _id: '2',
      user: userId,
      address_line_1: '240 Townsend St, Floor 4',
      address_line_2: '',
      city: 'San Francisco',
      state_region: 'CA',
      postal_code: '94107',
      country: 'United States',
      type: 'Work',
      isDefault: false
    }
  ]
}

// Form validation
const validateForm = () => {
  const errors = {}
  
  if (!newAddressForm.value.address_line_1?.trim()) {
    errors.address_line_1 = 'Address line 1 is required'
  }
  
  if (!newAddressForm.value.city?.trim()) {
    errors.city = 'City is required'
  }
  
  if (!newAddressForm.value.postal_code?.trim()) {
    errors.postal_code = 'Postal code is required'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// Add new address
const addAddress = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    const userId = getCurrentUserId()
    
    if (!userId) {
      throw new Error('No user ID found. Please log in again.')
    }

    // Include user ID in the request body
    const addressData = {
      userId: userId,
      ...newAddressForm.value
    }

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData)
    })

    console.log('Add address response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create address')
    }

    const result = await response.json()
    console.log('Add address result:', result)
    
    if (result.success) {
      addresses.value.push(result.address)
      isAddingNewAddress.value = false
      resetNewAddressForm()
      alert('Address added successfully!')
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('Error adding address:', error)
    
    // Fallback: add to local state
    const newAddress = {
      _id: Date.now().toString(),
      user: getCurrentUserId(),
      ...newAddressForm.value,
      isDefault: addresses.value.length === 0
    }
    
    addresses.value.push(newAddress)
    isAddingNewAddress.value = false
    resetNewAddressForm()
    alert('Address added locally (API unavailable)')
  } finally {
    loading.value = false
  }
}

// Set address as default - FIXED ENDPOINT
const setAsDefault = async (addressId) => {
  try {
    const userId = getCurrentUserId()
    
    if (!userId) {
      throw new Error('No user ID found. Please log in again.')
    }

    // Use the correct endpoint: /addresses/:id/default (not /addresses/:id/set-default)
    const response = await fetch(`${BASE_URL}/${addressId}/default`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    })

    console.log('Set default response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response text:', errorText)
      let errorMessage = `Server error: ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If response is not JSON, use the text
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log('Set default result:', result)
    
    if (result.success) {
      // Update local state
      addresses.value = addresses.value.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }))
      alert('Default address updated successfully!')
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('Error setting default address:', error)
    alert(`Error setting default address: ${error.message}`)
  }
}

// Remove address
const removeAddress = async (addressId, addressType) => {
  if (!confirm(`Are you sure you want to remove your ${addressType} address?`)) {
    return
  }

  try {
    const userId = getCurrentUserId()
    
    if (!userId) {
      throw new Error('No user ID found. Please log in again.')
    }

    const response = await fetch(`${BASE_URL}/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    })

    console.log('Delete response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete address')
    }

    const result = await response.json()
    if (result.success) {
      addresses.value = addresses.value.filter(addr => addr._id !== addressId)
      alert('Address removed successfully!')
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('Error removing address:', error)
    alert(`Error removing address: ${error.message}`)
  }
}

const cancelAddAddress = () => {
  isAddingNewAddress.value = false
  resetNewAddressForm()
  formErrors.value = {}
}

const resetNewAddressForm = () => {
  newAddressForm.value = {
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_region: '',
    postal_code: '',
    country: 'Kenya',
    type: 'Home'
  }
}

// Format address for display
const formatAddress = (address) => {
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.city,
    address.state_region,
    address.postal_code,
    address.country
  ].filter(part => part && part.trim())
  
  return parts.join(', ')
}

// Skeleton addresses for loading state
const skeletonAddresses = ref([
  { type: 'home', isDefault: true },
  { type: 'work', isDefault: false },
  { type: 'other', isDefault: false },
])

// Load addresses on component mount
onMounted(() => {
  console.log('Current user ID:', getCurrentUserId())
  fetchAddresses()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Saved Addresses Section -->
    <section class="saved-addresses">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-[15px]">
          <h2 class="text-lg font-bold">Saved addresses</h2>

          <form class="search-form flex items-center max-w-lg mx-auto">
            <label for="voice-search" class="sr-only">Search</label>
            <div class="relative w-full">
              <input
                type="text"
                id="voice-search"
                class="search-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                placeholder="Search address"
                required
              />
            </div>
            <button
              type="submit"
              class="search-btn inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg"
            >
              <font-awesome-icon :icon="['fas', 'search']" class="w-[20px] h-[20px] mr-[6px]" />
            </button>
          </form>
        </div>

        <!-- Loading State -->
        <div v-if="loading && addresses.length === 0" class="grid grid-cols-2 md:grid-cols-2 gap-[10px]">
          <div
            v-for="skeleton in skeletonAddresses"
            :key="skeleton.type"
            class="address-item p-[10px] border rounded-lg bg-gray-50 animate-pulse"
          >
            <div class="flex flex-col justify-between items-start mb-2">
              <div
                v-if="skeleton.isDefault"
                class="bg-gray-200 text-gray-200 text-xs font-semibold px-2 py-0.5 rounded-full"
              >
                Default shipping
              </div>
              <div class="h-4 bg-gray-200 rounded w-16 mt-2"></div>
            </div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="mt-4 flex space-x-2">
              <div class="h-6 bg-gray-200 rounded w-12"></div>
              <div class="h-6 bg-gray-200 rounded w-24"></div>
              <div class="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        <!-- Actual Addresses -->
        <div v-else class="grid grid-cols-2 md:grid-cols-2 gap-[10px]">
          <!-- Dynamic Address Items -->
          <div
            v-for="address in addresses"
            :key="address._id"
            class="address-item p-[10px] border rounded-lg"
            :class="address.isDefault ? 'bg-gray-50' : ''"
          >
            <div class="flex flex-col justify-between items-start mb-2">
              <span
                v-if="address.isDefault"
                class="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full"
              >
                Default shipping
              </span>
              <span class="text-sm font-semibold text-gray-800 mt-1">
                {{ address.type }}
              </span>
            </div>
            <p class="text-sm text-gray-600">{{ formatAddress(address) }}</p>
            <div class="address-buttons mt-[15px] flex space-x-2 gap-[10px]">
              <button
                v-if="!address.isDefault"
                @click="setAsDefault(address._id)"
                class="default-btn text-xs text-indigo-600 px-3 py-1 border border-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-1"
              >
                <font-awesome-icon :icon="['fas', 'star']" class="w-3 h-3 mr-[6px]" />
                Set default
              </button>
              <button
                @click="removeAddress(address._id, address.type)"
                class="remove-btn text-xs text-red-600 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-1"
              >
                <font-awesome-icon :icon="['fas', 'trash']" class="w-3 h-3 mr-[6px]" />
                Remove
              </button>
            </div>
          </div>

          <!-- Add New Address Card -->
          <div
            class="add-card p-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            @click="isAddingNewAddress = true"
          >
            <div class="text-center text-gray-500">
              <font-awesome-icon :icon="['fas', 'plus']" class="mx-auto w-6 h-6 mb-1" />
              <span class="text-sm">Add address</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Add New Address Section -->
    <section class="new-addresses">
      <div v-if="isAddingNewAddress" class="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold">Add a new address</h2>
          <button
            @click="cancelAddAddress"
            class="close-btn text-gray-500 hover:text-gray-700 transition"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" class="w-5 h-5" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <!-- Address Type -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'tag']" class="w-3 h-3 text-gray-400" />
              Address Type
            </label>
            <select
              v-model="newAddressForm.type"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Country -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'globe']" class="w-3 h-3 text-gray-400" />
              Country
            </label>
            <input
              v-model="newAddressForm.country"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter country"
            />
          </div>

          <!-- Address Line 1 -->
          <div class="form-group space-y-1 md:col-span-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'location-dot']" class="w-3 h-3 text-gray-400" />
              Address line 1 *
            </label>
            <input
              v-model="newAddressForm.address_line_1"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              :class="formErrors.address_line_1 ? 'border-red-500' : ''"
              placeholder="Street address, P.O. box, company name"
            />
            <p v-if="formErrors.address_line_1" class="text-xs text-red-500 mt-1">
              {{ formErrors.address_line_1 }}
            </p>
          </div>

          <!-- Address Line 2 -->
          <div class="form-group space-y-1 md:col-span-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'location-dot']" class="w-3 h-3 text-gray-400" />
              Address line 2 (optional)
            </label>
            <input
              v-model="newAddressForm.address_line_2"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>

          <!-- City -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'city']" class="w-3 h-3 text-gray-400" />
              City *
            </label>
            <input
              v-model="newAddressForm.city"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              :class="formErrors.city ? 'border-red-500' : ''"
              placeholder="Enter city"
            />
            <p v-if="formErrors.city" class="text-xs text-red-500 mt-1">
              {{ formErrors.city }}
            </p>
          </div>

          <!-- State/Region -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'map']" class="w-3 h-3 text-gray-400" />
              State/Region
            </label>
            <input
              v-model="newAddressForm.state_region"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter state or region"
            />
          </div>

          <!-- Postal Code -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'envelope']" class="w-3 h-3 text-gray-400" />
              Postal code *
            </label>
            <input
              v-model="newAddressForm.postal_code"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              :class="formErrors.postal_code ? 'border-red-500' : ''"
              placeholder="Enter postal code"
            />
            <p v-if="formErrors.postal_code" class="text-xs text-red-500 mt-1">
              {{ formErrors.postal_code }}
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 gap-[15px]">
          <button
            @click="cancelAddAddress"
            class="cancel-btn px-5 py-3 text-sm font-medium rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <font-awesome-icon :icon="['fas', 'circle-xmark']" class="w-4 h-4 mr-[6px]" />
            Cancel
          </button>
          <button
            @click="addAddress"
            :disabled="loading"
            class="save-btn px-5 py-3 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <font-awesome-icon :icon="['fas', 'circle-check']" class="w-4 h-4 mr-[6px]" />
            {{ loading ? 'Saving...' : 'Save address' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<!-- Keep your existing styles, they're good -->

<style scoped>
.saved-addresses,
.new-addresses {
  padding: 20px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 20px;
}

.address-item {
  border-radius: 20px;
  border: 1px solid #aa69af;
  background: #ffffff;
}

.address-buttons button {
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #e8b6d5;
  border-color: #aa69af;
  color: #5d3471;
}

.default-btn {
  background: #e8b6d5;
  border-color: #804d91;
  color: #804d91;
}

.remove-btn {
  background: #fef2f2;
  border-color: #ce7f57;
  color: #ce7f57;
}

.search-form {
  padding: 2px;
  width: 60%;
  border: 1px solid #aa69af;
  border-radius: 10px;
  background: #e8b6d5;
  transition: all 0.2s ease;
}

.search-input {
  padding: 10px;
  border: none;
  background: #e8b6d5;
}

.search-input:focus {
  border-color: #5d3471;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(93, 52, 113, 0.1);
}

.search-btn {
  margin-right: 5px;
  padding: 10px;
  border: none;
  background: transparent;
  color: #5d3471;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  padding: 10px;
  border: 1px solid #aa69af;
  border-radius: 10px;
  background: #e8b6d5;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #5d3471;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(93, 52, 113, 0.1);
  transform: translateY(-1px);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-group label {
  font-weight: 500;
  color: #5d3471;
}

.add-card {
  border-radius: 20px;
  border-color: #aa69af;
  transition: all 0.3s ease;
}

.add-card:hover {
  border-color: #804d91;
  background: #e8b6d5;
}

.close-btn {
  padding: 8px;
  border-radius: 8px;
  background: #5d3471;
  transition: all 0.4s ease-in-out;
}

.close-btn:hover {
  background: #aa69af;
  color: #ffffff;
  transform: rotate(90deg);
}

.cancel-btn {
  color: #ffffff;
  background: #5d3471;
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid #aa69af;
  transition: all 0.2s ease;
}

.save-btn {
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  background: #804d91;
  border: none;
  color: #ffffff;
}

.cancel-btn:hover {
  background: #aa69af;
  box-shadow: 0 4px 12px rgba(170, 105, 175, 0.3);
}

.save-btn:hover {
  background: #ce7f57;
  box-shadow: 0 4px 12px rgba(206, 127, 87, 0.3);
  transform: translateY(-1px);
}
</style>
