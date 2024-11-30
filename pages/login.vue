<template>
  <view class="container">
		<view class="layout">
			<!-- 返回按钮 -->
			<view class="t9h0h">
				<view class="back-button" @click="goBack">
					<img class="back-icon" src="../static/返回.png" alt="" />
				</view>
			</view>
			
			<view class="header">
				<text class="title">登录</text>
			  </view>
			
			  <view class="form">
				<view class="input-item">
				  <input class="input"  focus v-model="email" placeholder="邮箱/账号"/>
				</view>
				<view class="input-item">
				  <input class="input" type="password" placeholder="密码" v-model="password"/>
				  <view class="input-eye"></view>
				</view>
			  </view>
			
			  <view class="footer">
					<view class="footer-text">
						还没有账号？
						<text @click="goToRegister" class="link">立即注册</text>
					</view>
			  </view>
			
			  <button class="submit-button" @click="handleLogin" type="primary">登录</button>
			</view>
		</view>
    
</template>

<script setup>
	import { ref } from 'vue'
	import { jwtDecode } from "jwt-decode";
	
	const API_general_request_url = ref('');
	const pic_general_request_url = ref('');
	if (process.env.NODE_ENV === 'development'){
		// 图片
		pic_general_request_url.value = "http://localhost:8000"
		// 请求
		API_general_request_url.value = "http://localhost:8080"
	} else {
		// 图片
		pic_general_request_url.value = "https://cdn.luckyiur.com/catcat"
		// 请求
		API_general_request_url.value = "https://pawprintdiaries.luckyiur.com"
	}
	
	// 响应式变量绑定表单数据
	const email = ref('')
	const password = ref('')
	
	// 跳转到注册页面
	const goToRegister = () => {
		uni.navigateTo({
			url: "/pages/register"
		})
	}
	
	// 返回上一页
	const goBack = () => {
	  uni.reLaunch({
	  	url: "/pages/Home"
	  })
	}
	
	// 登录逻辑
	const handleLogin = () => {
		if (!email.value || !password.value) {
			uni.showToast({
			title: '请填写完整信息',
			icon: 'none'
			})
			// return
		}
		// 发起登录请求
		uni.request({
			url: `${API_general_request_url.value}/api/user/login`, // 替换为实际的登录接口地址
			method: 'POST',
			data: {
			  username: email.value,
			  password: password.value,
			  // username: "tttt",
			  // password: "1234"
			},
			success: (res) => {
				console.log(res)
				if (res.statusCode === 200 && res.data.code === "2000") {
					// 登录成功逻辑
					
					// 保存 token
					const token = res.data.data.token;
					uni.setStorageSync('token', token); // 使用同步存储
					if (token) {
					    try {
					        const decoded = jwtDecode(token);
					        console.log("Decoded Token:", decoded); // 输出解码后的 token 信息
					        // 示例：获取用户名
					        const username = decoded.username;
							const userId = decoded.userId;
					  //       console.log("用户名:", username);
					  //       console.log("uerId:", userId);
							const tokenDetail = {
								'exp': decoded.exp,
								'username': decoded.sub,
								'userId': decoded.jti
							}
							uni.setStorageSync('tokenDetail',tokenDetail);
					    } catch (error) {
					        console.error("Token 解码失败:", error);
					    }
					}
					uni.showToast({
					title: '登录成功',
					icon: 'success'
					})
					
					// 跳转到主页
					uni.switchTab({
					url: '/pages/Home'
					})
				} else {
					// 登录失败处理
					uni.showToast({
					title: res.data.msg || '登录失败',
					icon: 'none'
					})
				}
			},
			fail: () => {
				uni.showToast({
					title: '请求失败，请重试',
					icon: 'none'
				})
			}
		})
	}
</script>

<style scoped>
	.container {
		/* width: 750rpx; */
		height: 100vh;
		background-color: #f8f9fa;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.layout{
			width: 80%;
			margin-top: 150rpx;
			
			.t9h0h{
				width: 100%;
				height: 250rpx;
				
				.back-button{
					width: 100rpx;
					height: 100rpx;
					.back-icon{
						width: 100rpx;
						height: 100rpx;
					}
				}
			}
			
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
			      background-image: url('../static/导航.png'); /* 假设您有一个小图标 */
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
			    
			    .link {
			      color: #4d8dff;
			      font-weight: bold;
			    }
			  }
			}
		}
		
	}










</style>
