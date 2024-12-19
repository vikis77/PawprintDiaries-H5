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
                  :src="`${pic_general_request_url}/user_avatar/${userInfo.avatar}`" 
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
        
        <uni-forms-item label="用户名" name="username">
          <uni-easyinput v-model="userInfo.username" placeholder="请输入用户名"/>
        </uni-forms-item>
        
        <uni-forms-item label="昵称" name="nickName">
          <uni-easyinput v-model="userInfo.nickName" placeholder="请输入昵称"/>
        </uni-forms-item>
        
        <uni-forms-item label="邮箱" name="email">
          <uni-easyinput v-model="userInfo.email" placeholder="请输入邮箱"/>
        </uni-forms-item>
        
        <uni-forms-item label="手机号" name="phoneNumber">
          <uni-easyinput v-model="userInfo.phoneNumber" placeholder="请输入手机号"/>
        </uni-forms-item>
        
        <uni-forms-item label="生日" name="birthday">
          <uni-datetime-picker 
            v-model="userInfo.birthday" 
            type="date" 
            :value="formatBirthday(userInfo.birthday)"
            @change="handleBirthdayChange"
          />
        </uni-forms-item>
        
        <uni-forms-item label="地址" name="address">
          <uni-easyinput v-model="userInfo.address" placeholder="请输入地址"/>
        </uni-forms-item>
        
        <uni-forms-item label="个性签名" name="signature">
          <uni-easyinput v-model="userInfo.signature" type="textarea" placeholder="请输入个性签名"/>
        </uni-forms-item>
      </uni-forms>
      
      <view class="form-buttons">
        <button class="submit-btn" @click="handleSubmit">保存修改</button>
      </view>
    </view>

    <!-- 用户统计信息 -->
    <view class="user-stats">
      <view class="stat-item">
        <text class="stat-value">{{userInfo.postCount}}</text>
        <text class="stat-label">帖子</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{userInfo.fansCount}}</text>
        <text class="stat-label">粉丝</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{userInfo.followCount}}</text>
        <text class="stat-label">关注</text>
      </view>
    </view>

    <!-- 用户帖子列表 -->
    <view class="posts-section">
      <text class="section-title">我的帖子</text>
      <view class="post-list">
        <view v-for="post in userInfo.postList" :key="post.postId" class="post-item">
          <img :src="`${pic_general_request_url}/post_pics/${post.coverPicture}`" class="post-cover" mode="aspectFit"></img>
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
import { ref, reactive, onMounted, nextTick } from 'vue';
import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
import NavBar1001 from '@/src/components/common/NavBar1001.vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const formRef = ref(null);
const filePicker = ref(null);
const selectedTempFilePaths = ref([]); // 存储已选择的图片的路径
const selectedTempFiles = ref([]); // 存储已选择的图片信息

const userInfo = appStore.userInfo;

const rules = {
  username: {
    rules: [{required: true, message: '请输入用户名'}]
  },
  nickName: {
    rules: [{required: true, message: '请输入昵称'}]
  },
  email: {
    rules: [{required: true, message: '请输入邮箱'}, {format: 'email', message: '邮箱格式不正确'}]
  },
  phoneNumber: {
    rules: [{required: true, message: '请输入手机号'}, {pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确'}]
  }
};

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
    
    // 如果选择了新头像，先上传到七牛云
    if (selectedTempFiles.value && selectedTempFiles.value.length > 0) {
      // 获取上传凭证
      const response = await uni.request({  
        url: `${API_general_request_url.value}/api/upload/qiniuUploadToken`,  
        method: 'GET',  
        header: {  
          'Authorization': `Bearer ${uni.getStorageSync('token')}`  
        }  
      });  
      
      if (response.statusCode === 200 && response.data.code === '2000') {  
        const uploadToken = response.data.data.qiniuToken;  
        try {
          // 上传文件到七牛云  
          const uploadRes = await new Promise((resolve, reject) => {  
            uni.uploadFile({  
              url: 'https://upload-z2.qiniup.com',  
              filePath: selectedTempFiles.value[0].path,  
              name: 'file',  
              formData: {  
                token: uploadToken,  
                key: `catcat/user_avatar/${selectedTempFiles.value[0].name}`  
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
          // 更新用户信息中的头像字段
          userInfo.avatar = selectedTempFiles.value[0].name;
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

    // 提交用户信息
    const updateResponse = await uni.request({
      url: `${API_general_request_url.value}/api/user/updateProfile`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`,
        'Content-Type': 'application/json'
      },
      data: userInfo
    });

    if (updateResponse.statusCode === 200 && updateResponse.data.code === '2000') {
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
      title: error.message || '表单验证失败',
      icon: 'none'
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
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  
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
  display: flex;
  gap: 24rpx;
  padding: 0 40rpx;
  
  button {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .submit-btn {
    background: linear-gradient(45deg, #8d5da3, #b876d9);
    color: #fff;
    border: none;
  }
  
  .cancel-btn {
    background: #fff;
    color: #666;
    border: 2rpx solid #ddd;
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
</style> 