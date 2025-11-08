<script setup>
import { ref, defineProps, computed } from 'vue'

const props = defineProps({
  addresses: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const isAddingNewAddress = ref(false)

const newAddressForm = ref({
  fullName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateRegion: '',
  postalCode: '',
  country: '',
  type: 'Home',
})

// Convert addresses object to array for easier iteration
const addressList = computed(() => {
  return Object.entries(props.addresses).map(([type, address]) => ({
    type,
    ...address,
  }))
})

// Skeleton addresses for loading state
const skeletonAddresses = ref([
  { type: 'home', isDefault: true },
  { type: 'work', isDefault: false },
  { type: 'parents', isDefault: false },
  { type: 'vacation', isDefault: false },
])

const addAddress = () => {
  console.log('Adding new address:', newAddressForm.value)
  isAddingNewAddress.value = false
  resetNewAddressForm()
}

const cancelAddAddress = () => {
  isAddingNewAddress.value = false
  resetNewAddressForm()
}

const resetNewAddressForm = () => {
  newAddressForm.value = {
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateRegion: '',
    postalCode: '',
    country: '',
    type: 'Home',
  }
}

const setAsDefault = (addressType) => {
  console.log(`Setting ${addressType} as default`)
}

const removeAddress = (addressType) => {
  if (confirm(`Are you sure you want to remove your ${addressType} address?`)) {
    console.log(`Removing ${addressType} address`)
  }
}

const getAddressTypeDisplay = (type) => {
  const typeMap = {
    home: 'Home',
    work: 'Work',
    parents: 'Parents',
    vacation: 'Vacation',
  }
  return typeMap[type] || type
}
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
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-2 gap-[10px]">
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
            v-for="address in addressList"
            :key="address.type"
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
                {{ getAddressTypeDisplay(address.type) }}
              </span>
            </div>
            <p class="text-sm text-gray-600">{{ address.street }}</p>
            <p class="text-sm text-gray-600">{{ address.cityStateZip }}</p>
            <p class="text-sm text-gray-600">{{ address.country }}</p>
            <div class="address-buttons mt-[15px] flex space-x-2 gap-[10px]">
              <button
                class="edit-btn text-xs text-gray-600 px-3 py-1 border rounded-lg hover:bg-gray-100 flex items-center gap-1"
              >
                <font-awesome-icon :icon="['fas', 'pen-to-square']" class="w-3 h-3 mr-[6px]" />
                Edit
              </button>
              <button
                v-if="!address.isDefault"
                @click="setAsDefault(address.type)"
                class="default-btn text-xs text-indigo-600 px-3 py-1 border border-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-1"
              >
                <font-awesome-icon :icon="['fas', 'star']" class="w-3 h-3 mr-[6px]" />
                Set default {{ address.type === 'work' ? 'shipping' : '' }}
              </button>
              <button
                @click="removeAddress(address.type)"
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
          <!-- Full Name -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'user']" class="w-3 h-3 text-gray-400" />
              Full name
            </label>
            <input
              v-model="newAddressForm.fullName"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>

          <!-- Phone Number -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'phone']" class="w-3 h-3 text-gray-400" />
              Phone number
            </label>
            <input
              v-model="newAddressForm.phoneNumber"
              type="tel"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <!-- Address Line 1 -->
          <div class="form-group space-y-1 md:col-span-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'location-dot']" class="w-3 h-3 text-gray-400" />
              Address line 1
            </label>
            <input
              v-model="newAddressForm.addressLine1"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Street address, P.O. box, company name"
            />
          </div>

          <!-- Address Line 2 -->
          <div class="form-group space-y-1 md:col-span-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'location-dot']" class="w-3 h-3 text-gray-400" />
              Address line 2 (optional)
            </label>
            <input
              v-model="newAddressForm.addressLine2"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>

          <!-- City -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'city']" class="w-3 h-3 text-gray-400" />
              City
            </label>
            <input
              v-model="newAddressForm.city"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter city"
            />
          </div>

          <!-- State/Region -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'map']" class="w-3 h-3 text-gray-400" />
              State/Region
            </label>
            <input
              v-model="newAddressForm.stateRegion"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter state or region"
            />
          </div>

          <!-- Postal Code -->
          <div class="form-group space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'envelope']" class="w-3 h-3 text-gray-400" />
              Postal code
            </label>
            <input
              v-model="newAddressForm.postalCode"
              type="text"
              class="form-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter postal code"
            />
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
            class="save-btn px-5 py-3 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <font-awesome-icon :icon="['fas', 'circle-check']" class="w-4 h-4 mr-[6px]" />
            Save address
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

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
  border: 1px solid #e6e9ee;
}

.address-buttons button {
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #d3e9ff;
  border-color: #d1d5db;
}

.default-btn {
  background: #e0e7ff;
  border-color: #6366f1;
}

.remove-btn {
  background: #fef2f2;
  border-color: #fca5a5;
}

.search-form {
  padding: 2px;
  width: 60%;
  border: 1px solid #e6e9ee;
  border-radius: 10px;
  background: #f7f9fb;
  transition: all 0.2s ease;
}

.search-input {
  padding: 10px;
  border: none;
  background: #f7f9fb;
}

.search-input:focus {
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-btn {
  margin-right: 5px;
  padding: 10px;
  border: none;
  background: #f7f9fb;
  color: black;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  padding: 10px;
  border: 1px solid #e6e9ee;
  border-radius: 10px;
  background: #f7f9fb;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.add-card {
  border-radius: 20px;
  transition: all 0.3s ease;
}

.add-card:hover {
  border-color: #6366f1;
  background: #f0f9ff;
}

.close-btn {
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.cancel-btn {
  color: #ffffff;
  background: #0f1724;
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid #e6e9ee;
  transition: all 0.2s ease;
}

.save-btn {
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  background: #0066ff;
  border: none;
  color: #ffffff;
}

.cancel-btn:hover,
.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 36, 0.2);
}
</style>
