// uni-app 类型声明文件
// 作用说明：解决uni-app在HBuilderX中无法识别onLaunch、onShow、onHide等方法的问题

declare module '@dcloudio/uni-app' {
    export function onLaunch(callback: () => void): void
    export function onShow(callback: () => void): void
    export function onHide(callback: () => void): void
} 