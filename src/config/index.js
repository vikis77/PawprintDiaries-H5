import { ref } from 'vue'

// API请求基础URL
export const API_general_request_url = ref('')
// 图片资源基础URL
export const pic_general_request_url = ref('')
// 图片资源后缀
export const Suffix_1001 = ref('')

// 根据环境设置不同的URL
if (process.env.NODE_ENV === 'development') {
    // 开发环境
    pic_general_request_url.value = "http://localhost:8000"
    API_general_request_url.value = "http://localhost:8080"
    Suffix_1001.value = ""
} else {
    // 生产环境
    pic_general_request_url.value = "https://cdn.luckyiur.com/catcat"
    API_general_request_url.value = "https://pawprintdiaries.luckyiur.com"
    Suffix_1001.value = "-small35"
}

// 导出其他可能的配置
export const config = {
    // 每页数据条数
    pageSize: 10,
    // 默认头像
    defaultAvatar: `${pic_general_request_url.value}/default-avatar.png`,
    // 其他全局配置...
} 