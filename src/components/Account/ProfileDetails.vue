<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  user: Object,
})

const emit = defineEmits(['save-changes', 'delete-account', 'back-to-account'])

// Editing state
const isEditing = ref(false)

// Use local reactive state for editing
const editingUser = ref({
  ...props.user,
  username: 'ava.th', // Added for this specific design
  displayName: 'Ava T.', // Added for this specific design
})

// Original user data for cancel operation
const originalUser = ref({ ...editingUser.value })

// Watch for prop changes
watch(
  () => props.user,
  (newUser) => {
    editingUser.value = { ...newUser, username: 'ava.th', displayName: 'Ava T.' }
    originalUser.value = { ...editingUser.value }
  },
  { deep: true },
)

const enableEditing = () => {
  isEditing.value = true
}

const saveChanges = () => {
  // In a real app, send the data to the server
  emit('save-changes', editingUser.value)
  isEditing.value = false
  originalUser.value = { ...editingUser.value }
}

const cancelChanges = () => {
  // Reset to original values
  editingUser.value = { ...originalUser.value }
  isEditing.value = false
  emit('back-to-account')
}

const handleDelete = () => {
  if (confirm('Are you sure you want to permanently delete your account?')) {
    emit('delete-account')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6 space-y-10">
    <!-- Header with Edit Toggle -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Profile Details</h1>
      <button
        v-if="!isEditing"
        @click="enableEditing"
        class="edit-btn px-[5px] py-[5px] text-sm rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
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
          <img :src="user.img" :alt="user.name" class="w-full h-full object-cover" />
        </div>
        <div class="upload-btns flex space-x-3 gap-[5px] px-[6px]">
          <button
            v-if="isEditing"
            class="upload-btn px-4 py-2 text-sm font-medium rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <font-awesome-icon :icon="['fas', 'upload']" class="w-4 h-4 mr-[5px]" />
            Upload new
          </button>
          <button
            v-if="isEditing"
            class="remove-btn px-4 py-2 text-sm font-medium rounded-lg text-red-600 border border-red-300 hover:bg-red-50 transition flex items-center gap-2"
          >
            <font-awesome-icon :icon="['fas', 'trash']" class="w-4 h-4 mr-[5px]" />
            Remove
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="user-name grid grid-cols-2 gap-[5px]">
          <!-- First Name -->
          <div class="space-y-1">
            <label class="text-lg font-semibold text-gray-700">First name</label>
            <input
              v-if="isEditing"
              v-model="editingUser.firstName"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div v-else class="name-display p-3 rounded-lg text-gray-700">
              {{ editingUser.firstName }}
            </div>
          </div>

          <!-- Last Name -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Last name</label>
            <input
              v-if="isEditing"
              v-model="editingUser.lastName"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div v-else class="name-display p-3 bg-gray-50 rounded-lg text-gray-700">
              {{ editingUser.lastName }}
            </div>
          </div>
        </div>

        <!-- Username -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Username</label>
          <input
            v-if="isEditing"
            v-model="editingUser.username"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div v-else class="username-display p-3 bg-gray-50 rounded-lg text-gray-700">
            {{ editingUser.username }}
          </div>
          <p v-if="isEditing" class="text-xs text-gray-500 mt-1">
            Must be 3–20 characters. Letters, numbers, dots, and underscores.
          </p>
        </div>

        <!-- Display Name -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Display name</label>
          <input
            v-if="isEditing"
            v-model="editingUser.displayName"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div v-else class="show-name p-3 bg-gray-50 rounded-lg text-gray-700">
            {{ editingUser.displayName }}
          </div>
        </div>
      </div>
    </section>

    <hr class="border-gray-200" />

    <!-- Contact -->
    <section class="contact space-y-4">
      <h2 class="text-lg font-bold">Contact</h2>

      <div class="grid grid-cols-2 md:grid-cols-2 gap-[5px]">
        <!-- Email -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon
              :icon="['fas', 'envelope']"
              class="w-4 h-4 text-gray-400 mr-[10px]"
            />
            Email
          </label>
          <input
            v-if="isEditing"
            v-model="editingUser.email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div v-else class="email-display p-3 bg-gray-50 rounded-lg text-gray-700">
            {{ editingUser.email }}
          </div>
          <p class="text-xs text-gray-500 mt-1">Primary email for order updates and receipts.</p>
        </div>

        <!-- Phone -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'phone']" class="w-4 h-4 text-gray-400" />
            Phone number
          </label>
          <input
            v-if="isEditing"
            v-model="editingUser.phone"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div v-else class="phone-display p-3 bg-gray-50 rounded-lg text-gray-700">
            {{ editingUser.phone }}
          </div>
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
          class="cancel-btn px-5 py-3 text-sm font-medium rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'circle-xmark']" class="w-4 h-4 mr-[5px]" />
          Cancel
        </button>
        <button
          @click="saveChanges"
          class="save-btn px-5 py-3 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'circle-check']" class="w-4 h-4 mr-[5px]" />
          Save changes
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
              class="w-4 h-4 text-red-500"
            />
            Delete account
          </h2>
          <p class="text-sm text-gray-500">
            This is permanent and will remove your profile and order history.
          </p>
        </div>
        <button
          @click="handleDelete"
          class="px-5 py-3 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'trash-can']" class="w-4 h-4" />
          Delete
        </button>
      </div>
    </section>
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
  padding: 6px;
  border: 1px solid #e7eaef;
  border-radius: 10px;
  background: #f7f9fb;
  margin-bottom: 10px;
}

input {
  padding: 10px;
  background: #f7f9fb;
  border-radius: 10px;
  border: 1px solid #e7eaef;
  margin-bottom: 10px;
}

.edit-btn {
  background: #0066ff;
  border: none;
  color: #ffffff;
  border-radius: 8px;
  font-size: medium;
}
.delete-section button {
  background: #e02424;
  padding: 10px;
  border: 1px solid #e6e9ee;
  border-radius: 6px;
  font-weight: 400;
  font-size: medium;
  color: #ffffff;
}

.upload-btns button {
  padding: 8px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
}
.actions-btns button {
  padding: 8px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
}
.upload-btn,
.save-btn {
  background: #0066ff;
}
.remove-btn,
.cancel-btn {
  background: #0f1724;
}
</style>
