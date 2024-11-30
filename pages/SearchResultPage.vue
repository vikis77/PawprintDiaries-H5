<template>
	<view class="container">
		<view class="layout">
			<!-- 顶部导航搜索返回区 -->
			<view class="box-top">
				<view class="back" @click="handlerGoback">
					<button class="btn1" plain="true">
						<img src="../static/返回.png" alt="" class="img"/>
					</button>
				</view>
				<view class="search-text">
					<uni-search-bar v-model="searchValue" placeholder="搜索帖子/猫猫名字/猫猫ID" :focus="true" maxlength="30" @input="input" @confirm="search"></uni-search-bar>
				</view>
			</view>
			<!-- 主体展示区 -->
			<scroll-view :scroll-top="scrollTop" scroll-y="true"  class="postAreaLayout" show-scrollbar="false" @scroll="handleScroll">
				<!-- 展示卡片信息 -->
				<view v-if='catList' class="showCardBox"> <!-- 存在猫猫信息，才进行展示-->
					<view class="y0hj0"> 
						<!-- 主题部分 -->
						<view class="y89yh9"> 
							<view class="tzz876">
								<!-- <view v-if="currentArea === 0"> -->
									<view class="t9x">
										<!-- 卡片循环区域 -->
										<view class="Cardlist" >
											<scroll-view class="ta9u0a" scroll-x="true" >
												<view class="t42f" >
													<!-- 循环展示猫猫卡片 -->
													<view class="t2352" v-for="cat in catList" :key="cat.catId" > 
														<!-- 猫猫头像 -->
														<view class="t7908f" @click="handleClickCard(cat.catId)">
															<image class="img32r" :src="`${pic_general_request_url}/cat_avatar/${cat.avatar}`" mode="aspectFill"></image>
														</view>
														<!-- 猫猫信息  -->
														<view class="t990k" @click="handleClickCard(cat.catId)">
															<view class="t5grg3">
																<text class="t2rdf">{{ cat.catname }} - {{ cat.age }}个月 - {{ cat.gender === 1 ? '雄性' : '雌性' }}</text>
															</view>
														</view>
												
														<!-- 分割线 -->
														<view class="divider"/>
														
														<!-- 热度讨论分享 -->
														<view class="t79h" @click="toBeDeveloped">
															<view class="">
																<uni-icons type="fire" size="18"></uni-icons>
																热度
															</view>
															<view class="">
																<uni-icons type="chatbubble" size="18"></uni-icons>
																讨论
															</view>
															<view class="">
																<uni-icons type="paperclip" size="18"></uni-icons>
																分享
															</view>
														</view>
													</view>
												</view>
											</scroll-view>
										</view>
									</view>
								<!-- </view> -->
							</view>
						</view>
					</view>
				</view>
				<!-- 帖子展示区 -->
				<view v-if='posts' class="content"> <!-- 存在帖子信息，才进行展示-->
					<view v-for="post in posts" :key="post.postId"  class="box">
						<image class="pic" :src="`${pic_general_request_url}/post_pics/${post.coverPicture}`" mode="aspectFill" @click="handlerClickPost(post.postId)"></image>
						<view class="text" @click="handlerClickPost(post.postId)">{{ post.title }}</view>
						<view class="info" @click="toBeDeveloped">
							<image class="avatar" :src="`${pic_general_request_url}/user_avatar/${post.authorAvatar}`" mode="aspectFill"></image>
							<text class="nickname">{{ post.authorNickname }}</text>
							<view class="likes">
							<image class="like-icon" src="../static/爱心.svg"></image>
							<text class="like-count">{{ post.likeCount }}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'; // 导入 onLoad
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
	
	const catList = ref([]);
	const posts = ref([]);
	const searchValue = ref('');
	
	// 使用 onLoad 生命周期钩子
	onLoad((options) => {
	    // 确保 options 存在且包含 searchWords
	    if (options && options.searchWords) {
	        // 获取并解码传递的参数
	        searchValue.value = decodeURIComponent(options.searchWords); // 保留搜索词
	        console.log("接收到的参数 searchWords:", searchValue.value);
	    } else {
	        console.log("未接收到搜索词参数");
	    }
	});
	
	onMounted(() => {
		const searchResultData = uni.getStorageSync('searchResultData');
		catList.value = searchResultData.cats;
		posts.value = searchResultData.posts.records;
		console.log(catList.value);
		console.log(posts.value);
	});

	
	// 返回
	function handlerGoback(){
		uni.navigateTo({
			url: `/pages/Search?searchValue=${encodeURIComponent(searchValue.value)}`
		});
	}
	
	// 点击卡片时跳转，传递catId给卡片页面
	function handleClickCard(catId) {
		uni.navigateTo({
			url:`/pages/Card?catId=${catId}` //// 传递小猫的id
		})
	}
	
	// 点击某个帖子
	function handlerClickPost(postId){
		uni.navigateTo({
			url:`/pages/Post?postId=${postId}`
		})
	}
	
	function search(words) { // 搜索事件
		const token = uni.getStorageSync('token')
		console.log(searchValue.value)
		uni.request({
			url: `${API_general_request_url.value}/api/search/search?words=${words.value}`,
			method: 'GET',
			header: {
				'Authorization': `Bearer ${token}`
			},
			success: (res) => {
				console.log(res)
				if (res.statusCode === 200 && res.data.code === '2000') {
					uni.setStorageSync('searchResultData',res.data.data); // 更新存储搜索结果
					const searchResultData = uni.getStorageSync('searchResultData');
					// console.log(searchResultData)
					catList.value = searchResultData.cats;
					posts.value = searchResultData.posts.records;
					console.log(catList.value);
					console.log(posts.value);
				} else {
					uni.showToast({
						title: res.data.msg || '获取搜索结果失败',
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
	}
	
</script>

<style lang="scss" scoped>
	.container{
		width: 750rpx;
		.layout{
			width: 100%;
			height: 100%;
			.box-top{
				display: flex;
				// display: flex;
				height: 100rpx;
				align-items: center; /* 垂直居中对齐 */
				.back{
				// 	height: 30rpx;
					width: 100rpx;
				// 	// object-fit: cover;
					.btn1{
						border: none; /* 去除按钮默认边框 */
						background: none; /* 去除按钮背景 */
						padding: 0; /* 去除内边距 */
						.img{
							width: 30rpx;
							height: 30rpx;
						}
					}
				}
				.search-text{
					width: 650rpx;
				}
			}
			.showCardBox{
				width: 675rpx; /* 调整为布局适配 */
				height: 450rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
				padding: 20rpx; /* 增加内边距以提高间距 */
				border-radius: 10rpx;
				background-color: #ffffff; /* 白色背景使内容更清晰 */
				// background: linear-gradient(to right, #6270db, #a9518c);
				box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px; /* 软阴影 */
				border: 0.666667rpx solid #EBEEF5;
				overflow: hidden;
				.y0hj0{ 
					width: 100%;
					height: 100%;
					border-radius: 20rpx 20rpx 20rpx 20rpx;
					box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2); /* 软阴影 */
					// background: linear-gradient(to right, #6270db, #a9518c);
					// border: 0.666667rpx solid #EBEEF5;
					overflow: hidden;
					.paw{ // 卡片日记
						width: 100%;
						display: flex;
						align-items: center;
						// background: linear-gradient(to right, #6270db, #a9518c); /* 渐变背景 */
						
						background-color: #a0a0f0;
						padding: 20rpx; /* 内边距增加 */
						overflow: hidden;
						.t89hmm{
							.m7h9h{
								background: rgba(255, 255, 255, 0); /* 透明背景 */
							}
						}
					}
					.y89yh9{ // 卡片选择器+轮播区
						width: 100%;
						// height: 100%;
						border-radius: 10rpx;
						margin-top: 15rpx;
						background-color: #ffffff;
						overflow: hidden;
						// .th890h0{
						// 	width: 100%;
						// 	height: 100rpx;
						// }
						.tzz876{
							width: 100%;
							.t9x{
								width: 100%;
								height: 100%;
								.Cardlist{
									width: 100%;
									height: 400rpx;
									background-image: "";
									.ta9u0a{
										width: 100%;
										height: 400rpx;
										overflow-x: auto;
										.t42f{
											// width: 9000rpx;
											height: 100%;
											display: flex;
											flex-wrap: nowrap;
											// background: linear-gradient(to right, #9ca4db, #a97ca1); 
											// background: linear-gradient(to right, #fdeda9, #fffce2); /* 渐变背景 */
											.t2352:first-child{
												margin-left: 10rpx;
											}
											
											.t2352{ //每一个卡片
												width: 300rpx;
												height: 350rpx;
												margin-top: 20rpx;
												background-color: #fafafa;
												align-items: center;
												justify-content: center;
												display: flex;
												margin-right: 20rpx;
												flex-direction: column; /* 垂直排列 */
												/* 添加边框 */
												border: 1rpx solid #dadada;
												/* 添加圆角和阴影 */
												border-radius: 20rpx; /* 圆角 */
												box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.2); /* 阴影 */
												background: linear-gradient(to bottom, #e9e9fa, #e6f2ff); /* 渐变背景 */
												// overflow: hidden;
												.t7908f{ //图片
													width: 300rpx;
													height: 225rpx;
													.img32r{
														width: 90%;
														height: 90%;
														border-radius: 20rpx 20rpx 20rpx 20rpx; /* 图片上部圆角 */
														// object-fit: cover; /* 确保图片保持比例 */
														margin-left: 14rpx;
														margin-top: 10rpx;
													}
												}
												.t990k{ //文字
													width: 100%; /* 宽度设为100%，让文字块占满一行 */
													height: 70rpx;
													text-align: center; /* 居中文字 */
													overflow: hidden; /* 隐藏溢出的部分 */
													.t5grg3{
														padding-left: 20rpx;
														padding-right: 20rpx;
														.t2rdf{
															width: 100%;
															height: 100%;
															font-size: 26rpx;
															overflow: hidden; /* 隐藏超出内容 */
															display: -webkit-box;
															-webkit-box-orient: vertical;
															-webkit-line-clamp: 2; /* 限制最多显示两行 */
															text-overflow: ellipsis; /* 超出部分显示省略号 */
															word-break: break-word; /* 防止单词超出容器 */
														}
													}
													
												}
												.divider { //分割线
												  background: #E0E3DA;
												  width: 90%;
												  height: 2rpx;
												  justify-content: center;
												}
												.t79h{ //操作区
													width: 100%;
													height: 53rpx;
													display: flex;
													font-size: 20rpx;
													align-items: center;
													justify-content: space-around;
												}
											}
											
										}
									}
								}
							}
						}
					}
					
				}
				
			}
			.postAreaLayout{
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
		}
	}
</style>
