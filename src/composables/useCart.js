import { ref, computed } from 'vue'

// Cart state
const cartItems = ref([])
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Load cart from localStorage on initialization
const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
}

// Save cart to localStorage whenever it changes
const saveCartToStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

// Initialize cart from storage
loadCartFromStorage()

export function useCart() {
  // Add item to cart
  const addToCart = (product, selectedColor = '', selectedWarranty = '', quantity = 1) => {
    const existingItemIndex = cartItems.value.findIndex(
      item => 
        item.productId === product._id && 
        item.color === selectedColor && 
        item.warranty === selectedWarranty
    )

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      cartItems.value[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cartItems.value.push({
        id: Date.now().toString(), // Unique ID for cart item
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.product_image_url,
        color: selectedColor,
        warranty: selectedWarranty,
        quantity: quantity,
        brand: product.brand,
        category: product.category
      })
    }

    saveCartToStorage()
    
    // Show success message
    showSuccessMessage.value = true
    successMessage.value = `${quantity} ${product.name} added to cart!`
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
    saveCartToStorage()
  }

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    const item = cartItems.value.find(item => item.id === itemId)
    if (item && newQuantity > 0) {
      item.quantity = newQuantity
      saveCartToStorage()
    }
  }

  // Clear entire cart
  const clearCart = () => {
    cartItems.value = []
    localStorage.removeItem('cart')
  }

  // Move item to wishlist (you can implement wishlist functionality separately)
  const moveToWishlist = (itemId) => {
    const itemIndex = cartItems.value.findIndex(item => item.id === itemId)
    if (itemIndex > -1) {
      // Add to wishlist logic here
      console.log('Moving to wishlist:', cartItems.value[itemIndex])
      removeFromCart(itemId)
    }
  }

  // Save item for later
  const saveForLater = (itemId) => {
    const itemIndex = cartItems.value.findIndex(item => item.id === itemId)
    if (itemIndex > -1) {
      // Save for later logic here
      console.log('Saving for later:', cartItems.value[itemIndex])
      removeFromCart(itemId)
    }
  }

  // Computed properties
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const cartItemsCount = computed(() => {
    return cartItems.value.length
  })

  return {
    cartItems: computed(() => cartItems.value),
    cartCount,
    cartTotal,
    cartItemsCount,
    showSuccessMessage: computed(() => showSuccessMessage.value),
    successMessage: computed(() => successMessage.value),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    moveToWishlist,
    saveForLater,
    loadCartFromStorage
  }
}