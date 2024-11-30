import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif


// import { createApp } from 'vue'
// import App from './App.vue'
// import UniUI from '@dcloudio/uni-ui'

// // 创建应用实例
// const app = createApp(App)

// // 注册 uni-ui 组件库
// app.use(UniUI)

// // 挂载应用
// app.mount('#app')


