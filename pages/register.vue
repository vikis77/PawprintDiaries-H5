<template>
  <view class="container">
	  <view class="layout">
	  	<view class="header">
	  	    <text class="title">注册并开始</text>
	  	  </view>
	  	
	  	  <view class="form">
	  	    <view class="input-item">
	  	      <input class="input" v-model="username" placeholder="用户名(仅限英文字母和数字，6-20位)" @input="validateUsername" />
              <text class="error-text" v-if="usernameError">{{ usernameError }}</text>
	  	    </view>
	  	    <view class="input-item">
	  	      <input class="input" v-model="email" placeholder="邮箱" @input="validateEmail" />
              <text class="error-text" v-if="emailError">{{ emailError }}</text>
	  	    </view>
	  	    <view class="input-item">
	  	      <input class="input" type="password" v-model="password" placeholder="密码(8-20位，包含大小写字母和数字)" @input="validatePassword" />
              <view class="password-strength" v-if="password">
                <text>密码强度：</text>
                <text :class="strengthClass">{{ passwordStrength }}</text>
              </view>
              <text class="error-text" v-if="passwordError">{{ passwordError }}</text>
	  	    </view>
	  	    <view class="input-item">
	  	      <input class="input" type="password" v-model="confirmPassword" placeholder="确认密码" @input="validateConfirmPassword" />
              <text class="error-text" v-if="confirmPasswordError">{{ confirmPasswordError }}</text>
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
	import { ref, computed } from 'vue';
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
	import { STATUS_CODE } from '@/src/constant/constant.js'
	
	const username = ref('');
	const email = ref('');
	const password = ref('');
	const confirmPassword = ref('');
    
    // 错误提示
    const usernameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const confirmPasswordError = ref('');
    const passwordStrength = ref('');
    const strengthClass = computed(() => {
        switch(passwordStrength.value) {
            case '弱': return 'strength-weak';
            case '中': return 'strength-medium';
            case '强': return 'strength-strong';
            default: return '';
        }
    });

    // 用户名验证
    const validateUsername = () => {
        const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;
        if (!username.value) {
            usernameError.value = '用户名不能为空';
        } else if (!usernameRegex.test(username.value)) {
            usernameError.value = '用户名必须是6-20位的英文字母和数字';
        } else {
            usernameError.value = '';
        }
    };

    // 邮箱验证
    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.value) {
            emailError.value = '邮箱不能为空';
        } else if (!emailRegex.test(email.value)) {
            emailError.value = '请输入有效的邮箱地址';
        } else {
            emailError.value = '';
        }
    };

    // 密码验证和强度检查
    const validatePassword = () => {
        const hasLetter = /[a-zA-Z]/.test(password.value);
        const hasNumbers = /\d/.test(password.value);
        const isLengthValid = password.value.length >= 8 && password.value.length <= 20;

        if (!password.value) {
            passwordError.value = '密码不能为空';
            passwordStrength.value = '';
        } else if (!isLengthValid) {
            passwordError.value = '密码长度必须在8-20位之间';
        } else if (!(hasLetter && hasNumbers)) {
            passwordError.value = '密码必须包含字母和数字';
        } else {
            passwordError.value = '';
        }

        // 计算密码强度
        let strength = 0;
        if (hasLetter) strength++;
        if (hasNumbers) strength++;
        if (/[A-Z]/.test(password.value)) strength++; // 额外加分：包含大写字母
        if (password.value.length >= 12) strength++;

        passwordStrength.value = strength <= 1 ? '弱' : strength === 2 ? '中' : '强';
    };

    // 确认密码验证
    const validateConfirmPassword = () => {
        if (!confirmPassword.value) {
            confirmPasswordError.value = '请确认密码';
        } else if (confirmPassword.value !== password.value) {
            confirmPasswordError.value = '两次输入的密码不一致';
        } else {
            confirmPasswordError.value = '';
        }
    };

    const goToLogin = () => {
      uni.navigateTo({
		url: 'login'
	  })
	}
	
	const handleRegister = () => {
        // 触发所有验证
        validateUsername();
        validateEmail();
        validatePassword();
        validateConfirmPassword();

        // 检查是否有错误
        if (usernameError.value || emailError.value || passwordError.value || confirmPasswordError.value) {
            uni.showToast({
                title: '请修正表单错误',
                icon: 'none'
            });
            return;
        }

        // 发送注册请求
        uni.request({
            url: `${API_general_request_url.value}/api/user/register`,
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
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
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

    .error-text {
        color: #ff4d4f;
        font-size: 12px;
        margin-top: 4px;
    }

    .password-strength {
        margin-top: 4px;
        font-size: 12px;

        .strength-weak {
            color: #ff4d4f;
        }

        .strength-medium {
            color: #faad14;
        }

        .strength-strong {
            color: #52c41a;
        }
    }
</style>
