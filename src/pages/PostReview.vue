<template>
    <view class="post-review">
        <NavBar1001 title="帖子审核" :showLeft="true" :showRight="false" />

        <scroll-view scroll-y="true" class="post-list" refresher-enabled :refresher-triggered="isTriggered"
            @refresherrefresh="onRefresh">
            <view v-if="posts === null || posts.length === 0" class="empty-state">
                <text>暂无待审核的帖子</text>
            </view>

            <view v-else v-for="post in posts" :key="post.postId" class="post-item">
                <view class="post-header">
                    <img class="avatar" :src="`${pic_general_request_url}/user_avatar/${post.authorAvatar}`"
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
                                    <image :src="`${pic_general_request_url}/post_pics/${image}`" mode="aspectFit"
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
import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
import NavBar1001 from '@/src/components/common/NavBar1001.vue';

const appStore = useAppStore()

const posts = ref(null);

const isTriggered = ref(false);
const postDetailPopup = ref(null);
const selectedPost = ref(null);

// 审核通过
const handleApprove = async (postId) => {
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
                if (res.statusCode === 200 && res.data.code === "2000") {
                    console.log("审核通过：", res)
                    uni.showToast({
                        title: '审核通过',
                        icon: 'success'
                    });
                    posts.value = posts.value.filter(post => post.postId !== postId);
                } else {
                    console.log("审核通过失败：", res)
                    uni.showToast({
                        title: res.data.message || '操作失败',
                        icon: 'none'
                    });
                }
            }
        })

    } catch (error) {
        console.log("审核通过失败：", error)
        uni.showToast({
            title: res.data.message || '操作失败',
            icon: 'none'
        });
    }
};

// 审核拒绝
const handleReject = async (postId) => {
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
                if (res.statusCode === 200 && res.data.code === "2000") {
                    console.log("审核拒绝成功：", res)
                    uni.showToast({
                        title: '已拒绝',
                        icon: 'success'
                    });
                    posts.value = posts.value.filter(post => post.postId !== postId);
                } else {
                    console.log("审核拒绝失败：", res)
                    uni.showToast({
                        title: res.data.message || '操作失败',
                        icon: 'none'
                    });
                }
            }
        })
    } catch (error) {
        uni.showToast({
            title: error.data.message || '操作失败',
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

// 格式化时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

// 刷新帖子列表
const onRefresh = async () => {
    isTriggered.value = true;
    setTimeout(() => {
        isTriggered.value = false;
    }, 1000);
};

onMounted(async () => {
    // 初始化时获取待审核帖子列表
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

.post-article {
    height: 250rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
    padding: 10rpx 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    box-sizing: border-box;
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
    cursor: pointer;
}

.popup-content {
    // padding: 20rpx;
    max-height: calc(80vh - 100rpx);
}

.detail-content {
    .detail-title {
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
        padding-left: 40rpx;
    }

    .image-section {
        margin: 20rpx 0;

        .swiper {
            width: 100%;
            height: 400rpx;

            .swiper-item {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .detail-image {
                width: 100%;
                height: 100%;
                border-radius: 8rpx;
            }
        }
    }

    .content-section {
        padding: 10rpx 0;
        width: 90%;
        margin: 0 auto;

        .detail-content-text {
            font-size: 28rpx;
            color: #333;
            line-height: 1.6;
            display: block;
            word-wrap: break-word;
            white-space: pre-wrap;
            padding: 0 0rpx;
        }
    }
}
</style>