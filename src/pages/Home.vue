<!-- Home.vue 
	首页
-->
<template>
	<view class="container">
		<view class="layout-top">
			<uni-popup ref="popup" type="dialog" border-radius="10px 10px 0 0" confirmText="确定">
				<uni-popup-dialog 
					style="width: 80vw; height: 1200rpx; overflow: auto; font-size: 27rpx; color: #6c6c6c; background-color: #ffffff;" 
					:type="msgType" 
					cancelText="关闭" 
					confirmText="已阅读"
					title="声明" 
					@confirm="dialogConfirm"
					@close="dialogClose"
				>
					<div v-html="dialogContent"></div>
				</uni-popup-dialog>
			</uni-popup>
			
			<view class="box-top">
				<view class="setting">
					<button @click="showDrawer" class="setting-button" plain="ture">
						<img src="../../static/setting.png" class="setting-icon" />
					</button>
					<view class="drawer-body">
						<uni-drawer ref="showLeft" mode="left" :width="320">
							<view class="drawer-content">
								<button plain="ture" class="drawer1" @click="handlePostReview">审核</button>
								<button plain="ture" class="drawer1" @click="handleCommentReview">评论审核</button>
								<button plain="ture" class="drawer1" @click="handleUserManage">用户管理</button>
								<!-- <button plain="ture" class="drawer1" @click="toBeDeveloped"></button>
								<button plain="ture" class="drawer1" @click="toBeDeveloped"></button>
								<button plain="ture" class="drawer1" @click="toBeDeveloped"></button> -->
								<button plain="ture" class="drawer1" @click="handleSendPost">发布帖子</button>
								<button plain="ture" class="drawer1" @click="handleCatManage">猫猫管理</button>
								<button plain="ture" class="drawer1" @click="handleClickLogin">登录/注册</button>
								<button plain="ture" class="drawer1" @click="handleAbout">关于软件</button>
								
							</view>
						</uni-drawer>
					</view>
				</view>
				<view class="discover">
					<button plain="ture" class="btn" @click="handleDiscoverClick">发现</button>
				</view>
				<view class="search" @click="searchHandler">
					<button plain="ture" class="btn">
						<img src="../../static/search.png" class="search-icon"/>
					</button>
				</view>
			</view>
		</view>
		
		<view class="notice-container">
			<uni-notice-bar 
				show-get-more 
				show-icon 
				text="本应用程序为个人项目演示，展开查看声明和帮助。" 
				@getmore="getMore" 
			/>
		</view>
		
		<!-- 帖子区 -->
		<scroll-view 
			:scroll-top="scrollTop" 
			scroll-y="true"  
			class="layout" 
			show-scrollbar="false" 
			@scroll="handleScroll"
			refresher-enabled
			:refresher-triggered="isTriggered"
			@refresherpulling="onPulling"
			@refresherrefresh="onRefresh"
			@refresherrestore="onRestore"
			@scrolltolower="onScrollToLower"
			ref="scrollViewRef"
		>
			<view class="content" id="top">
				<view v-for="post in posts" :key="post.postId"  class="box">
					<image class="pic" :src="`${pic_general_request_url}/post_pics/${post.coverPicture}`" mode="aspectFill" @click="handlerClickPost(post.postId)"></image>
					<view class="text" @click="handlerClickPost(post.postId)">{{ post.title }}</view>
					<view class="info">
						<image class="avatar" :src="`${pic_general_request_url}/user_avatar/${post.authorAvatar}`" mode="aspectFill"></image>
						<text class="nickname">{{ post.authorNickname }}</text>
						<view class="likes">
						<image class="like-icon" src="../../static/爱心.svg"></image>
						<text class="like-count">{{ post.likeCount }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 添加底部加载状态 -->
			<view class="load-more">
				<uni-load-more :status="loadMoreStatus" />
			</view>
		</scroll-view>
		
		<!-- 加载更多 -->
    </view>
</template>

<script setup>
	import { ref, onMounted, nextTick } from 'vue';
	import axios from 'axios';
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
	import { toBeDeveloped, showToast } from '@/src/utils/toast'
	import { useAppStore } from '@/store/modules/app'
	import { storeToRefs } from 'pinia'
	import { getPosts } from '@/src/api/post'

	// 创建 store 实例
	const appStore = useAppStore()
	// 使用 storeToRefs 解构获取响应式状态
	const { postList, pagination } = storeToRefs(appStore)
	// 使用 postList 作为数据源
	const posts = postList
	const currentPage = pagination.page
	const pageSize = pagination.size

	const popup = ref(null)
	const showLeft = ref(null);
	const scrollTop = ref(0); // 保持为 ref
	const clientHeight = ref(0); // 用于存储器的可视高度
	
	const status = ref('more'); // 加载更多的状态

	
	// 声明弹窗的内
	const dialogContent = ref(`
		<p>本应用为演示应用，旨在展示个学习和开发的项目。特此声明：</p>
		<p>1. 非商业用途：本项目仅用于学习和展示，所有功能和内容均为个人开发，不得用于商业目的。</p>
		<p>2. 知识产权：项目中使用的所有第三方库、组件和资源均归合法拥有者所有。项目不对其知识产权的合法性负责。</p>
		<p>3. 数据隐私：本项目未涉及用户数据的收集和存储，用户在使用过程中请勿输入敏感个人信息。开发者不对任何因使用本应用而导致的隐私泄露或数据安全问题负责。</p>
		<p>4. 功能稳定性：本应用处于学习开发阶段，可能存在不稳定或未完善的功能，使用者需自行承担风险。</p>
		<p>5. 免版权资源：项目中的所有图片资源均为免版权可使用，展示的数据均为测试数据，不涉及任何真实用户或实际情况。</p>
		<p>6. 反馈与建议：欢迎用户提供反馈和建议，以帮助开发者不断改进本项目。</p>
		<br/>
		<p>PC端访问建议F12切换模拟设备，为方便用户体验，提供以下测试账号：</p>
		<p>测试账号：tttt<br>密码：1234</p>
		<p>测试账号：admin4<br>密码：4444</p>
		<br/>
		<p>联系开发者:</p>
		<p>
			GitHub: <a href="https://github.com/vikis77" target="_blank">https://github.com/vikis77</a><br>
			Blog: <a href="https://luckyiur.com" target="_blank">https://luckyiur.com</a><br>
			Email: <a href="mailto:qin2607994895@gmail.com">qin2607994895@gmail.com</a>
		</p>
	`)
	
	// 处理确认按钮点击
	const dialogConfirm = () => {
	  console.log('用户已阅读声明')
	}
	
	// 处理关闭弹窗
	const dialogClose = () => {
	  console.log('弹窗已关闭')
	}
	
	onMounted(() => {
		// 使用 `uni.createSelectorQuery` 获取 scroll-view 的实际高度
		const query = uni.createSelectorQuery().in(this);
		query.select('.layout').boundingClientRect((data) => {
			if (data) {
			clientHeight.value = data.height; // 获取可视高度
			console.log('容器可视高度:', clientHeight.value);
			}
		}).exec();
		
		// 从本地存储中获取之前保存的滚动位置
		const savedScrollTop = uni.getStorageSync('scrollTop');
		if (savedScrollTop !== undefined) {
			uni.createSelectorQuery().select('layout').boundingClientRect(rect => {
			uni.pageScrollTo({
				scrollTop: savedScrollTop,
				// scrollTop: 2000,
				duration: 0
			});
			}).exec();
		}
	  
	});
	

	
	// 发送请求获取帖子数据，包括加载初始数据和分页加载更多数据
	const fetchMorePosts = async (isRefresh = false) => {
		// 调用全局获取帖子数据的方法
		await getPosts(undefined, undefined, isRefresh)
		return []
		// try {
		// 	const response = await axios.get(`${API_general_request_url.value}/api/post/getPostBySendtimeForPage?page=${currentPage.value}&pageSize=${pageSize.value}`);
			
		// 	if (response.status === 200 && response.data.code === "2000") {
		// 		appStore.setPageSize(response.data.data.current, response.data.data.size);
		// 		const newPosts = response.data.data.records;
		// 		if (isRefresh) {
		// 			// 刷新时替换所有数据
		// 			appStore.setPostList(newPosts);
		// 		} else {
		// 			// 加载更多时追加数据
		// 			appStore.setPostList([...appStore.postList, ...newPosts]);
		// 		}
		// 		return newPosts;
		// 	}
		// 	return [];
		// } catch (error) {
		// 	uni.showToast({
		// 		title: "获取帖子失败",
		// 		icon: "none"
		// 	});
		// 	console.error('获取帖子失败', error);
		// 	return [];
		// }
	};
	
	// 点击查看更多-查看声明帮助
	const getMore = ()=> {
		popup.value.open() // 打开声明窗
	}
	
	// 打开抽屉
	function showDrawer(){
		showLeft.value.open()
		console.log(111)
	}
	function closeDrawer(){
		showLeft.value.close()
	}
	function searchHandler(){
		uni.navigateTo({
			url:"Search"
		})
	}
	
	// 点击某个帖子
	function handlerClickPost(postId){
		uni.navigateTo({
			url:`Post?postId=${postId}`
		})
	}
	
	// 监听滚动事件，判断是否到达底部
	function handleScroll(event) {
		const { scrollTop: currentScrollTop, scrollHeight } = event.detail;
		
		// 正确设置 scrollTop 的值
		scrollTop.value = currentScrollTop;
		uni.setStorageSync('scrollTop', currentScrollTop);
		
		// 判断是否接近底部（这里设置距离底部100px时触发）
		if (scrollHeight - currentScrollTop - clientHeight.value < 100 && loadMoreStatus.value === 'more') {
			loadMore();
		}
	}
	
	function handleClickLogin(){
		uni.navigateTo({
			url:"login"
		})
	}

	// 点击帖子管理
	const handlePostReview = () => {
		const token = uni.getStorageSync('token');
		if (!token) {
			showToast('请先登录')
			return;
		}
		uni.navigateTo({
			url: 'PostReview'
		});
	}

	// 点击评论审核
	const handleCommentReview = () => {
		const token = uni.getStorageSync('token');
		if (!token) {
			showToast('请先登录')
			return;
		}
		uni.navigateTo({
			url: 'CommentReview'
		});
	}
	
	// 点击发布帖子
	function handleSendPost(){
		const token = uni.getStorageSync('token')
		if (!token) {
			showToast('请先登录')
			return; // 终止函数，避免继续执行
		}
		uni.navigateTo({
			url: 'SendPost'
		})
	}
	
	// 点击猫猫管理
	const handleCatManage = () => {
		uni.navigateTo({
			url: 'CatManage'
		})
	}
	
	// 点击关于按钮
	const handleAbout = () => {
		uni.navigateTo({
			url: 'About'
		})
	}

	// 用户管理
	const handleUserManage = () => {
		const token = uni.getStorageSync('token');
		if (!token) {
			showToast('请先登录')
			return;
		}
		uni.navigateTo({
			url: 'UserManage'
		});
	};

	// 在 script setup 中添加以下变量和方法
	const lastTapTime = ref(0); // 用于记录上次点击时间

	// 添加处理双击的方法
	const handleDiscoverClick = () => {
		const currentTime = new Date().getTime();
		const tapGap = currentTime - lastTapTime.value;
		
		if (tapGap < 300) { // 300毫秒内的双击
			// 使用 uni-app 的方式控制 scroll-view 滚动
			const scrollViewRef = ref(null);
			
			// 将 scroll-view 滚动到顶部
			uni.createSelectorQuery()
				.select('.layout')
				.boundingClientRect(data => {
					if (data) {
						scrollTop.value = 0;
						// 使用 uni.pageScrollTo 来实现平滑滚动
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300  // 300ms的滚动动画
						});
					}
				})
				.exec();
		}
		
		lastTapTime.value = currentTime;
	};

	// 下拉刷新相关变量和方法
	const isTriggered = ref(false);
	const loadMoreStatus = ref('more'); // 可能的状态：more/loading/noMore

	// 下拉刷新相关方法
	const onPulling = () => {
		console.log('下拉刷新触发');
	}

	const onRefresh = async () => {
		console.log('正在刷新');
		isTriggered.value = true;
		
		try {
			await fetchMorePosts(true);
			uni.showToast({
				title: '刷新成功',
				icon: 'success'
			});
		} catch (error) {
			console.error('刷新失败', error);
			uni.showToast({
				title: '刷新失败',
				icon: 'error'
			});
		} finally {
			isTriggered.value = false;
		}
	}

	const onRestore = () => {
		console.log('刷新复位');
		isTriggered.value = false;
	}

	// 添加加载更多方法
	const loadMore = async () => {
		if (loadMoreStatus.value !== 'more') return;
		loadMoreStatus.value = 'loading';
		try {
			await getPosts(undefined, undefined, false);
			if (!appStore.postList || appStore.pagination.total === 0 || appStore.pagination.page >= appStore.pagination.total) {
				console.log(appStore.pagination.page, appStore.pagination.total)
				loadMoreStatus.value = 'noMore';
				uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				});
			} else {
				loadMoreStatus.value = 'more';
			}
		} catch (error) {
			loadMoreStatus.value = 'more';
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			});
			console.error('加载更多失败:', error);
		}
	}

	const onScrollToLower = async () => {
		console.log('触底加载更多');
		// 检查是否还有更多数据可加载
		if (appStore.pagination.page < appStore.pagination.total) {
			await loadMore();
		} else {
			// 已经加载完所有数据
			loadMoreStatus.value = 'noMore';
		}
	};
</script>

<style lang="scss" scoped>
	// 隐藏scroll-view默认滚动条
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
	.container{
		width: 750rpx; /* 设置容器宽度为屏幕宽度 */
		height: 100vh;
		background-color: #ebebeb;
		.layout-top{
			height: 100rpx;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 999;
			background-color: #ffffff;
			padding: 10rpx 0;
			.box-top{
				display: flex;
				padding: 10rpx 0;
				.setting{
					width: 33vw;
					.setting-button{
						border: none;
						.setting-icon{
							padding-top: 17rpx;
							width: 30rpx; /* 根据需要调整大小 */
							height: 30rpx; /* 根据需要调整大小 */
						}
					}
					.drawer-body{
						.drawer-content{
							height: 100%;
							display: flex;
							flex-direction: column;
							justify-content: center;
							.drawer1{
								border: none;
								padding: 20rpx;
								margin-bottom: 10rpx;
								margin-left: 40rpx;
								margin-right: 40rpx;
								background-color: #f8f8f8;
							}
						}
					}
				}
				.discover{
					width: 33vw;
					.btn{
						border: none;
						font-size: 34rpx;
      					font-weight: 600;
					}
				}
				.search{
					width: 33vw;
					.btn{
						border: none;
						font-size: 34rpx;
						font-weight: 600;
						.search-icon{
							padding-top: 17rpx;
							width: 30rpx;
							height: 30rpx;
						}
					}
				}
			}
		}
		.notice-container {
			height: 100rpx;
			position: fixed;
			top: 120rpx;
			left: 0;
			right: 0;
			z-index: 998;
			background-color: #ffffff;
			padding: 2rpx 0;
		}
		.layout{
			width: 100%;
			height: 80vh;
			padding-top: 230rpx;
			background-color: #ebebeb;
			position: relative;
			overflow-y: auto;
			transition: all 0.3s ease-out; // 添加过渡效果
			scroll-behavior: smooth; /* 添加平滑滚动效果 */
			.content{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding-bottom: 20rpx;
				// padding-top: 205rpx;
				.box{ // 每个帖子盒子
					width: 363rpx; /* 每个box占据父容器的 370/750，出间距 */
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
						align-items: center; // 居中对齐弹性盒的各项 <div> 素
						justify-content: space-between; /* 确保头像、昵称和点赞按钮分布 */
						height: 9%;
						padding-left: 15rpx;
						padding-top: 5rpx;
						padding-right: 15rpx;
						.avatar {
						    width: 40rpx;
						    height: 40rpx;
						    border-radius: 50%; /* 圆头像 */
						    object-fit: cover;
						}
						.nickname {
						    font-size: 20rpx;
						    margin-left: 10rpx;
						    flex-grow: 1; /* 让昵称占据剩余空间 */
						}
						.likes {
							display: flex;
							align-items: center;
							.like-icon {
							    width: 24rpx;
							    height: 24rpx;
							}
				
							.like-count {
							    font-size: 18rpx;
							    margin-left: 5rpx;
							}
						}
					}
				}
			}
			
			.load-more {
				padding: 20rpx 0;
				text-align: center;
				color: #999;
				font-size: 24rpx;
			}
		}
	}
</style>
