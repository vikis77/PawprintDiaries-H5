<template>
  <view class="container">
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="back-text">返回</text>
      </view>
      <view class="title">Spring AI Chat 测试</view>
    </view>
    
    <view class="tabs">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index" 
        class="tab" 
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        {{ tab }}
      </view>
    </view>
    
    <view class="content">
      <!-- 服务器配置 -->
      <view class="server-config">
        <view class="config-toggle" @click="toggleServerConfig">
          <text>服务器配置</text>
          <text class="toggle-icon">{{ serverConfig.showConfig ? '▲' : '▼' }}</text>
        </view>
        
        <view v-if="serverConfig.showConfig" class="config-form">
          <view class="form-item">
            <text class="label">API地址:</text>
            <input type="text" v-model="serverConfig.customUrl" placeholder="例如: http://localhost:8080/api/chat" />
          </view>
          <button class="submit-btn" @click="updateBaseUrl">应用</button>
        </view>
      </view>
      
      <!-- HTTP同步请求 -->
      <view v-if="activeTab === 0" class="tab-content">
        <view class="form">
          <view class="form-item">
            <text class="label">用户ID:</text>
            <input type="text" v-model="syncRequest.userId" placeholder="输入用户ID" />
          </view>
          <view class="form-item">
            <text class="label">模型:</text>
            <input type="text" v-model="syncRequest.model" placeholder="输入模型名称" />
          </view>
          <view class="form-item">
            <text class="label">提示词:</text>
            <textarea v-model="syncRequest.prompt" placeholder="输入提示词" />
          </view>
          <button class="submit-btn" @click="sendSyncRequest">发送请求</button>
        </view>
        
        <view class="response-container">
          <text class="response-label">响应结果:</text>
          <view class="response-box">
            <text>{{ syncResponse }}</text>
          </view>
        </view>
      </view>
      
      <!-- SSE流式响应 -->
      <view v-if="activeTab === 1" class="tab-content">
        <view class="form">
          <view class="form-item">
            <text class="label">用户ID:</text>
            <input type="text" v-model="sseRequest.userId" placeholder="输入用户ID" />
          </view>
          <view class="form-item">
            <text class="label">模型:</text>
            <input type="text" v-model="sseRequest.model" placeholder="输入模型名称" />
          </view>
          <view class="form-item">
            <text class="label">提示词:</text>
            <textarea v-model="sseRequest.prompt" placeholder="输入提示词" />
          </view>
          <button class="submit-btn" @click="startSSE">开始接收流</button>
          <button class="cancel-btn" @click="stopSSE">停止接收</button>
        </view>
        
        <view class="response-container">
          <text class="response-label">实时响应:</text>
          <view class="response-box">
            <text>{{ sseResponse }}</text>
          </view>
        </view>
      </view>
      
      <!-- WebSocket双向通信 -->
      <view v-if="activeTab === 2" class="tab-content">
        <view class="form">
          <view class="form-item">
            <text class="label">用户ID:</text>
            <input type="text" v-model="wsRequest.userId" placeholder="输入用户ID" />
          </view>
          <view class="form-item">
            <text class="label">请求ID:</text>
            <input type="text" v-model="wsRequest.requestId" placeholder="输入请求ID" />
          </view>
          <view class="form-item">
            <text class="label">模型:</text>
            <input type="text" v-model="wsRequest.model" placeholder="输入模型名称" />
          </view>
          <view class="form-item">
            <text class="label">提示词:</text>
            <textarea v-model="wsRequest.prompt" placeholder="输入提示词" />
          </view>
          <button class="submit-btn" @click="connectWebSocket">连接WebSocket</button>
          <button class="submit-btn" @click="sendWsMessage">发送消息</button>
          <button class="cancel-btn" @click="closeWebSocket">关闭连接</button>
        </view>
        
        <view class="response-container">
          <text class="response-label">WebSocket状态: {{ wsStatus }}</text>
          <view class="response-box">
            <text>{{ wsResponse }}</text>
          </view>
        </view>
      </view>
      
      <!-- 项目说明 -->
      <view v-if="activeTab === 3" class="tab-content project-info">
        <view class="project-title">Spring AI Chat Starter</view>
        <view class="project-description">
          <text>Spring AI Chat Starter 是一个基于 Spring AI 框架的聊天应用启动器，支持多种通信方式和多种大语言模型。</text>
        </view>
        
        <view class="feature-section">
          <view class="section-title">特性</view>
          <view class="feature-list">
            <view class="feature-item">
              <text class="feature-title">支持多种通信方式</text>
              <view class="feature-details">
                <text>• HTTP 同步请求/响应</text>
                <text>• SSE 流式响应</text>
                <text>• WebSocket 双向通信</text>
                <text>• RabbitMQ 消息队列</text>
              </view>
            </view>
            
            <view class="feature-item">
              <text class="feature-title">支持多种大语言模型</text>
              <view class="feature-details">
                <text>• 阿里通义千问 (DashScope)</text>
                <text>• OpenAI (GPT)</text>
                <text>• 易于扩展其他模型</text>
              </view>
            </view>
            
            <view class="feature-item">
              <text class="feature-title">自动配置</text>
              <view class="feature-details">
                <text>• 基于 Spring Boot 自动配置机制</text>
                <text>• 可通过配置文件灵活控制功能启用/禁用</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="config-section">
          <view class="section-title">配置示例</view>
          <view class="code-block">
            <text>spring:
  ai:
    dashscope:
      chat:
        options:
          model: qwen-turbo
      api-key: your-api-key-here
    model:
      chat: dashscope
    chat:
      enabled: true
      default-model: qwen
      websocket:
        enabled: true
      rabbitmq:
        enabled: false</text>
          </view>
        </view>
        
        <view class="github-link">
          <text @click="openGithub">查看GitHub项目</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { showToast } from '@/src/utils/toast'

// 检查用户是否登录
const checkLogin = () => {
  const token = uni.getStorageSync('token')
  if (!token) {
    showToast('请先登录')
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login'
      })
    }, 1500)
    return false
  }
  return true
}

// 基础URL配置
const baseApiUrl = ref('http://localhost:8080/api/chat')

// 添加服务器配置项
const serverConfig = ref({
  showConfig: false,
  customUrl: 'http://localhost:8080/api/chat'
})

// 更新基础URL
const updateBaseUrl = () => {
  baseApiUrl.value = serverConfig.value.customUrl
  showToast('API地址已更新')
  serverConfig.value.showConfig = false
}

// 显示/隐藏服务器配置
const toggleServerConfig = () => {
  serverConfig.value.showConfig = !serverConfig.value.showConfig
}

// 选项卡配置
const tabs = ['HTTP同步', 'SSE流式', 'WebSocket', '项目说明']
const activeTab = ref(0)

// HTTP同步请求相关
const syncRequest = ref({
  userId: 'user-' + Math.floor(Math.random() * 1000),
  prompt: '你好，请介绍一下自己',
  model: 'qwen'
})
const syncResponse = ref('')

// SSE流式响应相关
const sseRequest = ref({
  userId: 'user-' + Math.floor(Math.random() * 1000),
  prompt: '你好，请介绍一下自己',
  model: 'qwen'
})
const sseResponse = ref('')
let eventSource = null

// WebSocket相关
const wsRequest = ref({
  userId: 'user-' + Math.floor(Math.random() * 1000),
  prompt: '你好，请介绍一下自己',
  model: 'qwen',
  requestId: 'req-' + Math.floor(Math.random() * 1000000)
})
const wsResponse = ref('')
const wsStatus = ref('未连接')
let socket = null

// 发送HTTP同步请求
const sendSyncRequest = async () => {
  try {
    syncResponse.value = '请求中...'
    
    // #ifdef H5
    const response = await fetch(`${baseApiUrl.value}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(syncRequest.value)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }
    
    const data = await response.json()
    syncResponse.value = data.content || JSON.stringify(data)
    // #endif
    
    // #ifndef H5
    uni.request({
      url: `${baseApiUrl.value}/sync`,
      method: 'POST',
      data: syncRequest.value,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          syncResponse.value = res.data.content || JSON.stringify(res.data)
        } else {
          syncResponse.value = `请求错误: ${res.statusCode}`
        }
      },
      fail: (err) => {
        syncResponse.value = `请求失败: ${JSON.stringify(err)}`
      }
    })
    // #endif
  } catch (error) {
    syncResponse.value = `发生错误: ${error.message}`
  }
}

// 开始SSE流式响应
const startSSE = () => {
  // 停止现有的连接
  stopSSE()
  
  sseResponse.value = '连接中...'
  
  // #ifdef H5
  try {
    const url = new URL(`${baseApiUrl.value}/sse`, window.location.origin)
    url.searchParams.append('userId', sseRequest.value.userId)
    url.searchParams.append('prompt', sseRequest.value.prompt)
    url.searchParams.append('model', sseRequest.value.model)
    
    eventSource = new EventSource(url)
    
    eventSource.onopen = () => {
      sseResponse.value = '连接已建立，等待数据...'
    }
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      sseResponse.value += data.content
    }
    
    eventSource.onerror = (error) => {
      console.error('SSE错误:', error)
      sseResponse.value += '\n[连接错误]'
      stopSSE()
    }
  } catch (error) {
    sseResponse.value = `SSE连接错误: ${error.message}`
  }
  // #endif
  
  // #ifndef H5
  sseResponse.value = 'SSE仅在H5环境下可用'
  showToast('SSE仅在H5环境下可用')
  // #endif
}

// 停止SSE连接
const stopSSE = () => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
    sseResponse.value += '\n[连接已关闭]'
  }
}

// 连接WebSocket
const connectWebSocket = () => {
  // 关闭现有连接
  closeWebSocket()
  
  // #ifdef H5
  try {
    const wsUrl = baseApiUrl.value.replace('http', 'ws') + '/ws'
    socket = new WebSocket(wsUrl)
    
    wsStatus.value = '连接中...'
    wsResponse.value = ''
    
    socket.onopen = () => {
      wsStatus.value = '已连接'
      wsResponse.value = '连接已建立，可以发送消息'
    }
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        wsResponse.value += data.content
      } catch (e) {
        wsResponse.value += event.data
      }
    }
    
    socket.onerror = (error) => {
      wsStatus.value = '连接错误'
      wsResponse.value += '\n[连接错误]'
      console.error('WebSocket错误:', error)
    }
    
    socket.onclose = () => {
      wsStatus.value = '连接已关闭'
      wsResponse.value += '\n[连接已关闭]'
    }
  } catch (error) {
    wsStatus.value = '连接失败'
    wsResponse.value = `WebSocket连接错误: ${error.message}`
  }
  // #endif
  
  // #ifndef H5
  wsStatus.value = '不可用'
  wsResponse.value = 'WebSocket仅在H5环境下可用'
  showToast('WebSocket仅在H5环境下可用')
  // #endif
}

// 发送WebSocket消息
const sendWsMessage = () => {
  if (!socket || socket.readyState !== 1) {
    wsResponse.value = '未连接WebSocket，请先连接'
    return
  }
  
  try {
    socket.send(JSON.stringify(wsRequest.value))
    wsResponse.value = '已发送消息，等待响应...\n'
  } catch (error) {
    wsResponse.value = `发送消息错误: ${error.message}`
  }
}

// 关闭WebSocket连接
const closeWebSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
}

// 打开GitHub链接
const openGithub = () => {
  // #ifdef H5
  window.open('https://github.com/yourusername/spring-ai-chat-starter', '_blank')
  // #endif
  
  // #ifndef H5
  uni.setClipboardData({
    data: 'https://github.com/yourusername/spring-ai-chat-starter',
    success: () => {
      showToast('GitHub链接已复制到剪贴板')
    }
  })
  // #endif
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 检查用户是否登录
  if (!checkLogin()) {
    return
  }
  
  // 从本地存储中恢复自定义URL(如果有)
  const savedUrl = uni.getStorageSync('aiChatApiUrl')
  if (savedUrl) {
    serverConfig.value.customUrl = savedUrl
    baseApiUrl.value = savedUrl
  }
})

onUnmounted(() => {
  // 保存自定义URL到本地存储
  uni.setStorageSync('aiChatApiUrl', serverConfig.value.customUrl)
  
  // 清理资源
  stopSSE()
  closeWebSocket()
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
}

.header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
  
  .back-button {
    width: 80rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .back-text {
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .title {
    flex: 1;
    text-align: center;
    font-size: 34rpx;
    font-weight: 600;
    color: #333;
    margin-right: 60rpx;
  }
}

.tabs {
  display: flex;
  background: #ffffff;
  border-bottom: 1rpx solid #eee;
  
  .tab {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;
    transition: all 0.3s;
    
    &.active {
      color: #3a86ff;
      font-weight: 500;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 30%;
        width: 40%;
        height: 4rpx;
        background: #3a86ff;
        border-radius: 4rpx;
      }
    }
  }
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx;
}

.server-config {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  
  .config-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 0;
    
    text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
    
    .toggle-icon {
      color: #3a86ff;
    }
  }
  
  .config-form {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #eee;
  }
}

.tab-content {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.form {
  margin-bottom: 20rpx;
  
  .form-item {
    margin-bottom: 20rpx;
    
    .label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    input, textarea {
      width: 100%;
      padding: 16rpx;
      border: 1rpx solid #ddd;
      border-radius: 8rpx;
      font-size: 28rpx;
      background: #f9f9f9;
    }
    
    textarea {
      height: 160rpx;
    }
  }
  
  .submit-btn, .cancel-btn {
    margin: 10rpx 0;
    padding: 20rpx 0;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #fff;
  }
  
  .submit-btn {
    background: #3a86ff;
    &:active {
      background: #2a76ef;
    }
  }
  
  .cancel-btn {
    background: #ff3a5e;
    &:active {
      background: #ef2a4e;
    }
  }
}

.response-container {
  .response-label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 10rpx;
    display: block;
  }
  
  .response-box {
    padding: 20rpx;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    background: #f9f9f9;
    min-height: 200rpx;
    max-height: 600rpx;
    overflow-y: auto;
    font-size: 26rpx;
    color: #555;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.project-info {
  .project-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-bottom: 30rpx;
  }
  
  .project-description {
    font-size: 28rpx;
    color: #555;
    line-height: 1.6;
    margin-bottom: 40rpx;
  }
  
  .feature-section, .config-section {
    margin-bottom: 40rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
      border-left: 8rpx solid #3a86ff;
      padding-left: 20rpx;
    }
  }
  
  .feature-list {
    .feature-item {
      margin-bottom: 30rpx;
      
      .feature-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #444;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .feature-details {
        padding-left: 20rpx;
        
        text {
          display: block;
          font-size: 26rpx;
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }
  
  .code-block {
    background: #f1f3f5;
    padding: 20rpx;
    border-radius: 8rpx;
    margin-bottom: 30rpx;
    overflow-x: auto;
    
    text {
      font-family: monospace;
      font-size: 24rpx;
      color: #444;
      white-space: pre;
    }
  }
  
  .github-link {
    text-align: center;
    margin-top: 40rpx;
    margin-bottom: 20rpx;
    
    text {
      display: inline-block;
      padding: 16rpx 30rpx;
      background: #333;
      color: #fff;
      font-size: 28rpx;
      border-radius: 8rpx;
    }
  }
}
</style> 