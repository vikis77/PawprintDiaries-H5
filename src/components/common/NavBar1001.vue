<!-- 顶部导航栏通用组件1001 -->

<template>
	<!-- <view class="container"> -->
		<!-- <view class="layout"> -->
			<!-- 头部导航 -->
			<view class="header">
				<uni-row class="header-row">
					<uni-col :span="8" class="header-left">
						<img v-if="showLeft" :src="leftIcon" @click="handleGoback" class="header-icon" />
					</uni-col>
					<uni-col :span="8" class="header-center">
						<text class="header-title">{{ title }}</text>
					</uni-col>
					<uni-col :span="8" class="header-right">
                        <!-- 发布按钮 -->
                        <button v-if="showRight" @click="handleRightClick" class="publish-button">
                        发布
                        </button>
						<!-- <img v-if="showRight" :src="rightIcon" @click="handleRightClick" class="header-icon" /> -->
					</uni-col>
				</uni-row>
			</view>
		<!-- </view> -->
	<!-- </view> -->
</template>

<script setup>
const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	showLeft: {
		type: Boolean,
		default: true
	},
	showRight: {
		type: Boolean,
		default: true
	},
	leftIcon: {
		type: String,
		default: '../../../static/goback.png'
	},
	rightIcon: {
		type: String,
		default: '../../../static/macshapen.png'
	},
	customBack: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['onBack', 'onRightClick'])

const handleGoback = () => {
	emit('onBack')
	if (!props.customBack) {
		uni.navigateBack({
			delta: 1,
			fail: () => {
				uni.switchTab({
					url: '/src/pages/Home'
				})
			}
		})
	}
}

const handleRightClick = () => {
	emit('onRightClick')
}
</script>

<style lang="scss" scoped>
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

    /* 发布按钮样式 */
    .publish-button {
        height: 70rpx;
        width: 148rpx;
        position: fixed; /* 固定定位 */
        top: 9px; /* 距离顶部 20px */
        right: 20px; /* 距离右侧 20px */
        padding: 0px 0px 0px 0px; /* 内边距 */
        font-size: 19px; /* 字体大小 */
        color: #fff; /* 文字颜色 */
        background-color: #007bff; /* 背景颜色 */
        border: none; /* 去掉边框 */
        line-height: 2; /* 确保文字垂直居中 */
        border-radius: 5px; /* 圆角 */
        cursor: pointer; /* 鼠标悬停时显示手型 */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 添加阴影 */
        transition: background-color 0.3s ease; /* 背景颜色过渡效果 */
    }

    /* 按钮悬停效果 */
    .publish-button:hover {
        background-color: #0056b3; /* 悬停时背景颜色变深 */
    }

    /* 按钮点击效果 */
    .publish-button:active {
        background-color: #004080; /* 点击时背景颜色更深 */
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* 点击时阴影变小 */
    }

}
</style>

</```rewritten_file>