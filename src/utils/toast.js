/**
 * 显示"功能开发中"提示
 * @returns {void}
 */
export const toBeDeveloped = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
    duration: 2000
  })
}

/**
 * 显示自定义提示消息
 * @param {string} message - 提示消息
 * @param {Object} options - 额外的配置选项
 * @returns {void}
 */
export const showToast = (message, options = {}) => {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000,
    ...options
  })
} 