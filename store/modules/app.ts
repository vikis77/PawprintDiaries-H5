// // // app 模块
// // // 作用说明：定义 app 模块的状态、getters 和 actions

// import { defineStore } from 'pinia'

// export const useAppStore = defineStore('app', {
//     state: () => ({
//         pagination: {
//             pageSize: 10,
//             currentPage: 1,
//             total: 0
//         },
//         isFirstLaunch: true,
//         theme: {
//             isDark: false,
//             primaryColor: '#007AFF'
//         },
//         settings: {
//             autoPlay: true,
//             notification: true
//         }
//     }),

//     actions: {
//         setPageSize(size: number) {
//             this.pagination.pageSize = size
//             this.pagination.currentPage = 1
//         },
//         setTotal(total: number) {
//             this.pagination.total = total
//         },
//         setTheme(isDark: boolean) {
//             this.theme.isDark = isDark
//         },
//         updateSettings(settings: any) {
//             this.settings = { ...this.settings, ...settings }
//         },
//         markAsNotFirstLaunch() {
//             this.isFirstLaunch = false
//         }
//     }
// }) 