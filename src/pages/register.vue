<template>
  <view class="container">
	  <view class="layout">
	  	<view class="header">
	  	    <text class="title">注册并开始</text>
	  	  </view>
	  	
	  	  <view class="form">
	  	    <view class="input-item">
	  	      <input class="input" v-model="username" placeholder="用户名" />
	  	    </view>
	  	    <view class="input-item">
	  	      <input class="input" v-model="email" placeholder="邮箱" />
	  	    </view>
	  	    <view class="input-item">
	  	      <input class="input" type="password" v-model="password" placeholder="密码" />
	  	      <view class="input-eye"></view>
	  	    </view>
	  	    <view class="input-item">
	  	      <input class="input" type="password" v-model="confirmPassword" placeholder="确认密码" />
	  	      <view class="input-eye"></view>
	  	    </view>
	  	  </view>
	  	
	  	  <view class="footer">
	  	    <text class="footer-text">注册即表明您同意我们的相关服务条款及细则</text>
	  	    <text class="footer-link">查看详情</text>
	  	  </view>
	  	
	  	  <button class="submit-button" type="primary" @click="handleRegister">立即注册</button>
	  	
	  	  <view class="footer">
	  	    <view class="footer-text">
				已经注册？
				<text @click="goToLogin" class="link">登录</text>
			</view>
	  	  </view>
	  	</view>
	  </view>
    
</template>

<script setup>
	import { ref } from 'vue';
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'

	
	const username = ref('');
	const email = ref('');
	const password = ref('');
	const confirmPassword = ref('');
	
	const goToLogin = () => {
	  uni.navigateTo({
		url: 'login'
	  })
	}
	
	const handleRegister = () => {
	  // 简单的表单验证
	  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
	    uni.showToast({
	      title: '所有字段都是必填的',
	      icon: 'none'
	    });
	    return;
	  }
	
	  if (password.value !== confirmPassword.value) {
	    uni.showToast({
	      title: '密码和确认密码不匹配',
	      icon: 'none'
	    });
	    return;
	  }
	
	  // 发送注册请求
	  uni.request({
	    url: `${API_general_request_url.value}/api/user/register`, // 替换为你的注册接口地址
	    method: 'POST',
	    data: {
	      username: username.value,
	      email: email.value,
	      password: password.value
	    },
	    header: {
	      'Content-Type': 'application/json'
	    },
	    success: (res) => {
			console.log(res)
	      if (res.statusCode === 200 && res.data.code === "2000") {
	        uni.showToast({
	          title: '注册成功',
	          icon: 'success'
	        });
	        uni.navigateTo({ 
	        	url: "login"
	        });
	      } else {
	        uni.showToast({
	          // title: '注册失败，请重试',
			  title: res.data.msg || '注册失败，请重试',
	          icon: 'none'
	        });
	      }
	    },
	    fail: (err) => {
	      uni.showToast({
	        title: '网络错误，请重试',
	        icon: 'none'
	      });
	      console.error('注册请求失败', err);
	    }
	  });
	}
	
</script>

<style lang="scss" scoped>
	.container {
		width: 750rpx;
		height: 100vh;
		background-color: #f8f9fa;
		display: flex;
		flex-direction: column;
		align-items: center;
	  
		.layout{
			width: 90%;
			padding-top: 200rpx;
			.header {
				width: 100%;
				margin-bottom: 20px;
			  
				.title {
					font-size: 24px;
					font-weight: bold;
					color: #1f2d3d;
				}
			}
			
			.form {
				width: 100%;
			  
				.input-item {
					margin-bottom: 20px;
			    
					.input {
						width: 90%;
						padding: 15px;
						border-radius: 8px;
						background-color: #f2f4f7;
						font-size: 16px;
						border: none;
			    }
			    
			    .input-eye {
					position: absolute;
					right: 15px;
					top: 15px;
					width: 20px;
					height: 20px;
					// background-image: url('/static/eye-icon.png'); /* 假设您有一个小图标 */
			    }
			  }
			}
			
			.submit-button {
				margin-top: 20px;
				background-color: #4d8dff;
				color: #fff;
				width: 100%;
				padding: 15px;
				border-radius: 8px;
				font-size: 16px;
			}
			
			.footer {
				margin-top: 20px;
				.footer-text {
					font-size: 14px;
					color: #888;
				}
				.footer-link {
					font-size: 14px;
					color: #4d8dff;
				}
				.link {
					color: #4d8dff;
					font-weight: bold;
				}
			}
		}
	}
</style>
