<template>
    <view class="container">
        <!-- 顶部导航栏 -->
        <view class="nav-bar">
            <view class="left">
                <view class="nav-btn" @click="handleLoginLogout">
                    <uni-icons type="person" size="20" color="#333" />
                    <text>{{ isLoggedIn ? '退出' : '登录' }}</text>
                </view>
            </view>
            <view class="title">我的主页</view>
            <view class="right">
                <view class="nav-btn primary" @click="handlerClickSendPost">
                    <uni-icons type="plus" size="20" color="#fff" />
                    <text>发帖</text>
                </view>
            </view>
        </view>
        <!-- 添加加载状态判断 -->
        <template v-if="appStore.userInfo">
            <!-- 个人信息区域 -->
            <view class="profile-section">
                <view class="profile-header">
                    <view class="user-info">
                        <img class="avatar" :src="`${pic_general_request_url}/user_avatar/${appStore.userInfo.avatar}${Suffix_1002}`"
                            mode="aspectFill"></img>
                        <view class="info-right">
                            <view class="username">{{ appStore.userInfo.nickName || '未设置昵称' }}</view>
                            <view class="user-id">ID: {{ appStore.userInfo.userId || '未登录' }}</view>
                            <view class="edit-profile" @click="goToEditProfile">编辑资料</view>
                        </view>
                    </view>
                    <view class="signature">{{ appStore.userInfo.signature || '这个人很懒，还没有签名' }}</view>
                    <!-- <view class="profile-tags">
            <view class="tag" @click="toBeDeveloped">🐱 铲屎官</view>
            <view class="tag" @click="toBeDeveloped">📍 北京</view>
            <view class="tag" @click="toBeDeveloped">🏷️ 添加更多标签</view>
          </view> -->
                </view>

                <!-- 数据统计 -->
                <view class="stats-bar">
                    <view class="stats-item">
                        <view class="stats-number">{{ appStore.userInfo.postCount || 0 }}</view>
                        <view class="stats-label">笔记</view>
                    </view>
                    <view class="stats-item">
                        <view class="stats-number">{{ appStore.userInfo.followCount || 0 }}</view>
                        <view class="stats-label">关注</view>
                    </view>
                    <view class="stats-item">
                        <view class="stats-number">{{ appStore.userInfo.fansCount || 0 }}</view>
                        <view class="stats-label">粉丝</view>
                    </view>
                    <view class="stats-item">
                        <view class="stats-number">{{ appStore.userInfo.postLikedCount || 0 }}</view>
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
                    <view class="tab-item" :class="{ active: activeTab === 'collections' }"
                        @click="switchTab('collections')">
                        <text>收藏</text>
                    </view>
                    <view class="tab-item" :class="{ active: activeTab === 'likes' }" @click="switchTab('likes')">
                        <text>点赞</text>
                    </view>
                </view>
            </view>

            <!-- 帖子列表区域 -->
            <scroll-view :scroll-top="scrollTop" scroll-y="true" class="post-list"
                :class="{ 'empty-state': !getActiveList.length }" @scroll="handleScroll">
                <template v-if="getActiveList.length">
                    <view class="content">
                        <view v-for="post in getActiveList" :key="post.postId" class="box">
                            <img class="pic" :src="`${pic_general_request_url}/post_pics/${post.coverPicture}${Suffix_1002}`"
                                mode="aspectFill" @click="handlerClickPost(post.postId)"></img>
                            <view class="post-info">
                                <view class="text" @click="handlerClickPost(post.postId)">{{ post.title }}</view>
                                <view class="stats">
                                    <view class="likes">
                                        <img class="icon" src="../static/love.svg"></img>
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
                        <text>{{ getEmptyText }}</text>
                        <button v-if="activeTab === 'posts'" class="primary-button"
                            @click="handlerClickSendPost">去发布第一篇笔记</button>
                    </view>
                </template>
            </scroll-view>
        </template>
        <template v-else>
            <view class="loading-state">
                <text>加载中...</text>
            </view>
        </template>
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'
import { toBeDeveloped, showToast } from '@/src/utils/toast'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const isLoggedIn = ref(false)
const activeTab = ref('posts')
const scrollTop = ref(0)

// 切换标签
const switchTab = async (tab) => {
    activeTab.value = tab
    const token = uni.getStorageSync('token')
    if (!token) return

    try {
        if (tab === 'posts') {
            // 获取用户发帖列表
            const res = await uni.request({
                url: `${API_general_request_url.value}/api/user/posts`,
                method: 'GET',
                header: { 'Authorization': `Bearer ${token}` }
            })
            if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                appStore.setPostList(res.data.data)
            }
        } else if (tab === 'collections') {
            // 获取收藏列表
            const res = await uni.request({
                url: `${API_general_request_url.value}/api/user/collections`,
                method: 'GET',
                header: { 'Authorization': `Bearer ${token}` }
            })
            if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                // appStore.setCollectionList(res.data.data)
            }
        } else if (tab === 'likes') {
            // 获取点赞列表
            const res = await uni.request({
                url: `${API_general_request_url.value}/api/user/likes`,
                method: 'GET',
                header: { 'Authorization': `Bearer ${token}` }
            })
            if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                // appStore.setLikeList(res.data.data)
            }
        }
    } catch (error) {
        showToast('获取数据失败')
    }
}

// 处理滚动
const handleScroll = (e) => {
    scrollTop.value = e.detail.scrollTop
}

// 点击帖子
const handlerClickPost = (postId) => {
    console.log(postId)
    uni.navigateTo({
        url: `Post?postId=${postId}`
    })
}

// 页面加载
onShow(async () => {
    checkLoginStatus()
    console.log("主页挂载")
    if (!checkLogin()) {
        appStore.setUserInfoNull()
        return;
    }
    if (checkLogin()) {
        try {
            // 调用全局方法：请求用户个人资料
            getUserProfile()
            console.log("请求用户个人资料成功")
        } catch (error) {
            uni.showToast({
                title: '请求失败，请重试',
                icon: 'none'
            })
        }
    }
})

// 编辑我的资料
const goToEditProfile = () => {
    if (!checkLogin()) {
        return
    }
    uni.navigateTo({
        url: 'UserEdit'
    })
}

// 点击发布帖子
const handlerClickSendPost = () => {
    // 判断是否登录
    const token = uni.getStorageSync('token')
    if (!token) {
        showToast('请先登录')
        return
    }
    uni.navigateTo({
        url: 'SendPost'
    })
}

// 检查登录状态
const checkLoginStatus = () => {
    const token = uni.getStorageSync('token')
    console.log(token)
    isLoggedIn.value = !!token
}

// 处理登录登出
const handleLoginLogout = () => {
    if (isLoggedIn.value) {
        // 登出逻辑
        uni.removeStorageSync('token')
        isLoggedIn.value = false
        appStore.setUserInfo(null) // 清空用户数据
        showToast('已退出登录')
    } else {
        // 跳转到登录页
        uni.navigateTo({
            url: 'login'
        })
    }
}

// 在页面加载时检查登录状态
onMounted(() => {
})

// 计算当前显示的列表
const getActiveList = computed(() => {
    if (!appStore.userInfo) return []

    switch (activeTab.value) {
        case 'posts':
            return appStore.userInfo.postList || []
        case 'collections':
            return appStore.userInfo.collectionList || []
        case 'likes':
            return appStore.userInfo.likeList || []
        default:
            return []
    }
})

// 计算空状态文本
const getEmptyText = computed(() => {
    switch (activeTab.value) {
        case 'posts':
            return '还没有发布任何内容'
        case 'collections':
            return '还没有收藏任何内容'
        case 'likes':
            return '还没有点赞任何内容'
        default:
            return '暂无内容'
    }
})
</script>

<style lang="scss" scoped>
.container {
    min-height: 94vh;
    background: #f8f8f8;

    .nav-bar {
        position: sticky;
        top: 0;
        z-index: 100;
        height: 50rpx;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 40rpx 20rpx 20rpx;
        border-bottom: 1rpx solid #f0f0f0;

        .left,
        .right {
            .nav-btn {
                display: flex;
                align-items: center;
                padding: 12rpx 24rpx;
                border-radius: 32rpx;
                background: #f6f6f6;
                transition: all 0.2s;

                text {
                    font-size: 26rpx;
                    color: #333;
                    margin-left: 8rpx;
                }

                &:active {
                    opacity: 0.8;
                }

                &.primary {
                    background: #333;

                    text {
                        color: #fff;
                    }
                }
            }
        }

        .title {
            font-size: 34rpx;
            font-weight: 600;
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
            background-color: #ebebeb;

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

                        .likes,
                        .comments {
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
            height: calc(50vh - 120rpx);

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

    .loading-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;

        text {
            font-size: 28rpx;
            color: #999;
        }
    }
}
</style>
