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
      return 'bg-[#ffb020] text-white border-[#ffb020]'
    case 'Preparing':
      return 'bg-[#f97316] text-white border-[#f97316]'
    case 'Delivered':
      return 'bg-[#16a34a] text-white border-[#16a34a]'
    case 'Returned':
      return 'bg-[#e02424] text-white border-[#e02424]'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
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
          class="filter-input p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />

        <select
          class="filter-select p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option>Status: All</option>
          <option>Shipped</option>
          <option>Preparing</option>
          <option>Delivered</option>
          <option>Returned</option>
        </select>

        <select
          class="filter-select p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                    class="text-sm font-medium text-gray-700 px-3 py-1 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    {{ order.status === 'Delivered' ? 'Invoice' : 'View details' }}
                  </button>

                  <button
                    class="text-sm font-medium text-indigo-600 px-3 py-1 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
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
          class="text-sm font-medium text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-100 transition-colors p-[6px]"
        >
          &laquo; Previous
        </button>
        <button
          class="text-sm font-medium text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-100 transition-colors p-[6px]"
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
  background: #f8fafc;
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
  background: #0066ff;
  color: #ffffff;
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
  background: #0f1724;
  color: #ffffff;
}

/* Specific status colors */
.status-badge.bg-\[\#ffb020\] {
  background-color: #ffb020 !important;
  border-color: #ffb020 !important;
}

.status-badge.bg-\[\#f97316\] {
  background-color: #f97316 !important;
  border-color: #f97316 !important;
}

.status-badge.bg-\[\#16a34a\] {
  background-color: #16a34a !important;
  border-color: #16a34a !important;
}

.status-badge.bg-\[\#e02424\] {
  background-color: #e02424 !important;
  border-color: #e02424 !important;
}

.order-history tr:last-child td {
  border-bottom: none;
}
</style>
