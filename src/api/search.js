import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'

// 全局搜索功能
export const globalSearch = async (searchWords) => {
    // await checkLogin()
    const appStore = useAppStore()
    try {
        const response = await uni.request({
            url: `${API_general_request_url.value}/api/search/search?words=${searchWords}`,
            method: 'GET',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    appStore.setSearchResultData(res.data.data);
                    console.log("搜索结果存储到appStore成功")
                    console.log(res.data.data)
                    uni.redirectTo({
						url: `SearchResultPage?searchWords=${encodeURIComponent(searchWords)}`
					});
                } else {
                    throw new Error(res.data.msg || '获取搜索结果失败');
                }
            },
            fail: (error) => {
                console.log('搜索请求失败:', error);
                throw error;
            }
        });
    } catch (error) {
        console.error('搜索请求失败:', error);
        throw error;
    }
}