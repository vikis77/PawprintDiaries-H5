// pinia全局状态管理模块
// 作用说明：定义全局状态

import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义帖子类型接口
interface Post {
    postId: number;
    title: string;
    coverPicture: string;
    authorAvatar: string;
    authorNickname: string;
    likeCount: number;
    // 其他帖子相关字段...
}

// 使用组合式 API 风格定义 store
export const useAppStore = defineStore('app', () => {
    // 帖子列表
    const postList = ref<Post[]>([])
    // 分页状态
    const pagination = ref({
        page: ref(1), // 当前页数
        size: ref(10), // 页面大小
        total: ref(1) // 总页数
    })
    // 是否首次启动
    const isFirstLaunch = ref(true)
    // 主题状态
    const theme = ref({
        isDark: false,
        primaryColor: '#007AFF'
    })
    // 设置状态
    const settings = ref({
        autoPlay: true,
        notification: true
    })



    // Actions
    function setPostList(list: Post[]) {
        postList.value = list
    }
    // 设置分页大小，页面大小默认10
    function setPageSize(page: number, size: number = 10, total: number = 1) {
        pagination.value.page = page
        pagination.value.size = size
        pagination.value.total = total
    }
    // 设置主题
    function setTheme(isDark: boolean) {
        theme.value.isDark = isDark
    }
    // 更新设置
    function updateSettings(newSettings: any) {
        settings.value = { ...settings.value, ...newSettings }
    }
    // 标记为非首次启动
    function markAsNotFirstLaunch() {
        isFirstLaunch.value = false
    }

    // 返回状态和方法
    return {
        // 状态
        postList,
        pagination,
        isFirstLaunch,
        theme,
        settings,
        // Actions
        setPostList,
        setPageSize,
        setTheme,
        updateSettings,
        markAsNotFirstLaunch
    }
}) 