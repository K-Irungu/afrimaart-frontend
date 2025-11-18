<script setup>
import { ref } from 'vue';
import Navbar from '../Navbar.vue';

// Mock orders data (replace with API calls later)
const orders = ref([
  {
    _id: '1',
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    items: [
      {
        product: {
          _id: 'prod1',
          name: 'Wireless Headphones',
          product_image_url: 'https://i.pinimg.com/736x/76/9d/84/769d8454f78dabe81ec54e51fea6d156.jpg'
        },
        quantity: 2,
        price_at_purchase: 128.00
      },
      {
        product: {
          _id: 'prod2',
          name: 'Smart Watch',
          product_image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
        },
        quantity: 1,
        price_at_purchase: 199.99
      }
    ],
    total_amount: 455.99,
    shipping_address: {
      _id: 'addr1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    payment_details: {
      _id: 'pay1',
      method: 'Credit Card',
      last4: '4242',
      brand: 'Visa'
    },
    status: 'Processing',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    user: {
      _id: 'user2',
      name: 'Sarah Smith',
      email: 'sarah@example.com'
    },
    items: [
      {
        product: {
          _id: 'prod3',
          name: 'Running Shoes',
          product_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
        },
        quantity: 1,
        price_at_purchase: 89.99
      }
    ],
    total_amount: 89.99,
    shipping_address: {
      _id: 'addr2',
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    payment_details: {
      _id: 'pay2',
      method: 'PayPal',
      email: 'sarah@example.com'
    },
    status: 'Pending',
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    _id: '3',
    user: {
      _id: 'user3',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    items: [
      {
        product: {
          _id: 'prod4',
          name: 'Coffee Maker',
          product_image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'
        },
        quantity: 1,
        price_at_purchase: 75.50
      }
    ],
    total_amount: 75.50,
    shipping_address: {
      _id: 'addr3',
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    payment_details: {
      _id: 'pay3',
      method: 'Credit Card',
      last4: '8888',
      brand: 'Mastercard'
    },
    status: 'Delivered',
    createdAt: '2024-01-13T09:15:00Z'
  }
]);

// Modal States
const showViewModal = ref(false);
const showEditModal = ref(false);
const selectedOrder = ref(null);

// Form State for editing status
const statusForm = ref({
  status: ''
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

// Update Order Status
function updateOrderStatus() {
  if (selectedOrder.value) {
    const index = orders.value.findIndex(o => o._id === selectedOrder.value._id);
    if (index !== -1) {
      orders.value[index].status = statusForm.value.status;
    }
  }
  closeModals();
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
    day: 'numeric'
  });
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="order-container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Orders Management</h1>
        <div class="text-sm text-gray-600">
          Total Orders: {{ orders.length }}
        </div>
      </div>

      <!-- Orders Table -->
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
              v-for="order in orders" 
              :key="order._id" 
              class="table-row"
            >
              <td class="table-cell font-mono text-sm text-gray-600">
                #{{ order._id.slice(-6).toUpperCase() }}
              </td>
              <td class="table-cell">
                <div class="customer-info">
                  <p class="font-semibold text-gray-900">{{ order.user.name }}</p>
                  <p class="text-sm text-gray-500">{{ order.user.email }}</p>
                </div>
              </td>
              <td class="table-cell font-bold text-green-600">
                {{ formatCurrency(order.total_amount) }}
              </td>
              <td class="table-cell">
                <div class="address-info">
                  <p class="text-sm font-medium text-gray-900">{{ order.shipping_address.city }}, {{ order.shipping_address.state }}</p>
                  <p class="text-xs text-gray-500 truncate max-w-[150px]">{{ order.shipping_address.street }}</p>
                </div>
              </td>
              <td class="table-cell">
                <div class="payment-info">
                  <p class="text-sm font-medium text-gray-900">{{ order.payment_details.method }}</p>
                  <p v-if="order.payment_details.last4" class="text-xs text-gray-500">
                    **** {{ order.payment_details.last4 }}
                  </p>
                </div>
              </td>
              <td class="table-cell">
                <span :class="getStatusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="table-cell text-sm text-gray-600">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="table-cell">
                <div class="action-buttons">
                  <!-- View -->
                  <button
                    @click="openViewModal(order)"
                    class="action-btn view-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" class="w-4 h-4" />
                    <span>View</span>
                  </button>

                  <!-- Edit -->
                  <button
                    @click="openEditModal(order)"
                    class="action-btn edit-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" class="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Details Modal -->
      <div
        v-if="showViewModal && selectedOrder"
        class="modal-overlay"
      >
        <div class="modal-container view-modal">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">Order Details - #{{ selectedOrder._id.slice(-6).toUpperCase() }}</h2>
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
                  <p class="summary-value">{{ selectedOrder.user.name }}</p>
                  <p class="summary-subtext">{{ selectedOrder.user.email }}</p>
                </div>
                <div class="summary-item">
                  <p class="summary-label">Order Date</p>
                  <p class="summary-value">{{ formatDate(selectedOrder.createdAt) }}</p>
                </div>
                <div class="summary-item">
                  <p class="summary-label">Total Amount</p>
                  <p class="summary-value price">{{ formatCurrency(selectedOrder.total_amount) }}</p>
                </div>
                <div class="summary-item">
                  <p class="summary-label">Status</p>
                  <span :class="getStatusClass(selectedOrder.status)" class="text-sm">
                    {{ selectedOrder.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Shipping & Payment -->
            <div class="details-grid">
              <div class="detail-section">
                <h3 class="section-title">Shipping Address</h3>
                <div class="address-card">
                  <p class="address-line">{{ selectedOrder.shipping_address.street }}</p>
                  <p class="address-line">{{ selectedOrder.shipping_address.city }}, {{ selectedOrder.shipping_address.state }} {{ selectedOrder.shipping_address.zipCode }}</p>
                  <p class="address-line">{{ selectedOrder.shipping_address.country }}</p>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">Payment Information</h3>
                <div class="payment-card">
                  <p class="payment-method">{{ selectedOrder.payment_details.method }}</p>
                  <p v-if="selectedOrder.payment_details.last4" class="payment-details">
                    **** {{ selectedOrder.payment_details.last4 }} ({{ selectedOrder.payment_details.brand }})
                  </p>
                  <p v-if="selectedOrder.payment_details.email" class="payment-details">
                    {{ selectedOrder.payment_details.email }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="order-items-section">
              <h3 class="section-title">Order Items ({{ selectedOrder.items.length }})</h3>
              <div class="items-container">
                <div 
                  v-for="item in selectedOrder.items" 
                  :key="item.product._id"
                  class="order-item"
                >
                  <img 
                    :src="item.product.product_image_url" 
                    :alt="item.product.name"
                    class="item-image"
                  >
                  <div class="item-details">
                    <p class="item-name">{{ item.product.name }}</p>
                    <p class="item-quantity">Quantity: {{ item.quantity }}</p>
                  </div>
                  <div class="item-price">
                    <p class="price">{{ formatCurrency(item.price_at_purchase) }}</p>
                    <p class="subtotal">Subtotal: {{ formatCurrency(item.price_at_purchase * item.quantity) }}</p>
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
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <p class="text-sm text-gray-500 mt-2">
                Current status: <span :class="getStatusClass(selectedOrder.status)" class="text-sm">{{ selectedOrder.status }}</span>
              </p>
            </div>

            <!-- Form Buttons -->
            <div class="form-buttons">
              <button 
                type="button" 
                @click="closeModals" 
                class="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="submit-btn"
              >
                <font-awesome-icon :icon="['fas', 'check']" class="w-4 h-4" />
                <span>Update Status</span>
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

.view-btn {
  background: #4b5563;
  color: white;
}

.view-btn:hover {
  background: #374151;
  transform: scale(1.05);
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
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

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: scale(1.05);
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

.submit-btn:hover {
  background: #4a2960;
  transform: scale(1.05);
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

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>