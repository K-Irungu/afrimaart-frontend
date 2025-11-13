<script setup>
import { defineProps } from 'vue'
import NotificationItem from './NotificationItem.vue'

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
})

const unreadNotifications = props.notifications.filter((notification) => notification.isUnread)
const readNotifications = props.notifications.filter((notification) => !notification.isUnread)
</script>

<template>
  <div class="notifications-container">
    <!-- Header -->
    <div class="header flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Notifications</h2>
      <div class="flex items-center gap-[10px]">
        <span class="text-sm text-gray-500 px-[6px] py-[3px]">
          <font-awsome-icon :icon="['fas', 'envelope-open']" />
          {{ unreadNotifications.length }} unread
        </span>
        <button class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Mark all as read
        </button>
      </div>
    </div>

    <!-- Unread Notifications Section -->
    <section v-if="unreadNotifications.length > 0" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-6">Unread</h3>
      <div class="notification-grid space-y-4">
        <NotificationItem
          v-for="notification in unreadNotifications"
          :key="notification.id"
          :title="notification.title"
          :subtitle="notification.subtitle"
          :tag-text="notification.tagText"
          :time="notification.time"
          :is-unread="notification.isUnread"
        />
      </div>
    </section>

    <!-- Read Notifications Section -->
    <section v-if="readNotifications.length > 0">
      <h3 class="text-lg font-semibold text-gray-800 mb-6">Earlier</h3>
      <div class="notification-grid space-y-4">
        <NotificationItem
          v-for="notification in readNotifications"
          :key="notification.id"
          :title="notification.title"
          :subtitle="notification.subtitle"
          :tag-text="notification.tagText"
          :time="notification.time"
          :is-unread="notification.isUnread"
        />
      </div>
    </section>

    <!-- Empty State -->
    <div v-if="notifications.length === 0" class="text-center py-16">
      <div class="text-gray-400 mb-6">
        <font-awesome-icon :icon="['fas', 'bell']" class="w-16 h-16 mx-auto" />
      </div>
      <h3 class="text-xl font-semibold text-gray-600 mb-3">No notifications</h3>
      <p class="text-gray-500 text-lg">You're all caught up! Check back later for updates.</p>
    </div>
  </div>
</template>

<style scoped>
.notifications-container {
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(128, 77, 145, 0.15);
  border: 1px solid #e8b6d5;
}

.notification-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #5d3471;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #804d91;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8b6d5;
}

.header span {
  border-radius: 5px;
  background: #5d3471;
  color: white;
}

button {
  background: #804d91;
  border-radius: 8px;
  border: none;
  padding: 8px 16px;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #ffffff;
}

button:hover {
  background: #aa69af;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(170, 105, 175, 0.3);
}

/* Section spacing */
section {
  padding: 20px 0;
}

section:not(:last-child) {
  border-bottom: 2px solid #e8b6d5;
  margin-bottom: 24px;
}

/* Empty state styling */
.text-center {
  padding: 60px 20px;
}

.text-center h3 {
  border-bottom: none;
  margin-bottom: 12px;
  color: #5d3471;
}

.text-center p {
  color: #804d91;
}

/* Responsive design */
@media (max-width: 768px) {
  .notifications-container {
    padding: 24px 16px;
  }

  .flex.justify-between {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  h2 {
    font-size: 1.5rem;
    color: #5d3471;
  }

  h3 {
    font-size: 1.125rem;
    color: #804d91;
  }
}
</style>
