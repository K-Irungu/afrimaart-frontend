<script setup>
import { ref, onMounted, computed } from 'vue';
import Navbar from '../Navbar.vue';

// API base URL - adjust according to your backend
const API_BASE = 'http://localhost:5050';

// Reactive data
const orders = ref([]);
const loading = ref(false);
const error = ref(null);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

// Modal States
const showViewModal = ref(false);
const showEditModal = ref(false);
const selectedOrder = ref(null);

// Form State for editing status
const statusForm = ref({
  status: ''
});

// Computed properties for pagination
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return orders.value.slice(start, end);
});

const pageInfo = computed(() => {
  const start = ((currentPage.value - 1) * itemsPerPage.value) + 1;
  const end = Math.min(currentPage.value * itemsPerPage.value, totalItems.value);
  return `Showing ${start}-${end} of ${totalItems.value} orders`;
});

// Fetch orders from API
async function fetchOrders() {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    orders.value = data;
    totalItems.value = data.length;
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
}

// Update order status
async function updateOrderStatus() {
  if (!selectedOrder.value) return;

  try {
    const response = await fetch(`${API_BASE}/orders/${selectedOrder.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: statusForm.value.status
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    const updatedOrder = await response.json();

    // Update the order in the local state
    const index = orders.value.findIndex(o => o._id === selectedOrder.value._id);
    if (index !== -1) {
      orders.value[index] = updatedOrder;
    }

    closeModals();
  } catch (err) {
    error.value = err.message;
    console.error('Error updating order:', err);
  }
}

// Pagination functions
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function goToPage(page) {
  currentPage.value = page;
}

// Generate page numbers for pagination
const pageNumbers = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Open View Modal
function openViewModal(order) {
  selectedOrder.value = order;
  showViewModal.value = true;
}

// Open Edit Modal
function openEditModal(order) {
  selectedOrder.value = order;
  statusForm.value.status = order.status;
  showEditModal.value = true;
}

// Close Modals
function closeModals() {
  showViewModal.value = false;
  showEditModal.value = false;
  selectedOrder.value = null;
  statusForm.value.status = '';
}

// Get Status Badge Class
function getStatusClass(status) {
  const statusClasses = {
    'Pending': 'status-badge pending',
    'Processing': 'status-badge processing',
    'Shipped': 'status-badge shipped',
    'Delivered': 'status-badge delivered',
    'Cancelled': 'status-badge cancelled'
  };
  return statusClasses[status] || 'status-badge pending';
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format currency - Updated to display Ksh
function formatCurrency(amount) {
  // Handle Decimal128 from MongoDB
  if (amount && typeof amount === 'object' && amount.$numberDecimal) {
    amount = parseFloat(amount.$numberDecimal);
  }
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format price at purchase (handles Decimal128)
function formatPrice(price) {
  if (price && typeof price === 'object' && price.$numberDecimal) {
    return parseFloat(price.$numberDecimal);
  }
  return price;
}

// Calculate item subtotal
function calculateSubtotal(item) {
  const price = formatPrice(item.price_at_purchase);
  return price * item.quantity;
}

// Calculate total amount (handles Decimal128)
function getTotalAmount(order) {
  if (order.total_amount && typeof order.total_amount === 'object' && order.total_amount.$numberDecimal) {
    return parseFloat(order.total_amount.$numberDecimal);
  }
  return order.total_amount;
}

// Safe access for nested properties
function safeGet(obj, path, defaultValue = 'N/A') {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
}

// Refresh orders
function refreshOrders() {
  currentPage.value = 1; // Reset to first page when refreshing
  fetchOrders();
}

// Fetch orders when component mounts
onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="order-container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p class="text-sm text-gray-600 mt-1">Manage and track customer orders</p>
        </div>
        <div class="flex items-center gap-[6px]">
          <div class="text-[1rem] text-gray-600">
            Total Orders: {{ totalItems }}
          </div>
          <button
            @click="refreshOrders"
            class="refresh-btn"
            :disabled="loading"
          >
            <font-awesome-icon
              :icon="['fas', 'rotate']"
              class="w-4 h-4"
              :class="{ 'animate-spin': loading }"
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="w-5 h-5" />
        <span>{{ error }}</span>
        <button @click="fetchOrders" class="retry-btn">Retry</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <font-awesome-icon :icon="['fas', 'spinner']" class="w-8 h-8 animate-spin" />
        <p>Loading orders...</p>
      </div>

      <!-- Orders Table -->
      <div v-else class="table-section">
        <!-- Page Info -->
        <div class="page-info">
          {{ pageInfo }}
        </div>

        <div class="table-container">
          <table class="orders-table">
            <thead class="table-header">
              <tr>
                <th scope="col" class="table-head rounded-tl-2xl">
                  Order ID
                </th>
                <th scope="col" class="table-head">
                  Customer
                </th>
                <th scope="col" class="table-head">
                  Total Amount
                </th>
                <th scope="col" class="table-head">
                  Shipping Address
                </th>
                <th scope="col" class="table-head">
                  Payment Method
                </th>
                <th scope="col" class="table-head">
                  Status
                </th>
                <th scope="col" class="table-head">
                  Date
                </th>
                <th scope="col" class="table-head rounded-tr-2xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in paginatedOrders"
                :key="order._id"
                class="table-row"
              >
                <td class="table-cell font-mono text-sm text-gray-600">
                  #{{ order._id ? order._id.slice(-6).toUpperCase() : 'N/A' }}
                </td>
                <td class="table-cell">
                  <div class="customer-info">
                    <p class="font-semibold text-gray-900">{{ safeGet(order, 'user.username') }}</p>
                    <p class="text-sm text-gray-500">{{ safeGet(order, 'user.email') }}</p>
                  </div>
                </td>
                <td class="table-cell font-bold text-green-600">
                  {{ formatCurrency(getTotalAmount(order)) }}
                </td>
                <td class="table-cell">
                  <div class="address-info">
                    <p class="text-sm font-medium text-gray-900">
                      {{ safeGet(order, 'shipping_address.city') }}, {{ safeGet(order, 'shipping_address.state_region') }}
                    </p>
                    <p class="text-xs text-gray-500 truncate max-w-[150px]">
                      {{ safeGet(order, 'shipping_address.address_line_1') }}
                    </p>
                  </div>
                </td>
                <td class="table-cell">
                  <div class="payment-info">
                    <p class="text-sm font-medium text-gray-900">{{ safeGet(order, 'payment_details.type') }}</p>
                    <p v-if="safeGet(order, 'payment_details.last4') !== 'N/A'" class="text-xs text-gray-500">
                      **** {{ safeGet(order, 'payment_details.last4') }}
                    </p>
                  </div>
                </td>
                <td class="table-cell">
                  <span :class="getStatusClass(order.status)">
                    {{ order.status || 'Pending' }}
                  </span>
                </td>
                <td class="table-cell text-sm text-gray-600">
                  {{ order.createdAt ? formatDate(order.createdAt) : 'N/A' }}
                </td>
                <td class="table-cell">
                  <div class="action-buttons">
                    <!-- View -->
                    <button
                      @click="openViewModal(order)"
                      class="action-btn view-btn"
                      :disabled="loading"
                    >
                      <font-awesome-icon :icon="['fas', 'eye']" class="w-4 h-4" />
                      <span>View</span>
                    </button>

                    <!-- Edit -->
                    <button
                      @click="openEditModal(order)"
                      class="action-btn edit-btn"
                      :disabled="loading"
                    >
                      <font-awesome-icon :icon="['fas', 'edit']" class="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="orders.length === 0 && !loading" class="empty-state">
            <font-awesome-icon :icon="['fas', 'box-open']" class="w-16 h-16 text-gray-400" />
            <h3 class="empty-title">No Orders Found</h3>
            <p class="empty-description">There are no orders to display at the moment.</p>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="orders.length > 0" class="pagination-controls">
          <div class="pagination-info">
            {{ pageInfo }}
          </div>

          <div class="pagination-buttons">
            <!-- Previous Button -->
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="pagination-btn pagination-prev"
            >
              <font-awesome-icon :icon="['fas', 'chevron-left']" class="w-4 h-4" />
              <span>Previous</span>
            </button>

            <!-- Page Numbers -->
            <div class="page-numbers">
              <button
                v-for="page in pageNumbers"
                :key="page"
                @click="goToPage(page)"
                :class="['page-btn', { active: currentPage === page }]"
              >
                {{ page }}
              </button>

              <!-- Ellipsis for many pages -->
              <span v-if="pageNumbers[pageNumbers.length - 1] < totalPages" class="page-ellipsis">
                ...
              </span>
            </div>

            <!-- Next Button -->
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn pagination-next"
            >
              <span>Next</span>
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="w-4 h-4" />
            </button>
          </div>

          <!-- Items Per Page Selector -->
          <div class="items-per-page">
            <label for="itemsPerPage" class="items-per-page-label">Show:</label>
            <select
              id="itemsPerPage"
              v-model="itemsPerPage"
              class="items-per-page-select"
              @change="currentPage = 1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div
        v-if="showViewModal && selectedOrder"
        class="modal-overlay"
      >
        <div class="modal-container view-modal">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">Order Details - #{{ selectedOrder._id ? selectedOrder._id.slice(-6).toUpperCase() : 'N/A' }}</h2>
            <button
              @click="closeModals"
              class="close-btn"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="w-6 h-6" />
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Order Summary -->
            <div class="order-summary">
              <div class="summary-grid">
                <div class="summary-item">
                  <p class="summary-label">Customer</p>
                  <p class="summary-value">{{ safeGet(selectedOrder, 'user.username') }}</p>
                  <p class="summary-subtext">{{ safeGet(selectedOrder, 'user.email') }}</p>
                </div>
                <div class="summary-item">
                  <p class="summary-label">Order Date</p>
                  <p class="summary-value">{{ selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : 'N/A' }}</p>
                </div>
                <div class="summary-item">
                  <p class="summary-label">Total Amount</p>
                  <p class="summary-value price">{{ formatCurrency(getTotalAmount(selectedOrder)) }}</p>
                </div>
                <div class="summary-item">
                  <p class="summary-label">Status</p>
                  <span :class="getStatusClass(selectedOrder.status)" class="text-sm">
                    {{ selectedOrder.status || 'Pending' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Shipping & Payment -->
            <div class="details-grid">
              <div class="detail-section">
                <h3 class="section-title">Shipping Address</h3>
                <div class="address-card">
                  <p class="address-line">{{ safeGet(selectedOrder, 'shipping_address.address_line_1') }}</p>
                  <p v-if="safeGet(selectedOrder, 'shipping_address.address_line_2') !== 'N/A'" class="address-line">
                    {{ safeGet(selectedOrder, 'shipping_address.address_line_2') }}
                  </p>
                  <p class="address-line">
                    {{ safeGet(selectedOrder, 'shipping_address.city') }},
                    {{ safeGet(selectedOrder, 'shipping_address.state_region') }}
                    {{ safeGet(selectedOrder, 'shipping_address.postal_code') }}
                  </p>
                  <p class="address-line">{{ safeGet(selectedOrder, 'shipping_address.country') }}</p>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">Payment Information</h3>
                <div class="payment-card">
                  <p class="payment-method">{{ safeGet(selectedOrder, 'payment_details.type') }}</p>
                  <p v-if="safeGet(selectedOrder, 'payment_details.last4') !== 'N/A'" class="payment-details">
                    **** {{ safeGet(selectedOrder, 'payment_details.last4') }}
                    ({{ safeGet(selectedOrder, 'payment_details.brand') }})
                  </p>
                  <p v-if="safeGet(selectedOrder, 'payment_details.email') !== 'N/A'" class="payment-details">
                    {{ safeGet(selectedOrder, 'payment_details.email') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="order-items-section">
              <h3 class="section-title">Order Items ({{ selectedOrder.items ? selectedOrder.items.length : 0 }})</h3>
              <div class="items-container">
                <div
                  v-for="item in selectedOrder.items"
                  :key="item.product?._id || item._id"
                  class="order-item"
                >
                  <img
                    :src="safeGet(item, 'product.product_image_url', 'https://via.placeholder.com/60x60?text=No+Image')"
                    :alt="safeGet(item, 'product.name')"
                    class="item-image"
                  >
                  <div class="item-details">
                    <p class="item-name">{{ safeGet(item, 'product.name') }}</p>
                    <p class="item-quantity">Quantity: {{ item.quantity }}</p>
                  </div>
                  <div class="item-price">
                    <p class="price">{{ formatCurrency(formatPrice(item.price_at_purchase)) }}</p>
                    <p class="subtotal">Subtotal: {{ formatCurrency(calculateSubtotal(item)) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Button -->
          <div class="modal-footer">
            <button
              @click="closeModals"
              class="close-details-btn"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Status Modal -->
      <div v-if="showEditModal && selectedOrder" class="modal-overlay">
        <div class="modal-container form-modal">
          <div class="modal-header">
            <div class="flex justify-between items-center">
              <h2 class="modal-title">
                Update Order Status
              </h2>
              <button
                @click="closeModals"
                class="close-btn"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="w-6 h-6" />
              </button>
            </div>
          </div>

          <form @submit.prevent="updateOrderStatus" class="form-content">
            <div class="form-group">
              <label class="form-label">Order Status</label>
              <select
                v-model="statusForm.status"
                class="form-input"
                required
                :disabled="loading"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <p class="text-sm text-gray-500 mt-2">
                Current status: <span :class="getStatusClass(selectedOrder.status)" class="text-sm">{{ selectedOrder.status || 'Pending' }}</span>
              </p>
            </div>

            <!-- Form Buttons -->
            <div class="form-buttons">
              <button
                type="button"
                @click="closeModals"
                class="cancel-btn"
                :disabled="loading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="submit-btn"
                :disabled="loading"
              >
                <font-awesome-icon
                  :icon="['fas', 'check']"
                  class="w-4 h-4"
                  :class="{ 'animate-spin': loading }"
                />
                <span>{{ loading ? 'Updating...' : 'Update Status' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-container {
  width: 90%;
  margin: 0 auto;
}

/* Refresh Button */
.refresh-btn {
  background: #5d3471;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.refresh-btn:hover:not(:disabled) {
  background: #4a2960;
  transform: scale(1.05);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-left: auto;
  border: none;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1.125rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #6b7280;
}

/* Table Styles */
.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.3s ease;
  overflow: hidden;
}

.table-container:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.table-header {
  background: #ba9ff9;
}

.table-head {
  padding: 20px 24px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #5d3471;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.table-cell {
  padding: 20px 24px;
  vertical-align: middle;
}

/* Status Badges */
.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.shipped {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.delivered {
  background: #dcfce7;
  color: #166534;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.view-btn {
  background: #4b5563;
  color: white;
}

.view-btn:hover:not(:disabled) {
  background: #374151;
  transform: scale(1.05);
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: scale(1.05);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 50;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.view-modal {
  width: 90%;
  max-width: 1000px;
}

.form-modal {
  width: 90%;
  max-width: 500px;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: between;
  align-items: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  color: #6b7280;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  background: none;
}

.close-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

/* View Modal Content */
.modal-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-summary {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.summary-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.summary-value.price {
  color: #059669;
}

.summary-subtext {
  font-size: 0.875rem;
  color: #6b7280;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.address-card,
.payment-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.address-line {
  margin-bottom: 4px;
  color: #374151;
}

.payment-method {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.payment-details {
  color: #6b7280;
  font-size: 0.875rem;
}

.order-items-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.item-quantity {
  color: #6b7280;
  font-size: 0.875rem;
}

.item-price {
  text-align: right;
}

.item-price .price {
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
}

.item-price .subtotal {
  color: #6b7280;
  font-size: 0.875rem;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.close-details-btn {
  width: 100%;
  background: #5d3471;
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-details-btn:hover {
  background: #4a2960;
  transform: scale(1.02);
}

/* Form Styles */
.form-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.form-input {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #5d3471;
  box-shadow: 0 0 0 3px rgba(93, 52, 113, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 16px 24px;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  color: #374151;
  font-weight: 600;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: scale(1.05);
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn {
  padding: 16px 24px;
  background: #5d3471;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #4a2960;
  transform: scale(1.05);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Custom scrollbar */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}


/* pagination */
.order-container {
  width: 90%;
  margin: 0 auto;
}

/* Table Section */
.table-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
}

.page-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.page-btn.active {
  background: #5d3471;
  color: white;
  border-color: #5d3471;
}

.page-ellipsis {
  padding: 0.5rem 0.25rem;
  color: #6b7280;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-per-page-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.items-per-page-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
}

.items-per-page-select:focus {
  outline: none;
  border-color: #5d3471;
  box-shadow: 0 0 0 2px rgba(93, 52, 113, 0.1);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Animation for spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .pagination-buttons {
    justify-content: center;
  }

  .items-per-page {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .page-numbers {
    display: none;
  }

  .pagination-btn span {
    display: none;
  }

  .pagination-btn {
    padding: 0.5rem;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
