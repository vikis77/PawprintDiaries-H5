import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'

// 计算金额
export const getFundCalculate = async (type) => {
    // 这里调用一次请求总体的数据分析
    await getCatAnalyseData()
    const appStore = useAppStore()
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${API_general_request_url.value}/api/cat/analysis/fundCalculate?type=${type}`,
            method: 'GET',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: async (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    const fundCalculateData = res.data.data;
                    await appStore.setFundCalculateData(fundCalculateData);
                    console.log("获取资金余额成功")
                    console.log(res)
                    resolve();
                } else {
                    uni.showToast({
                        title: res.data.msg || '获取资金余额失败',
                        icon: 'none'
                    })
                    reject(new Error(res.data.msg || '获取资金余额失败'));
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
    })
}

