<script setup>
import { defineProps, defineEmits, ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
  user: Object,
})

const emit = defineEmits(['save-changes', 'delete-account', 'back-to-account'])

const isEditing = ref(false)
const isLoading = ref(false)
const isFetchingUser = ref(false)
const formErrors = ref({})

// Base URL
const BASE_URL = 'http://localhost:5000/users'

// Use local reactive state for editing
const editingUser = ref({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  phone: '',
  profile_img: ''
})

// Original user data for cancel operation
const originalUser = ref({})

// Get current user ID from localStorage/sessionStorage - FIXED
const getCurrentUserId = () => {
  // Try props first
  if (props.user?._id) return props.user._id
  if (props.user?.id) return props.user.id
  
  // Check localStorage/sessionStorage for user data
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      console.log('Stored user data:', userData) // Debug log
      // Your auth component stores user ID as 'id', not '_id'
      return userData.id || userData._id
    } catch (e) {
      console.error('Error parsing stored user data:', e)
    }
  }
  
  console.error('No user ID found in storage')
  return null
}

// Get current user data from storage (for initial display) - FIXED
const getCurrentUserFromStorage = () => {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      console.log('User data from storage:', userData) // Debug log
      return userData
    } catch (e) {
      console.error('Error parsing stored user data:', e)
    }
  }
  return null
}

// Fetch current user data from API
const fetchCurrentUser = async () => {
  const userId = getCurrentUserId()
  console.log('Fetching user with ID:', userId) // Debug log
  
  if (!userId) {
    console.error('No user ID found')
    // Try to use stored user data directly
    const storedUser = getCurrentUserFromStorage()
    if (storedUser) {
      console.log('Using stored user data directly')
      initializeUserData(storedUser)
      return
    }
    return
  }

  isFetchingUser.value = true
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await response.json()
    console.log('User data from API:', userData) // Debug log
    initializeUserData(userData)
  } catch (error) {
    console.error('Error fetching user:', error)
    // Fallback to stored user data or props
    const storedUser = getCurrentUserFromStorage()
    if (storedUser) {
      console.log('Falling back to stored user data')
      initializeUserData(storedUser)
    } else if (props.user) {
      initializeUserData(props.user)
    }
  } finally {
    isFetchingUser.value = false
  }
}

// Initialize user data - IMPROVED
const initializeUserData = (userData) => {
  console.log('Initializing user data with:', userData) // Debug log
  
  // Handle different user data structures
  const data = {
    firstname: userData.firstname || userData.firstName || '',
    lastname: userData.lastname || userData.lastName || '',
    username: userData.username || '',
    email: userData.email || '',
    phone: userData.phone || '',
    profile_img: userData.profile_img || userData.profileImg || userData.image || '/default-avatar.png',
    // Include the ID for reference
    _id: userData._id || userData.id
  }
  
  console.log('Processed user data:', data) // Debug log
  
  editingUser.value = { ...data }
  originalUser.value = { ...data }
}

// Watch for prop changes
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      console.log('Props user changed:', newUser)
      initializeUserData(newUser)
    }
  },
  { immediate: true, deep: true }
)

// Fetch user on component mount
onMounted(() => {
  console.log('Profile component mounted')
  // Always try to fetch user data on mount
  fetchCurrentUser()
})

// Form validation
const validateForm = () => {
  const errors = {}
  
  if (!editingUser.value.firstname?.trim()) {
    errors.firstname = 'First name is required'
  }
  
  if (!editingUser.value.lastname?.trim()) {
    errors.lastname = 'Last name is required'
  }
  
  if (!editingUser.value.username?.trim()) {
    errors.username = 'Username is required'
  } else if (!/^[a-zA-Z0-9._]{3,20}$/.test(editingUser.value.username)) {
    errors.username = 'Username must be 3-20 characters (letters, numbers, dots, underscores)'
  }
  
  if (!editingUser.value.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingUser.value.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  // Phone validation (optional)
  if (editingUser.value.phone && !/^[\+]?[1-9][\d\s\-\(\)]{8,}$/.test(editingUser.value.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const enableEditing = () => {
  isEditing.value = true
  formErrors.value = {}
}

const saveChanges = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      throw new Error('No user ID found. Please log in again.')
    }

    // Prepare data for backend
    const userData = {
      firstname: editingUser.value.firstname,
      lastname: editingUser.value.lastname,
      username: editingUser.value.username,
      email: editingUser.value.email,
      phone: editingUser.value.phone || null,
      profile_img: editingUser.value.profile_img
    }
    
    // Call the update API
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update user')
    }

    const updatedUser = await response.json()
    
    // Update local state
    initializeUserData(updatedUser.user || updatedUser)
    
    // Update stored user data
    const currentStoredUser = getCurrentUserFromStorage()
    if (currentStoredUser) {
      const updatedStoredUser = { 
        ...currentStoredUser, 
        ...userData
      }
      localStorage.setItem('user', JSON.stringify(updatedStoredUser))
      sessionStorage.setItem('user', JSON.stringify(updatedStoredUser))
    }
    
    // Emit event to parent component with the updated user data
    emit('save-changes', updatedUser.user || updatedUser) // Make sure this line is present
    isEditing.value = false
    
    alert('Profile updated successfully!')
    
  } catch (error) {
    console.error('Error saving changes:', error)
    alert(`Error updating profile: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

const cancelChanges = () => {
  editingUser.value = { ...originalUser.value }
  isEditing.value = false
  formErrors.value = {}
  emit('back-to-account')
}

// Upload image to backend
// const uploadImageToServer = async (file) => {
//   const userId = getCurrentUserId()
//   if (!userId) {
//     throw new Error('No user ID found')
//   }

//   // Create FormData for file upload
//   const formData = new FormData()
//   formData.append('profile_img', file)

//   const response = await fetch(`${BASE_URL}/${userId}/upload-image`, {
//     method: 'POST',
//     body: formData
//     // Note: Don't set Content-Type header for FormData, browser will set it automatically with boundary
//   })

//   if (!response.ok) {
//     const errorData = await response.json()
//     throw new Error(errorData.message || 'Failed to upload image')
//   }

//   const result = await response.json()
//   return result.profile_img // Return the new image URL
// }

// Remove image - set to default
// const removeImage = async () => {
//   if (!confirm('Are you sure you want to remove your profile image?')) {
//     return
//   }

//   try {
//     const userId = getCurrentUserId()
//     if (!userId) {
//       throw new Error('No user ID found')
//     }

//     // Call backend to remove image (set to default)
//     const response = await fetch(`${BASE_URL}/${userId}/remove-image`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(errorData.message || 'Failed to remove image')
//     }

//     const result = await response.json()
    
//     // Update local state
//     editingUser.value.profile_img = 'default-avatar.png'
    
//     // Update stored user data
//     const currentStoredUser = getCurrentUserFromStorage()
//     if (currentStoredUser) {
//       const updatedStoredUser = { 
//         ...currentStoredUser, 
//         profile_img: 'default-avatar.png'
//       }
//       localStorage.setItem('user', JSON.stringify(updatedStoredUser))
//       sessionStorage.setItem('user', JSON.stringify(updatedStoredUser))
//     }
    
//     alert('Profile image removed successfully!')
//   } catch (error) {
//     console.error('Error removing image:', error)
//     alert(`Error removing image: ${error.message}`)
//   }
// }

const handleDelete = async () => {
  if (!confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
    return
  }

  try {
    const userId = getCurrentUserId()
    if (!userId) {
      throw new Error('No user ID found')
    }

    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete account')
    }

    const result = await response.json()
    
    // Clear stored user data
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    localStorage.removeItem('userId')
    sessionStorage.removeItem('userId')
    
    emit('delete-account', result.deletedUserId || userId)
    alert('Account deleted successfully')
    
  } catch (error) {
    console.error('Error deleting account:', error)
    alert(`Error deleting account: ${error.message}`)
  }
}

// Computed display name
const displayName = computed(() => {
  return `${editingUser.value.firstname} ${editingUser.value.lastname}`.trim() || 'User'
})

// Check if user data is loaded
const hasUserData = computed(() => {
  return editingUser.value.firstname || editingUser.value.lastname || editingUser.value.email
})

// Debug info (remove in production)
const debugInfo = computed(() => {
  return {
    userId: getCurrentUserId(),
    storedUser: getCurrentUserFromStorage(),
    editingUser: editingUser.value,
    hasProps: !!props.user
  }
})

</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6 space-y-10">
    <!-- Loading State -->
    <div v-if="isFetchingUser" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D3471] mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading profile data...</p>
    </div>

    <!-- User Data -->
    <div v-else-if="hasUserData">
      <!-- Header with Edit Toggle -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Profile Details</h1>
        <button
          v-if="!isEditing"
          @click="enableEditing"
          class="edit-btn px-[5px] py-[5px] text-sm rounded-lg hover:bg-[#AA69AF] transition flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'pen-to-square']" class="w-4 h-4 mr-[5px]" />
          Edit Profile
        </button>
      </div>

      <!-- Personal info -->
      <section class="personal-info space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold">Personal info</h2>
        </div>

        <div class="flex items-center space-x-6 pb-4">
          <div class="h-20 w-20 rounded-full bg-gray-200 overflow-hidden relative">
            <img 
              :src="editingUser.profile_img" 
              :alt="displayName" 
              class="w-full h-full object-cover" 
            />
          </div>
          <div class="upload-btns flex space-x-3 gap-[5px] px-[6px]">
            <input
              v-if="isEditing"
              type="file"
              id="avatar-upload"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
            />
            <!-- <button
              v-if="isEditing"
              @click="uploadImageToServer"
              class="upload-btn px-4 py-2 text-sm font-medium rounded-lg text-white border border-gray-300 hover:bg-[#AA69AF] transition flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'upload']" class="w-4 h-4 mr-[5px]" />
              Upload new
            </button> -->
            <!-- <button
              v-if="isEditing"
              @click="removeImage"
              class="remove-btn px-4 py-2 text-sm font-medium rounded-lg text-white border border-[#CE7F57] hover:bg-[#AA69AF] transition flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'trash']" class="w-4 h-4 mr-[5px]" />
              Remove
            </button> -->
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="user-name grid grid-cols-2 gap-[5px]">
            <!-- First Name -->
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">First name</label>
              <input
                v-if="isEditing"
                v-model="editingUser.firstname"
                :class="['w-full p-3 border rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]', 
                        formErrors.firstname ? 'border-red-500 bg-[#FEE2E2]' : 'border-gray-300 bg-[#E8B6D5]']"
                placeholder="Enter first name"
              />
              <div v-else class="name-display p-3 bg-[#E8B6D5] rounded-lg text-gray-700">
                {{ editingUser.firstname }}
              </div>
              <p v-if="formErrors.firstname" class="text-xs text-red-500 mt-1">
                {{ formErrors.firstname }}
              </p>
            </div>

            <!-- Last Name -->
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Last name</label>
              <input
                v-if="isEditing"
                v-model="editingUser.lastname"
                :class="['w-full p-3 border rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]',
                        formErrors.lastname ? 'border-red-500 bg-[#FEE2E2]' : 'border-gray-300 bg-[#E8B6D5]']"
                placeholder="Enter last name"
              />
              <div v-else class="name-display p-3 bg-[#E8B6D5] rounded-lg text-gray-700">
                {{ editingUser.lastname }}
              </div>
              <p v-if="formErrors.lastname" class="text-xs text-red-500 mt-1">
                {{ formErrors.lastname }}
              </p>
            </div>
          </div>

          <!-- Username -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Username</label>
            <input
              v-if="isEditing"
              v-model="editingUser.username"
              :class="['w-full p-3 border rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]',
                      formErrors.username ? 'border-red-500 bg-[#FEE2E2]' : 'border-gray-300 bg-[#E8B6D5]']"
              placeholder="Enter username"
            />
            <div v-else class="username-display p-3 bg-[#E8B6D5] rounded-lg text-gray-700">
              {{ editingUser.username }}
            </div>
            <p v-if="isEditing && !formErrors.username" class="text-xs text-gray-500 mt-1">
              Must be 3–20 characters. Letters, numbers, dots, and underscores.
            </p>
            <p v-if="formErrors.username" class="text-xs text-red-500 mt-1">
              {{ formErrors.username }}
            </p>
          </div>

          <!-- Display Name (Computed) -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Display name</label>
            <div class="show-name p-3 bg-[#E8B6D5] rounded-lg text-gray-700">
              {{ displayName }}
            </div>
            <p class="text-xs text-gray-500 mt-1">This is automatically generated from your first and last name.</p>
          </div>
        </div>
      </section>

      <hr class="border-gray-200" />

      <!-- Contact -->
      <section class="contact space-y-4">
        <h2 class="text-lg font-bold">Contact</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Email -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon
                :icon="['fas', 'envelope']"
                class="w-4 h-4 text-gray-400"
              />
              Email
            </label>
            <input
              v-if="isEditing"
              v-model="editingUser.email"
              type="email"
              :class="['w-full p-3 border rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]',
                      formErrors.email ? 'border-red-500 bg-[#FEE2E2]' : 'border-gray-300 bg-[#E8B6D5]']"
              placeholder="Enter email address"
            />
            <div v-else class="email-display p-3 bg-[#E8B6D5] rounded-lg text-gray-700">
              {{ editingUser.email }}
            </div>
            <p v-if="formErrors.email" class="text-xs text-red-500 mt-1">
              {{ formErrors.email }}
            </p>
            <p class="text-xs text-gray-500 mt-1">Primary email for order updates and receipts.</p>
          </div>

          <!-- Phone -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'phone']" class="w-4 h-4 text-gray-400" />
              Phone number <span class="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              v-if="isEditing"
              v-model="editingUser.phone"
              type="tel"
              :class="['w-full p-3 border rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]',
                      formErrors.phone ? 'border-red-500 bg-[#FEE2E2]' : 'border-gray-300 bg-[#E8B6D5]']"
              placeholder="Enter phone number"
            />
            <div v-else class="phone-display p-3 bg-[#E8B6D5] rounded-lg text-gray-700">
              {{ editingUser.phone || 'Not provided' }}
            </div>
            <p v-if="formErrors.phone" class="text-xs text-red-500 mt-1">
              {{ formErrors.phone }}
            </p>
            <p class="text-xs text-gray-500 mt-1">Used for delivery and account security.</p>
          </div>
        </div>
      </section>

      <!-- Save/Cancel Buttons (Only show when editing) -->
      <section v-if="isEditing" class="actions space-y-6">
        <hr class="border-gray-200 mb-[20px]" />

        <div class="actions-btns flex justify-end space-x-3 gap-[10px]">
          <button
            @click="cancelChanges"
            :disabled="isLoading"
            class="cancel-btn px-5 py-3 text-sm font-medium rounded-lg text-white border border-gray-300 hover:bg-[#AA69AF] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon :icon="['fas', 'circle-xmark']" class="w-4 h-4 mr-[5px]" />
            Cancel
          </button>
          <button
            @click="saveChanges"
            :disabled="isLoading"
            class="save-btn px-5 py-3 text-sm font-medium rounded-lg text-white hover:bg-[#AA69AF] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon :icon="['fas', 'circle-check']" class="w-4 h-4 mr-[5px]" />
            {{ isLoading ? 'Saving...' : 'Save changes' }}
          </button>
        </div>
      </section>

      <hr class="border-gray-200" />

      <!-- Delete Account (Always visible) -->
      <section class="delete-section">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-medium text-gray-800 flex items-center gap-2">
              <font-awesome-icon
                :icon="['fas', 'triangle-exclamation']"
                class="w-4 h-4 text-[#CE7F57]"
              />
              Delete account
            </h2>
            <p class="text-sm text-gray-500">
              This is permanent and will remove your profile and order history.
            </p>
          </div>
          <button
            @click="handleDelete"
            class="px-5 py-3 text-sm font-medium rounded-lg text-white hover:bg-[#AA69AF] transition flex items-center gap-2"
          >
            <font-awesome-icon :icon="['fas', 'trash-can']" class="w-4 h-4" />
            Delete
          </button>
        </div>
      </section>
    </div>

    <!-- No User Data -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 mb-4">No user data available.</p>
      <div class="space-y-2">
        <button 
          @click="fetchCurrentUser"
          class="edit-btn px-4 py-2 rounded-lg hover:bg-[#AA69AF] transition block mx-auto"
        >
          Load Profile Data
        </button>
        <p class="text-xs text-gray-500">Or make sure you're logged in and user data is stored</p>
      </div>
      
      <!-- Debug info (remove in production) -->
      <div class="mt-6 p-4 bg-gray-100 rounded-lg text-left">
        <p class="text-sm font-medium text-gray-700">Debug Info:</p>
        <pre class="text-xs text-gray-600 mt-2">{{ debugInfo }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personal-info,
.contact,
.actions,
.delete-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
}

label {
  font-size: 1rem;
  font-weight: 500;
}

.personal-info img {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}
.name-display,
.email-display,
.phone-display,
.username-display,
.show-name {
  padding: 12px;
  border: 1px solid #e7eaef;
  border-radius: 10px;
  background: #e8b6d5;
  margin-bottom: 10px;
}

input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e7eaef;
  margin-bottom: 10px;
  background: #e8b6d5;
}

.edit-btn {
  background: #804d91;
  border: none;
  color: #ffffff;
  border-radius: 8px;
  font-size: medium;
  transition: 0.3s ease;
}

.delete-section button {
  background: #ce7f57;
  padding: 10px;
  border: 1px solid #e6e9ee;
  border-radius: 6px;
  font-weight: 400;
  font-size: medium;
  color: #ffffff;
  transition: 0.3s ease;
}

.upload-btns button {
  padding: 8px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  transition: 0.3s ease;
}
.actions-btns button {
  padding: 8px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  transition: 0.3s ease;
}
.upload-btn,
.save-btn {
  background: #5d3471;
}
.remove-btn,
.cancel-btn {
  background: #804d91;
  transition: 0.3s ease;
}

.edit-btn:hover {
  background: #aa69af;
}

.upload-btn:hover {
  background: #aa69af;
  color: #fff;
}
.remove-btn:hover {
  background: #aa69af;
  color: #fff;
}
.save-btn:hover {
  background: #aa69af;
}
.cancel-btn:hover {
  background: #aa69af;
}
.delete-section button:hover {
  background: #aa69af;
  color: #fff;
}

/* Responsive design */
@media (max-width: 768px) {
  .user-name {
    grid-template-columns: 1fr;
  }
  
  .actions-btns {
    flex-direction: column;
  }
  
  .actions-btns button {
    width: 100%;
  }
}
</style>