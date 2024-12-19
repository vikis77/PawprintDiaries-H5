<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/modules/app'
// import { getPosts, getCatInfoDetail } from '@/src/api/post'
// import axios from 'axios'
// import { API_general_request_url } from '@/src/config/index.js'

const appStore = useAppStore()

onLaunch(async () => {
    console.log('App Launch')
    console.log("当前运行环境：", process.env.NODE_ENV)

    // 预加载首页帖子数据
    await getPosts(undefined, undefined, true)
    // console.log("当前页码：", appStore.pagination.page)
    // console.log("每页帖子数量：", appStore.pagination.size)
    // console.log("帖子总数：", appStore.pagination.total)
    console.log("-----帖子数据预加载完成-----")
    // 预加载catClaw页面详情数据
    await getCatInfoDetail()
    // await getCatAnalyseData()
    console.log("-----catClaw页面详情数据预加载完成-----")
})
</script>

<style lang="scss">
@media only screen and (min-width: 500px) {
    page {
        width: 500px;
        margin: 0 auto;
    }
}
</style>
