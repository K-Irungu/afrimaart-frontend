<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import VueApexCharts from 'vue3-apexcharts'

const API_BASE = 'http://localhost:5050';

// Reactive data
const recentOrders = ref([])
const topProducts = ref([])
const stats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0
})
const loading = ref(false)
const error = ref(null)
const selectedTimeRange = ref('30') // 7, 30, 90 days

// Chart configuration for ApexCharts
const chartOptions = ref({
  chart: {
    type: 'area',
    height: 300,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  colors: ['#5d3471'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  xaxis: {
    type: 'category',
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px'
      }
    },
    axisBorder: {
      color: '#e5e7eb'
    },
    axisTicks: {
      color: '#e5e7eb'
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px'
      },
      formatter: function(value) {
        return formatCompactCurrency(value);
      }
    }
  },
  tooltip: {
    theme: 'dark',
    x: {
      format: 'MMM dd'
    },
    y: {
      formatter: function(value) {
        return formatCurrency(value);
      }
    }
  }
})

const chartSeries = ref([{
  name: 'Revenue',
  data: []
}])

// Fetch dashboard data
async function fetchDashboardData() {
  loading.value = true;
  error.value = null;
  try {
    // Fetch all data in parallel
    const [ordersRes, productsRes, usersRes] = await Promise.all([
      fetch(`${API_BASE}/orders`).then(res => res.json()),
      fetch(`${API_BASE}/products`).then(res => res.json()),
      fetch(`${API_BASE}/users`).then(res => res.json())
    ]);

    console.log('Raw orders data:', ordersRes);
    console.log('First order total_amount:', ordersRes[0]?.total_amount);
    console.log('First order items:', ordersRes[0]?.items);

    // Calculate statistics
    calculateStats(ordersRes, productsRes, usersRes);

    // Set recent orders (last 5 orders)
    recentOrders.value = ordersRes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Calculate top products based on order items
    calculateTopProducts(productsRes, ordersRes);

    // Generate revenue chart data
    generateRevenueChartData(ordersRes);

  } catch (err) {
    error.value = 'Failed to fetch dashboard data';
    console.error('Error fetching dashboard data:', err);
  } finally {
    loading.value = false;
  }
}

function calculateStats(orders, products, users) {
  console.log('Calculating stats from orders:', orders);

  // Calculate total revenue from orders - handle Decimal128 properly
  const totalRevenue = orders.reduce((sum, order) => {
    let amount = 0;

    // Debug the order total_amount
    console.log('Order total_amount:', order.total_amount);

    if (order.total_amount) {
      // Handle different possible formats of Decimal128
      if (typeof order.total_amount === 'object') {
        if (order.total_amount.$numberDecimal) {
          // MongoDB Decimal128 format
          amount = parseFloat(order.total_amount.$numberDecimal);
        } else {
          // Try to convert object to number
          amount = Number(order.total_amount);
        }
      } else if (typeof order.total_amount === 'string') {
        amount = parseFloat(order.total_amount);
      } else {
        amount = Number(order.total_amount);
      }
    }

    // Check if amount is valid
    if (isNaN(amount)) {
      console.warn('Invalid amount found:', order.total_amount, 'in order:', order._id);
      amount = 0;
    }

    console.log('Parsed amount:', amount);
    return sum + amount;
  }, 0);

  // Count customers (users with role "customer")
  const totalCustomers = users.filter(user => user.role === 'customer').length;

  console.log('Final totalRevenue:', totalRevenue);

  stats.value = {
    totalRevenue: totalRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: totalCustomers
  };
}

function calculateTopProducts(products, orders) {
  // Calculate product sales from order items
  const productSales = {};

  orders.forEach(order => {
    order.items?.forEach(item => {
      const productId = item.product?._id || item.product;
      const quantity = item.quantity || 0;

      // Handle price_at_purchase Decimal128
      let price = 0;
      if (item.price_at_purchase) {
        if (typeof item.price_at_purchase === 'object' && item.price_at_purchase.$numberDecimal) {
          price = parseFloat(item.price_at_purchase.$numberDecimal);
        } else if (typeof item.price_at_purchase === 'string') {
          price = parseFloat(item.price_at_purchase);
        } else {
          price = Number(item.price_at_purchase);
        }
      }

      if (isNaN(price)) {
        console.warn('Invalid price found:', item.price_at_purchase, 'in item:', item);
        price = 0;
      }

      if (!productSales[productId]) {
        productSales[productId] = {
          quantity: 0,
          revenue: 0
        };
      }

      productSales[productId].quantity += quantity;
      productSales[productId].revenue += quantity * price;
    });
  });

  // Map to products and sort by sales
  topProducts.value = products
    .map(product => {
      const salesData = productSales[product._id] || { quantity: 0, revenue: 0 };
      return {
        id: product._id,
        name: product.name,
        category: product.category,
        sales: salesData.quantity,
        revenue: formatCurrency(salesData.revenue),
        image: product.product_image_url
      };
    })
    .filter(product => product.sales > 0) // Only show products with sales
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
}

function generateRevenueChartData(orders) {
  // Group orders by date for the selected time range
  const days = parseInt(selectedTimeRange.value);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Initialize data structure
  const revenueByDate = {};
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    revenueByDate[dateKey] = 0;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Calculate revenue per day
  orders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    if (orderDate >= startDate && orderDate <= endDate) {
      const dateKey = orderDate.toISOString().split('T')[0];

      // Handle total_amount Decimal128
      let amount = 0;
      if (order.total_amount) {
        if (typeof order.total_amount === 'object' && order.total_amount.$numberDecimal) {
          amount = parseFloat(order.total_amount.$numberDecimal);
        } else if (typeof order.total_amount === 'string') {
          amount = parseFloat(order.total_amount);
        } else {
          amount = Number(order.total_amount);
        }
      }

      if (!isNaN(amount)) {
        revenueByDate[dateKey] += amount;
      }
    }
  });

  // Prepare chart data for ApexCharts
  const chartData = [];

  Object.keys(revenueByDate)
    .sort()
    .forEach(date => {
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      chartData.push({
        x: formattedDate,
        y: revenueByDate[date]
      });
    });

  chartSeries.value = [{
    name: 'Revenue',
    data: chartData
  }];
}

function getOrderAmount(order) {
  let amount = 0;

  if (order.total_amount) {
    if (typeof order.total_amount === 'object' && order.total_amount.$numberDecimal) {
      amount = parseFloat(order.total_amount.$numberDecimal);
    } else if (typeof order.total_amount === 'string') {
      amount = parseFloat(order.total_amount);
    } else {
      amount = Number(order.total_amount);
    }
  }

  if (isNaN(amount)) {
    console.warn('Invalid order amount:', order.total_amount, 'in order:', order._id);
    amount = 0;
  }

  return formatCurrency(amount);
}

function handleTimeRangeChange() {
  fetchDashboardData(); // Re-fetch data with new time range
}

function formatCurrency(amount) {
  // Ensure amount is a valid number
  const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KEs',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
}

function formatCompactCurrency(amount) {
  const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

  if (numAmount >= 1000) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(numAmount);
  }
  return formatCurrency(numAmount);
}

function formatCompactNumber(number) {
  const num = typeof number === 'number' ? number : parseFloat(number) || 0;

  return new Intl.NumberFormat('en-KE', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
}

function getCustomerName(order) {
  // Handle both populated user object and user ID
  if (typeof order.user === 'object' && order.user !== null) {
    return order.user.name || order.user.email || 'N/A';
  }
  return 'Loading...';
}

const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'status-badge pending',
    'processing': 'status-badge processing',
    'shipped': 'status-badge shipped',
    'delivered': 'status-badge delivered',
    'cancelled': 'status-badge cancelled'
  }
  return statusClasses[status.toLowerCase()] || 'status-badge pending'
}

// Computed properties for chart stats
const averageDailyRevenue = computed(() => {
  const data = chartSeries.value[0]?.data || [];
  if (data.length === 0) return 0;
  const total = data.reduce((sum, point) => sum + point.y, 0);
  return total / data.length;
});

const highestDailyRevenue = computed(() => {
  const data = chartSeries.value[0]?.data || [];
  if (data.length === 0) return 0;
  return Math.max(...data.map(point => point.y));
});

// Fetch data when component mounts
onMounted(() => {
  fetchDashboardData();
});
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

        <!-- Refresh Button -->
        <div class="flex justify-end mb-4">
          <button
            @click="fetchDashboardData"
            class="refresh-btn"
            :disabled="loading"
          >
            <font-awesome-icon
              :icon="['fas', 'rotate']"
              class="w-4 h-4"
              :class="{ 'animate-spin': loading }"
            />
            <span>{{ loading ? 'Refreshing...' : 'Refresh Data' }}</span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message mb-4">
          <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="w-5 h-5" />
          <span>{{ error }}</span>
          <button @click="fetchDashboardData" class="retry-btn">Retry</button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <!-- Total Revenue -->
        <div class="stat-card revenue-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Total Revenue</p>
              <p class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</p>
            </div>
            <div class="stat-icon">
              <font-awesome-icon :icon="['fas', 'dollar-sign']" />
            </div>
          </div>
          <div class="stat-trend positive">
            <font-awesome-icon :icon="['fas', 'chart-line']" class="trend-icon" />
            <span>Calculated from {{ stats.totalOrders }} orders</span>
          </div>
        </div>

        <!-- Total Orders -->
        <div class="stat-card orders-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Total Orders</p>
              <p class="stat-value">{{ formatCompactNumber(stats.totalOrders) }}</p>
            </div>
            <div class="stat-icon">
              <font-awesome-icon :icon="['fas', 'shopping-bag']" />
            </div>
          </div>
          <div class="stat-trend positive">
            <font-awesome-icon :icon="['fas', 'box']" class="trend-icon" />
            <span>{{ recentOrders.length }} recent orders</span>
          </div>
        </div>

        <!-- Products -->
        <div class="stat-card products-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Products</p>
              <p class="stat-value">{{ formatCompactNumber(stats.totalProducts) }}</p>
            </div>
            <div class="stat-icon">
              <font-awesome-icon :icon="['fas', 'box']" />
            </div>
          </div>
          <div class="stat-trend">
            <font-awesome-icon :icon="['fas', 'cubes']" class="trend-icon" />
            <span>{{ topProducts.length }} top selling</span>
          </div>
        </div>

        <!-- Customers -->
        <div class="stat-card customers-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-label">Customers</p>
              <p class="stat-value">{{ formatCompactNumber(stats.totalCustomers) }}</p>
            </div>
            <div class="stat-icon">
              <font-awesome-icon :icon="['fas', 'users']" />
            </div>
          </div>
          <div class="stat-trend positive">
            <font-awesome-icon :icon="['fas', 'user-plus']" class="trend-icon" />
            <span>All registered customers</span>
          </div>
        </div>
      </div>

      <!-- Charts and Main Content -->
      <div class="content-grid">
        <!-- Revenue Chart -->
        <div class="chart-section">
          <div class="section-header">
            <h2 class="section-title">Revenue Overview</h2>
            <select
              v-model="selectedTimeRange"
              @change="handleTimeRangeChange"
              class="chart-select"
              :disabled="loading"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div class="chart-container">
            <VueApexCharts
              :options="chartOptions"
              :series="chartSeries"
              type="area"
              height="300"
            />
          </div>
          <div class="chart-stats">
            <div class="chart-stat-item">
              <p class="chart-stat-label">Average Daily Revenue</p>
              <p class="chart-stat-value">
                {{ formatCurrency(averageDailyRevenue) }}
              </p>
            </div>
            <div class="chart-stat-item">
              <p class="chart-stat-label">Highest Day</p>
              <p class="chart-stat-value">
                {{ formatCurrency(highestDailyRevenue) }}
              </p>
            </div>
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
                <p class="activity-title">Total Orders Processed</p>
                <p class="activity-time">{{ stats.totalOrders }} completed transactions</p>
              </div>
              <span class="activity-amount">{{ formatCurrency(stats.totalRevenue) }}</span>
            </div>

            <div class="activity-item">
              <div class="activity-icon customer">
                <font-awesome-icon :icon="['fas', 'user-plus']" />
              </div>
              <div class="activity-content">
                <p class="activity-title">Active Customer Base</p>
                <p class="activity-time">{{ stats.totalCustomers }} registered customers</p>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon product">
                <font-awesome-icon :icon="['fas', 'box']" />
              </div>
              <div class="activity-content">
                <p class="activity-title">Product Catalog Size</p>
                <p class="activity-time">{{ stats.totalProducts }} available products</p>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon review">
                <font-awesome-icon :icon="['fas', 'star']" />
              </div>
              <div class="activity-content">
                <p class="activity-title">Top Performing Products</p>
                <p class="activity-time">{{ topProducts.length }} best sellers</p>
              </div>
              <div class="activity-rating">
                <font-awesome-icon :icon="['fas', 'chart-bar']" />
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
                <tr v-for="order in recentOrders" :key="order._id" class="table-row">
                  <td class="table-cell font-medium text-gray-900">#{{ order._id.slice(-6).toUpperCase() }}</td>
                  <td class="table-cell">{{ getCustomerName(order) }}</td>
                  <td class="table-cell">
                    <span :class="getStatusClass(order.status)" class="status-badge">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="table-cell font-semibold text-green-600">{{ getOrderAmount(order) }}</td>
                </tr>
                <tr v-if="recentOrders.length === 0 && !loading" class="table-row">
                  <td colspan="4" class="table-cell text-center text-gray-500 py-8">
                    No orders found
                  </td>
                </tr>
                <tr v-if="loading" class="table-row">
                  <td colspan="4" class="table-cell text-center text-gray-500 py-8">
                    Loading orders...
                  </td>
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
            <div v-if="topProducts.length === 0 && !loading" class="product-item text-center text-gray-500 py-4">
              No products found
            </div>
            <div v-if="loading" class="product-item text-center text-gray-500 py-4">
              Loading products...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Keep all your existing CSS styles -->


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

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.retry-btn {
  background: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-left: auto;
}

.retry-btn:hover {
  background: #b91c1c;
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

/* .chart-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
} */

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

.chart-container {
  height: 320px;
  position: relative;
  margin-bottom: 1rem;
}

.chart-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.chart-stat-item {
  text-align: center;
}

.chart-stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.chart-stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #059669;
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
