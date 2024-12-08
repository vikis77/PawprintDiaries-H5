<template>
  <view class="comment-review">
    <!-- 顶部导航栏 -->
    <NavBar1001
      title="评论审核"
      :showLeft="true"
      :showRight="false"
    />
    
    <!-- 筛选区域 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <view 
          class="tab" 
          :class="{ active: commentType === 'all' }"
          @click="setCommentType('all')"
        >全部评论</view>
        <view 
          class="tab" 
          :class="{ active: commentType === 'post' }"
          @click="setCommentType('post')"
        >帖子评论</view>
        <view 
          class="tab" 
          :class="{ active: commentType === 'cat' }"
          @click="setCommentType('cat')"
        >猫咪评论</view>
      </view>
      
      <view class="sort-section">
        <text>排序：</text>
        <picker 
          :value="sortIndex" 
          :range="sortOptions" 
          @change="handleSortChange"
        >
          <view class="sort-picker">
            {{ sortOptions[sortIndex] }}
            <uni-icons type="bottom" size="12" />
          </view>
        </picker>
      </view>
    </view>

    <!-- 评论列表 -->
    <scroll-view 
      scroll-y 
      class="comment-list"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view 
        class="comment-item" 
        v-for="item in commentList" 
        :key="item.id"
      >
        <view class="comment-header">
          <view class="user-info">
            <image class="avatar" :src="item.userAvatar" mode="aspectFill" />
            <text class="username">{{ item.userName }}</text>
          </view>
          <text class="time">{{ item.createTime }}</text>
        </view>
        
        <view class="comment-content">
          {{ item.content }}
        </view>
        
        <view class="comment-source">
          来源：{{ item.type === 'post' ? '帖子评论' : '猫咪评论' }}
          <text class="source-title">{{ item.sourceName }}</text>
        </view>
        
        <view class="action-buttons">
          <button 
            class="btn approve" 
            @click="handleApprove(item.id)"
          >通过</button>
          <button 
            class="btn reject" 
            @click="handleReject(item.id)"
          >拒绝</button>
        </view>
      </view>
      
      <uni-load-more :status="loadMoreStatus" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import NavBar1001 from '@/src/components/common/NavBar1001.vue'

// 响应式变量
const commentType = ref('all')
const sortOptions = ['最新发布', '最早发布']
const sortIndex = ref(0)
const commentList = ref([])
const page = ref(1)
const isRefreshing = ref(false)
const loadMoreStatus = ref('more')

// 模拟数据
const mockComments = [
  {
    id: 1,
    userAvatar: '/static/avatar.png',
    userName: '用户1',
    createTime: '2023-12-07 10:00',
    content: '这只猫咪真可爱！',
    type: 'cat',
    sourceName: '橘猫小花'
  },
  {
    id: 2,
    userAvatar: '/static/avatar.png',
    userName: '用户2',
    createTime: '2023-12-07 09:30',
    content: '分享得很详细，感谢！',
    type: 'post',
    sourceName: '校园猫咪喂养指南'
  }
]

// 设置评论类型
const setCommentType = (type) => {
  commentType.value = type
  page.value = 1
  loadComments()
}

// 处理排序变化
const handleSortChange = (e) => {
  sortIndex.value = e.detail.value
  page.value = 1
  loadComments()
}

// 加载评论数据
const loadComments = () => {
  // TODO: 替换为实际的API调用
  setTimeout(() => {
    if (page.value === 1) {
      commentList.value = [...mockComments]
    } else {
      commentList.value = [...commentList.value, ...mockComments]
    }
    
    loadMoreStatus.value = commentList.value.length >= 20 ? 'noMore' : 'more'
    isRefreshing.value = false
  }, 1000)
}

// 审核通过
const handleApprove = (id) => {
  uni.showModal({
    title: '确认',
    content: '确定通过这条评论吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用审核通过API
        uni.showToast({
          title: '已通过',
          icon: 'success'
        })
        loadComments()
      }
    }
  })
}

// 审核拒绝
const handleReject = (id) => {
  uni.showModal({
    title: '确认',
    content: '确定拒绝这条评论吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用审核拒绝API
        uni.showToast({
          title: '已拒绝',
          icon: 'success'
        })
        loadComments()
      }
    }
  })
}

// 加载更多
const loadMore = () => {
  if (loadMoreStatus.value === 'more') {
    page.value++
    loadComments()
  }
}

// 刷新
const onRefresh = () => {
  isRefreshing.value = true
  page.value = 1
  loadComments()
}

// 初始加载
loadComments()

// 返回
const handleGoback = () => {
		uni.navigateBack()
	}

</script>

<style lang="scss" scoped>
.comment-review {
  min-height: 100vh;
  background-color: #f5f5f5;
  
  .filter-section {
    background-color: #fff;
    padding: 20rpx;
    margin-bottom: 20rpx;
    
    .filter-tabs {
      display: flex;
      margin-bottom: 20rpx;
      
      .tab {
        flex: 1;
        text-align: center;
        padding: 16rpx 0;
        font-size: 28rpx;
        color: #666;
        position: relative;
        
        &.active {
          color: #007AFF;
          font-weight: bold;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background-color: #007AFF;
            border-radius: 2rpx;
          }
        }
      }
    }
    
    .sort-section {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #333;
      
      .sort-picker {
        display: flex;
        align-items: center;
        margin-left: 20rpx;
        color: #007AFF;
      }
    }
  }
  
  .comment-list {
    height: calc(100vh - 300rpx);
    padding: 20rpx;
    box-sizing: border-box;
    
    .comment-item {
      background-color: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      
      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
        
        .user-info {
          display: flex;
          align-items: center;
          
          .avatar {
            width: 60rpx;
            height: 60rpx;
            border-radius: 30rpx;
            margin-right: 16rpx;
          }
          
          .username {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
          }
        }
        
        .time {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .comment-content {
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
        margin-bottom: 16rpx;
      }
      
      .comment-source {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 20rpx;
        
        .source-title {
          color: #007AFF;
          margin-left: 10rpx;
        }
      }
      
      .action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 20rpx;
        
        .btn {
          min-width: 140rpx;
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
          border-radius: 30rpx;
          font-size: 28rpx;
          
          &.approve {
            background-color: #007AFF;
            color: #fff;
          }
          
          &.reject {
            background-color: #fff;
            color: #FF3B30;
            border: 1rpx solid #FF3B30;
          }
        }
      }
    }
  }
}
</style> 