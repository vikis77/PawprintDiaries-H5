<template>
	<view class="container">
		<view class="layout">
			<!-- 头部 -->
			<view class="t1">
				<uni-row class="t9zdf" :width="750">
					<uni-col class="tpk0u" :span="8">
						<img src="../static/返回.png" alt="" @click="handleGoback" class="img"/>
					</uni-col>
					<uni-col class="tgq89" :span="8">
						<view class="t9gh9gh9">
							<text>猫猫管理</text>
						</view>
					</uni-col>
					<uni-col class="t56f7" :span="8">
						<img src="../static/更多.png" alt="" />
					</uni-col>
				</uni-row>
			</view>
			
			<!-- 展示统计信息 -->
			<view class="showStatisticsBox">
				<view class="th0hzf" >
					<uni-card class="tz0v898" margin=0  title="" :sub-title="nowTime" extra="" thumbnail="../static/猫咪-copy.png" >
						<view class="gridbody" >
							<uni-grid class="tyh08hz" :column="3" :square="false" :highlight="false" >
								<uni-grid-item v-for="(item, index) in gridList" :index="index" :key="index" class="t99zv" >
									<view class="grid-item-box" @click="handleClickGrid(item.cat)">
										<view class="tzh0h">
											<img v-if="item.url !== ''" :src="item.url" class="th80" mode="aspectFill" />
											<text class="tm9q1a">{{item.data}}</text>
										</view>
										<text class="grid-item-boxtext">{{item.text}} ({{item.text2}})</text>
										<!-- <text class="grid-item-boxtext2">{{item.text2}}</text> -->
									</view>
								</uni-grid-item>
							</uni-grid>
						</view>
					</uni-card>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import uniCard from '@dcloudio/uni-ui/lib/uni-card/uni-card.vue';
	import uniGrid from '@dcloudio/uni-ui/lib/uni-grid/uni-grid.vue';
	import uniGridItem from '@dcloudio/uni-ui/lib/uni-grid-item/uni-grid-item.vue';
	
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
	
	const gridList = ref([
		{
			url: '../static/猫.png',
			data: '',
			text: '在校小猫',
			text2: '只',
			cat: null
		}
	])
	
	onShow(() => {
		uni.showLoading({ title: '加载中...' });
		const catList = uni.getStorageSync('catList') != null ? uni.getStorageSync('catList') : [];
		console.log(catList);
		
		if (catList.length > 0) {
			// 更新 gridList 中的 badge 显示猫的数量
			gridList.value[0].data = catList.length.toString();
	
			// 遍历 catList，将每只猫的信息加入 gridList
			catList.forEach((cat) => {
				gridList.value.push({
				url: `${pic_general_request_url.value}/cat_avatar/${cat.avatar}`,
				data: '',
				text: cat.catname,
				text2: cat.area,
				cat: cat
				});
			});
		} else {
			console.log('catList is empty or null.');
		}
		uni.hideLoading();
	});
	
	// 点击返回
	const handleGoback = ()=> {
		uni.switchTab({
			url: '/pages/Home'
		})
	}
	
	// 点击格子
	const handleClickGrid =(cat)=>{
		console.log(cat.catId)
		uni.navigateTo({
			url: `/pages/catEdit?catId=${cat.catId}`
		})
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 750rpx;
		height: 100vh;
		.layout{
			width: 100%;
			height: 100%;
			// background-color: #55ff7f;
			width: 100%;
			height: 100%;
			// padding-left: 20rpx;
			.t1{ //t头部
				width: 100%;
				height: 200rpx;
				display: flex;
				.t9zdf{ // uni-row
					width: 100%;
					height: 200rpx;
					display: flex;
					// align-items: center;
					.tpk0u{ //返回
						width: 100%;
						height: 200rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							width: 60rpx;
							height: 60rpx;
						}
					}
					.tgq89{ // 中间文字
						width: 100%;
						height: 200rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						text{
							font-size: 40rpx;
							color: #333333;
						}
					}
					.t56f7{ // 更多按钮
						width: 100%;
						height: 200rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							width: 60rpx;
							height: 60rpx;
						}
					}
				}
			}
			
			.showStatisticsBox{
				width: 95%;
				// height: 1750rpx;
				margin-left: 20rpx;
				// margin-top: 10rpx;
				// border-radius: 4rpx;
				// background-color: #ffffff;
				// box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2); /* 软阴影 */
				// border: 2rpx solid #dbdbdb;
				
				display: flex;
				flex-direction: column;
				display: flex;
				align-items: center;
				justify-content: center;
				font-family: 'Arial', sans-serif;
				.th0hzf{ //统计卡片
					width: 100%;
					// height: 750rpx;
					margin-bottom: 36rpx;
					box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px; /* 软阴影 */
					border: 0.666667rpx solid #EBEEF5;
					.tz0v898{
					}
					.tyh08hz{
						width: 100%;
						// height: 600rpx;
						height: 100%;
						.t99zv{ // 每一行 3个
							width: 33%;
							height: 200rpx;
							.grid-item-box{ //每一个小格子
								width: 100%;
								height: 100%;
								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;
								.tzh0h{ //view
									display: flex;
									align-items: center;
									justify-content: center;
									.th80{ //图片
										// width: 180rpx;
										// height: 130rpx;
										max-width: 200rpx;
										max-height: 120rpx;
									}
									.tm9q1a{ // data
										font-size: 60rpx;
										color: #b876d9;
									}
								}
								.grid-item-boxtext{ // 描述
									// height: 100rpx;
									// width: 90%;
									font-size: 30rpx;
									// color: #aca4a5;
								}
								// .grid-item-boxtext2{ // 描述第二行
								// 	// height: 100rpx;
								// 	// width: 90%;
								// 	font-size: 25rpx;
								// 	color: #aca4a5;
								// }
							}
						}
					}
				}
			}
		}
	}
</style>
