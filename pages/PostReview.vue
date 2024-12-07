<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <img src="../static/arrow.svg" mode="aspectFit" class="back-icon"/>
      </view>
      <text class="title">帖子审核</text>
    </view>

    <!-- 帖子列表 -->
    <scroll-view 
      scroll-y="true" 
      class="post-list"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresh"
    >
      <view v-if="posts.length === 0" class="empty-state">
        <text>暂无待审核的帖子</text>
      </view>
      
      <view v-else v-for="post in posts" :key="post.postId" class="post-item">
        <view class="post-header">
          <img class="avatar" :src="`${picUrl}/user_avatar/${post.authorAvatar}`" mode="aspectFill"/>
          <text class="nickname">{{ post.authorNickname }}</text>
          <text class="time">{{ formatTime(post.sendTime) }}</text>
        </view>
        
        <view class="post-content" @click="showPostDetail(post)">
          <text class="post-title">{{ post.title }}</text>
          <img 
            v-if="post.coverPicture" 
            :src="`${picUrl}/post_pics/${post.coverPicture}`" 
            mode="aspectFill" 
            class="post-img"
          />
        </view>
        
        <view class="action-buttons">
          <button class="approve-btn" @click="handleApprove(post.postId)">通过</button>
          <button class="reject-btn" @click="handleReject(post.postId)">拒绝</button>
        </view>
      </view>
      
      <uni-load-more :status="loadMoreStatus" />
    </scroll-view>

    <!-- 帖子详情弹窗 -->
    <uni-popup ref="postDetailPopup" type="center">
      <view class="post-detail-popup">
        <view class="popup-header">
          <text class="popup-title">帖子详情</text>
          <text class="close-btn" @click="closePostDetail">×</text>
        </view>
        <scroll-view scroll-y="true" class="popup-content">
          <view v-if="selectedPost" class="detail-content">
            <text class="detail-title">{{ selectedPost.title }}</text>
            <rich-text :nodes="selectedPost.content"></rich-text>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080' 
  : 'https://pawprintdiaries.luckyiur.com';
  
const picUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : 'https://cdn.luckyiur.com/catcat';

const posts = ref([
  {
    postId: 1,
    title: "校园里的小橘猫",
    content: "<p>今天在图书馆门口遇到一只特别可爱的小橘猫，它正在晒太阳，看起来很惬意。希望大家看到它的时候可以温柔对待~</p><p>这只猫咪性格很好，不怕人，可以近距离拍照，但是建议不要打扰它休息。</p>",
    coverPicture: "post1.jpg", // 这里用实际的图片名替换
    authorNickname: "猫咪爱好者",
    authorAvatar: "avatar1.jpg", // 这里用实际的头像图片名替换
    sendTime: new Date("2024-03-20").getTime(),
    likeCount: 42
  },
  {
    postId: 2,
    title: "新发现的猫猫据点！",
    content: "<p>在教学楼C区后面的小花园发现了一个新的猫猫聚集地！已经看到有3-4只不同的猫咪在这里活动。</p><p>建议大家投喂的时候注意不要留下垃圾，保持环境整洁。</p>",
    coverPicture: "post2.jpg",
    authorNickname: "爱心投喂员",
    authorAvatar: "avatar2.jpg",
    sendTime: new Date("2024-03-21").getTime(),
    likeCount: 38
  },
  {
    postId: 3,
    title: "求助：发现一只受伤的小猫",
    content: "<p>在食堂后面发现一只小黑猫，后腿似乎受伤了，行动不太方便。希望有经验的同学可以来看看，需要送医院吗？</p>",
    coverPicture: "post3.jpg",
    authorNickname: "爱心同学",
    authorAvatar: "avatar3.jpg",
    sendTime: new Date("2024-03-22").getTime(),
    likeCount: 56
  }
]);
const isTriggered = ref(false);
const loadMoreStatus = ref('more');
const postDetailPopup = ref(null);
const selectedPost = ref(null);

// 注释掉原来的 fetchPosts 函数，使用模拟数据
const fetchPosts = async () => {
  // 模拟 API 请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  // 这里直接使用上面定义的模拟数据，不需要实际发送请求
  // posts.value 已经在上面设置了初始值
};

// 处理审核通过
const handleApprove = async (postId) => {
  try {
    const token = uni.getStorageSync('token');
    const response = await axios.post(`${API_URL}/api/post/approve/${postId}`, null, {
      headers: { Authorization: token }
    });

    if (response.data.code === '2000') {
      uni.showToast({
        title: '审核通过',
        icon: 'success'
      });
      await fetchPosts();
    }
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

// 处理审核拒绝
const handleReject = async (postId) => {
  try {
    const token = uni.getStorageSync('token');
    const response = await axios.post(`${API_URL}/api/post/reject/${postId}`, null, {
      headers: { Authorization: token }
    });

    if (response.data.code === '2000') {
      uni.showToast({
        title: '已拒绝',
        icon: 'success'
      });
      await fetchPosts();
    }
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

// 显示帖子详情
const showPostDetail = (post) => {
  selectedPost.value = post;
  postDetailPopup.value.open();
};

// 关闭帖子详情
const closePostDetail = () => {
  postDetailPopup.value.close();
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 下拉刷新
const onRefresh = async () => {
  isTriggered.value = true;
  await fetchPosts();
  isTriggered.value = false;
};

onMounted(() => {
  fetchPosts();
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #f5f5f5;
  
  .header {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #ffffff;
    position: relative;
    
    .back-btn {
      padding: 20rpx;
      
      .back-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
    
    .title {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      font-weight: bold;
    }
  }

  .post-list {
    height: calc(100vh - 88rpx);
    
    .empty-state {
      text-align: center;
      padding: 40rpx;
      color: #999;
    }
    
    .post-item {
      margin: 20rpx;
      padding: 20rpx;
      background-color: #ffffff;
      border-radius: 12rpx;
      
      .post-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .nickname {
          font-size: 28rpx;
          color: #333;
          flex: 1;
        }
        
        .time {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .post-content {
        .post-title {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 20rpx;
        }
        
        .post-img {
          width: 100%;
          height: 300rpx;
          border-radius: 8rpx;
        }
      }
      
      .action-buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 20rpx;
        gap: 20rpx;
        
        button {
          padding: 10rpx 30rpx;
          border-radius: 30rpx;
          font-size: 28rpx;
        }
        
        .approve-btn {
          background-color: #07c160;
          color: #ffffff;
        }
        
        .reject-btn {
          background-color: #ff4d4f;
          color: #ffffff;
        }
      }
    }
  }
}

.post-detail-popup {
  width: 80vw;
  max-height: 80vh;
  background-color: #ffffff;
  border-radius: 12rpx;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1rpx solid #eee;
    
    .popup-title {
      font-size: 32rpx;
      font-weight: bold;
    }
    
    .close-btn {
      font-size: 40rpx;
      color: #999;
      padding: 10rpx;
    }
  }
  
  .popup-content {
    padding: 20rpx;
    max-height: calc(80vh - 100rpx);
    
    .detail-content {
      .detail-title {
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
      }
    }
  }
}
</style> 