import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'
import { STATUS_CODE } from '@/src/constant/constant.js'

// 获取待审核评论列表
export const getPendingComments = async (params) => {
    // 创建 store 实例
    const appStore = useAppStore()
    try {
        const response = await axios.get(`${API_general_request_url.value}/api/comment/getAuditCommentByDescTime`, {
            params: {
                page: params.page, // 页数
                pageSize: params.pageSize, // 页面大小
                type: params.type, // 评论类型：all、post、cat
                sort: params.sort // 排序方式：desc、asc
            },
            headers: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            }
        });

        if (response.status === 200 && response.data.code === STATUS_CODE.SUCCESS) {
            console.log("获取待审核评论成功：", response.data.data)
            // 确保返回的数据结构正确
            const responseData = {
                catComments: response.data.data.catComments || [],
                postComments: response.data.data.postComments || []
            }
            appStore.setAuditCommentList(responseData)
            return responseData;
        }
        uni.showToast({
            title: response.data.msg || '获取待审核评论失败',
            icon: 'none'
        })
        throw new Error('获取待审核评论失败');
    } catch (error) {
        console.error('获取待审核评论失败:', error);
        throw error;
    }
}

// 审核评论
export const reviewComment = async (id, type, action) => {
    // 创建 store 实例
    const appStore = useAppStore()
    console.log("审核评论：", id, type, action)
    try {
        uni.request({
            url: `${API_general_request_url.value}/api/comment/review`,
            method: 'POST',
            data: {
                "commentId": id,
                "type": type,
                "action": action
            },
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    console.log("审核评论成功：", res)
                    uni.showToast({
                        title: '操作成功',
                        icon: 'success'
                    })
                } else {
                    uni.showToast({
                        title: res.data.msg || '操作失败',
                        icon: 'none'
                    })
                    throw new Error('评论审核操作失败');
                }
            },
            fail: (err) => {
                console.log("审核评论失败：", err)
            }
        })
    } catch (error) {
        console.error('评论审核操作失败:', error);
        throw error;
    }
}