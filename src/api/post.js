import { get, post, put } from '@/utils/request';
// 帖子相关接口

// 获取帖子数据，包括加载初始数据和分页加载更多数据
export const getPosts = (page, pageSize) => {
  return get(`/api/post/getPostBySendtimeForPage?page=${page}&pageSize=${pageSize}`);
};

