import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'

// 获取猫爪页面全部小猫详情数据
export const getCatInfoDetail = async () => {
    const appStore = useAppStore()
    try {
        const response = await axios.get(`${API_general_request_url.value}/api/cat/list`, {
            headers: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            }
        });
        if (response.status === 200 && response.data.code === "2000") {
            const catList = response.data.data
            appStore.setCatList(catList);
            console.log(response)
            console.log("获取猫爪页面全部小猫详情数据成功")
            return;
        }
        throw new Error('获取猫爪页面全部小猫详情数据失败');
    } catch (error) {
        console.error('获取猫爪页面全部小猫详情数据失败:', error);
        throw error;
    }
}

