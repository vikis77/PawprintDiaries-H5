<template>
  <view class="container">
    <!-- 头像和昵称区域 -->
    <view class="profile-header">
      <img class="avatar" src="../static/xxavatar1.jpg" mode="aspectFill"></img>
      <view class="username">{{ user.nickName }}</view>
      <view class="signature">个性签名：{{ user.signature }}</view>
    </view>

    <!-- 数据展示区域 -->
    <view class="stats-bar" @click="toBeDeveloped">
      <view class="stats-item">
        <view class="stats-number">{{ user.postCount }}</view>
        <view class="stats-label">贴子数</view>
      </view>
      <view class="stats-item">
        <view class="stats-number">{{ user.fansCount }}</view>
        <view class="stats-label">粉丝数</view>
      </view>
      <view class="stats-item">
        <view class="stats-number">{{ user.followCount }}</view>
        <view class="stats-label">关注数</view>
      </view>
    </view>

	<!-- 帖子列表 -->
	<scroll-view :scroll-top="scrollTop" scroll-y="true" class="post-list" show-scrollbar="false" @scroll="handleScroll">
	  <view class="content">
		<view v-for="post in user.postList" :key="post.postId"  class="box">
		  <image class="pic" :src="`${pic_general_request_url}/post_pics/${post.coverPicture}`" mode="aspectFill" @click="handlerClickPost(post.postId)"></image>
		  <view class="text" @click="handlerClickPost(post.postId)">{{ post.title }}</view>
		  <view class="info" @click="toBeDeveloped">
			<view class="likes">
				<img class="like-icon" src="../static/爱心.svg"></img>
				<text class="like-count">{{ post.likeCount }}</text>
			</view>
			<view class="star">
				<uni-icons type="star" size="20"></uni-icons>
				<text class="star-count">{{ post.collectingCount }}</text>
			</view>
			<view class="chatbubble">
				<uni-icons type="chatbubble" size="20"></uni-icons>
				<text class="chatbubble-count">{{ post.commentCount }}</text>
			</view>
		  </view>
		</view>
	  </view>
	</scroll-view>
  </view>
  
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
	
	const API_general_request_url = ref('');
	const pic_general_request_url = ref('');
	if (process.env.NODE_ENV === 'development'){
		// 图片
		pic_general_request_url.value = "http://localhost:8000"
		// 请求
		API_general_request_url.value = "http://localhost:8080"
	} else {
		// 图片
		pic_general_request_url.value = "https://cdn.luckyiur.com/catcat"
		// 请求
		API_general_request_url.value = "https://pawprintdiaries.luckyiur.com"
	}
	
	// 响应式变量绑定用户数据
	const username = ref('')
	const user = ref({
	  userId: '',
	  username: '',
	  nickName: '',
	  email: '',
	  phoneNumber: '',
	  brithday: '',
	  address: '',
	  avatar: '',
	  role: '',
	  status: 0,
	  createTime: '',
	  updateTime: '',
	  postCount: 0,
	  fansCount: 0,
	  followCount: 0,
	  signature: '',
	  postList: []
	})
	
	// 页面加载时发起请求获取用户数据
	onShow(() => {
		console.log(("主页挂载"))
		const token = uni.getStorageSync('token')
		if (token) {
			console.log(token)
			uni.request({
				url: `${API_general_request_url.value}/api/user/profile`,
				method: 'GET',
				header: {
					'Authorization': `Bearer ${token}`
				},
				success: (res) => {
					console.log(res)
					if (res.statusCode === 200 && res.data.code === '2000') {
						user.value = res.data.data
						console.log("打印user:")
						console.log(user.value)
					} else {
						uni.removeStorageSync('token')
						uni.showToast({
							title: res.data.msg || '获取用户数据失败',
							icon: 'none'
						})
					}
				},
				fail: () => {
					uni.showToast({
					title: '请求失败，请重试',
					icon: 'none'
					})
				}
			})
		} else {
			uni.removeStorageSync('token');
			uni.showToast({
			title: '未登录，请先登录',
			icon: 'none'
			})
		}
	})
	
	// 点击某个帖子
	function handlerClickPost(postId){
		console.log(postId)
		uni.navigateTo({
			url:`/pages/Post?postId=${postId}`
		})
	}
	
	const toBeDeveloped = () => {
			uni.showToast({
				title: '待开发',
				icon: 'error'
			})
		}
</script>

<style lang="scss" scoped>
	.container {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 10px;
	  
		.profile-header {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 20px;
	    
			.avatar {
				width: 120px;
				height: 120px;
				border-radius: 50%;
			}
	    }
	    
	    .username {
			margin-top: 10px;
			font-size: 22px;
			font-weight: bold;
	    }
	    
	    .signature {
			margin-top: 5px;
			color: #888;
			font-size: 14px;
			text-align: center;
	    }
	  
		.stats-bar {
			display: flex;
			justify-content: space-between;
			width: 100%;
			margin: 20px 0;
	    
			.stats-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
	      
				.stats-number {
					font-size: 20px;
					font-weight: bold;
				}
	      
				.stats-label {
					margin-top: 5px;
					font-size: 14px;
					color: #888;
				}
			}
		}
		
		.post-list{
			width: 100%; /* 确保布局区域宽度充满父容器 */
			height: 86vh; /* 设置布局高度，使其可以滚动 */
			background-color: #ebebeb;
			.content{
				display: flex; // 弹性布局
				flex-wrap: wrap; /* 使每行能容纳多个box，允许子元素换行显示 */
				justify-content: space-between; /* 对齐方式：两端对齐元素之间等距排列 */
				.box{ // 每个帖子盒子
					width: 363rpx; /* 每个box占据父容器的 370/750，留出间隙 */
					height: 550rpx;
					background-color: #ffffff;
					margin: 6rpx; //避免 box 垂直紧贴
					border-radius: 10rpx;
					overflow: hidden; /* 防止子元素超出边界 */
					.pic{
						height: 80%;
						width: 100%; /* 确保图片宽度与box匹配 */
						object-fit: cover; /* 确保图片按比例缩放，不超出容器 */
						border-top-left-radius: 10rpx; /* 图片也应用圆角 */
						border-top-right-radius: 10rpx; /* 图片也应用圆角 */
					}
					.text{
						font-size: 25rpx;
						padding-left: 13rpx;
						padding-bottom: 2rpx;
						height: 8%;
					}
					.info{
						display: flex;
						align-items: center; // 居中对齐弹性盒的各项 <div> 元素
						justify-content: space-between; /* 确保头像、昵称和点赞按钮分布 */
						height: 9%;
						padding-left: 15rpx;
						padding-top: 5rpx;
						padding-right: 15rpx;
						
						.likes {
							display: flex;
							align-items: center;
							.like-icon {
							    width: 32rpx;
							    height: 32rpx;
							}
							.like-count {
							    font-size: 18rpx;
							    margin-left: 5rpx;
							}
						}
						.star {
							display: flex;
							align-items: center;
							.star-count {
							    font-size: 18rpx;
								margin-left: 5rpx;
							}
						}
						.chatbubble {
							display: flex;
							align-items: center;
							.chatbubble-count {
							    font-size: 18rpx;
								margin-left: 5rpx;
							}
						}
					}
				}
			}
		}
		// .post-list {
		// 	width: 100%;
	    
		// 	.post-item {
		// 		width: 100%;
		// 		height: 0;
		// 		padding-bottom: 100%; /* 高度为宽度的1:1 */
		// 		position: relative;
		// 		margin-bottom: 10rpx;
	  	
		// 		.post-image {
		// 			position: absolute;
		// 			top: 0;
		// 			left: 0;
		// 			width: 100%;
		// 			height: 100%;
		// 			border-radius: 10rpx;
		// 			object-fit: cover;
		// 		}
		// 	}
		// }
	}
</style>
