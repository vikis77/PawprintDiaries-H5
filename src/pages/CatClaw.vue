<!-- 猫爪页面（第二页）-->
<template>
    <view class="container">
        <view class="layout">

            <!-- 展示卡片信息 -->
            <view class="showCardBox">
                <view class="y0hj0">
                    <!-- 卡片日记 -->
                    <view class="paw">
                        <view class="t89hmm">
                            <uni-section class="m7h9h" title="卡片日记" titleColor="#333" titleFontSize="47rpx"
                                type="line"></uni-section>
                        </view>
                    </view>
                    <!-- 主题部分 -->
                    <view class="y89yh9">
                        <!-- 分段器 -->
                        <view class="th890h0">
                            <uni-segmented-control :current="currentArea" :values="AreaItems" activeColor="#8d5da3"
                                style-type="text" @clickItem="onClickItemArea" />
                        </view>
                        <!-- 分段器内容 -->
                        <view class="tzz876">
                            <!-- 推荐内容（始终显示） -->
                            <view class="t9x">
                                <!-- 卡片循环区域 -->
                                <view class="Cardlist">
                                    <scroll-view class="ta9u0a" scroll-x="true" @scroll="handleScroll"
                                        @touchstart="handleTouchStart" @touchmove="handleTouchMove"
                                        @touchend="handleTouchEnd">
                                        <!-- 刷新图标 -->
                                        <view class="refresh-loading" v-show="translateX > 20">
                                            <uni-icons type="refresh" size="20"
                                                :class="{ 'refresh-rotate': isRefreshing }"></uni-icons>
                                        </view>

                                        <view class="t42f"
                                            :style="{ transform: `translateX(${translateX}px)`, transition: isTransitioning ? 'transform 0.3s ease' : 'none' }">
                                            <!-- 循环展示猫猫卡片 -->
                                            <view class="t2352" v-for="cat in appStore.catList" :key="cat.catId"
                                                @click="handleClickCard(cat.catId)">
                                                <!-- 猫猫头像 -->
                                                <view class="t7908f">
                                                    <image class="img32r"
                                                        :src="`${pic_general_request_url}/cat_avatar/${cat.avatar}`"
                                                        mode="aspectFill"></image>
                                                </view>
                                                <!-- 猫猫信息  -->
                                                <view class="t990k">
                                                    <view class="t5grg3">
                                                        <text class="t2rdf">{{ cat.catname }} - {{ cat.age }}个月 - {{
                                                            cat.gender === 1 ? '雄性' : '雌性' }}</text>
                                                    </view>
                                                </view>
                                                <!-- 分割线 -->
                                                <view class="divider" />
                                                <!-- 互动区域 -->
                                                <view class="interaction-area">
                                                    <text class="preview-text">仅预览</text>
                                                    <view class="interaction-item">
                                                        <uni-icons type="heart" size="18" color="#666"></uni-icons>
                                                        <text>{{ cat.likeCount || 0 }}</text>
                                                    </view>
                                                    <view class="interaction-item">
                                                        <uni-icons type="fire" size="18" color="#ff9c6e"></uni-icons>
                                                        <text>{{ cat.trending || 0 }}</text>
                                                    </view>
                                                    <view class="interaction-item">
                                                        <uni-icons type="chat" size="18" color="#666"></uni-icons>
                                                        <text>{{ cat.comments || 0 }}</text>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </scroll-view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 展示统计信息 -->
            <view class="showStatisticsBox">
                <view class="th0hzf">
                    <uni-card class="tz0v898" margin=0 title="校猫数据统计卡片" :sub-title="nowTime" extra=""
                        thumbnail="../../static/cat-copy.png">
                        <view class="gridbody">
                            <uni-grid class="tyh08hz" :column="3" :square="false" :highlight="false">
                                <uni-grid-item v-for="(item, index) in gridList" :index="index" :key="index"
                                    class="t99zv" @click="showGridDetail(item)">
                                    <view class="grid-item-box"
                                        :class="{ 'grid-item-active': activeGridIndex === index }">
                                        <view class="tzh0h">
                                            <img v-if="item.url !== ''" :src="item.url" class="th80"
                                                mode="aspectFill" />
                                            <text class="tm9q1a">{{ item.data }}</text>
                                        </view>
                                        <text class="grid-item-boxtext">{{ item.text }}</text>
                                        <text class="grid-item-boxtext2">{{ item.text2 }}</text>
                                    </view>
                                </uni-grid-item>
                            </uni-grid>
                        </view>
                    </uni-card>
                </view>

                <view class="tzjhc99">
                    <view class="t9hu9hzz">
                        <uni-segmented-control :style="{ color: '#3a3a3a' }" :current="current" :values="items"
                            style-type="button" activeColor="#2ab3c5" inActiveColor="#ffffff"
                            @clickItem="onClickItem" />
                    </view>
                    <view class="tm80inp">
                        <view v-if="current === 0">
                            <view class="content-text">
                                <!-- 条状图 年龄分布-->
                                <view class="StripDiagram-box">
                                    <qiun-data-charts type="bar" :opts="StripDiagramOpts"
                                        :chartData="StripDiagramData" />
                                </view>
                            </view>
                        </view>
                        <view v-if="current === 1">
                            <view class="content-text">
                                <!-- 折图 数量变化-->
                                <view class="FoldingDiagram-box">
                                    <qiun-data-charts type="line" :opts="FoldingDiagramOpts"
                                        :chartData="FoldingDiagramData" />
                                </view>
                            </view>
                        </view>
                        <view v-if="current === 2">
                            <!-- 饼状图 健康zhuang't -->
                            <view class="Cake-box">
                                <qiun-data-charts type="pie" :opts="CakeOpts" :chartData="CakeData" />
                            </view>
                            <view class="t0h0h00">
                                <text>说明：</text>
                                <text>健康指猫咪各项生理指标正常，没有明显的疾病或不适。</text>
                            </view>
                        </view>
                        <view v-if="current === 3">
                            <!-- 山峰图 区域分布-->
                            <view class="PeakMap-box">
                                <qiun-data-charts type="mount" :opts="PeakMapOpts" :chartData="PeakMapData" />
                            </view>
                        </view>
                        <view v-if="current === 4">
                            <view class="content-text">
                                <!-- 柱形图 其他数据-->
                                <view class="showChartBox">
                                    <qiun-data-charts type="column" :opts="opts" :chartData="chartData" />
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

            </view>

            <!-- 展示捐助、领养区域 -->
            <view class="showDonateBox">
                <view class="donate-popup" v-if="showDonateMenu">
                    <view class="mask" @click="toggleDonateMenu"></view>
                    <view class="donate-section">
                        <view class="donate-card" @click="handleClickAdopt">
                            <img class="card-icon" src="/static/hover.png" mode="aspectFit" />
                            <text class="card-title">我要领养</text>
                            <text class="card-desc">给流浪猫一个温暖的家</text>
                        </view>

                        <view class="donate-card" @click="handleClickDonate">
                            <img class="card-icon" src="/static/donate.png" mode="aspectFit" />
                            <text class="card-title">我要捐赠</text>
                            <text class="card-desc">为流浪猫献上一份爱心</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 领养弹窗 -->
            <uni-popup ref="popupAdopt" type="center">
                <view class="popup-box">
                    <view class="popup-title">领养申请</view>
                    <view class="form-content">
                        <uni-forms :model="adoptFormsData">
                            <uni-forms-item label="您想领养的猫咪？" required labelWidth="70">
                                <uni-data-select v-model="adoptFormsData.catName" :localdata="catSelectList"
                                    placeholder="请选择想领养的猫咪" @change="handleCatSelect" />
                            </uni-forms-item>
                            <uni-forms-item label="您的姓名" required label-width="70">
                                <uni-easyinput v-model="adoptFormsData.name" placeholder="" />
                            </uni-forms-item>
                            <uni-forms-item label="您的班级" required label-width="70">
                                <uni-easyinput v-model="adoptFormsData.class" placeholder="" />
                            </uni-forms-item>
                            <uni-forms-item label="您的籍贯" required label-width="70">
                                <uni-easyinput v-model="adoptFormsData.origin" placeholder="" />
                            </uni-forms-item>
                            <uni-forms-item label="手机号码" required label-width="70">
                                <uni-easyinput v-model="adoptFormsData.phone" placeholder="" />
                            </uni-forms-item>
                            <uni-forms-item label="微信号" required label-width="70">
                                <uni-easyinput v-model="adoptFormsData.wechat" placeholder="" />
                            </uni-forms-item>
                        </uni-forms>
                    </view>
                    <view class="popup-buttons">
                        <button class="btn-cancel" @click="closeAdoptPopup">取消</button>
                        <button class="btn-submit" @click="submitAdoptForm">提交</button>
                    </view>
                </view>
            </uni-popup>

            <!-- 捐赠弹窗 -->
            <uni-popup ref="popupDonate" type="center">
                <view class="popup-box">
                    <view class="popup-title">爱心捐赠</view>
                    <view class="qr-content">
                        <view class="qr-item">
                            <text class="qr-title">微信支付</text>
                            <img class="qr-image" src="../../static/cat.png" mode="aspectFit" />
                        </view>
                        <view class="qr-item">
                            <text class="qr-title">支付宝</text>
                            <img class="qr-image" src="../../static/cat.png" mode="aspectFit" />
                        </view>
                    </view>
                    <view class="donate-note">
                        <text>说明：</text>
                        <text>1. 您的每一笔捐赠都将用于校园日常护理</text>
                        <text>2. 资金使用情况将定期公示</text>
                        <text>3. 感谢您的爱心支持</text>
                    </view>
                    <view class="popup-buttons">
                        <button class="btn-cancel" @click="closeDonatePopup">关闭</button>
                    </view>
                </view>
            </uni-popup>

            <!-- 添加统计信息详情弹窗 -->
            <uni-popup ref="gridDetailPopup" type="center">
                <view class="grid-detail-popup">
                    <view class="popup-header">
                        <text class="title">{{ selectedGrid.text }}</text>
                        <uni-icons type="closeempty" size="24" color="#666" @click="closeGridDetail"></uni-icons>
                    </view>
                    <view class="popup-content">
                        <!-- <view class="detail-icon"> -->
                        <!-- <image :src="selectedGrid.url" mode="aspectFit"></image> -->
                        <!-- </view> -->
                        <view class="detail-info">
                            <view class="detail-number">
                                <text class="number">{{ selectedGrid.data }}</text>
                                <text class="unit">{{ selectedGrid.text2 }}</text>
                            </view>
                            <view class="detail-description">
                                <text>{{ getDetailDescription(selectedGrid) }}</text>
                            </view>
                        </view>
                        <view class="detail-chart" v-if="selectedGrid.chartData">
                            <qiun-data-charts type="line" :opts="selectedGrid.chartOpts"
                                :chartData="selectedGrid.chartData" />
                        </view>
                    </view>
                </view>
            </uni-popup>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
import { toBeDeveloped, showToast } from '@/src/utils/toast'
// import { getCatInfoDetail, getCatAnalyseData } from '@/src/api/post'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

// 添加一个全局变量来标记是否从Card页面返回
const isFromCard = ref(false);
const cover = "../../static/xxavatar1.jpg"
const nowTime = ref('')
const gridList = ref([])
const CardlistAllDynamicWidth = ref(0)
// 存储猫猫列表
const catList = ref([]);
const catList2 = ref(null);
const catList3 = ref(null);
const catDataAnalysisData = ref({
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
});
const popupAdopt = ref(null)
const popupDonate = ref(null)
// 添加猫咪选择列表数据
const catSelectList = ref([]);
const adoptFormsData = ref({
    catName: '',
    name: '',
    class: '',
    origin: '',
    phone: '',
    wechat: ''
});
// 柱形图图表数据 其他数据
const chartData = ref({});
const opts = {
    color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
    padding: [15, 15, 0, 5],
    enableScroll: false,
    legend: {},
    xAxis: {
        disableGrid: true
    },
    yAxis: {
        data: [
            {
                min: 0
            }
        ]
    },
    extra: {
        column: {
            type: "group",
            width: 30,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08,
            linearType: "opacity", //渐变类型，可选值："none"关闭渐变,"opacity"透明渐变,"custom"自定义颜色
            seriesGap: 5, // 多series每个柱子之间的间距
            linearOpacity: 0.5, // 透明渐变的透明度（值范围0到1，值越小越透明）
            barBorderCircle: true, // 启用组柱状图半圆边框，
            customColor: [
                "#FA7D8D",
                "#EB88E2"
            ]
        }
    }
};


// 猫猫卡片的分段器
const currentArea = ref(0)
const AreaItems = ref(['推荐', '全部', '捐赠/领养'])

// 猫猫卡片的分段器处理点击事件
const onClickItemArea = (indexObj) => {
    if (indexObj.currentIndex === 2) { // 点击"捐赠/领养"
        showDonateMenu.value = true;
    } else if (indexObj.currentIndex === 1) { // 点击"全部"
        // 获取第一只猫的ID作为默认值
        const defaultCatId = catList.value.length > 0 ? catList.value[0].catId : '';
        uni.navigateTo({
            url: `CatManage?catId=${defaultCatId}&from=catclaw`
        });
    }
    currentArea.value = indexObj.currentIndex;
}

// 数据分析的分段器
const current = ref(0)  // 当前选中的选项卡索引
const items = ref(['年龄分布', '数量变化', '健康状态', '区域分布', '其他数据'])  // 选项卡内容
// const styleType = ref('default')  // 设置样式类型
// const activeColor = ref('#007aff')  // 选中时的颜色

// 处理点击事件
const onClickItem = (indexObj) => {
    // console.log(indexObj.currentIndex)
    current.value = indexObj.currentIndex
}

// 折线图 总数量变化
const FoldingDiagramData = ref({});
const FoldingDiagramOpts = {
    color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
    padding: [15, 10, 0, 15],
    enableScroll: false,
    legend: {},
    xAxis: {
        disableGrid: true
    },
    yAxis: {
        gridType: "dash",
        dashLength: 2
    },
    extra: {
        line: {
            type: "straight",
            width: 2,
            activeType: "hollow"
        }
    },
}
let FoldingDiagramDataDetail = {
    categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
    series: [
        {
            name: "校内小猫总数量变化",
            data: [25, 28, 25, 17, 24, 20]
        }]
};
FoldingDiagramData.value = JSON.parse(JSON.stringify(FoldingDiagramDataDetail));

// 条状图 年龄分布
const StripDiagramData = ref({})
const StripDiagramOpts = {
    color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
    padding: [15, 30, 0, 5],
    enableScroll: false,
    legend: {},
    xAxis: {
        boundaryGap: "justify",
        disableGrid: false,
        min: 0,
        axisLine: false,
        max: 15
    },
    yAxis: {},
    extra: {
        bar: {
            type: "stack",
            width: 30,
            meterBorde: 1,
            meterFillColor: "#FFFFFF",
            activeBgColor: "#000000",
            activeBgOpacity: 0.08,
            categoryGap: 2
        }
    }
}

// 饼状图 康状态
const CakeData = ref({})
const CakeOpts = {
    color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
    padding: [5, 5, 5, 5],
    enableScroll: false,
    extra: {
        pie: {
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
            borderColor: "#FFFFFF",
            linearType: "custom"
        }
    }
}

// 山峰图 区域分布
const PeakMapData = ref({})
const PeakMapOpts = {
    color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
    padding: [15, 15, 0, 5],
    enableScroll: false,
    legend: {},
    xAxis: {
        disableGrid: true
    },
    yAxis: {
        data: [
            {
                min: 0
            }
        ]
    },
    extra: {
        mount: {
            type: "sharp",
            widthRatio: 1.5
        }
    }
}

// 定义函数来获取当前时间并更新
function getNowTimeDate() {
    const updateTime = () => {
        const date = new Date()
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份从 0 开始，所以 +1
        const day = date.getDate().toString().padStart(2, '0')
        const hour = date.getHours().toString().padStart(2, '0')
        const minute = date.getMinutes().toString().padStart(2, '0')
        const second = date.getSeconds().toString().padStart(2, '0')

        nowTime.value = `当前时间：${year}年${month}月${day}日 ${hour}:${minute}:${second}`
    }

    updateTime() // 初次调用以获取当前时间
    return setInterval(updateTime, 1000) // 每秒更新一次时间
}


let timer = null

// 首次页面加载时开始更新时间
onMounted(() => {
    timer = getNowTimeDate()
})

// 每次页面加载时
onShow(() => {
    // 确保每次显示页面时分段器都在推荐状态
    currentArea.value = 0;

    // 如果是从Card页面返回
    if (isFromCard.value) {
        isFromCard.value = false;  // 重置标记
        console.log('从Card页面返回，不重新获取数据');
        return;
    }

    // 其他情况，获取猫猫数据
    console.log('不是从Card页面返回，获取猫猫数据');
    fetchCatData(); // 获取猫猫数据（全局方法）
    fetchDataAnalysis(); // 获取数据分析数据
})

// 页面卸载时清除定时器
onUnmounted(() => {
    clearInterval(timer)
})

// 获取猫猫数据的方法
async function fetchCatData() {
    // 调用全局请求小猫方法
    await getCatInfoDetail()
    catList.value = appStore.catList;  // 将API返回的数据赋值给catList
    // 处理猫咪选择列表数据
    catSelectList.value = catList.value.map(cat => ({
        value: cat.catname,
        text: `${cat.catname} - ${cat.gender === 1 ? '公' : '母'} - ${cat.age}个月`
    }));
    gridList.value = [{
        url: '../../static/cat.png',
        data: catList.value.length,
        text: '在校小猫数量',
        text2: '（只）',
        badge: '0',
        type: "primary"
    },
    {
        url: '/static/adopt.png',
        text: '已领养数量',
        data: catDataAnalysisData.value.adoptionCount || 0,
        text2: '（只）',
        badge: '1',
        type: "success"
    },
    {
        url: '/static/default-avatar-1.png',
        text: '已绝育数量',
        data: catDataAnalysisData.value.sterilizationRatio['已绝育'] || 0,
        text2: '（只）',
        badge: '99',
        type: "warning"
    },
    {
        url: '/static/syringe.png',
        text: '已打疫苗',
        data: catDataAnalysisData.value.vaccinationRatio['已接种'] || 0,
        text2: '（只）',
        badge: '2',
        type: "error"
    },
    {
        url: '/static/left1-copy.png',
        text: '健康数量',
        data: catDataAnalysisData.value.healthStatus['健康'] || 0,
        text2: '（只）'
    },
    {
        url: '/static/bell.png',
        text: '本月新增',
        data: catDataAnalysisData.value.monthlyNewCount || 0,
        text2: '（只）'
    },
    {
        url: '../../static/fund.png',
        data: catDataAnalysisData.value.fundBalance || 0,
        text: '救助资金剩余',
        text2: '（元）'
    },
    {
        url: '../../static/expense.png',
        data: catDataAnalysisData.value.lastMonthExpense || 0,
        text: '上月支出',
        text2: '（元）'
    },
    {
        url: '../../static/income.png',
        data: catDataAnalysisData.value.lastMonthIncome || 0,
        text: '上月收入',
        text2: '（元）'
    }]
}

// 在 script setup 中添加动画相关的代码
const animateValue = (start, end, duration, callback) => {
    // 确保start和end是有效的数字
    start = Number(start) || 0;
    end = Number(end) || 0;

    // 如果开始值等于结束值，直接调用回调
    if (start === end) {
        callback(end);
        return;
    }

    const range = end - start;
    const minTimer = 50;
    const stepTime = Math.abs(Math.floor(duration / range));
    const timer = Math.max(stepTime, minTimer);
    let current = start;
    const step = Math.floor(range / (duration / timer)) || 1; // 确保step至少为1

    const handle = setInterval(() => {
        current += step;
        if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
            clearInterval(handle);
            callback(end);
        } else {
            callback(current);
        }
    }, timer);
};

// 添加全局辅助函数
const ensureNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
};

// 获取猫爪页面数据分析数据
const fetchDataAnalysis = async () => {
    const appStore = useAppStore()
    await uni.request({
        url: `${API_general_request_url.value}/api/cat/analysis`,
        method: 'GET',
        success: (res) => {
            console.log(res)
            if (res.statusCode === 200 && res.data.code === '2000') {
                const newData = res.data.data;

                // 为每个统计数据添加动画效果
                gridList.value.forEach((item, index) => {
                    let targetValue = 0;

                    switch (index) {
                        case 0:
                            targetValue = ensureNumber(catList.value?.length);
                            break;
                        case 1:
                            targetValue = ensureNumber(newData?.adoptionCount);
                            break;
                        case 2:
                            targetValue = ensureNumber(newData?.sterilizationRatio?.['已绝育']);
                            break;
                        case 3:
                            targetValue = ensureNumber(newData?.vaccinationRatio?.['已接种']);
                            break;
                        case 4:
                            targetValue = ensureNumber(newData?.healthStatus?.['健康']);
                            break;
                        case 5:
                            targetValue = ensureNumber(newData?.monthlyNewCount);
                            break;
                        case 6:
                            targetValue = ensureNumber(newData?.fundBalance);
                            break;
                        case 7:
                            targetValue = ensureNumber(newData?.lastMonthExpense);
                            break;
                        case 8:
                            targetValue = ensureNumber(newData?.lastMonthIncome);
                            break;
                    }

                    // 执行动画，从0到目标值
                    animateValue(0, targetValue, 1000, (value) => {
                        gridList.value[index].data = Math.floor(value);
                    });
                });

                // 更新其他图表数据
                catDataAnalysisData.value = {
                    adoptionCount: ensureNumber(newData?.adoptionCount),
                    sterilizationRatio: {
                        '已绝育': ensureNumber(newData?.sterilizationRatio?.['已绝育']),
                        '未绝育': ensureNumber(newData?.sterilizationRatio?.['未绝育'])
                    },
                    vaccinationRatio: {
                        '已接种': ensureNumber(newData?.vaccinationRatio?.['已接种']),
                        '未接种': ensureNumber(newData?.vaccinationRatio?.['未接种'])
                    },
                    healthStatus: {
                        '健康': ensureNumber(newData?.healthStatus?.['健康']),
                        '疾病': ensureNumber(newData?.healthStatus?.['疾病']),
                        '营养不良': ensureNumber(newData?.healthStatus?.['营养不良']),
                        '肥胖': ensureNumber(newData?.healthStatus?.['肥胖'])
                    },
                    monthlyNewCount: ensureNumber(newData?.monthlyNewCount),
                    fundBalance: ensureNumber(newData?.fundBalance),
                    lastMonthExpense: ensureNumber(newData?.lastMonthExpense),
                    lastMonthIncome: ensureNumber(newData?.lastMonthIncome),
                    ageDistribution: {
                        "3个月以内": ensureNumber(newData?.ageDistribution?.["3个月以内"]),
                        "3-6个月": ensureNumber(newData?.ageDistribution?.["3-6个月"]),
                        "6-12个月": ensureNumber(newData?.ageDistribution?.["6-12个月"]),
                        "12-18个月": ensureNumber(newData?.ageDistribution?.["12-18个月"]),
                        "18-24个月": ensureNumber(newData?.ageDistribution?.["18-24个月"]),
                        "24个月以上": ensureNumber(newData?.ageDistribution?.["24个月以上"])
                    },
                    areaDistribution: {
                        '北门': ensureNumber(newData?.areaDistribution?.['北门']),
                        '岐头': ensureNumber(newData?.areaDistribution?.['岐头']),
                        '凤翔': ensureNumber(newData?.areaDistribution?.['凤翔']),
                        '厚德楼': ensureNumber(newData?.areaDistribution?.['厚德楼']),
                        '香晖苑': ensureNumber(newData?.areaDistribution?.['香晖苑'])
                    }
                };

                // 更新年龄分布数据
                let tripDiagramDataDetail = {
                    categories: ["3个月以内", "3-6个月", "6-12个月", "12-18个月", "18-24个月", "24个月以上"],
                    series: [{
                        name: "校内小猫年龄分布",
                        data: [
                            ensureNumber(newData?.ageDistribution?.["3个月以内"]),
                            ensureNumber(newData?.ageDistribution?.["3-6个月"]),
                            ensureNumber(newData?.ageDistribution?.["6-12个月"]),
                            ensureNumber(newData?.ageDistribution?.["12-18个月"]),
                            ensureNumber(newData?.ageDistribution?.["18-24个月"]),
                            ensureNumber(newData?.ageDistribution?.["24个月以上"])
                        ]
                    }]
                };
                StripDiagramData.value = JSON.parse(JSON.stringify(tripDiagramDataDetail));

                // 更新健康状态数据
                let CakeDataDetail = {
                    series: [{
                        data: [
                            { "name": "健康", "value": ensureNumber(newData?.healthStatus?.['健康']), "labelText": `健康:${ensureNumber(newData?.healthStatus?.['健康'])}只` },
                            { "name": "疾病", "value": ensureNumber(newData?.healthStatus?.['疾病']), "labelText": `疾病:${ensureNumber(newData?.healthStatus?.['疾病'])}只` },
                            { "name": "营养不良", "value": ensureNumber(newData?.healthStatus?.['营养不良']), "labelText": `营养不良:${ensureNumber(newData?.healthStatus?.['营养不良'])}只` },
                            { "name": "肥胖", "value": ensureNumber(newData?.healthStatus?.['肥胖']), "labelText": `肥胖:${ensureNumber(newData?.healthStatus?.['肥胖'])}只` }
                        ]
                    }]
                };
                CakeData.value = JSON.parse(JSON.stringify(CakeDataDetail));

                // 更新区域分布数据
                let PeakMapDataDetail = {
                    series: [{
                        data: [
                            { "name": "北门", "value": ensureNumber(newData?.areaDistribution?.['北门']) },
                            { "name": "岐头", "value": ensureNumber(newData?.areaDistribution?.['岐头']) },
                            { "name": "凤翔", "value": ensureNumber(newData?.areaDistribution?.['凤翔']) },
                            { "name": "厚德楼", "value": ensureNumber(newData?.areaDistribution?.['厚德楼']) },
                            { "name": "香晖苑", "value": ensureNumber(newData?.areaDistribution?.['香晖苑']) }
                        ]
                    }]
                };
                PeakMapData.value = JSON.parse(JSON.stringify(PeakMapDataDetail));

                // 更新其他数据图表
                let chartsDataDetail = {
                    categories: ["性别", "", "是否绝育", "", "是否打疫苗", ""],
                    series: [
                        {
                            name: "公猫/已绝育/已打疫苗",
                            data: [
                                ensureNumber(newData?.genderRatio?.['公猫']), ,
                                ensureNumber(newData?.sterilizationRatio?.['已绝育']), ,
                                ensureNumber(newData?.vaccinationRatio?.['已接种']),
                            ]
                        },
                        {
                            name: "雌性/未绝育/未打疫苗",
                            data: [
                                ensureNumber(newData?.genderRatio?.['母猫']), ,
                                ensureNumber(newData?.sterilizationRatio?.['未绝育']), ,
                                ensureNumber(newData?.vaccinationRatio?.['未接种']),
                            ]
                        }
                    ]
                };
                chartData.value = JSON.parse(JSON.stringify(chartsDataDetail));

            } else {
                uni.showToast({
                    title: res.data.msg,
                    icon: 'none'
                });
            }
        },
        fail: (err) => {
            uni.showToast({
                title: '获取数据分析数据失败 ' + err,
                icon: 'none'
            });
        }
    });
}



// 点击卡片时跳转，传递catId给卡片页面
function handleClickCard(catId) {
    isFromCard.value = true;  // 设置标记
    uni.navigateTo({
        url: `Card?catId=${catId}`
    })
}

// 添加关闭弹出菜单的函数
function toggleDonateMenu() {
    showDonateMenu.value = false;
    currentArea.value = 0;
}

// 修改领养和捐赠按钮的点击处理
const handleClickAdopt = () => {
    showDonateMenu.value = false;
    currentArea.value = 0;
    popupAdopt.value.open();
};

const handleClickDonate = () => {
    showDonateMenu.value = false;
    currentArea.value = 0;
    popupDonate.value.open();
};


const showDonateMenu = ref(false);

// 添加统一的弹窗关闭处理方法
const handlePopupClose = () => {
    if (popupAdopt.value) {
        popupAdopt.value.close();
    }
    if (popupDonate.value) {
        popupDonate.value.close();
    }
};

// 监听分段器重置事件
onMounted(() => {
    // uni.$on('updateSegmentedControl', () => {
    // 	nextTick(() => {
    // 		currentArea.value = 0;
    // 	});
    // });
})

// 组件卸载时移除事件监听
onUnmounted(() => {
    // uni.$off('updateSegmentedControl');
})

// 关闭弹窗
const closeAdoptPopup = () => {
    popupAdopt.value.close();
    showDonateMenu.value = false;
    currentArea.value = 0;
    // 清空表单
    adoptFormsData.value = {
        catName: '',
        name: '',
        class: '',
        origin: '',
        phone: '',
        wechat: ''
    };
}

const closeDonatePopup = () => {
    popupDonate.value.close();
    showDonateMenu.value = false;
    currentArea.value = 0;
}

// 提交领养表单
const submitAdoptForm = () => {
    // 验证表单是否填写完整
    if (!adoptFormsData.value.catName ||
        !adoptFormsData.value.name ||
        !adoptFormsData.value.class ||
        !adoptFormsData.value.origin ||
        !adoptFormsData.value.phone ||
        !adoptFormsData.value.wechat) {
        uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
        })
        return
    }

    // 发送领养申请
    uni.request({
        url: `${API_general_request_url.value}/adopt/apply`,
        method: 'POST',
        data: adoptFormsData.value,
        success: (res) => {
            if (res.data.code === 200) {
                uni.showToast({
                    title: '申请提交成功',
                    icon: 'success'
                })
                closeAdoptPopup()
            } else {
                uni.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
        },
        fail: (err) => {
            uni.showToast({
                title: '提交失败，请稍后重试',
                icon: 'none'
            })
        }
    })
}

// 添加猫咪选择列表数据
const handleCatSelect = (value) => {
    adoptFormsData.value.catName = value;
}

const gridDetailPopup = ref(null);
const selectedGrid = ref({});
const activeGridIndex = ref(-1);

// 显示格子详情
const showGridDetail = (item) => {
    selectedGrid.value = item;
    // 根据不同类型添加趋势数据
    switch (item.text) {
        case '在校小猫数量':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "校内小猫总数量",
                    data: [25, 28, 25, 17, 24, 20]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#1890FF"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: {
                    line: {
                        type: "straight",
                        width: 2,
                        activeType: "hollow"
                    }
                }
            };
            break;
        case '已领养数量':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "每月领养数量",
                    data: [2, 3, 4, 2, 5, 3]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#91CB74"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: { line: { type: "curve", width: 2 } }
            };
            break;
        case '已绝育数量':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "累计绝育数量",
                    data: [8, 10, 12, 15, 18, 20]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#FAC858"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: { line: { type: "straight", width: 2 } }
            };
            break;
        case '已打疫苗':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "累计接种数量",
                    data: [5, 8, 12, 14, 16, 18]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#EE6666"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: { line: { type: "straight", width: 2 } }
            };
            break;
        case '健康数量':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "健康猫咪数量",
                    data: [15, 18, 16, 14, 19, 17]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#73C0DE"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: { line: { type: "curve", width: 2 } }
            };
            break;
        case '本月新增':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "每月新增数量",
                    data: [3, 4, 2, 5, 3, 4]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#3CA272"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: { line: { type: "straight", width: 2 } }
            };
            break;
        case '救助资金剩余':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "资金余额变化",
                    data: [5000, 4500, 6000, 5500, 7000, 6500]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#FC8452"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: { line: { type: "curve", width: 2 } }
            };
            break;
        case '上月支出':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "月度支出",
                    data: [1200, 1500, 1000, 1800, 1300, 1600]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#9A60B4"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: { line: { type: "straight", width: 2 } }
            };
            break;
        case '上月收入':
            selectedGrid.value.chartData = {
                categories: ["5月", "6月", "7月", "8月", "9月", "10月"],
                series: [{
                    name: "月度收入",
                    data: [2000, 2500, 1800, 2800, 2300, 2600]
                }]
            };
            selectedGrid.value.chartOpts = {
                color: ["#ea7ccc"],
                padding: [15, 10, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: { disableGrid: true },
                yAxis: { gridType: "dash", dashLength: 2 },
                extra: { line: { type: "curve", width: 2 } }
            };
            break;
    }
    gridDetailPopup.value.open();
};

// 关闭格子详情
const closeGridDetail = () => {
    gridDetailPopup.value.close();
    activeGridIndex.value = -1;
};

// 获取详细描述
const getDetailDescription = (grid) => {
    switch (grid.text) {
        case '在校小猫数量':
            return '这是目前在校园内生活的所有猫咪数量。从趋势图可以看出，数量基本保持稳定，略有波动。';
        case '已领养数量':
            return '这是通过我们平台成功找到新家的猫咪数量。每月平均有3-4只猫咪被领养。';
        case '已绝育数量':
            return '这是已经完成绝育手术的猫咪数量。可以看到绝育数量在稳步增加，这对控制流浪猫数量很有帮助。';
        case '已打疫苗':
            return '这是已经接种疫苗的猫咪数量。疫苗接种率持续提升，有效预防了传染病的发生。';
        case '健康数量':
            return '这是目前身体状况良好的猫咪数量。通过定期体检和及时治疗，保持了较高的健康比例。';
        case '本月新增':
            return '这是每月新登记的猫咪数量。新增数量保持在合理范围内，便于管理和照顾。';
        case '救助资金剩余':
            return '这是目前救助基金的余额。资金状况总体良好，可以保证猫咪们得到妥善照顾。';
        case '上月支出':
            return '这是每月用于猫咪护理的支出，包括食物、医疗、绝育手术等费用。支出合理且透明。';
        case '上月收入':
            return '这是每月收到的爱心捐赠。感谢大家的持续支持，使我们能够为猫咪提供更好的照顾。';
        default:
            return '';

    }
};

// 添加滑动相关变量
const touchStartX = ref(0);
const touchMoveX = ref(0);
const translateX = ref(0);
const isRefreshing = ref(false);
const isTransitioning = ref(false);
const scrollLeft = ref(0);

// 监听滚动事件
const handleScroll = (e) => {
    scrollLeft.value = e.detail.scrollLeft;
};

// 处理触摸开始
const handleTouchStart = (event) => {
    if (isRefreshing.value) return;
    touchStartX.value = event.touches[0].clientX;
    isTransitioning.value = false;
};

// 处理触摸移动
const handleTouchMove = (event) => {
    if (isRefreshing.value) return;

    const currentX = event.touches[0].clientX;
    const diffX = currentX - touchStartX.value;

    // 只有在滚动到最左侧时才允许右滑
    if (diffX > 0 && scrollLeft.value === 0) {
        translateX.value = Math.min(diffX * 0.5, 100); // 添加阻尼效果
    }
};

// 处理触摸结束
const handleTouchEnd = (event) => {
    if (isRefreshing.value) return;

    const endX = event.changedTouches[0].clientX;
    const diffX = endX - touchStartX.value;

    isTransitioning.value = true;

    // 只有在最左侧且滑动距离足够时才触发刷新
    if (diffX > 50 && scrollLeft.value === 0) {
        refreshCatList();
    } else {
        // 否则回弹
        translateX.value = 0;
    }
};

// 修改刷新方法
const refreshCatList = () => {
    if (isRefreshing.value) return;

    fetchCatData(); // 获取新的猫猫数据

    isRefreshing.value = true;
    uni.vibrateShort(); // 添加触感反馈

    // 设置刷新时的固定位置
    translateX.value = 60;

    // 使用Fisher-Yates洗牌算法随机打乱数组
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // 创建数组副本并打乱顺序
    const shuffledList = shuffleArray([...appStore.catList]);

    // 延迟更新列表，让动画有时间播放
    setTimeout(() => {
        // 重置位置
        translateX.value = 0;

        // 更新列表
        appStore.setCatList(shuffledList);

        // 显示刷新提示
        // uni.showToast({
        // 	title: '刷新成功',
        // 	icon: 'success',
        // 	duration: 1500
        // });

        // 重置刷新状态
        setTimeout(() => {
            isRefreshing.value = false;
        }, 500);
    }, 800);
};


</script>

<style lang="scss" scoped>
// 隐藏scroll-view默认滚动条
scroll-view ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
}

.container {
    width: 750rpx;

    .layout {
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #e9e9fa, #e6f2ff);

        .showCardBox {
            width: 675rpx;
            height: 680rpx;
            margin-left: 20rpx;
            margin-top: 20rpx;
            padding: 20rpx;
            border-radius: 10rpx;
            background-color: #ffffff;
            box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
            border: 0.666667rpx solid #EBEEF5;
            overflow: hidden;

            .y0hj0 {
                width: 100%;
                height: 100%;
                border-radius: 20rpx;
                box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2);
                overflow: hidden;

                .paw {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    background-color: #a0a0f0;
                    padding: 20rpx;
                    overflow: hidden;

                    .t89hmm {
                        .m7h9h {
                            background: rgba(255, 255, 255, 0);
                        }
                    }
                }

                .y89yh9 {
                    width: 100%;
                    border-radius: 10rpx;
                    margin-top: 15rpx;
                    background-color: #ffffff;

                    .th890h0 {
                        width: 100%;
                        height: 100rpx;
                    }

                    .tzz876 {
                        width: 100%;

                        .t9x {
                            width: 100%;
                            height: 100%;

                            .Cardlist {
                                width: 100%;
                                height: 400rpx;
                                background-image: "";

                                .ta9u0a {
                                    width: 100%;
                                    height: 400rpx;
                                    overflow-x: auto;

                                    .t42f {
                                        height: 100%;
                                        display: flex;
                                        flex-wrap: nowrap;

                                        .t2352:first-child {
                                            margin-left: 10rpx;
                                        }

                                        .t2352 {
                                            width: 300rpx;
                                            height: 350rpx;
                                            margin-top: 20rpx;
                                            background-color: #fafafa;
                                            align-items: center;
                                            justify-content: center;
                                            display: flex;
                                            margin-right: 20rpx;
                                            flex-direction: column;
                                            border: 1rpx solid #dadada;
                                            border-radius: 20rpx;
                                            box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.2);
                                            background: linear-gradient(to bottom, #e9e9fa, #e6f2ff);

                                            .t7908f {
                                                width: 300rpx;
                                                height: 225rpx;

                                                .img32r {
                                                    width: 90%;
                                                    height: 90%;
                                                    border-radius: 20rpx;
                                                    margin-left: 14rpx;
                                                    margin-top: 10rpx;
                                                }
                                            }

                                            .t990k {
                                                width: 100%;
                                                height: 70rpx;
                                                text-align: center;
                                                overflow: hidden;

                                                .t5grg3 {
                                                    padding-left: 20rpx;
                                                    padding-right: 20rpx;

                                                    .t2rdf {
                                                        width: 100%;
                                                        height: 100%;
                                                        font-size: 26rpx;
                                                        overflow: hidden;
                                                        display: -webkit-box;
                                                        -webkit-box-orient: vertical;
                                                        -webkit-line-clamp: 2;
                                                        text-overflow: ellipsis;
                                                        word-break: break-word;
                                                    }
                                                }
                                            }

                                            .divider {
                                                background: #E0E3DA;
                                                width: 90%;
                                                height: 2rpx;
                                                justify-content: center;
                                            }

                                            .interaction-area {
                                                width: 100%;
                                                height: 53rpx;
                                                display: flex;
                                                align-items: center;
                                                justify-content: space-around;
                                                padding: 0 20rpx;

                                                .interaction-item {
                                                    display: flex;
                                                    align-items: center;
                                                    gap: 8rpx;

                                                    text {
                                                        color: #666;
                                                        font-size: 24rpx;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        .showStatisticsBox {
            width: 95%;
            height: 1750rpx;
            margin-left: 20rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Arial', sans-serif;

            .th0hzf {
                width: 100%;
                height: 750rpx;
                margin-bottom: 36rpx;
                box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
                border: 0.666667rpx solid #EBEEF5;

                .tyh08hz {
                    width: 100%;
                    height: 100%;

                    .t99zv {
                        width: 33%;
                        height: 200rpx;

                        .grid-item-box {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                            transition: all 0.3s ease;

                            &:active,
                            &.grid-item-active {
                                transform: scale(0.95);
                                background-color: rgba(0, 0, 0, 0.05);
                            }

                            .tzh0h {
                                display: flex;
                                align-items: center;
                                justify-content: center;

                                .th80 {
                                    width: 50rpx;
                                    height: 50rpx;
                                }

                                .tm9q1a {
                                    font-size: 60rpx;
                                    color: #b876d9;
                                }
                            }

                            .grid-item-boxtext {
                                font-size: 25rpx;
                                color: #aca4a5;
                            }

                            .grid-item-boxtext2 {
                                font-size: 25rpx;
                                color: #aca4a5;
                            }
                        }
                    }
                }
            }

            .tzjhc99 {
                width: 100%;
                height: 900rpx;
                background-color: #ffffff;
                border-radius: 4rpx;
                box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
                border: 0.666667rpx solid #EBEEF5;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .t9hu9hzz {
                    width: 90%;
                    height: 100rpx;
                }

                .tm80inp {
                    width: 90%;
                    height: 600rpx;

                    .showChartBox {
                        width: 100%;
                        height: 600rpx;
                    }

                    .FoldingDiagram-box {
                        width: 100%;
                        height: 600rpx;
                    }

                    .StripDiagram-box {
                        width: 100%;
                        height: 600rpx;
                    }

                    .Cake-box {
                        width: 100%;
                        height: 600rpx;
                    }

                    .t0h0h00 {
                        width: 80%;
                        height: 100rpx;
                        font-size: 26rpx;
                    }

                    .PeakMap-box {
                        height: 600rpx;
                    }
                }
            }
        }

        .showDonateBox {
            // width: 95%;
            // margin: 20rpx auto;
            // padding: 30rpx;
            // background: #fff;
            // border-radius: 20rpx;
            // box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);

            .donate-popup {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;

                .mask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                }

                .donate-section {
                    position: relative;
                    z-index: 1001;
                    display: flex;
                    gap: 40rpx;
                    padding: 40rpx;
                    animation: slideUp 0.3s ease-out;

                    .donate-card {
                        width: 300rpx;
                        height: 360rpx;
                        background-color: #fff;
                        border-radius: 20rpx;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 20rpx;
                        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s;

                        &:active {
                            transform: scale(0.98);
                        }

                        .card-icon {
                            width: 120rpx;
                            height: 120rpx;
                        }

                        .card-title {
                            font-size: 32rpx;
                            font-weight: 600;
                            color: #333;
                        }

                        .card-desc {
                            font-size: 24rpx;
                            color: #666;
                            text-align: center;
                            padding: 0 20rpx;
                        }
                    }
                }
            }
        }
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(60rpx);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.popup-content {
    border-radius: 24rpx 24rpx 0 0;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;

    .popup-header {
        position: relative;
        padding: 32rpx;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;

        .popup-title {
            font-size: 32rpx;
            font-weight: 600;
            color: #333;
        }

        .popup-close {
            position: absolute;
            right: 32rpx;
            top: 50%;
            transform: translateY(-50%);
            padding: 12rpx;

            &:active {
                background-color: #f5f5f5;
                border-radius: 50%;
            }
        }
    }

    .form-scroll {
        max-height: 60vh;
        padding: 32rpx;
        background-color: #fff;
    }

    .form-group {
        :deep(.uni-forms-item) {
            margin-bottom: 32rpx;

            .uni-forms-item__label {
                font-size: 28rpx;
                color: #333;
                margin-bottom: 12rpx;

                .is-required {
                    color: #ff5a5f;
                }
            }

            .custom-input {
                background-color: #f8f9fa;
                border-radius: 12rpx;

                .uni-easyinput__content {
                    min-height: 88rpx;
                    padding: 0 24rpx;
                }

                input {
                    font-size: 28rpx;
                    color: #333;
                }
            }
        }
    }

    .form-footer {
        padding: 32rpx;
        border-top: 1px solid #f0f0f0;
        background-color: #fff;

        .submit-btn {
            width: 100%;
            height: 88rpx;
            background: linear-gradient(45deg, #8d5da3, #b876d9);
            border-radius: 44rpx;
            color: #fff;
            font-size: 32rpx;
            font-weight: 500;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;

            &:active {
                opacity: 0.9;
            }
        }
    }
}

.container {
    width: 750rpx;

    .layout {
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #e9e9fa, #e6f2ff);

        // ... 其他现有样式 ...

        // 添加弹窗样式
        .popup-box {
            background-color: #ffffff;
            border-radius: 20rpx;
            width: 650rpx;
            padding: 30rpx;

            .popup-title {
                font-size: 32rpx;
                font-weight: bold;
                text-align: center;
                margin-bottom: 30rpx;
                color: #333333;
            }

            .form-content {
                margin-bottom: 30rpx;

                .uni-forms-item {
                    margin-bottom: 20rpx;

                    .uni-forms-item__label {
                        font-size: 28rpx;
                        color: #333333;
                    }

                    .uni-easyinput__content {
                        height: 80rpx;
                        background-color: #f8f9fa;
                        border-radius: 12rpx;
                    }
                }
            }

            .qr-content {
                display: flex;
                justify-content: space-around;
                margin: 30rpx 0;

                .qr-item {
                    text-align: center;

                    .qr-title {
                        font-size: 28rpx;
                        color: #333333;
                        margin-bottom: 20rpx;
                    }

                    .qr-image {
                        width: 240rpx;
                        height: 240rpx;
                        border: 2rpx solid #eeeeee;
                        border-radius: 12rpx;
                    }
                }
            }

            .donate-note {
                background-color: #f8f9fa;
                padding: 20rpx;
                border-radius: 12rpx;
                margin: 30rpx 0;

                text {
                    display: block;
                    font-size: 24rpx;
                    color: #666666;
                    line-height: 1.6;

                    &:first-child {
                        color: #333333;
                        font-weight: bold;
                        margin-bottom: 12rpx;
                    }
                }
            }

            .popup-buttons {
                display: flex;
                justify-content: center;
                gap: 30rpx;

                button {
                    width: 180rpx;
                    height: 70rpx;
                    line-height: 70rpx;
                    text-align: center;
                    border-radius: 35rpx;
                    font-size: 28rpx;

                    &.btn-cancel {
                        background-color: #f5f5f5;
                        color: #666666;
                    }

                    &.btn-submit {
                        background-color: #8d5da3;
                        color: #ffffff;
                    }
                }
            }
        }
    }
}

.grid-item-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transition: all 0.3s ease;

    &:active,
    &.grid-item-active {
        transform: scale(0.95);
        background-color: rgba(0, 0, 0, 0.05);
    }
}

.grid-detail-popup {
    width: 600rpx;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: hidden;

    .popup-header {
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;

        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .popup-content {
        padding: 30rpx;

        .detail-icon {
            text-align: center;
            margin-bottom: 20rpx;

            image {
                width: 80rpx;
                height: 80rpx;
            }
        }

        .detail-info {
            text-align: center;
            margin-bottom: 30rpx;

            .detail-number {
                margin-bottom: 20rpx;

                .number {
                    font-size: 60rpx;
                    color: #b876d9;
                    font-weight: bold;
                }

                .unit {
                    font-size: 24rpx;
                    color: #999;
                    margin-left: 10rpx;
                }
            }

            .detail-description {
                font-size: 28rpx;
                color: #666;
                line-height: 1.5;
                padding: 0 30rpx;
            }
        }

        .detail-chart {
            height: 400rpx;
            margin-top: 30rpx;
        }
    }
}

.preview-text {
    font-size: 20rpx;
    color: #999;
    background: rgba(153, 153, 153, 0.1);
    padding: 2rpx 8rpx;
    border-radius: 10rpx;
    margin-left: 4rpx;
    font-weight: 400;
}

.Cardlist {
    position: relative;

    .refresh-loading {
        position: absolute;
        left: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    }

    .refresh-rotate {
        animation: refresh-rotate 1s linear infinite;
    }
}

@keyframes refresh-rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>