// 帖子相关通用接口方法
// import { get, post, put } from '@/utils/request';
import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'
import { STATUS_CODE, STATUS_MESSAGE } from '@/src/constant/constant.js'

// 获取帖子数据，默认加载更多数据
export const getPosts = async (page = undefined, pageSize = undefined, isRefresh = false, isFirstTime = false) => {
    // await checkLogin()
    // 创建 store 实例
    const appStore = useAppStore()

    // 如果没有传入参数，使用store中的默认值
    if (page === undefined) page = appStore.pagination.page
    if (pageSize === undefined) pageSize = appStore.pagination.size
    // 如果刷新，则将页码重置为0，否则页码加1
    if (isRefresh) {
        page = 1
        console.log("开始请求第1页帖子数据")
        try {
            const response = await axios.get(`${API_general_request_url.value}/api/post/getRandomWeightedPosts?page=${page}&pageSize=${pageSize}&firstTime=${isFirstTime}`, {
                headers: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`
                }
            })
            if (response.status === 200 && response.data.code === STATUS_CODE.SUCCESS) {
                console.log(response.data)
                const newPosts = response.data.data
                await appStore.setPageSize(page, pageSize, response.data.totalPages)
                console.log(appStore.pagination)
                await appStore.setPostList(newPosts);
                console.log(newPosts)
                return;
            }
            uni.showToast({
                title: response.data.msg || '获取帖子失败',
                icon: 'none'
            })
            throw new Error('获取帖子失败');
        } catch (error) {
            console.error('获取帖子失败:', error);
            throw error;
        }
    } else {
        page++
        console.log(`开始请求第${page}页帖子数据`)
        try {
            const response = await axios.get(`${API_general_request_url.value}/api/post/getRandomWeightedPosts?page=${page}&pageSize=${pageSize}&firstTime=${isFirstTime}`, {
                headers: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`
                }
            })
            if (response.status === 200 && response.data.code === STATUS_CODE.SUCCESS) {
                const newPosts = response.data.data
                appStore.setPostList([...appStore.postList, ...newPosts]);
                appStore.setPageSize(page, pageSize, response.data.totalPages)
                console.log(newPosts)
                return;
            }
            uni.showToast({
                title: response.data.msg || '获取帖子失败',
                icon: 'none'
            })
            throw new Error('获取帖子失败');
        } catch (error) {
            console.error('获取帖子失败:', error);
            throw error;
        }
    }
};

// 获取待审核帖子列表
export const getApplyPosts = async () => {
    // await checkLogin()
    const appStore = useAppStore()
    console.log(`Bearer ${uni.getStorageSync('token')}`)
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${API_general_request_url.value}/api/post/getApplyPostBySendtimeForPage?page=1&pageSize=10`,
            method: 'GET',
            header: {
                'Authorization': `Bearer ${uni.getStorageSync('token')}`
            },
            success: async (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    const applyPosts = res.data.data
                    appStore.setApplyPostList(applyPosts)
                    console.log("获取待审核帖子列表成功：", applyPosts)
                    resolve(applyPosts);
                } else {
                    uni.showToast({
                        title: res.data.msg || '获取待审核帖子列表失败',
                        icon: 'none'
                    })
                    reject(new Error(res.data.msg || '获取待审核帖子列表失败'));
                }
            },
            fail: (err) => {
                console.log(err)
                reject(err);
            }
        });
    });
};


