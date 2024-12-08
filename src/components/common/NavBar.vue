<template>
  <view class="nav-bar">
    <view v-if="showBack" class="back-btn" @click="handleBack">
      <text class="iconfont icon-back">&#xe679;</text>
      <text class="back-text">返回</text>
    </view>
    <text class="page-title">{{ title }}</text>
    <view v-if="$slots.right" class="right-area">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  }
});

const handleBack = () => {
  uni.navigateBack({
    delta: 1
  });
};
</script>

<style lang="scss" scoped>
.nav-bar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 88rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
  z-index: 100;

  .back-btn {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20rpx;
    
    .icon-back {
      font-size: 36rpx;
      color: #333;
    }
    
    .back-text {
      font-size: 28rpx;
      color: #333;
      margin-left: 8rpx;
    }
  }

  .page-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .right-area {
    margin-left: auto;
  }
}
</style> 