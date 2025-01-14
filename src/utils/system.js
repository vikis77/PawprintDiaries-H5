import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'

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
        try {
            uni.removeStorageSync('token') // 清除过期token
            console.log("清除过期token成功")
        } catch (error) {
            console.error('清除过期token失败:', error);
        }
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

// 检查是否在微信浏览器中
export const isWechatBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
};

// 获取微信JS-SDK配置信息
export const getWechatConfig = async () => {
    // #ifdef H5
    try {
        // 检查是否在微信浏览器中
        if (!isWechatBrowser()) {
            console.log('不在微信浏览器中，跳过微信配置');
            return;
        }

        // 获取当前页面URL（去除hash部分）
        const currentUrl = window.location.href.split('#')[0];
        console.log('当前URL:', currentUrl);
        
        return new Promise((resolve, reject) => {
            uni.request({
                url: `${API_general_request_url.value}/api/wxshare/wxConfig?url=${encodeURIComponent(currentUrl)}`,
                method: 'GET',
                header: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`
                },
                success: (res) => {
                    if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                        const wxConfig = res.data.data;
                        console.log('获取到的微信配置:', wxConfig);
                        
                        // 动态加载微信JS-SDK
                        const script = document.createElement('script');
                        script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
                        script.onload = () => {
                            // 配置微信JS-SDK
                            wx.config({
                                debug: true, // 开启调试模式
                                appId: wxConfig.appId, // 公众号的唯一标识
                                timestamp: Number(wxConfig.timestamp), // 生成签名的时间戳，转换为数字类型
                                nonceStr: wxConfig.nonceStr, // 生成签名的随机串
                                signature: wxConfig.signature, // 签名
                                jsApiList: [
                                    'checkJsApi',
                                    'onMenuShareTimeline',
                                    'onMenuShareAppMessage',
                                    'onMenuShareQQ',
                                    'onMenuShareWeibo',
                                    'onMenuShareQZone',
                                    'updateAppMessageShareData',
                                    'updateTimelineShareData'
                                ],
                                openTagList: ['wx-open-launch-weapp']
                            });
                            
                            // 处理配置成功
                            wx.ready(() => {
                                console.log('微信JS-SDK配置成功');
                                
                                // 判断是否在微信环境中
                                if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
                                    // 配置旧版分享接口
                                    wx.onMenuShareAppMessage({
                                        title: '喵喵日记', // 分享标题
                                        desc: '校园流浪猫救助平台', // 分享描述
                                        link: currentUrl, // 分享链接
                                        imgUrl: 'https://cdn.luckyiur.com/catcat/static_image/V1_report.png', // 分享图标
                                        type: '', // 分享类型,music、video或link，不填默认为link
                                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                        success: function () {
                                            console.log('旧版分享设置成功');
                                        },
                                        fail: function(err) {
                                            console.error('旧版分享设置失败:', err);
                                        }
                                    });
                                }
                                
                                // 配置新版分享接口
                                wx.updateAppMessageShareData({ 
                                    title: '喵喵日记', // 分享标题
                                    desc: '校园流浪猫救助平台', // 分享描述
                                    link: currentUrl, // 分享链接
                                    imgUrl: 'https://cdn.luckyiur.com/catcat/static_image/V1_report.png', // 分享图标
                                    success: function () {
                                        console.log('新版分享设置成功');
                                    },
                                    fail: function(err) {
                                        console.error('新版分享设置失败:', err);
                                        // 如果新版接口失败，尝试使用旧版接口
                                        wx.onMenuShareAppMessage({
                                            title: '喵喵日记',
                                            desc: '校园流浪猫救助平台',
                                            link: currentUrl,
                                            imgUrl: 'https://cdn.luckyiur.com/catcat/static_image/V1_report.png',
                                            success: function () {
                                                console.log('降级到旧版分享接口成功');
                                            }
                                        });
                                    }
                                });
                            });
                            
                            // 处理配置失败
                            wx.error((err) => {
                                console.error('微信JS-SDK配置失败:', err);
                                reject(err);
                            });
                        };
                        
                        script.onerror = (err) => {
                            console.error('加载微信JS-SDK失败:', err);
                            reject(err);
                        };
                        
                        document.head.appendChild(script);
                        resolve(res.data);
                    } else {
                        reject(new Error(res.data.msg || '获取微信配置失败'));
                    }
                },
                fail: (error) => {
                    console.error('获取微信配置请求失败:', error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('获取微信配置失败:', error);
        throw error;
    }
    // #endif
}