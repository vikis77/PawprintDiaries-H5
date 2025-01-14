// pinia全局状态管理模块
// 作用说明：定义全局状态

import { defineStore } from 'pinia'
import { ref } from 'vue'




// 定义资金计算数据接口
interface FundCalculateData {
    month: number; // 月份
    remainingFund: number; // 救助资金剩余
    totalExpenses: number; // 资金支出 
    totalIncome: number; // 资金收入
}

// 定义搜索结果数据接口
interface SearchResult {
    cats: CatList[];
    posts: PostDetail[];
}

// 定义猫咪位置信息接口
interface CatLocation {
    id: number;
    area: string | null;
    catId: number | null;
    description: string | null;
    latitude: number | null;
    longitude: number | null; 
    updateTime: number | null;
    catName: string;
}

// 定义猫咪数据分析接口
interface CatDataAnalysis {
    adoptionCount: number; // 领养数量
    sterilizationRatio: {
        '已绝育': number; // 已绝育数量
        '未绝育': number; // 未绝育数量
    };
    vaccinationRatio: {
        '已接种': number; // 已接种数量
        '未接种': number; // 未接种数量
    };
    healthStatus: {
        '健康': number; // 健康数量
        '疾病': number; // 疾病数量
        '营养不良': number; // 营养不良数量
        '肥胖': number; // 肥胖数量
    };
    monthlyNewCount: number; // 本月新增数量
    fundBalance: number; // 资金余额
    monthExpense: number; // 本月支出
    monthIncome: number; // 本月收入
    ageDistribution: {
        "3个月以内": number; // 3个月以内数量
        "3-6个月": number; // 3-6个月数量
        "6-12个月": number; // 6-12个月数量
        "12-18个月": number; // 12-18个月数量
        "18-24个月": number; // 18-24个月数量
        "24个月以上": number; // 24个月以上数量
    };
    areaDistribution: {
        '北门': number; // 北门数量
        '岐头': number; // 岐头数量
        '凤翔': number; // 凤翔数量
        '厚德楼': number; // 厚德楼数量
        '香晖苑': number; // 香晖苑数量
        '未知': number; // 未知数量
    };
}

// 定义统计卡片数据接口
interface GridItem {
    url: string;
    data: number;
    text: string;
    text2: string;
    badge?: string;
    type?: string;
    chartData?: any;
    chartOpts?: any;
}

// 评论审核类型接口
interface AuditComment {
    catCommentVO: CatComment[]; // 小猫待审核评论列表
    postCommentVO: PostComment[]; // 帖子待审核评论列表
}

// 小猫评论接口
interface CatComment {
    id: number; // 评论ID
    catId: number; // 小猫ID
    commentContext: string; // 评论内容
    commentUserId: number; // 评论用户ID
    status: number; // 评论状态：10未审核 20通过 30不通过
    isDeleted: number; // 是否删除：0否 1是
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
    likeCount: number; // 点赞数
    isTop: number; // 是否置顶：0否 1是
    avatar: string; // 评论者头像
    nickName: string; // 评论者昵称
    type: number; // 评论类型：10小猫 20帖子
    liked: boolean; // 是否点赞
}

// 帖子评论接口
interface PostComment {
    id: number; // 评论ID
    postId: number; // 帖子ID
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
    status: number; // 评论状态：10待审核 20通过 30未通过
    isDeleted: number; // 是否删除：0否 1是
    isTop: number; // 是否置顶：0否 1是
    commentContext: string; // 评论内容
    commentatorId: number; // 评论者ID
    likeCount: number; // 点赞数
    avatar: string; // 评论者头像
    nickname: string; // 评论者昵称
    type: number; // 评论类型：10小猫 20帖子
    liked: boolean; // 是否点赞
}


// 用户信息
interface UserInfo {
    userId: string; // 用户ID
    username: string; // 用户名
    nickName: string; // 昵称
    email: string; // 邮箱
    phoneNumber: string; // 手机号
    birthday: number; // 生日时间戳
    address: string; // 住址
    avatar: string; // 头像文件名
    status: number; // 状态(1:启用,0:禁用)
    createTime: number; // 创建时间戳
    updateTime: number | null; // 更新时间戳
    postCount: number; // 贴子数
    fansCount: number; // 粉丝数
    followCount: number; // 我的关注数
    signature: string; // 个性签名
    postList: PostDetail[]; // 该作者的首页帖子的集合
    collectionList: PostDetail[] | null; // 该作者的收藏帖子的集合
    likeList: PostDetail[] | null; // 该作者的点赞帖子的集合
    postLikedCount: number; // 获得的全部帖子的点赞总数
}

// 首页！！帖子类型接口
interface Post {
    postId: number; // 帖子id
    title: string; // 帖子标题
    coverPicture: string; // 封面图片
    authorAvatar: string; // 作者头像
    authorNickname: string; // 作者昵称
    likeCount: number; // 点赞数
}

// 帖子详情
interface PostDetail {
    postId: number; // 帖子id
    title: string; // 帖子标题
    article: string; // 文章内容
    authorId: number; // 作者ID
    likeCount: number; // 点赞数
    collectingCount: number; // 收藏数
    commentCount: number; // 评论数
    sendTime: string; // 发帖时间
    updateTime: string; // 更新时间
    coverPicture: string; // 首页图片地址
    isDeleted: number; // 是否删除
    isAdopted: number; // 是否通过审核
    approveUserId: number; // 审核人ID
}

// 定义猫猫列表类型接口
interface CatList {
    catId: number; // 猫猫id
    catname: string; // 猫猫名称
    gender: number; // 性别 0-公 1-母
    age: number; // 年龄
    birthday: number[]; // 生日
    avatar: string; // 头像
    food: string; // 食物偏好
    taboo: string; // 禁忌
    catCharacter: string; // 性格特征
    healthStatus: string; // 健康状况
    sterilizationStatus: string; // 绝育状态
    vaccinationStatus: string; // 疫苗接种状态
    badRecord: string; // 不良记录
    area: string | null; // 常居地
    catGuide: string; // 撸猫指南
    createTime: number[]; // 创建时间
    updateTime: number[]; // 更新时间
    trending: number; // 热度
    likeCount: number; // 点赞数
    isAdopted: number; // 是否已被领养
    isLikedToday: number; // 今天是否已点赞
    commentCount: number; // 评论数量
    breed: string; // 品种
}

// 定义待审核帖子列表类型接口
interface ApplyPost {
    postId: number; // 帖子id
    title: string; // 帖子标题
    article: string; // 帖子内容
    authorId: number; // 作者id
    authorAvatar: string; // 作者头像
    updateTime: string; // 更新时间
    authorNickname: string; // 作者昵称
    images: string[]; // 帖子图片
    send_time: string; // 发送时间
}

// 使用组合式 API 风格定义 store
export const useAppStore = defineStore('app', () => {
    /* ---------------------定义状态--------------------- */

    // 资金计算数据
    const fundCalculateData = ref<FundCalculateData[]>([])

    // 搜索结果数据
    const searchResultData = ref<SearchResult | null>(null)

    // 定义猫咪位置数据
    const catLocations = ref<CatLocation[]>([]);

    // 数据分析相关状态
    const catDataAnalysisData = ref<CatDataAnalysis>({
        adoptionCount: 0,
        sterilizationRatio: { '已绝育': 0, '未绝育': 0 },
        vaccinationRatio: { '已接种': 0, '未接种': 0 },
        healthStatus: { '健康': 0, '疾病': 0, '营养不良': 0, '肥胖': 0 },
        monthlyNewCount: 0,
        fundBalance: 0,
        lastMonthExpense: 0,
        lastMonthIncome: 0,
        ageDistribution: {
            "3个月以内": 0,
            "3-6个月": 0,
            "6-12个月": 0,
            "12-18个月": 0,
            "18-24个月": 0,
            "24个月以上": 0
        },
        areaDistribution: {
            '北门': 0,
            '岐头': 0,
            '凤翔': 0,
            '厚德楼': 0,
            '香晖苑': 0
        }
    })

    // 待审核评论列表
    const auditCommentList = ref<AuditComment | null>(null)
    // 帖子评论列表
    const postCommentList = ref<PostComment[]>([])
    // 小猫评论列表
    const catCommentList = ref<CatComment[]>([])
    // 用户信息
    const userInfo = ref<UserInfo | null>(null)

    // 待审核帖子列表
    const applyPostList = ref<ApplyPost[]>([])
    // 猫猫列表
    const catList = ref<CatList[]>([])
    // 帖子列表
    const postList = ref<Post[]>([])
    // 分页状态
    const pagination = ref({
        page: ref(1), // 当前页数
        size: ref(10), // 页面大小
        total: ref(1) // 总页数
    })
    // 是否首次启动
    const isFirstLaunch = ref(true)
    // 主题状态
    const theme = ref({
        isDark: false,
        primaryColor: '#007AFF'
    })
    // 设置状态
    const settings = ref({
        autoPlay: true,
        notification: true
    })


    /* ---------------------设置状态--------------------- */

    // 设置资金计算数据
    function setFundCalculateData(data: FundCalculateData[]) {
        fundCalculateData.value = data
    }
    // 设置搜索结果数据
    function setSearchResultData(data: SearchResult) {
        searchResultData.value = data
    }
    // 设置猫咪位置数据
    function setCatLocations(data: CatLocation[]) {
        catLocations.value = data
    }
    // 设置数据分析数据
    function setCatDataAnalysis(data: CatDataAnalysis) {
        catDataAnalysisData.value = data
    }

    // 设置帖子评论列表
    function setPostCommentList(list: PostComment[]) {
        postCommentList.value = list
    }
    // 设置小猫评论列表
    function setCatCommentList(list: CatComment[]) {
        catCommentList.value = list
    }
    // 设置待审核评论列表
    function setAuditCommentList(auditComment: AuditComment) {
        auditCommentList.value = auditComment
    }
    // 设置用户信息
    function setUserInfo(user: UserInfo) {
        userInfo.value = user
    }
    // 设置用户信息为空
    function setUserInfoNull() {
        userInfo.value = {
            userId: '',
            username: '',
            nickName: '',
            email: '',
            phoneNumber: '',
            birthday: 0,
            address: '',
            avatar: '',
        }
    }
    // 设置待审核帖子列表
    function setApplyPostList(list: ApplyPost[]) {
        applyPostList.value = list
    }
    // 设置猫猫列表
    function setCatList(list: CatList[]) {
        catList.value = list
    }
    // 设置帖子列表
    function setPostList(list: Post[]) {
        postList.value = list
    }
    // 设置分页大小，页面大小默认10
    function setPageSize(page: number, size: number, total: number) {
        console.log(page, size, total)
        pagination.value.page = page
        pagination.value.size = size
        pagination.value.total = total
    }
    // 设置主题
    function setTheme(isDark: boolean) {
        theme.value.isDark = isDark
    }
    // 更新设置
    function updateSettings(newSettings: any) {
        settings.value = { ...settings.value, ...newSettings }
    }
    // 标记为非首次启动
    function markAsNotFirstLaunch() {
        isFirstLaunch.value = false
    }

    // 返回状态和方法
    return {
        // 搜索结果数据
        searchResultData,
        setSearchResultData,
        // 猫咪位置相关导出
        catLocations,
        setCatLocations,
        // 数据分析相关导出
        catDataAnalysisData,
        setCatDataAnalysis,
        // 资金计算相关导出
        fundCalculateData,
        setFundCalculateData,
        /* ---------------------状态--------------------- */
        postCommentList,
        catCommentList,
        auditCommentList,
        userInfo,
        applyPostList,
        catList,
        postList,
        pagination,
        isFirstLaunch,
        theme,
        settings,
        /* ---------------------方法--------------------- */
        setPostCommentList,
        setCatCommentList,
        setAuditCommentList,
        setApplyPostList,
        setCatList,
        setPostList,
        setPageSize,
        setTheme,
        updateSettings,
        markAsNotFirstLaunch,
        setUserInfo,
        setUserInfoNull,
    }
}) 