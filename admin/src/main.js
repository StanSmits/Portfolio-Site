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
    position: "top-right",
    timeout: 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true
    })

app.mount('#app')
