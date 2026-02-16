<script setup>
import { ref, onMounted, computed } from 'vue';
import Navbar from '../Navbar.vue';

// API base URL
// const API_BASE = 'http://localhost:5050';
const API_BASE = 'https://afrimart-backend-5fxf.onrender.com';

// Reactive data
const products = ref([]);
const loading = ref(false);
const error = ref(null);
const colorsInput = ref('');
const featuresInput = ref('');
const specKey = ref('');
const specValue = ref('');
const warrantyKey = ref('');
const warrantyValue = ref('');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

// Form State
const showForm = ref(false);
const editingProduct = ref(null);
const formData = ref({});

// View Details Modal
const showViewModal = ref(false);
const selectedProduct = ref(null);

// Computed properties for pagination
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return products.value.slice(start, end);
});

const pageInfo = computed(() => {
  const start = ((currentPage.value - 1) * itemsPerPage.value) + 1;
  const end = Math.min(currentPage.value * itemsPerPage.value, totalItems.value);
  return `Showing ${start}-${end} of ${totalItems.value} products`;
});

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

// Fetch products from API
async function fetchProducts() {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    products.value = data;
    totalItems.value = data.length;
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching products:', err);
  } finally {
    loading.value = false;
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

// Create or Update product
async function saveProduct() {
  try {
    let response;

    if (editingProduct.value) {
      // Update existing product
      response = await fetch(`${API_BASE}/products/${editingProduct.value._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value)
      });
    } else {
      // Create new product
      response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value)
      });
    }

    if (!response.ok) {
      throw new Error('Failed to save product');
    }

    const savedProduct = await response.json();

    if (editingProduct.value) {
      // Update in local state
      const index = products.value.findIndex(p => p._id === editingProduct.value._id);
      if (index !== -1) {
        products.value[index] = savedProduct;
      }
    } else {
      // Add to local state
      products.value.push(savedProduct);
      totalItems.value = products.value.length;
    }

    showForm.value = false;
    fetchProducts(); // Refresh to get the latest data
  } catch (err) {
    error.value = err.message;
    console.error('Error saving product:', err);
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    // Remove from local state
    products.value = products.value.filter(p => p._id !== id);
    totalItems.value = products.value.length;

    // Adjust current page if we deleted the last item on the page
    if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (err) {
    error.value = err.message;
    console.error('Error deleting product:', err);
  }
}

function openViewModal(product) {
  selectedProduct.value = product;
  showViewModal.value = true;
}

function closeViewModal() {
  showViewModal.value = false;
  selectedProduct.value = null;
}

// Methods to handle form data
function updateColors() {
  if (colorsInput.value.trim()) {
    formData.value.color = colorsInput.value
      .split(',')
      .map(color => color.trim())
      .filter(color => color.length > 0);
  } else {
    formData.value.color = [];
  }
}

function updateFeatures() {
  if (featuresInput.value.trim()) {
    formData.value.features = featuresInput.value
      .split(',')
      .map(feature => feature.trim())
      .filter(feature => feature.length > 0);
  } else {
    formData.value.features = [];
  }
}

// add specs
function addSpecification() {
  if (specKey.value.trim() && specValue.value.trim()) {
    if (!formData.value.specifications) {
      formData.value.specifications = {};
    }
    formData.value.specifications[specKey.value.trim()] = specValue.value.trim();
    // Clear inputs
    specKey.value = '';
    specValue.value = '';
  }
}

//remove specs
function removeSpecification(key) {
  if (formData.value.specifications && formData.value.specifications[key]) {
    delete formData.value.specifications[key];
  }
}

//add warranty
function addWarranty() {
  if (warrantyKey.value.trim() && warrantyValue.value.trim()) {
    if (!formData.value.warranty) {
      formData.value.warranty = {};
    }
    formData.value.warranty[warrantyKey.value.trim()] = warrantyValue.value.trim();
    // Clear inputs
    warrantyKey.value = '';
    warrantyValue.value = '';
  }
}

//remove warranty
function removeWarranty(key) {
  if (formData.value.warranty && formData.value.warranty[key]) {
    delete formData.value.warranty[key];
  }
}

// Update openForm to initialize the inputs
function openForm(product = null) {
  if (product) {
    editingProduct.value = product;
    formData.value = {
      ...product,
      // Ensure numbers are properly formatted
      price: product.price ? parseFloat(product.price) : '',
      discount_percentage: product.discount_percentage || 0,
      qty: product.qty || 0,
      rating: product.rating ? parseFloat(product.rating) : 0,
      // Ensure arrays and objects exist
      features: product.features || [],
      color: product.color || [],
      specifications: product.specifications || {},
      warranty: product.warranty || {}
    };

    // Initialize input fields
    colorsInput.value = product.color ? product.color.join(', ') : '';
    featuresInput.value = product.features ? product.features.join(', ') : '';

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
    colorsInput.value = '';
    featuresInput.value = '';
    specKey.value = '';
    specValue.value = '';
    editingProduct.value = null;
  }
  showForm.value = true;
  error.value = null;
}

// Format currency for display
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Refresh products
function refreshProducts() {
  currentPage.value = 1; // Reset to first page when refreshing
  fetchProducts();
}

// Add this method to your methods
function truncateWords(text, maxWords) {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

// Fetch products when component mounts
onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="product-container mx-auto p-6">
      <!-- Header with Add Button -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Products Management</h1>
          <p class="text-sm text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <div class="flex items-center gap-[10px]">
          <div class="text-sm text-gray-600">
            Total Products: {{ totalItems }}
          </div>
          <button
            @click="refreshProducts"
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
          <button
            @click="openForm()"
            class="add-product-btn"
          >
            <font-awesome-icon :icon="['fas', 'plus']" class="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="w-5 h-5" />
        <span>{{ error }}</span>
        <button @click="fetchProducts" class="retry-btn">Retry</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <font-awesome-icon :icon="['fas', 'spinner']" class="w-8 h-8 animate-spin" />
        <p>Loading products...</p>
      </div>

      <!-- Products Table Section -->
      <div v-else class="table-section">
        <!-- Page Info -->
        <div class="page-info">
          {{ pageInfo }}
        </div>

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
                v-for="product in paginatedProducts"
                :key="product._id"
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
                <td class="table-cell text-gray-600 max-w-xs truncate">{{ truncateWords(product.description, 4) }}</td>
                <td class="table-cell text-gray-700">{{ product.brand }}</td>
                <td class="table-cell">
                  <span class="category-tag">
                    {{ product.category }}
                  </span>
                </td>
                <td class="table-cell font-bold text-green-600">{{ formatCurrency(product.price) }}</td>
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
                      @click="deleteProduct(product._id)"
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

          <!-- Empty State -->
          <div v-if="products.length === 0 && !loading" class="empty-state">
            <font-awesome-icon :icon="['fas', 'box-open']" class="w-16 h-16 text-gray-400" />
            <h3 class="empty-title">No Products Found</h3>
            <p class="empty-description">There are no products to display at the moment.</p>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="products.length > 0" class="pagination-controls">
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

      <!-- Product Details Modal -->
      <div
        v-if="showViewModal && selectedProduct"
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
                  <p class="info-value price">{{ formatCurrency(selectedProduct.price) }}</p>
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
            <!-- Error Message for Form -->
            <div v-if="error" class="error-message">
              <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="w-5 h-5" />
              <span>{{ error }}</span>
            </div>

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
                <label class="form-label">Price (KES)</label>
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
                  <option>Furniture</option>
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
                  <option>Flash</option>
                  <option>Clearance</option>
                  <option>Deal</option>
                  <option>Bundle</option>
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

            <!-- Colors - Array of strings -->
            <div class="form-group">
              <label class="form-label">Colors (comma-separated)</label>
              <input
                v-model="colorsInput"
                type="text"
                class="form-input"
                placeholder="e.g., Red, Blue, Green, Black"
                @input="updateColors"
              />
              <p class="input-hint">Enter colors separated by commas</p>
            </div>

            <!-- Features - Array of strings -->
            <div class="form-group">
              <label class="form-label">Features (comma-separated)</label>
              <input
                v-model="featuresInput"
                type="text"
                class="form-input"
                placeholder="e.g., Wireless, Bluetooth, Waterproof, Fast Charging"
                @input="updateFeatures"
              />
              <p class="input-hint">Enter features separated by commas</p>
            </div>

            <!-- Specifications - Object with key-value pairs -->
            <div class="form-section">
              <h3 class="section-title">Specifications</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Specification Key</label>
                  <input
                    v-model="specKey"
                    type="text"
                    class="form-input"
                    placeholder="e.g., Weight, Dimensions, Battery"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Specification Value</label>
                  <input
                    v-model="specValue"
                    type="text"
                    class="form-input"
                    placeholder="e.g., 500g, 10x5x2cm, 4000mAh"
                  />
                </div>
              </div>
              <button type="button" @click="addSpecification" class="add-spec-btn">
                <font-awesome-icon :icon="['fas', 'plus']" class="w-4 h-4" />
                Add Specification
              </button>

              <!-- Display added specifications -->
              <div v-if="Object.keys(formData.specifications).length > 0" class="specs-preview">
                <h4 class="preview-title">Added Specifications:</h4>
                <div v-for="(value, key) in formData.specifications" :key="key" class="spec-preview-item">
                  <span class="spec-key">{{ key }}:</span>
                  <span class="spec-value">{{ value }}</span>
                  <button type="button" @click="removeSpecification(key)" class="remove-spec-btn">
                    <font-awesome-icon :icon="['fas', 'times']" class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Warranty - Object with key-value pairs -->
            <div class="form-section">
              <h3 class="section-title">Warranty Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Warranty Period</label>
                  <input
                    v-model="formData.warranty.period"
                    type="text"
                    class="form-input"
                    placeholder="e.g., 1 year, 2 years, Lifetime"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Warranty Type</label>
                  <input
                    v-model="formData.warranty.type"
                    type="text"
                    class="form-input"
                    placeholder="e.g., Manufacturer, Limited, International"
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Warranty Details</label>
                <textarea
                  v-model="formData.warranty.details"
                  rows="2"
                  class="form-textarea"
                  placeholder="Additional warranty information..."
                ></textarea>
              </div>

              <button type="button" @click="addWarranty" class="add-spec-btn">
                <font-awesome-icon :icon="['fas', 'plus']" class="w-4 h-4" />
                Add Warranty Information
              </button>

              <!-- Display added warranty information -->
              <div v-if="formData.warranty && Object.keys(formData.warranty).length > 0" class="specs-preview">
                <h4 class="preview-title">Warranty Information:</h4>
                <div v-for="(value, key) in formData.warranty" :key="key" class="spec-preview-item">
                  <span class="spec-key">{{ key }}:</span>
                  <span class="spec-value">{{ value }}</span>
                  <button type="button" @click="removeWarranty(key)" class="remove-spec-btn">
                    <font-awesome-icon :icon="['fas', 'times']" class="w-3 h-3" />
                  </button>
                </div>
              </div>
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
                :disabled="loading"
              >
                <font-awesome-icon
                  :icon="['fas', 'check']"
                  class="w-4 h-4"
                  :class="{ 'animate-spin': loading }"
                />
                <span>{{ loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.retry-btn:hover {
  background: #b91c1c;
}

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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* =========================== */
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
  width: 90vw;
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

/* form */

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

/* Form Sections */
.form-section {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.input-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
  font-style: italic;
}

/* Specification Buttons */
.add-spec-btn {
  background: #5d3471;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
}

.add-spec-btn:hover {
  background: #4a2960;
  transform: scale(1.05);
}

/* Specifications Preview */
.specs-preview {
  margin-top: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.preview-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.spec-preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.spec-preview-item:last-child {
  border-bottom: none;
}

.spec-key {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
}

.spec-value {
  color: #6b7280;
  flex: 1;
}

.remove-spec-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-spec-btn:hover {
  background: #dc2626;
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

/* Responsive Design for Pagination */
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

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>
