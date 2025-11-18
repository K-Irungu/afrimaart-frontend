<script setup>
import { ref } from 'vue';
import Navbar from '../Navbar.vue';

// Mock product list (replace with API calls later)
const products = ref([
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality headphones with noise cancellation.',
    price: 128.0,
    discount_percentage: 10,
    brand: 'SoundMax',
    category: 'Electronics',
    qty: 50,
    product_image_url: 'https://i.pinimg.com/736x/76/9d/84/769d8454f78dabe81ec54e51fea6d156.jpg',
    rating: 4.5,
    features: ['Bluetooth', 'Noise Cancelling'],
    specifications: { battery: '20h', weight: '250g' },
    color: ['Black', 'Silver'],
    warranty: { duration: '1 year' },
    deal_tag: 'Deal',
    is_new: true,
  }
]);

// Form State
const showForm = ref(false);
const editingProduct = ref(null);
const formData = ref({});

// View Details Modal
const showViewModal = ref(false);
const selectedProduct = ref(null);

function openViewModal(product) {
  selectedProduct.value = product;
  showViewModal.value = true;
}

function closeViewModal() {
  showViewModal.value = false;
  selectedProduct.value = null;
}

function openForm(product = null) {
  if (product) {
    editingProduct.value = product;
    formData.value = { ...product };
  } else {
    formData.value = {
      name: '',
      description: '',
      price: '',
      discount_percentage: 0,
      brand: '',
      category: '',
      qty: 0,
      product_image_url: '',
      rating: 0,
      features: [],
      specifications: {},
      color: [],
      warranty: {},
      deal_tag: null,
      is_new: false,
    };
    editingProduct.value = null;
  }
  showForm.value = true;
}

function saveProduct() {
  if (editingProduct.value) {
    const index = products.value.findIndex(p => p.id === editingProduct.value.id);
    products.value[index] = { ...formData.value };
  } else {
    const newId = products.value.length + 1;
    products.value.push({ id: newId, ...formData.value });
  }
  showForm.value = false;
}

// Delete product
function deleteProduct(id) {
  products.value = products.value.filter(p => p.id !== id);
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="product-container mx-auto p-6">
      <!-- Header with Add Button -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Products Management</h1>
        <button
          @click="openForm()"
          class="add-product-btn"
        >
          <font-awesome-icon :icon="['fas', 'plus']" class="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <!-- Products Table -->
      <div class="table-container">
        <table class="products-table">
          <thead class="table-header">
            <tr>
              <th scope="col" class="table-head rounded-tl-2xl">
                Image
              </th>
              <th scope="col" class="table-head">
                Name
              </th>
              <th scope="col" class="table-head">
                Description
              </th>
              <th scope="col" class="table-head">
                Brand
              </th>
              <th scope="col" class="table-head">
                Category
              </th>
              <th scope="col" class="table-head">
                Price
              </th>
              <th scope="col" class="table-head">
                Qty
              </th>
              <th scope="col" class="table-head rounded-tr-2xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="product in products" 
              :key="product.id" 
              class="table-row"
            >
              <td class="table-cell">
                <img 
                  :src="product.product_image_url" 
                  :alt="product.name"
                  class="product-image"
                >
              </td>
              <td class="table-cell font-semibold text-gray-900">{{ product.name }}</td>
              <td class="table-cell text-gray-600 max-w-xs truncate">{{ product.description }}</td>
              <td class="table-cell text-gray-700">{{ product.brand }}</td>
              <td class="table-cell">
                <span class="category-tag">
                  {{ product.category }}
                </span>
              </td>
              <td class="table-cell font-bold text-green-600">${{ product.price }}</td>
              <td class="table-cell">
                <span :class="product.qty > 10 ? 'stock-tag in-stock' : 'stock-tag low-stock'">
                  {{ product.qty }}
                </span>
              </td>
              <td class="table-cell">
                <div class="action-buttons">
                  <!-- View -->
                  <button
                    @click="openViewModal(product)"
                    class="action-btn view-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" class="w-4 h-4" />
                    <span>View</span>
                  </button>

                  <!-- Edit -->
                  <button
                    @click="openForm(product)"
                    class="action-btn edit-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" class="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <!-- Delete -->
                  <button
                    @click="deleteProduct(product.id)"
                    class="action-btn delete-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" class="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Product Details Modal -->
      <div
        v-if="showViewModal"
        class="modal-overlay"
      >
        <div class="modal-container view-modal">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">Product Details</h2>
            <button
              @click="closeViewModal"
              class="close-btn"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="w-6 h-6" />
            </button>
          </div>

          <!-- Content - Image on Left, Details on Right -->
          <div class="modal-content view-content">
            <!-- Left Side - Image -->
            <div class="image-section">
              <img
                :src="selectedProduct.product_image_url"
                class="product-detail-image"
              />
              <!-- Quick Stats under Image -->
              <div class="quick-stats">
                <div class="stat-card">
                  <p class="stat-label">Stock</p>
                  <p class="stat-value">{{ selectedProduct.qty }}</p>
                </div>
                <div class="stat-card">
                  <p class="stat-label">Rating</p>
                  <p class="stat-value">⭐ {{ selectedProduct.rating }}</p>
                </div>
              </div>
            </div>

            <!-- Right Side - Details -->
            <div class="details-section">
              <!-- Product Title and Description -->
              <div class="product-header">
                <h3 class="product-title">{{ selectedProduct.name }}</h3>
                <p class="product-description">{{ selectedProduct.description }}</p>
              </div>

              <!-- Key Information Grid -->
              <div class="info-grid">
                <div class="info-card">
                  <p class="info-label">Brand</p>
                  <p class="info-value">{{ selectedProduct.brand }}</p>
                </div>
                <div class="info-card">
                  <p class="info-label">Category</p>
                  <p class="info-value">{{ selectedProduct.category }}</p>
                </div>
                <div class="info-card">
                  <p class="info-label">Price</p>
                  <p class="info-value price">${{ selectedProduct.price }}</p>
                </div>
                <div class="info-card">
                  <p class="info-label">Discount</p>
                  <p class="info-value discount">{{ selectedProduct.discount_percentage }}% OFF</p>
                </div>
              </div>

              <!-- Status Indicators -->
              <div class="status-grid">
                <div class="status-card deal">
                  <p class="status-label">Deal Tag</p>
                  <p class="status-value">{{ selectedProduct.deal_tag || 'No Tag' }}</p>
                </div>
                <div class="status-card status">
                  <p class="status-label">Product Status</p>
                  <p class="status-value">{{ selectedProduct.is_new ? "🆕 New Arrival" : "Regular" }}</p>
                </div>
              </div>

              <!-- Features and Colors -->
              <div class="features-colors-grid">
                <div class="features-section">
                  <h4 class="section-title">Features</h4>
                  <div class="tags-container">
                    <span
                      v-for="feature in selectedProduct.features"
                      :key="feature"
                      class="feature-tag"
                    >
                      {{ feature }}
                    </span>
                  </div>
                </div>

                <div class="colors-section">
                  <h4 class="section-title">Available Colors</h4>
                  <div class="tags-container">
                    <span
                      v-for="color in selectedProduct.color"
                      :key="color"
                      class="color-tag"
                    >
                      {{ color }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Specifications -->
              <div class="specs-section">
                <h4 class="section-title">Specifications</h4>
                <div class="specs-container">
                  <div 
                    v-for="(val, key) in selectedProduct.specifications" 
                    :key="key" 
                    class="spec-item"
                  >
                    <span class="spec-key">{{ key }}</span>
                    <span class="spec-value">{{ val }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Button -->
          <div class="modal-footer">
            <button
              @click="closeViewModal"
              class="close-details-btn"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>

      <!-- Product Form Modal -->
      <div v-if="showForm" class="modal-overlay">
        <div class="modal-container form-modal">
          <div class="modal-header">
            <div class="flex justify-between items-center">
              <h2 class="modal-title">
                {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
              </h2>
              <button
                @click="showForm = false"
                class="close-btn"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="w-6 h-6" />
              </button>
            </div>
          </div>

          <form @submit.prevent="saveProduct" class="form-content">
            <!-- Basic Information Section -->
            <div class="form-grid">
              <!-- Name -->
              <div class="form-group">
                <label class="form-label">Product Name</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="form-input" 
                  required 
                  placeholder="Enter product name"
                />
              </div>

              <!-- Brand -->
              <div class="form-group">
                <label class="form-label">Brand</label>
                <input 
                  v-model="formData.brand" 
                  type="text" 
                  class="form-input" 
                  required 
                  placeholder="Enter brand name"
                />
              </div>
            </div>

            <!-- Price and Quantity Section -->
            <div class="form-grid-three">
              <!-- Price -->
              <div class="form-group">
                <label class="form-label">Price ($)</label>
                <input 
                  v-model="formData.price" 
                  type="number" 
                  step="0.01" 
                  class="form-input" 
                  required 
                  placeholder="0.00"
                />
              </div>

              <!-- Discount -->
              <div class="form-group">
                <label class="form-label">Discount %</label>
                <input 
                  v-model="formData.discount_percentage" 
                  type="number" 
                  min="0" 
                  max="100" 
                  class="form-input" 
                  placeholder="0"
                />
              </div>

              <!-- Quantity -->
              <div class="form-group">
                <label class="form-label">Quantity</label>
                <input 
                  v-model="formData.qty" 
                  type="number" 
                  min="0" 
                  class="form-input" 
                  placeholder="0"
                />
              </div>
            </div>

            <!-- Category and Deal Section -->
            <div class="form-grid">
              <!-- Category -->
              <div class="form-group">
                <label class="form-label">Category</label>
                <select 
                  v-model="formData.category" 
                  class="form-input" 
                  required
                >
                  <option disabled value="">Select Category</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Food</option>
                  <option>Home & Garden</option>
                  <option>Sports & Outdoors</option>
                  <option>Beauty</option>
                  <option>Toys</option>
                  <option>Books</option>
                </select>
              </div>

              <!-- Deal Tag -->
              <div class="form-group">
                <label class="form-label">Deal Tag</label>
                <select 
                  v-model="formData.deal_tag" 
                  class="form-input"
                >
                  <option :value="null">No Deal Tag</option>
                  <option>Flash Sale</option>
                  <option>Clearance</option>
                  <option>Deal of the Day</option>
                  <option>Bundle Offer</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea 
                v-model="formData.description" 
                rows="3" 
                class="form-textarea" 
                required 
                placeholder="Enter product description"
              ></textarea>
            </div>

            <!-- Image URL -->
            <div class="form-group">
              <label class="form-label">Image URL</label>
              <input 
                v-model="formData.product_image_url" 
                type="text" 
                class="form-input" 
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <!-- Is New Checkbox -->
            <div class="checkbox-group">
              <input 
                v-model="formData.is_new" 
                type="checkbox" 
                class="checkbox-input"
              />
              <label class="checkbox-label">Mark as New Product</label>
            </div>

            <!-- Form Buttons -->
            <div class="form-buttons">
              <button 
                type="button" 
                @click="showForm = false" 
                class="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="submit-btn"
              >
                <font-awesome-icon :icon="['fas', 'check']" class="w-4 h-4" />
                <span>{{ editingProduct ? 'Update Product' : 'Create Product' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-container {
  width: 90%;
  margin: 0 auto;
}

/* Add Product Button */
.add-product-btn {
  background: #5d3471;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(93, 52, 113, 0.2);
}

.add-product-btn:hover {
  background: #4a2960;
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(93, 52, 113, 0.3);
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

.product-image {
  width: 90px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.category-tag {
  background: #e9d5ff;
  color: #7c3aed;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stock-tag {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stock-tag.in-stock {
  background: #dcfce7;
  color: #166534;
}

.stock-tag.low-stock {
  background: #fee2e2;
  color: #dc2626;
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

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
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
  max-width: 1200px;
}

.form-modal {
  width: 90%;
  max-width: 800px;
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
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 1024px) {
  .view-content {
    flex-direction: row;
  }
}

.image-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.product-detail-image {
  width: 100%;
  max-width: 300px;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #ba9ff9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quick-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  max-width: 300px;
}

.stat-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.details-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-header {
  margin-bottom: 8px;
}

.product-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.product-description {
  color: #6b7280;
  line-height: 1.6;
}

.info-grid,
.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-card,
.status-card {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.info-card {
  background: #f8fafc;
}

.status-card.deal {
  background: #faf5ff;
  border-color: #e9d5ff;
}

.status-card.status {
  background: #eff6ff;
  border-color: #dbeafe;
}

.info-label,
.status-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
}

.info-value,
.status-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.info-value.price {
  color: #059669;
}

.info-value.discount {
  color: #ea580c;
}

.features-colors-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .features-colors-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.color-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.specs-container {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.spec-item {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-key {
  font-weight: 600;
  color: #374151;
  text-transform: capitalize;
}

.spec-value {
  color: #6b7280;
  background: white;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-grid-three {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .form-grid-three {
    grid-template-columns: repeat(3, 1fr);
  }
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

.form-input,
.form-textarea {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #5d3471;
  box-shadow: 0 0 0 3px rgba(93, 52, 113, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  accent-color: #5d3471;
}

.checkbox-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
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