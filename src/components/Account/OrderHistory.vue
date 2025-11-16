<script setup>
import { defineProps, computed, ref } from 'vue'

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
})

const searchQuery = ref('')
const statusFilter = ref('All')
const dateFilter = ref('Last 12 months')

// Filter orders based on search and filters
const filteredOrders = computed(() => {
  let filtered = props.orders

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order._id.toLowerCase().includes(query) ||
      order.items.some(item => 
        item.product?.name?.toLowerCase().includes(query)
      )
    )
  }

  // Status filter
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // Date filter (simplified - you can enhance this)
  if (dateFilter.value !== 'All time') {
    const now = new Date()
    let cutoffDate = new Date()
    
    if (dateFilter.value === 'Last 12 months') {
      cutoffDate.setMonth(now.getMonth() - 12)
    } else if (dateFilter.value === 'Last 6 months') {
      cutoffDate.setMonth(now.getMonth() - 6)
    }
    
    filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate)
  }

  return filtered
})

// Calculate total items in an order
const getTotalItems = (order) => {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}

// Calculate total amount (convert Decimal128 to number)
const getTotalAmount = (order) => {
  const total = order.total_amount
  if (typeof total === 'object' && total.$numberDecimal) {
    return parseFloat(total.$numberDecimal)
  }
  return parseFloat(total) || 0
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get product names (for search functionality)
const getProductNames = (order) => {
  return order.items.map(item => item.product?.name || 'Unknown Product').join(', ')
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Shipped':
      return 'bg-[#CE7F57] text-white border-[#CE7F57]'
    case 'Processing':
      return 'bg-[#AA69AF] text-white border-[#AA69AF]'
    case 'Delivered':
      return 'bg-[#804D91] text-white border-[#804D91]'
    case 'Cancelled':
      return 'bg-[#5D3471] text-white border-[#5D3471]'
    case 'Pending':
      return 'bg-[#E8B6D5] text-[#5D3471] border-[#E8B6D5]'
    default:
      return 'bg-[#E8B6D5] text-[#5D3471] border-[#E8B6D5]'
  }
}

// Format status for display
const formatStatus = (status) => {
  const statusMap = {
    'Pending': 'Pending',
    'Processing': 'Preparing',
    'Shipped': 'Shipped',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}
</script>

<template>
  <div class="space-y-6">
    <!-- Filter Section -->
    <section class="filters bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-bold mb-4">Filters</h2>
      <div class="grid grid-cols-3 sm:grid-cols-3 gap-[15px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search orders, # or item"
          class="filter-input p-3 border border-gray-300 rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]"
        />

        <select
          v-model="statusFilter"
          class="filter-select p-3 border border-gray-300 rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]"
        >
          <option value="All">Status: All</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Preparing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          v-model="dateFilter"
          class="filter-select p-3 border border-gray-300 rounded-lg focus:ring-[#5D3471] focus:border-[#5D3471]"
        >
          <option value="Last 12 months">Placed: Last 12 months</option>
          <option value="Last 6 months">Last 6 months</option>
          <option value="All time">All time</option>
        </select>
      </div>
    </section>

    <!-- Order History Section -->
    <section class="order-history bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-bold">Order History</h2>
        <div class="text-sm text-gray-600">
          {{ filteredOrders.length }} order{{ filteredOrders.length !== 1 ? 's' : '' }} found
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="orders.length === 0" class="text-center py-12">
        <div class="text-gray-500">No orders found</div>
      </div>

      <!-- Orders Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <!-- Table Header -->
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Order #</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order._id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <!-- Order Number -->
              <td class="py-4 px-4">
                <div class="font-semibold text-gray-800">#{{ order._id.slice(-8).toUpperCase() }}</div>
              </td>

              <!-- Date -->
              <td class="py-4 px-4">
                <div class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</div>
              </td>

              <!-- Items -->
              <td class="py-4 px-4">
                <div class="text-sm text-gray-600">
                  {{ getTotalItems(order) }} item{{ getTotalItems(order) !== 1 ? 's' : '' }}
                </div>
                <div class="text-xs text-gray-500 truncate max-w-[150px]" :title="getProductNames(order)">
                  {{ getProductNames(order) }}
                </div>
              </td>

              <!-- Total -->
              <td class="py-4 px-4">
                <div class="font-semibold text-gray-800">${{ getTotalAmount(order).toFixed(2) }}</div>
              </td>

              <!-- Status -->
              <td class="py-4 px-4">
                <span
                  class="status-badge text-xs font-semibold px-3 py-1 rounded-full border"
                  :class="getStatusClass(order.status)"
                >
                  {{ formatStatus(order.status) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-4 px-4">
                <button
                  class="text-sm font-medium text-gray-700 px-3 py-1 rounded-lg border hover:bg-[#E8B6D5] transition-colors"
                  @click="$emit('view-order', order._id)"
                >
                  View details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Results -->
      <div v-if="orders.length > 0 && filteredOrders.length === 0" class="text-center py-12">
        <div class="text-gray-500">No orders match your filters</div>
      </div>

      <!-- Pagination (You can implement pagination logic later) -->
      <div class="pagination flex justify-center gap-[10p] pt-6 space-x-3 mt-4">
        <button
          class="text-sm font-medium text-white px-[10px] py-[6px] rounded-lg border bg-[#5D3471] hover:bg-[#AA69AF] transition-colors"
          disabled
        >
          &laquo; Previous
        </button>
        <button
          class="text-sm font-medium text-white px-[10px] py-[6px] rounded-lg border bg-[#5D3471] hover:bg-[#AA69AF] transition-colors"
          disabled
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
  padding: 12px;
  border: 1px solid #e7eaef;
  border-radius: 10px;
  background: #f7f9fb;
}

.order-history table {
  border-collapse: separate;
  border-spacing: 0;
}

.order-history th {
  background: #fcecff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.order-history td {
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 12px;
}

.actions-btn button {
  padding: 8px 12px;
  border: 1.5px solid #ce7f57;
  border-radius: 10px;
  background: #fbcaff;
  transition: all 0.3s ease-in-out;
}

.actions-btn button:hover {
  transform: translateY(-2px);
}

.status-badge {
  padding: 6px 12px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.pagination button {
  border-radius: 10px;
  color: #ffffff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:disabled:hover {
  background: #5D3471;
  transform: none;
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

.status-badge.bg-\[\#E8B6D5\] {
  background-color: #e8b6d5 !important;
  border-color: #e8b6d5 !important;
}

.order-history tr:last-child td {
  border-bottom: none;
}
</style>