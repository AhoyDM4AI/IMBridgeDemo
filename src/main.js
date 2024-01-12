import './assets/main.css'
import * as echarts from 'echarts'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import naive from 'naive-ui'

const app = createApp(App)

app.use(router)
app.use(naive)

app.mount('#app')
app.config.globalProperties.$echarts = echarts
