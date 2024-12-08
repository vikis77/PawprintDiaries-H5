<template>
  <view class="post-review">
    <NavBar1001 
      title="帖子审核" 
      :showLeft="true"
      :showRight="false"
    />

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
          <img class="avatar" :src="`${pic_general_request_url}/user_avatar/${post.authorAvatar}`" mode="aspectFill"/>
          <text class="nickname">{{ post.authorNickname }}</text>
          <text class="time">{{ formatTime(post.sendTime) }}</text>
        </view>
        
        <view class="post-content" @click="showPostDetail(post)">
          <text class="post-title">{{ post.title }}</text>
          <img 
            v-if="post.coverPicture" 
            :src="`${pic_general_request_url}/post_pics/${post.coverPicture}`" 
            mode="aspectFill" 
            class="post-img"
          />
        </view>
        
        <view class="action-buttons">
          <button class="approve-btn" @click="handleApprove(post.postId)">通过</button>
          <button class="reject-btn" @click="handleReject(post.postId)">拒绝</button>
        </view>
      </view>
    </scroll-view>

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
import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
import NavBar1001 from '@/src/components/common/NavBar1001.vue';

const posts = ref([
  {
    postId: 1,
    title: "校园里的小橘猫",
    content: "<p>今天在图书馆门口遇到一只特别爱的小橘猫，它正在晒太阳，看起来很惬意。希望大家看到它的时候可以温柔对待~</p>",
    coverPicture: "post1.jpg",
    authorNickname: "猫咪爱好者",
    authorAvatar: "avatar1.jpg",
    sendTime: new Date("2024-03-20").getTime()
  },
  {
    postId: 2,
    title: "新发现的猫猫据点！",
    content: "<p>在教学楼C区后面的小花园发现了一个新的猫猫聚集地！已经看到有3-4只不同的猫咪在这里活动。</p>",
    coverPicture: "post2.jpg",
    authorNickname: "爱心投喂员",
    authorAvatar: "avatar2.jpg",
    sendTime: new Date("2024-03-21").getTime()
  }
]);

const isTriggered = ref(false);
const postDetailPopup = ref(null);
const selectedPost = ref(null);

const handleApprove = async (postId) => {
  try {
    uni.showToast({
      title: '审核通过',
      icon: 'success'
    });
    posts.value = posts.value.filter(post => post.postId !== postId);
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

const handleReject = async (postId) => {
  try {
    uni.showToast({
      title: '已拒绝',
      icon: 'success'
    });
    posts.value = posts.value.filter(post => post.postId !== postId);
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

const showPostDetail = (post) => {
  selectedPost.value = post;
  postDetailPopup.value.open();
};

const closePostDetail = () => {
  postDetailPopup.value.close();
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const onRefresh = async () => {
  isTriggered.value = true;
  setTimeout(() => {
    isTriggered.value = false;
  }, 1000);
};

onMounted(() => {
  // 初始化时不需要额外操作，因为已经有了模拟数据
});
</script>

<style lang="scss" scoped>
.post-review {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.post-list {
  flex: 1;
  height: calc(100vh - 150rpx);
}

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
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

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

.post-content {
  margin-bottom: 20rpx;
}

.post-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.post-img {
  width: 100%;
  height: 300rpx;
  border-radius: 8rpx;
  object-fit: cover;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

button {
  min-width: 160rpx;
  padding: 16rpx 32rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  border: none;
}

.approve-btn {
  background-color: #07c160;
  color: #ffffff;
}

.reject-btn {
  background-color: #ff4d4f;
  color: #ffffff;
}

.post-detail-popup {
  width: 80vw;
  max-height: 80vh;
  background-color: #ffffff;
  border-radius: 12rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}

.popup-content {
  padding: 20rpx;
  max-height: calc(80vh - 100rpx);
}

.detail-content {
  .detail-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
}
</style> 