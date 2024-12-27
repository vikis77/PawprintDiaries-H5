import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'

// 全局搜索功能
export const globalSearch = async (searchWords) => {
    const appStore = useAppStore()
    try {
        const response = await axios.get(`${API_general_request_url.value}/api/search/search?words=${searchWords}`, {
            headers: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            }
        });
        // 处理响应结果
        if (response.status === 200 && response.data.code === '2000') {
            // 将搜索结果存储到本地
            // uni.setStorageSync('searchResultData', response.data.data);
            appStore.setSearchResultData(response.data.data);
            console.log("搜索结果存储到本地成功")
            console.log(response.data.data)
            return response.data.data;
        } else {
            throw new Error(response.data.msg || '获取搜索结果失败');
        }
    } catch (error) {
        console.error('搜索请求失败:', error);
        throw error;
    }
}