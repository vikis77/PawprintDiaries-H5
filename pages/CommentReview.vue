<template>
    <view class="comment-review">
        <!-- 顶部导航栏 -->
        <NavBar1001 title="评论审核" :showLeft="true" :showRight="false" />

        <!-- 筛选区域 -->
        <view class="filter-section">
            <view class="filter-tabs">
                <view class="tab" :class="{ active: commentType === 'all' }" @click="setCommentType('all')">全部评论</view>
                <view class="tab" :class="{ active: commentType === 'post' }" @click="setCommentType('post')">帖子评论
                </view>
                <view class="tab" :class="{ active: commentType === 'cat' }" @click="setCommentType('cat')">猫咪评论</view>
            </view>

            <view class="sort-section">
                <text>排序：</text>
                <picker :value="sortIndex" :range="sortOptions" @change="handleSortChange">
                    <view class="sort-picker">
                        {{ sortOptions[sortIndex] }}
                        <uni-icons type="bottom" size="12" />
                    </view>
                </picker>
            </view>
        </view>

        <!-- 评论列表 -->
        <scroll-view scroll-y class="comment-list" @scrolltolower="loadMore" refresher-enabled
            :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh">
            <view class="comment-item" v-for="item in commentList" :key="item.id">
                <view class="comment-header">
                    <view class="user-info">
                        <image class="avatar" :src="`${pic_general_request_url}/user_avatar/${item.avatar}${Suffix_1002}`" mode="aspectFill" />
                        <text class="username">{{ item.nickName }}</text>
                    </view>
                    <text class="time">{{ item.createTime ? new Date(item.createTime).toLocaleString() : '暂无时间' }}</text>
                </view>

                <view class="comment-content" @click="handleCommentClick(item)">
                    {{ item.commentContext }}
                </view>

                <view class="comment-source">
                    来源：{{ item.type === 20 ? '帖子评论' : '猫咪评论' }}
                    <text class="source-title">{{ item.sourceName }}</text>
                </view>
                <view class="action-buttons">
                    <button class="btn approve" @click="handleApprove(item.id, item.type)">通过</button>
                    <button class="btn reject" @click="handleReject(item.id, item.type)">拒绝</button>
                </view>
            </view>

            <uni-load-more :status="loadMoreStatus" />
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar1001 from '@/src/components/common/NavBar1001.vue'
import { getPendingComments, reviewComment } from '@/src/api/comment.js'
import { useAppStore } from '@/store/modules/app'
import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'

// 创建 store 实例
const appStore = useAppStore()

// 响应式变量
const commentType = ref('all')
const sortOptions = ['最新发布', '最早发布']
const sortIndex = ref(0)
const commentList = ref([])
const page = ref(1)
const isRefreshing = ref(false)
const loadMoreStatus = ref('more')
const pageSize = ref(10)
const hasMore = ref(true)

// 加载评论数据
const loadComments = async () => {
    try {
        loadMoreStatus.value = 'loading'
        const params = {
            page: page.value,
            pageSize: pageSize.value,
            type: commentType.value,
            sort: sortIndex.value === 0 ? 'desc' : 'asc'
        }
        
        await getPendingComments(params)
        let data = []
        
        // 根据类型获取对应数据
        if (commentType.value === 'all') {
            data = [
                ...(appStore.auditCommentList.catComments || []),
                ...(appStore.auditCommentList.postComments || [])
            ]
        } else if (commentType.value === 'post') {
            data = appStore.auditCommentList.postComments || []
        } else if (commentType.value === 'cat') {
            data = appStore.auditCommentList.catComments || []
        }

        // 按时间排序
        data.sort((a, b) => {
            const timeA = new Date(a.createTime).getTime()
            const timeB = new Date(b.createTime).getTime()
            return sortIndex.value === 0 ? timeB - timeA : timeA - timeB
        })

        // 更新数据列表
        if (page.value === 1) {
            commentList.value = data
        } else {
            commentList.value = [...commentList.value, ...data]
        }

        // 更新加载状态
        hasMore.value = data.length >= pageSize.value
        loadMoreStatus.value = hasMore.value ? 'more' : 'noMore'
        
    } catch (error) {
        // console.error("加载评论数据失败：", error)
        // uni.showToast({
        //     title: '加载失败',
        //     icon: 'none'
        // })
        loadMoreStatus.value = 'more'
    } finally {
        isRefreshing.value = false
    }
}

// 点击评论跳转到对应的页面
const handleCommentClick = (item) => {
    if (item.type === 10) { // 猫咪评论
        uni.navigateTo({
        url: `Card?catId=${item.catId}`
    })
    } 
    else if (item.type === 20) { // 帖子评论
        uni.navigateTo({
			url:`Post?postId=${item.postId}`
		})
    }
}

// 设置评论类型
const setCommentType = (type) => {
    if (type === commentType.value) return
    commentType.value = type
    page.value = 1
    hasMore.value = true
    loadMoreStatus.value = 'more'
    commentList.value = []
    loadComments()
}

// 处理排序变化
const handleSortChange = (e) => {
    if (sortIndex.value === e.detail.value) return
    sortIndex.value = e.detail.value
    page.value = 1
    hasMore.value = true
    loadMoreStatus.value = 'more'
    commentList.value = []
    loadComments()
}

// 加载更多
const loadMore = () => {
    if (loadMoreStatus.value === 'more' && hasMore.value) {
        page.value++
        loadComments()
    }
}

// 刷新
const onRefresh = async () => {
    isRefreshing.value = true
    page.value = 1
    hasMore.value = true
    loadMoreStatus.value = 'more'
    await loadComments()
}

// 使用 onMounted 钩子在组件挂载后加载数据
onMounted(() => {
    // loadComments()
})

// 使用 onShow 钩子在每次页面显示时加载数据
onShow(() => {
    page.value = 1
    loadComments()
})

// 返回
const handleGoback = () => {
    uni.navigateBack()
}

// 审核通过 type: 10小猫 20帖子
const handleApprove = async (id, type) => {
    if (checkLogin()) {
        uni.showModal({
            title: '确认',
            content: '确定通过这条评论吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        // 调用审核通过接口
                        await reviewComment(id, type, 'approve')
                        
                        // 重新加载当前页数据
                        page.value = 1
                        await loadComments()
                    } catch (error) {
                        uni.showToast({
                            title: '操作失败',
                            icon: 'none'
                        })
                    }
                }
            }
        })
    }
}

// 审核拒绝
const handleReject = async (id, type) => {
    if (checkLogin()) {
        uni.showModal({
            title: '确认',
            content: '确定拒绝这条评论吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        // 调用审核拒绝接口
                        await reviewComment(id, type, 'reject')
                        uni.showToast({
                            title: '已拒绝',
                            icon: 'success'
                        })
                        // 重新加载当前页数据
                        page.value = 1
                        await loadComments()
                    } catch (error) {
                        uni.showToast({
                            title: '操作失败',
                            icon: 'none'
                        })
                    }
                }
            }
        })
    }
}

</script>

<style lang="scss" scoped>
.comment-review {
    min-height: 100vh;
    background-color: #f5f5f5;

    .filter-section {
        background-color: #fff;
        padding: 20rpx;
        // margin-bottom: 20rpx;

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