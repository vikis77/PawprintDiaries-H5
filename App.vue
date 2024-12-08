<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/modules/app'
import { getPosts } from '@/src/api/post'
import axios from 'axios'
import { API_general_request_url } from '@/src/config/index.js'

const appStore = useAppStore()

onLaunch(async () => {
    console.log('App Launch')
    // 预加载首页帖子数据
    await getPosts(undefined, undefined, true)
    console.log("当前页码：", appStore.pagination.page)
    console.log("每页帖子数量：", appStore.pagination.size)
    console.log("帖子总数：", appStore.pagination.total)
    console.log("-----帖子数据预加载完成-----")
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
