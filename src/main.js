import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routers';
import store from './store';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');