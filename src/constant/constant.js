/* 常量 */

// 状态码
export const STATUS_CODE = {
    SUCCESS: 10001,    // 操作成功
    FAIL: 20000,      // 操作失败
}

// 为了方便使用，添加状态码消息映射
export const STATUS_MESSAGE = {
    [STATUS_CODE.SUCCESS]: '操作成功',
    [STATUS_CODE.FAIL]: '操作失败'
}
