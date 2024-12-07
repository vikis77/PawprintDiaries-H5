<!-- 搜索页
 
 -->
<template>
	<view class="container">
		<view class="layout">
			<!-- 顶部搜索区 -->
			<view class="search-header">
				<view class="back-btn" @click="handlerGoback">
					<img src="../static/返回.png" class="back-icon"/>
				</view>
				<view class="search-bar">
					<uni-search-bar
						v-model="searchValue"
						placeholder="搜索帖子/猫猫名字/猫猫ID" 
						:focus="true"
						maxlength="30"
						@input="input"
						@confirm="search"
						radius="100"
						cancelButton="none"
						bgColor="#f5f6f7"
					/>
				</view>
			</view>

			<!-- 历史搜索 -->
			<view class="search-history" v-if="historyList.length > 0">
				<view class="history-header">
					<text class="title">搜索历史</text>
					<view class="clear-btn" @click="clearHistory">
						<uni-icons type="trash" size="16" color="#999"/>
					</view>
				</view>
				<view class="history-tags">
					<view 
						class="tag" 
						v-for="(item, index) in historyList" 
						:key="index"
						@click="handleHistoryClick(item)"
					>
						<text>{{item}}</text>
					</view>
				</view>
			</view>

			<!-- 热门搜索 -->
			<view class="hot-search">
				<view class="hot-header">
					<text class="title">热门搜索</text>
				</view>
				<view class="hot-tags">
					<view class="tag" v-for="(item, index) in hotSearchList" :key="index">
						<text class="rank">{{index + 1}}</text>
						<text class="keyword">{{item}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import uniSearchBar from '@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue';
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
	
	const searchValue = ref('');
	const searchResults = ref('');
	
	// 搜索历史
	const historyList = ref([]);
	// 热门搜索词
	const hotSearchList = ref(['布偶猫', '英短', '橘猫', '暹罗猫', '金渐层']);
	
	// 获取历史记录
	const getSearchHistory = () => {
		const history = uni.getStorageSync('searchHistory') || [];
		historyList.value = history;
	}
	
	// 保存搜索历史
	const saveSearchHistory = (keyword) => {
		let history = uni.getStorageSync('searchHistory') || [];
		if(!history.includes(keyword)) {
			history.unshift(keyword);
			if(history.length > 10) history.pop();
			uni.setStorageSync('searchHistory', history);
			historyList.value = history;
		}
	}
	
	// 清空历史记录
	const clearHistory = () => {
		uni.showModal({
			title: '提示',
			content: '确定要清空搜索历史吗？',
			success: (res) => {
				if(res.confirm) {
					uni.removeStorageSync('searchHistory');
					historyList.value = [];
				}
			}
		})
	}
	
	// 点击历史记录
	const handleHistoryClick = (keyword) => {
		searchValue.value = keyword;
		search({value: keyword});
	}
	
	onMounted(() => {
		getSearchHistory();
	})
	
	// 使用 onLoad 生命周期钩子
	onLoad((options) => {
		// 检查登录状态
		checkLoginStatus();
		
	    // 确保 options 存在且包含 searchWords
	    if (options && options.searchValue) {
	        // 获取并解码传递的参数
	        searchValue.value = decodeURIComponent(options.searchValue); // 保留搜索词
	        console.log("接收到的参数 searchValue:", searchValue.value);
	    } else {
	        console.log("未接收到搜索词参数");
	    }
	});
	
	// 检查登录状态
	function checkLoginStatus() {
		const token = uni.getStorageSync('token');
		if (!token) {
			uni.showToast({
				title: '请登录之后再来搜索吧 ~~',
				icon: 'none',
				duration: 2000
			});
			// 延迟跳转到登录页面
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/Login'
				});
			}, 1500);
			return false;
		}
		return true;
	}
	
	// 返回首页事件
	function handlerGoback(){
		uni.switchTab({
			url: '/pages/Home'
		})
	}
	function input(res) { // 输入改变时触发事件
		console.log('----input:', res)
	}
	
	function search(searchWords) { // 搜索事件
		if (!checkLoginStatus()) return; // 搜索时再次检查登录状态
		
		uni.request({
			url: `${API_general_request_url.value}/api/search/search?words=${searchWords.value}`,
			method: 'GET',
			
			header: {
				'Authorization': `Bearer ${uni.getStorageSync('token')}`
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data.code === '2000') {
					uni.setStorageSync('searchResultData', res.data.data);
					uni.redirectTo({
						url: `/pages/SearchResultPage?searchWords=${encodeURIComponent(searchValue.value)}`
					});
				} else {
					uni.showToast({
						title: res.data.msg || '获取搜索结果失败',
						icon: 'none'
					});
				}
			},
			fail: (error) => {
				uni.showToast({
					title: '请求失败，请重试',
					icon: 'none'
				});
			}
		});
	}

</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: linear-gradient(to bottom, #ffffff, #f8f9fa);
		
		.layout {
			padding: 30rpx;
			
			.search-header {
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				margin-bottom: 20rpx;
				
				.back-btn {
					padding: 20rpx;
					transition: all 0.3s ease;
					
					&:active {
						transform: scale(0.95);
					}
					
					.back-icon {
						width: 44rpx;
						height: 44rpx;
					}
				}
				
				.search-bar {
					flex: 1;
					
					:deep(.uni-searchbar) {
						padding: 0;
						
						.uni-searchbar__box {
							border-radius: 100rpx;
							box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
							background: rgba(255,255,255,0.9) !important;
							border: 2rpx solid #eef0f2;
							
							.uni-searchbar__text-input {
								color: #333;
								font-size: 28rpx;
							}
						}
					}
				}
			}
			
			.search-history {
				margin-top: 50rpx;
				padding: 30rpx;
				background: rgba(255,255,255,0.8);
				border-radius: 24rpx;
				box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03);
				
				.history-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 30rpx;
					
					.title {
						font-size: 32rpx;
						font-weight: 600;
						color: #333;
						position: relative;
						
						&::after {
							content: '';
							position: absolute;
							bottom: -8rpx;
							left: 0;
							width: 40rpx;
							height: 4rpx;
							background: #ff6b6b;
							border-radius: 4rpx;
						}
					}
					
					.clear-btn {
						padding: 10rpx;
						opacity: 0.7;
						transition: all 0.3s ease;
						
						&:active {
							opacity: 1;
						}
					}
				}
				
				.history-tags {
					display: flex;
					flex-wrap: wrap;
					gap: 20rpx;
					
					.tag {
						padding: 16rpx 30rpx;
						background: #fff;
						border-radius: 100rpx;
						font-size: 26rpx;
						color: #555;
						box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
						border: 2rpx solid #eef0f2;
						transition: all 0.3s ease;
						
						&:active {
							transform: scale(0.97);
							background: #f8f9fa;
						}
					}
				}
			}
			
			.hot-search {
				margin-top: 50rpx;
				padding: 30rpx;
				background: rgba(255,255,255,0.8);
				border-radius: 24rpx;
				box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.03);
				
				.hot-header {
					margin-bottom: 30rpx;
					
					.title {
						font-size: 32rpx;
						font-weight: 600;
						color: #333;
						position: relative;
						
						&::after {
							content: '';
							position: absolute;
							bottom: -8rpx;
							left: 0;
							width: 40rpx;
							height: 4rpx;
							background: #ff6b6b;
							border-radius: 4rpx;
						}
					}
				}
				
				.hot-tags {
					.tag {
						display: flex;
						align-items: center;
						padding: 24rpx 20rpx;
						border-radius: 16rpx;
						transition: all 0.3s ease;
						
						&:active {
							background: #f8f9fa;
						}
						
						.rank {
							width: 50rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							font-size: 28rpx;
							font-weight: bold;
							border-radius: 12rpx;
							
							&:nth-child(1) {
								color: #ff6b6b;
								background: rgba(255,107,107,0.1);
							}
							
							&:nth-child(2) {
								color: #ff9f43;
								background: rgba(255,159,67,0.1);
							}
							
							&:nth-child(3) {
								color: #ffd43b;
								background: rgba(255,212,59,0.1);
							}
						}
						
						.keyword {
							font-size: 28rpx;
							color: #444;
							margin-left: 24rpx;
							flex: 1;
						}
						
						&:not(:last-child) {
							border-bottom: 2rpx solid #f5f6f7;
						}
					}
				}
			}
		}
	}
</style>