<template>
  <view class="user-edit-container">
    <NavBar1001 
      :title="'编辑资料'"
      :showLeft="true"
      :showRight="false"
    />  

    <!-- 用户基本信息编辑区域 -->
    <view class="user-info-section">
      <uni-forms ref="formRef" :model="userInfo" :rules="rules">
        <uni-forms-item label="头像" required class="avatar-item">
          <uni-file-picker
            ref="filePicker"
            mode="image"
            :file-mediatype="['image']"
            limit="1"
            :auto-upload="false"
            :value="selectedTempFiles"
            @select="selectAvatar"
            class="avatar-picker"
          >
            <template v-slot>
              <view v-if="selectedTempFilePaths.length > 0" class="avatar-preview-container" @click="handleReselect">
                <image 
                  :src="selectedTempFilePaths[0]" 
                  mode="aspectFill" 
                  class="avatar-preview"
                />
                <view class="avatar-hover-mask">
                  <text class="hover-text">点击重新选择</text>
                </view>
              </view>
              <view v-else-if="userInfo.avatar" class="avatar-preview-container" @click="handleReselect">
                <image 
                  :src="`${pic_general_request_url}/user_avatar/${userInfo.avatar}${Suffix_1002}`" 
                  mode="aspectFill" 
                  class="avatar-preview"
                />
                <view class="avatar-hover-mask">
                  <text class="hover-text">点击重新选择</text>
                </view>
              </view>
              <view v-else class="avatar-placeholder">
                <image src="/static/images/default-avatar.png" mode="aspectFill" class="default-avatar"/>
                <text class="placeholder-text">点击上传头像</text>
              </view>
            </template>
          </uni-file-picker>
        </uni-forms-item>
        
        <uni-forms-item label="用户名" name="username" required>
          <view class="input-wrapper" :class="{ error: !usernameValid && userInfo.username }">
            <uni-easyinput 
              v-model="userInfo.username" 
              placeholder="请输入用户名" 
              maxlength="20"
              :inputBorder="false"
            />
            <view class="counter-tips">{{userInfo.username?.length || 0}}/20</view>
          </view>
          <view class="input-tips-wrapper">
            <!-- <text class="input-tips">仅支持英文和数字，长度4-20位</text> -->
            <text v-if="!usernameValid && usernameError" class="error-tips">{{usernameError}}</text>
          </view>
        </uni-forms-item>
        
        <uni-forms-item label="昵称" name="nickName" required>
          <view class="input-wrapper">
            <uni-easyinput 
              v-model="userInfo.nickName" 
              placeholder="请输入昵称" 
              maxlength="12"
              :inputBorder="false"
            />
            <view class="counter-tips">{{userInfo.nickName?.length || 0}}/12</view>
          </view>
          <!-- <text class="input-tips">好名字让人更容易记住你</text> -->
        </uni-forms-item>
        
        <uni-forms-item label="邮箱" name="email" required>
          <view class="input-wrapper">
            <uni-easyinput 
              v-model="userInfo.email" 
              placeholder="请输入邮箱"
              :inputBorder="false"
            />
          </view>
          <view class="input-tips-wrapper">
            <!-- <text class="input-tips">可用于接收重要通知，请填写真实邮箱</text> -->
            <text v-if="!emailValid && emailError" class="error-tips">{{emailError}}</text>
          </view>
        </uni-forms-item>
        
        <uni-forms-item label="手机号" name="phoneNumber">
          <view class="input-wrapper">
            <uni-easyinput 
              v-model="userInfo.phoneNumber" 
              placeholder="请输入手机号"
              maxlength="11"
              type="number"
              :inputBorder="false"
            />
          </view>
          <view class="input-tips-wrapper">
            <!-- <text class="input-tips">绑定手机号可以获得更好的服务体验</text> -->
            <text v-if="!phoneValid && phoneError" class="error-tips">{{phoneError}}</text>
          </view>
        </uni-forms-item>
        
        <uni-forms-item label="生日" name="birthday">
          <view class="input-wrapper birthday-wrapper">
            <uni-datetime-picker 
              v-model="userInfo.birthday" 
              type="date" 
              :value="formatBirthday(userInfo.birthday)"
              @change="handleBirthdayChange"
            />
          </view>
          <!-- <text class="input-tips">生日信息仅自己可见</text> -->
        </uni-forms-item>
        
        <uni-forms-item label="地址" name="address">
          <view class="input-wrapper">
            <uni-easyinput 
              v-model="userInfo.address" 
              placeholder="请输入地址"
              maxlength="100"
              :inputBorder="false"
            />
            <view class="counter-tips">{{userInfo.address?.length || 0}}/100</view>
          </view>
          <!-- <text class="input-tips">详细地址让你的位置更精确</text> -->
        </uni-forms-item>
        
        <uni-forms-item label="个性签名" name="signature">
          <view class="input-wrapper">
            <uni-easyinput 
              v-model="userInfo.signature" 
              type="textarea" 
              placeholder="请输入个性签名"
              maxlength="200"
              :inputBorder="false"
              height="120"
            />
            <view class="counter-tips">{{userInfo.signature?.length || 0}}/200</view>
          </view>
          <!-- <text class="input-tips">展示你的个性，让大家更了解你</text> -->
        </uni-forms-item>
      </uni-forms>
      
      <view class="form-buttons">
        <button class="submit-btn" @click="handleSubmit">保存修改</button>
      </view>
    </view>

    <!-- 用户统计信息 -->
    <view class="user-stats">
      <view class="stat-item">
        <text class="stat-value">{{userInfo.postCount || 0}}</text>
        <text class="stat-label">帖子</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{userInfo.fansCount || 0}}</text>
        <text class="stat-label">粉丝</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{userInfo.followCount || 0}}</text>
        <text class="stat-label">关注</text>
      </view>
    </view>

    <!-- 用户帖子列表 -->
    <view class="posts-section">
      <text class="section-title">我的帖子</text>
      <view class="post-list">
        <view v-for="post in userInfo.postList" :key="post.postId" class="post-item">
          <img :src="`${pic_general_request_url}/post_pics/${post.coverPicture}${Suffix_1002}`" class="post-cover" mode="aspectFit"></img>
          <view class="post-info">
            <text class="post-title">{{post.title}}</text>
            <text class="post-content">{{post.article}}</text>
            <view class="post-stats">
              <text class="stat">点赞 {{post.likeCount}}</text>
              <text class="stat">收藏 {{post.collectingCount}}</text>
              <text class="stat">评论 {{post.commentCount}}</text>
            </view>
            <text class="post-time">{{formatTime(post.send_time)}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'
import NavBar1001 from '@/src/components/common/NavBar1001.vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const formRef = ref(null);
const filePicker = ref(null);
const selectedTempFilePaths = ref([]); // 存储已选择的图片的路径
const selectedTempFiles = ref([]); // 存储已选择的图片信息

const userInfo = appStore.userInfo;

const usernameValid = ref(true);
const usernameError = ref('');

const rules = {
  username: {
    rules: [
      {required: true, message: '亲爱的，用户名不能为空哦~'},
      {
        validateFunction: (rule, value, data, callback) => {
          const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
          if (!usernameRegex.test(value)) {
            callback('用户名只能包含英文和数字，长度4-20位');
          }
          return true;
        }
      }
    ]
  },
  nickName: {
    rules: [{required: true, message: '给自己起个好听的昵称吧~'}]
  },
  email: {
    rules: [
      {required: true, message: '请填写您的邮箱地址'},
      {
        validateFunction: (rule, value, data, callback) => {
          const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!emailRegex.test(value)) {
            callback('邮箱格式有误，请检查一下~');
          }
          return true;
        }
      }
    ]
  },
  phoneNumber: {
    rules: [
      {required: false},
      {
        validateFunction: (rule, value, data, callback) => {
          if (value && !/^1[3-9]\d{9}$/.test(value)) {
            callback('手机号格式不对，应为11位数字哦~');
          }
          return true;
        }
      }
    ]
  }
};

const emailValid = ref(true);
const phoneValid = ref(true);
const emailError = ref('');
const phoneError = ref('');

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  emailValid.value = emailRegex.test(email);
  emailError.value = emailValid.value ? '' : '邮箱格式有误，请检查一下~';
};

const validatePhone = (phone) => {
  if (!phone) {
    phoneValid.value = true;
    phoneError.value = '';
    return;
  }
  const phoneRegex = /^1[3-9]\d{9}$/;
  phoneValid.value = phoneRegex.test(phone);
  phoneError.value = phoneValid.value ? '' : '手机号格式不对，应为11位数字哦~';
};

watch(() => userInfo.email, (newVal) => {
  if (newVal) {
    validateEmail(newVal);
  } else {
    emailValid.value = true;
    emailError.value = '';
  }
}, { immediate: true });

watch(() => userInfo.phoneNumber, (newVal) => {
  validatePhone(newVal);
}, { immediate: true });

const handleReselect = (e) => {
  e.stopPropagation(); // 阻止事件冒泡
  // 先清空数据
  selectedTempFilePaths.value = [];
  selectedTempFiles.value = [];
  // 等待DOM更新
  nextTick(() => {
    // 再调用选择器
    filePicker.value?.choose();
  });
}

// 选择新头像
const selectAvatar = (files) => {
  selectedTempFilePaths.value = files.tempFilePaths;
  selectedTempFiles.value = files.tempFiles;
  console.log("已选择的文件路径列表:", selectedTempFilePaths.value);
  console.log("已选择的文件列表:", selectedTempFiles.value);
};

const handleSubmit = async () => {
    try {
        // 校验表单
        await formRef.value.validate();
    } catch (error) {
        uni.showToast({
            title: error.msg || '表单验证失败',
            icon: 'none'
        });
        return;
    }
    
    try {
        // 1、如果选择了新头像，先上传到七牛云
        if (selectedTempFiles.value && selectedTempFiles.value.length > 0) {
            // 1.1、获取上传凭证
            const tokenResponse = await uni.request({  
                url: `${API_general_request_url.value}/api/upload/qiniuUploadToken`,  
                method: 'GET',  
                header: {  
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`  
                }  
            });  
          
            if (tokenResponse.statusCode === 200 && tokenResponse.data.code === STATUS_CODE.SUCCESS) {  
                const uploadToken = tokenResponse.data.data.qiniuToken;  
                
                // 1.2、生成文件名（使用时间戳和随机数）
                const timestamp = new Date().getTime();
                const random = Math.floor(Math.random() * 1000);
                const fileExt = selectedTempFiles.value[0].name.split('.').pop();
                const fileName = `${timestamp}_${random}.${fileExt}`;
                
                try {
                    // 1.3、上传文件到七牛云  
                    const uploadRes = await new Promise((resolve, reject) => {  
                        uni.uploadFile({  
                            url: 'https://upload-z2.qiniup.com',  
                            filePath: selectedTempFiles.value[0].path,  
                            name: 'file',  
                            formData: {  
                                token: uploadToken,  
                                key: `catcat/user_avatar/${fileName}`  
                            },  
                            success: (res) => {  
                                if (res.statusCode === 200) {  
                                    resolve(res);  
                                } else {  
                                    reject(new Error(`头像上传失败: ${res.data || '未知错误'}`));  
                                }  
                            },  
                            fail: (error) => reject(new Error(`上传请求失败: ${error.errMsg || '未知错误'}`))
                        });  
                    });
                    
                    // 1.4、更新用户信息中的头像字段
                    userInfo.avatar = fileName;
                } catch (error) {
                    uni.showToast({
                        title: `头像上传失败: ${error.message}`,
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }
            } else {
                uni.showToast({
                    title: '获取上传凭证失败',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
        }

        // 2、持久化用户信息
        const updateResponse = await uni.request({
            url: `${API_general_request_url.value}/api/user/updateProfile`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`,
                'Content-Type': 'application/json'
            },
            data: userInfo
        });

        if (updateResponse.statusCode === 200 && updateResponse.data.code === STATUS_CODE.SUCCESS) {
            // 更新本地存储的用户信息
            appStore.setUserInfo(userInfo);
            uni.showToast({
                title: '更新成功',
                icon: 'success',
                duration: 1500
            });
            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        } else {
            uni.showToast({
                title: updateResponse.data.msg || '更新失败',
                icon: 'none'
            });
        }
    } catch (error) {
        uni.showToast({
            title: error.message || '操作失败',
            icon: 'none',
            duration: 2000
        });
    }
};

const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString();
};

const handleBack = () => {
  uni.navigateBack({
    delta: 1
  });
};

// 添加日期格式化函数
const formatBirthday = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('无效的日期:', e);
    return '';
  }
};

// 添加生日改变处理函数
const handleBirthdayChange = (e) => {
  console.log('生日改变：', e);
  if (e) {
    try {
      const date = new Date(e);
      userInfo.birthday = date.getTime();
    } catch (error) {
      console.error('Invalid date input:', error);
    }
  }
};

// 用户名验证函数
const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
  usernameValid.value = usernameRegex.test(username);
  usernameError.value = usernameValid.value ? '' : '用户名只能包含英文和数字，长度4-20位';
};

// 监听用户名输入
watch(() => userInfo.username, (newVal) => {
  if (newVal) {
    validateUsername(newVal);
  } else {
    usernameValid.value = true;
    usernameError.value = '';
  }
}, { immediate: true });

onMounted(() => {

});
</script>

<style lang="scss" scoped>
.user-edit-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20rpx;
}

.user-info-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx 24rpx;
//   margin: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  
  :deep(.uni-forms-item) {
    margin-bottom: 10rpx;
    
    .uni-forms-item__label {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 12rpx;
    }
    
    .is-required {
      color: #ff5a5f;
    }
    
    .uni-forms-item__content {
      padding: 0;
    }
  }
}

.avatar-item {
  :deep(.uni-file-picker__container) {
    width: 180rpx !important;
    height: 180rpx !important;
  }
  
  :deep(.uni-file-picker__box) {
    border-radius: 90rpx !important;
    overflow: hidden;
    border: 2rpx solid #e0e0e0;
  }
  
  // 隐藏文件名信息
  :deep(.file-picker__progress) {
    display: none !important;
  }
  
  :deep(.uni-file-picker__lists) {
    display: none !important;
  }
  
  .avatar-preview {
    width: 180rpx;
    height: 180rpx;
    border-radius: 90rpx;
    object-fit: cover;
    border: 2rpx solid #e0e0e0;
  }
  
  .avatar-placeholder {
    width: 180rpx;
    height: 180rpx;
    border-radius: 90rpx;
    background-color: #f8f9fa;
    border: 2rpx solid #e0e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    
    .default-avatar {
      width: 80rpx;
      height: 80rpx;
      opacity: 0.5;
    }
    
    .placeholder-text {
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;
    }
  }
}

.avatar-preview-container {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  border-radius: 90rpx;
  overflow: hidden;
  
  .avatar-hover-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    
    .hover-text {
      color: #fff;
      font-size: 24rpx;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }
  
  &:active .avatar-hover-mask {
    opacity: 1;
  }
}

.form-buttons {
  margin-top: 60rpx;
  padding: 0 20rpx;
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(45deg, #8d5da3, #b876d9);
    border-radius: 44rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border: none;
    box-shadow: 0 4rpx 12rpx rgba(184, 118, 217, 0.3);
    
    &:active {
      transform: scale(0.98);
    }
  }
}

.user-stats {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-value {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .stat-label {
      font-size: 24rpx;
      color: #666;
      margin-top: 8rpx;
    }
  }
}

.posts-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .post-item {
    display: flex;
    padding: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .post-cover {
      width: 200rpx;
      height: 200rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }

    .post-info {
      flex: 1;

      .post-title {
        font-size: 28rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }

      .post-content {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 10rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .post-stats {
        display: flex;
        font-size: 24rpx;
        color: #999;

        .stat {
          margin-right: 20rpx;
        }
      }

      .post-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.nav-bar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 88rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
  z-index: 100;

  .back-btn {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20rpx;
    
    .icon-back {
      font-size: 36rpx;
      color: #333;
    }
    
    .back-text {
      font-size: 28rpx;
      color: #333;
      margin-left: 8rpx;
    }
  }

  .page-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
}

.input-wrapper {
  position: relative;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 0rpx 0rpx;
  border: 2rpx solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #8d5da3;
    box-shadow: 0 0 8rpx rgba(141, 93, 163, 0.1);
  }
  
  &.error {
    border-color: #ff5a5f;
    background-color: #fff2f2;
  }
  
  :deep(.uni-easyinput__content) {
    min-height: 88rpx;
    background-color: transparent;
    
    .uni-easyinput__placeholder-class {
      color: #bbb;
    }
    
    .uni-input-input {
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .counter-tips {
    position: absolute;
    right: 20rpx;
    bottom: 10rpx;
    font-size: 24rpx;
    color: #bbb;
  }
}

.birthday-wrapper {
  :deep(.uni-date) {
    width: 100%;
    
    .uni-date-editor {
      padding: 0 0rpx;
      
      .uni-date-editor--x {
        height: 88rpx;
      }
    }
  }
}

.input-tips {
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
  padding-left: 20rpx;
}

.input-tips-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-top: 12rpx;
  padding-left: 20rpx;
}

.error-tips {
  font-size: 24rpx;
  color: #ff5a5f;
}
</style> 