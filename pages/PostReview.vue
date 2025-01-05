<template>
    <view class="post-review">
        <NavBar1001 title="帖子审核" :showLeft="true" :showRight="false" />

        <scroll-view 
            scroll-y="true" 
            class="post-list" 
            refresher-enabled 
            :refresher-triggered="isTriggered"
            @refresherrefresh="onRefresh"
            :enhanced="true"
            :bounces="true"
            :show-scrollbar="false"
            :fast-deceleration="true">
            <view v-if="posts === null || posts.length === 0" class="empty-state">
                <text>暂无待审核的帖子</text>
            </view>

            <view v-else v-for="post in posts" :key="post.postId" class="post-item">
                <view class="post-header">
                    <img class="avatar" :src="`${pic_general_request_url}/user_avatar/${post.authorAvatar}${Suffix_1002}`"
                        mode="aspectFill" />
                    <text class="nickname">{{ post.authorNickname }}</text>
                    <text class="time">{{ formatTime(post.send_time) }}</text>
                </view>

                <view class="post-content" @click="showPostDetail(post)">
                    <text class="post-title">{{ post.title }}</text>
                    <text class="post-article">{{ post.article }}</text>
                    <!-- <img 
            v-if="post.images.length > 0" 
            :src="`https://cdn.luckyiur.com/catcat/post_pics/${post.images[0]}`" 
            mode="aspectFill" 
            class="post-img"
          /> -->
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

                        <!-- 图片区 -->
                        <view class="image-section">
                            <swiper v-if="selectedPost.images && selectedPost.images.length > 0" class="swiper"
                                :indicator-dots="true" :autoplay="false" :duration="500"
                                indicator-active-color="#07c160">
                                <swiper-item v-for="(image, index) in selectedPost.images" :key="index"
                                    class="swiper-item">
                                    <image :src="`${pic_general_request_url}/post_pics/${image}${Suffix_1002}`" mode="aspectFit"
                                        class="detail-image" />
                                </swiper-item>
                            </swiper>
                        </view>

                        <!-- 文案区 -->
                        <view class="content-section">
                            <text class="detail-content-text">{{ selectedPost.article }}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </uni-popup>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'
import NavBar1001 from '@/src/components/common/NavBar1001.vue';

const appStore = useAppStore()

const posts = ref(null);

const isTriggered = ref(false);
const postDetailPopup = ref(null);
const selectedPost = ref(null);

// 审核通过
const handleApprove = async (postId) => {
    if (checkLogin()) {
        uni.showModal({
            title: '确认',
            content: '确定通过这条帖子吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await uni.request({
                            url: `${API_general_request_url.value}/api/post/passApprove`,
                            method: 'POST',
                            header: {
                                'Authorization': `Bearer ${uni.getStorageSync('token')}`
                            },
                            data: {
                                "postId": postId
                            },
                            success: (res) => {
                                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                                    console.log("审核通过：", res)
                                    uni.showToast({
                                        title: '审核通过',
                                        icon: 'success'
                                    });
                                    posts.value = posts.value.filter(post => post.postId !== postId);
                                } else {
                                    console.log("审核通过失败：", res)
                                    uni.showToast({
                                        title: res.data.msg || '操作失败',
                                        icon: 'none'
                                    });
                                }
                            }
                        })
                    } catch (error) {
                        console.log("审核通过失败：", error)
                        uni.showToast({
                            title: res.data.msg || '操作失败',
                            icon: 'none'
                        });
                    }
                }
            }
        })
    }
    
};

// 审核拒绝
const handleReject = async (postId) => {
    if (checkLogin()) {
        uni.showModal({
            title: '确认',
            content: '确定拒绝这条帖子吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await uni.request({
                            url: `${API_general_request_url.value}/api/post/refuseApprove`,
                            method: 'POST',
                            header: {
                                'Authorization': `Bearer ${uni.getStorageSync('token')}`
                            },
                            data: {
                                "postId": postId
                            },
                            success: (res) => {
                                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                                    console.log("审核拒绝成功：", res)
                                    uni.showToast({
                                        title: '已拒绝',
                                        icon: 'success'
                                    });
                                    posts.value = posts.value.filter(post => post.postId !== postId);
                                } else {
                                    console.log("审核拒绝失败：", res)
                                    uni.showToast({
                                        title: res.data.msg || '操作失败',
                                        icon: 'none'
                                    });
                                }
                            }
                        })
                    } catch (error) {
                        uni.showToast({
                            title: error.data.msg || '操作失败',
                            icon: 'none'
                        });
                    }
                }
            }
        })
    }
};

// 显示帖子详情
const showPostDetail = (post) => {
    selectedPost.value = post;
    // postDetailPopup.value.open();
    uni.navigateTo({
        url:`Post?postId=${post.postId}`
    })
};

// 关闭帖子详情
const closePostDetail = () => {
    postDetailPopup.value.close();
};

// 格式化时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

// 刷新帖子列表
const onRefresh = async () => {
    isTriggered.value = true;
    await getApplyPosts();
    setTimeout(() => {
        isTriggered.value = false;
    }, 1000);
};

onMounted(async () => {
    // 初始化时调用全局方法：获取待审核帖子列表
    await getApplyPosts();
    console.log("获取待审核帖子列表成功：", appStore.applyPostList)
    posts.value = appStore.applyPostList
    console.log("posts：", posts.value)
});
</script>

<style lang="scss" scoped>
.post-review {
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

.post-list {
    flex: 1;
    height: calc(100vh - 150rpx);
    padding: 20rpx;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    position: relative;
    z-index: 1;
    
    &::-webkit-scrollbar {
        display: none;
    }
}

.empty-state {
    text-align: center;
    padding: 40rpx;
    color: #999;
    height: calc(100vh - 150rpx);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
}

.post-item {
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
    transform: translateZ(0);
    will-change: transform;
    -webkit-transform: translateZ(0);
    -webkit-backface-visibility: hidden;
}

.post-header {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        margin-right: 16rpx;
    }

    .nickname {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        flex: 1;
    }

    .time {
        font-size: 24rpx;
        color: #999;
    }
}

.post-content {
    margin-bottom: 20rpx;
    
    .post-title {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 16rpx;
        color: #333;
        display: block;
    }

    .post-article {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
        overflow-y: auto;
        white-space: pre-wrap;
        word-break: break-all;
        padding: 10rpx 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    button {
        min-width: 140rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        border-radius: 30rpx;
        font-size: 28rpx;
        border: none;
        padding: 0 32rpx;
    }

    .approve-btn {
        background-color: #007AFF;
        color: #ffffff;
    }

    .reject-btn {
        background-color: #ffffff;
        color: #FF3B30;
        border: 1rpx solid #FF3B30;
    }
}

// 弹窗样式
.post-detail-popup {
    width: 90vw;
    max-height: 80vh;
    background-color: #ffffff;
    border-radius: 12rpx;
    overflow: hidden;

    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        border-bottom: 1rpx solid #eee;
        background-color: #f8f8f8;

        .popup-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }

        .close-btn {
            font-size: 40rpx;
            color: #999;
            padding: 10rpx;
            line-height: 1;
        }
    }

    .popup-content {
        max-height: calc(80vh - 100rpx);
        padding: 20rpx;
    }

    .detail-content {
        .detail-title {
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 20rpx;
            padding: 0 20rpx;
        }

        .image-section {
            margin: 20rpx 0;

            .swiper {
                width: 100%;
                height: 400rpx;
                border-radius: 8rpx;
                overflow: hidden;

                .swiper-item {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .detail-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }

        .content-section {
            padding: 20rpx;

            .detail-content-text {
                font-size: 28rpx;
                color: #666;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-all;
            }
        }
    }
}
</style>