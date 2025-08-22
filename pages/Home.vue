<!-- Home.vue 
	首页
-->
<template>
	<view class="container">
		<view class="layout-top">
            <!-- 声明弹窗 -->
			<uni-popup ref="popup" type="dialog" border-radius="10px 10px 0 0" confirmText="确定">
				<uni-popup-dialog 
					style="width: 80vw; overflow: auto; font-size: 27rpx; color: #6c6c6c; background-color: #ffffff;" 
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

            <!-- 温馨提示弹窗（PC端首次访问） -->
            <uni-popup ref="popupForPc" type="dialog" border-radius="10px 10px 0 0" :maskClick="false">
				<uni-popup-dialog 
					style="width: 80vw; overflow: auto; font-size: 27rpx; color: #6c6c6c; background-color: #ffffff;" 
					:type="msgType" 
					cancelText="关闭" 
					confirmText="已了解"
					title="温馨提示" 
					@confirm="dialogConfirm"
					@close="dialogClose"
				>
					<div v-html="currentDialogContent"></div>
				</uni-popup-dialog>
			</uni-popup>
			
			<view class="box-top">
				<view class="setting">
					<button @click="showDrawer" class="setting-button" plain="ture">
						<img src="../static/setting.png" class="setting-icon" />
					</button>
					<view class="drawer-body">
						<uni-drawer ref="showLeft" mode="left" :width="250">
							<view class="drawer-content">
								<view class="drawer-header">
									<text class="drawer-title">菜单</text>
								</view>
								<view class="drawer-items">
									<button plain="true" class="drawer-item" @click="handlePostReview">
										<img src="../static/post-review.png" class="drawer-icon" />
										<text>帖子审核</text>
									</button>
									<button plain="true" class="drawer-item" @click="handleCommentReview">
										<img src="../static/comment-review.png" class="drawer-icon" />
										<text>评论审核</text>
									</button>
									<button plain="true" class="drawer-item" @click="handleUserManage">
										<img src="../static/user-manage.png" class="drawer-icon" />
										<text>角色管理</text>
									</button>
									<button plain="true" class="drawer-item" @click="handleSendPost">
										<img src="../static/send-post.png" class="drawer-icon" />
										<text>发布帖子</text>
									</button>
									<button plain="true" class="drawer-item" @click="handleCatManage">
										<img src="../static/cat007.png" class="drawer-icon" />
										<text>猫猫管理</text>
									</button>
									<button plain="true" class="drawer-item" @click="handleAiChatTest">
										<img src="../static/ai-chat.png" class="drawer-icon" />
										<text>AI 聊天测试</text>
									</button>
									<button plain="true" class="drawer-item" @click="handleClickLogin">
										<img src="../static/login.png" class="drawer-icon" />
										<text>登录/注册</text>
									</button>
									<button plain="true" class="drawer-item" @click="handleAbout">
										<image src="../static/about.png" class="drawer-icon" />
										<text>关于软件</text>
									</button>
								</view>
							</view>
						</uni-drawer>
					</view>
				</view>
				<view class="discover">
					<button plain="ture" class="btn" @click="handleDiscoverClick">发现</button>
				</view>
				<view class="search" @click="searchHandler">
					<button plain="ture" class="btn">
						<img src="../static/search.png" class="search-icon"/>
					</button>
				</view>
			</view>
		</view>
		
		<view class="notice-container" @click="getMore">
			<uni-notice-bar 
				show-get-more 
				show-icon 
				text="点击查看声明和帮助。" 
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
			<!-- 添加骨架屏 -->
			<view v-if="loading" class="skeleton-container">
				<view v-for="i in 6" :key="i" class="skeleton-box">
					<view class="skeleton-image"></view>
					<view class="skeleton-text"></view>
					<view class="skeleton-info">
						<view class="skeleton-avatar"></view>
						<view class="skeleton-nickname"></view>
						<view class="skeleton-likes"></view>
					</view>
				</view>
			</view>

			<view class="content" id="top" v-else>
				<view v-for="(post, index) in posts" 
					:key="post.postId"
					class="box"
					:style="{ 
						animation: `fadeInUp 0.5s ease-out forwards`,
						animationDelay: `${index * 0.1}s`
					}"
				>
					<image class="pic" :src="`${pic_general_request_url}/post_pics/${post.coverPicture}${Suffix_1002}`" mode="aspectFill" @click="handlerClickPost(post.postId)"></image>
					<view class="text" @click="handlerClickPost(post.postId)">{{ post.title }}</view>
					<view class="info">
						<image class="avatar" :src="`${pic_general_request_url}/user_avatar/${post.authorAvatar}${Suffix_1002}`" mode="aspectFill"></image>
						<text class="nickname">{{ post.authorNickname }}</text>
						<view class="likes">
						<image class="like-icon" src="../static/love.svg"></image>
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
	import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
	import { toBeDeveloped, showToast } from '@/src/utils/toast'
	import { useAppStore } from '@/store/modules/app'
	import { storeToRefs } from 'pinia'
	import { getPosts } from '@/src/api/post'
	// import { checkLogin } from '@/src/api/system'

	// 创建 store 实例
	const appStore = useAppStore()
	// 使用 storeToRefs 解构获取响应式状态
	const { postList, pagination } = storeToRefs(appStore)
	// 使用 postList 作为数据源
	const posts = postList
	const currentPage = pagination.page
	const pageSize = pagination.size

	const popup = ref(null)
    const popupForPc = ref(null)
	const showLeft = ref(null);
	const scrollTop = ref(0); // 保持为 ref
	const clientHeight = ref(0); // 用于存储器的可视高度
	const msgType = ref('info');
	const currentDialogContent = ref('');
	
	const status = ref('more'); // 加载更多的状态

	/* 
    	<p>本应用为演示应用，旨在展示个学习和开发的项目。特此声明：</p>
		<p>1. 非商业用途：本项目仅用于学习和展示，所有功能和内容均为个人开发，不得用于商业目的。</p>
		<p>2. 知识产权：项目中使用的所有第三方库、组件和资源均归合法拥有者所有。项目不对其知识产权的合法性负责。</p>
		<p>3. 数据隐私：本项目未涉及用户数据的收集和存储，用户在使用过程中请勿输入敏感个人信息。开发者不对任何因使用本应用而导致的隐私泄露或数据安全问题负责。</p>
		<p>4. 功能稳定性：本应用处于学习开发阶段，可能存在不稳定或未完善的功能，使用者需自行承担风险。</p>
		<p>5. 免版权资源：项目中的所有图片资源均为免版权可使用，展示的数据均为测试数据，不涉及任何真实用户或实际情况。</p>
		<p>6. 反馈与建议：欢迎用户提供反馈和建议，以帮助开发者不断改进本项目。</p>
		<p>7. PC端访问建议F12切换模拟设备。</p>
    */
	// 声明弹窗的内容
	const dialogContent = ref(`
        <p>我把它命名为:<p style="font-size: 32rpx; font-weight: bold; color: #333; text-align: center; margin: 20rpx 0;">校猫日记（PawprintDiaries）。</p></p>
        <p>一个结合校园流浪猫救助管理和社交分享的社区平台，通过记录和分享学校流浪猫的信息，
            连接爱猫人士，共同为猫猫创造更好的生活环境，为救助工作提供信息支持，为学校管理提供数据参考。</p>
        <br/>
        <p>查看 <a href="javascript:void(0)" onclick="document.dispatchEvent(new CustomEvent('goToAbout'))">关于平台和开发者</a></p>
		<br/>
		<p>联系开发者:</p>
		<p>
			GitHub: <a href="javascript:void(0)" onclick="document.dispatchEvent(new CustomEvent('openUrl', {detail: 'https://github.com/vikis77'}))">https://github.com/vikis77</a><br>
			Blog: <a href="javascript:void(0)" onclick="document.dispatchEvent(new CustomEvent('openUrl', {detail: 'https://luckyiur.com'}))">https://luckyiur.com</a><br>
			Email: <a href="javascript:void(0)" onclick="document.dispatchEvent(new CustomEvent('openUrl', {detail: 'mailto:qin2607994895@gmail.com'}))">qin2607994895@gmail.com</a>
		</p>
	`)

	// 跳转到About页面
	const goToAbout = () => {
		// 先关闭弹窗并确保完全关闭
		popup.value?.close()
		uni.hideLoading() // 确保所有弹窗都被关闭
		
		// 延迟跳转,等待弹窗完全关闭
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/About',
				success: () => {
					console.log('成功跳转到About页面')
				},
				fail: (err) => {
					console.error('跳转失败:', err)
					showToast('页面跳转失败')
				}
			})
		}, 500) // 增加延迟时间确保弹窗完全关闭
	}

	// 打开外部链接
	const openUrl = (url) => {
		// #ifdef H5
		window.open(url, '_blank')
		// #endif
		
		// #ifdef APP-PLUS
		plus.runtime.openURL(url)
		// #endif
		
		// #ifdef MP
		uni.setClipboardData({
			data: url,
			success: () => {
				showToast('链接已复制到剪贴板')
			}
		})
		// #endif
	}
	
	// 处理确认按钮点击
	const dialogConfirm = () => {
	  console.log('用户已阅读声明')
	}
	
	// 处理关闭弹窗
	const dialogClose = () => {
	  console.log('弹窗已关闭')
	}
	
	onMounted(() => {
        // 在 Home.vue 或其他页面组件中添加以下代码进行调试
        // #ifdef APP-PLUS
        const debug = uni.getSystemInfoSync()
        console.log('系统信息：', debug)
        // #endif
        
        // 检查用户token是否过期
        const token = uni.getStorageSync('token');
        if (token) {
            try {
                // 解析token获取过期时间
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const expTime = tokenData.exp * 1000; // 转换为毫秒
                
                // 判断token是否过期
                if (Date.now() >= expTime) {
                    // token已过期,清除本地存储的token和用户信息
                    uni.removeStorageSync('token');
                    uni.removeStorageSync('userInfo');
                    console.log('token已过期,已清除用户登录信息');
                }
            } catch (error) {
                console.error('token解析失败:', error);
                // token格式错误,清除token
                uni.removeStorageSync('token');
                uni.removeStorageSync('userInfo');
            }
        }
        // 调用全局方法：获取首页帖子数据
        getPosts(undefined, undefined, true, true);
        
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
			
        // 初始化帖子数据
        posts.value = appStore.postList
        
        // 模拟加载延迟，提供更好的视觉体验
        setTimeout(() => {
            loading.value = false
        }, 1000)

        // 添加事件监听器
        document.addEventListener('goToAbout', goToAbout);
        document.addEventListener('openUrl', (event) => openUrl(event.detail));

		// 检查是否需要显示PC端首次访问提示
		if (isPcBrowser() && isFirstVisit()) {
			showPcFirstVisitTip();
		}
	});
	

	
	// 发送请求获取帖子数据，包括加载初始数据和分页加载更多数据
    // 目前只用到到上拉刷新，即isRefresh为true
	const fetchMorePosts = async (isRefresh = false) => {
        if (isRefresh) {
            loadMoreStatus.value = 'more'
            loading.value = true // 刷新时显示骨架屏
        }
        
        try {
            await getPosts(undefined, undefined, isRefresh, false)
            posts.value = appStore.postList
            console.log(`"完成获取新帖子，是否全新刷新：${isRefresh}"`)
            console.log(posts.value)
        } finally {
            loading.value = false // 无论成功失败都关闭骨架屏
        }
        return []
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
		const clientHeight = event.detail.height;
		
		// 正确设置 scrollTop 的值
		scrollTop.value = currentScrollTop;
		uni.setStorageSync('scrollTop', currentScrollTop);
		
		// 计算是否接近底部
		const threshold = 50; // 距离底部50px时触发
		if (scrollHeight - currentScrollTop - clientHeight <= threshold && loadMoreStatus.value === 'more') {
			console.log('触发加载更多');
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
		if (checkLogin()) {
			uni.navigateTo({
				url: 'PostReview'
			});
		}
	}

	// 点击评论审核
	const handleCommentReview = () => {
		if (checkLogin()) {
			uni.navigateTo({
				url: 'CommentReview'
			});
		}
	}
	
	// 点击发布帖子
	function handleSendPost(){
		if (checkLogin()) {
			uni.navigateTo({
				url: 'SendPost'
			})
		}
		
	}
	
	// 点击猫猫管理
	const handleCatManage = () => {
		uni.navigateTo({
			url: 'CatManage'
		})
	}

	// 检查用户是否登录
	const checkLogin = () => {
		const token = uni.getStorageSync('token')
		if (!token) {
			showToast('请先登录')
			setTimeout(() => {
				uni.navigateTo({
					url: 'login'
				})
			}, 1500)
			return false
		}
		return true
	}

	// 点击 AI 聊天测试
	const handleAiChatTest = () => {
		if (checkLogin()) {
			uni.navigateTo({
				url: '/pages/AiChatTest'
			})
		}
	}
	
	// 点击关于按钮
	const handleAbout = () => {
		uni.navigateTo({
			url: 'About'
		})
	}

	// 用户管理
	const handleUserManage = () => {
		if (checkLogin()) {
			uni.navigateTo({
				url: 'UserManage'
			});
		}
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

    // 下拉刷新
	const onRefresh = async () => {
        // 未登录用户不能上拉获取新帖子
        if (!checkLogin()) {
            return;
        }
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
		// 如果正在加载或已经没有更多数据，则直接返回
		if (loadMoreStatus.value !== 'more') {
			return;
		}
		
		loadMoreStatus.value = 'loading';
		console.log('开始加载更多数据');
		
		try {
			await getPosts(undefined, undefined, false, false);
			console.log(appStore.pagination)
			// 检查是否还有更多数据
			if (appStore.pagination.page > appStore.pagination.total) {
                console.log(appStore.pagination.page, appStore.pagination.total)
				loadMoreStatus.value = 'noMore';
				console.log('没有更多数据了');
				uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				});
			} else {
				loadMoreStatus.value = 'more';
				console.log('加载成功，还有更多数据');
			}
		} catch (error) {
			console.error('加载更多失败:', error);
			loadMoreStatus.value = 'more';
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			});
		}
	}

	// 修改触底事件处理
	const onScrollToLower = () => {
		console.log('触发触底事件');
		loadMore();
	}

	// 添加loading状态
	const loading = ref(true)

	// PC端首次访问提示内容
	const pcFirstVisitContent = `
		<div style="padding: 20rpx;">
			<p style="font-size: 32rpx; font-weight: bold; color: #333; text-align: center; margin-bottom: 30rpx;">
				欢迎访问校猫日记！
			</p>
			<p style="color: #e74c3c; font-weight: bold; margin-bottom: 20rpx;">
				检测到您正在使用PC端访问本应用
			</p>
			<div style="display: flex; justify-content: space-between; align-items: flex-start; margin: 20rpx 0;">
				<div style="flex: 1; margin-right: 20rpx;">
					<p style="margin: 15rpx 0;">
						方式一：手机扫码访问（推荐 👍）
					</p>
					<p style="background: #f8f9fa; padding: 15rpx; border-radius: 8rpx; margin-bottom: 20rpx;">
						使用微信扫描右侧二维码，即可在手机上访问<br>
						✨ 更好的浏览体验<br>
						✨ 更流畅的操作效果<br>
						✨ 更完整的功能支持
					</p>
					<p style="margin-bottom: 15rpx; color: #666;">
						方式二：使用开发者工具访问
					</p>
					<p style="background: #f8f9fa; padding: 15rpx; border-radius: 8rpx;">
						1. 按F12打开开发者工具<br>
						2. 点击切换设备工具栏按钮（Toggle device toolbar）<br>
						3. 选择移动设备进行浏览（推荐 iPhone 12 Pro）
					</p>
				</div>
				<div style="width: 160px; text-align: center;">
					<image src="https://cdn.luckyiur.com/catcat/static_image/校猫日记二维码.jpg" 
						style="width: 120px; height: 120px; border-radius: 4px; margin-bottom: 8px;" 
						alt="微信扫码访问"
					/>
					<p style="font-size: 12px; color: #666;">扫码访问</p>
				</div>
			</div>
			<p style="color: #666; font-size: 24rpx; text-align: center; margin-top: 20rpx;">
				点击"已了解"后将不再显示此提示
			</p>
		</div>
	`;

	// 检查是否为PC端访问
	const isPcBrowser = () => {
		// #ifdef H5
		const userAgent = navigator.userAgent.toLowerCase();
		const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
		return !isMobile;
		// #endif
		// #ifndef H5
		return false;
		// #endif
	};

	// 检查是否首次访问
	const isFirstVisit = () => {
		const hasVisited = uni.getStorageSync('hasVisitedBefore');
		return !hasVisited;
	};

	// 显示PC端首次访问提示
	const showPcFirstVisitTip = () => {
		currentDialogContent.value = pcFirstVisitContent;
		msgType.value = 'warning';
		nextTick(() => {
			popupForPc.value?.open();
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
		// height: 100vh;
        // position: fixed;
        // top: 200rpx;
		background-color: #ebebeb;
		.layout-top{ // 顶部导航栏
			height: 6%;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 999;
			background-color: #ffffff;
			// padding: 10rpx 0;
			.box-top{
				display: flex;
				padding-top: 8rpx;
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
		.notice-container { // 公告区
			height: 80rpx;
			position: fixed;
			top: 90rpx;
			left: 0;
			right: 0;
			z-index: 998;
			background-color: #ffffff;
			padding: 2rpx 0;
		}
		.layout{ // 帖子区
			width: 100%;
            position: fixed;
            top: 180rpx;
			height: 1350rpx;
			background-color: #f8f9fa;
			position: relative;
			overflow-y: auto;
			transition: all 0.3s ease-out;
			scroll-behavior: smooth;
			
			.content{
				display: flex;
				flex-wrap: wrap;
				padding: 8rpx;
				box-sizing: border-box;
				
				.box{ // 每个帖子盒子
					flex: 0 0 calc(50% - 16rpx); // 确保两列布局
					margin: 8rpx;
					height: 520rpx;
					background-color: #ffffff;
					border-radius: 12rpx;
					overflow: hidden;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
					transition: all 0.3s ease;
					
					&:active {
						transform: scale(0.97);
					}
					
					&:hover {
						box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
					}
					
					.pic{
						height: 75%;
						width: 100%;
						object-fit: cover;
						transition: transform 0.3s ease;
						
						&:hover {
							transform: scale(1.03);
						}
					}
					
					.text{
						font-size: 26rpx;
						font-weight: 500;
						color: #333;
						line-height: 1.4;
						padding: 12rpx 16rpx 2rpx;
						height: 8%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					
					.info{
						display: flex;
						align-items: center;
						padding: 0rpx 16rpx;
						height: 13%;
						background: linear-gradient(to bottom, transparent, rgba(248, 249, 250, 0.5));
						
						.avatar {
							width: 42rpx;
							height: 42rpx;
							border-radius: 50%;
							object-fit: cover;
							border: 2rpx solid #fff;
							box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
						}
						
						.nickname {
							font-size: 22rpx;
							color: #666;
							margin-left: 12rpx;
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						
						.likes {
							display: flex;
							align-items: center;
							background: rgba(255, 192, 203, 0.08);
							padding: 4rpx 12rpx;
							border-radius: 24rpx;
							border: 1rpx solid rgba(255, 107, 129, 0.1);
							
							.like-icon {
								width: 26rpx;
								height: 26rpx;
								transition: transform 0.3s ease;
								
								&:hover {
									transform: scale(1.2);
								}
							}
							
							.like-count {
								font-size: 20rpx;
								color: #ff6b81;
								margin-left: 6rpx;
								font-weight: 500;
							}
						}
					}
				}
			}
			
			.load-more {
				padding: 24rpx 0;
				text-align: center;
				color: #666;
				font-size: 24rpx;
				background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02));
			}
		}
	}
	.drawer-body {
		.drawer-content {
			height: 100%;
			display: flex;
			flex-direction: column;
			background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
			
			.drawer-header {
				padding: 40rpx 30rpx;
				border-bottom: 1px solid rgba(0,0,0,0.1);
				
				.drawer-title {
					font-size: 36rpx;
					font-weight: 600;
					color: #333;
				}
			}
			
			.drawer-items {
				padding: 20rpx 0;
				
				.drawer-item {
					display: flex;
					align-items: center;
					padding: 24rpx 40rpx;
					margin: 10rpx 20rpx;
					background: rgba(255,255,255,0.9);
					border: none;
					border-radius: 12rpx;
					transition: all 0.3s ease;
					
					&:active {
						transform: scale(0.98);
					}
					
					&:hover {
						background: rgba(255,255,255,1);
						box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
					}
					
					.drawer-icon {
						width: 40rpx;
						height: 40rpx;
						margin-right: 20rpx;
					}
					
					text {
						font-size: 28rpx;
						color: #333;
					}
				}
			}
		}
	}

	// 添加骨架屏样式
	.skeleton-container {
		display: flex;
		flex-wrap: wrap;
		padding: 8rpx;
		box-sizing: border-box;
		
		.skeleton-box {
			flex: 0 0 calc(50% - 16rpx);
			margin: 8rpx;
			height: 520rpx;
			background-color: #ffffff;
			border-radius: 12rpx;
			overflow: hidden;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
			
			.skeleton-image {
				height: 75%;
				width: 100%;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: shimmer 1.5s infinite;
			}
			
			.skeleton-text {
				height: 8%;
				margin: 12rpx 16rpx 2rpx;
				background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
				background-size: 200% 100%;
				animation: shimmer 1.5s infinite;
			}
			
			.skeleton-info {
				display: flex;
				align-items: center;
				padding: 0rpx 16rpx;
				height: 13%;
				
				.skeleton-avatar {
					width: 42rpx;
					height: 42rpx;
					border-radius: 50%;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: shimmer 1.5s infinite;
				}
				
				.skeleton-nickname {
					width: 100rpx;
					height: 22rpx;
					margin-left: 12rpx;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: shimmer 1.5s infinite;
				}
				
				.skeleton-likes {
					width: 60rpx;
					height: 26rpx;
					margin-left: auto;
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: shimmer 1.5s infinite;
				}
			}
		}
	}

	// 添加动画关键帧
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
