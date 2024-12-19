import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'
/**
 * @Description 系统通用方法.
 *
 * @Author liuyun
 * @Version 1.0
 * @Since 2024-12-11 21:17
 */

// 登录权限校验
export const checkLogin = () => {
    const token = uni.getStorageSync('token')
    if (!token) {
        showToast('请先登录')
        return false
    }

    try {
        // 解析 JWT token (取第二部分 payload)
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000) // 转换为秒
        
        // JWT 通常使用 exp 字段表示过期时间（Unix 时间戳，单位秒）
        if (payload.exp && currentTime < payload.exp) {
            return true
        } else {
            showToast('登录已过期，请重新登录')
            uni.removeStorageSync('token') // 清除过期token
            return false
        }
    } catch (error) {
        console.error('Token 解析失败:', error)
        showToast('登录状态异常，请重新登录')
        uni.removeStorageSync('token')
        return false
    }
};

