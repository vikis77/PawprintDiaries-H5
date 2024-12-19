<template>
    <view class="container">
        <!-- 顶部导航栏 -->
        <NavBar1001 title="用户角色管理" :showLeft="true" :showRight="false" />

        <!-- 搜索栏 -->
        <view class="search-box">
            <view class="search-input">
                <img src="../../static/search.png" class="search-icon" />
                <input type="text" v-model="searchKeyword" placeholder="搜索用户名ID" @confirm="handleSearch" />
            </view>
            <button class="search-btn" @click="handleSearch">搜索</button>
        </view>

        <!-- 用户列表 -->
        <scroll-view scroll-y="true" class="user-list" refresher-enabled :refresher-triggered="isTriggered"
            @refresherrefresh="onRefresh" @scrolltolower="loadMore">
            <view v-if="users.length === 0" class="empty-state">
                <text>暂无用户数据</text>
            </view>

            <view v-else v-for="user in users" :key="user.userId" class="user-item">
                <view class="user-info">
                    <img class="avatar" :src="`${pic_general_request_url}/user_avatar/${user.avatar}`" mode="aspectFill" />
                    <view class="user-detail">
                        <view class="user-name">
                            <text class="nickname">{{ user.nickName }}</text>
                            <text class="username">({{ user.userName }})</text>
                        </view>
                        <text class="register-time">注册时间: {{ user.registerTime }}</text>
                    </view>
                </view>

                <view class="role-control">
                    <text class="current-role">{{ user.role === 'ADMIN' ? '管理员' : '普通用户' }}</text>
                    <button class="role-btn" :class="{ 'admin': user.role === 'ADMIN' }"
                        @click="handleRoleChange(user)">
                        {{ user.role === 'ADMIN' ? '取消管理员' : '设为管理员' }}
                    </button>
                </view>
            </view>

            <uni-load-more :status="loadMoreStatus" />
        </scroll-view>

        <!-- 确认弹窗 -->
        <uni-popup ref="confirmPopup" type="dialog">
            <uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="修改角色" :content="confirmContent"
                @confirm="confirmRoleChange" @close="closeConfirmDialog" />
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

// 获取用户列表
const fetchUsers = async (page = 1, keyword = null) => {
    if (!checkLogin()) {
        return;
    }
    try {
        if (keyword) {
            await uni.request({
                url: `${API_general_request_url.value}/api/role/search`,
                method: 'GET',
                data: {
                    keyword: Number(keyword) // 现阶段只支持用户名ID搜索
                },
                headers: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`
                },
                success: (res) => {
                    if (res.statusCode === 200 && res.data.code === "2000") {
                        console.log("获取用户成功：", res.data.data)
                        users.value = res.data.data;
                        total.value = 1;
                        loadMoreStatus.value = users.value.length >= total.value ? 'noMore' : 'more';
                    } else {
                        throw new Error('获取用户失败');
                    }
                }
            });
        } else {
            await uni.request({
                url: `${API_general_request_url.value}/api/role/list?page=${page}&pageSize=${pageSize.value}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`
                },
                success: (res) => {
                    if (res.statusCode === 200 && res.data.code === "2000") {
                        console.log("获取用户列表成功：", res.data.data)
                        users.value = res.data.data;
                        total.value = res.data.data.length;
                        loadMoreStatus.value = users.value.length >= total.value ? 'noMore' : 'more';
                    } else {
                        throw new Error('获取用户列表失败');
                    }
                }
            });
        }
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
    console.log(user)
    selectedUser.value = user;
    confirmContent.value = `确定要${user.role === 'ADMIN' ? '取消' : '设置'} ${user.nickName} 的管理员权限吗？`;
    confirmPopup.value.open();
};

// 确认角色变更
const confirmRoleChange = async () => {
    if (!checkLogin()) {
        return;
    }
    try {
        const newRole = selectedUser.value.role === 'ADMIN' ? 'USER' : 'ADMIN';
        uni.request({
            url: `${API_general_request_url.value}/api/role/update`,
            method: 'POST',
            data: {
                userId: selectedUser.value.userId,
                role: newRole
            },
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                console.log("修改角色成功：", res)
                if (res.statusCode === 200 && res.data.code === "2000") {
                    // 更新本地数据
                    const userIndex = users.value.findIndex(u => u.userId === selectedUser.value.userId);
                    if (userIndex !== -1) {
                        users.value[userIndex].role = newRole;
                    }
                    uni.showToast({
                        title: '角色修改成功',
                        icon: 'success'
                    });
                } else {
                    uni.showToast({
                        title: res.data.msg,
                        icon: 'error'
                    })
                    throw new Error('修改角色失败');
                }
            }
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