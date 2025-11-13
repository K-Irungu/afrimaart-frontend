<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  tagText: {
    type: String,
    validator: (value) => ['New Deals', 'New Arrival', 'Order Status'].includes(value),
  },
  time: String,
  isUnread: {
    type: Boolean,
    default: false,
  },
})

// Get tag color based on tag text
const getTagColor = (tagText) => {
  switch (tagText) {
    case 'New Deals':
      return 'bg-[#ffb020] text-white border-[#ffb020]'
    case 'New Arrival':
      return 'bg-[#16a34a] text-white border-[#16a34a]'
    case 'Order Status':
      return 'bg-[#0f1724] text-white border-[#0f1724]'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

// Get tag icon based on tag text
const getTagIcon = (tagText) => {
  switch (tagText) {
    case 'New Deals':
      return ['fas', 'tag']
    case 'New Arrival':
      return ['fas', 'gift']
    case 'Order Status':
      return ['fas', 'truck']
    default:
      return ['fas', 'bell']
  }
}

// Get button style based on tag text
const getButtonStyle = (tagText) => {
  switch (tagText) {
    case 'New Deals':
      return 'bg-[#ffb020] text-white border-[#ffb020] hover:bg-[#e59a1a]'
    case 'New Arrival':
      return 'bg-[#16a34a] text-white border-[#16a34a] hover:bg-[#138835]'
    case 'Order Status':
      return 'bg-[#0f1724] text-white border-[#0f1724] hover:bg-[#1e293b]'
    default:
      return 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700'
  }
}
</script>

<template>
  <div
    :class="[
      isUnread ? 'bg-gray-50 border-l-4 shadow-sm' : 'bg-white border border-gray-200',
      'notification-item flex items-start p-[8px] rounded-lg transition duration-200 cursor-pointer',
    ]"
  >
    <!-- Notification Icon -->
    <div
      :class="[isUnread ? 'text-indigo-500' : 'text-gray-400', 'icon-container w-5 h-5 mr-3 mt-1']"
    >
      <font-awesome-icon v-if="isUnread" :icon="['fas', 'circle']" class="w-3 h-3" />
      <font-awesome-icon v-else :icon="['far', 'circle']" class="w-3 h-3" />
    </div>

    <!-- Notification Content -->
    <div class="content flex-1">
      <p :class="[isUnread ? 'font-semibold' : 'font-medium', 'title text-gray-900 text-base']">
        {{ title }}
      </p>
      <p :class="[isUnread ? 'text-gray-700' : 'text-gray-600', 'subtitle text-sm mt-1']">
        {{ subtitle }}
      </p>
    </div>

    <!-- Tag and Time -->
    <div class="meta flex flex-col items-end flex-shrink-0 ml-4 space-y-2">
      <span
        :class="[
          getTagColor(tagText),
          'tag px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1',
        ]"
      >
        <font-awesome-icon :icon="getTagIcon(tagText)" class="w-3 h-3" />
        {{ tagText }}
      </span>
      <span class="time text-xs text-gray-500">
        {{ time }}
      </span>

      <!-- Action Button -->
      <button
        v-if="isUnread"
        :class="[
          getButtonStyle(tagText),
          'action-btn text-xs font-medium px-3 py-2 rounded-lg border transition duration-150 flex items-center gap-1',
        ]"
      >
        <font-awesome-icon
          v-if="tagText === 'New Deals'"
          :icon="['fas', 'arrow-right']"
          class="w-3 h-3"
        />
        <font-awesome-icon
          v-else-if="tagText === 'New Arrival'"
          :icon="['fas', 'eye']"
          class="w-3 h-3"
        />
        <font-awesome-icon
          v-else-if="tagText === 'Order Status'"
          :icon="['fas', 'external-link']"
          class="w-3 h-3"
        />
        {{
          tagText === 'New Deals'
            ? 'View Deals'
            : tagText === 'New Arrival'
              ? 'Browse'
              : 'Track Order'
        }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.notification-item {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #e6e9ee;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-weight: 500;
  line-height: 1.4;
}

.subtitle {
  line-height: 1.4;
  opacity: 0.8;
}

.tag {
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.time {
  font-weight: 400;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
