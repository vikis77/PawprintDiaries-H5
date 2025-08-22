<template>
    <view class="chat-container">
        <!-- 头部导航 -->
        <NavBar1001 
            :title="'智能助手'"
            :showRight="false"
        />
        <web-view :src="chatUrl" class="chat-view" style="overflow: hidden;" :webview-styles="{ progress: false }"></web-view>
    </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
import NavBar1001 from '@/src/components/common/NavBar1001.vue'
import { STATUS_CODE } from '@/src/constant/constant.js'

const chatUrl = ref('')

onMounted(() => {
    // 获取页面参数
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const token = currentPage.$page?.options?.token || ''
    // console.log(token)
    // 设置聊天URL
    chatUrl.value = `https://udify.app/chat/${token}`
})
</script>

<style lang="scss" scoped>
.chat-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* 防止外层出现滚动条 */

    :deep(web-view) {
        width: 100%;
        height: 90%;
        margin-top: 130rpx;
    }
}

/* 全局样式，确保所有可能的滚动条都被隐藏 */
:deep(::-webkit-scrollbar) {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
}

:deep(::-webkit-scrollbar-track) {
    display: none !important;
    background-color: transparent !important;
}

:deep(::-webkit-scrollbar-thumb) {
    display: none !important;
    background-color: transparent !important;
}

:deep(.chat-view) {
    overflow: hidden !important;
    -webkit-overflow-scrolling: touch !important;
}
</style> 