import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'

// 获取猫爪页面全部小猫详情数据
export const getCatInfoDetail = async () => {
    console.log(uni.getStorageSync('token'))
    const appStore = useAppStore()
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${API_general_request_url.value}/api/cat/list`,
            method: 'GET',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: async (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    const catList = res.data.data
                    await appStore.setCatList(catList);
                    console.log("获取猫爪页面全部小猫详情数据成功")
                    console.log(res)
                    resolve();
                } else {
                    uni.showToast({
                        title: res.data.msg || '获取猫爪页面全部小猫详情数据失败',
                        icon: 'none'
                    })
                    reject(new Error(res.data.msg || '获取猫爪页面全部小猫详情数据失败'));
                }
            },
            fail: (err) => {
                console.log(err)
                console.log("获取猫爪页面全部小猫详情数据失败")
                reject(err);
            }
        });
    });
}

// 获取猫爪页面数据分析数据
export const getCatAnalyseData = async () => {
    const appStore = useAppStore()
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${API_general_request_url.value}/api/cat/analysis`,
            method: 'GET',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: async (res) => {
                console.log("success")
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    const newData = res.data.data;
                    await appStore.setCatDataAnalysis(newData);
                    console.log("获取猫爪页面数据分析数据成功")
                    console.log(newData)
                    resolve();
                } else {
                    uni.showToast({
                        title: res.data.msg || '获取猫爪页面数据分析数据失败',
                        icon: 'none'
                    })
                    reject(new Error(res.data.msg || '获取猫爪页面数据分析数据失败'));
                }
                console.log(res)
            },
            fail: (err) => {
                console.log("fail")
                uni.showToast({
                    title: '出错啦',
                    icon: 'none'
                })
                console.log(err)
                console.log("获取猫爪页面数据分析数据失败")
                reject(err);
            }
        });
    });
}

// 获取全部小猫最新坐标
export const getCatLocationLatest = async () => {
    await checkLogin()
    const appStore = useAppStore()
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${API_general_request_url.value}/api/cat/location/latest`,
            method: 'GET',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: async (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    const newData = res.data.data;
                    await appStore.setCatLocations(newData);
                    console.log("获取全部小猫最新坐标成功")
                    console.log(newData)
                    resolve();
                } else {
                    reject(new Error('获取全部小猫最新坐标失败'));
                }
            },
            fail: (err) => {
                console.error('获取全部小猫最新坐标失败:', err);
                reject(err);
            }
        });
    });
}


