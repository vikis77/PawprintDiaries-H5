<!-- 猫爪页面（第二页）
 
 -->
<template>
	<view class="container">
		<view class="layout">
			
			<!-- 展示卡片信息 -->
			<view class="showCardBox">
				<view class="y0hj0"> 
					<!-- 卡片日记 -->
					<view class="paw">
						<view class="t89hmm">
							<uni-section class="m7h9h" title="卡片日记" titleColor="#333" titleFontSize="47rpx" type="line"></uni-section>
						</view>
					</view>
					<!-- 主题部分 -->
					<view class="y89yh9"> 
						<!-- 分段器 -->
						<view class="th890h0">
							<uni-segmented-control 
								:current="currentArea" 
								:values="AreaItems" 
								activeColor="#8d5da3" 
								style-type="text" 
								@clickItem="onClickItemArea"
							/>
						</view>
						<!-- 分段器内容 -->
						<view class="tzz876">
							<!-- 推荐内容（始终显示） -->
							<view class="t9x">
								<!-- 卡片循环区域 -->
								<view class="Cardlist">
									<scroll-view class="ta9u0a" scroll-x="true">
										<view class="t42f">
											<!-- 循环展示猫猫卡片 -->
											<view class="t2352" v-for="cat in catList" :key="cat.catId">
												<!-- 猫猫头像 -->
												<view class="t7908f" @click="handleClickCard(cat.catId)">
													<image class="img32r" :src="`${pic_general_request_url}/cat_avatar/${cat.avatar}`" mode="aspectFill"></image>
												</view>
												<!-- 猫猫信息  -->
												<view class="t990k" @click="handleClickCard(cat.catId)">
													<view class="t5grg3">
														<text class="t2rdf">{{ cat.catname }} - {{ cat.age }}个月 - {{ cat.gender === 1 ? '雄性' : '雌性' }}</text>
													</view>
												</view>
												<!-- 分割线 -->
												<view class="divider"/>
												<!-- 热度讨论分享 -->
												<view class="t79h" @click="toBeDeveloped">
													<view class="">
														<uni-icons type="fire" size="18"></uni-icons>
														热度
													</view>
													<view class="">
														<uni-icons type="chatbubble" size="18"></uni-icons>
														讨论
													</view>
													<view class="">
														<uni-icons type="paperclip" size="18"></uni-icons>
														分享
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
				<view class="th0hzf" >
					<uni-card class="tz0v898" margin=0  title="校猫数据统计卡片" :sub-title="nowTime" extra="" thumbnail="../static/猫咪-copy.png" >
						<view class="gridbody" >
							<uni-grid class="tyh08hz" :column="3" :square="false" :highlight="false" >
								<uni-grid-item v-for="(item, index) in gridList" :index="index" :key="index" class="t99zv" >
									<view class="grid-item-box">
										<view class="tzh0h">
											<img v-if="item.url !== ''" :src="item.url" class="th80" mode="aspectFill" />
											<text class="tm9q1a">{{item.data}}</text>
										</view>
										<text class="grid-item-boxtext">{{item.text}}</text>
										<text class="grid-item-boxtext2">{{item.text2}}</text>
									</view>
								</uni-grid-item>
							</uni-grid>
						</view>
					</uni-card>
				</view>
				
				<view class="tzjhc99">
					<view class="t9hu9hzz">
						<uni-segmented-control :style="{color: '#3a3a3a'}" :current="current" :values="items" style-type="button"
							activeColor="#2ab3c5" inActiveColor="#ffffff" @clickItem="onClickItem" />
					</view>
					<view class="tm80inp">
						<view v-if="current === 0">
							<view class="content-text">
								<!-- 条状图 年龄分布-->
								<view class="StripDiagram-box">
									<qiun-data-charts 
									type="bar"
									:opts="StripDiagramOpts"
									:chartData="StripDiagramData"
									/>
								</view>
							</view>
						</view>
						<view v-if="current === 1">
							<view class="content-text">
								<!-- 折图 数量变化-->
								<view class="FoldingDiagram-box">
									<qiun-data-charts 
									  type="line"
									  :opts="FoldingDiagramOpts"
									  :chartData="FoldingDiagramData"
									/>
								</view>
							</view>
						</view>
						<view v-if="current === 2">
							<!-- 饼状图 健康zhuang't -->
							<view class="Cake-box">
								<qiun-data-charts 
									type="pie"
									:opts="CakeOpts"
									:chartData="CakeData"
								/>
							</view>
							<view class="t0h0h00">
								<text>说明：</text>
								<text>健康指猫咪各项生理指标正常，没有明显的疾病或不适。</text>
							</view>
						</view>
						<view v-if="current === 3">
							<!-- 山峰图 区域分布-->
							<view class="PeakMap-box">
								<qiun-data-charts 
								type="mount"
								:opts="PeakMapOpts"
								:chartData="PeakMapData"
								/>
							</view>
						</view>
						<view v-if="current === 4">
							<view class="content-text">
								<!-- 柱形图 其他数据-->
								<view class="showChartBox">
									<qiun-data-charts 
									type="column"
									:opts="opts"
									:chartData="chartData"
									/>
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
							<img class="card-icon" src="/static/爱心领养hover.png" mode="aspectFit"/>
							<text class="card-title">我要领养</text>
							<text class="card-desc">给流浪猫一个温暖的家</text>
						</view>
						
						<view class="donate-card" @click="handleClickDonate">
							<img class="card-icon" src="/static/在线捐赠.png" mode="aspectFit"/>
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
						<uni-data-select
							v-model="adoptFormsData.catName"
							:localdata="catSelectList"
							placeholder="请选择想领养的猫咪"
							@change="handleCatSelect"
						/>
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
					<img class="qr-image" src="../static/猫.png" mode="aspectFit"/>
				</view>
				<view class="qr-item">
					<text class="qr-title">支付宝</text>
					<img class="qr-image" src="../static/猫.png" mode="aspectFit"/>
				</view>
				</view>
				<view class="donate-note">
				<text>说明：</text>
				<text>1. 您的每一笔捐赠都将用于校园猫咪的日常护理</text>
				<text>2. 资金使用情况将定期公示</text>
				<text>3. 感谢您的爱心支持！</text>
				</view>
				<view class="popup-buttons">
				<button class="btn-cancel" @click="closeDonatePopup">关闭</button>
				</view>
			</view>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, onUnmounted, nextTick } from 'vue';
	import uniSection from '@dcloudio/uni-ui/lib/uni-section/uni-section.vue'
	import uniCard from '@dcloudio/uni-ui/lib/uni-card/uni-card.vue'
	import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
	import uniListItem from '@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue';
	import uniSegmentedControl from '@dcloudio/uni-ui/lib/uni-segmented-control/uni-segmented-control.vue';
	import uniGrid from '@dcloudio/uni-ui/lib/uni-grid/uni-grid.vue';
	import uniGridItem from '@dcloudio/uni-ui/lib/uni-grid-item/uni-grid-item.vue';
	// import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup';
	import uniForms from '@dcloudio/uni-ui/lib/uni-forms/uni-forms.vue';
	import uniFormsItem from '@dcloudio/uni-ui/lib/uni-forms-item/uni-forms-item.vue';
	import uniEasyInput from '@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.vue';
	import uniDataCheckbox from '@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.vue';
	import uniDatetimePicker from '@dcloudio/uni-ui/lib/uni-datetime-picker/uni-datetime-picker.vue';
	import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
	import uniDataSelect from '@dcloudio/uni-ui/lib/uni-data-select/uni-data-select.vue'
	
	const API_general_request_url = ref('');
	const pic_general_request_url = ref('');
	if (process.env.NODE_ENV === 'development'){
		// 图片
		pic_general_request_url.value = "http://localhost:8000"
		// 请求
		API_general_request_url.value = "http://localhost:8080"
	} else {
		// 图片
		pic_general_request_url.value = "https://cdn.luckyiur.com/catcat"
		// 请求
		API_general_request_url.value = "https://pawprintdiaries.luckyiur.com"
	}
	
	const cover="../static/xxavatar1.jpg"
	const nowTime = ref('')
	const gridList = ref([])
	const CardlistAllDynamicWidth =ref(0)
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
	  color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
	  padding: [15,15,0,5],
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
		  barBorderCircle: true, // 启用分组柱状图半圆边框，
		  customColor: [
			"#FA7D8D",
			"#EB88E2"
		  ]
	    }
	  }
	};

	
	// 猫猫卡片的分段器
	const currentArea = ref(0)
	const AreaItems = ref(['推荐','全部','捐赠/领养'])
	
	// 猫猫卡片的分段器处理点击事件
	const onClickItemArea = (indexObj) => {
		if (indexObj.currentIndex === 2) { // 点击"捐赠/领养"
			showDonateMenu.value = true;
		} else if (indexObj.currentIndex === 1) { // 点击"全部"
			// 获取第一只猫的ID作为默认值
			const defaultCatId = catList.value.length > 0 ? catList.value[0].catId : '';
			uni.navigateTo({
				url: `/pages/CatManage?catId=${defaultCatId}&from=catclaw`
			});
		}
		currentArea.value = indexObj.currentIndex;
	}
	
	// 数据分析的分段器
	const current = ref(0)  // 当前选中的选项卡索引
	const items = ref(['年龄分布', '数量变化', '健康状态','区域分布', '其他数据'])  // 选项卡内容
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
		color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
		padding: [15,10,0,15],
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
		categories: ["5月","6月","7月","8月","9月","10月"],
		series: [
		{
			name: "校内小猫总数量变化",
			data: [25,28,25,17,24,20]
		}]
	};
	FoldingDiagramData.value = JSON.parse(JSON.stringify(FoldingDiagramDataDetail));
	
	// 条状图 年龄分布
	const StripDiagramData = ref({})
	const StripDiagramOpts = {
		color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
		padding: [15,30,0,5],
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
		color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
		padding: [5,5,5,5],
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
		color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
		padding: [15,15,0,5],
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
		currentArea.value = 0; // 确保每次显示页面时分段器都在推荐状态
		fetchCatData(); //获取猫猫数据
		fetchDataAnalysis(); // 获取数据分析数据
	})
	
	// 页面卸载时清除定时器
	onUnmounted(() => {
	  clearInterval(timer)
	})
	
	// 获取猫猫数据的方法
	function fetchCatData() {
		uni.request({
			url: `${API_general_request_url.value}/api/cat/list`,  // 后端API地址
			method: 'GET',
			success: (res) => {
				console.log(res)
				if (res.statusCode === 200 && res.data.code === '2000') {
					catList.value = res.data.data;  // 将API返回的数据赋值给catList
					// 处理猫咪选择列表数据
					catSelectList.value = catList.value.map(cat => ({
						value: cat.catname,
						text: `${cat.catname} - ${cat.gender === 1 ? '公' : '母'} - ${cat.age}个月`
					}));
					uni.setStorageSync("catList",res.data.data);
					gridList.value = [{
									url: '../static/猫.png',
									data: catList.value.length,
									text: '在校小猫数量',
									text2: '（只）',
									badge: '0',
									type: "primary"
								},
								{
									url: '/static/c2.png',
									text: '已领养数量',
									data: catDataAnalysisData.value.adoptionCount || 0,
									text2: '（只）',
									badge: '1',
									type: "success"
								},
								{
									url: '/static/c3.png',
									text: '已绝育数量',
									data: catDataAnalysisData.value.sterilizationRatio['已绝育'] || 0,
									text2: '（只）',
									badge: '99',
									type: "warning"
								},
								{
									url: '/static/c4.png',
									text: '已打疫苗',
									data: catDataAnalysisData.value.vaccinationRatio['已接种'] || 0,
									text2: '（只）',
									badge: '2',
									type: "error"
								},
								{
									url: '/static/c5.png',
									text: '健康数量',
									data: catDataAnalysisData.value.healthStatus['健康'] || 0,
									text2: '（只）'
								},
								{
									url: '/static/c6.png',
									text: '本月新增',
									data: catDataAnalysisData.value.monthlyNewCount || 0,
									text2: '（只）'
								},
								{
									url: '../static/我的资金.png',
									data: catDataAnalysisData.value.fundBalance || 0,
									text: '救助资金剩余',
									text2: '（元）'
								},
								{
									url: '',
									data: catDataAnalysisData.value.lastMonthExpense || 0,
									text: '上月支出',
									text2: '（元）'
								},
								{
									url: '',
									data: catDataAnalysisData.value.lastMonthIncome || 0,
									text: '上月收入',
									text2: '（元）'
								}]
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '获取小猫数据失败 ' + err,
					icon: 'none'
				})
			}
		});
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

	// 修改获取数据分析数据的方法
	function fetchDataAnalysis() {
		uni.request({
			url: `${API_general_request_url.value}/api/cat/analysis`,
			method: 'GET',
			success: (res) => {
				console.log(res)
				if (res.statusCode === 200 && res.data.code === '2000') {
					const newData = res.data.data;
					
					// 为每个统计数据添加动画效果
					gridList.value.forEach((item, index) => {
						let targetValue = 0;
						
						switch(index) {
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
						categories: ["3个月以内","3-6个月","6-12个月","12-18个月","18-24个月","24个月以上"],
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
								{"name":"健康","value":ensureNumber(newData?.healthStatus?.['健康']),"labelText":`健康:${ensureNumber(newData?.healthStatus?.['健康'])}只`},
								{"name":"疾病","value":ensureNumber(newData?.healthStatus?.['疾病']),"labelText":`疾病:${ensureNumber(newData?.healthStatus?.['疾病'])}只`},
								{"name":"营养不良","value":ensureNumber(newData?.healthStatus?.['营养不良']),"labelText":`营养不良:${ensureNumber(newData?.healthStatus?.['营养不良'])}只`},
								{"name":"肥胖","value":ensureNumber(newData?.healthStatus?.['肥胖']),"labelText":`肥胖:${ensureNumber(newData?.healthStatus?.['肥胖'])}只`}
							]
						}]
					};
					CakeData.value = JSON.parse(JSON.stringify(CakeDataDetail));
					
					// 更新区域分布数据
					let PeakMapDataDetail = {
						series: [{
							data: [
								{"name":"北门","value":ensureNumber(newData?.areaDistribution?.['北门'])},
								{"name":"岐头","value":ensureNumber(newData?.areaDistribution?.['岐头'])},
								{"name":"凤翔","value":ensureNumber(newData?.areaDistribution?.['凤翔'])},
								{"name":"厚德楼","value":ensureNumber(newData?.areaDistribution?.['厚德楼'])},
								{"name":"香晖苑","value":ensureNumber(newData?.areaDistribution?.['香晖苑'])}
							]
						}]
					};
					PeakMapData.value = JSON.parse(JSON.stringify(PeakMapDataDetail));
					
					// 更新其他数据图表
					let chartsDataDetail = {
						categories: ["性别","","是否绝育","","是否打疫苗",""],
						series: [
							{
								name: "公猫/已绝育/已打疫苗",
								data: [
									ensureNumber(newData?.genderRatio?.['公猫']),,
									ensureNumber(newData?.sterilizationRatio?.['已绝育']),,
									ensureNumber(newData?.vaccinationRatio?.['已接种']),
								]
							},
							{
								name: "雌性/未绝育/未打疫苗",
								data: [
									ensureNumber(newData?.genderRatio?.['母猫']),,
									ensureNumber(newData?.sterilizationRatio?.['未绝育']),,
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
		uni.navigateTo({
			url:`/pages/Card?catId=${catId}` // 传递小猫的id
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
	
	const toBeDeveloped = () => {
		uni.showToast({
			title: '待开发',
			icon: 'error'
		})
	}

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

	// 组件卸载时移除事件监
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

	// 添加猫咪选择理函数
	const handleCatSelect = (value) => {
		adoptFormsData.value.catName = value;
	}
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
												
												.t79h {
													width: 100%;
													height: 53rpx;
													display: flex;
													font-size: 20rpx;
													align-items: center;
													justify-content: space-around;
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
</style>