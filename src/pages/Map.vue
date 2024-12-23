<template>
	<view class="container">
		<view class="layout">
			<!-- 顶部搜索区域 -->
			<view class="header-section">
				<uni-section title="寻猫日迹" titleFontSize="40rpx" type="line">
					<view class="search-container">
						<!-- 日期选择 -->
						<view class="search-row">
							<view class="search-item">
								<view class="icon-label">
									<img class="icon" src="../../static/time2.png" mode="aspectFill"/>
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
									<img class="icon" src="../../static/cat007.png" mode="aspectFill"/>
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
				<!-- 3D地图 -->
				<view class="map-section">
					<text class="map-title">3D视图</text>
					<div class="map-box" id="mymap"></div>
				</view>
				
				<!-- 地图分隔装饰 -->
				<!-- <view class="map-divider">
					<image class="divider-icon" src="../../static/mapLogo.png" mode="aspectFit"/>
				</view> -->
				
				<!-- 2D地图 -->
				<view class="map-section">
					<text class="map-title">平面视图</text>
					<div class="map-box" id="mymap2"></div>
				</view>
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
									<img src="../../static/cat007.png" mode="aspectFit" class="camera-icon"/>
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
	import { onMounted, onUnmounted, ref, nextTick } from "vue";
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
	import { toBeDeveloped, showToast } from '@/src/utils/toast'
	import AMapLoader from "@amap/amap-jsapi-loader";
	import { useAppStore } from '@/store/modules/app'
	const appStore = useAppStore()

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
			iconPath: new URL('../../static/tempStatic/V1_report.png', import.meta.url).href,
			selectedIconPath: new URL('../../static/tempStatic/V1_report.png', import.meta.url).href,
			text: '发现小猫',
			active: false,
		},
		{
			iconPath: new URL('../../static/tempStatic/aichong32.png', import.meta.url).href,
			selectedIconPath: new URL('../../static/tempStatic/aichong32.png', import.meta.url).href,
			text: '拍猫识别',
			active: false
		},
		{
			iconPath: new URL('../../static/tempStatic/photo009.png', import.meta.url).href,
			selectedIconPath: new URL('../../static/tempStatic/photo009.png', import.meta.url).href,
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
			console.log("请求全部小猫最新坐标",response)
	        if (response.statusCode === 200 && response.data.code === "2000") {
	          responseData.value = response.data.data;
	          mapDrawMode.value = 'point';
	          path.value = responseData.value.map(item => [
	            parseFloat((item.longitude || 0).toFixed(6)),
	            parseFloat((item.latitude || 0).toFixed(6)),
	            item.catName || '未知猫咪'
	          ]);
			//   console.log("path",path.value)
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
	      if (response.statusCode === 200 && response.data.code === "2000") {
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
	    }
	  });
	};
	
	onShow(async () => {
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
		
		// 调用全局方法：请求全部小猫最新坐标
        await getCatLocationLatest();
		responseData.value = appStore.catLocations;
		// console.log(responseData.value);
		mapDrawMode.value = 'point';
		// 添加数据验证和空值处理
		path.value = responseData.value
            .filter(item => item.longitude != null && item.latitude != null) // 过滤掉无效坐标
            .map(item => [
                parseFloat((item.longitude || 0).toFixed(6)), // 添加默认值
                parseFloat((item.latitude || 0).toFixed(6)),  
                item.catName || '未知猫咪'  // 添加默认名称
            ]);
        // console.log(path.value);
		
		// 设置高德地图安密钥
		window._AMapSecurityConfig = {
			securityJsCode: "d099747db9129b84ab6ce834d56e9573",
		};
		// 加载高德地图
		AMapLoader.load({
			key: "aada17cf2848387456285d0e1b5c74c6", // 申请好的Web端开发者Key，首次调用 load 时必填
			version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认 1.4.15
			// layers:[AMap.createDefaultLayer(), AMap.ImageLayer()],
			plugins: ["AMap.Scale","AMap.Geolocation", "AMap.Marker", "AMap.Polyline"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
		})
	    .then((loadedAMap) => {
			AMap = loadedAMap
			/* 创建地图实例1 */
			map1 = new AMap.Map("mymap", {
				// 设置地图容器id
				viewMode: "3D", // 是否为3D地图模式
				zoom: 16, // 初始化地图级别
				center: [113.390166, 22.527103], // 初始化地图中心位置
				pitch: 45, // 设置倾斜角度，范是0（倾斜到60
				rotation: 0, // 置旋转角度，0表示北方在上，90表示地图顺时针旋转90度
				rotateEnable: true, //是否开启地图旋转交互 鼠标右 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈动
				pitchEnable: true, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
				features: ['bg', 'road','name'], // 显示背景、道路和建筑物，但显示地名
				canvasRender: true, // 使用Canvas渲染
				willReadFrequently: true // 优化Canvas性能
			});
			// 添加比例尺控件
			map1.addControl(new AMap.Scale());
			// 添加地理定位控件
			map1.addControl(new AMap.Geolocation());
			// 添加自定义图片叠加层
            let url = ''
            if(process.env.NODE_ENV === 'development'){
                url = "../../static/realmap.jpg"
            }else{
                url = `${pic_general_request_url.value}/static_image/realmap.jpg`
            }
			const imageLayer = new AMap.ImageLayer({
                url: url,
			  bounds: new AMap.Bounds(
				[113.386036, 22.523024], // 左下角坐标  经度：左右（越大越右） 纬：上下（越大越上）
				[113.396039, 22.532817]  // 右上坐标  
			  ),
			  opacity: 1 ,// 设置透明度为0.5，范围是0（完全透明）到1（完全不透明）
			});
			// 将图片图层添加到地图
			map1.add(imageLayer);
			
			/* 创建地图实例2 */
			map2 = new AMap.Map("mymap2", {
				// 设地图容器id
				viewMode: "2D", // 是否为3D地图模式
				zoom: 16, // 初始化地图级别
				center: [113.390166, 22.527103], // 初始化地图中心点位置
				canvasRender: true, // 使用Canvas渲染
				willReadFrequently: true // 优化Canvas性能
			});
			// 添加比例尺控件
			map2.addControl(new AMap.Scale());
			// 添加工具条控件
			map2.addControl(new AMap.Geolocation());
			
			mapDraw() // 绘制地图
		})
	    .catch((e) => {
	      console.log(e);
	    });
	});
	
	onMounted(()=>{
		console.log('页面挂载')
		// mapDraw() // 绘制地图
	})
	onUnmounted(() => {
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
				if (resp.statusCode === 200 && resp.data.code === "2000") {
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
		console.log(mapDrawMode.value)
		
		if (mapDrawMode.value === 'point') { /* 检查绘图模式 */
			// /* 给地图1绘点 */
			path.value.forEach(marker => {
				// console.log(marker)
				map1catMarker = new AMap.Marker({
					position: [marker[0], marker[1]], // 经纬度 113 22
					icon: "../../static/redpoint12.svg",
					offset: new AMap.Pixel(-20, -20), // 根据图标的尺寸整偏移
				});
				map1catMarker.setMap(map1);
				map1catMarker.setLabel({
				        offset: new AMap.Pixel(-17,-15),  //设文本标注偏移量
				        content: `<div class='mapLabelInfo'>${marker[2]}</div>`, //设置文本标注内容
				        direction: 'right' //设置文本标注方位
				    });
			});
			
			// /* 给地图2绘画点 */
			path.value.forEach(marker => {
				// console.log(marker)
				map2catMarker = new AMap.Marker({
					position: [marker[0], marker[1]], // 经纬度 113 22
					icon: "../../static/redpoint12.svg",
					offset: new AMap.Pixel(-5, -5), // 根据图标的尺寸调整偏移
				});
				map2catMarker.setMap(map2);
				map2catMarker.setLabel({
						// offset: new AMap.Pixel(-17,-15),  //设置文标注偏移量
						content: `<div class='mapLabelInfo'>${marker[2]}</div>`, //设置文本标注内容
						direction: 'right' //设置文本标注方位
					});
			});
		}else if (mapDrawMode.value === 'line') {
			// /* 给地图1绘轨迹 */
			console.log(path.value)
			let linePath = path.value.map((item) => {
				return [item[0], item[1]]; // 只返回经纬度
			})
			console.log(linePath)
			// 画单只猫猫的
			map1polyline = new AMap.Polyline({
				path: linePath, // 轨迹坐标点
				strokeColor: "#55ffff", // 线颜色
				rokeWeight: 4, // 线宽
				strokeOpacity: 0.9, // 线透明度
			});
			map1.add(map1polyline);
			// 添加起点的标记
			let starMarker1 = new AMap.Marker({
			  position: linePath[0], // 轨迹线的最后一个点
			  icon: "../../static/startPoint.png",
			  offset: new AMap.Pixel(-26, -44), // 根据图标的尺寸调整偏移
			});
			map1.add(starMarker1);
			// 添加结束点的标记
			let endMarker1 = new AMap.Marker({
			  position: linePath[linePath.length - 1], // 轨迹线的最后一个点
			  icon: "../../static/cat32.svg",
			  offset: new AMap.Pixel(-15, -20), // 根据图标的尺寸调整偏移
			});
			map1.add(endMarker1);
			
			// /* 给地图2绘轨迹 */
			map2polyline = new AMap.Polyline({ // 添加轨迹线
				path: path.value, // 轨迹坐标点
				strokeColor: "#55ffff", // 线颜色
				strokeWeight: 4, // 线宽
				strokeOpacity: 0.9, // 线透明度
			});
			map2.add(map2polyline);
			
			let starMarker2 = new AMap.Marker({ // 添加起始点的标记
			  position: path.value[0], // 轨迹线的最后一个点
			  icon: "../../static/startPoint.png",
			  offset: new AMap.Pixel(-26, -44), // 根据图标的尺寸调整偏移
			});
			map2.add(starMarker2);
			
			let endMarker2 = new AMap.Marker({ // 添加结束点的标记
			  position: path.value[path.value.length - 1], // 轨迹线的最后一个点
			  icon: "../../static/cat32.svg",
			  offset: new AMap.Pixel(-10, -20), // 根据图的尺寸调整偏移
			});
			map2.add(endMarker2);
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
					console.log('浏览器定位成功���', position);
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
				'Authorization': `Bearer ${token.value}`
			},
			success: (res) => {
				try {
					const result = JSON.parse(res.data);
					console.log('识别结果:', result);
					if (result.code === '2000' && result.data.success) {
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
}

.map-section {
	flex: 1;
	background: #fff;
	border-radius: 16rpx;
	position: relative;
	overflow: hidden;
}

.map-title {
	position: absolute;
	top: 12rpx;
	left: 12rpx;
	font-size: 22rpx;
	color: #666;
	background: rgba(255,255,255,0.9);
	padding: 4rpx 12rpx;
	border-radius: 4rpx;
	z-index: 1;
}

#mymap, #mymap2 {
	width: 100%;
	height: 100%;
}

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
	font-size: 24rpx;
	font-weight: 500;
}

/* 去除地图logo */
::v-deep .amap-logo,
::v-deep .amap-copyright {
	display: none !important;
}

.popup-wrapper {
	.popup-content {
		min-height: 60vh;
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
			margin-top: 20rpx;
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
		margin-top: 20rpx;

		.result-title {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 16rpx;
			display: block;
		}

		.result-content {
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
</style>
