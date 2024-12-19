<template>
  <view class="container">
    <view class="layout">
      <!-- 返回按钮 -->
      <view class="back-section">
        <view class="back-button" @click="goBack">
          <img class="back-icon" src="../../static/goback.png" mode="aspectFit" />
        </view>
      </view>
      
      <view class="header">
        <text class="title">登录</text>
        <text class="subtitle">欢迎回来，请登录您的账号</text>
      </view>
      
      <view class="form">
        <view class="input-item">
          <uni-icons type="person" size="20" color="#999"></uni-icons>
          <input 
            class="input" 
            v-model="email" 
            placeholder="邮箱/账号/用户ID"
            @focus="handleInputFocus('email')"
            @blur="handleInputBlur('email')"
            :class="{ 'input-focus': focusState.email }"
          />
        </view>
        <view class="input-item">
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input 
            class="input" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="密码" 
            v-model="password"
            @focus="handleInputFocus('password')"
            @blur="handleInputBlur('password')"
            :class="{ 'input-focus': focusState.password }"
          />
          <view class="password-eye" @click="togglePasswordVisibility">
            <uni-icons 
              :type="showPassword ? 'eye-filled' : 'eye-slash-filled'" 
              size="20" 
              color="#999"
            ></uni-icons>
          </view>
        </view>
      </view>
      
      <button 
        class="submit-button" 
        @click="handleLogin" 
        :disabled="isLoading"
        :class="{ 'button-loading': isLoading }"
      >
        <text v-if="!isLoading">登录</text>
        <view v-else class="loading-icon">
          <uni-icons type="spinner-cycle" size="20" color="#fff"></uni-icons>
        </view>
      </button>

      <view class="footer">
        <view class="footer-text">
          还没有账号？
          <text @click="goToRegister" class="link">立即注册</text>
        </view>
      </view>

      <!-- 测试登录区域 -->
      <view class="test-login-section">
        <view class="test-login-header">
          <view class="divider"></view>
          <text class="test-login-title">快速测试入口</text>
          <view class="divider"></view>
        </view>
        
        <view class="test-accounts">
          <view class="test-account-item" @click="handleLoginTest('tttt', '1234')">
            <view class="account-info">
              <text class="account-type">超级管理员</text>
              <text class="account-credentials">tttt / 1234</text>
            </view>
            <uni-icons type="forward" size="16" color="#999"></uni-icons>
          </view>
          
          <view class="test-account-item" @click="handleLoginTest('admin4', '4444')">
            <view class="account-info">
              <text class="account-type">超级管理员</text>
              <text class="account-credentials">admin4 / 4444</text>
            </view>
            <uni-icons type="forward" size="16" color="#999"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { jwtDecode } from "jwt-decode";
import { API_general_request_url } from '@/src/config/index.js'

// 响应式变量
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

// 输入框焦点状态
const focusState = reactive({
  email: false,
  password: false
})

// 处理输入框焦点
const handleInputFocus = (field) => {
  focusState[field] = true
}

const handleInputBlur = (field) => {
  focusState[field] = false
}

// 切换密码显示/隐藏
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 跳转到注册页面
const goToRegister = () => {
  uni.navigateTo({
    url: "register"
  })
}

// 返回上一页
const goBack = () => {
  uni.reLaunch({
    url: "Home"
  })
}

// 登录逻辑
const handleLogin = async () => {
  // 表单验证
  if (!email.value || !password.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }

  // 开始加载
  isLoading.value = true

  try {
    const res = await uni.request({
      url: API_general_request_url.value + '/api/user/login',
      method: 'POST',
      data: {
        username: email.value,
        password: password.value,
      }
    })

    if (res.statusCode === 200 && res.data.code === "2000") {
      // 保存 token
      const token = res.data.data.token
      uni.setStorageSync('token', token)

      try {
        const decoded = jwtDecode(token)
        const tokenDetail = {
          'exp': decoded.exp,
          'username': decoded.sub,
          'userId': decoded.jti
        }
        uni.setStorageSync('tokenDetail', tokenDetail)
      } catch (error) {
        console.error("Token 解码失败:", error)
      }

      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 跳转到主页
      setTimeout(() => {
        uni.switchTab({
          url: 'Home'
        })
      }, 1500)
    } else {
      uni.showToast({
        title: res.data.msg || '登录失败',
        icon: 'none'
      })
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

// 测试登录
const handleLoginTest = async (username, pwd) => {
  email.value = username
  password.value = pwd
  await nextTick()
  handleLogin()
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 0 40rpx;
  box-sizing: border-box;

  .layout {
    padding-top: 100rpx;

    .back-section {
      margin-bottom: 60rpx;

      .back-button {
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        
        .back-icon {
          width: 60rpx;
          height: 60rpx;
        }
      }
    }

    .header {
      margin-bottom: 60rpx;

      .title {
        font-size: 48rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }

      .subtitle {
        font-size: 28rpx;
        color: #999;
      }
    }

    .form {
      margin-bottom: 40rpx;

      .input-item {
        background-color: #f5f5f5;
        border-radius: 16rpx;
        padding: 24rpx;
        margin-bottom: 30rpx;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;

        .input {
          flex: 1;
          margin-left: 20rpx;
          font-size: 28rpx;
          color: #333;
        }

        .password-eye {
          padding: 10rpx;
        }

        &:focus-within {
          background-color: #fff;
          box-shadow: 0 0 0 2rpx #4d8dff40;
        }
      }
    }

    .submit-button {
      width: 100%;
      height: 90rpx;
      background: linear-gradient(135deg, #4d8dff 0%, #2d5cff 100%);
      border-radius: 45rpx;
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border: none;
      margin-bottom: 40rpx;

      &.button-loading {
        opacity: 0.8;
      }

      .loading-icon {
        animation: spin 1s linear infinite;
      }
    }

    .footer {
      text-align: center;
      margin-bottom: 80rpx;

      .footer-text {
        font-size: 28rpx;
        color: #999;

        .link {
          color: #4d8dff;
          font-weight: 500;
        }
      }
    }

    .test-login-section {
      padding-top: 40rpx;

      .test-login-header {
        display: flex;
        align-items: center;
        margin-bottom: 40rpx;

        .divider {
          flex: 1;
          height: 1rpx;
          background-color: #eee;
        }

        .test-login-title {
          padding: 0 30rpx;
          font-size: 24rpx;
          color: #999;
        }
      }

      .test-accounts {
        .test-account-item {
          background-color: #fff;
          border-radius: 16rpx;
          padding: 30rpx;
          margin-bottom: 20rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;

          &:active {
            transform: scale(0.98);
          }

          .account-info {
            .account-type {
              font-size: 28rpx;
              color: #333;
              font-weight: 500;
              margin-bottom: 8rpx;
              display: block;
            }

            .account-credentials {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
