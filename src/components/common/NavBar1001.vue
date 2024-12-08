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
						<img v-if="showRight" :src="rightIcon" @click="handleRightClick" class="header-icon" />
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
		default: '../../../static/返回.png'
	},
	rightIcon: {
		type: String,
		default: '../../../static/猫砂盆.png'
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
        height: 150rpx;
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
}
</style>

</```rewritten_file>