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
							<uni-segmented-control :current="currentArea" :values="AreaItems" 
							 activeColor="#8d5da3" style-type="text" @clickItem="onClickItemArea"/>
						</view>
						<!-- 分段器内容 -->
						<view class="tzz876">
							<view v-if="currentArea === 0">
								<view class="t9x">
									<!-- 卡片循环区域 -->
									<view class="Cardlist" >
										<scroll-view class="ta9u0a" scroll-x="true" >
											<view class="t42f" >
												<!-- 循环展示猫猫卡片 -->
												<view class="t2352" v-for="cat in catList" :key="cat.catId" > 
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
							<view v-if="currentArea === 1">
								<view class="t9x">
									<!-- 卡片循环区域 -->
									<view class="Cardlist" >
										<scroll-view class="ta9u0a" scroll-x="true" >
											<view class="t42f">
												<!-- 循环展示猫猫卡片 -->
												<view class="t2352" v-for="cat in catList2" :key="cat.catId" @click="handleClickCard(cat.catId)"> 
													<!-- 猫猫头像 -->
													<view class="t7908f">
														<image class="img32r" :src="`${pic_general_request_url}/cat_avatar/${cat.avatar}`" mode="aspectFill"></image>
													</view>
													<!-- 猫猫信息  -->
													<view class="t990k">
														<view class="t5grg3">
															<text class="t2rdf">{{ cat.catname }} - {{ cat.age }}个月 - {{ cat.gender === 1 ? '雄性' : '雌性' }}</text>
														</view>
													</view>
											
													<!-- 分割线 -->
													<view class="divider"/>
													
													<!-- 热度讨论分享 -->
													<view class="t79h">
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
							<view v-if="currentArea === 2">
								<view class="t9x">
									<!-- 卡片循环区域 -->
									<view class="Cardlist" >
										<scroll-view class="ta9u0a" scroll-x="true" >
											<view class="t42f">
												<!-- 循环展示猫猫卡片 -->
												<view class="t2352" v-for="cat in catList3" :key="cat.catId" @click="handleClickCard(cat.catId)"> 
													<!-- 猫猫头像 -->
													<view class="t7908f">
														<image class="img32r" :src="`${pic_general_request_url}/cat_avatar/${cat.avatar}`" mode="aspectFill"></image>
													</view>
													<!-- 猫猫信息  -->
													<view class="t990k">
														<view class="t5grg3">
															<text class="t2rdf">{{ cat.catname }} - {{ cat.age }}个月 - {{ cat.gender === 1 ? '雄性' : '雌性' }}</text>
														</view>
													</view>
											
													<!-- 分割线 -->
													<view class="divider"/>
													
													<!-- 热度讨论分享 -->
													<view class="t79h">
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
								<!-- 折线图 数量变化-->
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
				<view class="t89h">
					<button @click="handleClickAdopt">我要领养</button>
					<uni-popup  ref="popupAdopt" type="bottom" border-radius="10px 10px 0 0">
						<view class="tz8y">
							<view class="fvz89">
								<uni-forms ref="t23sxx" :modelValue="adoptFormsData">
									<uni-forms-item label="您想领养的猫咪？" required labelWidth="70">
										<uni-easyinput v-model="adoptFormsData.catName"  placeholder="名字或花色" />
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
								<button @click="submitAdoptForm">提交</button>
							</view>
							
						</view>
					</uni-popup>
				</view>
				<view class="t233">
					<button @click="handleClickDonate">我要捐赠</button>
					<uni-popup class="t465" ref="popupDonate" type="bottom" border-radius="10px 10px 0 0">
						<view class="tz8y55">
							<view class="fvz8955">
								<img class="tz8v" src="/static/猫.png" mode=""></img>
							</view>
							<view class="t34t34t">
								<text>感谢您的支持！</text>
								<text>为校园流浪猫进行捐赠，请扫描二维码进行捐款。您的爱心将为它们带来温暖和关怀！谢谢！</text>
							</view>
						</view>
					</uni-popup>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';
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
	const catDataAnalysisData = ref(null);
	const popupAdopt = ref(null)
	const popupDonate = ref(null)
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
	const AreaItems = ref(['全部','区域','搜索'])
	
	// 猫猫卡片的分段器处理点击事件
	const onClickItemArea = (indexObj) => {
		// console.log(indexObj.currentIndex)
		currentArea.value = indexObj.currentIndex
		if (indexObj.currentIndex === 1 || indexObj.currentIndex === 2){
			uni.showToast({
				title: '待开发',
				icon: 'error'
			})
		}
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
	
	// 饼状图 健康状态
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
	    url: `${API_general_request_url.value}/api/cat/findAll`,  // 后端API地址
	    method: 'GET',
	    success: (res) => {
			console.log(res.data.data)
			if (res.statusCode === 200 && res.data.code === '2000') {
				catList.value = res.data.data;  // 将API返回的数据赋值给catList
				uni.setStorageSync("catList",res.data.data); // 同步存储整个猫猫列表信息
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
									text: '',
									badge: '1',
									type: "success"
								},
								{
									url: '/static/c3.png',
									text: '',
									badge: '99',
									type: "warning"
								},
								{
									url: '/static/c4.png',
									text: '',
									badge: '2',
									type: "error"
								},
								{
									url: '/static/c5.png',
									text: ''
								},
								{
									url: '/static/c6.png',
									text: ''
								},
								{
									url: '../static/我的资金.png',
									data: '',
									text: '救助资金剩余',
									text2: '（单位：元）'
								},
								{
									url: '',
									data: '',
									text: '上月支出',
									text2: '（单位：元）'
								},
								{
									url: '',
									data: '',
									text: '上月收入',
									text2: '（单位：元）'
								}
							]
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
	
	// 获取数据分析数据
	function fetchDataAnalysis() {
		uni.request({
		  url: `${API_general_request_url.value}/api/cat/analysis`,  // 后端API地址
		  method: 'GET',
		  success: (res) => {
					console.log(res.data.data)
					if (res.statusCode === 200 && res.data.code === '2000') {
						catDataAnalysisData.value = res.data.data;  // 将API返回的数据赋值给catList
						// 设置年龄分布数据
						let tripDiagramDataDetail = {
							categories: ["3个月以内","3-6个月","6-12个月","12-18个月","18-24个月","24个月以上"],
							series: [
							  {
								name: "校内小猫年龄分布",
								data: [
									catDataAnalysisData.value.ageDistribution["3个月以内"],
									catDataAnalysisData.value.ageDistribution["3-6个月"],
									catDataAnalysisData.value.ageDistribution["6-12个月"],
									catDataAnalysisData.value.ageDistribution["12-18个月"],
									catDataAnalysisData.value.ageDistribution["18-24个月"],
									catDataAnalysisData.value.ageDistribution["24个月以上"]
								]
							  }
							]
						  };
						StripDiagramData.value = JSON.parse(JSON.stringify(tripDiagramDataDetail));
						
						// 设置健康状态数据
						let CakeDataDetail = {
							series: [
							{
								data: [
									{"name":"健康","value":catDataAnalysisData.value.healthStatus['健康'],"labelText":`健康:${catDataAnalysisData.value.healthStatus['健康']}只`},
									{"name":"疾病","value":catDataAnalysisData.value.healthStatus['疾病'],"labelText":`疾病:${catDataAnalysisData.value.healthStatus['疾病']}只`},
									{"name":"营养不良","value":catDataAnalysisData.value.healthStatus['营养不良'],"labelText":`营养不良:${catDataAnalysisData.value.healthStatus['营养不良']}只`},
									{"name":"肥胖","value":catDataAnalysisData.value.healthStatus['肥胖'],"labelText":`肥胖:${catDataAnalysisData.value.healthStatus['肥胖']}只`}]
							}
							]
						};
						CakeData.value = JSON.parse(JSON.stringify(CakeDataDetail));
						
						// 设置区域分布数据
						let PeakMapDataDetail = {
							series: [
								{
									data: [
										{"name":"北门","value":catDataAnalysisData.value.areaDistribution['北门']},
										{"name":"岐头","value":catDataAnalysisData.value.areaDistribution['岐头']},
										{"name":"凤翔","value":catDataAnalysisData.value.areaDistribution['凤翔']},
										{"name":"厚德楼","value":catDataAnalysisData.value.areaDistribution['厚德楼']},
										{"name":"香晖苑","value":catDataAnalysisData.value.areaDistribution['香晖苑']}
										]
								}
							]
						};
						PeakMapData.value = JSON.parse(JSON.stringify(PeakMapDataDetail));
						
						// 设置其他数据 
						let chartsDataDetail = {
						    categories: ["性别","","是否绝育","","是否打疫苗",""],
						    series: [
						      {
						        name: "公猫/已绝育/已打疫苗",
						        data: [
									catDataAnalysisData.value.genderRatio['公猫'],,
									catDataAnalysisData.value.sterilizationRatio['已绝育'],,
									catDataAnalysisData.value.vaccinationRatio['已接种'],
								]
						      },
						      {
						        name: "雌性/未绝育/未打疫苗",
						        data: [
									catDataAnalysisData.value.genderRatio['母猫'],,
									catDataAnalysisData.value.sterilizationRatio['已绝育'],,
									catDataAnalysisData.value.vaccinationRatio['未接种'],]
						      }
						    ]
						  };
						chartData.value = JSON.parse(JSON.stringify(chartsDataDetail));
						
					}else {
						uni.showToast({
							title: res.data.msg
						})
					}
					
				},
		  fail: (err) => {
					uni.showToast({
					title: '获取数据分析数据失败 ' + err,
					icon: 'none'
					})
				}
		});
	}
	
	// 点击卡片时跳转，传递catId给卡片页面
	function handleClickCard(catId) {
		uni.navigateTo({
			url:`/pages/Card?catId=${catId}` //// 传递小猫的id
		})
	}
	
	// 打开我要领养弹窗的函数
	const handleClickAdopt = () => {
		popupAdopt.value.open();
	};
	const submitAdoptForm = () => { // 点击领养提交
		console.log(adoptFormsData.value)
		// 发送提交请求
		// ...
		uni.showToast({
			title: '提交成功！'
		})
		popupAdopt.value.close();
	}
	
	const handleClickDonate = () => { // 打开我要捐赠弹窗的函数
	  popupDonate.value.open();
	};
	const submitDonateForm = () => { // 点击捐赠提交
		// console.log(donateDormsData.value)
	}
	
	const toBeDeveloped = () => {
		uni.showToast({
			title: '待开发',
			icon: 'error'
		})
	}
</script>

<style lang="scss" scoped>
	// 隐藏scroll-view默认滚动条
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
	
	.container{
		width: 750rpx;
		// height: 100vh;
		// background-color: #efefef;
		.layout{
			width: 100%;
			height: 100%;
			// overflow-y: auto; /* 当内容超出时，允许垂直滚动*/
			// min-height: 100vh; /* 最小高度为整个视窗高度 */
			// margin-top: 10rpx;
			background: linear-gradient(to bottom, #e9e9fa, #e6f2ff); /* 渐变背景 */
			// background-color: #efefef;
			// padding-bottom: 100rpx;//底部导航栏100rpx
			.showCardBox{
				width: 675rpx; /* 调整为布局适配 */
				height: 680rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
				padding: 20rpx; /* 增加内边距以提高间距 */
				border-radius: 10rpx;
				background-color: #ffffff; /* 白色背景使内容更清晰 */
				// background: linear-gradient(to right, #6270db, #a9518c);
				box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px; /* 软阴影 */
				border: 0.666667rpx solid #EBEEF5;
				overflow: hidden;
				.y0hj0{ 
					width: 100%;
					height: 100%;
					border-radius: 20rpx 20rpx 20rpx 20rpx;
					box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2); /* 软阴影 */
					// background: linear-gradient(to right, #6270db, #a9518c);
					// border: 0.666667rpx solid #EBEEF5;
					overflow: hidden;
					.paw{ // 卡片日记
						width: 100%;
						display: flex;
						align-items: center;
						// background: linear-gradient(to right, #6270db, #a9518c); /* 渐变背景 */
						
						background-color: #a0a0f0;
						padding: 20rpx; /* 内边距增加 */
						overflow: hidden;
						.t89hmm{
							.m7h9h{
								background: rgba(255, 255, 255, 0); /* 透明背景 */
							}
						}
					}
					.y89yh9{ // 卡片选择器+轮播区
						width: 100%;
						// height: 100%;
						border-radius: 10rpx;
						margin-top: 15rpx;
						background-color: #ffffff;
						overflow: hidden;
						.th890h0{
							width: 100%;
							height: 100rpx;
						}
						.tzz876{
							width: 100%;
							.t9x{
								width: 100%;
								height: 100%;
								.Cardlist{
									width: 100%;
									height: 400rpx;
									background-image: "";
									.ta9u0a{
										width: 100%;
										height: 400rpx;
										overflow-x: auto;
										.t42f{
											// width: 9000rpx;
											height: 100%;
											display: flex;
											flex-wrap: nowrap;
											// background: linear-gradient(to right, #9ca4db, #a97ca1); 
											// background: linear-gradient(to right, #fdeda9, #fffce2); /* 渐变背景 */
											.t2352:first-child{
												margin-left: 10rpx;
											}
											
											.t2352{ //每一个卡片
												width: 300rpx;
												height: 350rpx;
												margin-top: 20rpx;
												background-color: #fafafa;
												align-items: center;
												justify-content: center;
												display: flex;
												margin-right: 20rpx;
												flex-direction: column; /* 垂直排列 */
												/* 添加边框 */
												border: 1rpx solid #dadada;
												/* 添加圆角和阴影 */
												border-radius: 20rpx; /* 圆角 */
												box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.2); /* 阴影 */
												background: linear-gradient(to bottom, #e9e9fa, #e6f2ff); /* 渐变背景 */
												// overflow: hidden;
												.t7908f{ //图片
													width: 300rpx;
													height: 225rpx;
													.img32r{
														width: 90%;
														height: 90%;
														border-radius: 20rpx 20rpx 20rpx 20rpx; /* 图片上部圆角 */
														// object-fit: cover; /* 确保图片保持比例 */
														margin-left: 14rpx;
														margin-top: 10rpx;
													}
												}
												.t990k{ //文字
													width: 100%; /* 宽度设为100%，让文字块占满一行 */
													height: 70rpx;
													text-align: center; /* 居中文字 */
													overflow: hidden; /* 隐藏溢出的部分 */
													.t5grg3{
														padding-left: 20rpx;
														padding-right: 20rpx;
														.t2rdf{
															width: 100%;
															height: 100%;
															font-size: 26rpx;
															overflow: hidden; /* 隐藏超出内容 */
															display: -webkit-box;
															-webkit-box-orient: vertical;
															-webkit-line-clamp: 2; /* 限制最多显示两行 */
															text-overflow: ellipsis; /* 超出部分显示省略号 */
															word-break: break-word; /* 防止单词超出容器 */
														}
													}
													
												}
												.divider { //分割线
												  background: #E0E3DA;
												  width: 90%;
												  height: 2rpx;
												  justify-content: center;
												}
												.t79h{ //操作区
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
			
			// <!-- 展示统计信息 -->
			.showStatisticsBox{ 
				width: 95%;
				height: 1750rpx;
				margin-left: 20rpx;
				// margin-top: 10rpx;
				// border-radius: 4rpx;
				// background-color: #ffffff;
				// box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2); /* 软阴影 */
				// border: 2rpx solid #dbdbdb;
				
				display: flex;
				flex-direction: column;
				display: flex;
				align-items: center;
				justify-content: center;
				font-family: 'Arial', sans-serif;
				.th0hzf{ //统计卡片
					width: 100%;
					height: 750rpx;
					margin-bottom: 36rpx;
					box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px; /* 软阴影 */
					border: 0.666667rpx solid #EBEEF5;
					.tz0v898{
					}
					.tyh08hz{
						width: 100%;
						// height: 600rpx;
						height: 100%;
						.t99zv{ // 每一行 3个
							width: 33%;
							height: 200rpx;
							.grid-item-box{ //每一个小格子
								width: 100%;
								height: 100%;
								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;
								.tzh0h{ //view
									display: flex;
									align-items: center;
									justify-content: center;
									.th80{ //图片
										width: 50rpx;
										height: 50rpx;
									}
									.tm9q1a{ // data
										font-size: 60rpx;
										color: #b876d9;
									}
								}
								.grid-item-boxtext{ // 描述
									// height: 100rpx;
									// width: 90%;
									font-size: 25rpx;
									color: #aca4a5;
								}
								.grid-item-boxtext2{ // 描述第二行
									// height: 100rpx;
									// width: 90%;
									font-size: 25rpx;
									color: #aca4a5;
								}
							}
						}
					}
				}
				.tzjhc99{ //可视化
					width: 100%;
					height: 900rpx;
					// margin-left: 70rpx;
					// padding-top: 20rpx;
					background-color: #ffffff;
					border-radius: 4rpx;
					box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px; /* 软阴影 */
					border: 0.666667rpx solid #EBEEF5;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.t9hu9hzz{ //选项卡
						width: 90%;
						height: 100rpx;
						// margin-top: 20rpx;
						// padding-left: 60rpx;
					}
					.tm80inp{ //选项卡内容
						width: 90%;
						height: 600rpx;
						.showChartBox{ //柱形图
							width: 100%;
							height: 600rpx;
						}
						.FoldingDiagram-box{ //折线图
							width: 100%;
							height: 600rpx;
						}
						.StripDiagram-box{ //条状图
							width: 100%;
							height: 600rpx;
						}
						.Cake-box{ //饼状图
							width: 100%;
							height: 600rpx;
							
						}
						.t0h0h00{
								width: 80%;
								height: 100rpx;
								font-size: 26rpx;
								text{
								}
							}
						.PeakMap-box{ // 山峰图
							// width: 100%;
							height: 600rpx;
						}
					}
				}
			}
			// <!-- 展示捐助领养区域 -->
			.showDonateBox{
				width: 95%;
				height: 150rpx;
				margin-top: 0rpx;
				margin-left: 20rpx;
				// margin-left: 40rpx;
				// margin-bottom: 100rpx;
				// padding-bottom: 100rpx;
				box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px; /* 软阴影 */
				border: 0.666667rpx solid #EBEEF5;
				border-radius: 4rpx;
				background-color: #ffffff;
				display: flex;
				align-items: center;
				justify-content: space-around;
				
				button{
					width: 200rpx;
					height: 100rpx;
				}
				.t89h{ //领养
					// width: 100%;
					// height: 300rpx;
					.tz8y{ // 领养弹出层
						width: 100%;
						height: 850rpx;
						background-color: #ffffff;
						// padding: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						padding-top: 170rpx;
						.fvz89{ //view
							width: 90%;
							height: 1000rpx;
							.t23sxx{ //表单
							}
						}
					}
				}
				.t233{ // 捐赠
					.t465{
						.tz8y55{
							width: 100vw;
							height: 850rpx;
							background-color: #ffffff;
							// padding: 30rpx;
							display: flex;
							align-items: center; 
							justify-content: center;
							flex-direction: column;
							padding-top: 50rpx;
							padding-bottom: 100rpx;
							.fvz8955{ //view pic
								width: 100%;
								height: 60%;
								display: flex;
								align-items: center;
								justify-content: center;
								.t23sxx55{ // view
									width: 100%;
									height: 100%;
									.tz8v{
										width: 100rpx;
										height: 100rpx;
									}
								}
							}
							.t34t34t{ //view text
								width: 88%;
								height: 40%;
								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;
								text{
									margin-bottom: 20rpx;
									font-size: 30rpx
								}
							}
						}
					}
				}
			}
		}
	}
</style>