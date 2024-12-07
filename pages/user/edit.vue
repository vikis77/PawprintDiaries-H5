<template>
  <view class="user-edit-container">
    <!-- 顶部返回按钮 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back">&#xe679;</text>
        <text class="back-text">返回</text>
      </view>
      <text class="page-title">编辑资料</text>
    </view>

    <!-- 用户基本信息编辑区域 -->
    <view class="user-info-section">
      <view class="avatar-section">
        <img :src="`${pic_general_request_url}/user_avatar/${userInfo.avatar}`" class="avatar" mode="aspectFill"/>
        <button class="upload-btn" @click="handleAvatarUpload">更换头像</button>
      </view>
      
      <view class="form-section">
        <uni-forms ref="formRef" :model="userInfo" :rules="rules">
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
            <uni-datetime-picker v-model="userInfo.birthday" type="date"/>
          </uni-forms-item>
          
          <uni-forms-item label="地址" name="address">
            <uni-easyinput v-model="userInfo.address" placeholder="请输入地址"/>
          </uni-forms-item>
          
          <uni-forms-item label="个性签名" name="signature">
            <uni-easyinput v-model="userInfo.signature" type="textarea" placeholder="请输入个性签名"/>
          </uni-forms-item>
        </uni-forms>
        
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
          <image :src="post.coverPicture" class="post-cover" mode="aspectFill"></image>
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
import { ref, reactive, onMounted } from 'vue';

const API_general_request_url = ref('');
const pic_general_request_url = ref('');

if (process.env.NODE_ENV === 'development') {
  pic_general_request_url.value = "http://localhost:8000";
  API_general_request_url.value = "http://localhost:8080";
} else {
  pic_general_request_url.value = "https://cdn.luckyiur.com/catcat";
  API_general_request_url.value = "https://pawprintdiaries.luckyiur.com";
}

const formRef = ref(null);

const userInfo = reactive({
  userId: "1001",
  username: "tttt",
  password: null,
  nickName: "dogdoggo",
  email: "dogdoggo@gamil.com",
  phoneNumber: "18888888888",
  birthday: 1600185600000,
  address: "广东省中山市石岐区电子科技大学中山学院",
  avatar: "1001.jpg",
  status: 1,
  createTime: 1726378759000,
  updateTime: null,
  postCount: 164,
  fansCount: 77,
  followCount: 25,
  signature: "今天开始我要自己上厕所。",
  postList: []
});

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

const handleAvatarUpload = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      console.log('选择的图片：', res.tempFilePaths[0]);
    }
  });
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    });
  } catch (e) {
    console.error(e);
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

onMounted(() => {
  userInfo.postList = [
    {
      postId: 1,
      title: "校园生活的一天",
      article: "今天我在校园里度过了一整天，参加了几节有趣的课，还和朋友们一起去咖啡馆放松。",
      authorId: 1001,
      likeCount: 120,
      collectingCount: 13,
      commentCount: 30,
      updateTime: "2024-09-15 02:00:00.000",
      coverPicture: "01-01.jpg",
      send_time: "2024-09-15 01:00:00.000"
    }
  ];
});
</script>

<style lang="scss" scoped>
.user-edit-container {
  padding: 20rpx;
}

.user-info-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;

  .avatar {
    width: 150rpx;
    height: 150rpx;
    border-radius: 75rpx;
    margin-bottom: 20rpx;
  }

  .upload-btn {
    font-size: 28rpx;
    padding: 10rpx 30rpx;
    background-color: #f0f0f0;
    border-radius: 30rpx;
  }
}

.form-section {
  padding: 20rpx;

  .submit-btn {
    margin-top: 30rpx;
    background-color: #007AFF;
    color: #ffffff;
    border-radius: 40rpx;
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
      height: 150rpx;
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