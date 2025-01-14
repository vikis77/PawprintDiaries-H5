<template>
	<view class="container">
		<view class="layout">
			<!-- 头部导航 -->
			<view class="header">
				<uni-row class="header-row" >
					<uni-col :span="8" class="header-left">
						<img src="../static/goback.png" @click="handleGoback" class="header-icon" />
					</uni-col>
					<uni-col :span="8" class="header-center">
						<text class="header-title">猫猫管理</text>
					</uni-col>
					<uni-col :span="8" class="header-right">
						<view class="add-button" @click="handleAdd">
							<img src="../static/add.png" class="header-icon" />
							<text class="add-text">添加</text>
						</view>
					</uni-col>
				</uni-row>
			</view>

			<!-- 统计卡片区域 -->
			<view class="stats-container">
				<uni-card class="stats-card" :margin="0">
					<!-- 总数统计 -->
					<view class="total-stats">
						<view class="stats-number">
							<text class="number">{{ gridList[0].data }}</text>
							<text class="unit">只</text>
						</view>
						<text class="stats-label">在校小猫</text>
					</view>

					<!-- 猫咪列表 -->
					<view class="cat-list">
						<view v-for="(item, index) in gridList.slice(1)" :key="index" class="cat-item" @click="handleClickGrid(item.cat)">
							<image :src="item.url" class="cat-avatar" mode="aspectFill" />
							<view class="cat-info">
								<text class="cat-name">{{ item.text }}</text>
								<text class="cat-area">{{ item.text2 }}</text>
							</view>
						</view>
					</view>
				</uni-card>
			</view>
		</view>
	</view>
</template>

<script setup>
import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

const gridList = ref([
	{
		url: '../static/cat.png',
		data: '',
		text: '在校小猫',
		text2: '只',
		cat: null
	}
])

onShow(async () => {
	uni.showLoading({ title: '加载中...' });
	// const catList = uni.getStorageSync('catList') != null ? uni.getStorageSync('catList') : [];
    // 调用全局方法：获取猫猫列表
    await getCatInfoDetail()
    const catList = appStore.catList
	console.log(catList);

	if (catList.length > 0) {
		// 更新 gridList 中的 badge 显示猫的数量
		gridList.value[0].data = catList.length.toString();

		// 遍历 catList，将每只猫的信息加入 gridList
		catList.forEach((cat) => {
			gridList.value.push({
				url: `${pic_general_request_url.value}/cat_avatar/${cat.avatar}${Suffix_1002.value}`,
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
const handleGoback = () => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const from = currentPage.$page.options.from
	if (from === 'catclaw') {
		// 如果是从CatClaw页面来的,返回CatClaw
		// 先将分段器状态存入storage
		uni.setStorageSync('resetSegmentedControl', true)
		uni.switchTab({
			url: 'CatClaw'
		})
	} else {
		// 默认返回Home页面
		uni.switchTab({
			url: 'Home'
		})
	}
}

// 点击格子
const handleClickGrid = (cat) => {
	console.log(cat.catId)
	uni.navigateTo({
		url: `Card?catId=${cat.catId}`
	})
}

// 添加猫猫
const handleAdd = () => {
	if (checkLogin()) {
		uni.navigateTo({
			url: './catEdit'
		})
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #f5f7fa;

	.header {
		background-color: #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		position: sticky;
		top: 0;
		z-index: 100;

		&-row {
			height: 100rpx;
			display: flex;
			align-items: center;
		}

		&-icon {
			width: 48rpx;
			height: 48rpx;
		}

		&-title {
			font-size: 36rpx;
			font-weight: 600;
			color: #333;
		}

		&-left,
		&-center,
		&-right {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.add-button {
			display: flex;
			align-items: center;
			background: #ffffff;
			padding: 12rpx 28rpx;
			border-radius: 50rpx;
			border: 2rpx solid #8d5da3;
			box-shadow: 0 4rpx 12rpx rgba(141, 93, 163, 0.1);
			transition: all 0.2s ease;

			&:active {
				transform: scale(0.97);
				background: #f9f6fb;
			}

			.header-icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
			}

			.add-text {
				color: #8d5da3;
				font-size: 26rpx;
				font-weight: 500;
			}
		}
	}

	.stats-container {
		padding: 30rpx;

		.stats-card {
			border-radius: 16rpx;
			background: #fff;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
			overflow: hidden;

			:deep(.uni-card__header) {
				border-bottom: 2rpx solid #f0f2f5;
			}

			.total-stats {
				text-align: center;
				padding: 40rpx 0;
				background: linear-gradient(45deg, #8d5da3, #b876d9);
				border-radius: 12rpx;
				margin-bottom: 30rpx;

				.stats-number {
					.number {
						font-size: 72rpx;
						font-weight: bold;
						color: #fff;
					}

					.unit {
						font-size: 32rpx;
						color: rgba(255, 255, 255, 0.9);
						margin-left: 8rpx;
					}
				}

				.stats-label {
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.9);
					margin-top: 8rpx;
				}
			}

			.cat-list {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 20rpx;
				padding: 20rpx;

				.cat-item {
					background: #fff;
					border-radius: 12rpx;
					padding: 20rpx;
					display: flex;
					align-items: center;
					gap: 20rpx;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
					transition: all 0.3s ease;

					&:active {
						transform: scale(0.98);
					}

					.cat-avatar {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						object-fit: cover;
					}

					.cat-info {
						flex: 1;

						.cat-name {
							font-size: 32rpx;
							font-weight: 500;
							color: #333;
							display: block;
						}

						.cat-area {
							font-size: 24rpx;
							color: #999;
							margin-top: 4rpx;
						}
					}
				}
			}
		}
	}
}

// 添加进入动画
.cat-item {
	animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>