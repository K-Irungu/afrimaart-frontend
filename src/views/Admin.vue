<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'

// Sample data - replace with actual API calls
const recentOrders = ref([
  { id: 'ORD-7842', customer: 'John Doe', status: 'Completed', amount: '$128.00' },
  { id: 'ORD-7841', customer: 'Sarah Smith', status: 'Processing', amount: '$256.50' },
  { id: 'ORD-7840', customer: 'Mike Johnson', status: 'Pending', amount: '$89.99' },
  { id: 'ORD-7839', customer: 'Emily Brown', status: 'Completed', amount: '$342.00' },
  { id: 'ORD-7838', customer: 'David Wilson', status: 'Shipped', amount: '$156.75' }
])

const topProducts = ref([
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', sales: 142, revenue: '$12,845', image: 'https://i.pinimg.com/736x/76/9d/84/769d8454f78dabe81ec54e51fea6d156.jpg' },
  { id: 2, name: 'Smart Watch', category: 'Electronics', sales: 98, revenue: '$9,800', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' },
  { id: 3, name: 'Running Shoes', category: 'Sports', sales: 76, revenue: '$4,560', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: 4, name: 'Coffee Maker', category: 'Home', sales: 54, revenue: '$3,240', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085' },
  { id: 5, name: 'Backpack', category: 'Travel', sales: 43, revenue: '$2,580', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62' }
])

const getStatusClass = (status) => {
  const statusClasses = {
    'Completed': 'status-badge delivered',
    'Processing': 'status-badge processing',
    'Pending': 'status-badge pending',
    'Shipped': 'status-badge shipped'
  }
  return statusClasses[status] || 'status-badge pending'
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <Navbar />

    <div class="dashboard-container mx-auto p-6">
      <!-- Header -->
      <div class="header-section mb-8">
        <h1 class="page-title">Dashboard Overview</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <!-- Total Revenue -->
        <div class="stat-card revenue-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Total Revenue</p>
              <p class="stat-value">$24,568.00</p>
            </div>
            <div class="stat-icon">
              <font-awesome-icon :icon="['fas', 'dollar-sign']" />
            </div>
          </div>
          <div class="stat-trend positive">
            <font-awesome-icon :icon="['fas', 'arrow-up']" class="trend-icon" />
            <span>12.5% from last month</span>
          </div>
        </div>

        <!-- Total Orders -->
        <div class="stat-card orders-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Total Orders</p>
              <p class="stat-value">1,248</p>
            </div>
            <div class="stat-icon">
              <font-awesome-icon :icon="['fas', 'shopping-bag']" />
            </div>
          </div>
          <div class="stat-trend positive">
            <font-awesome-icon :icon="['fas', 'arrow-up']" class="trend-icon" />
            <span>8.2% from last month</span>
          </div>
        </div>

        <!-- Products -->
        <div class="stat-card products-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Products</p>
              <p class="stat-value">568</p>
            </div>
            <div class="stat-icon">
              <font-awesome-icon :icon="['fas', 'box']" />
            </div>
          </div>
          <div class="stat-trend">
            <font-awesome-icon :icon="['fas', 'arrow-up']" class="trend-icon" />
            <span>3 new today</span>
          </div>
        </div>

        <!-- Customers -->
        <div class="stat-card customers-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Customers</p>
              <p class="stat-value">8,742</p>
            </div>
            <div class="stat-icon">
              <font-awesome-icon :icon="['fas', 'users']" />
            </div>
          </div>
          <div class="stat-trend positive">
            <font-awesome-icon :icon="['fas', 'arrow-up']" class="trend-icon" />
            <span>24 new today</span>
          </div>
        </div>
      </div>

      <!-- Charts and Main Content -->
      <div class="content-grid">
        <!-- Revenue Chart -->
        <div class="chart-section">
          <div class="section-header">
            <h2 class="section-title">Revenue Overview</h2>
            <select class="chart-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div class="chart-placeholder">
            <font-awesome-icon :icon="['fas', 'chart-line']" class="chart-icon" />
            <p class="chart-title">Revenue Analytics</p>
            <p class="chart-subtitle">Interactive chart will be displayed here</p>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-section">
          <h2 class="section-title">Recent Activity</h2>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon order">
                <font-awesome-icon :icon="['fas', 'shopping-cart']" />
              </div>
              <div class="activity-content">
                <p class="activity-title">New order received</p>
                <p class="activity-time">Order #ORD-7842 • 5 min ago</p>
              </div>
              <span class="activity-amount">$128.00</span>
            </div>

            <div class="activity-item">
              <div class="activity-icon customer">
                <font-awesome-icon :icon="['fas', 'user-plus']" />
              </div>
              <div class="activity-content">
                <p class="activity-title">New customer registered</p>
                <p class="activity-time">John Doe • 12 min ago</p>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon product">
                <font-awesome-icon :icon="['fas', 'box']" />
              </div>
              <div class="activity-content">
                <p class="activity-title">Product out of stock</p>
                <p class="activity-time">Wireless Headphones • 1 hour ago</p>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon review">
                <font-awesome-icon :icon="['fas', 'star']" />
              </div>
              <div class="activity-content">
                <p class="activity-title">New product review</p>
                <p class="activity-time">Smart Watch • 2 hours ago</p>
              </div>
              <div class="activity-rating">
                <font-awesome-icon :icon="['fas', 'star']" />
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Sections -->
      <div class="bottom-grid">
        <!-- Recent Orders -->
        <div class="orders-section">
          <div class="section-header">
            <h2 class="section-title">Recent Orders</h2>
            <RouterLink to="/admin/orders" class="view-link">
              View all
            </RouterLink>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead class="table-header">
                <tr>
                  <th class="table-head">Order ID</th>
                  <th class="table-head">Customer</th>
                  <th class="table-head">Status</th>
                  <th class="table-head">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id" class="table-row">
                  <td class="table-cell font-medium text-gray-900">{{ order.id }}</td>
                  <td class="table-cell">{{ order.customer }}</td>
                  <td class="table-cell">
                    <span :class="getStatusClass(order.status)" class="status-badge">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="table-cell font-semibold text-green-600">{{ order.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Products -->
        <div class="products-section">
          <div class="section-header">
            <h2 class="section-title">Top Products</h2>
            <RouterLink to="/admin/products" class="view-link">
              View all
            </RouterLink>
          </div>
          <div class="products-list">
            <div v-for="product in topProducts" :key="product.id" class="product-item">
              <div class="product-info">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <div class="product-details">
                  <p class="product-name">{{ product.name }}</p>
                  <p class="product-category">{{ product.category }}</p>
                </div>
              </div>
              <div class="product-stats">
                <p class="sales-count">{{ product.sales }} sold</p>
                <p class="revenue-amount">{{ product.revenue }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 90%;
  margin: 0 auto;
}

/* Header Section */
.header-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1.125rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #ba9ff9;
  border: 1.5px solid #5d3471;
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(93, 52, 113, 0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #5d3471;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #5d3471;
}

.stat-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem;
  border-radius: 12px;
  color: #5d3471;
  font-size: 1.5rem;
}

.stat-trend {
  background: #e8d7ef;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: fit-content;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-trend {
  background: #dcc6e6;
  transform: translateX(5px);
}

.stat-trend.positive {
  color: #059669;
}

.trend-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-section,
.activity-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-select {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: #5d3471;
  color: white;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.chart-placeholder {
  height: 320px;
  border: 2px dashed #e5e7eb;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.chart-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.chart-subtitle {
  font-size: 0.875rem;
}

/* Activity Section */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: #f1f5f9;
}

.activity-icon {
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 1rem;
  color: white;
}

.activity-icon.order {
  background: #10b981;
}

.activity-icon.customer {
  background: #3b82f6;
}

.activity-icon.product {
  background: #8b5cf6;
}

.activity-icon.review {
  background: #f59e0b;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-amount {
  font-weight: 600;
  color: #059669;
}

.activity-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f59e0b;
  font-weight: 600;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.orders-section,
.products-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

/* Table Styles */
.table-container {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.data-table {
  width: 100%;
  text-align: left;
}

.table-header {
  background: #e8d7ef;
}

.table-head {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #5d3471;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 1rem 1.5rem;
  vertical-align: middle;
}

/* Status Badges */
.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
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

/* Products List */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.product-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  object-fit: cover;
}

.product-details {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.product-category {
  font-size: 0.875rem;
  color: #6b7280;
}

.product-stats {
  text-align: right;
}

.sales-count {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.revenue-amount {
  font-size: 0.875rem;
  color: #059669;
  font-weight: 600;
}

/* View Link */
.view-link {
  background: #ba9ff9;
  color: #5d3471;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-link:hover {
  background: #a78bfa;
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .bottom-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-container {
    width: 95%;
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>