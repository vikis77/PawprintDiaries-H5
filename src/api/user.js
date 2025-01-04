import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'

// 请求用户个人资料
export const getUserProfile = async (params) => {
    // 创建 store 实例
    const appStore = useAppStore()
    try {
        const res = await uni.request({
            url: `${API_general_request_url.value}/api/user/profile`,
            method: 'GET',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            }
        })

        if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
            console.log("打印user:")
            console.log(res.data.data)
            await appStore.setUserInfo(res.data.data)
            return res.data.data;
        } else {
            uni.removeStorageSync('token')
            uni.showToast({
                title: res.data.msg || '获取用户数据失败',
                icon: 'none'
            })
        }
    } catch (error) {
        console.error('获取用户个人资料失败:', error);
        throw error;
    }
}