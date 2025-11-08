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
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold">Saved addresses</h2>
          <div class="relative">
            <input
              type="text"
              placeholder="Search address"
              class="pl-10 p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
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
            <div class="mt-4 flex space-x-2">
              <button class="text-xs text-gray-600 px-3 py-1 border rounded-lg hover:bg-gray-100">
                Edit
              </button>
              <button
                v-if="!address.isDefault"
                @click="setAsDefault(address.type)"
                class="text-xs text-indigo-600 px-3 py-1 border border-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                Set default {{ address.type === 'work' ? 'shipping' : '' }}
              </button>
              <button
                @click="removeAddress(address.type)"
                class="text-xs text-red-600 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>

          <!-- Add New Address Card -->
          <div
            class="p-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            @click="isAddingNewAddress = true"
          >
            <div class="text-center text-gray-500">
              <svg
                class="mx-auto w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span class="text-sm">Add address</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Add New Address Section -->
    <section class="new-addresses">
      <div v-if="isAddingNewAddress" class="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <h2 class="text-lg font-bold">Add a new address</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Full name</label>
            <input
              v-model="newAddressForm.fullName"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Phone number</label>
            <input
              v-model="newAddressForm.phoneNumber"
              type="tel"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div class="space-y-1 md:col-span-2">
            <label class="text-sm font-medium text-gray-700">Address line 1</label>
            <input
              v-model="newAddressForm.addressLine1"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-sm font-medium text-gray-700">Address line 2 (optional)</label>
            <input
              v-model="newAddressForm.addressLine2"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">City</label>
            <input
              v-model="newAddressForm.city"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">State/Region</label>
            <input
              v-model="newAddressForm.stateRegion"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Postal code</label>
            <input
              v-model="newAddressForm.postalCode"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Country</label>
            <input
              v-model="newAddressForm.country"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            @click="cancelAddAddress"
            class="px-5 py-3 text-sm font-medium rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            @click="addAddress"
            class="px-5 py-3 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
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
</style>
