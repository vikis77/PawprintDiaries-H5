// 帖子相关通用接口方法
// import { get, post, put } from '@/utils/request';
import { useAppStore } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'



// 获取帖子数据，默认加载更多数据
export const getPosts = async (page = undefined, pageSize = undefined, isRefresh = false) => {
  // 创建 store 实例
  const appStore = useAppStore()

  // 如果没有传入参数，使用store中的默认值
  if (page === undefined) page = appStore.pagination.page
  if (pageSize === undefined) pageSize = appStore.pagination.size
  const total = appStore.pagination.total

  // 如果刷新，则将页码重置为0，否则页码加1
  if (isRefresh) {
    page = 1
    console.log("刷新帖子数据")
    try {
      const response = await axios.get(`${API_general_request_url.value}/api/post/getPostBySendtimeForPage?page=${page}&pageSize=${pageSize}`);
      if (response.status === 200 && response.data.code === "2000") {
        console.log(response)
        const newPosts = response.data.data.records
        appStore.setPageSize(page, pageSize, response.data.data.pages)
        appStore.setPostList(newPosts);
        console.log("刷新帖子数据成功")
        return;
      }
      throw new Error('获取帖子失败');
    } catch (error) {
      console.error('获取帖子失败:', error);
      throw error;
    }
  } else {
    page++
    console.log("加载更多帖子数据")
    try {
      const response = await axios.get(`${API_general_request_url.value}/api/post/getPostBySendtimeForPage?page=${page}&pageSize=${pageSize}`);
      if (response.status === 200 && response.data.code === "2000") {
        const newPosts = response.data.data.records
        appStore.setPostList([...appStore.postList, ...newPosts]);
        appStore.setPageSize(page, pageSize, response.data.data.pages)
        console.log("加载更多帖子数据成功")
        return;
      }
      throw new Error('获取帖子失败');
    } catch (error) {
      console.error('获取帖子失败:', error);
      throw error;
    }
  }
};

