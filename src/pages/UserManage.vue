<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <NavBar1001 
      title="用户管理"
      :showLeft="true"
      :showRight="false"
    />

    <!-- 搜索栏 -->
    <view class="search-box">
      <view class="search-input">
        <img src="../../static/search.png" class="search-icon"/>
        <input 
          type="text" 
          v-model="searchKeyword"
          placeholder="搜索用户名/昵称" 
          @confirm="handleSearch"
        />
      </view>
      <button class="search-btn" @click="handleSearch">搜索</button>
    </view>

    <!-- 用户列表 -->
    <scroll-view 
      scroll-y="true" 
      class="user-list"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <view v-if="users.length === 0" class="empty-state">
        <text>暂无用户数据</text>
      </view>
      
      <view v-else v-for="user in users" :key="user.userId" class="user-item">
        <view class="user-info">
          <img class="avatar" :src="`${picUrl}/user_avatar/${user.avatar}`" mode="aspectFill"/>
          <view class="user-detail">
            <view class="user-name">
              <text class="nickname">{{ user.nickname }}</text>
              <text class="username">({{ user.username }})</text>
            </view>
            <text class="register-time">注册时间: {{ formatTime(user.registerTime) }}</text>
          </view>
        </view>
        
        <view class="role-control">
          <text class="current-role">{{ user.role === 'ADMIN' ? '管理员' : '普通用户' }}</text>
          <button 
            class="role-btn" 
            :class="{ 'admin': user.role === 'ADMIN' }"
            @click="handleRoleChange(user)"
          >
            {{ user.role === 'ADMIN' ? '取消管理员' : '设为管理员' }}
          </button>
        </view>
      </view>
      
      <uni-load-more :status="loadMoreStatus" />
    </scroll-view>

    <!-- 确认弹窗 -->
    <uni-popup ref="confirmPopup" type="dialog">
      <uni-popup-dialog
        type="info"
        cancelText="取消"
        confirmText="确定"
        title="修改角色"
        :content="confirmContent"
        @confirm="confirmRoleChange"
        @close="closeConfirmDialog"
      />
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js';
import NavBar1001 from '@/src/components/common/NavBar1001.vue';

// 响应式数据
const users = ref([]);
const searchKeyword = ref('');
const isTriggered = ref(false);
const loadMoreStatus = ref('more');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const confirmPopup = ref(null);
const confirmContent = ref('');
const selectedUser = ref(null);

// 模拟数据
const mockUsers = [
  {
    userId: 1,
    username: 'user1',
    nickname: '猫咪爱好者',
    avatar: 'avatar1.jpg',
    registerTime: new Date('2024-01-01').getTime(),
    role: 'USER'
  },
  {
    userId: 2,
    username: 'admin1',
    nickname: '超级管理员',
    avatar: 'avatar2.jpg',
    registerTime: new Date('2024-02-01').getTime(),
    role: 'ADMIN'
  },
  {
    userId: 3,
    username: 'user2',
    nickname: '爱心铲屎官',
    avatar: 'avatar3.jpg',
    registerTime: new Date('2024-03-01').getTime(),
    role: 'USER'
  }
];

// 获取用户列表
const fetchUsers = async (page = 1, keyword = '') => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟搜索和分页
    let filteredUsers = [...mockUsers];
    if (keyword) {
      filteredUsers = mockUsers.filter(user => 
        user.username.includes(keyword) || user.nickname.includes(keyword)
      );
    }
    
    const start = (page - 1) * pageSize.value;
    const end = start + pageSize.value;
    const pageUsers = filteredUsers.slice(start, end);
    
    if (page === 1) {
      users.value = pageUsers;
    } else {
      users.value = [...users.value, ...pageUsers];
    }
    
    total.value = filteredUsers.length;
    loadMoreStatus.value = end >= total.value ? 'noMore' : 'more';
    
    /* 实际API调用代码
    const token = uni.getStorageSync('token');
    const response = await axios.get(`${API_URL}/api/user/list`, {
      params: {
        page,
        pageSize: pageSize.value,
        keyword
      },
      headers: { Authorization: token }
    });

    if (response.data.code === '2000') {
      if (page === 1) {
        users.value = response.data.data.records;
      } else {
        users.value = [...users.value, ...response.data.data.records];
      }
      total.value = response.data.data.total;
      loadMoreStatus.value = users.value.length >= total.value ? 'noMore' : 'more';
    }
    */
  } catch (error) {
    uni.showToast({
      title: '获取用户列表失败',
      icon: 'none'
    });
  }
};

// 搜索用户
const handleSearch = () => {
  currentPage.value = 1;
  fetchUsers(1, searchKeyword.value);
};

// 加载更多
const loadMore = () => {
  if (loadMoreStatus.value === 'noMore') return;
  
  loadMoreStatus.value = 'loading';
  currentPage.value++;
  fetchUsers(currentPage.value, searchKeyword.value);
};

// 处理角色变更
const handleRoleChange = (user) => {
  selectedUser.value = user;
  confirmContent.value = `确定要${user.role === 'ADMIN' ? '取消' : '设置'} ${user.nickname} 的管理员权限吗？`;
  confirmPopup.value.open();
};

// 确认角色变更
const confirmRoleChange = async () => {
  try {
    const token = uni.getStorageSync('token');
    const newRole = selectedUser.value.role === 'ADMIN' ? 'USER' : 'ADMIN';
    
    /* 实际API调用代码
    const response = await axios.post(`${API_URL}/api/user/role`, {
      userId: selectedUser.value.userId,
      role: newRole
    }, {
      headers: { Authorization: token }
    });

    if (response.data.code === '2000') {
    */
    
    // 模拟API响应
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 更新本地数据
    const userIndex = users.value.findIndex(u => u.userId === selectedUser.value.userId);
    if (userIndex !== -1) {
      users.value[userIndex].role = newRole;
    }
    
    uni.showToast({
      title: '角色修改成功',
      icon: 'success'
    });
    
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
  confirmPopup.value.close();
};

// 关闭确认弹窗
const closeConfirmDialog = () => {
  selectedUser.value = null;
  confirmPopup.value.close();
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
  currentPage.value = 1;
  await fetchUsers(1, searchKeyword.value);
  isTriggered.value = false;
};

onMounted(() => {
  fetchUsers();
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  
  .search-box {
    width: 95%;
    padding: 20rpx;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    
    .search-input {
      flex: 1;
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 30rpx;
      padding: 10rpx 20rpx;
      margin-right: 20rpx;
      
      .search-icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 10rpx;
      }
      
      input {
        flex: 1;
        font-size: 28rpx;
      }
    }
    
    .search-btn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background-color: #07c160;
      color: #ffffff;
      border-radius: 30rpx;
      font-size: 28rpx;
    }
  }

  .user-list {
    width: 100%;
    padding-bottom: 20rpx;
    
    .empty-state {
      text-align: center;
      padding: 40rpx;
      color: #999;
    }
    
    .user-item {
      margin: 20rpx;
      padding: 20rpx;
      background-color: #ffffff;
      border-radius: 12rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .user-info {
        display: flex;
        align-items: center;
        
        .avatar {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .user-detail {
          .user-name {
            margin-bottom: 10rpx;
            
            .nickname {
              font-size: 32rpx;
              font-weight: bold;
              margin-right: 10rpx;
            }
            
            .username {
              font-size: 24rpx;
              color: #999;
            }
          }
          
          .register-time {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
      
      .role-control {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        
        .current-role {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 10rpx;
        }
        
        .role-btn {
          padding: 10rpx 20rpx;
          border-radius: 30rpx;
          font-size: 24rpx;
          background-color: #07c160;
          color: #ffffff;
          
          &.admin {
            background-color: #ff4d4f;
          }
        }
      }
    }
  }
}
</style> 