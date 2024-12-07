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
						<img src="../static/setting.png" class="setting-icon" />
					</button>
					<view class="drawer-body">
						<uni-drawer ref="showLeft" mode="left" :width="320">
							<view class="drawer-content">
								<button plain="ture" class="drawer1" @click="handlePostReview">帖子审核</button>
								<button plain="ture" class="drawer1" @click="handleUserManage">用户管理</button>
								<!-- <button plain="ture" class="drawer1" @click="toBeDeveloped"></button>
								<button plain="ture" class="drawer1" @click="toBeDeveloped"></button>
								<button plain="ture" class="drawer1" @click="toBeDeveloped"></button> -->
								<button plain="ture" class="drawer1" @click="handleSendPost">发布帖子</button>
								<button plain="ture" class="drawer1" @click="handleCatManage">猫猫管理</button>
								<button plain="ture" class="drawer1" @click="handleClickLogin">登录</button>
								
							</view>
						</uni-drawer>
					</view>
				</view>
				<view class="discover">
					<button plain="ture" class="btn">发现</button>
				</view>
				<view class="search" @click="searchHandler">
					<button plain="ture" class="btn">
						<img src="../static/search.png" class="search-icon"/>
					</button>
				</view>
			</view>
		</view>
		
		<uni-notice-bar show-get-more show-icon text="本应用程序为个人项目演示，展开查看声明和帮助。" @getmore="getMore" />
		
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
		>
			<view class="content">
				<view v-for="post in posts" :key="post.postId"  class="box">
					<image class="pic" :src="`${pic_general_request_url}/post_pics/${post.coverPicture}`" mode="aspectFill" @click="handlerClickPost(post.postId)"></image>
					<view class="text" @click="handlerClickPost(post.postId)">{{ post.title }}</view>
					<view class="info">
						<image class="avatar" :src="`${pic_general_request_url}/user_avatar/${post.authorAvatar}`" mode="aspectFill"></image>
						<text class="nickname">{{ post.authorNickname }}</text>
						<view class="likes">
						<image class="like-icon" src="../static/爱心.svg"></image>
						<text class="like-count">{{ post.likeCount }}</text>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more iconType="circle" :status="status" class="yg7789"/>
		</scroll-view>
		
		<!-- 加载更多 -->
    </view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import axios from 'axios';
	import UniDrawer from '@dcloudio/uni-ui/lib/uni-drawer/uni-drawer.vue'
	
	const API_general_request_url = ref('');
	const pic_general_request_url = ref('');
	console.log("当前 NODE_ENV:", process.env.NODE_ENV);
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
	
	const popup = ref(null)
	const showLeft = ref(null);
	const scrollTop = ref(0); // 控制滚动位置
	const clientHeight = ref(0); // 用于存储容器的可视高度
	const curPage = ref(0); // 当前页数
	const pages = ref(0) // 总页数
	const size = ref(10) // 页面大小
	const status = ref('more'); // 加载更多的状态
	// const posts = ref({
	// 	postId = 0,
	// 	article = ''
	// });
	const posts = ref([]);
	
	// 声明弹窗的内容
	const dialogContent = ref(`
		<p>本应用程序为演示应用，旨在展示个人学习和开发的项目。特此声明：</p>
		<p>1. 非商业用途：本项目仅用于学习和展示，所有功能和内容均为个人开发，不得用于商业目的。</p>
		<p>2. 知识产权：项目中使用的所有第三方库、组件和资源均归其合法拥有者所有。项目不对其知识产权的合法性负责。</p>
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
	
	// 加载更多
	const loadMorePosts = async () => {
		console.log('开始加载更多。。。')
		curPage.value++; // 页数递增
		// 从后端获取数据
		const newPosts = await fetchMorePosts();
		posts.value.push(...newPosts);
		if (newPosts.length === 0) {
			status.value = 'noMore'; // 表示没有更多数据
		}
	};
	
	// 发起请求获取帖子数据，包括加载初始数据和分页加载更多数据
	const fetchMorePosts = async () => {
		try {
			// 发送请求获取数据
			console.log(`${API_general_request_url.value}/api/post/getPostBySendtimeForPage`);
			const response = await axios.get(`${API_general_request_url.value}/api/post/getPostBySendtimeForPage?page=${curPage.value}&pageSize=${size.value}`);
			console.log("发起请求获取帖子数据，响应数据：");
			console.log(response);

			// 判断响应是否成功
			if (response.status === 200 && response.data.code === "2000") {
				// 更新分页信息
				pages.value = response.data.data.pages;
				curPage.value = response.data.data.current;

				// 如果是加载更多，合并新数据和旧数据
				if (status.value === 'loading') {
					posts.value = [...posts.value, ...response.data.data.records];
				} else {
					// 否则重新加载数据
					posts.value = response.data.data.records;
				}

				// 将帖子数据存储到本地缓存
				uni.setStorageSync("postsList", posts.value);
				console.log("posts数据：");
				console.log(posts.value);
			}
		} catch (error) {
			// 请求失败时显示错误提示
			uni.showToast({
				title: "获取帖子失败" + error,
				icon: "none"
			});
			console.error('获取帖子失败', error);
		}
	};


	// 页面加载时，获取第一页的帖子数据
	fetchMorePosts();
	
	// 添加刷新相关的响应式变量
const isTriggered = ref(false);

// 下拉刷新相关方法
const onPulling = () => {
  console.log('下拉刷新触发');
}

const onRefresh = async () => {
  console.log('正在刷新');
  isTriggered.value = true;
  
  try {
    // 重置页码
    curPage.value = 0;
    // 重新获取数据
    await fetchMorePosts();
    
    uni.showToast({
      title: '刷新成功',
      icon: 'success'
    });
  } catch (error) {
    uni.showToast({
      title: '刷新失败',
      icon: 'error' 
    });
  } finally {
    // 结束刷新状态
    isTriggered.value = false;
  }
}

const onRestore = () => {
  console.log('刷新被复位');
  isTriggered.value = false;
}

	// 点击查看更多-查看声明帮助
	const getMore = ()=> {
		popup.value.open() // 打开声明弹窗
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
			url:"/pages/Search"
		})
	}
	
	// 点击某个帖子
	function handlerClickPost(postId){
		uni.navigateTo({
			url:`/pages/Post?postId=${postId}`
		})
	}
	
	// 监听滚动事件，判断是否到达底部
	function handleScroll(event) {
		const { scrollTop: top, scrollHeight } = event.detail;
		
		console.log('滚动位置:', top);
		console.log('内容总高度:', scrollHeight);
		console.log('容器可视高度:', clientHeight.value);
		
		//如果滚动到接近底部，并且没有在加载状态下，触发加载更多
		console.log(scrollHeight - top - clientHeight.value)
		if (scrollHeight - top - clientHeight.value < 50 && status.value !== 'loading') {
			status.value = 'loading'; // 设置加载状态
			loadMorePosts(); // 加载更多内容
		}
		  
		//保存滚动位置
		scrollTop.value = event.detail.scrollTop;
		uni.setStorageSync('scrollTop', scrollTop.value);
	}
	
	function handleClickLogin(){
		uni.navigateTo({
			url:"/pages/login"
		})
	}
	
	const toBeDeveloped = () => {
			uni.showToast({
				title: '待开发',
				icon: 'error'
			})
		}

	// 点击帖子管理
	const handlePostReview = () => {
		const token = uni.getStorageSync('token');
		if (!token) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			return;
		}
		uni.navigateTo({
			url: '/pages/PostReview'
		});
	}
	
	// 点击发布帖子
	function handleSendPost(){
		const token = uni.getStorageSync('token')
		if (!token) {
			// 提示用户登录
			uni.showToast({
				title: '请登录之后再来吧 ~~',
				icon: 'none'
			});
			return; // 终止函数，避免继续执行
		}
		uni.navigateTo({
			url: '/pages/SendPost'
		})
	}
	
	// 点击猫猫管理
	const handleCatManage = () => {
		uni.navigateTo({
			url: '/pages/CatManage?from=home'
		})
	}

	// 用户管理
	const handleUserManage = () => {
		const token = uni.getStorageSync('token');
		if (!token) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			return;
		}
		uni.navigateTo({
			url: '/pages/UserManage'
		});
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
		height: 100%vh;
		.layout-top{
			// padding-top: 40rpx;
			.box-top{
				display: flex;
				margin-top: 20rpx;
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
					}
				}
				.search{
					width: 33vw;
					.btn{
						border: none;
						.search-icon{
							padding-top: 17rpx;
							width: 30rpx;
							height: 30rpx;
						}
					}
				}
			}
		}
		.layout{
			width: 100%; /* 确保布局区域宽度充满父容器 */
			height: 100vh; /* 设置布局高度，使其可以滚动 */
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
						.avatar {
						    width: 40rpx;
						    height: 40rpx;
						    border-radius: 50%; /* 圆形头像 */
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
			
		}
		.yg7789{
			background-color: #ebebeb;
		}
	}
</style>
