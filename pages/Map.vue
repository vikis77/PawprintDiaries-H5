<template>
	<view class="container">
		<!-- 加载动画 -->
		<view class="loading-overlay" v-if="isLoading">
			<view class="loading-content">
				<img class="loading-image" src="../static/loading-cat.gif" mode="aspectFit"/>
				<text class="loading-text">{{loadingText}}</text>
			</view>
		</view>

        <view class="header-section">
            <uni-section title="寻猫日迹" titleFontSize="40rpx" type="line">
            </uni-section>
        </view>
		
		<!-- 主体内容 -->
		<view class="layout" @click="handleLayoutClick">
			<!-- 地图区域 -->
			<view class="map-container">
				<!-- #ifdef H5 -->
				<!-- 3D地图 -->
				<view class="map1-section" :style="{ height: map1Height + 'px' }">
					<div class="map-type-label">3D地图</div>
					<div class="map-box" id="mymap"></div>
				</view>
				
				<!-- 拖动手柄 -->
				<view class="map-resizer" 
					@mousedown="startResize" 
					@mousemove="onResize"
					@mouseup="endResize"
					@mouseleave="endResize"
					@touchstart="startResize" 
					@touchmove="onResize"
					@touchend="endResize">
					<view class="resizer-line"></view>
					<view class="resizer-handle">
						<view class="handle-dot"></view>
						<view class="handle-dot"></view>
						<view class="handle-dot"></view>
					</view>
				</view>
				
				<!-- 2D地图 -->
				<view class="map2-section" :style="{ height: map2Height + 'px' }">
					<div class="map-type-label">平面地图</div>
					<div class="map-box" id="mymap2"></div>
				</view>
				<!-- #endif -->

				<!-- #ifdef APP-PLUS -->
				<view class="map1-section">
					<map class="map-box"
						:latitude="22.527103"
						:longitude="113.390166"
						:markers="appMarkers"
						:polyline="appPolyline"
						scale="16"
						show-location>
					</map>
				</view>
				<!-- #endif -->
			</view>

			<!-- 底部功能区 -->
			<view class="bottom-area" 
				:class="{'expanded': isBottomExpanded}"
				@touchstart.stop="startDrag"
				@touchmove.stop.prevent="onDrag"
				@touchend.stop="endDrag"
				@touchcancel.stop="endDrag">
				<!-- 顶部拖动条 -->
				<view class="drag-bar">
					<view class="drag-handle"></view>
				</view>
				
				<!-- 功能区内容 -->
				<scroll-view class="bottom-content" 
					scroll-y 
					ref="bottomContent"
					@touchstart.stop="handleContentTouch"
					@touchmove.stop="handleContentMove"
					@touchend.stop="handleContentEnd"
					@touchcancel.stop="handleContentEnd">
					<!-- 功能按钮区 -->
					<view class="function-buttons">
						<view class="function-btn" @click="openUploadForm">
							<image class="btn-icon" src="https://cdn.luckyiur.com/catcat/static_image/V1_report.png" mode="aspectFit"></image>
							<text class="btn-text">发现小猫</text>
						</view>
						<view class="function-btn" @click="openPhotoUpload">
							<image class="btn-icon" src="https://cdn.luckyiur.com/catcat/static_image/aichong32.png" mode="aspectFit"></image>
							<text class="btn-text">拍猫识别</text>
						</view>
						<view class="function-btn" @click="handleRefresh">
							<image class="btn-icon refresh-icon" :class="{ 'refreshing': isRefreshing }" src="https://cdn.luckyiur.com/catcat/static_image/refresh.png" mode="aspectFit"></image>
							<text class="btn-text">内容重置</text>
						</view>
					</view>

					<!-- 筛选区域 -->
					<view class="filter-section">
                        <!-- 日期选择 -->
						<view class="filter-row">
							<view class="filter-icon">
								<img class="icon" src="../static/time2.png" mode="aspectFill"/>
							</view>
							<uni-datetime-picker 
								class="filter-input"
								@click="handleDatePickerClick"
								@tap="handleDatePickerClick"
								v-model="selectedDate"
								type="date"
								:clear-icon="true"
								@change="onDateChange"
								@maskClick="handleDatePickerCancel"
								@cancel="handleDatePickerCancel"
								:border="false"
							></uni-datetime-picker>
						</view>

                        <!-- 猫咪选择 -->
						<view class="filter-row">
							<view class="filter-icon">
								<img class="icon" src="../static/cat007.png" mode="aspectFill"/>
							</view>
							<view class="filter-input">
								<uni-data-select
									:border="false"
									placeholder="选择要查看的猫咪"
									v-model="selectedValueC"
									:localdata="dataListCat"
									@change="onCatChange"
									popupTop
								/>
							</view>
						</view>
					</view>

					<!-- 轨迹信息 -->
					<view class="track-info" v-if="path.length > 0">
						<view class="track-timeline">
							<view class="timeline-item" v-for="(point, index) in path" :key="index">
								<view class="timeline-dot" :class="{'start': index === 0, 'end': index === path.length - 1}"></view>
								<view class="timeline-content">
									<text class="location-name">{{point[2]}}</text>
									<text class="location-time">更新时间：{{formatTime(point[3])}}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			
			<!-- 悬浮按钮 -->
			<!-- <uni-fab 
				ref="fab"
				:pattern="pattern"
				:content="content"
				:horizontal="horizontal"
				:vertical="vertical"
				:direction="direction"
				@trigger="trigger"
				@fabClick="fabClick"
			/> -->
			
			<!-- 底部弹出层 (上传表单)-->
			<uni-popup ref="popupFromUpload" type="bottom" background-color="#fff" @change="change">
                <view class="popup-content form-upload-content">
                    <view class="popup-header">
                        <text class="popup-title">报告小猫踪迹！</text>
                        <text class="popup-subtitle">帮助我们记录校园猫咪的足迹</text>
                    </view>
                    <view class="form-container">
                        <uni-forms ref="reportForm" :model="baseFormData1" :rules="baseFormRules">
                            <uni-forms-item label="小猫名字" required>
                                <uni-data-select
                                    v-model="baseFormData1.catId"
                                    :localdata="dataListCatForReport"
                                    @change="change"
                                    placeholder="你发现了哪一只小猫？"
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
</template>

<script setup>
	import { onMounted, onUnmounted, ref, nextTick, onActivated, watch } from "vue";
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
		// 当弹出层打开时
		if (e.show) {
			// 设置加载状态
			baseFormData1.value.longitude = '获取位置中...';
			baseFormData1.value.latitude = '获取位置中...';
			baseFormData1.value.name = uni.getStorageSync('tokenDetail')?.username || '';
			
			// 获取位置信息
			checkLocationPermission();
		}
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
			trigger: ['blur', 'change']
		},
		longitude: {
			required: true,
			message: '经度不能为空',
			trigger: ['blur', 'change'],
			pattern: /^(\-|\+)?((\d|[1-9]\d|1[0-7]\d|0{1,3})(\.\d{1,6})?|180(\.0{1,6})?)$/,
			message: '请输入有效的经度值（-180到180之间，最多6位小数）'
		},
		latitude: {
			required: true,
			message: '纬度不能为空',
			trigger: ['blur', 'change'],
			pattern: /^(\-|\+)?((\d|[1-8]\d|0{1,3})(\.\d{1,6})?|90(\.0{1,6})?)$/,
			message: '请输入有效的纬度值（-90到90之间，最多6位小数）'
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
	const isDatePickerOpen = ref(false);

	// 日期变化处理函数
	const onDateChange = (date) => {
		selectedDate.value = date;
		isDatePickerOpen.value = false;
		filterResults();
	};
	
	// 校猫选择器 列表内容
	const dataListCat = ref(); // text显示文(猫名)  value选中后的值   disable	是否禁用
	const dataListCatForReport = ref(); // text显示文(猫名)  value选中后的值   disable	是否禁用
	const selectedValueC = ref('all'); // 选中的猫
	// 点击选中某只小猫，发送请求，小猫最近10条坐标
	const onCatChange = (e) => { // e 即的小猫的value 也是catId
	  console.log('Selected value: ', e);
	  selectedValueC.value = e;
	  filterResults();
	};
	
	// 联动筛选方法
	const filterResults = () => {
		// 先清除地图上已有的标记
		if (map1 && map2) {
			map1.clearMap();
			map2.clearMap();
		}

		// 如果没有选择日期且猫咪选择的是all,显示所有猫咪最位置
		if (!selectedDate.value && (selectedValueC.value === 'all' || selectedValueC.value === '')) {
			uni.request({
				url: `${API_general_request_url.value}/api/cat/location/latest`,
				method: "GET",
				success: (response) => {
					if (response.statusCode === 200 && response.data.code === STATUS_CODE.SUCCESS) {
						responseData.value = response.data.data;
						mapDrawMode.value = 'point';
						
						// 检查数据是否为空
						if (Array.isArray(responseData.value) && responseData.value.length > 0) {
							path.value = responseData.value.map(item => [
								parseFloat((item.longitude || 0).toFixed(6)),
								parseFloat((item.latitude || 0).toFixed(6)),
								item.catName || '未知猫咪',
								item.updateTime // 添加时间戳
							]);
							mapDraw();
						} else {
							path.value = [];
							uni.showToast({
								title: '暂无有效的坐标数据',
								icon: 'none'
							});
						}
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
					path.value = []; // 默认设置为空数组
					
					// 如果是查询具体猫咪的轨迹(无论是否选择日期)
					if (selectedValueC.value !== 'all' && selectedValueC.value !== '') {
						mapDrawMode.value = 'line';
						if(selectedDate.value) {
							if (Array.isArray(responseData.value) && responseData.value.length > 0) {
								path.value = responseData.value
									.filter(item => item.longitude != null && item.latitude != null)
									.map(item => [
										parseFloat((item.longitude || 0).toFixed(6)),
										parseFloat((item.latitude || 0).toFixed(6)),
										item.catName || '未知猫咪',
										item.updateTime // 添加时间戳
									]);
							} else if (responseData.value && responseData.value.longitude != null && responseData.value.latitude != null) {
								path.value = [[
									parseFloat((responseData.value.longitude || 0).toFixed(6)),
									parseFloat((responseData.value.latitude || 0).toFixed(6)),
									responseData.value.catName || '未知猫咪',
									responseData.value.updateTime // 添加时间戳
								]];
							}
						} else if (response.data.data && response.data.data.records) {
							if (Array.isArray(response.data.data.records) && response.data.data.records.length > 0) {
								path.value = response.data.data.records
									.filter(item => item.longitude != null && item.latitude != null)
									.map(item => [
										parseFloat((item.longitude || 0).toFixed(6)),
										parseFloat((item.latitude || 0).toFixed(6)),
										item.catName || '未知猫咪',
										item.updateTime // 添加时间戳
									]);
							}
						}
					} else {
						mapDrawMode.value = 'point';
						if (Array.isArray(responseData.value) && responseData.value.length > 0) {
							path.value = responseData.value
								.filter(item => item.longitude != null && item.latitude != null)
								.map(item => [
									parseFloat((item.longitude || 0).toFixed(6)),
									parseFloat((item.latitude || 0).toFixed(6)),
									item.catName || '未知猫咪',
									item.updateTime // 添加时间戳
								]);
						} else if (responseData.value && responseData.value.longitude != null && responseData.value.latitude != null) {
							path.value = [[
								parseFloat((responseData.value.longitude || 0).toFixed(6)),
								parseFloat((responseData.value.latitude || 0).toFixed(6)),
								responseData.value.catName || '未知猫咪',
								responseData.value.updateTime // 添加时间戳
							]];
						}
					}
					
					// 检查最终的path是否有数据
					if (path.value.length > 0) {
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
	
	onShow(async () => {
		console.log('页面挂载');

        // 检查用户token是否过期
        const token = uni.getStorageSync('token');
        if (token) {
            try {
                // 解析token获取过期时间
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const expTime = tokenData.exp * 1000; // 转换为毫秒
                
                // 判断token是否过期
                if (Date.now() >= expTime) {
                    // token已过期,清除本地存储的token和用户信息
                    uni.removeStorageSync('token');
                    uni.removeStorageSync('userInfo');
                    console.log('token已过期,已清除用户登录信息');
                }
            } catch (error) {
                console.error('token解析失败:', error);
                // token格式错误,清除token
                uni.removeStorageSync('token');
                uni.removeStorageSync('userInfo');
            }
        }

		// 确保DOM已经渲染完成
		await nextTick();
        
		if (isFirstLoad.value || 1) {
			isLoading.value = true;
			loadingText.value = '正在加载数据...';
			
            // 调用全局方法：查询全部小猫信息
            await getCatInfoDetail()
            // 清除旧的猫猫信息
            dataListCat.value = null
            dataListCatForReport.value = []

			// 添加"全部"选项为第一个选项
			dataListCat.value = [{
				text: '全部',
				value: 'all'
			}];
			// 将API返回的数据添加到列表中
			dataListCat.value.push(...appStore.catList.map(item =>({
				text: item.catname + ' - ' + (item.gender === 1 ? '公' : '母') + ' - ' + item.age + '个月',
				value: item.catId
			})));
            // 报告小猫列表不需要"全部"选项
            dataListCatForReport.value.push(...appStore.catList.map(item =>({
				text: item.catname + ' - ' + (item.gender === 1 ? '公' : '母') + ' - ' + item.age + '个月',
				value: item.catId
			})));
			// uni.setStorageSync("catList",appStore.catList); // 同步存储整个猫猫列信息
			
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
					item.catName || '未知猫咪',  // 添加默认名称
					item.updateTime // 添加时间戳
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
						mapStyle: 'amap://styles/normal',
						showLabel: false,
					});
					
					map2 = new AMap.Map("mymap2", {
						viewMode: "2D",
						zoom: 16,
						center: [113.390166, 22.527103],
						mapStyle: 'amap://styles/normal',
						showLabel: false,
					});

					// 添加地图点击事件监听
					const handleMapClick = (e) => {
						// 获取点击事件的原始DOM事件
						const domEvent = e.originEvent || e;
						const target = domEvent.target;
						
						// 检查点击的元素是否是地图容器或其子元素
						const isMapCanvas = target.classList.contains('amap-maps') || 
										   target.classList.contains('amap-layer') ||
										   target.classList.contains('amap-canvas');
						
						// 如果是地图画布区域，则收起功能区
						if (isMapCanvas) {
							isBottomExpanded.value = false;
						}
					};

					// 为两个地图都添加点击事件监听
					map1.on('click', handleMapClick);
					map2.on('click', handleMapClick);

					// 调整logo位置和样式
					map1.on('complete', () => {
						const logoEle = document.querySelector('#mymap .amap-logo');
						const copyrightEle = document.querySelector('#mymap .amap-copyright');
						if (logoEle) {
							logoEle.style.zIndex = '1';
							logoEle.style.bottom = '0';
							logoEle.style.left = '0';
						}
						if (copyrightEle) {
							copyrightEle.style.zIndex = '1';
							copyrightEle.style.bottom = '0';
							copyrightEle.style.right = '0';
						}
					});

					map2.on('complete', () => {
						const logoEle = document.querySelector('#mymap2 .amap-logo');
						const copyrightEle = document.querySelector('#mymap2 .amap-copyright');
						if (logoEle) {
							logoEle.style.zIndex = '1';
							logoEle.style.bottom = '0';
							logoEle.style.left = '0';
						}
						if (copyrightEle) {
							copyrightEle.style.zIndex = '1';
							copyrightEle.style.bottom = '0';
							copyrightEle.style.right = '0';
						}
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
		// 先检查必填字段
		if (!baseFormData1.value.catId) {
			uni.showToast({
				title: '请选择小猫',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		if (!baseFormData1.value.name) {
			uni.showToast({
				title: '请输入上报者名称',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		// 验证坐标格式
		if (!baseFormData1.value.longitude || !baseFormData1.value.latitude) {
			uni.showToast({
				title: '请输入坐标信息',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		const longitude = parseFloat(baseFormData1.value.longitude);
		const latitude = parseFloat(baseFormData1.value.latitude);
		
		// 检查小数位数
		const checkDecimalPlaces = (value) => {
			const parts = value.toString().split('.');
			return parts.length === 2 && parts[1].length > 7;
		};

		if (checkDecimalPlaces(baseFormData1.value.longitude)) {
			uni.showToast({
				title: '经度最多支持7位小数',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		if (checkDecimalPlaces(baseFormData1.value.latitude)) {
			uni.showToast({
				title: '纬度最多支持7位小数',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		if (isNaN(longitude) || isNaN(latitude)) {
			uni.showToast({
				title: '请输入有效的坐标值',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		if (longitude < -180 || longitude > 180) {
			uni.showToast({
				title: '经度必须在-180到180之间',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		if (latitude < -90 || latitude > 90) {
			uni.showToast({
				title: '纬度必须在-90到90之间',
				icon: 'none',
				duration: 2000
			});
			return;
		}

		// 提交数据
		uni.request({
			url: `${API_general_request_url.value}/api/cat/location/upload`,
			method: 'POST',
			header: {
				'Authorization': `Bearer ${token.value}`,
				'Content-Type': 'application/json'
			},
			data: {
				'catId': Number(baseFormData1.value.catId), // 确保catId是数字类型
				'latitude': latitude,
				'longitude': longitude,
				'uploader': baseFormData1.value.name,
				'updateTime': new Date().getTime() // 添加时间戳
			},
			success: (resp) => {
				if (resp.statusCode === 200 && resp.data.code === STATUS_CODE.SUCCESS) {
					uni.showToast({
						title: '提交成功',
						icon: 'none',
						duration: 2000
					});
					// 延迟2秒后关闭上传表单
					setTimeout(() => {
						popupFromUpload.value.close();
					}, 2000);
				} else {
					uni.showToast({
						title: resp.data.msg || '提交失败',
						icon: 'none',
					});
				}
			},
			
			fail: (err) => {
				console.error('提交失败:', err);
				uni.showToast({
					title: '提交失败，请重试！',
					icon: 'none'
				});
			}
		});
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
				// 清除之前的标记和事件监听器
				map1.clearMap();
				map2.clearMap();
				
				// 移除之前的事件监听器
				const map1Container = document.getElementById('mymap');
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
							content: `<div class='mapLabelInfo' data-cat-name="${marker[2]}">${marker[2]}</div>`,
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
							content: `<div class='mapLabelInfo' data-cat-name="${marker[2]}">${marker[2]}</div>`,
							direction: 'right'
						});
					} catch (error) {
						console.error('标记点绘制失败:', error, marker);
					}
				});

				// 为地图添加标签点击事件委托
				const handleLabelClick = (e) => {
					const labelElement = e.target.closest('.mapLabelInfo');
					if (!labelElement) return; // 如果点击的不是标签元素，直接返回
					
					e.stopPropagation(); // 阻止事件冒泡
					const catName = labelElement.dataset.catName;
					console.log('点击的猫咪名称:', catName);
					
					// 在dataListCat中查找对应的猫咪数据
					const catData = dataListCat.value.find(cat => {
						const catNameFromText = cat.text.split(' - ')[0]; // 只取名字部分
						return catNameFromText === catName;
					});
					
					if (!catData) {
						console.warn('未找到对应的猫咪数据:', catName);
						return;
					}
					
					// 如果底部功能区是展开的，执行筛选
					if (isBottomExpanded.value) {
						selectedValueC.value = catData.value;
						filterResults();
					} else {
						// 如果底部功能区是收起的，跳转到猫咪卡片页面
						// 使用navigateTo，并确保只触发一次
						e.preventDefault();
						const url = `Card?catId=${catData.value}`;
						// 防止重复跳转
						if (!window.isNavigating) {
							window.isNavigating = true;
							uni.navigateTo({
								url: url,
								complete: () => {
									// 重置标志
									setTimeout(() => {
										window.isNavigating = false;
									}, 500);
								}
							});
						}
					}
				};

				// 移除旧的事件监听器
				const removeOldListeners = () => {
					const map1El = document.getElementById('mymap');
					const map2El = document.getElementById('mymap2');
					if (map1El) {
						map1El.removeEventListener('click', handleLabelClick);
					}
					if (map2El) {
						map2El.removeEventListener('click', handleLabelClick);
					}
				};

				// 先移除旧的监听器
				removeOldListeners();

				// 添加新的事件监听器
				document.getElementById('mymap')?.addEventListener('click', handleLabelClick);
				document.getElementById('mymap2')?.addEventListener('click', handleLabelClick);
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
							// 先重置结果
							recognitionResult.value = null;
							
							// 添加一个短暂延迟，让重置动画有时间执行
							setTimeout(() => {
								recognitionResult.value = {
									topThree: predictions.map(p => ({
										catName: `${p.breed_cn} (${p.breed_en})`,
										confidence: parseFloat(p.confidence)
									}))
								};
								
								// 添加结果类名，触发高度动画
								const popupContent = document.querySelector('.photo-upload-content');
								if (popupContent) {
									popupContent.classList.add('has-result');
								}
								
								console.log('更新后的结果:', recognitionResult.value);
							}, 100);
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
			// 弹出层关闭时重置识别结果和类名
			recognitionResult.value = null;
			const popupContent = document.querySelector('.photo-upload-content');
			if (popupContent) {
				popupContent.classList.remove('has-result');
			}
			imagePath.value = '';
		}
	};

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

	const isRefreshing = ref(false);

	// 添加刷新功能
	const handleRefresh = async () => {
		if (isRefreshing.value) return;
		
		isRefreshing.value = true;
		isLoading.value = true;
		loadingText.value = '正在刷新页面...';
		
		try {
			// 重置筛选条件
			selectedDate.value = '';
			selectedValueC.value = 'all';
			
			// 重新获取猫咪信息
			await getCatInfoDetail();
			// 更新猫咪选择器数据
			dataListCat.value = [{
				text: '全部',
				value: 'all'
			}];
			dataListCat.value.push(...appStore.catList.map(item =>({
				text: item.catname,
				value: item.catId
			})));
            dataListCatForReport.value.push(...appStore.catList.map(item =>({
				text: item.catname,
				value: item.catId
			})));
			uni.setStorageSync("catList", appStore.catList);
			
			// 重新获取位置信息
			await getCatLocationLatest();
			responseData.value = appStore.catLocations;
			mapDrawMode.value = 'point';
			path.value = responseData.value
				.filter(item => item.longitude != null && item.latitude != null)
				.map(item => [
					parseFloat((item.longitude || 0).toFixed(6)),
					parseFloat((item.latitude || 0).toFixed(6)),
					item.catName || '未知猫咪',
					item.updateTime // 添加时间戳
				]);
			
			// #ifdef H5
			// 重置地图视图和比例
			if (map1) {
				map1.clearMap();
				// 重置地图位置和视角
				map1.setZoomAndCenter(16, [113.390166, 22.527103], false, 500);
				map1.setPitch(45);
				map1.setRotation(0);
				// 重置地图高度
				map1Height.value = DEFAULT_MAP1_HEIGHT;
			}
			if (map2) {
				map2.clearMap();
				// 重置地图位置和视角
				map2.setZoomAndCenter(16, [113.390166, 22.527103], false, 500);
				// 重置地图高度
				map2Height.value = DEFAULT_MAP2_HEIGHT;
			}

			// 重新调整地图大小
			nextTick(() => {
				if (map1 && map2) {
					map1.resize();
					map2.resize();
				}
			});
			// #endif
			
			// #ifdef APP-PLUS
			// 重置App端地图数据
			initAppMapData();
			// #endif
			
			// 重新绘制地图
			if (path.value.length > 0) {
				mapDraw();
			}
			
			// 收起底部功能区
			isBottomExpanded.value = false;
			
		} catch (error) {
			console.error('刷新失败:', error);
			uni.showToast({
				title: '刷新失败',
				icon: 'error'
			});
		} finally {
			isRefreshing.value = false;
			isLoading.value = false;
		}
	};

	// 添加返回函数
	const goBack = () => {
		uni.navigateBack();
	}

	// 添加时间格式化函数
	const formatTime = (timestamp) => {
		if (!timestamp) return '时间未知';
		const date = new Date(timestamp);
		
		// 格式化年月日
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		
		// 格式化时分秒
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	// 底部面板相关
	const isBottomExpanded = ref(false);
	const startY = ref(0);
	const isDragging = ref(false);
	const bottomContent = ref(null);
	let touchStartTime = 0;
	let initialTouchY = 0;
	let lastContentScrollTop = 0;
	let lastTouchY = 0;
	let isContentDragging = false;
	let contentTouchStartY = 0;

	// 检查是否是内容区域的点击
	const isContentArea = (e) => {
		// 获取事件触发的元素信息
		if (!e || !e.currentTarget) return false;
		
		// 检查事件的目标元素
		const currentTarget = e.currentTarget;
		const mpTarget = e.mp?.target;  // 获取小程序的target信息
		
		// 检查是否包含特定的类名
		const checkClassName = (className) => {
			if (typeof className === 'string') {
				// 检查是否是可滚动内容区域
				return className.includes('bottom-content') && 
					   (className.includes('function-buttons') ||
					    className.includes('filter-section') ||
					    className.includes('track-info'));
			}
			return false;
		};
		
		// 检查当前元素和父元素
		if (currentTarget) {
			if (checkClassName(currentTarget.className)) return true;
		}
		
		// 检查小程序target信息
		if (mpTarget) {
			if (checkClassName(mpTarget.className)) return true;
		}
		
		return false;
	};

	// 处理内容区域的触摸事件
	const handleContentTouch = (e) => {
		const scrollView = bottomContent.value;
		if (!scrollView) return;
		
		contentTouchStartY = e.touches[0].clientY;
		isContentDragging = true;
		lastContentScrollTop = scrollView.scrollTop || 0;
		
		// 同时记录拖动起始位置
		touchStartTime = Date.now();
		initialTouchY = contentTouchStartY;
		isDragging.value = true;
	};

	const handleContentMove = (e) => {
		if (!isContentDragging) return;
		
		const scrollView = bottomContent.value;
		if (!scrollView) return;
		
		const currentY = e.touches[0].clientY;
		const deltaY = currentY - contentTouchStartY;
		
		// 如果内容已经滚动到顶部，并且继续下拉
		if (scrollView.scrollTop <= 0 && deltaY > 0) {
			if (deltaY > 30 && isBottomExpanded.value) { // 添加一个阈值，避免轻微触摸就收起
				isBottomExpanded.value = false;
				isContentDragging = false;
				isDragging.value = false;
			}
		}
		// 如果内容已经滚动到底部，并且继续上拉
		else if (scrollView.scrollHeight - scrollView.scrollTop <= scrollView.clientHeight + 1 && deltaY < 0) {
			if (deltaY < -30 && !isBottomExpanded.value) {
				isBottomExpanded.value = true;
				isContentDragging = false;
				isDragging.value = false;
			}
		}
	};

	const handleContentEnd = (e) => {
		if (!isContentDragging) return;
		
		const scrollView = bottomContent.value;
		if (!scrollView) return;
		
		const currentY = e.changedTouches[0].clientY;
		const deltaY = currentY - contentTouchStartY;
		const duration = Date.now() - touchStartTime;
		const velocity = Math.abs(deltaY) / duration;
		
		// 如果是在顶部或底部的快速滑动
		if (velocity > 0.3 || Math.abs(deltaY) > 50) {
			if (scrollView.scrollTop <= 0 && deltaY > 0 && isBottomExpanded.value) {
				isBottomExpanded.value = false;
			} else if (scrollView.scrollHeight - scrollView.scrollTop <= scrollView.clientHeight + 1 && 
					   deltaY < 0 && !isBottomExpanded.value) {
				isBottomExpanded.value = true;
			}
		}
		
		isContentDragging = false;
		isDragging.value = false;
	};

	// 开始拖动（底部区域）
	const startDrag = (e) => {
		touchStartTime = Date.now();
		initialTouchY = e.touches[0].clientY;
		lastTouchY = initialTouchY;
		isDragging.value = true;
	};

	// 拖动中（底部区域）
	const onDrag = (e) => {
		if (!isDragging.value) return;
		
		const currentY = e.touches[0].clientY;
		const deltaY = currentY - initialTouchY;
		
		// 向上拖动超过阈值时展开
		if (deltaY < -30 && !isBottomExpanded.value) {
			isBottomExpanded.value = true;
			isDragging.value = false;
		}
		// 向下拖动超过阈值时收起
		else if (deltaY > 30 && isBottomExpanded.value) {
			isBottomExpanded.value = false;
			isDragging.value = false;
		}
	};

	// 结束拖动（底部区域）
	const endDrag = (e) => {
		if (!isDragging.value) return;
		
		const currentY = e.changedTouches[0].clientY;
		const deltaY = currentY - initialTouchY;
		const duration = Date.now() - touchStartTime;
		const velocity = Math.abs(deltaY) / duration;
		
		// 快速滑动或大幅度滑动时触发
		if (velocity > 0.3 || Math.abs(deltaY) > 50) {
			if (deltaY > 0 && isBottomExpanded.value) {
				isBottomExpanded.value = false;
			} else if (deltaY < 0 && !isBottomExpanded.value) {
				isBottomExpanded.value = true;
			}
		}
		
		isDragging.value = false;
		lastTouchY = 0;
	};

	// 打开上传表单
	const openUploadForm = () => {
		// 先关闭底部功能区
		isBottomExpanded.value = false;
		// 延迟一下再打开新弹窗，避免动画冲突
		setTimeout(() => {
			popupFromUpload.value?.open();
		}, 300);
	};

	// 打开拍照识别
	const openPhotoUpload = () => {
		// 先关闭底部功能区
		isBottomExpanded.value = false;
		// 延迟一下再打开新弹窗，避免动画冲突
		setTimeout(() => {
			popupPhotoUpload.value?.open();
		}, 300);
	};

	// 添加关闭弹窗方法
	const closeUploadPopup = () => {
		popupFromUpload.value?.close();
		// 重置表单数据
		baseFormData1.value = {
			catId: '',
			longitude: '',
			latitude: '',
			name: ''
		};
	};

	// 地图相关
	const DEFAULT_MAP1_HEIGHT = window.innerHeight * 0.37;
	const DEFAULT_MAP2_HEIGHT = window.innerHeight * 0.29;
	const map1Height = ref(DEFAULT_MAP1_HEIGHT);
	const map2Height = ref(DEFAULT_MAP2_HEIGHT);
	const startHeight1 = ref(0);
	const startHeight2 = ref(0);
	const isMapDragging = ref(false);

	// 开始拖动地图分隔条
	const startResize = (e) => {
		isMapDragging.value = true;
		startY.value = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
		startHeight1.value = map1Height.value;
		startHeight2.value = map2Height.value;
		document.body.style.cursor = 'row-resize';
	};

	// 拖动地图分隔条
	const onResize = (e) => {
		if (!isMapDragging.value) return;
		e.preventDefault();
		
		const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
		const deltaY = currentY - startY.value;
		const totalHeight = startHeight1.value + startHeight2.value;
		
		// 计算新高度
		let newHeight1 = startHeight1.value + deltaY;
		let newHeight2 = startHeight2.value - deltaY;
		
		// 限制最小高度为总高度的20%
		const minHeight = totalHeight * 0.2;
		if (newHeight1 < minHeight) {
			newHeight1 = minHeight;
			newHeight2 = totalHeight - minHeight;
		} else if (newHeight2 < minHeight) {
			newHeight2 = minHeight;
			newHeight1 = totalHeight - minHeight;
		}
		
		map1Height.value = newHeight1;
		map2Height.value = newHeight2;
		
		// 实时更新地图大小
		if (map1 && map2) {
			map1.resize();
			map2.resize();
		}
	};

	// 结束拖动地图分隔条
	const endResize = () => {
		if (!isMapDragging.value) return;
		isMapDragging.value = false;
		document.body.style.cursor = '';
	};

	// 处理日期选择器点击事件
	const handleDatePickerClick = () => {
		// 展开底部区域
		isBottomExpanded.value = true;
		// 设置日期选择器打开状态
		isDatePickerOpen.value = true;
		// 直接设置功能按钮区的层级
		const functionButtons = document.querySelector('.function-buttons');
		if (functionButtons) {
			functionButtons.classList.add('date-picker-open');
		}
	};

	// 监听日期选择器关闭
	watch(selectedDate, (newVal, oldVal) => {
		if (newVal !== oldVal) {
			// 日期已选择，关闭日期选择器
			isDatePickerOpen.value = false;
			// 恢复功能按钮区的层级
			const functionButtons = document.querySelector('.function-buttons');
			if (functionButtons) {
				functionButtons.classList.remove('date-picker-open');
			}
		}
	});

	// 添加日期选择器取消事件处理
	const handleDatePickerCancel = () => {
		isDatePickerOpen.value = false;
		// 恢复功能按钮区的层级
		const functionButtons = document.querySelector('.function-buttons');
		if (functionButtons) {
			functionButtons.classList.remove('date-picker-open');
		}
	};

	// 处理布局点击事件
	const handleLayoutClick = (e) => {
		// 检查点击的目标元素是否在功能区内
		const target = e.target;
		const bottomArea = document.querySelector('.bottom-area');
		
		// 如果功能区已展开，且点击的不是功能区内的元素，则收起功能区
		if (isBottomExpanded.value && bottomArea && !bottomArea.contains(target)) {
			isBottomExpanded.value = false;
		}
	};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	background-color: #f8f9fa;
	position: fixed; /* 改为fixed定位 */
	left: 0;
	top: 0;
	overflow: hidden;
	touch-action: none; /* 禁用所有触摸行为 */
}

.layout {
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
	touch-action: none;
}

.header-section {
    /* 取消边框,只保留上下左右的外边距 */
    margin: 0rpx 30rpx 0rpx 30rpx;
}

/* 标题栏样式 */
.title-bar {
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff;
	position: relative;
	box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.title {
	font-size: 18px;
	font-weight: 600;
	color: #333;
}

.refresh-button {
	position: absolute;
	right: 12px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: rgba(0,0,0,0.05);
	
	&.refreshing {
		animation: spin 1s linear infinite;
	}
}

/* 刷新按钮图标样式 */
.refresh-icon {
	width: 40rpx;
	height: 40rpx;
    background-color: #ffe6eb;
    border-radius: 50rpx; /* 增大圆角半径,使背景圈圈更大 */
    // padding: 10rpx; /* 添加内边距使背景圈圈更大 */
    // margin-bottom: 10rpx;
}

/* 地图容器样式 */
.map-container {
	flex: 1;
	position: relative;
	overflow: hidden !important;
	overscroll-behavior: none;
	touch-action: none !important;
	user-select: none;
	-webkit-user-select: none;
	-webkit-touch-callout: none;
	-webkit-overflow-scrolling: none;
}

.map1-section {
	position: relative;
	background: #fff;
	transition: height 0.2s ease;
	margin: 20rpx 20rpx 10rpx 20rpx;
	border-radius: 20px;
	overflow: hidden !important;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	touch-action: none !important;
	-webkit-overflow-scrolling: none;
}

.map2-section {
	position: relative;
	background: #fff;
	transition: height 0.2s ease;
	margin: 10rpx 20rpx 10rpx 20rpx;
	border-radius: 20px;
	overflow: hidden !important;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	touch-action: none !important;
	-webkit-overflow-scrolling: none;
}

.map-title {
	position: absolute;
	top: 8px;
	left: 8px;
	font-size: 12px;
	color: #666;
	background: rgba(255,255,255,0.9);
	padding: 4px 8px;
	border-radius: 4px;
	z-index: 1;
}

.map-box {
	width: 100%;
	height: 100%;
	border-radius: 20px;
	touch-action: none !important;
	pointer-events: auto;
	overflow: hidden !important;
	-webkit-overflow-scrolling: none;
}

/* 拖动手柄样式 */
.map-resizer {
	height: 10px;
	background: #fff;
	position: relative;
	cursor: row-resize;
	touch-action: none;
	user-select: none;
	z-index: 10;
}

.resizer-line {
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	height: 1px;
	background: #eee;
}

.resizer-handle {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	gap: 3px;
}

.handle-dot {
	width: 4px;
	height: 4px;
	background: #999;
	border-radius: 50%;
}

/* 底部区域样式 */
.bottom-area {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background: #fff;
	border-radius: 20px 20px 0 0;
	z-index: 100;
	height: 64vh;
	transform: translateY(calc(100% - 23vh));
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	touch-action: pan-y;
	overflow: hidden; /* 添加overflow:hidden确保内容不会超出圆角 */
	
	/* 展开状态 */
	&.expanded {
		transform: translateY(calc(100% - 64vh));
		.drag-handle {
            // 旋转拖动手柄
			transform: rotate(180deg);
		}
	}
}

.drag-bar {
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: transparent; /* 改为透明背景 */
	position: absolute; /* 改为absolute定位 */
	top: 0;
	left: 0;
	right: 0;
	z-index: 1;
	touch-action: none;
}

.drag-handle {
	width: 32px;
	height: 4px;
	background: #e0e0e0;
	border-radius: 2px;
	transition: transform 0.3s ease;
}

.icon {
	width: 60rpx;
	height: 60rpx;
}

// 底部内容
.bottom-content {
	height: calc(100% - 20px);
	position: relative;
	padding: 0 0px 16px;
	background: transparent; /* 改为透明背景 */
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior: contain;
	margin-top: 20px; /* 添加顶部边距 */
	
	/* 隐藏滚动条 */
	&::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
}

/* 筛选区域样式 */
.filter-section {
    background: #fff;
    z-index: 5; /* 提高筛选区域的层级 */
    margin: 10rpx 30rpx 10rpx 30rpx;
    padding: 10px;
    border-radius: 20rpx;
    box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.12), 0 4rpx 8rpx rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.08);
    position: relative; /* 添加相对定位 */
}

// 筛选行
.filter-row {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;  // 增加间距
	background: #f8f9fa;  // 改变背景色
	border-radius: 16px;  // 增加圆角
	padding: 10px;  // 增加内边距
	border: 1px solid #eee;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);  // 增加基础阴影
	
	&:last-child {
		margin-bottom: 0;
	}
}

// 筛选图标
.filter-icon {
	width: 24px;
	height: 24px;
	
	image {
		width: 100%;
		height: 100%;
		opacity: 0.6;
	}
}

// 需要的
.filter-input {
	flex: 1;
	position: static !important;  // 修改定位方式
}

// 选择器滚动
::v-deep .uni-select__selector-scroll {
	max-height: 60vh !important;
}

/* 轨迹信息样式 */
.track-timeline {
    position: sticky;
    top: 0;
    background: linear-gradient(135deg, #fff, #f8f9fa);
    z-index: 3;  // 保持轨迹信息的层级较低
    margin: 15rpx 16px 10rpx 16px;
    padding: 24px 24px 24px 44px;
    border-radius: 20rpx;
    box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.15), 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.timeline-item {
    position: relative;
    padding-left: 20px;
    padding-bottom: 20px;
    
    &:last-child {
        padding-bottom: 40px; /* 为最后一个项目添加额外的底部内边距 */
    }
    
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 20px;
        bottom: 0;
        width: 1px;
        background: #eee;
    }
}

// 时间轴点
.timeline-dot {
	position: absolute;
	left: -4px;
	top: 8px;
	width: 10px;  // 增加大小
	height: 10px;
	background: #999;
	border-radius: 50%;
	border: 2px solid #fff;
	box-shadow: 0 0 0 4px rgba(153, 153, 153, 0.2);  // 增加外发光范围
	
	&.start {
		background: #4cd964;
		width: 12px;  // 增加大小
		height: 12px;
		left: -5px;
		border-color: #fff;
		box-shadow: 0 0 0 4px rgba(76, 217, 100, 0.25);  // 增加外发光范围和强度
	}
	
	&.end {
		background: #ff6b81;
		width: 12px;  // 增加大小
		height: 12px;
		left: -5px;
		border-color: #fff;
		box-shadow: 0 0 0 4px rgba(255, 107, 129, 0.25);  // 增加外发光范围和强度
	}
}

.timeline-content {
	background: #fff;
	border-radius: 16rpx;  // 增加圆角
	padding: 20rpx;  // 增加内边距
	border: 1px solid #eee;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);  // 增加基础阴影
	margin-bottom: 4px;  // 添加底部间距
	
	&:hover {
		border-color: #ff6b81;
		background: linear-gradient(135deg, #fff, #fff8f9);  // 添加悬停时的渐变背景
		box-shadow: 0 12rpx 32rpx rgba(255, 107, 129, 0.25);  // 加重悬停时的阴影
		transform: translateY(-2px) scale(1.02);  // 增加上浮距离并稍微放大
	}
}

.location-name {
	font-size: 14px;
	color: #333;
	font-weight: 500;
	margin-bottom: 4px;
}

.location-time {
	font-size: 12px;
	color: #999;
}

/* 弹窗样式 */
.popup-content {
    background: #fff;
	border-radius: 20px 20px 0 0;
	position: relative;
	min-height: 60vh;
	will-change: transform;
	touch-action: pan-y;
	z-index: inherit;
	transition: min-height 0.3s ease; // 添加高度过渡动画
    // 照片上传
	&.photo-upload-content {
		min-height: 60vh; // 初始高度
		
		&.has-result {
			min-height: 76vh; // 有结果时的高度
		}
		
		.popup-header {
			text-align: center;
			margin: 40rpx 0 20rpx;
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
    // 表单上传
	&.form-upload-content {
		.popup-header {
			text-align: center;
			margin: 40rpx 0 20rpx;  // 修改这里，添加顶部间距
			
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
		}

		.form-container {
			padding: 20rpx;
			
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

				.btn-text {
					color: #fff;
					font-size: 32rpx;
					font-weight: 600;
					letter-spacing: 2rpx;
				}
			}
		}
	}
}

// 弹窗动画
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

// 拖动指示器
.drag-indicator {
	width: 36px;
	height: 4px;
	background: #e0e0e0;
	border-radius: 2px;
	position: absolute;
	top: 12px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 1;
}

// 关闭按钮
.popup-close {
	position: absolute;
	right: 16px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 24px;
	color: #999;
	line-height: 1;
}

/* 表单样式 */
.form-container {
	padding: 16px;
	background: #fff;
	height: auto;
}

// 位置输入
.location-inputs {
	display: flex;
	gap: 12px;
}

.submit-btn {
	margin-top: 24px;
	width: 100%;
	height: 44px;
	background: linear-gradient(135deg, #ff6b81, #ff8e9e);
	border: none;
	border-radius: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn-text {
	color: #fff;
	font-size: 16px;
	font-weight: 500;
}

.upload-icon {
	width: 40px;
	height: 40px;
	opacity: 0.5;
}

.result-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 8px;
	
	&.top-result {
		background: linear-gradient(135deg, #ff6b81, #ff8e9e);
		
		.result-rank {
			background: rgba(255,255,255,0.2);
            width: 24px;
            height: 24px;
            background: #eee;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #666;
		}
		
		.result-name, .result-confidence {
			color: #fff;
		}
	}
}

.result-info {
	flex: 1;
}

.result-name {
	font-size: 14px;
	color: #333;
	font-weight: 500;
	margin-bottom: 4px;
}

.result-confidence {
	font-size: 12px;
	color: #999;
}
// 旋转动画
@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* 功能按钮样式 */
.function-buttons {
	position: sticky;
	top: 0;
	background: #fff;
	z-index: 6;
	padding: 5px 0;
	border-bottom: 1px solid #f5f5f5;
	// margin: 0 -16px;
	// padding-left: 16px;
	// padding-right: 16px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	
	&.date-picker-open {
		z-index: 5;
	}
}

.function-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	flex: 1;
}

.btn-icon {
	width: 40rpx;
	height: 40rpx;
	opacity: 0.8;
}

.btn-text {
	font-size: 12px;
	color: #666;
	white-space: nowrap;
}

/* 添加阴影效果增强层次感 */
.function-buttons,
.filter-section,
.track-timeline {
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 确保内容区域在固定元素下方可以滚动 */
.bottom-content {
	& > *:last-child {
		margin-bottom: 200px; /* 添加底部空间确保内容可以完全滚动 */
	}
}

/* 修改加载动画样式 */
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: var(--window-bottom); /* 使用系统变量，避免遮挡底部导航栏 */
	background-color: rgba(255, 255, 255, 0.95);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.loading-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	transform: translateY(-15%); /* 稍微向上偏移更多，避免被底部功能区遮挡 */
	padding-bottom: 100px; /* 为底部功能区预留空间 */
}

.loading-image {
	width: 120px;
	height: 120px;
	object-fit: contain;
}

.loading-text {
	font-size: 14px;
	color: #666;
	text-align: center;
}

// /* 确保弹窗内容区域可以滚动 */
// ::v-deep .uni-popup__wrapper {
// 	// display: flex;
// 	// flex-direction: column;
// 	// max-height: 85vh !important;
//     // min-height: 45vh !important;
// 	overflow: hidden !important;
// }

/* 修改底部安全区域 */
::v-deep .uni-popup-bottom .uni-popup__wrapper-box {
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

/* 拍照识猫弹出层样式 */
.photo-upload-content {
	.photo-container {
		display: flex;
		flex-direction: column;
		// 图片容器
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
        // 预览图片
		.preview-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
        // 上传图片占位
		.upload-placeholder {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 20rpx;
		}
        // 相机图标
		.camera-icon {
			width: 80rpx;
			height: 80rpx;
			opacity: 0.5;
		}
        // 上传图片文字
		.upload-text {
			font-size: 28rpx;
			color: #999;
		}
        // 按钮组
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
        // 识别按钮
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
    // 识别结果
	.recognition-result {
		width: 100%;
		background: #f8f9fa;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-top: 0rpx;
		opacity: 0;
		transform: translateY(20px);
		animation: slideUpFade 0.3s ease forwards;
		
		@keyframes slideUpFade {
			from {
				opacity: 0;
				transform: translateY(20px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
        
        // 结果标题 
		.result-title {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 16rpx;
			display: block;
		}
        // 结果内容
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
        // 结果左侧
		.result-left {
			display: flex;
			align-items: center;
			gap: 12rpx;
		}
        // 排名徽章
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
        // 猫名
		.cat-name {
			font-size: 32rpx;
			color: #333;
			font-weight: 600;
		}
        // 置信度
		.confidence {
			font-size: 28rpx;
			color: #666;
			font-weight: 500;
		}
	}
}


// 需要的
/* 修改弹出层样式 */
::v-deep .uni-popup {
	z-index: 9999997 !important;  // 确保基础弹出层在适当的层级
}

// 全局滚动条隐藏
::v-deep ::-webkit-scrollbar {
    display: none !important;
}
::v-deep {
    scrollbar-width: none !important;  /* Firefox */
    -ms-overflow-style: none !important;  /* IE and Edge */
}

// 修改弹出层的滚动条
::v-deep .uni-popup__wrapper {
    &::-webkit-scrollbar {
        display: none !important;
    }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}

::v-deep .uni-scroll-view-content{
    height: 400rpx;
}

// 修改选择器的滚动条
::v-deep .uni-select__selector-scroll {
    &::-webkit-scrollbar {
        display: none !important;
    }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}

.container {
    &::-webkit-scrollbar {
        display: none !important;
    }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}

.bottom-content {
    &::-webkit-scrollbar {
        display: none !important;
    }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}

.track-timeline {
    &::-webkit-scrollbar {
        display: none !important;
    }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}

/* 添加地图标签样式 */
::v-deep .mapLabelInfo {
	padding: 2px 6px;
	background-color: rgba(255, 255, 255, 0.7) !important; // 使用 !important 确保样式优先级
	border-radius: 3px !important;
	font-size: 11px !important;
	color: #333 !important;
	font-weight: 400 !important;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15) !important;
	border: 1px solid rgba(0, 0, 0, 0.1) !important;
	white-space: nowrap !important;
	cursor: pointer !important;
	
	/* 添加一个小尾巴 */
	position: relative !important;
	
	&::after {
		content: '';
		position: absolute !important;
		left: -3px !important;
		top: 50% !important;
		transform: translateY(-50%) !important;
		width: 0 !important;
		height: 0 !important;
		border-top: 3px solid transparent !important;
		border-bottom: 3px solid transparent !important;
		border-right: 3px solid rgba(255, 255, 255, 0.7) !important;
	}
}

::v-deep .amap-geo {
	background-color: #fff !important;
	border-radius: 4px !important;
	width: 28px !important;
	height: 28px !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	
	img {
		width: 16px !important;
		height: 16px !important;
		opacity: 0.7 !important;
	}
}

/* 添加地图类型标识样式 */
.map-type-label {
	position: absolute;
	top: 10px;
	left: 10px;
	background: rgba(255, 255, 255, 0.9);
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	color: #666;
	z-index: 100;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 修改地图标签的容器样式 */
::v-deep .amap-marker-label {
    border: none !important;
    background-color: transparent !important;
    padding: 0 !important;
    // box-shadow: none !important;
}

// 在样式部分添加鼠标样式
::v-deep .mapLabelInfo {
    cursor: pointer;
}

/* 修改日期选择器样式 */
::v-deep .uni-date__x-input {
    height: 100%;
    line-height: normal;
    padding-right: 30px !important; /* 为清除按钮留出空间 */
}

::v-deep .uni-date__icon-clear {
    top: 50% !important;
    right: 8px !important;
}
</style>
