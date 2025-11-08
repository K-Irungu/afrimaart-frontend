import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUser,
  faShoppingCart,
  faSearch,
  faCircleUser,
  faBagShopping,
  faMapPin,
  faCreditCard,
  faBell,
  faPenToSquare,
  faTrashCan,
  faTriangleExclamation,
  faUpload,
  faTrash,
  faCircleCheck,
  faCircleXmark,
  faArrowRightFromBracket,
  faEnvelope,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(
  faUser,
  faShoppingCart,
  faSearch,
  faCircleUser,
  faBagShopping,
  faMapPin,
  faCreditCard,
  faBell,
  faPenToSquare,
  faTrashCan,
  faTriangleExclamation,
  faCircleCheck,
  faCircleXmark,
  faUpload,
  faTrash,
  faArrowRightFromBracket,
  faEnvelope,
  faPhone,
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
