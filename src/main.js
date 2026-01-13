import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/main.css'

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
