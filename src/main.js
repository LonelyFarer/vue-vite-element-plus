import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routers'
import store from './store'
import 'element-plus/dist/index.css'
import modal from './utils/modal'

const app = createApp(App)
// 模态框对象
app.config.globalProperties.$modal = modal
app.use(router)
app.use(store)
app.mount('#app')
