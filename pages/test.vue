<template>
	<view class="container">
		<!-- 添加加载动画组件 -->
		<view class="loading-overlay" v-if="isLoading">
			<view class="loading-content">
				<img class="loading-image" src="../static/loading-cat.gif" mode="aspectFit"/>
				<text class="loading-text">{{loadingText}}</text>
			</view>
		</view>
		<view class="layout">
			<!-- 顶部搜索区域 -->
			<view class="header-section">
				<uni-section title="寻猫日迹" titleFontSize="40rpx" type="line">
					<view class="search-container">
						<!-- 日期选择 -->
						<view class="search-row">
							<view class="search-item">
								<view class="icon-label">
									<img class="icon" src="../static/time2.png" mode="aspectFill"/>
									<text class="label">选择日期</text>
								</view>
								<view class="picker-container">
									<uni-datetime-picker 
										type="date"
										placeholder="请选择日期"
										v-model="selectedDate"
										@change="onDateChange"
										start="2024-01-01"
										end="2024-12-31"
									/>
								</view>
							</view>
						</view>
						<!-- 猫咪选择 -->
						<view class="search-row">
							<view class="search-item">
								<view class="icon-label">
									<img class="icon" src="../static/cat007.png" mode="aspectFill"/>
									<text class="label">选择小猫</text>
								</view>
								<view class="picker-container">
									<uni-data-select
										placeholder="请选择小猫"
										v-model="selectedValueC"
										:localdata="dataListCat"
										@change="onCatChange"
									/>
								</view>
							</view>
						</view>
					</view>
				</uni-section>
			</view>

			<!-- 地图展示区域 -->
			<view class="map-container">
				<!-- #ifdef H5 -->
				<!-- 3D地图 -->
				<view class="map-section">
					<text class="map-title">3D视图</text>
					<div class="map-box" id="mymap"></div>
				</view>
				
				<!-- 2D地图 -->
				<view class="map-section">
					<text class="map-title">平面视图</text>
					<div class="map-box" id="mymap2"></div>
				</view>
				<!-- #endif -->

				<!-- #ifdef APP-PLUS -->
				<!-- App端使用uni-app的map组件 -->
				<view class="map-section">
					<text class="map-title">地图视图</text>
					<map
						class="map-box"
						:latitude="22.527103"
						:longitude="113.390166"
						:markers="appMarkers"
						:polyline="appPolyline"
						scale="16"
						show-location
					></map>
				</view>
				<!-- #endif -->
			</view>

			<!-- 统计信息面板 -->
			<!-- <view class="stats-panel" v-if="path.length > 0">
				<view class="stats-item">
					<text class="stats-label">今日发现</text>
					<text class="stats-value">{{path.length}}次</text>
				</view>
				<view class="stats-item">
					<text class="stats-label">活跃区域</text>
					<text class="stats-value">图书馆</text>
				</view>
				<view class="stats-item">
					<text class="stats-label">最近出现</text>
					<text class="stats-value">10分钟前</text>
				</view>
			</view> -->
			
			<!-- 悬浮按钮 -->
			<uni-fab 
				ref="fab"
				:pattern="pattern"
				:content="content"
				:horizontal="horizontal"
				:vertical="vertical"
				:direction="direction"
				@trigger="trigger"
				@fabClick="fabClick"
			/>
			
			<!-- 底部弹出层 (上传表单)-->
			<view class="popup-wrapper">
				<uni-popup ref="popupFromUpload" type='bottom' background-color="#fff" @change="change">
					<view class="popup-content">
						<view class="popup-header">
							<text class="popup-title">报告小猫踪迹！</text>
							<text class="popup-subtitle">帮助我们记录校园猫咪的足迹</text>
						</view>
						<view class="form-container">
							<uni-forms ref="reportForm" :model="baseFormData1" :rules="baseFormRules">
								<uni-forms-item label="小猫名字" required>
									<uni-data-select
										v-model="baseFormData1.catId"
										:localdata="dataListCat"
										@change="change"
										placeholder='你发现了哪一只小猫？'
									/>
								</uni-forms-item>
								<uni-forms-item label="位置信息" required>
									<view class="location-inputs">
										<uni-easyinput v-model="baseFormData1.longitude" placeholder="经度" />
										<uni-easyinput v-model="baseFormData1.latitude" placeholder="纬度" />
									</view>
								</uni-forms-item>
								<uni-forms-item label="上报者" required>
									<uni-easyinput v-model="baseFormData1.name" placeholder="我们如何称呼您？" />
								</uni-forms-item>
								<button class="submit-btn" type="button" @click="submitForm">
									<text class="btn-text">提交发现</text>
								</button>
							</uni-forms>
						</view>
					</view>
				</uni-popup>
				
				<!-- 拍照识猫弹出层 -->
				<uni-popup ref="popupPhotoUpload" type='bottom' background-color="#fff" @change="handlePopupChange">
					<view class="popup-content photo-upload-content">
						<view class="popup-header">
							<text class="popup-title">拍照识别猫咪品种</text>
							<text class="popup-subtitle">上传照片，帮你识别猫咪的品种类型</text>
							<text class="popup-tips">支持识别的品种：伯曼猫、英国蓝猫、埃及猫、考拉特猫、缅因猫、奥西猫、波斯猫、布偶猫、俄罗斯蓝猫、暹罗猫、新加坡猫、斯芬克斯无毛猫等</text>
						</view>
						<view class="photo-container">
							<view class="image-container">
								<img v-if="imagePath" :src="imagePath" mode="aspectFit" class="preview-image"/>
								<view v-else class="upload-placeholder" @click="chooseImage">
									<img src="../static/cat007.png" mode="aspectFit" class="camera-icon"/>
									<text class="upload-text">点击拍照或选择图片</text>
								</view>
							</view>
							<view class="button-group">
								<button class="photo-btn" @click="chooseImage">
									<text class="btn-text">{{ imagePath ? '重新选择' : '选择图片' }}</text>
								</button>
								<button v-if="imagePath" class="recognition-btn" type="button" @click="submitPhotoForRecognition">
									<text class="btn-text">开始识别</text>
								</button>
							</view>
						</view>
						<view v-if="recognitionResult && recognitionResult.topThree && recognitionResult.topThree.length > 0" class="recognition-result">
							<text class="result-title">识别结果</text>
							<view v-for="(result, index) in recognitionResult.topThree" :key="index" 
								class="result-content" :class="{'top-result': index === 0}">
								<view class="result-left">
									<text class="rank-badge">{{ index + 1 }}</text>
									<text class="cat-name">{{ result.catName }}</text>
								</view>
								<text class="confidence">{{ (result.confidence || 0).toFixed(1) }}%</text>
							</view>
						</view>
						<view v-else-if="recognitionResult" class="recognition-result">
							<text class="result-title">暂无匹配结果</text>
						</view>
					</view>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onMounted, onUnmounted, ref, nextTick, onActivated } from "vue";
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
	import { toBeDeveloped, showToast } from '@/src/utils/toast'
	import { STATUS_CODE } from '@/src/constant/constant.js'
	// #ifdef H5
	import AMapLoader from "@amap/amap-jsapi-loader";
	// #endif
	import { useAppStore } from '@/store/modules/app'
	const appStore = useAppStore()

	// 添加加载状态控制
	const isLoading = ref(true);
	const loadingText = ref('正在加载地图...');
	const isFirstLoad = ref(true); // 添加首次加载标记

	// App端地图标记数据
	const appMarkers = ref([]);
	const appPolyline = ref([]);

	// 弹出层状态变化处理函数
	const change = (e) => {
		console.log('弹出层状态变化:', e);
		// 可以在这里处理弹出层打开或关闭时的逻辑
	}
	
	// 添加悬浮uni-fab组件所需的配置
	const pattern = ref({
		color: '#7A7E83',
		backgroundColor: '#fff',
		selectedColor: '#ff6b81',
		buttonColor: '#37a3f0',
		iconColor: '#fff'
	})
	
	const horizontal = ref('left')
	const vertical = ref('bottom')
	const direction = ref('horizontal')
	const content = ref([
		{
			iconPath: 'https://cdn.luckyiur.com/catcat/static_image/V1_report.png',
			selectedIconPath: 'https://cdn.luckyiur.com/catcat/static_image/V1_report.png',
			text: '发现小猫',
			active: false,
		},
		{
			iconPath: 'https://cdn.luckyiur.com/catcat/static_image/aichong32.png',
			selectedIconPath: 'https://cdn.luckyiur.com/catcat/static_image/aichong32.png',
			text: '拍猫识别',
			active: false
		},
		{
			iconPath: 'https://cdn.luckyiur.com/catcat/static_image/photo009.png',
			selectedIconPath: 'https://cdn.luckyiur.com/catcat/static_image/photo009.png',
			text: '校猫识别',
			active: false
		}
	])
	
	const token = ref(`${uni.getStorageSync("token")}`);

	const popupFromUpload = ref(null); // 绑定表单上传
	const reportForm = ref(null); // 表单
	const baseFormData1 = ref({ // 上传单数据
		catId: '',
		longitude: '',
		latitude: '',
		name: ''
	})
	const baseFormRules = ref({ // 表单校验规则
	    catId: {
			required: true,
			message: '小猫名字不能为空',
		},
		longitude: {
			required: true,
			message: '经度不能为',
			trigger: 'blur',
		},
		latitude: {
			required: true,
			message: '纬度不能为空',
			trigger: 'blur',
		},
		name: {
			required: true,
			message: '上报者不能为空',
			trigger: 'blur',
		}
	})
	
	function trigger(e) {
		// 点击第一项（表单上传）
		if (e.index === 0) {
			// 先打开表单
			popupFromUpload.value.open();
			// 设置加载状
			baseFormData1.value.longitude = '获取位置中...';
			baseFormData1.value.latitude = '获取位置中...';
			baseFormData1.value.name = uni.getStorageSync('tokenDetail')?.username || '';
			
			// 在后台获取位置
			checkLocationPermission();
		} else if (e.index === 1) { // 点击拍照识别
			// 重置状态
			imagePath.value = '';
			recognitionResult.value = null;
			// 打开拍照识猫弹出层
			popupPhotoUpload.value.open();
		} else if (e.index === 2) { // 点击校猫识别
			toBeDeveloped();
		}
	}
	
	function fabClick() {
		console.log(11)
	}
	
	/* 地图相关量 */
	let AMap;
	let map1;
	let map1catMarker;
	let map1polyline;
	let map2;
	let map2catMarker;
	let map2polyline;
	const path = ref([]) //
	const mapDrawMode = ref(''); // 'point' 表示画全部猫猫点，'line' 表示画单只猫线
	
	// 存储请求到的数据
	const responseData = ref()

	// 将时间范围相关的函数改为单日
	const selectedDate = ref('');

	// 日期变化处理函数
	const onDateChange = (date) => {
		selectedDate.value = date;
		filterResults();
	};
	
	// 校猫选择器 列表内容
	const dataListCat = ref(); // text显示文(猫名)  value选中后的值   disable	是否禁用
	const selectedValueC = ref('all'); // 选中的猫
	// 点击选中某只小猫，发送请求，小猫最近10条坐标
	const onCatChange = (e) => { // e 即的小猫的value 也是catId
	  console.log('Selected value: ', e);
	  selectedValueC.value = e;
	  filterResults();
	};
	
	// 联动筛选方法
	const filterResults = () => {
		// 如果没有选择日期且猫咪选择的是all,显示所有猫咪最位置
		if (!selectedDate.value && (selectedValueC.value === 'all' || selectedValueC.value === '')) {
			uni.request({
				url: `${API_general_request_url.value}/api/cat/location/latest`,
				method: "GET",
				success: (response) => {
					if (response.statusCode === 200 && response.data.code === STATUS_CODE.SUCCESS) {
						responseData.value = response.data.data;
						mapDrawMode.value = 'point';
						path.value = responseData.value.map(item => [
							parseFloat((item.longitude || 0).toFixed(6)),
							parseFloat((item.latitude || 0).toFixed(6)),
							item.catName || '未知猫咪'
						]);
						map1.clearMap();
						map2.clearMap();
						mapDraw();
					}
				}
			});
			return;
		}

		// 构建请求参数
		let url = `${API_general_request_url.value}/api/cat/location`;
		let params = {};
		
		if (selectedDate.value && selectedValueC.value !== 'all' && selectedValueC.value !== '') {
			// 同时选择了日期和具体猫咪
			url += `/date/${selectedDate.value}/cat/${selectedValueC.value}`;
			params = {};
		} else if (selectedDate.value) {
			// 只选择了日期
			url += `/date/${selectedDate.value}`;
		} else if (selectedValueC.value !== 'all' && selectedValueC.value !== '') {
			// 只选择了具体猫咪
			url += `/${selectedValueC.value}`;
		}

		uni.request({
			url: url,
			method: "GET", 
			data: params,
			success: (response) => {
				if (response.statusCode === 200 && response.data.code === STATUS_CODE.SUCCESS) {
					responseData.value = response.data.data;
					// 如果是查询具体猫咪的轨迹(无论是否选择日期)
					if (selectedValueC.value !== 'all' && selectedValueC.value !== '') {
						mapDrawMode.value = 'line';
						if(selectedDate.value) {
							path.value = Array.isArray(responseData.value) ?
								responseData.value
									.filter(item => item.longitude != null && item.latitude != null)
									.map(item => [
										parseFloat((item.longitude || 0).toFixed(6)),
										parseFloat((item.latitude || 0).toFixed(6)),
										item.catName || '未知猫咪'
									]) :
								(responseData.value && responseData.value.longitude != null && responseData.value.latitude != null) ? 
									[[
										parseFloat((responseData.value.longitude || 0).toFixed(6)),
										parseFloat((responseData.value.latitude || 0).toFixed(6)),
										responseData.value.catName || '未知猫咪'
									]] : [];
						} else {
							path.value = response.data.data.records
								.filter(item => item.longitude != null && item.latitude != null)
								.map(item => [
									parseFloat((item.longitude || 0).toFixed(6)),
									parseFloat((item.latitude || 0).toFixed(6)),
									item.catName || '未知猫咪'
								]);
						}
					} else {
						mapDrawMode.value = 'point';
						path.value = Array.isArray(responseData.value) ?
							responseData.value
								.filter(item => item.longitude != null && item.latitude != null)
								.map(item => [
									parseFloat((item.longitude || 0).toFixed(6)),
									parseFloat((item.latitude || 0).toFixed(6)),
									item.catName || '未知猫咪'
								]) :
							(responseData.value && responseData.value.longitude != null && responseData.value.latitude != null) ?
								[[
									parseFloat((responseData.value.longitude || 0).toFixed(6)),
									parseFloat((responseData.value.latitude || 0).toFixed(6)),
									responseData.value.catName || '未知猫咪'
								]] : [];
					}
					
					// 只有在有有效数据时才清除和重绘地图
					if (path.value.length > 0) {
						map1.clearMap();
						map2.clearMap();
						mapDraw();
					} else {
						uni.showToast({
							title: '暂无有效的坐标数据',
							icon: 'none'
						});
					}
				}
			},
			complete: () => {
				isLoading.value = false;
			}
		});
	};
	
	onMounted(async () => {
		console.log('页面挂载');
		// 确保DOM已经渲染完成
		await nextTick();
		if (isFirstLoad.value) {
			isLoading.value = true;
			loadingText.value = '正在加载数据...';
			
			// 调用全局方法：查询全部小猫信息
			await getCatInfoDetail()
			// 添加"全部"选项为第一个选项
			dataListCat.value = [{
				text: '全部',
				value: 'all'
			}];
			// 将API返回的数据添加到列表中
			dataListCat.value.push(...appStore.catList.map(item =>({
				text: item.catname,
				value: item.catId
			})));
			uni.setStorageSync("catList",appStore.catList); // 同步存储整个猫猫列信息
			
			loadingText.value = '正在获取位置信息...';
			// 调用全局方法：请求全部小猫最新坐标
			await getCatLocationLatest();
			responseData.value = appStore.catLocations;
			mapDrawMode.value = 'point';
			// 添加数据验证和空值处理
			path.value = responseData.value
				.filter(item => item.longitude != null && item.latitude != null) // 过滤掉无效坐标
				.map(item => [
					parseFloat((item.longitude || 0).toFixed(6)), // 添加默认值
					parseFloat((item.latitude || 0).toFixed(6)),  
					item.catName || '未知猫咪'  // 添加默认名称
				]);
			
			loadingText.value = '正在初始化地图...';
			
			// #ifdef H5
			let retryCount = 0;
			const maxRetries = 3;
			
			const initMaps = async () => {
				try {
					// 设置高德地图安全密钥
					window._AMapSecurityConfig = {
						securityJsCode: "d099747db9129b84ab6ce834d56e9573",
					};
					
					// 加载高德地图
					AMap = await AMapLoader.load({
						key: "aada17cf2848387456285d0e1b5c74c6",
						version: "2.0",
						plugins: ["AMap.Scale","AMap.Geolocation", "AMap.Marker", "AMap.Polyline"],
					});
					
					// 创建地图实例
					map1 = new AMap.Map("mymap", {
						viewMode: "3D",
						zoom: 16,
						center: [113.390166, 22.527103],
						pitch: 45,
						rotation: 0,
						rotateEnable: true,
						pitchEnable: true,
						features: ['bg', 'road','name'],
						canvasRender: true,
						willReadFrequently: true
					});
					
					map2 = new AMap.Map("mymap2", {
						viewMode: "2D",
						zoom: 16,
						center: [113.390166, 22.527103],
						canvasRender: true,
						willReadFrequently: true
					});
					
					// 添加地图状态监听
					map2.on('complete', () => {
						console.log('2D地图加载完成');
					});

					map2.on('error', (error) => {
						console.error('2D地图错误:', error);
					});

					// 添加地图容器大小变化监听
					const resizeObserver = new ResizeObserver(() => {
						if (map2) {
							console.log('地图容器大小发生变化');
							map2.resize();
						}
					});

					// 监听地图容器大小变化
					const mapContainer2 = document.getElementById('mymap2');
					if (mapContainer2) {
						resizeObserver.observe(mapContainer2);
					}
					
					// 等待地图加载完成
					await Promise.all([
						new Promise(resolve => map1.on('complete', resolve)),
						new Promise(resolve => map2.on('complete', resolve))
					]);
					
					// 添加控件
					map1.addControl(new AMap.Scale());
					map1.addControl(new AMap.Geolocation());
					map2.addControl(new AMap.Scale());
					map2.addControl(new AMap.Geolocation());
					
					let url = process.env.NODE_ENV === 'development' ? "/static/realmap.jpg" : `${pic_general_request_url.value}/static_image/realmap.jpg`;
					const imageLayer = new AMap.ImageLayer({
						url: url,
						bounds: new AMap.Bounds(
							[113.386036, 22.523024],
							[113.396039, 22.532817]
						),
						opacity: 1,
					});
					
					// 只给3D地图添加校园地图图层
					map1.add(imageLayer);
					
					// 绘制地图
					if (path.value.length > 0) {
						mapDraw();
					}
					
				} catch (error) {
					console.error('地图初始化失败:', error);
					if (retryCount < maxRetries) {
						retryCount++;
						loadingText.value = `地图加载失败，正在重试(${retryCount}/${maxRetries})...`;
						await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
						return initMaps();
					} else {
						uni.showToast({
							title: '地图加载失败，请刷新页面重试',
							icon: 'none',
							duration: 3000
						});
					}
				}
			};
			
			await initMaps();
			// #endif
			
			// #ifdef APP-PLUS
			initAppMapData();
			// #endif
			
			isLoading.value = false;
			isFirstLoad.value = false;
		}
	});

	// #ifdef APP-PLUS
	// 初始化App端地图数据
	const initAppMapData = () => {
		try {
			if (mapDrawMode.value === 'point') {
				// 转换坐标点为App端markers格式
				appMarkers.value = path.value.map(point => ({
					id: Math.random().toString(),
					latitude: point[1],
					longitude: point[0],
					title: point[2],
					iconPath: '../static/redpoint12.svg',
					width: 20,
					height: 20
				}));
			} else if (mapDrawMode.value === 'line') {
				// 转换路径为App端polyline格式
				appPolyline.value = [{
					points: path.value.map(point => ({
						latitude: point[1],
						longitude: point[0]
					})),
					color: '#55ffff',
					width: 4
				}];
				
				// 添加起点和终点标记
				appMarkers.value = [
					{
						id: 'start',
						latitude: path.value[0][1],
						longitude: path.value[0][0],
						iconPath: '../static/startPoint.png',
						width: 26,
						height: 44
					},
					{
						id: 'end',
						latitude: path.value[path.value.length - 1][1],
						longitude: path.value[path.value.length - 1][0],
						iconPath: '../static/cat32.svg',
						width: 30,
						height: 40
					}
				];
			}
		} catch (error) {
			console.error('App地图数据初始化失败:', error);
			uni.showToast({
				title: 'App地图数据初始化失败',
				icon: 'none'
			});
		}
	};
	// #endif

	onUnmounted(() => {
		// #ifdef H5
		// 移除监听器
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
		
		// 销毁地图实例前记录状态
		if (map2) {
			console.log('销毁2D地图实例');
			map2.destroy();
			map2 = null;
		}
		if (map1) {
			console.log('销毁3D地图实例');
			map1.destroy();
			map1 = null;
		}
		// #endif
	});
	
	// 点击提交表单1按钮
	const submitForm = () => {
		console.log(baseFormData1.value)
		
		uni.request({
			url: `${API_general_request_url.value}/api/cat/location/upload`,
			method: 'POST',
			header: {
				'Authorization': `Bearer ${token.value}`
			},
			data: {
				'catId': baseFormData1.value.catId,
				'latitude': baseFormData1.value.latitude,
				'longitude': baseFormData1.value.longitude,
				// 'latitude': 22.527103,
				// 'longitude': 113.390166,
				'uploader': baseFormData1.value.name
			},
			success: (resp) => {
				if (resp.statusCode === 200 && resp.data.code === STATUS_CODE.SUCCESS) {
					uni.showToast({
						title: '提交成功',
						icon: 'none',
					});
					// 关闭上传表单
					popupFromUpload.value.close();
				} else {
					uni.showToast({
						title: resp.data.msg || '提交失败',
						icon: 'none',
					});
				};
			fail: () => {
				uni.showToast({
					title: '订单提交失败，请重试！',
					icon: 'none'
				});
			}
			}	
		})
	    // reportForm.value.validate((valid, errors) => {
	    //     if (valid) {
	    //         console.log('表单验证通过', baseFormData1.value);
	    //         // 提交数据逻辑
	    //     } else {
	    //         console.log('表单验证失败', errors);
	    //     }
	    // });
	};
	
	// 地图画图函数
	function mapDraw() {
		// 检查地图实例是否存在
		if (!map1 || !map2) {
			console.error('地图实例未初始化');
			return;
		}
		
		console.log('开始绘制地图:', mapDrawMode.value);
		console.log('路径数据:', path.value);
		
		try {
			if (mapDrawMode.value === 'point') {
				// 清除之前的标记
				map1.clearMap();
				map2.clearMap();
				
				path.value.forEach(marker => {
					if (!marker || marker.length < 3) {
						console.warn('无效的标记数据:', marker);
						return;
					}
					
					try {
						// 给地图1绘点
						map1catMarker = new AMap.Marker({
							position: [marker[0], marker[1]],
							icon: "../static/redpoint12.svg",
							offset: new AMap.Pixel(-20, -20),
						});
						map1catMarker.setMap(map1);
						map1catMarker.setLabel({
							offset: new AMap.Pixel(-17,-15),
							content: `<div class='mapLabelInfo'>${marker[2]}</div>`,
							direction: 'right'
						});
						
						// 给地图2绘点
						map2catMarker = new AMap.Marker({
							position: [marker[0], marker[1]],
							icon: "../static/redpoint12.svg",
							offset: new AMap.Pixel(-5, -5),
						});
						map2catMarker.setMap(map2);
						map2catMarker.setLabel({
							content: `<div class='mapLabelInfo'>${marker[2]}</div>`,
							direction: 'right'
						});
					} catch (error) {
						console.error('标记点绘制失败:', error, marker);
					}
				});
			} else if (mapDrawMode.value === 'line') {
				// 清除之前的标记
				map1.clearMap();
				map2.clearMap();
				
				if (path.value.length < 1) {
					console.warn('路径数据为空');
					return;
				}
				
				let linePath = path.value.map((item) => {
					return [item[0], item[1]];
				});
				
				// 画地图1的轨迹
				map1polyline = new AMap.Polyline({
					path: linePath,
					strokeColor: "#55ffff",
					strokeWeight: 4,
					strokeOpacity: 0.9,
				});
				map1.add(map1polyline);
				
				// 添加起点和终点标记
				let starMarker1 = new AMap.Marker({
					position: linePath[0],
					icon: "../static/startPoint.png",
					offset: new AMap.Pixel(-26, -44),
				});
				map1.add(starMarker1);
				
				let endMarker1 = new AMap.Marker({
					position: linePath[linePath.length - 1],
					icon: "../static/cat32.svg",
					offset: new AMap.Pixel(-15, -20),
				});
				map1.add(endMarker1);
				
				// 画地图2的轨迹
				map2polyline = new AMap.Polyline({
					path: linePath,
					strokeColor: "#55ffff",
					strokeWeight: 4,
					strokeOpacity: 0.9,
				});
				map2.add(map2polyline);
				
				let starMarker2 = new AMap.Marker({
					position: linePath[0],
					icon: "../static/startPoint.png",
					offset: new AMap.Pixel(-26, -44),
				});
				map2.add(starMarker2);
				
				let endMarker2 = new AMap.Marker({
					position: linePath[linePath.length - 1],
					icon: "../static/cat32.svg",
					offset: new AMap.Pixel(-10, -20),
				});
				map2.add(endMarker2);
			}
		} catch (error) {
			console.error('地图绘制失败:', error);
			uni.showToast({
				title: '地图绘制失败，请重试',
				icon: 'none'
			});
		}
	}
	
	// 打开上传照片
	const imagePath = ref('');
	const chooseImage = () => {
		isLoading.value = false; // 确保选择图片时不显示加载动画
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				imagePath.value = res.tempFilePaths[0];
				recognitionResult.value = null; // 清除之前的识别结果
			},
			fail: (err) => {
				uni.showToast({
					title: '选择图片失败',
					icon: 'none'
				});
			}
		});
	};
	
	// 修改定位权限检查函数
	function checkLocationPermission() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				// 定位成功
				(position) => {
					console.log('浏览器定位成功', position);
					baseFormData1.value.longitude = position.coords.longitude;
					baseFormData1.value.latitude = position.coords.latitude;
				},
				// 定位失败，尝试IP定位
				(error) => {
					console.error('浏览器定位失败，尝试IP定位', error);
					// 使用高德IP定位API
						uni.request({
							url: `https://restapi.amap.com/v3/ip?key=aada17cf2848387456285d0e1b5c74c6`,
							success: (res) => {
								if (res.data.status === '1' && res.data.rectangle) {
									// 从返回的rectangle中取中心点坐标
									const coords = res.data.rectangle.split(';')[0].split(',');
									baseFormData1.value.longitude = parseFloat(coords[0]);
									baseFormData1.value.latitude = parseFloat(coords[1]);
								} else {
									uni.showToast({
										title: '定位失败，请手动输入位置',
										icon: 'none',
										duration: 2000
									});
								}
							},
							fail: () => {
								uni.showToast({
									title: '定位服务不可用，请手动输入位置',
									icon: 'none',
									duration: 2000
								});
							}
						});
				},
				{
					enableHighAccuracy: true, // 高精度定位
					timeout: 5000, // 时时间：5秒
					maximumAge: 0 // 禁用缓存
				}
			);
		} else {
			console.log('浏览器不支持定位，直接使用IP定位');
			// 直接使用IP定位
			uni.request({
				url: `https://restapi.amap.com/v3/ip?key=aada17cf2848387456285d0e1b5c74c6`,
				success: (res) => {
					if (res.data.status === '1' && res.data.rectangle) {
						const coords = res.data.rectangle.split(';')[0].split(',');
						baseFormData1.value.longitude = parseFloat(coords[0]);
						baseFormData1.value.latitude = parseFloat(coords[1]);
					} else {
						uni.showToast({
							title: '定位失败，请手动输入位置',
							icon: 'none',
							duration: 2000
						});
					}
				},
				fail: () => {
					uni.showToast({
						title: '定位服务不可用，请手动输入位置',
						icon: 'none',
						duration: 2000
					});
				}
			});
		}
	}

	const popupPhotoUpload = ref(null); // 拍照识猫弹出层引用
	const recognitionResult = ref(null); // 识别结果

	// 提交照片进行识别
	const submitPhotoForRecognition = () => {
		if (!imagePath.value) {
			uni.showToast({
				title: '请先选择图片',
				icon: 'none'
			});
			return;
		}

		uni.showLoading({
			title: '正在识别中...'
		});

		// 上传图片并进行识别
		uni.uploadFile({
			url: `${API_general_request_url.value}/api/cat/prediction/predict`,
			filePath: imagePath.value,
			name: 'image',
			header: {
				'Authorization': `Bearer ${uni.getStorageSync('token')}`
			},
			success: (res) => {
				try {
					const result = JSON.parse(res.data);
					console.log('识别结果:', result);
					if (result.code === STATUS_CODE.SUCCESS && result.data.success) {
						const predictions = result.data.data.predictions;
						console.log('原始预测数据:', predictions);
						
						// 确保弹出层是打开的
						if (!popupPhotoUpload.value.isOpen) {
							popupPhotoUpload.value.open();
						}
						
						// 使用nextTick确保数据更新后再显示
						nextTick(() => {
							recognitionResult.value = {
								topThree: predictions.map(p => ({
									catName: `${p.breed_cn} (${p.breed_en})`,
									confidence: parseFloat(p.confidence)
								}))
							};
							console.log('更新后的结果:', recognitionResult.value);
						});
						
						uni.showToast({
							title: '识别成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: result.msg || '识别失败',
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('解析失败:', e, res.data);
					uni.showToast({
						title: '识别结果解析失败',
						icon: 'none'
					});
				}
			},
			fail: (err) => {
				console.error('请求失败:', err);
				uni.showToast({
					title: '识别请求失败',
					icon: 'none'
				});
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	};

	// 添加弹出层状态监听
	const handlePopupChange = (e) => {
		console.log('弹出层状态变化:', e);
		if (!e.show) {
			// 弹出层关闭时重置识别结果
			recognitionResult.value = null;
			imagePath.value = '';
		}
	};

	// const toBeDeveloped = (type) => {
	// 	if (type === 'catRecognition') {
	// 		// 重置状态
	// 		imagePath.value = '';
	// 		recognitionResult.value = null;
	// 		// 打开拍照识猫弹出层
	// 		popupPhotoUpload.value.open();
	// 	} else {
	// 		uni.showToast({
	// 			title: '待开发',
	// 			icon: 'error'
	// 		});
	// 	}
	// };

	// 添加页面显示/隐藏的生命周期钩子
	onActivated(() => {
		// 页面重新显示时，检查并重新初始化地图
		if (map2 && !map2.getSize().width) {
			console.log('检测到地图容器大小异常，尝试重新初始化');
			nextTick(() => {
				map2.resize();
			});
		}
	});
</script>

<style lang="scss" scoped>
.container {
	width: 750rpx;
	height: 94vh;
	background-color: #f5f5f5;
}

.layout {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	// padding-bottom: 140rpx; /* 为悬浮按钮预留空间 */
}

/* 顶部搜索区域 */
.header-section {
	background: #fff;
	padding: 20rpx;
	margin: 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.search-container {
	display: flex;
	gap: 20rpx;
}

.search-row {
	flex: 1;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 16rpx;
}

.search-item {
	display: flex;
	align-items: center;
}

.icon-label {
	display: flex;
	align-items: center;
	margin-right: 12rpx;
}

.icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 8rpx;
}

.label {
	font-size: 24rpx;
	color: #666;
}

.picker-container {
	flex: 1;
}

/* 地图区域 */
.map-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	padding: 0 20rpx;
	height: calc(94vh - 200rpx); /* 减去顶部搜索区域的高度 */
	overflow: hidden; /* 添加此行 */
}

// #ifdef H5
.map-section {
	flex: 1;
	min-height: 400rpx; /* 增加最小高度 */
	background: #fff;
	border-radius: 16rpx;
	position: relative;
	overflow: hidden;
	margin-bottom: 16rpx;
	display: flex; /* 添加此行 */
	flex-direction: column; /* 添加此行 */
	
	&:first-child {
		flex: 1.1; /* 让3D地图稍大一些 */
	}
	
	&:last-child {
		flex: 0.9;
		margin-bottom: 0; /* 修改此行 */
	}
}

.map-title {
	position: absolute;
	top: 12rpx;
	left: 12rpx;
	font-size: 24rpx;
	color: #666;
	background: rgba(255,255,255,0.9);
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
	z-index: 1;
	font-weight: 500;
}

#mymap, #mymap2 {
	width: 100%;
	height: 100%;
	min-height: 400rpx;
	position: relative; /* 添加此行 */
}
// #endif

.map-divider {
	height: 0rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 统计面板 */
.stats-panel {
	background: #fff;
	margin: 0 20rpx;
	padding: 16rpx;
	border-radius: 16rpx;
	display: flex;
	justify-content: space-around;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.stats-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
}

.stats-label {
	font-size: 22rpx;
	color: #666;
}

.stats-value {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

/* 悬浮按钮样式 */
::v-deep .uni-fab {
	.uni-fab__content {
		bottom: 120rpx !important;
	}
	
	.uni-fab__item {
		width: 110rpx !important;
		height: 110rpx !important;
		background: transparent !important;
	}
	
	.uni-fab__circle {
		width: 110rpx !important;
		height: 110rpx !important;
		background: #fff !important;
		box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1) !important;
	}
	
	.uni-fab__icon {
		width: 56rpx !important;
		height: 56rpx !important;
	}
}

/* 地图标注样式 */
::v-deep .mapLabelInfo {
	color: #333;
	background: rgba(255,255,255,0.9);
	padding: 4rpx 12rpx;
	border-radius: 4rpx;
	font-size: 20rpx;
	font-weight: 500;
    opacity: 0.8;
}

/* 去除地图logo */
::v-deep .amap-logo,
::v-deep .amap-copyright {
	display: none !important;
}

.popup-wrapper {
	.popup-content {
		min-height: 65vh;
		max-height: 85vh;
		padding: 40rpx;
		border-radius: 40rpx 40rpx 0 0;
		background: #fff;
		transition: all 0.3s ease;
		overflow-y: auto;
		
		&.photo-upload-content {
			display: flex;
			flex-direction: column;
			gap: 20rpx;
			
			.popup-header {
				flex-shrink: 0;
			}
			
			.photo-container {
				flex-shrink: 0;
			}
			
			.recognition-result {
				// margin-top: 20rpx;
				padding: 20rpx;
				background: #f8f9fa;
				border-radius: 16rpx;
				animation: slideUp 0.3s ease-out;
			}
		}
	}
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

// 优化滚动条样式
::-webkit-scrollbar {
	width: 6rpx;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: #ddd;
	border-radius: 3rpx;
}

::-webkit-scrollbar-thumb:hover {
	background: #ccc;
}

.popup-header {
	text-align: center;
	margin-bottom: 50rpx;
	position: relative;
	
	&::after {
		content: '';
		position: absolute;
		bottom: -20rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 6rpx;
		background: linear-gradient(to right, #ff6b81, #ffa5b5);
		border-radius: 3rpx;
	}
}

.popup-title {
	font-size: 40rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 12rpx;
}

.popup-subtitle {
	font-size: 26rpx;
	color: #666;
}

.form-container {
	::v-deep .uni-forms-item {
		margin-bottom: 30rpx;
		
		.uni-forms-item__label {
			font-size: 28rpx;
			color: #333;
			margin-bottom: 12rpx;
			font-weight: 500;
		}
		
		.uni-easyinput__content,
		.uni-data-select {
			background: #f8f9fa;
			border-radius: 16rpx;
			border: 2rpx solid #eee;
			height: 80rpx;
			padding: 0 24rpx;
			transition: all 0.3s ease;
			
			&:focus-within {
				border-color: #ff6b81;
				box-shadow: 0 0 0 2rpx rgba(255,107,129,0.1);
				background: #fff;
			}
			
			.uni-easyinput__placeholder-class {
				color: #999;
			}
		}
	}
}

.location-inputs {
	display: flex;
	gap: 24rpx;
	
	::v-deep .uni-easyinput__content {
		flex: 1;
	}
}

.submit-btn {
	width: 100%;
	height: 90rpx;
	background: linear-gradient(135deg, #ff6b81, #ffa5b5);
	border: none;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 50rpx;
	box-shadow: 0 8rpx 20rpx rgba(255,107,129,0.2);
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 10rpx rgba(255,107,129,0.2);
	}
}

.btn-text {
	color: #da5757;
	font-size: 32rpx;
	font-weight: 600;
	letter-spacing: 2rpx;
}

/* 拍照识猫弹出层样式 */
.photo-upload-content {
	.photo-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20rpx;
		// margin: 20rpx 0;
		
		.image-container {
			width: 100%;
			height: 360rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #f8f9fa;
			border-radius: 20rpx;
			overflow: hidden;
		}

		.preview-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		.upload-placeholder {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 20rpx;
		}

		.camera-icon {
			width: 80rpx;
			height: 80rpx;
			opacity: 0.5;
		}

		.upload-text {
			font-size: 28rpx;
			color: #999;
		}

		.button-group {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 16rpx;
			width: 100%;
			margin-top: 0rpx;
		}

		.photo-btn {
			width: 300rpx;
			height: 80rpx;
			background: #f8f9fa;
			border: 2rpx solid #eee;
			border-radius: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s ease;
			
			&:active {
				background: #fff;
				border-color: #ff6b81;
			}
			
			.btn-text {
				color: #666;
				font-size: 28rpx;
			}
		}

		.recognition-btn {
			width: 300rpx;
			height: 80rpx;
			background: linear-gradient(135deg, #ff6b81, #ffa5b5);
			border: none;
			border-radius: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 8rpx 20rpx rgba(255,107,129,0.2);
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.98);
				box-shadow: 0 4rpx 10rpx rgba(255,107,129,0.2);
			}
			
			.btn-text {
				color: #fff;
				font-size: 32rpx;
				font-weight: 600;
				letter-spacing: 2rpx;
			}
		}
	}

	.recognition-result {
		width: 100%;
		background: #f8f9fa;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-top: 0rpx;

		.result-title {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 16rpx;
			display: block;
		}

		.result-content {
            width: 90%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #fff;
			padding: 16rpx 20rpx;
			border-radius: 12rpx;
			margin-bottom: 12rpx;
			
			&.top-result {
				background: linear-gradient(135deg, #ff6b81, #ffa5b5);
				.cat-name, .confidence {
					color: #fff;
				}
				.rank-badge {
					background: #fff;
					color: #ff6b81;
				}
			}
			
			&:last-child {
				margin-bottom: 0;
			}
		}

		.result-left {
			display: flex;
			align-items: center;
			gap: 12rpx;
		}

		.rank-badge {
			width: 40rpx;
			height: 40rpx;
			background: #f8f9fa;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			color: #666;
			font-weight: bold;
		}

		.cat-name {
			font-size: 32rpx;
			color: #333;
			font-weight: 600;
		}

		.confidence {
			font-size: 28rpx;
			color: #666;
			font-weight: 500;
		}
	}
}

.popup-content {
	&.photo-upload-content {
		.popup-header {
			text-align: center;
			margin-bottom: 20rpx;
			
			.popup-title {
				font-size: 36rpx;
				font-weight: 600;
				color: #333;
				display: block;
				margin-bottom: 10rpx;
			}
			
			.popup-subtitle {
				font-size: 28rpx;
				color: #666;
				display: block;
				margin-bottom: 16rpx;
			}
			
			.popup-tips {
				font-size: 24rpx;
				color: #999;
				display: block;
				line-height: 1.5;
				padding: 20rpx;
				background: #f8f9fa;
				border-radius: 12rpx;
				margin: 0 20rpx;
			}
		}
	}
}

// 添加加载动画样式
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 94vh;
	background-color: rgba(255, 255, 255, 0.9);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.loading-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 100rpx;
}

.loading-image {
	width: 200rpx;
	height: 200rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #666;
	text-align: center;
}
</style>
