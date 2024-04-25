import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import vueDebounce from 'vue-debounce'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import 'vue-toast-notification/dist/theme-sugar.css'
import PrimeVue from 'primevue/config';
// import Lara from '@/presets/lara'; 
import 'primevue/resources/themes/aura-light-green/theme.css'
// import 'primevue/resources/themes/lara-light-green/theme.css';

const app = createApp(App)

app.use(router)
app.use(ToastPlugin)
app.use(PrimeVue);

app.directive('debounce', vueDebounce({ lock: true })).mount('#app')
