<template>
    <view class="container">
        <view class="">
            <uni-popup ref="alertDialog" type="dialog">
                <uni-popup-dialog type="error" cancelText="取消" confirmText="删除" title="确认删除吗？"
                    @confirm="dialogConfirmDelete"></uni-popup-dialog>
            </uni-popup>
        </view>

        <view class="layout">
            <!-- 固定头部 -->
            <view class="box-head">
                <view class="left1">
                    <button class="btn-back" plain="true" @click="handlerClickBack">
                        <img class="img1" src="../../static/goback001.png" alt="" />
                    </button>
                    <view class="text001">
                        发现
                    </view>
                </view>
            </view>

            <!-- 博主相关 -->
            <view class="box-blogger">
                <view class="bb-left">
                    <img class="img2" :src="`${pic_general_request_url}/user_avatar/${currentPost.authorAvatar}`" alt=""
                        @click="showToast('主页功能开发中')" />
                    <text class="text1">{{ currentPost.authorNickname }}</text>
                </view>
                <view class="bb-right">
                    <button class="btn1" :class="{ 'btn1-followed': currentPost.followed }" plain="true"
                        @click="handleFollow">
                        {{ currentPost.followed ? '已关注' : '关注' }}
                    </button>
                    <view class="heart">
                        <uni-icons type="download" size="26" @click="showToast('下载功能开发中')"></uni-icons>
                    </view>
                    <view v-if="userId == post_authorId" class="heart" @click="handleDeletePost">
                        <uni-icons type="closeempty" size="26"></uni-icons>
                    </view>
                </view>
            </view>

            <!-- 中间滚动内容 -->
            <view class="box-body">
                <!-- 图片轮播 -->
                <view class="uni-swiper">
                    <swiper indicator-dots indicator-color="#e9e9e9" indicator-active-color="#007aff">
                        <swiper-item v-for="(item, index) in currentPost.images" :key="index">
                            <image :src="`${pic_general_request_url}/post_pics/${item.picture}`" mode="aspectFit"
                                @click="previewImage"></image>
                        </swiper-item>
                    </swiper>
                </view>

                <view class="text-content">
                    <view class="post-title">
                        {{ currentPost.title }}
                    </view>
                    <view class="text">
                        {{ currentPost.article }}
                    </view>
                    <view class="data">
                        {{ formatDate(currentPost.send_time) }}
                    </view>
                </view>

                <!-- 互动区域 -->
                <view class="operate">
                    <view class="heart" @click="handleLike">
                        <uni-icons :type="currentPost.liked ? 'heart-filled' : 'heart'"
                            :class="{ 'heart-animate': isLikeAnimating }" size="26"
                            :color="currentPost.liked ? '#ff4d4f' : '#666'">
                        </uni-icons>
                        <text class="count" :class="{ 'active': currentPost.liked }">{{ currentPost.likeCount }}</text>
                    </view>
                    <view class="star" @click="handleCollect">
                        <uni-icons :type="currentPost.collected ? 'star-filled' : 'star'"
                            :class="{ 'star-animate': isCollectAnimating }" size="26"
                            :color="currentPost.collected ? '#faad14' : '#666'">
                        </uni-icons>
                    </view>
                    <view class="chatbubble" @click="handleComment">
                        <uni-icons type="chatbubble" size="26"></uni-icons>
                        <text class="count">{{ comments.length || 0 }}</text>
                    </view>
                    <view class="paperplane" @click="handleShare">
                        <uni-icons type="paperplane" size="26"></uni-icons>
                    </view>
                </view>

                <!-- 评论区域 -->
                <view class="comments-section">
                    <view class="comments-header">
                        <text class="title">评论（已通过审核）</text>
                    </view>
                    <view class="comment-list">
                        <view v-for="(comment, index) in comments" :key="index" class="comment-item">
                            <image class="comment-avatar"
                                :src="`${pic_general_request_url}/user_avatar/${comment.avatar}`"></image>
                            <view class="comment-content">
                                <view class="comment-info">
                                    <text class="comment-username">{{ comment.nickname }}</text>
                                    <text class="comment-time">{{ comment.createTime }}</text>
                                </view>
                                <text class="comment-text">{{ comment.commentContext }}</text>
                                <view class="comment-actions">
                                    <view class="action-item" @click="likeComment(index)">
                                        <uni-icons :type="comment.liked ? 'heart-filled' : 'heart'" size="14"
                                            :color="comment.liked ? '#ff4d4f' : '#999'">
                                        </uni-icons>
                                        <text :class="{ 'active': comment.liked }">{{ comment.likes }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 评论弹窗 -->
        <uni-popup ref="commentPopup" type="bottom" background-color="#fff">
            <view class="comment-popup" 
                @touchstart.stop="touchStart" 
                @touchmove.stop="touchMove" 
                @touchend.stop="touchEnd">
                <!-- 顶部拖动条 -->
                <view class="drag-bar">
                    <view class="drag-bar-inner"></view>
                </view>
                <view class="popup-header">
                    <text class="title">评论</text>
                    <uni-icons type="closeempty" size="24" @click="closeComments"></uni-icons>
                </view>
                <scroll-view scroll-y="true" class="comments-container" :show-scrollbar="false">
                    <view class="comment-item" v-for="(comment, index) in comments" :key="index">
                        <img class="commenter-avatar" :src="`${pic_general_request_url}/user_avatar/${comment.avatar}`" mode="aspectFill"></img>
                        <view class="comment-content">
                            <view class="comment-header">
                                <text class="commenter-name">{{comment.nickName}}</text>
                                <text class="comment-time">{{comment.createTime}}</text>
                            </view>
                            <text class="comment-text">{{comment.commentContext}}</text>
                            <view class="comment-actions">
                                <view class="action-item" @click="likeComment(index)">
                                    <uni-icons :type="comment.liked ? 'heart-filled' : 'heart'" size="14" :color="comment.liked ? '#ff4d4f' : '#999'"></uni-icons>
                                    <text :class="{ 'active': comment.liked }">{{comment.likeCount}}</text>
                                </view>
                                <view class="action-item" @click="replyComment(index)">
                                    <uni-icons type="chat" size="14" color="#999"></uni-icons>
                                    <text>回复</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view class="comment-input">
                    <input type="text" v-model="newComment" :placeholder="replyTo ? `回复 ${replyTo}` : '说点什么...'" @confirm="submitComment"/>
                    <button class="submit-btn" @click="submitComment">发送</button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
import { toBeDeveloped, showToast } from '@/src/utils/toast'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()


const post_authorId = ref('');
const userId = ref('');
const alertDialog = ref(null);
const commentPopup = ref(null);
const replyTo = ref('');
const touchStartY = ref(0);
const touchMoveY = ref(0);
const popupTranslateY = ref(0);
const comments = ref([]);

// 创建响应式的当前帖子对象
const currentPost = ref({
    images: [],
    authorNickname: '',
    authorAvatar: '',
    article: '',
    send_time: '',
    likeCount: 0,
    authorId: 0,
    commentCount: 0,
    imageUrl: '',
    updateTime: '',
    title: '',
    postId: 0,
    liked: false,
    collected: false,
    followed: false
});

// 新增响应式数据
// const comments = ref([
// 	{
// 		id: 1,
// 		userName: '猫咪爱好者',
// 		userAvatar: 'default.jpg',
// 		content: '好可爱的猫猫！',
// 		createTime: '2024-01-20',
// 		likes: 12,
// 		liked: false
// 	},
// 	{
// 		id: 2,
// 		userName: '铲屎官',
// 		userAvatar: 'default.jpg',
// 		content: '这只猫很亲人，经常在教学楼附近晒太阳',
// 		createTime: '2024-01-19',
// 		likes: 8,
// 		liked: false
// 	}
// ]);
const newComment = ref('');
const isLikeAnimating = ref(false);
const isCollectAnimating = ref(false);

onShow(() => {
    userId.value = uni.getStorageSync('tokenDetail').userId;
    const options = getCurrentPages().pop().options;
    const postId = options.postId; // 获取当前帖子的ID
    console.log("当前帖子ID：", postId)
    // 获取当前帖子数据
    uni.request({
        url: `${API_general_request_url.value}/api/post/getPostByPostId?postId=${postId}`,
        method: 'GET',
        header: {
            'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
            if (res.statusCode === 200 && res.data.code === '2000') {
                console.log('获取当前帖子数据成功', res.data)
                const post = res.data.data;
                console.log(post)
                currentPost.value = {
                    ...post
                };
                post_authorId.value = currentPost.value.authorId;
            } else {
                uni.showToast({
                    title: res.data.msg || '获取当前帖子数据失败',
                    icon: 'none'
                })
            }
        },
        fail: (error) => {
            uni.showToast({
                title: '请求失败，请重试',
                icon: 'none'
            })
        }
    })
    // ���取评论列表
    console.log('获取帖子评论列表')
    console.log(postId)
    uni.request({
        url: `${API_general_request_url.value}/api/comment/getCommentByPostidByDescLikecount?postId=${postId}&page=1&size=10`,
        method: 'GET',
        header: {
            'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
            console.log(res)
            if (res.statusCode === 200 && res.data.code === '2000') {
                comments.value = Array.isArray(res.data.data) ? res.data.data : [];
                console.log('获取帖子评��列表成功')
            } else {
                uni.showToast({
                    title: res.data.msg || '获取评论列表失败',
                    icon: 'none'
                })
                comments.value = [];
            }
        },
        fail: (error) => {
            console.error('获取评论列表失败:', error);
            comments.value = [];
            uni.showToast({
                title: '获取评论列表失败',
                icon: 'none'
            });
        }
    })
})

// 点赞功能
const handleLike = () => {
    // 如果没有点赞，则点赞
    if (!currentPost.value.liked) {
        uni.request({
            url: `${API_general_request_url.value}/api/post/likePost?postId=${currentPost.value.postId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '2000') {
                    isLikeAnimating.value = true;
                    currentPost.value.liked = !currentPost.value.liked;
                    currentPost.value.likeCount += currentPost.value.liked ? 1 : -1;
                    showToast(currentPost.value.liked ? '点赞成功' : '取消点赞');
                    setTimeout(() => {
                        isLikeAnimating.value = false;
                    }, 500);
                } else {
                    showToast(res.data.msg || '点赞失败');
                }
            }
        })
        // 如果已经点赞，则取消点赞
    } else {
        uni.request({
            url: `${API_general_request_url.value}/api/post/unLikePost?postId=${currentPost.value.postId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '2000') {
                    isLikeAnimating.value = true;
                    currentPost.value.liked = !currentPost.value.liked;
                    currentPost.value.likeCount += currentPost.value.liked ? 1 : -1;
                    showToast(currentPost.value.liked ? '点赞成功' : '取消点赞');
                }
            }
        })
    }
};

// 收藏功能
const handleCollect = () => {
    // 如果没有收藏，则收藏
    if (!currentPost.value.collected) {
        uni.request({
            url: `${API_general_request_url.value}/api/post/collectPost?postId=${currentPost.value.postId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '2000') {
                    isCollectAnimating.value = true;
                    currentPost.value.collected = !currentPost.value.collected;
                    showToast(currentPost.value.collected ? '收藏成功' : '取消收藏');
                    setTimeout(() => {
                        isCollectAnimating.value = false;
                    }, 500);
                } else {
                    showToast(res.data.msg || '收藏失败');
                }
            }
        })
        // 如果已经收藏，则取消收藏
    } else {
        uni.request({
            url: `${API_general_request_url.value}/api/post/unCollectPost?postId=${currentPost.value.postId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '2000') {
                    isCollectAnimating.value = true;
                    currentPost.value.collected = !currentPost.value.collected;
                    showToast(currentPost.value.collected ? '收藏成功' : '取消收藏');
                }
            }
        })
    }
};

// 评论功能
const handleComment = () => {
    showComments();
};

// 提交评论
const submitComment = () => {
    if (!checkLogin()) {
        return;
    }
    if (!newComment.value.trim()) {
        showToast('评论内容不能为空');
        return;
    }

    // 获取当前用户信息
    const comment = {
        commentContext: newComment.value,
        postId: currentPost.value.postId,
        type: 20
    }

    uni.request({
        url: `${API_general_request_url.value}/api/comment/add`,
        method: 'POST',
        data: comment,
        header: {
            'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
            if (res.statusCode === 200 && res.data.code === '2000') {
                console.log('评论成功', res.data.data);

                // 构建新评论对象，包含必要的显示信息
                const newCommentObj = {
                    commentContext: newComment.value,
                    createTime: new Date().toLocaleString(),
                    nickname: appStore.userInfo.nickName,
                    avatar: appStore.userInfo.avatar,
                    likes: 0,
                    liked: false,
                    ...res.data.data  // 合并后端返回的数据
                };

                // 将新评论添加到列表开头
                comments.value.unshift(newCommentObj);

                // 清空输入框并关闭评论弹窗
                newComment.value = '';
                showToast('评论成功');
                closeComments();
            } else {
                uni.showToast({
                    title: res.data.msg || '评论失败',
                    icon: 'none'
                })
            }
        }
    })
};

// 点赞评论
const likeComment = (index) => {
    const comment = comments.value[index];
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    showToast(comment.liked ? '点赞成功' : '取消点赞');
};

// 关注
const handleFollow = () => {
    // 如果已经关注，则取消关注
    if (currentPost.value.followed) {
        uni.request({
            url: `${API_general_request_url.value}/api/user/unfollowUser?userId=${currentPost.value.authorId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '2000') {
                    currentPost.value.followed = !currentPost.value.followed;
                    showToast(currentPost.value.followed ? '关注成功' : '取消关注');
                } else {
                    showToast(res.data.msg || '取消关注失败');
                }
            }
        })
        // 如果未关注，则关注
    } else {
        uni.request({
            url: `${API_general_request_url.value}/api/user/followUser?userId=${currentPost.value.authorId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '2000') {
                    currentPost.value.followed = !currentPost.value.followed;
                    showToast(currentPost.value.followed ? '关注成功' : '取消关注');
                } else {
                    showToast(res.data.msg || '关注失败');
                }
            }
        })
    }
};

// 分享功能
const handleShare = () => {
    showToast('分享功能开发中');
};

// 日期格式化函数
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// 返回按钮点击处理
function handlerClickBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
        uni.navigateBack();
    } else {
        uni.reLaunch({
            url: "Home"
        })
    }
}

// 处理删除帖子逻辑
const handleDeletePost = () => {
    alertDialog.value.open();
}

// 确认删除
const dialogConfirmDelete = () => {
    console.log("当前帖子ID：", currentPost.value.postId)
    uni.request({
        url: `${API_general_request_url.value}/api/post/deletepost?postId=${currentPost.value.postId}`,
        method: 'DELETE',
        success: (res) => {
            if (res.statusCode === 200 && res.data.code === '2000') {
                showToast('删除成功');
                uni.navigateBack();
            } else {
                showToast(res.data.msg || '删除失败');
            }
        }
    })
}

// 预览图片
const previewImage = () => {
    if (!currentPost.value.images || currentPost.value.images.length === 0) {
        showToast('暂无图片');
        return;
    }

    try {
        // 使用与显示相同的URL格式
        const urls = currentPost.value.images.map(item =>
            `${pic_general_request_url.value}/post_pics/${item.picture}`
        );

        uni.previewImage({
            current: 0,
            urls: urls,
            longPressActions: {
                itemList: ['发送给朋友', '保存图片', '收藏'],
                success: function (data) {
                    console.log('选中了第' + (data.tapIndex + 1) + '个按钮');
                },
                fail: function (err) {
                    console.log(err.errMsg);
                }
            }
        });
    } catch (error) {
        console.error('预览图片错误:', error);
        showToast('预览图片出错');
    }
};

// 显示评论弹窗
const showComments = () => {
    commentPopup.value.open();
};

// 关闭评论弹窗
const closeComments = () => {
    commentPopup.value.close();
    replyTo.value = '';
    newComment.value = '';
};

// 回复评论
const replyComment = (index) => {
    showToast('回复功能开发中');
    replyTo.value = comments.value[index].userName;
};

// 触摸开始
const touchStart = (e) => {
    touchStartY.value = e.touches[0].clientY;
};

// 触摸移动
const touchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const moveDistance = currentY - touchStartY.value;

    // 只允许向下滑动
    if (moveDistance > 0) {
        touchMoveY.value = moveDistance;
        popupTranslateY.value = moveDistance;
    }
};

// 触摸结束
const touchEnd = () => {
    // 如果移动距离超过150，则关闭弹窗
    if (touchMoveY.value > 150) {
        closeComments();
    }

    // 重置位置
    touchMoveY.value = 0;
    popupTranslateY.value = 0;
};
</script>

<style lang="scss" scoped>
.container {
    width: 750rpx;
    height: 100vh;
    background-color: #fff;

    .layout {
        // padding-top: 40rpx;

        .box-head {
            width: 100vw;
            height: 100rpx;
            display: flex;
            justify-content: space-between;

            .left1 {
                width: 500%;
                display: flex;
                align-items: center;

                .btn-back {
                    height: 80rpx;
                    width: 80rpx;
                    margin-right: 20rpx;
                    margin-left: 20rpx;
                    border: none;

                    .img1 {
                        padding-top: 20rpx;
                        padding-right: 5rpx;
                        width: 35rpx;
                        height: 35rpx;
                    }
                }

                .text001 {
                    font-size: 40rpx;
                }
            }
        }

        .box-blogger {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20rpx 30rpx;

            .bb-left {
                display: flex;
                align-items: center;

                .img2 {
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 40rpx;
                    margin-right: 20rpx;
                }

                .text1 {
                    font-size: 32rpx;
                    color: #333;
                    font-weight: 500;
                }
            }

            .bb-right {
                display: flex;
                align-items: center;
                gap: 20rpx;

                .btn1 {
                    min-width: 140rpx;
                    height: 64rpx;
                    padding: 0 30rpx;
                    font-size: 28rpx;
                    background: linear-gradient(to right, #ff6b6b, #ff8787);
                    color: #fff;
                    border: none;
                    border-radius: 32rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;

                    &.btn1-followed {
                        background: #f5f5f5;
                        color: #666;
                        border: 1px solid #ddd;

                        &:active {
                            background: #eee;
                        }
                    }

                    &:active {
                        transform: scale(0.95);
                        opacity: 0.9;
                    }
                }

                .heart {
                    width: 64rpx;
                    height: 64rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8f8f8;
                    border-radius: 32rpx;
                    transition: all 0.3s ease;

                    &:active {
                        background: #f0f0f0;
                        transform: scale(0.95);
                    }
                }
            }
        }

        .box-body {
            .uni-swiper {
                width: 750rpx;
                height: 1000rpx;

                swiper {
                    width: 100%;
                    height: 100%;

                    image {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;

                        &:active {
                            opacity: 0.8;
                        }
                    }
                }
            }

            .text-content {
                padding: 30rpx;

                .post-title {
                    font-size: 32rpx;
                    font-weight: 700;
                    color: #333;
                    line-height: 1.5;
                    margin-bottom: 20rpx;
                }

                .text {
                    font-size: 32rpx;
                    color: #333;
                    line-height: 1.5;
                }

                .data {
                    font-size: 26rpx;
                    color: #999;
                    margin-top: 20rpx;
                }
            }

            .operate {
                display: flex;
                justify-content: space-around;
                padding: 20rpx 0;
                border-top: 1px solid #f5f5f5;
                border-bottom: 1px solid #f5f5f5;

                view {
                    display: flex;
                    align-items: center;
                    gap: 8rpx;

                    .count {
                        font-size: 28rpx;
                        color: #666;

                        &.active {
                            color: #ff4d4f;
                        }
                    }
                }
            }
        }
    }
}

.comments-section {
    padding: 30rpx;

    .comments-header {
        margin-bottom: 20rpx;

        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .comment-list {
        .comment-item {
            display: flex;
            padding: 20rpx 0;
            border-bottom: 1px solid #f5f5f5;

            .comment-avatar {
                width: 64rpx;
                height: 64rpx;
                border-radius: 32rpx;
                margin-right: 20rpx;
            }

            .comment-content {
                flex: 1;

                .comment-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10rpx;

                    .comment-username {
                        font-size: 28rpx;
                        color: #333;
                        font-weight: 500;
                    }

                    .comment-time {
                        font-size: 24rpx;
                        color: #999;
                    }
                }

                .comment-text {
                    font-size: 28rpx;
                    color: #666;
                    line-height: 1.5;
                    margin-bottom: 10rpx;
                }

                .comment-actions {
                    display: flex;
                    gap: 30rpx;

                    .action-item {
                        display: flex;
                        align-items: center;
                        gap: 6rpx;

                        text {
                            font-size: 24rpx;
                            color: #999;

                            &.active {
                                color: #ff4d4f;
                            }
                        }
                    }
                }
            }
        }
    }
}

.comment-popup {
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    height: 60vh;
    display: flex;
    flex-direction: column;
    transform: translateY(v-bind(popupTranslateY + 'px'));
    transition: transform 0.3s ease-out;

    .drag-bar {
        width: 100%;
        height: 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        touch-action: none;

        &-inner {
            width: 60rpx;
            height: 6rpx;
            background-color: #ddd;
            border-radius: 3rpx;
        }
    }

    .popup-header {
        padding: 20rpx 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;

        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .comments-container {
        flex: 1;
        width: 92%;
        padding: 0 30rpx;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        
        // 隐藏滚动条
        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        
        // 适配 scroll-view
        :deep(.uni-scroll-view::-webkit-scrollbar) {
            display: none;
        }

        .comment-item {
            display: flex;
            padding: 20rpx 0;
            border-bottom: 1px solid #f0f0f0;

            .commenter-avatar {
                width: 64rpx;
                height: 64rpx;
                border-radius: 32rpx;
                margin-right: 20rpx;
            }

            .comment-content {
                flex: 1;

                .comment-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10rpx;

                    .commenter-name {
                        font-size: 28rpx;
                        color: #333;
                        font-weight: 500;
                    }

                    .comment-time {
                        font-size: 24rpx;
                        color: #999;
                    }
                }

                .comment-text {
                    font-size: 28rpx;
                    color: #666;
                    line-height: 1.5;
                }

                .comment-actions {
                    display: flex;
                    gap: 30rpx;
                    margin-top: 10rpx;

                    .action-item {
                        display: flex;
                        align-items: center;
                        gap: 6rpx;

                        text {
                            font-size: 24rpx;
                            color: #999;

                            &.active {
                                color: #ff4d4f;
                            }
                        }
                    }
                }
            }
        }
    }

    .comment-input {
        padding: 20rpx 30rpx;
        border-top: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        gap: 20rpx;
        background-color: #fff;

        input {
            flex: 1;
            height: 72rpx;
            background-color: #f5f5f5;
            border-radius: 36rpx;
            padding: 0 30rpx;
            font-size: 28rpx;
        }

        .submit-btn {
            background-color: #8d5da3;
            color: #fff;
            border-radius: 36rpx;
            height: 72rpx;
            line-height: 72rpx;
            padding: 0 40rpx;
            font-size: 28rpx;
        }
    }
}

// 动画效果
.heart-animate {
    animation: heartBeat 0.5s ease-in-out;
}

.star-animate {
    animation: starBeat 0.5s ease-in-out;
}

@keyframes heartBeat {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes starBeat {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }

    100% {
        transform: scale(1);
    }
}
</style>