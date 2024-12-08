// 主文件

// 作用说明：创建 Vue 应用实例，并使用 Pinia 插件来管理应用的状态

import { createSSRApp } from 'vue'
// import { createSSRApp } from 'vue'
import App from './App'
// import pinia from './store'

export function createApp() {
  // 创建 Vue 应用实例
  const app = createSSRApp(App)
  // 使用 pinia 插件
  // app.use(pinia)
  return {
    // 返回 Vue 应用实例
    app
  }
}


