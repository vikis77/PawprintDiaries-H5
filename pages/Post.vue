<template>
    <view class="container">
        <view class="">
            <uni-popup ref="alertDialog" type="dialog">
                <uni-popup-dialog type="error" cancelText="取消" confirmText="删除" title="确认删除吗？"
                    @confirm="dialogConfirmDelete"></uni-popup-dialog>
            </uni-popup>
            
            <!-- 添加下载选择弹窗 -->
            <uni-popup ref="downloadPopup" type="bottom" background-color="#fff">
                <view class="download-popup">
                    <view class="download-header">
                        <text class="title">选择要下载的图片（微信长按帖子即可）</text>
                        <view class="close-btn" @click="closeDownloadPopup">
                            <uni-icons type="closeempty" size="24" color="#666"></uni-icons>
                        </view>
                    </view>
                    <scroll-view scroll-y="true" class="image-list">
                        <view v-for="(item, index) in currentPost.images" 
                              :key="index"
                              class="image-item"
                              @click="downloadImage(index)">
                            <image :src="`${pic_general_request_url}/post_pics/${item.picture}${Suffix_1002}`" 
                                   mode="aspectFill" 
                                   class="preview-image"></image>
                            <view class="image-info">
                                <text class="image-name">图片 {{index + 1}}</text>
                                <uni-icons type="download" size="20" color="#8d5da3"></uni-icons>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </uni-popup>

            <!-- 添加分享弹窗 -->
            <uni-popup ref="sharePopup" type="bottom" background-color="#fff">
                <view class="share-popup">
                    <view class="share-header">
                        <text class="title">分享到</text>
                        <view class="close-btn" @click="closeSharePopup">
                            <uni-icons type="closeempty" size="24" color="#666"></uni-icons>
                        </view>
                    </view>
                    <view class="share-options">
                        <view class="share-item" @click="qrCode">
                            <image src="https://cdn.luckyiur.com/catcat/static_image/二维码分享.png" mode="aspectFit" class="share-icon"></image>
                            <text>二维码分享</text>
                        </view>
                        <view class="share-item" @click="copyLink">
                            <image src="https://cdn.luckyiur.com/catcat/static_image/link.png" mode="aspectFit" class="share-icon"></image>
                            <text>复制链接</text>
                        </view>
                    </view>
                </view>
            </uni-popup>

            <!-- 修改二维码预览弹窗 -->
            <uni-popup ref="qrCodePopup" type="center" background-color="#fff">
                <view class="qrcode-popup">
                    <view class="qrcode-header">
                        <text class="title">分享这个帖子</text>
                        <view class="close-btn" @click="closeQrCodePopup">
                            <uni-icons type="closeempty" size="24" color="#666"></uni-icons>
                        </view>
                    </view>
                    <view class="qrcode-content">
                        <image v-if="qrCodeUrl" :src="qrCodeUrl" mode="aspectFit" class="qrcode-image" @click="changeQRStyle"></image>
                        <text class="qrcode-tip">点击二维码切换样式 ({{ qrCodeStyles[qrCodeStyle].name }})</text>
                        <text class="qrcode-tip">扫描二维码查看详情</text>
                    </view>
                    <view class="qrcode-footer">
                        <button class="download-btn" @click="downloadQrCode">保存二维码，微信请长按或截图</button>
                    </view>
                </view>
            </uni-popup>
        </view>

        <view class="layout">
            <!-- 固定头部 -->
            <view class="box-head">
                <view class="left1">
                    <button class="btn-back" plain="true" @click="handlerClickBack">
                        <img class="img1" src="../static/goback001.png" alt="" />
                    </button>
                    <view class="text001">
                        发现
                    </view>
                </view>
            </view>

            <!-- 博主相关 -->
            <view class="box-blogger">
                <view class="bb-left">
                    <img class="img2" :src="`${pic_general_request_url}/user_avatar/${currentPost.authorAvatar}${Suffix_1002}`" alt=""
                        @click="showToast('主页功能开发中')" />
                    <text class="text1">{{ currentPost.authorNickname }}</text>
                </view>
                <view class="bb-right">
                    <button class="btn1" :class="{ 'btn1-followed': currentPost.followed }" plain="true"
                        @click="handleFollow">
                        {{ currentPost.followed ? '已关注' : '关注' }}
                    </button>
                    <view class="heart">
                        <uni-icons type="download" size="26" @click="handleDownload"></uni-icons>
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
                    <swiper class="swiper" indicator-dots indicator-color="#e9e9e9" indicator-active-color="#007aff">
                        <swiper-item v-for="(item, index) in currentPost.images" :key="item.id" class="swiper-item">
                            <image 
                                :src="`${pic_general_request_url}/post_pics/${item.picture}${Suffix_1001}`" 
                                mode="aspectFit" 
                                @click="previewImage(index)"
                                class="swiper-image"
                            ></image>
                        </swiper-item>
                    </swiper>
                </view>

                <view class="text-content">
                    <view class="post-title">
                        <text class="output-text">{{ currentPost.title }}</text>
                    </view>
                    <view class="text">
                        <text class="output-text">{{ currentPost.article }}</text>
                    </view>
                    <view class="data">
                        {{ formatDate(currentPost.send_time) }}
                    </view>
                </view>

                <!-- 互动区域 -->
                <view class="operate">
                    <!-- 点赞 -->
                    <view class="heart" @click="handleLike">
                        <uni-icons :type="currentPost.liked ? 'heart-filled' : 'heart'"
                            :class="{ 'heart-animate': isLikeAnimating }" size="26"
                            :color="currentPost.liked ? '#ff4d4f' : '#666'">
                        </uni-icons>
                        <text class="count" :class="{ 'active': currentPost.liked }">{{ currentPost.likeCount }}</text>
                    </view>
                    <!-- 收藏 -->
                    <view class="star" @click="handleCollect">
                        <uni-icons :type="currentPost.collected ? 'star-filled' : 'star'"
                            :class="{ 'star-animate': isCollectAnimating }" size="26"
                            :color="currentPost.collected ? '#faad14' : '#666'">
                        </uni-icons>
                    </view>
                    <!-- 评论 -->
                    <view class="chatbubble" @click="handleComment">
                        <uni-icons type="chatbubble" size="26"></uni-icons>
                        <text class="count">{{ comments.length || 0 }}</text>
                    </view>
                    <!-- 分享 -->
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
                                :src="`${pic_general_request_url}/user_avatar/${comment.avatar}${Suffix_1002}`"></image>
                            <view class="comment-content">
                                <view class="comment-info">
                                    <text class="comment-username">{{ comment.nickName }}</text>
                                    <text class="comment-time">{{ comment.createTime }}</text>
                                </view>
                                <text class="comment-text">{{ comment.commentContext }}</text>
                                <view class="comment-actions">
                                    <!-- // TODO 先搁置点赞功能 -->
                                    <!-- <view class="action-item" @click="likeComment(index)">
                                        <uni-icons :type="comment.liked ? 'heart-filled' : 'heart'" size="14"
                                            :color="comment.liked ? '#ff4d4f' : '#999'">
                                        </uni-icons>
                                        <text :class="{ 'active': comment.liked }">{{ comment.likeCount }}</text>
                                    </view> -->
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
                        <img class="commenter-avatar" :src="`${pic_general_request_url}/user_avatar/${comment.avatar}${Suffix_1002}`" mode="aspectFill"></img>
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
import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'
import { toBeDeveloped, showToast } from '@/src/utils/toast'
import { useAppStore } from '@/store/modules/app'
import QRCode from 'qrcode'

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
const downloadPopup = ref(null);
const sharePopup = ref(null);

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

const newComment = ref('');
const isLikeAnimating = ref(false);
const isCollectAnimating = ref(false);

// 添加二维码相关的响应式变量
const qrCodePopup = ref(null);
const qrCodeUrl = ref('');

// 在 setup 中添加新的响应式变量
const qrCodeStyle = ref(0); // 当前二维码样式索引

// 定义二维码样式列表
const qrCodeStyles = [
    {
        name: '经典黑',
        gradient: () => ({
            r: 0,
            g: 0,
            b: 0
        })
    },
    {
        name: '猫咪紫',
        gradient: () => ({
            r: 141,
            g: 93,
            b: 163
        })
    },
    {
        name: '红绿渐变',
        gradient: (progress) => ({
            r: Math.round(255 * (1 - progress)),
            g: Math.round(100 * progress),
            b: Math.round(50 * progress)
        })
    },
    {
        name: '海洋蓝',
        gradient: (progress) => ({
            r: Math.round(30 * (1 - progress)),
            g: Math.round(144 * (1 - progress) + 200 * progress),
            b: Math.round(255 * progress)
        })
    }
];

onShow(() => {
    userId.value = uni.getStorageSync('tokenDetail').userId;
    
    let postId;
    // #ifdef H5
    const options = getCurrentPages().pop().options;
    postId = options.postId; // 获取当前帖子的ID
    // #endif
    
    // #ifdef APP-PLUS
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    postId = page.$page.fullPath.split('?')[1].split('=')[1]; // 从路由中获取postId
    // #endif
    
    console.log("当前帖子ID：", postId)
    // 获取当前帖子数据
    uni.request({
        url: `${API_general_request_url.value}/api/post/getPostByPostId?postId=${postId}`,
        method: 'GET',
        header: {
            'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
            if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
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
    // 获取评论列表
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
            if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                comments.value = Array.isArray(res.data.data) ? res.data.data : [];
                console.log('获取帖子评论列表成功')
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
    if (!checkLogin()) {
        return;
    }
    // 如果没有点赞，则点赞
    if (!currentPost.value.liked) {
        uni.request({
            url: `${API_general_request_url.value}/api/post/likePost?postId=${currentPost.value.postId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    // 把首页对应帖子点赞数+1
                    let postList = appStore.postList;
                    for (let i = 0; i < postList.length; i++) {
                        if (postList[i].postId === currentPost.value.postId) {
                            postList[i].likeCount += 1;
                            break;
                        }
                    }
                    appStore.setPostList(postList)
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
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    // 把首页对应帖子点赞数-1
                    let postList = appStore.postList;
                        for (let i = 0; i < postList.length; i++) {
                            if (postList[i].postId === currentPost.value.postId) {
                                postList[i].likeCount -= 1;
                                break;
                            }
                        }
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
    if (!checkLogin()) {
        return;
    }
    // 如果没有收藏，则收藏
    if (!currentPost.value.collected) {
        uni.request({
            url: `${API_general_request_url.value}/api/post/collectPost?postId=${currentPost.value.postId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
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
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
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
            if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                console.log('评论成功', res.data.data);

                // 构建新评论对象，包含必要的显示信息
                const newCommentObj = {
                    commentContext: newComment.value,
                    createTime: new Date().toLocaleString(),
                    nickName: appStore.userInfo.nickName,
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
    if (!checkLogin()) {
        return;
    }
    const comment = comments.value[index];
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    showToast(comment.liked ? '点赞成功' : '取消点赞');
};

// 关注
const handleFollow = () => {
    if (!checkLogin()) {
        return;
    }
    // 如果已经关注，则取消关注
    if (currentPost.value.followed) {
        uni.request({
            url: `${API_general_request_url.value}/api/user/unfollowUser?userId=${currentPost.value.authorId}`,
            method: 'POST',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
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
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
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
    sharePopup.value.open();
};

// 关闭分享弹窗
const closeSharePopup = () => {
    sharePopup.value.close();
};

// 二维码分享
const qrCode = async () => {
    try {
        // 获取当前页面URL
        const url = `${window.location.origin}/pages/Post?postId=${currentPost.value.postId}`;
        
        uni.showLoading({
            title: '生成二维码中...'
        });

        // 创建渐变色二维码
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 240;
        canvas.width = size;
        canvas.height = size;

        // 生成基础二维码，增加version参数并调整配置
        const baseQR = await QRCode.toCanvas(canvas, url, {
            width: size,
            margin: 2, // 减小边距以容纳更多数据
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M', // 降低纠错级别以容纳更多数据
            version: 8, // 增加版本号以支持更多数据
        });

        // 获取二维码数据
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;

        // 获取当前选择的样式
        const currentStyle = qrCodeStyles[qrCodeStyle.value];

        // 创建渐变色效果
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 0) { // 如果是黑色像素点
                const x = (i / 4) % size;
                const y = Math.floor((i / 4) / size);
                const progress = (x + y) / (size * 2);
                
                // 使用选择的渐变样式
                const color = currentStyle.gradient(progress);
                data[i] = color.r;     // R
                data[i + 1] = color.g; // G
                data[i + 2] = color.b; // B
                data[i + 3] = 255;     // Alpha
            }
        }

        ctx.putImageData(imageData, 0, 0);

        // 先下载Logo图片到本地
        const logoRes = await new Promise((resolve, reject) => {
            uni.downloadFile({
                url: 'https://cdn.luckyiur.com/catcat/static_image/logo002.jpg',
                success: (res) => {
                    if (res.statusCode === 200) {
                        resolve(res.tempFilePath);
                    } else {
                        reject(new Error('下载Logo失败'));
                    }
                },
                fail: reject
            });
        });

        // 获取图片信息
        const imgInfo = await new Promise((resolve, reject) => {
            uni.getImageInfo({
                src: logoRes,
                success: resolve,
                fail: reject
            });
        });

        // 创建新的Image对象
        await new Promise((resolve, reject) => {
            const logo = new Image();
            logo.onload = () => {
                try {
                    // 在右下角绘制Logo
                    const logoSize = size * 0.25; // Logo大小为二维码的25%
                    const padding = size * 0.04; // 边距为二维码的5%
                    const x = size - logoSize - padding;
                    const y = size - logoSize - padding;
                    
                    // 绘制白色背景
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(x - 2, y - 2, logoSize + 4, logoSize + 4);
                    
                    // 绘制Logo
                    ctx.drawImage(logo, x, y, logoSize, logoSize);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            logo.onerror = reject;
            logo.src = imgInfo.path;
        });

        // 转换为base64
        const dataUrl = canvas.toDataURL('image/png');
        
        // 保存二维码URL并显示弹窗
        qrCodeUrl.value = dataUrl;
        uni.hideLoading();
        closeSharePopup();
        qrCodePopup.value.open();
    } catch (error) {
        console.error('生成二维码失败:', error);
        uni.hideLoading();
        showToast('生成二维码失败');
    }
};

// 复制链接
const copyLink = () => {
    // const shareOriginUrl = `${window.location.origin}/pages/Post?postId=${currentPost.value.postId}`;
    const shareOriginUrl = `postId=${currentPost.value.postId}`
    uni.request({
        url: `${API_general_request_url.value}/api/shotLinkShare/getShotLinkShare?url=${shareOriginUrl}`,
        method: 'GET',
        // header: {
        //     'Authorization': `Bearer ${uni.getStorageSync('token')}`
        // },
        success: (res) => {
            if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                uni.setClipboardData({
                    data: res.data.data.urlString,
                    success: function () {
                        showToast('链接已复制，请分享给你的好友吧！');
                        closeSharePopup();
                    }
                });
                console.log("复制链接成功");
                console.log(res.data);
            } else {
                showToast(res.data.msg || '复制链接失败');
            }
        },
        fail: (err) => {
            console.log(err);
            showToast('复制链接失败');
        }
    })
};

// 日期格式化函数
function formatDate(dateStr) {
    // 检查日期字符串是否存在
    if (!dateStr) {
        return '';
    }

    try {
        const date = new Date(dateStr);
        
        // 检查是否为有效日期
        if (isNaN(date.getTime())) {
            return '日期格式错误';
        }

        // 补零函数
        const padZero = (num) => num.toString().padStart(2, '0');
        
        const year = date.getFullYear();
        const month = padZero(date.getMonth() + 1);
        const day = padZero(date.getDate());
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('日期格式化错误:', error);
        return '日期格式错误';
    }
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
        header: {
            'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
            if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                showToast('删除成功');
                uni.navigateBack();
            } else {
                showToast(res.data.msg || '删除失败');
            }
        }
    })
}

// 预览图片
const previewImage = (index) => {
    if (!currentPost.value.images || currentPost.value.images.length === 0) {
        showToast('暂无图片');
        return;
    }

    try {
        // 使用与显示相同的URL格式
        const urls = currentPost.value.images.map(item =>
            `${pic_general_request_url.value}/post_pics/${item.picture}${Suffix_1000}`
        );

        uni.previewImage({
            current: urls[index], // 传入当前图片的url
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

// 下载图片处理函数
const handleDownload = () => {
    if (!checkLogin()) {
        return;
    }
    if (!currentPost.value.images || currentPost.value.images.length === 0) {
        showToast('暂无图片可下载');
        return;
    }
    downloadPopup.value.open();
};

// 关闭下载弹窗
const closeDownloadPopup = () => {
    downloadPopup.value.close();
};

// 下载选中的图片
const downloadImage = (index) => {
    const selectedImage = currentPost.value.images[index];
    // 使用高清图片URL，确保正确访问pic_general_request_url的值
    const imageUrl = `${pic_general_request_url.value}/post_pics/${selectedImage.picture}`;
    
    // 显示下载进度
    uni.showLoading({
        title: '下载中...'
    });
    
    // #ifdef H5
    // H5端使用a标签下载
    try {
        const a = document.createElement('a');
        // 使用fetch先获取图片blob
        fetch(imageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                a.href = blobUrl;
                a.download = selectedImage.picture || 'downloaded_image.jpg';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                uni.hideLoading();
                showToast('开始下载图片，如果在微信中，会下载失败');
                closeDownloadPopup();
            })
            .catch(error => {
                console.error('下载失败:', error);
                uni.hideLoading();
                showToast('下载图片失败');
            });
    } catch (error) {
        console.error('下载出错:', error);
        uni.hideLoading();
        showToast('下载图片失败');
    }
    // #endif

    // #ifdef APP-PLUS
    // APP端使用plus.downloader
    plus.downloader.createDownload(imageUrl, {
        filename: `_doc/download/${selectedImage.picture}`
    }, (download, status) => {
        if (status === 200) {
            uni.saveImageToPhotosAlbum({
                filePath: download.filename,
                success: () => {
                    uni.hideLoading();
                    showToast('图片已保存到相册');
                    closeDownloadPopup();
                },
                fail: (err) => {
                    uni.hideLoading();
                    if (err.errMsg.includes('auth deny')) {
                        showToast('请授权保存图片到相册的权限');
                    } else {
                        showToast('保存图片失败');
                    }
                }
            });
        } else {
            uni.hideLoading();
            showToast('下载图片失败');
        }
    }).start();
    // #endif

    // #ifdef MP-WEIXIN
    // 微信小程序端
    uni.downloadFile({
        url: imageUrl,
        success: (res) => {
            if (res.statusCode === 200) {
                uni.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                        uni.hideLoading();
                        showToast('图片已保存到相册');
                        closeDownloadPopup();
                    },
                    fail: (err) => {
                        uni.hideLoading();
                        if (err.errMsg.includes('auth deny')) {
                            showToast('请授权保存图片到相册的权限');
                        } else {
                            showToast('保存图片失败');
                        }
                    }
                });
            } else {
                uni.hideLoading();
                showToast('下载图片失败');
            }
        },
        fail: () => {
            uni.hideLoading();
            showToast('下载图片失败');
        }
    });
    // #endif
};

// 关闭二维码弹窗
const closeQrCodePopup = () => {
    qrCodePopup.value.close();
};

// 下载二维码
const downloadQrCode = () => {
    if (!qrCodeUrl.value) {
        showToast('二维码未生成');
        return;
    }

    // #ifdef H5
    const a = document.createElement('a');
    a.href = qrCodeUrl.value;
    a.download = `qrcode_${currentPost.value.postId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('二维码已下载，如果在微信中，会下载失败');
    // #endif

    // #ifdef APP-PLUS || MP-WEIXIN
    // 将base64转换为本地临时文件
    const base64Data = qrCodeUrl.value.split(',')[1];
    const arrayBuffer = uni.base64ToArrayBuffer(base64Data);
    const tempFilePath = `_doc/qrcode_${Date.now()}.png`;
    
    // 写入文件
    plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
        fs.root.getFile(tempFilePath, { create: true }, (fileEntry) => {
            fileEntry.createWriter((writer) => {
                writer.onwrite = () => {
                    // 保存到相册
                    uni.saveImageToPhotosAlbum({
                        filePath: fileEntry.fullPath,
                        success: () => {
                            showToast('二维码已保存到相册');
                        },
                        fail: () => {
                            showToast('保存二维码失败');
                        }
                    });
                };
                writer.onerror = () => {
                    showToast('保存二维码失败');
                };
                writer.write(new Blob([arrayBuffer]));
            });
        });
    });
    // #endif
};

// 添加切换样式的函数
const changeQRStyle = () => {
    qrCodeStyle.value = (qrCodeStyle.value + 1) % qrCodeStyles.length;
    qrCode(); // 重新生成二维码
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
            padding: 0rpx 30rpx 12rpx 30rpx;

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
                width: 100%;
                height: 1000rpx;
                background-color: #f8f8f8;

                .swiper {
                    width: 100%;
                    height: 100%;

                    .swiper-item {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                    }

                    .swiper-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
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
                    .output-text {
                        white-space: pre-wrap; /* 保留换行和空格 */
                        word-wrap: break-word; /* 自动换行 */
                    }
                }

                .text {
                    font-size: 32rpx;
                    color: #333;
                    line-height: 1.5;
                    .output-text {
                        white-space: pre-wrap; /* 保留换行和空格 */
                        word-wrap: break-word; /* 自动换行 */
                    }
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

.download-popup {
    padding: 30rpx;
    max-height: 70vh;
    
    .download-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20rpx;
        border-bottom: 1px solid #f0f0f0;
        
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
        
        .close-btn {
            padding: 10rpx;
        }
    }
    
    .image-list {
        max-height: calc(70vh - 100rpx);
        
        .image-item {
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1px solid #f5f5f5;
            
            .preview-image {
                width: 120rpx;
                height: 120rpx;
                border-radius: 12rpx;
                margin-right: 20rpx;
                background-color: #f5f5f5;
            }
            
            .image-info {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                .image-name {
                    font-size: 28rpx;
                    color: #333;
                }
            }
            
            &:active {
                background-color: #f9f9f9;
            }
        }
    }
}

.share-popup {
    padding: 30rpx;
    
    .share-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20rpx;
        border-bottom: 1px solid #f0f0f0;
        
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
        
        .close-btn {
            padding: 10rpx;
        }
    }
    
    .share-options {
        display: flex;
        justify-content: space-around;
        padding: 40rpx 0;
        
        .share-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10rpx;
            
            .share-icon {
                width: 40rpx;
                height: 40rpx;
                // border-radius: 50%;
            }
            
            text {
                font-size: 24rpx;
                color: #666;
            }
        }
    }
}

// 添加二维码弹窗样式
.qrcode-popup {
    width: 600rpx;
    padding: 40rpx;
    border-radius: 20rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .qrcode-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;
        
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
        
        .close-btn {
            padding: 10rpx;
        }
    }
    
    .qrcode-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10rpx 0;
        background: linear-gradient(145deg, #f6f0f8, #ffffff);
        border-radius: 16rpx;
        
        .qrcode-image {
            width: 480rpx;
            height: 480rpx;
            margin-bottom: 20rpx;
            padding: 20rpx;
            background: #ffffff;
            border-radius: 12rpx;
            box-shadow: 0 2rpx 8rpx rgba(141, 93, 163, 0.1);
        }
        
        .qrcode-tip {
            font-size: 26rpx;
            color: #8d5da3;
            margin-top: 20rpx;
            text-align: center;
            line-height: 1.5;
        }
    }
    
    .qrcode-footer {
        margin-top: 40rpx;
        
        .download-btn {
            width: 100%;
            height: 88rpx;
            line-height: 88rpx;
            text-align: center;
            background: linear-gradient(135deg, #9b6db6, #8d5da3);
            color: #fff;
            border-radius: 44rpx;
            font-size: 28rpx;
            font-weight: 500;
            box-shadow: 0 4rpx 12rpx rgba(141, 93, 163, 0.2);
            transition: all 0.3s ease;
            
            &:active {
                transform: scale(0.98);
                box-shadow: 0 2rpx 6rpx rgba(141, 93, 163, 0.1);
            }
        }
    }
}
</style>