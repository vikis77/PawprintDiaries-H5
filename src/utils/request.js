// 封装请求方法
import { ref } from 'vue';

// 环境变量
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080'
  : 'https://pawprintdiaries.luckyiur.com';

// 请求封装
const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: API_BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          // 处理错误
          uni.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

// 导出请求方法
export const get = (url, params = {}) => {
  return request({
    url,
    method: 'GET',
    data: params
  });
};

export const post = (url, data = {}) => {
  return request({
    url,
    method: 'POST',
    data
  });
};

export const put = (url, data = {}) => {
  return request({
    url,
    method: 'PUT',
    data
  });
};

export const del = (url, data = {}) => {
  return request({
    url,
    method: 'DELETE',
    data
  });
};

export default request; 