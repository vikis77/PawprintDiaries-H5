<!-- 搜索页
 
 -->
<template>
	<view class="container">
		<view class="layout">
			<!-- 顶部搜索区 -->
			<view class="search-header">
				<view class="back-btn" @click="handlerGoback">
					<img src="../static/goback.png" class="back-icon"/>
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
				<view class="search-btn" @click="handleSearch">
					<text>搜索</text>
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
					<text class="title">推荐搜索</text>
				</view>
				<view class="hot-tags">
					<view class="tag" v-for="(item, index) in hotSearchList" :key="index" @click="handleHistoryClick(item.keyword)">
						<text class="rank" :style="index < 3 ? 'color: #ff6b6b;background: rgba(255,107,107,0.1);' : ''">{{index + 1}}</text>
						<text class="keyword">{{item.keyword}}</text>
						<text class="count">{{item.count}}次</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
	import { showToast } from '@/src/utils/toast'
    import { useAppStore } from '@/store/modules/app'
    const appStore = useAppStore()
	
	const searchValue = ref('');
	const searchResults = ref('');
	
	// 搜索历史
	const historyList = ref([]);
	// 热门搜索词
	const hotSearchList = ref([]);
	
	// 获取热门搜索数据
	const getHotSearchList = () => {
		// 模拟接口请求
		setTimeout(() => {
			// 模拟数据
			const mockData = [
				{ keyword: '校园', count: 9999 },
				{ keyword: '猫', count: 8888 },
				{ keyword: '小白', count: 7777 },
				{ keyword: '生活', count: 6666 },
				{ keyword: '3', count: 5555 },
				{ keyword: '美短', count: 4444 },
				{ keyword: '狸花猫', count: 3333 },
				{ keyword: '波斯猫', count: 2222 },
				{ keyword: '加菲猫', count: 1111 },
				{ keyword: '三花猫', count: 1000 }
			];
			hotSearchList.value = mockData;
		}, 500);
		
		// 真实接口示例（后续替换）
		/* uni.request({
			url: `${API_general_request_url.value}/api/search/hot`,
			method: 'GET',
			success: (res) => {
				if (res.statusCode === 200 && res.data.code === '2000') {
					hotSearchList.value = res.data.data;
				}
			},
			fail: (error) => {
				console.error('获取热门搜索失败:', error);
			}
		}); */
	}
	
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
		getHotSearchList(); // 获取热门搜索数据
	})
	
	// 使用 onLoad 生命周期钩子
	onLoad((options) => {
		// 检查登录状态
		checkLogin();
		
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
			showToast('请先登录')
			// 延迟跳转到登录页面
			setTimeout(() => {
				uni.navigateTo({
					url: 'Login'
				});
			}, 1500);
			return false;
		}
		return true;
	}
	
	// 返回首页事件
	function handlerGoback(){
        // 先收起键盘
        uni.hideKeyboard()
		// uni.switchTab({
		// 	url: 'Home'
		// })
        uni.navigateBack()
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
					// uni.setStorageSync('searchResultData', res.data.data);
                    appStore.setSearchResultData(res.data.data);
					uni.redirectTo({
						url: `SearchResultPage?searchWords=${encodeURIComponent(searchValue.value)}`
					});
                    console.log('搜索结果：', res.data.data)
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
	
	const handleSearch = () => {
        if (!checkLogin()) {
            return;
        }
		if (!searchValue.value.trim()) {
			uni.showToast({
				title: '请输入搜索内容',
				icon: 'none'
			});
			return;
		}
		search({value: searchValue.value.trim()});
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
					margin-right: 20rpx;
					
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
				
				.search-btn {
					padding: 12rpx 32rpx;
					background: #9fa1ef;
					border-radius: 100rpx;
					transition: all 0.3s ease;
					
					text {
						color: #fff;
						font-size: 26rpx;
						font-weight: 500;
					}
					
					&:active {
						transform: scale(0.95);
						background: #8385d9;
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
							color: #999;
							background: #f5f6f7;
						}
						
						.keyword {
							font-size: 28rpx;
							color: #444;
							margin-left: 24rpx;
							flex: 1;
						}
						
						.count {
							font-size: 24rpx;
							color: #999;
							margin-left: 16rpx;
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