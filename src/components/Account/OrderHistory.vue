<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
})

const getStatusClass = (status) => {
  switch (status) {
    case 'Shipped':
      return 'bg-[#CE7F57] text-white border-[#CE7F57]'
    case 'Preparing':
      return 'bg-[#AA69AF] text-white border-[#AA69AF]'
    case 'Delivered':
      return 'bg-[#804D91] text-white border-[#804D91]'
    case 'Returned':
      return 'bg-[#5D3471] text-white border-[#5D3471]'
    default:
      return 'bg-[#E8B6D5] text-[#5D3471] border-[#E8B6D5]'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Filter Section -->
    <section class="filters bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-bold mb-4">Filters</h2>
      <div class="grid grid-cols-3 sm:grid-cols-3 gap-[8px]">
        <input
          type="text"
          placeholder="Search orders, # or item"
          class="filter-input p-2 border border-gray-300 rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]"
        />

        <select
          class="filter-select p-2 border border-gray-300 rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]"
        >
          <option>Status: All</option>
          <option>Shipped</option>
          <option>Preparing</option>
          <option>Delivered</option>
          <option>Returned</option>
        </select>

        <select
          class="filter-select p-2 border border-gray-300 rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]"
        >
          <option>Placed: Last 12 months</option>
          <option>Last 6 months</option>
          <option>All time</option>
        </select>
      </div>
    </section>

    <!-- Order History Section -->
    <section class="order-history bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-bold mb-6">Order History</h2>

      <!-- Table Container -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <!-- Table Header -->
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700 py-[6px]">Order #</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 py-[6px]">Date</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 py-[6px]">Items</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 py-[6px]">Total</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 py-[6px]">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700 py-[6px]">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
              class="border-b border-gray-100 hover:bg-[#E8B6D5] transition-colors"
            >
              <!-- Order Number -->
              <td class="py-4 px-4">
                <div class="font-semibold text-gray-800">#{{ order.id }}</div>
              </td>

              <!-- Date -->
              <td class="py-4 px-4">
                <div class="text-sm text-gray-600">{{ order.date }}</div>
              </td>

              <!-- Items -->
              <td class="py-4 px-4">
                <div class="text-sm text-gray-600">
                  {{ order.items }} item{{ order.items !== 1 ? 's' : '' }}
                </div>
              </td>

              <!-- Total -->
              <td class="py-4 px-4">
                <div class="font-semibold text-gray-800">${{ order.total.toFixed(2) }}</div>
              </td>

              <!-- Status -->
              <td class="status py-4 px-4">
                <span
                  class="status-badge text-xs font-semibold px-3 py-1 rounded-full border"
                  :class="getStatusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </td>

              <!-- Actions -->
              <td class="actions-btns py-4 px-4">
                <div class="flex items-center space-x-2 gap-[5px]">
                  <button
                    class="text-sm font-medium text-gray-700 px-3 py-1 rounded-lg border hover:bg-[#E8B6D5] transition-colors"
                  >
                    {{ order.status === 'Delivered' ? 'Invoice' : 'View details' }}
                  </button>

                  <button
                    class="text-sm font-medium text-white px-3 py-1 rounded-lg border border-[#804D91] bg-[#804D91] hover:bg-[#AA69AF] transition-colors"
                  >
                    {{ order.status === 'Returned' ? 'Support' : 'Track' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagintion flex justify-center pt-6 space-x-3 gap-[5px] mt-[10px]">
        <button
          class="text-sm font-medium text-white px-4 py-2 rounded-lg border bg-[#5D3471] hover:bg-[#AA69AF] transition-colors p-[6px]"
        >
          &laquo; Previous
        </button>
        <button
          class="text-sm font-medium text-white px-4 py-2 rounded-lg border bg-[#5D3471] hover:bg-[#AA69AF] transition-colors p-[6px]"
        >
          Next &raquo;
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.filters,
.order-history {
  background: #ffffff;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.filter-input,
.filter-select {
  padding: 6px;
  height: 40px;
  border: 1px solid #e7eaef;
  border-radius: 10px;
  background: #f7f9fb;
  margin-bottom: 10px;
}

.order-history table {
  border-collapse: separate;
  border-spacing: 0;
}

.order-history th {
  background: #fcecff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 0.25em;
}

.order-history td {
  border-bottom: 1px solid #f1f5f9;
  padding: 10px;
}

.actions-btns button {
  padding: 6px;
  border-radius: 10px;
}

.status-badge {
  padding: 6px 12px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.pagintion button {
  border-radius: 10px;
  color: #ffffff;
}

/* Status colors */
.status-badge.bg-\[\#CE7F57\] {
  background-color: #ce7f57 !important;
  border-color: #ce7f57 !important;
}

.status-badge.bg-\[\#AA69AF\] {
  background-color: #aa69af !important;
  border-color: #aa69af !important;
}

.status-badge.bg-\[\#804D91\] {
  background-color: #804d91 !important;
  border-color: #804d91 !important;
}

.status-badge.bg-\[\#5D3471\] {
  background-color: #5d3471 !important;
  border-color: #5d3471 !important;
}

.order-history tr:last-child td {
  border-bottom: none;
}
</style>
