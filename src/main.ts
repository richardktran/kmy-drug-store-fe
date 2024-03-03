import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import vueDebounce from 'vue-debounce'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import 'vue-toast-notification/dist/theme-sugar.css';


const app = createApp(App)

app.use(router)
app.use(ToastPlugin);

app.directive('debounce', vueDebounce({ lock: true })).mount('#app')
