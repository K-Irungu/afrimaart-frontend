<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const router = useRouter()

const API_BASE = 'https://afrimart-backend-5fxf.onrender.com'

const order = ref(null)
const loading = ref(true)
const error = ref(null)

const orderId = computed(() => route.query.orderId)

const fetchOrder = async () => {
  if (!orderId.value) {
    error.value = 'No order ID provided.'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`${API_BASE}/orders/${orderId.value}`)
    if (!response.ok) throw new Error('Failed to fetch order details')
    const data = await response.json()
    order.value = data



    console.log('Fetched order details:', data)


  } catch (err) {
    console.error('Error fetching order:', err)
    error.value = 'Unable to load your order. Please check your order history.'
  } finally {
    loading.value = false
  }
}

// Computed helpers
const formattedOrderId = computed(() => {
  if (!orderId.value) return '—'
  return `#${orderId.value.slice(-8).toUpperCase()}`
})

const formattedDate = computed(() => {
  const date = order.value?.createdAt ? new Date(order.value.createdAt) : new Date()
  return date.toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// const totalAmount = computed(() => {
//   return order.value?.total_amount ?? '0.00'
// })

// Start of change by Kevin Irungu - Improved decimal handling for order total
const totalAmount = computed(() => {
  const raw = order.value?.total_amount
  if (!raw) return '0.00'
  const num = parseFloat(raw?.$numberDecimal ?? raw)
  return isNaN(num) ? '0.00' : num.toFixed(2)
})
// End of change by Kevin Irungu

const shippingAddress = computed(() => order.value?.shipping_address || null)
const orderItems = computed(() => order.value?.items || [])

onMounted(() => {
  fetchOrder()
})

const goHome = () => router.push('/')
const goOrders = () => router.push('/account')
</script>

<template>
  <div class="page-wrapper">
    <Navbar />

    <main class="confirmation-main">

      <!-- Loading State -->
      <div v-if="loading" class="state-container">
        <div class="pulse-ring"></div>
        <p class="state-text">Confirming your order…</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="state-container">
        <div class="error-icon">✕</div>
        <p class="state-text error-text">{{ error }}</p>
        <button class="btn-primary" @click="goHome">Return to Shop</button>
      </div>

      <!-- Success State -->
      <div v-else class="confirmation-card">

        <!-- Animated checkmark header -->
        <div class="card-header">
          <div class="check-orbit">
            <div class="check-circle">
              <svg class="checkmark" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="check-bg" cx="26" cy="26" r="25" />
                <path class="check-path" d="M14 26L22 34L38 18" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <h1 class="heading-main">Order Confirmed!</h1>
          <p class="heading-sub">
            Thank you for shopping with AfriMart. Your order is on its way.
          </p>

          <div class="order-id-badge">
            Order {{ formattedOrderId }}
          </div>
        </div>

        <!-- Timeline -->
        <div class="timeline-strip">
          <div class="timeline-step done">
            <div class="tl-dot"><span>✓</span></div>
            <p class="tl-label">Order Placed</p>
          </div>
          <div class="tl-line"></div>
          <div class="timeline-step active">
            <div class="tl-dot"><span>⟳</span></div>
            <p class="tl-label">Processing</p>
          </div>
          <div class="tl-line inactive"></div>
          <div class="timeline-step inactive">
            <div class="tl-dot"><span>→</span></div>
            <p class="tl-label">Shipped</p>
          </div>
          <div class="tl-line inactive"></div>
          <div class="timeline-step inactive">
            <div class="tl-dot"><span>⌂</span></div>
            <p class="tl-label">Delivered</p>
          </div>
        </div>

        <!-- Detail Grid -->
        <div class="detail-grid">

          <!-- Order Info -->
          <div class="detail-card">
            <h3 class="detail-title">Order Details</h3>
            <dl class="detail-list">
              <div class="detail-row">
                <dt>Date</dt>
                <dd>{{ formattedDate }}</dd>
              </div>
              <div class="detail-row">
                <dt>Status</dt>
                <dd>
                  <span class="status-pill">{{ order?.status || 'Pending' }}</span>
                </dd>
              </div>
              <div class="detail-row">
                <dt>Payment</dt>
                <dd>M-Pesa</dd>
              </div>
              <div class="detail-row total-row">
                <dt>Total</dt>
                <dd class="total-amount">Ksh {{ totalAmount }}</dd>
              </div>
            </dl>
          </div>

          <!-- Shipping Address -->
          <div class="detail-card" v-if="shippingAddress">
            <h3 class="detail-title">Shipping To</h3>
            <address class="address-block">
              <p class="address-type">{{ shippingAddress.type || 'Home' }}</p>
              <p>{{ shippingAddress.address_line_1 }}</p>
              <p v-if="shippingAddress.address_line_2">{{ shippingAddress.address_line_2 }}</p>
              <p>{{ shippingAddress.city }}<span v-if="shippingAddress.postal_code">, {{ shippingAddress.postal_code }}</span></p>
              <p v-if="shippingAddress.state_region">{{ shippingAddress.state_region }}</p>
              <p>{{ shippingAddress.country }}</p>
            </address>
            <p class="delivery-eta">
              <span class="eta-dot"></span>
              Express delivery: 1–2 business days
            </p>
          </div>
        </div>

        <!-- Order Items -->

        <div class="items-section" v-if="orderItems.length > 0">
          <h3 class="detail-title">Items Ordered</h3>
          <ul class="items-list">
            <li
              v-for="(item, index) in orderItems"
              :key="index"
              class="item-row"
            >
              <div class="item-thumb">
                <img
                  v-if="item.product?.images?.[0]"
                  :src="item.product.images[0]"
                  :alt="item.product?.name"
                />
                <span v-else class="item-placeholder">🛍</span>
              </div>
              <div class="item-info">
                <p class="item-name">{{ item.product?.name || 'Product' }}</p>
                <p class="item-qty">Qty: {{ item.quantity }}</p>
              </div>
              <!-- <p class="item-price">Ksh {{ (item.price_at_purchase * item.quantity).toFixed(2) }}</p> -->
              <p class="item-price">Ksh {{ (parseFloat(item.price_at_purchase?.$numberDecimal ?? item.price_at_purchase) * item.quantity).toFixed(2) }}
</p>
            </li>
          </ul>
        </div>

        <!-- CTA Buttons -->
        <div class="cta-row">
          <!-- <button class="btn-secondary" @click="goOrders">View My Orders</button> -->
          <button class="btn-primary" @click="goHome">Continue Shopping</button>
        </div>

      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

/* ── Base ─────────────────────────────────────── */
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fdf7fb;
  font-family: 'DM Sans', sans-serif;
}

.confirmation-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 16px 80px;
}

/* ── Loading / Error States ───────────────────── */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 80px;
}

.state-text {
  font-size: 1rem;
  color: #804d91;
  font-weight: 500;
}

.error-text { color: #c0392b; }

.error-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fde8e8;
  color: #c0392b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.pulse-ring {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #aa69af;
  border-top-color: transparent;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Card ─────────────────────────────────────── */
.confirmation-card {
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 8px 48px rgba(93, 52, 113, 0.10), 0 1px 4px rgba(93, 52, 113, 0.06);
  overflow: hidden;
  animation: cardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Header ───────────────────────────────────── */
.card-header {
  background: linear-gradient(145deg, #5d3471 0%, #804d91 60%, #aa69af 100%);
  padding: 48px 36px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 20%, rgba(232, 182, 213, 0.18) 0%, transparent 60%);
  pointer-events: none;
}

/* Animated checkmark */
.check-orbit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  margin-bottom: 20px;
  animation: orbitPulse 2.4s ease-in-out infinite;
}
@keyframes orbitPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232, 182, 213, 0.4); }
  50%       { box-shadow: 0 0 0 14px rgba(232, 182, 213, 0); }
}

.check-circle {
  width: 64px;
  height: 64px;
}

.checkmark {
  width: 64px;
  height: 64px;
}

.check-bg {
  fill: rgba(255,255,255,0.15);
  stroke: rgba(255,255,255,0.4);
  stroke-width: 1;
}

.check-path {
  stroke: #ffffff;
  stroke-width: 4;
  fill: none;
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: drawCheck 0.5s 0.3s ease forwards;
}
@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

.heading-main {
  font-family: 'DM Serif Display', serif;
  font-size: 2rem;
  color: #ffffff;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.heading-sub {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.78);
  margin: 0 0 20px;
  line-height: 1.5;
}

.order-id-badge {
  display: inline-block;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.28);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 6px 16px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

/* ── Timeline ─────────────────────────────────── */
.timeline-strip {
  display: flex;
  align-items: center;
  padding: 24px 36px;
  border-bottom: 1px solid #f0e5f5;
  gap: 0;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.tl-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.2s;
}

.timeline-step.done .tl-dot {
  background: #5d3471;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(93, 52, 113, 0.15);
}

.timeline-step.active .tl-dot {
  background: #e8b6d5;
  color: #5d3471;
  box-shadow: 0 0 0 4px rgba(232, 182, 213, 0.35);
  animation: activePulse 1.6s ease-in-out infinite;
}
@keyframes activePulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(232, 182, 213, 0.35); }
  50%       { box-shadow: 0 0 0 8px rgba(232, 182, 213, 0.1); }
}

.timeline-step.inactive .tl-dot {
  background: #f5eff9;
  color: #c4a8d0;
  border: 1.5px solid #e0cce8;
}

.tl-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #804d91;
  white-space: nowrap;
}

.timeline-step.inactive .tl-label { color: #c4a8d0; }

.tl-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, #5d3471, #e8b6d5);
  margin: 0 4px;
  margin-bottom: 20px;
}

.tl-line.inactive {
  background: #ede3f4;
}

/* ── Detail Grid ──────────────────────────────── */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: #f0e5f5;
  margin: 0 0 1px;
}

.detail-card {
  background: #ffffff;
  padding: 28px 32px;
}

.detail-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1rem;
  color: #5d3471;
  margin: 0 0 16px;
  letter-spacing: -0.01em;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.detail-row dt { color: #9b7aaa; font-weight: 500; }
.detail-row dd { color: #3d1f52; font-weight: 600; margin: 0; }

.total-row {
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px dashed #e0cce8;
}

.total-amount {
  font-family: 'DM Serif Display', serif;
  font-size: 1.15rem !important;
  color: #5d3471 !important;
}

.status-pill {
  background: #edf7ed;
  color: #2e7d32;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid #a5d6a7;
}

/* Address */
.address-block {
  font-style: normal;
  font-size: 0.875rem;
  color: #3d1f52;
  line-height: 1.7;
  margin-bottom: 14px;
}

.address-type {
  font-weight: 700;
  color: #5d3471;
  text-transform: capitalize;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.delivery-eta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #804d91;
  font-weight: 500;
}

.eta-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #aa69af;
  animation: etaPulse 1.8s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes etaPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}

/* ── Items ────────────────────────────────────── */
.items-section {
  padding: 28px 32px;
  border-top: 1px solid #f0e5f5;
}

.items-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #fdf5fb;
  border-radius: 12px;
  border: 1px solid #f0e5f5;
}

.item-thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  background: #e8b6d5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-placeholder { font-size: 1.4rem; }

.item-info { flex: 1; }

.item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3d1f52;
  margin: 0 0 2px;
}

.item-qty {
  font-size: 0.775rem;
  color: #9b7aaa;
  margin: 0;
}

.item-price {
  font-size: 0.9rem;
  font-weight: 700;
  color: #5d3471;
  white-space: nowrap;
  margin: 0;
}

/* ── CTAs ─────────────────────────────────────── */
.cta-row {
  display: flex;
  justify-content: center;
  gap: 14px;
  padding: 28px 32px 36px;
  border-top: 1px solid #f0e5f5;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #5d3471, #804d91);
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s;
  box-shadow: 0 4px 16px rgba(93, 52, 113, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(93, 52, 113, 0.32);
}

.btn-secondary {
  background: #fff;
  color: #5d3471;
  border: 1.5px solid #aa69af;
  padding: 12px 28px;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, transform 0.18s;
}

.btn-secondary:hover {
  background: #f9f0fc;
  border-color: #5d3471;
  transform: translateY(-2px);
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 600px) {
  .card-header { padding: 36px 20px 30px; }
  .heading-main { font-size: 1.5rem; }
  .detail-grid { grid-template-columns: 1fr; }
  .timeline-strip { padding: 20px 16px; }
  .tl-label { display: none; }
  .detail-card { padding: 20px; }
  .items-section { padding: 20px; }
  .cta-row { flex-direction: column; padding: 20px; }
  .btn-primary, .btn-secondary { width: 100%; text-align: center; }
}
</style>
