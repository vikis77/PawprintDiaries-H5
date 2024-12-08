import { get, post, put } from '@/utils/request';

// 用户信息相关接口
export const getUserInfo = (userId) => {
  return get(`/api/user/${userId}`);
};

export const updateUserInfo = (userId, data) => {
  return put(`/api/user/${userId}`, data);
};

export const updateUserAvatar = (userId, avatarFile) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${process.env.VUE_APP_API_URL}/api/user/${userId}/avatar`,
      filePath: avatarFile,
      name: 'avatar',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.data));
        } else {
          reject(res);
        }
      },
      fail: reject
    });
  });
};

// 用户关系相关接口
export const getUserFollowers = (userId, params) => {
  return get(`/api/user/${userId}/followers`, params);
};

export const getUserFollowing = (userId, params) => {
  return get(`/api/user/${userId}/following`, params);
};

export const followUser = (userId) => {
  return post(`/api/user/follow/${userId}`);
};

export const unfollowUser = (userId) => {
  return post(`/api/user/unfollow/${userId}`);
};

// 用户帖子相关接口
export const getUserPosts = (userId, params) => {
  return get(`/api/user/${userId}/posts`, params);
};

export const getUserLikedPosts = (userId, params) => {
  return get(`/api/user/${userId}/liked-posts`, params);
}; 
