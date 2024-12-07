<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="left">
        <uni-icons type="settings" size="24" @click="toBeDeveloped" />
      </view>
      <view class="title">我的主页</view>
      <view class="right">
        <uni-icons type="chat" size="24" style="margin-right: 20rpx;" @click="toBeDeveloped" />
        <uni-icons type="more-filled" size="24" @click="toBeDeveloped" />
      </view>
    </view>
    <!-- 个人信息区域 -->
    <view class="profile-section">
      <view class="profile-header">
        <view class="user-info">
          <img class="avatar" :src="`${pic_general_request_url}/user_avatar/${user.avatar}`" mode="aspectFill"></img>
          <view class="info-right">
            <view class="username">{{ user.nickName || '未设置昵称' }}</view>
            <view class="user-id">ID: {{ user.userId || '未登录' }}</view>
            <view class="edit-profile" @click="goToEditProfile">编辑资料</view>
          </view>
        </view>
        <view class="signature">{{ user.signature || '这个人很懒，还没有签名' }}</view>
        <view class="profile-tags">
          <view class="tag" @click="toBeDeveloped">🐱 铲屎官</view>
          <view class="tag" @click="toBeDeveloped">📍 北京</view>
          <view class="tag" @click="toBeDeveloped">🏷️ 添加更多标签</view>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="stats-bar">
        <view class="stats-item" @click="toBeDeveloped">
          <view class="stats-number">{{ user.postCount || 0 }}</view>
          <view class="stats-label">笔记</view>
        </view>
        <view class="stats-item" @click="toBeDeveloped">
          <view class="stats-number">{{ user.followCount || 0 }}</view>
          <view class="stats-label">关注</view>
        </view>
        <view class="stats-item" @click="toBeDeveloped">
          <view class="stats-number">{{ user.fansCount || 0 }}</view>
          <view class="stats-label">粉丝</view>
        </view>
        <view class="stats-item" @click="toBeDeveloped">
          <view class="stats-number">0</view>
          <view class="stats-label">获赞</view>
        </view>
      </view>
    </view>

    <!-- 功能区 -->
    <!-- <view class="feature-section">
      <view class="feature-item" @click="toBeDeveloped">
        <uni-icons type="star" size="24" />
        <text>我的收藏</text>
      </view>
      <view class="feature-item" @click="toBeDeveloped">
        <uni-icons type="heart" size="24" />
        <text>我的点赞</text>
      </view>
      <view class="feature-item" @click="toBeDeveloped">
        <uni-icons type="calendar" size="24" />
        <text>浏览历史</text>
      </view>
      <view class="feature-item" @click="toBeDeveloped">
        <uni-icons type="wallet" size="24" />
        <text>我的钱包</text>
      </view>
    </view> -->

    <!-- 内容切换标签 -->
    <view class="tab-section">
      <view class="tab-header">
        <view class="tab-item" :class="{ active: activeTab === 'posts' }" @click="switchTab('posts')">
          <text>笔记</text>
        </view>
        <view class="tab-item" :class="{ active: activeTab === 'collections' }" @click="switchTab('collections')">
          <text>收藏</text>
        </view>
        <view class="tab-item" :class="{ active: activeTab === 'likes' }" @click="switchTab('likes')">
          <text>点赞</text>
        </view>
      </view>
    </view>

    <!-- 帖子列表区域 -->
    <scroll-view :scroll-top="scrollTop" scroll-y="true" class="post-list" 
                 :class="{'empty-state': !user.postList?.length}"
                 @scroll="handleScroll">
      <template v-if="user.postList?.length">
        <view class="content">
          <view v-for="post in user.postList" :key="post.postId" class="box">
            <img class="pic" :src="`${pic_general_request_url}/post_pics/${post.coverPicture}`" 
                   mode="aspectFill" @click="handlerClickPost(post.postId)"></img>
            <view class="post-info">
              <view class="text" @click="handlerClickPost(post.postId)">{{ post.title }}</view>
              <view class="stats">
                <view class="likes">
                  <img class="icon" src="../static/爱心.svg"></img>
                  <text>{{ post.likeCount }}</text>
                </view>
                <view class="comments">
                  <uni-icons type="chatbubble" size="18"></uni-icons>
                  <text>{{ post.commentCount }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="empty-state-content">
          <img src="../static/emp-common-empty state.png" mode="aspectFit"></img>
          <text>还没有发布任何内容</text>
          <button class="primary-button" @click="toBeDeveloped">去发布第一篇笔记</button>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

const API_general_request_url = ref('');
const pic_general_request_url = ref('');
if (process.env.NODE_ENV === 'development'){
  pic_general_request_url.value = "http://localhost:8000"
  API_general_request_url.value = "http://localhost:8080"
} else {
  pic_general_request_url.value = "https://cdn.luckyiur.com/catcat"
  API_general_request_url.value = "https://pawprintdiaries.luckyiur.com"
}

// 响应式变量
const activeTab = ref('posts')
const scrollTop = ref(0)
const user = ref({
  userId: '',
  username: '',
  nickName: '',
  email: '',
  phoneNumber: '',
  brithday: '',
  address: '',
  avatar: '',
  role: '',
  status: 0,
  createTime: '',
  updateTime: '',
  postCount: 0,
  fansCount: 0,
  followCount: 0,
  signature: '',
  postList: []
})

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab
  // TODO: 根据不同标签加载不同内容
  toBeDeveloped()
}

// 处理滚动
const handleScroll = (e) => {
  scrollTop.value = e.detail.scrollTop
}

// 点击帖子
const handlerClickPost = (postId) => {
  console.log(postId)
  uni.navigateTo({
    url:`/pages/Post?postId=${postId}`
  })
}

// 待开发功能提示
const toBeDeveloped = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 页面加载
onShow(() => {
  console.log("主页挂载")
  const token = uni.getStorageSync('token')
  console.log(token)
  if (token) {
    console.log(token)
    uni.request({
      url: `${API_general_request_url.value}/api/user/profile`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode === 200 && res.data.code === '2000') {
          user.value = res.data.data
          console.log("打印user:")
          console.log(user.value)
        } else {
          uni.removeStorageSync('token')
          uni.showToast({
            title: res.data.msg || '获取用户数据失败',
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
  } else {
    uni.removeStorageSync('token');
    uni.showToast({
      title: '未登录，请先登录',
      icon: 'none'
    })
  }
})

// 在script setup中添加导航方法
const goToEditProfile = () => {
  uni.navigateTo({
    url: '/pages/user/edit'
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f8f8f8;
  
  .nav-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    height: 120rpx;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    padding-top: 40rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .left, .right {
      display: flex;
      align-items: center;
      width: 100rpx;
    }
    
    .title {
      flex: 1;
      font-size: 34rpx;
      font-weight: 600;
      text-align: center;
    }
  }
  
  .profile-section {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .profile-header {
      .user-info {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20rpx;
        
        .avatar {
          width: 140rpx;
          height: 140rpx;
          border-radius: 50%;
          margin-right: 30rpx;
          border: 2rpx solid #f0f0f0;
        }
        
        .info-right {
          flex: 1;
          
          .username {
            font-size: 36rpx;
            font-weight: 600;
            margin-bottom: 10rpx;
          }
          
          .user-id {
            font-size: 24rpx;
            color: #999;
            margin-bottom: 20rpx;
          }
          
          .edit-profile {
            display: inline-block;
            padding: 10rpx 30rpx;
            border: 2rpx solid #ddd;
            border-radius: 30rpx;
            font-size: 24rpx;
            color: #333;
          }
        }
      }
      
      .signature {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
        line-height: 1.4;
      }
      
      .profile-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;
        
        .tag {
          padding: 8rpx 20rpx;
          background: #f5f5f5;
          border-radius: 20rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    
    .stats-bar {
      display: flex;
      justify-content: space-around;
      padding-top: 30rpx;
      border-top: 1rpx solid #f0f0f0;
      margin-top: 30rpx;
      
      .stats-item {
        text-align: center;
        
        .stats-number {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .stats-label {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
  
  .feature-section {
    display: flex;
    justify-content: space-around;
    background: #fff;
    padding: 30rpx 0;
    margin-bottom: 20rpx;
    
    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10rpx;
      
      text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
  
  .tab-section {
    background: #fff;
    
    .tab-header {
      display: flex;
      border-bottom: 1rpx solid #f0f0f0;
      
      .tab-item {
        flex: 1;
        display: flex;
        justify-content: center;
        padding: 24rpx 0;
        font-size: 28rpx;
        color: #666;
        position: relative;
        
        &.active {
          color: #333;
          font-weight: 600;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background: #333;
            border-radius: 2rpx;
          }
        }
      }
    }
  }
  
  .post-list {
    background: #fff;
    min-height: 400rpx;
    margin: 0 auto;
    width: 100%;
    
    &.empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 100rpx 0rpx;
    }
    
    .content {
      display: flex;
      flex-wrap: wrap;
      padding: 10rpx;
      
      .box {
        width: calc(50% - 10rpx);
        margin: 5rpx;
        border-radius: 12rpx;
        overflow: hidden;
        background: #fff;
        
        .pic {
          width: 100%;
          height: 400rpx;
          object-fit: cover;
        }
        
        .post-info {
          padding: 16rpx;
          
          .text {
            font-size: 26rpx;
            color: #333;
            line-height: 1.4;
            margin-bottom: 12rpx;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .stats {
            display: flex;
            gap: 20rpx;
            
            .likes, .comments {
              display: flex;
              align-items: center;
              gap: 6rpx;
              
              .icon {
                width: 24rpx;
                height: 24rpx;
              }
              
              text {
                font-size: 24rpx;
                color: #999;
              }
            }
          }
        }
      }
    }
    
    .empty-state-content {
      text-align: center;
      padding: 0rpx 0rpx;
      
      image {
        width: 240rpx;
        height: 240rpx;
        margin-bottom: 30rpx;
      }
      
      text {
        display: block;
        font-size: 28rpx;
        color: #999;
        margin-bottom: 30rpx;
      }
      
      .primary-button {
        display: inline-block;
        padding: 20rpx 60rpx;
        background: #333;
        color: #fff;
        border-radius: 40rpx;
        font-size: 28rpx;
      }
    }
  }
}
</style>
