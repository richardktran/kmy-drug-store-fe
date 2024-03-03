import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import vueDebounce from 'vue-debounce'

const app = createApp(App)

app.use(router)

app.directive('debounce', vueDebounce({ lock: true })).mount('#app')

app.config.globalProperties.$filters = {
  currencyFormat(value: number) {
    return value.toLocaleString("en-US")
  }
}
