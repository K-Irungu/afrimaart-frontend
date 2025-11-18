<script setup>
import { defineProps, computed, ref } from 'vue'

const props = defineProps({
  orders: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const searchQuery = ref('')
const statusFilter = ref('All')
const dateFilter = ref('Last 12 months')
const selectedOrder = ref(null)
const showOrderModal = ref(false)

// Safe data access functions
const getTotalItems = (order) => {
  if (!order.items || !Array.isArray(order.items)) return 0
  return order.items.reduce((total, item) => total + (item.quantity || 0), 0)
}

const getTotalAmount = (order) => {
  if (!order.total_amount) return 0
  
  const total = order.total_amount
  if (typeof total === 'object' && total.$numberDecimal) {
    return parseFloat(total.$numberDecimal)
  }
  return parseFloat(total) || 0
}

const getItemPrice = (item) => {
  if (!item.price_at_purchase) return 0
  
  const price = item.price_at_purchase
  if (typeof price === 'object' && price.$numberDecimal) {
    return parseFloat(price.$numberDecimal)
  }
  return parseFloat(price) || 0
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getProductNames = (order) => {
  if (!order.items || !Array.isArray(order.items)) return 'No items'
  
  const names = order.items.map(item => {
    if (item.product && typeof item.product === 'object') {
      return item.product.name || 'Unknown Product'
    }
    return 'Unknown Product'
  })
  
  return names.length > 0 ? names.join(', ') : 'No products'
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

const formatStatus = (status) => {
  const statusMap = {
    'Pending': 'Pending',
    'Processing': 'Processing',
    'Shipped': 'Shipped',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}

// Filter orders based on search and filters
const filteredOrders = computed(() => {
  let filtered = props.orders || []

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => {
      const orderIdMatch = order._id?.toLowerCase().includes(query)
      const productNameMatch = getProductNames(order).toLowerCase().includes(query)
      return orderIdMatch || productNameMatch
    })
  }

  // Status filter
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // Date filter
  if (dateFilter.value !== 'All time') {
    const now = new Date()
    let cutoffDate = new Date()
    
    if (dateFilter.value === 'Last 12 months') {
      cutoffDate.setMonth(now.getMonth() - 12)
    } else if (dateFilter.value === 'Last 6 months') {
      cutoffDate.setMonth(now.getMonth() - 6)
    }
    
    filtered = filtered.filter(order => {
      if (!order.createdAt) return false
      return new Date(order.createdAt) >= cutoffDate
    })
  }

  return filtered
})

// Handle view order details
const handleViewOrder = (order) => {
  // If clicking the same order, toggle the modal
  if (selectedOrder.value && selectedOrder.value._id === order._id) {
    showOrderModal.value = !showOrderModal.value
  } else {
    selectedOrder.value = order
    showOrderModal.value = true
  }
}

// Close modal
const closeModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6">
      <div class="animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <section v-if="!loading" class="filters bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-bold mb-4">Filters</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
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
          <option value="Processing">Processing</option>
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
    <section v-if="!loading" class="order-history bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-bold">Order History</h2>
        <div class="text-sm text-gray-600">
          {{ filteredOrders.length }} order{{ filteredOrders.length !== 1 ? 's' : '' }} found
        </div>
      </div>

      <!-- No Orders State -->
      <div v-if="orders.length === 0" class="text-center py-12">
        <div class="text-gray-500 text-lg mb-2">No orders yet</div>
        <div class="text-gray-400 text-sm">Your orders will appear here once you make a purchase.</div>
      </div>

      <!-- Orders Table -->
      <div v-else-if="filteredOrders.length > 0" class="overflow-x-auto">
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
            <template v-for="order in filteredOrders" :key="order._id">
              <!-- Order Row -->
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <!-- Order Number -->
                <td class="py-4 px-4">
                  <div class="font-semibold text-gray-800">
                    #{{ order._id ? order._id.slice(-8).toUpperCase() : 'N/A' }}
                  </div>
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
                    class="view-details-btn text-sm font-medium text-[white] px-[10px] py-[8px] rounded-[10px] transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    @click="handleViewOrder(order)"
                  >
                    {{ selectedOrder && selectedOrder._id === order._id && showOrderModal ? 'Hide details' : 'View details' }}
                  </button>
                </td>
              </tr>

              <!-- Order Details Modal - Inline below the row -->
              <tr v-if="selectedOrder && selectedOrder._id === order._id && showOrderModal">
                <td colspan="6" class="p-0">
                  <div class="order-details-modal bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-[20px] m-4 shadow-lg animate-slide-down">
                    <!-- Modal Header -->
                    <div class="bg-[#804D91] text-white p-[10px] rounded-t-lg">
                      <div class="flex justify-between items-start">
                        <div class="flex-1">
                          <div class="flex items-center space-x-3 mb-3">
                            <div class="flex justify-between items-center gap-[10px] w-full">
                              <h2 class="text-[2rem] font-[500]">Order Details</h2>
                              <p class="text-[#ffff] text-[1rem] bg-[#E8B6D5] p-[6px] rounded-[10px]">Order #{{ selectedOrder._id?.slice(-8).toUpperCase() }}</p>
                            </div> 
                          </div>
                          
                          <!-- Order Summary in Header -->
                          <div class="grid grid-cols-2 gap-3">
                            <div class="bg-white bg-opacity-10 rounded-[20px] p-2">
                              <p class="text-[#E8B6D5] text-xs">Order Date</p>
                              <p class="font-semibold text-sm">{{ formatDate(selectedOrder.createdAt) }}</p>
                            </div>
                            <div class="bg-white bg-opacity-10 rounded-lg p-2">
                              <p class="text-[#E8B6D5] text-xs">Total Amount</p>
                              <p class="font-semibold text-sm">${{ getTotalAmount(selectedOrder).toFixed(2) }}</p>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          @click="closeModal"
                          class="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ml-3"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                      
                      <!-- Status Badge -->
                      <div class="mt-3">
                        <span 
                          class="status-badge text-xs font-semibold px-3 py-1 rounded-full border border-white shadow"
                          :class="getStatusClass(selectedOrder.status)"
                        >
                          {{ formatStatus(selectedOrder.status) }}
                        </span>
                      </div>
                    </div>

                    <!-- Modal Content -->
                    <div class="p-[10px] space-y-6">
                      <!-- Order Items -->
                      <div>
                        <h3 class="text-[1.5rem] font-[500] text-[#5D3471] mb-[10px] flex items-center">
                          Order Items ({{ getTotalItems(selectedOrder) }})
                        </h3>
                        <div class="space-y-3">
                          <div 
                            v-for="(item, index) in selectedOrder.items" 
                            :key="index"
                            class="flex items-center gap-[10px] space-x-3 p-[6px] bg-white rounded-[10px] border border-gray-100 hover:border-[#E8B6D5] transition-all duration-200"
                          >
                            <div class="flex-shrink-0 w-12 h-12 bg-[#E8B6D5] rounded-[6px] flex items-center justify-center shadow p-[6px]">
                              <span class="text-white font-bold text-xs">{{ item.quantity || 1 }}x</span>
                            </div>
                            <div class="flex-1 min-w-0">
                              <h4 class="font-[480] text-gray-800 text-[1.2rem] truncate">
                                {{ item.product?.name || 'Unknown Product' }}
                              </h4>
                              <p class="text-xs text-gray-600">Quantity: {{ item.quantity || 1 }}</p>
                            </div>
                            <div class="text-right flex-shrink-0">
                              <p class="font-bold text-[#5D3471] text-md">
                                ${{ getItemPrice(item).toFixed(2) }}
                              </p>
                              <p class="text-xs text-gray-500">
                                ${{ (getItemPrice(item) * (item.quantity || 1)).toFixed(2) }} total
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Payment Summary -->
                      <div>
                        <h3 class="text-[1.5rem] font-[500] text-[#5D3471] my-[6px] flex items-center">
                          Payment Summary
                        </h3>
                        <div class="bg-white rounded-[20px] p-[10px] border border-gray-100">
                          <div class="space-y-2">
                            <div class="flex justify-between items-center py-1">
                              <span class="text-gray-600 text-sm font-[500]">Subtotal</span>
                              <span class="font-semibold text-sm">${{ getTotalAmount(selectedOrder).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                              <span class="text-gray-600 text-sm font-[500]">Shipping</span>
                              <span class="font-semibold text-green-600 text-sm">FREE</span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                              <span class="text-gray-600 text-sm font-[500]">Tax</span>
                              <span class="font-semibold text-sm">$0.00</span>
                            </div>
                            <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                              <span class="font-[500] text-[#5D3471]">Total</span>
                              <span class="font-[500] text-[#5D3471] text-lg">${{ getTotalAmount(selectedOrder).toFixed(2) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Shipping Information -->
                      <div v-if="selectedOrder.shipping_address">
                        <h3 class="text-[1.5rem] font-[500] text-[#5D3471] my-[6px] flex items-center">
                          Shipping Information
                        </h3>
                        <div class="bg-white rounded-[20px] p-[10px] border border-gray-100">
                          <div class="space-y-1">
                            <p class="font-[500] text-gray-800 text-sm">{{ selectedOrder.shipping_address.state_region }}</p>
                            <p class="text-gray-600 text-sm">{{ selectedOrder.shipping_address.city }}</p>
                            <p class="text-gray-600 text-sm">{{ selectedOrder.shipping_address.country }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="border-t border-gray-200 p-[8px] bg-gray-50 rounded-b-[20px]">
                      <div class="flex justify-end space-x-3">
                        <button
                          @click="closeModal"
                          class="px-[12px] py-[8px] bg-[#ce7f57] border border-[#5D3471] text-[#5D3471] rounded-[10px] hover:bg-[#5D3471] hover:text-[#ffff] transition-all duration-200 text-sm font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- No Results from Filtering -->
      <div v-else-if="orders.length > 0 && filteredOrders.length === 0" class="text-center py-12">
        <div class="text-gray-500">No orders match your filters</div>
        <button 
          @click="searchQuery = ''; statusFilter = 'All'; dateFilter = 'Last 12 months'"
          class="text-[#5D3471] hover:text-[#804D91] mt-2"
        >
          Clear filters
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

.view-details-btn {
  background: linear-gradient(135deg, #5D3471, #804D91);
  box-shadow: 0 2px 4px rgba(93, 52, 113, 0.2);
}

.view-details-btn:hover {
  background: linear-gradient(135deg, #804D91, #AA69AF);
  box-shadow: 0 4px 8px rgba(93, 52, 113, 0.3);
}

.status-badge {
  padding: 6px 12px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
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

/* Inline modal animations */
@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
  }
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out forwards;
}

.order-details-modal {
  overflow: hidden;
}
</style>