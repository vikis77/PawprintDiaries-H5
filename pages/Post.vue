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
					<!-- 返回按钮 -->
					<button class="btn-back" plain="true" @click="handlerClickBack">
						<img class="img1" src="../static/返回 (1).png" alt="" />
					</button>
					<view class="text001">
						发现
					</view>
				</view>
			</view>
			
			<!-- 博主相关 -->
			<view class="box-blogger">
				<view class="bb-left" @click="toBeDeveloped">
					<img class="img2" :src="`${pic_general_request_url}/user_avatar/${currentPost.authorAvatar}`" alt="" />
					<text class="text1">{{ currentPost.authorNickname }}</text>
				</view>
				<view class="bb-right" >
					<button class="btn1" plain="true" @click="toBeDeveloped">关注</button>
					<view class="heart">
						<uni-icons type="download" size="26" @click="toBeDeveloped"></uni-icons>
					</view>
					<!-- 删除 只有当当前用户ID和帖子作者ID相同时，才会展示删除按钮-->
					<view v-if="userId == post_authorId" class="heart" @click="handleDeletePost">
						<uni-icons type="closeempty" size="26"></uni-icons>
					</view>
					
				</view>
			</view>
			<!-- 中间滚动内容 -->
			<view class="box-body">
				<!-- <view> -->
					<!-- 轮播图 -->
					<view class="uni-swiper">
						<swiper indicator-dots indicator-color="#e9e9e9" indicator-active-color="#007aff">
							<swiper-item v-for="item in currentPost.images" :key="item.src">
								<image :src="`${pic_general_request_url}/post_pics/${item.picture}`" mode="aspectFit"></image>
							</swiper-item>
						</swiper>
					</view>
					
					
					<!-- 文案 -->
					<view class="text-content">
						<view class="text">
							{{ currentPost.article }}
						</view>
						<view class="data">
							{{ formatDate(currentPost.send_time) }}
						</view>
					</view>
					
					<view class="operate" @click="toBeDeveloped">
						<view class="heart">
							<uni-icons type="heart" size="26"></uni-icons>
						</view>
						<view class="star">
							<uni-icons type="star" size="30"></uni-icons>
						</view>
						<view class="chatbubble">
							<uni-icons type="chatbubble" size="30"></uni-icons>
						</view>
						<view class="paperplane">
							<uni-icons type="paperplane" size="28"></uni-icons>
						</view>
					</view>
					<!-- 评论区域 -->
					<view class="comments">
						{{ currentPost.likeCount }}次赞
		
					</view>
				<!-- </view> -->
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
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
	
	const post_authorId = ref('');
	const userId = ref('');
	const alertDialog = ref(false);
	
	// 使用 ref 创建响应式的图片数组
	const images = ref([
	  { src: '../static/xiaoxin2.jpg' },
	  { src: '../static/001.jpg' },
	  { src: '../static/xiaoxin2.jpg' },
	  { src: '../static/xiaoxin2.jpg' },
	  { src: '../static/xiaoxin2.jpg' },
	  { src: '../static/xiaoxin2.jpg' }
	]);
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
		postId: 0
	});
	
	onShow(() => {
		userId.value = uni.getStorageSync('tokenDetail').userId;
		const options = getCurrentPages().pop().options;
		const postId = options.postId; // 获取当前帖子的ID
		// console.log(postId)
		uni.request({
			url: `${API_general_request_url.value}/api/post/getPostByPostid?postId=${postId}`,
			method: 'GET',
			success: (res) => {
				console.log(res)
				if (res.statusCode === 200 && res.data.code === '2000') {
					const post = res.data.data;
					currentPost.value = post;
					post_authorId.value = currentPost.value.authorId;
					console.log(userId.value);
					console.log(post_authorId.value)
				}else{
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
	
	// 日期格式化函数
	function formatDate(dateStr) {
		const date = new Date(dateStr);
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	}
	
	// 返回按钮点击处理
	function handlerClickBack(){
		const pages = getCurrentPages();
			if (pages.length > 1) {
		    uni.navigateBack();
		} else {
			uni.reLaunch({
				url:"/pages/Home"
			})
		    console.log("没有上一页");
		}
	}
	
	const toBeDeveloped = () => {
		uni.showToast({
			title: '待开发',
			icon: 'error'
		})
	}
	
	// 处理删除帖子逻辑
	const handleDeletePost = () =>{
		alertDialog.value.open();
		console.log(post_authorId.value)
	}
	
	// 确认删除
	const dialogConfirmDelete =()=>{
		// const token = uni.getStorageSync('token')
		console.log('开始删除')
		uni.request({
			url: `${API_general_request_url.value}/api/post/deletepost?postId=${currentPost.value.postId}`,
			method: 'DELETE',
			header: {
				'Authorization' : `Bearer ${uni.getStorageSync('token')}`
				// 'Authorization' : `Bearer ${token}`
			},
			success: (res) => {
				console.log(res)
				if (res.statusCode === 200 && res.data.code === '2000') {
					uni.showToast({
						title: '帖子已删除',
						icon: 'none'
					})
					uni.navigateBack();
				}else {
					uni.showToast({
						title: '出错啦！',
						icon: 'none'
					})
				}
			},
			fail: (res) => {
				uni.showToast({
					title: '删除失败，请稍后试试吧！',
					icon: 'none'
				})
			}
		})
	}
</script>

<style lang="scss" scoped>
	// 隐藏scroll-view默认滚动条
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
	.container{
		width: 750rpx;
		height: 100vh;
		.layout{
			padding-top: 40rpx;
			// flex-wrap: wrap;
			.box-head{
				width: 100vw;
				height: 8vh;
				display: flex;
				justify-content: space-between; /* 确保左右两部分分开对齐 */
				.left1{
					width: 500%;
					// align-items: flex-start;
					display: flex;
					align-items: center; /* 垂直居中 */
					// justify-content: space-between; /* 确保头像、昵称和点赞按钮分布 */
					// justify-content: flex-start;
					.btn-back{ // 返回
						height: 80rpx;
						width: 80rpx;
						// padding-right: 60rpx;
						margin-right: 20rpx;
						margin-left: 20rpx;
						border: none;
						// 
						.img1{
							padding-top: 20rpx;
							padding-right: 5rpx;
							width: 35rpx;
							height: 35rpx;
						}
					}
					.text001{
						font-size: 45rpx;
					}
				}
			}
			
			//<!-- 博主相关 -->
			.box-blogger{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.bb-left{
					padding-left: 40rpx;
					display: flex;
					align-items: center;
					.img2{ // 头像
						width: 50%;
						display: flex;
						height: 65rpx;
						width: 65rpx;
						object-fit: cover; /* 确保图片按比例缩放，不超出容器 */
						border-radius: 30rpx; /* 图片也应用圆角 */
					}
					.text1{ // 昵称
						padding-left: 30rpx;
					}
				}
				.bb-right{
					display: flex;
					padding-right: 20rpx;
					align-items: center;
					.btn1{ // 关注
						width: 110rpx;
						height: 60rpx;
						font-size: 28rpx;
						margin-right: 10rpx; /* 调整右边距 */
						line-height: 60rpx; /* 设置行高与容器高度一致，使文字垂直居中 */
						background-color: #f3f3f3;
						border: none;
					}
					.img3{ //分享
						margin-right: 20rpx;
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
			// 中间主要部分
			.box-body{
				height: 82vh;
				.uni-swiper{
					width: 750rpx;
					padding: 10rpx 0; // 上下 左右
					swiper{
						width: 750rpx;
						height: 1000rpx;
						swiper-item{
							width: 100%;
							height: 100%;
							image{
								width: 100%;
								height: 100%;
							}
						}
					}
					
				}
				.text-content{ // 文案区
					padding: 20rpx;
					.text{
						font-size: 30rpx;
						padding: 10rpx;
					}
					.data{
						font-size: 20rpx;
						color: #c4c4c4;
						padding: 10rpx;
					}
				}
				.operate{ //底部操作区
					margin: 15rpx;
					display: flex;
					view{
						padding-left: 10rpx;
					}
					.heart{
						padding-top: 5rpx;
					}
					.paperplane{
						padding-top: 1rpx;
					}
				}
				.comments{
					margin: 30rpx;
					
				}
			}
		}
	}
</style>