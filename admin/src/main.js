import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import '@/styles/app.css'

import '@purge-icons/generated'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import routerGuards from '@/authguard/auth.guard.js';


const app = createApp(App)

app.use(router)
app.use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 5,
    newestOnTop: true,
    position: "top-center",
    timeout: 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    filterBeforeCreate: (toast, toasts) => {
        if (toasts.filter(
          t => t.type === toast.type
        ).length !== 0) {
          // Returning false discards the toast
          return false;
        }
        // You can modify the toast if you want
        return toast;
      }
    })

app.mount('#app')
