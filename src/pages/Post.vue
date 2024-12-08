<template>
	<view class="container">
		<view class="">
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="error" cancelText="取消" confirmText="删除"
					title="确认删除吗？" 
					@confirm="dialogConfirmDelete" 
				></uni-popup-dialog>
			</uni-popup>
		</view>
		
		<view class="layout">
			<!-- 固定头部 -->
			<view class="box-head">
				<view class="left1">
					<button class="btn-back" plain="true" @click="handlerClickBack">
						<img class="img1" src="../../static/返回 (1).png" alt="" />
					</button>
					<view class="text001">
						发现
					</view>
				</view>
			</view>
			
			<!-- 博主相关 -->
			<view class="box-blogger">
				<view class="bb-left">
					<img class="img2" :src="`${pic_general_request_url}/user_avatar/${currentPost.authorAvatar}`" alt="" @click="showToast('主页功能开发中')"/>
					<text class="text1">{{ currentPost.authorNickname }}</text>
				</view>
				<view class="bb-right" >
					<button class="btn1" :class="{'btn1-followed': currentPost.isFollowed}" 
						plain="true" @click="handleFollow">
						{{ currentPost.isFollowed ? '已关注' : '关注' }}
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
				<view class="uni-swiper">
					<swiper indicator-dots indicator-color="#e9e9e9" indicator-active-color="#007aff">
						<swiper-item v-for="(item, index) in currentPost.images" :key="index">
							<image 
								:src="`${pic_general_request_url}/post_pics/${item.picture}`" 
								mode="aspectFit"
								@click="previewImage"
							></image>
						</swiper-item>
					</swiper>
				</view>
				
				<view class="text-content">
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
						<uni-icons :type="currentPost.isLiked ? 'heart-filled' : 'heart'" 
							:class="{'heart-animate': isLikeAnimating}"
							size="26" 
							:color="currentPost.isLiked ? '#ff4d4f' : '#666'">
						</uni-icons>
						<text class="count" :class="{'active': currentPost.isLiked}">{{currentPost.likeCount}}</text>
					</view>
					<view class="star" @click="handleCollect">
						<uni-icons :type="currentPost.isCollected ? 'star-filled' : 'star'" 
							:class="{'star-animate': isCollectAnimating}"
							size="26" 
							:color="currentPost.isCollected ? '#faad14' : '#666'">
						</uni-icons>
					</view>
					<view class="chatbubble" @click="handleComment">
						<uni-icons type="chatbubble" size="26"></uni-icons>
						<text class="count">{{comments.length}}</text>
					</view>
					<view class="paperplane" @click="handleShare">
						<uni-icons type="paperplane" size="26"></uni-icons>
					</view>
				</view>
				
				<!-- 评论区域 -->
				<view class="comments-section">
					<view class="comments-header">
						<text class="title">评论 {{comments.length}}</text>
					</view>
					<view class="comment-list">
						<view v-for="(comment, index) in comments" :key="index" class="comment-item">
							<image class="comment-avatar" :src="`${pic_general_request_url}/user_avatar/${comment.userAvatar}`"></image>
							<view class="comment-content">
								<view class="comment-info">
									<text class="comment-username">{{ comment.userName }}</text>
									<text class="comment-time">{{ formatDate(comment.createTime) }}</text>
								</view>
								<text class="comment-text">{{ comment.content }}</text>
								<view class="comment-actions">
									<view class="action-item" @click="likeComment(index)">
										<uni-icons :type="comment.isLiked ? 'heart-filled' : 'heart'" 
											size="14" 
											:color="comment.isLiked ? '#ff4d4f' : '#999'">
										</uni-icons>
										<text :class="{'active': comment.isLiked}">{{comment.likes}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 评论输入框 -->
		<uni-popup ref="commentPopup" type="bottom" background-color="#fff" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<view class="comment-popup">
				<!-- 顶部拖动条 -->
				<view class="drag-bar">
					<view class="drag-bar-inner"></view>
				</view>
				<view class="popup-header">
					<text class="title">评论 ({{comments.length}})</text>
					<uni-icons type="closeempty" size="24" @click="closeComments"></uni-icons>
				</view>
				<scroll-view scroll-y="true" class="comments-container">
					<view class="comment-item" v-for="(comment, index) in comments" :key="index">
						<image class="commenter-avatar" :src="`${pic_general_request_url.value}/user_avatar/${comment.userAvatar}`" mode="aspectFill"></image>
						<view class="comment-content">
							<view class="comment-header">
								<text class="commenter-name">{{comment.userName}}</text>
								<text class="comment-time">{{formatDate(comment.createTime)}}</text>
							</view>
							<text class="comment-text">{{comment.content}}</text>
							<view class="comment-actions">
								<view class="action-item" @click="likeComment(index)">
									<uni-icons :type="comment.isLiked ? 'heart-filled' : 'heart'" 
										size="14" 
										:color="comment.isLiked ? '#ff4d4f' : '#999'">
									</uni-icons>
									<text :class="{'active': comment.isLiked}">{{comment.likes}}</text>
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
					<input type="text" 
						v-model="newComment" 
						:placeholder="replyTo ? `回复 ${replyTo}` : '说点什么...'"
						@confirm="submitComment"
					/>
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
	
	const post_authorId = ref('');
	const userId = ref('');
	const alertDialog = ref(null);
	const commentPopup = ref(null);
	const replyTo = ref('');
	const touchStartY = ref(0);
	const touchMoveY = ref(0);
	const popupTranslateY = ref(0);
	
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
		isLiked: false,
		isCollected: false,
		isFollowed: false
	});
	
	// 新增响应式数据
	const comments = ref([
		{
			id: 1,
			userName: '猫咪爱好者',
			userAvatar: 'default.jpg',
			content: '好可爱的猫猫！',
			createTime: '2024-01-20',
			likes: 12,
			isLiked: false
		},
		{
			id: 2,
			userName: '铲屎官',
			userAvatar: 'default.jpg',
			content: '这只猫很亲人，经常在教学楼附近晒太阳',
			createTime: '2024-01-19',
			likes: 8,
			isLiked: false
		}
	]);
	const newComment = ref('');
	const isLikeAnimating = ref(false);
	const isCollectAnimating = ref(false);
	
	onShow(() => {
		userId.value = uni.getStorageSync('tokenDetail').userId;
		const options = getCurrentPages().pop().options;
		const postId = options.postId; // 获取当前帖子的ID
		uni.request({
			url: `${API_general_request_url.value}/api/post/getPostByPostid?postId=${postId}`,
			method: 'GET',
			success: (res) => {
				if (res.statusCode === 200 && res.data.code === '2000') {
					const post = res.data.data;
					currentPost.value = {
						...post,
						isLiked: false,
						isCollected: false,
						isFollowed: false
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
	})
	
	// 点赞功能
	const handleLike = () => {
		isLikeAnimating.value = true;
		currentPost.value.isLiked = !currentPost.value.isLiked;
		currentPost.value.likeCount += currentPost.value.isLiked ? 1 : -1;
		showToast(currentPost.value.isLiked ? '点赞成功' : '取消点赞');
		setTimeout(() => {
			isLikeAnimating.value = false;
		}, 500);
	};
	
	// 收藏功能
	const handleCollect = () => {
		isCollectAnimating.value = true;
		currentPost.value.isCollected = !currentPost.value.isCollected;
		showToast(currentPost.value.isCollected ? '收藏成功' : '取消收藏');
		setTimeout(() => {
			isCollectAnimating.value = false;
		}, 500);
	};
	
	// 评论功能
	const handleComment = () => {
		showComments();
	};
	
	// 提交评论
	const submitComment = () => {
		if (!newComment.value.trim()) {
			showToast('评论内容不能为空');
			return;
		}
		
		const comment = {
			id: comments.value.length + 1,
			userName: '当前用户',
			userAvatar: 'default.jpg',
			content: newComment.value,
			createTime: new Date().toISOString().split('T')[0],
			likes: 0,
			isLiked: false
		};
		
		comments.value.unshift(comment);
		newComment.value = '';
		showToast('评论成功');
		closeComments();
	};
	
	// 点赞评论
	const likeComment = (index) => {
		const comment = comments.value[index];
		comment.isLiked = !comment.isLiked;
		comment.likes += comment.isLiked ? 1 : -1;
		showToast(comment.isLiked ? '点赞成功' : '取消点赞');
	};
	
	// 关注功能
	const handleFollow = () => {
		currentPost.value.isFollowed = !currentPost.value.isFollowed;
		showToast(currentPost.value.isFollowed ? '关注成功' : '取消关注');
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
		showToast('删除成功');
		uni.navigateBack();
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
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮');
					},
					fail: function(err) {
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
		padding-top: 40rpx;
		
		.box-head {
			width: 100vw;
			height: 8vh;
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
					font-size: 45rpx;
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
	min-height: 60vh;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	transform: translateY(v-bind(popupTranslateY + 'px'));
	transition: transform 0.2s ease-out;
	
	.drag-bar {
		width: 100%;
		height: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		touch-action: none; // 防止触摸事件冲突
		
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
		width: 93%;
		flex: 1;
		padding: 0 30rpx;
		
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
	0% { transform: scale(1); }
	50% { transform: scale(1.3); }
	100% { transform: scale(1); }
}

@keyframes starBeat {
	0% { transform: scale(1); }
	50% { transform: scale(1.3); }
	100% { transform: scale(1); }
}
</style>