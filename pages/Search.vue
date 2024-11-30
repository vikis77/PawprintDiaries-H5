<!-- 搜索页
 
 -->
<template>
	<view class="contianer">
		<view class="layout">
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
			<uni-section class="box-contenx" title="搜索结果" type="line">
				<uni-list v-for="(item, index) in searchResults" :key="index">
					<!-- <uni-list-item :title="item.title" /> -->
				</uni-list>
			</uni-section>
		</view>
	</view>
</template>

<script setup>
	import uniSearchBar from '@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue';
	import UniSection from '@dcloudio/uni-ui/lib/uni-section/uni-section.vue';
	import UniList from '@dcloudio/uni-ui/lib/uni-list/uni-list.vue';
	import UniListItem from '@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue';
	
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
	
	// 使用 onLoad 生命周期钩子
	onLoad((options) => {
	    // 确保 options 存在且包含 searchWords
	    if (options && options.searchValue) {
	        // 获取并解码传递的参数
	        searchValue.value = decodeURIComponent(options.searchValue); // 保留搜索词
	        console.log("接收到的参数 searchValue:", searchValue.value);
	    } else {
	        console.log("未接收到搜索词参数");
	    }
	});
	
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
		// 判断用户是否登录，是否存在token
		const token = uni.getStorageSync('token')
		// console.log(token)
		// console.log(searchWords)
		if (!token) {
			// 提示用户登录
			uni.showToast({
				title: '请登录之后再来搜索吧 ~~',
				icon: 'none'
			});
			return; // 终止函数，避免继续执行
		}
		
		uni.request({
			url: `${API_general_request_url.value}/api/search/search?words=${searchWords.value}`,
			method: 'GET',
			header: {
				'Authorization': `Bearer ${token}`
			},
			success: (res) => {
				console.log(res)
				if (res.statusCode === 200 && res.data.code === '2000') {
					searchResults.value = res.data.data;
					uni.setStorageSync('searchResultData',searchResults.value); // 存储搜索结果
					// 跳转 结果展示页
					uni.navigateTo({
						url: `/pages/SearchResultPage?searchWords=${encodeURIComponent(searchValue.value)}`
					})
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
	.contianer{
		width: 750rpx; /* 设置容器宽度为屏幕宽度 */
		.layout{
			padding-top: 40rpx;
			flex-wrap: wrap;
			// flex-direction: column;
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
			.box-contenx{
				margin-bottom: 20rpx;
				border-radius: 8rpx;
				background-color: #fff;
				// .item{
				// 	height: 60rpx;
				// 	// padding: 10rpx;
				// 	background-color: #689;
				// 	margin: 4rpx;
				// }
				.uni-list {
				  margin-top: 10rpx;
				}
			}
		}
	}
</style>