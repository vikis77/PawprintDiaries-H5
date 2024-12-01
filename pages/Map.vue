<template>
	<view class="container">
		<view class="layout">
			<uni-section class="header-section" title="寻猫日迹" type="line">
				<view class="search-container">
					<!-- 第一行 -->
					<uni-row class="search-row" :gutter="0" :width="730">
						<uni-col :span="24">
							<view class="search-item">
								<view class="icon-label">
									<image class="icon" src="../static/time.png" mode="aspectFill"/>
									<text class="label">选择日期</text>
								</view>
								<!-- 时间选择器 -->
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
						</uni-col>
					</uni-row>
					<!-- 第二行 -->
					<uni-row class="search-row" :gutter="0" :width="730">
						<uni-col :span="24">
							<view class="search-item">
								<view class="icon-label">
									<image class="icon" src="../static/布偶猫-稀有色.png" mode="aspectFill"/>
									<text class="label">选择小猫</text>
								</view>
								<!-- 选择器 -->
								<view class="picker-container">
									<uni-data-select
										placeholder="请选择小猫"
										v-model="selectedValueC"
										:localdata="dataListCat"
										@change="onCatChange"
									></uni-data-select>
								</view>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</uni-section>
			
			<!-- 地图1 -->
			<div class="m23rhj" id="mymap"></div> 
			<!-- 地图logo -->
			<img class="t9gh9hu" src="../static/mapLogo.png" mode="aspectFill"></img>
			<!-- 地图2 -->
			<div class="m23rh0" id="mymap2"></div>
			
			<!-- 悬浮按钮 -->
			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
						:direction="direction" @trigger="trigger" @fabClick="fabClick" 
			/>
						
			<!-- 底部弹出层 (上传表单)-->
			<view class="h09h">
				<uni-popup ref="popupFromUpload" type='bottom' background-color="#fff" @change="change">
					<view class="popup-content">
						<view class="t9hkz">
							<text>报告小猫踪迹！</text>
						</view>
						<view class="form1">
							<uni-forms ref="reportForm" :model="baseFormData1" :rules="baseFormRules">
								<uni-forms-item label="小猫名字" required >
									<uni-data-select
										v-model="baseFormData1.catId"
										:localdata="dataListCat"
										@change="change"
										placeholder='你发现了哪一只小猫？'
									></uni-data-select>
								</uni-forms-item>
								<uni-forms-item label="经度" required>
									<uni-easyinput v-model="baseFormData1.longitude" placeholder="将自动获取经度信息" />
								</uni-forms-item>
								<uni-forms-item label="纬度" required>
									<uni-easyinput v-model="baseFormData1.latitude" placeholder="将自动获取纬度信息" />
								</uni-forms-item>
								<uni-forms-item label="上报者" required>
									<uni-easyinput v-model="baseFormData1.name" placeholder="我们如何称呼您？" />
								</uni-forms-item>
								 <button type="button" @click="submitForm">提交</button>
							</uni-forms>
						</view>
					</view>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onMounted, onUnmounted, ref } from "vue";
	import AMapLoader from "@amap/amap-jsapi-loader";
	import UniDataPicker from '@dcloudio/uni-ui/lib/uni-data-picker/uni-data-picker'; // 引入 uni-data-picker
	import UniDataSelect from '@dcloudio/uni-ui/lib/uni-data-select/uni-data-select';
	import uniSection from '@dcloudio/uni-ui/lib/uni-section/uni-section.vue';
	import uniRow from '@dcloudio/uni-ui/lib/uni-row/uni-row.vue';
	import uniCol from '@dcloudio/uni-ui/lib/uni-col/uni-col.vue';
	
	const token = ref(`${uni.getStorageSync("token")}`);
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

	const popupFromUpload = ref(null); // 绑定表单上传
	const reportForm = ref(null); // 表单
	const baseFormData1 = ref({ // 上传表单数据
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
			message: '经度不能为空',
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
	const content = ref(
		[{
			// TODO 图片路径找不到/static/ 文件夹，路径把pages视为了根目录
			iconPath: '/tempStatic/V1_填写表单.png',
			selectedIconPath: '/tempStatic/V1_填写表单.png',
			text: '发现小猫',
			active: false,
		},
		{
			iconPath: '/tempStatic/拍照.png',
			selectedIconPath: '/tempStatic/拍照.png',
			text: '上传 X',
			active: false
		},
		{
			iconPath: '/tempStatic/更多 (2).png',
			selectedIconPath: '../static/更多 (2).png',
			text: '更多 X',
			active: false
		}]
	);	
	
	function trigger(e) {
		if (!token.value) {
			// 提示用户登录
			uni.showToast({
				title: '请登录之后再上传吧！',
				icon: 'none'
			});
			return; // 终止函数，避免继续执行
		}
		// 点击第一项（表单上传）
		if (e.index === 0) {
			// 使用高德地图定位插件来获取当前位置
			AMap.plugin('AMap.Geolocation', function() {
				var geolocation = new AMap.Geolocation({
					enableHighAccuracy: true, // 高精度定位
					timeout: 10000, // 超时时间
				});
	
				// 获取当前位置
				geolocation.getCurrentPosition(function(status, result) {
					if (status === 'complete') {
						console.log('经度：' + result.position.lng);
						console.log('纬度：' + result.position.lat);
						baseFormData1.value.longitude = result.position.lng;
						baseFormData1.value.latitude =result.position.lat;
						baseFormData1.value.name = uni.getStorageSync('tokenDetail').username
						// 打开上传表单
						popupFromUpload.value.open();
					} else {
						console.error('获取位置失败', result.message);
						uni.showToast({
							title: '获取位置失败',
							icon: 'error'
						})
					}
				});
			});
		}
		console.log(e.index)
	}
	
	function fabClick() {
		console.log(11)
	}
	
	/* 地图相关变量 */
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

	// 将时间范围相关的变量和函数改为单日
	const selectedDate = ref('');

	// 日期变化处理函数
	const onDateChange = (date) => {
		selectedDate.value = date;
		filterResults();
	};
	
	// 校猫选择器 列表内容
	const dataListCat = ref(); // text显示文本(猫名)  value选中后的值   disable	是否禁用
	const selectedValueC = ref('all'); // 选中的猫
	// 点击选中某只小猫，发送请求，小猫最近10条坐标
	const onCatChange = (e) => { // e 即选中的小猫的value 也是catId
	  console.log('Selected value: ', e);
	  selectedValueC.value = e;
	  filterResults();
	};
	
	// 联动筛选方法
	const filterResults = () => {
	  // 如果没有选择日期且猫咪选择的是all,显示所有猫咪最新位置
	  if (!selectedDate.value && (selectedValueC.value === 'all' || selectedValueC.value === '')) {
	    uni.request({
	      url: `${API_general_request_url.value}/api/cat/findCoordinate`,
	      method: "GET",
	      success: (response) => {
	        if (response.statusCode === 200 && response.data.code === "2000") {
	          responseData.value = response.data.data;
	          mapDrawMode.value = 'point';
	          path.value = responseData.value.map(item => [
	            parseFloat(item.longitude.toFixed(6)),
	            parseFloat(item.latitude.toFixed(6)),
	            item.catName
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
	  let url = `${API_general_request_url.value}/api/cat/`;
	  let params = {};
	  
	  if (selectedDate.value && selectedValueC.value !== 'all' && selectedValueC.value !== '') {
	    // 同时选择了日期和具体猫咪
	    url += 'findCoordinateByDateAndCat';
	    params = {
	      date: selectedDate.value,
	      catId: selectedValueC.value
	    };
	  } else if (selectedDate.value) {
	    // 只选择了日期
	    url += 'findCoordinateByDate';
	    params = { date: selectedDate.value };
	  } else if (selectedValueC.value !== 'all' && selectedValueC.value !== '') {
	    // 只选择了具体猫咪
	    url += 'findCoordinateByPage';
	    params = { catId: selectedValueC.value };
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
	          // 如果有日期和猫咪ID,直接使用返回数据
	          if(selectedDate.value) {
	            path.value = Array.isArray(responseData.value) ?
	              responseData.value.map(item => [
	                parseFloat(item.longitude.toFixed(6)),
	                parseFloat(item.latitude.toFixed(6)),
	                item.catName
	              ]) :
	              [[
	                parseFloat(responseData.value.longitude.toFixed(6)),
	                parseFloat(responseData.value.latitude.toFixed(6)), 
	                responseData.value.catName
	              ]];
	          } else {
	            // 只有猫咪ID时使用records数据
	            path.value = response.data.data.records.map(item => [
	              parseFloat(item.longitude.toFixed(6)),
	              parseFloat(item.latitude.toFixed(6)),
	              item.catName
	            ]);
	          }
	        } else {
	          // 只选择日期或全部显示时显示点
	          mapDrawMode.value = 'point';
	          path.value = Array.isArray(responseData.value) ?
	            responseData.value.map(item => [
	              parseFloat(item.longitude.toFixed(6)),
	              parseFloat(item.latitude.toFixed(6)),
	              item.catName
	            ]) :
	            [[
	              parseFloat(responseData.value.longitude.toFixed(6)),
	              parseFloat(responseData.value.latitude.toFixed(6)),
	              responseData.value.catName
	            ]];
	        }
	        map1.clearMap();
	        map2.clearMap();
	        mapDraw();
	      }
	    }
	  });
	};
	
	onShow(() => {
		// 查询全部小猫信息
		uni.request({
		  url: `${API_general_request_url.value}/api/cat/findAll`,  // 后端API地址
		  method: 'GET',
		  success: (res) => {
					console.log(res.data.data)
					if (res.statusCode === 200 && res.data.code === '2000') {
						// 添加"全部"选项作为第一个选项
						dataListCat.value = [{
							text: '全部',
							value: 'all'
						}];
						
						// 将API返回的数据添加到列表中
						dataListCat.value.push(...res.data.data.map(item =>({
							text: item.catname,
							value: item.catId
						})));
						console.log(dataListCat.value)
						uni.setStorageSync("catList",res.data.data); // 同步存储整个猫猫列表信息
					}
				},
		  fail: (err) => {
					uni.showToast({
					title: '获取小猫数据失败 ' + err,
					icon: 'none'
					})
				}
		});
		
		// 请求全部小猫最新坐标
		console.log("请求全部小猫最新坐标")
		uni.request({
			url: `${API_general_request_url.value}/api/cat/findCoordinate`,
			method: "GET",
			success: (response) => {
				if (response.statusCode === 200 && response.data.code === "2000") {
					responseData.value = response.data.data;
					console.log(responseData.value);
					mapDrawMode.value = 'point';
					path.value = responseData.value.map(item => [
					  parseFloat(item.longitude.toFixed(6)), // 保留经度的前6位
					  parseFloat(item.latitude.toFixed(6)),  // 同样保留纬度的前6位
					  item.catName
					]);
					console.log(path.value);
				} else {
					uni.showToast({
					title: res.data.msg || '全部小猫最新坐标失败',
					icon: 'none'
					});
				}
			},
			fail: () => {
				uni.showToast({
					title: '请求全部小猫最新坐标失败，请重试',
					icon: 'none'
				});
			}
		})
		
		// 设置高德地图安全密钥
		window._AMapSecurityConfig = {
			securityJsCode: "d099747db9129b84ab6ce834d56e9573",
		};
		// 加载高德地图
		AMapLoader.load({
			key: "aada17cf2848387456285d0e1b5c74c6", // 申请好的Web端开发者Key，首次调用 load 时必填
			version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
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
				center: [113.390166, 22.527103], // 初始化地图中心点位置
				pitch: 45, // 设置倾斜角度，范围是0（无倾斜）到60
				rotation: 0, // 设置旋转角度，0表示北方在上，90表示地图顺时针旋转90度
				rotateEnable: true, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
				pitchEnable: true, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
				features: ['bg', 'road','name'] // 显示背景、道路和建筑物，但不显示地名
			});
			// 添加比例尺控件
			map1.addControl(new AMap.Scale());
			// 添加地理定位控件
			map1.addControl(new AMap.Geolocation());
			// 添加自定义图片叠加层
			const imageLayer = new AMap.ImageLayer({
			  url: "../static/realmap.jpg",
			  bounds: new AMap.Bounds(
				[113.386036, 22.523024], // 左下角坐标  经度：左右（越大越右） 纬度：上下（越大越上）
				[113.396039, 22.532817]  // 右上角坐标  
			  ),
			  opacity: 1 ,// 设置透明度为0.5，范围是0（完全透明）到1（完全不透明）
			});
			// 将图片图层添加到地图
			map1.add(imageLayer);
			
			/* 创建地图实例2 */
			map2 = new AMap.Map("mymap2", {
				// 设置地图容器id
				viewMode: "2D", // 是否为3D地图模式
				zoom: 16, // 初始化地图级别
				center: [113.390166, 22.527103], // 初始化地图中心点位置
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
	
	onMounted(() =>{
		console.log('页面挂载')
		// mapDraw() // 绘制地图
	})
	onUnmounted(() => {
	});
	
	// 点击提交表单1按钮
	const submitForm = () => {
		console.log(baseFormData1.value)
		
		uni.request({
			url: `${API_general_request_url.value}/api/cat/uploadCatCoordinate`,
			method: 'POST',
			header: {
				'Authorization': `Bearer ${token.value}`
			},
			data: {
				'catId': baseFormData1.value.catId,
				'latitude': baseFormData1.value.latitude,
				'longitude': baseFormData1.value.longitude,
				'uploader': baseFormData1.value.name
			},
			success: (resp) => {
				if (resp.statusCode === 200 && resp.data.code === "2000") {
					uni.showToast({
						title: '提交成功！',
						icon: 'none',
					});
					// 关闭上传表单
					popupFromUpload.value.close();
				} else {
					uni.showToast({
						title: resp.data.msg,
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
					icon: "../static/红点12.svg",
					offset: new AMap.Pixel(-20, -20), // 根据图标的尺寸调整偏移
				});
				map1catMarker.setMap(map1);
				map1catMarker.setLabel({
				        offset: new AMap.Pixel(-17,-15),  //设置文本标注偏移量
				        content: `<div class='mapLabelInfo'>${marker[2]}</div>`, //设置文本标注内容
				        direction: 'right' //设置文本标注方位
				    });
			});
			
			// /* 给地图2绘画点 */
			path.value.forEach(marker => {
				// console.log(marker)
				map2catMarker = new AMap.Marker({
					position: [marker[0], marker[1]], // 经纬度 113 22
					icon: "../static/红点12.svg",
					offset: new AMap.Pixel(-5, -5), // 根据图标的尺寸调整偏移
				});
				map2catMarker.setMap(map2);
				map2catMarker.setLabel({
						// offset: new AMap.Pixel(-17,-15),  //设置文本标注偏移量
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
			// 画单只猫猫的线
			map1polyline = new AMap.Polyline({
				path: linePath, // 轨迹坐标点
				strokeColor: "#55ffff", // 线颜色
				strokeWeight: 4, // 线宽
				strokeOpacity: 0.9, // 线透明度
			});
			map1.add(map1polyline);
			// 添加起始点的标记
			let starMarker1 = new AMap.Marker({
			  position: linePath[0], // 轨迹线的最后一个点
			  icon: "../static/猫32.svg",
			  offset: new AMap.Pixel(-20, -20), // 根据图标的尺寸调整偏移
			});
			map1.add(starMarker1);
			// 添加结束点的标记
			let endMarker1 = new AMap.Marker({
			  position: linePath[linePath.length - 1], // 轨迹线的最后一个点
			  icon: "../static/到站16.svg",
			  offset: new AMap.Pixel(-8, -10), // 根据图标的尺寸调整偏移
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
			  icon: "../static/猫32.svg",
			  offset: new AMap.Pixel(-20, -20), // 根据图标的尺寸调整偏移
			});
			map2.add(starMarker2);
			
			let endMarker2 = new AMap.Marker({ // 添加结束点的标记
			  position: path.value[path.value.length - 1], // 轨迹线的最后一个点
			  icon: "../static/到站16.svg",
			  offset: new AMap.Pixel(-8, -10), // 根据图标的尺寸调整偏移
			});
			map2.add(endMarker2);
		}
	}
	
	// 打开上传照片
	const imagePath = ref('');
	const chooseImage = () => {
	  uni.chooseImage({
	    count: 1, // 选择图片的数量
	    sizeType: ['original', 'compressed'], // 可以选择原图或压缩图
	    sourceType: ['album', 'camera'], // 选择相册或相机
	    // sourceType: [ 'camera'], // 选择相机
	    success: (res) => {
			// res.tempFilePaths 是一个数组，包含了选择的图片的临时文件路径
			imagePath.value = res.tempFilePaths[0];
			console.log('图片选择成功:', res.tempFilePaths);
			const token = uni.getStorageSync('token')
			// 上传图片
			uni.uploadFile({
				url: '${upload_request_url}/api/upload/catImageTest', // 你的后端上传接口地址
				filePath: imagePath.value,
				name: 'file', // 表单中文件字段的名称
				header: {
					// 'Authorization': `Bearer ${uni.getStorageSync('token')}`
					'Authorization': `Bearer ${token}`
				},
				success: (uploadRes) => {
				console.log('图片上传成功:', uploadRes.data);
				// 如果需要，可以在这里处理上传后的响应
				},
				fail: (err) => {
				console.error('图片上传失败:', err);
				},
				complete: () => {
				console.log('图片上传操作完成');
				}
			});
	    },
	    fail: (err) => {
			console.error('图片选择失败:', err);
	    },
	    complete: () => {
			console.log('图片选择操作完成');
	    }
	  });
	};
</script>

<style lang="scss" scoped>
.header-section {
	height: 15%;
	background: linear-gradient(to right, #fef6f7, #ffeff6);
	border-radius: 15px;
	margin: 20rpx;
	padding: 20rpx;
	box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
	
	::v-deep .uni-section-header {
		padding: 20rpx 0;
		
		.uni-section__header-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #ff6b81;
		}
	}
}

.search-container {
	// height: 10%;
	padding: 0rpx 20rpx;
}

.search-row {
	// height: 10rpx;
	margin-bottom: 30rpx;
	
	&:last-child {
		margin-bottom: 10rpx;
	}
}

.search-item {
	height: 50rpx;
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 10rpx;
	border-radius: 12rpx;
	box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.icon-label {
	display: flex;
	align-items: center;
	margin-right: 20rpx;
	min-width: 180rpx;
}

.icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.label {
	font-size: 28rpx;
	color: #666;
}

.picker-container {
	flex: 1;
	
	::v-deep .uni-date {
		width: 100%;
		
		.uni-date-editor {
			border: 1px solid #eee;
			border-radius: 8rpx;
			padding: 10rpx 20rpx;
		}
	}
	
	::v-deep .uni-data-select {
		.uni-select {
			border: 1px solid #eee;
			border-radius: 8rpx;
			padding: 10rpx 20rpx;
		}
	}
}
	// 去除地图logo
	::v-deep .amap-logo {
	  opacity: 0 !important;
	}
	::v-deep .amap-copyright {
	  opacity: 0 !important;
	}
	.container{
		width: 750rpx;
		height: 93.5vh;
		padding-top: 10rpx;
		
		.layout{
			width: 100%;
			height: 100%;
			// margin-top: 40rpx;
			border-radius: 10rpx 10rpx 1rpx 10rpx;
			// background-color: #55ff7f;
			background-color: #f5f5f5;
			overflow: hidden;
			.t9zhgf{
				width: 100%;
				height: 20%;
				margin-bottom: 10rpx;
				background-color: #eef1f6;
				// background: linear-gradient(to right, #becef8, #c7e2f6);
				.t9h89ho{
					width: 100%;
					height: 200rpx;
					// margin-left: 40rpx;
					// display: flex;
					// background: linear-gradient(to right, #6270db, #a9518c);
					display: flex;
					align-items: center;
					justify-content: space-around;
					.r89yu{ // 第一行
						width: 45%;
						height: 160rpx;
						display: flex;
						align-items: center;
						// padding-left: 20rpx;
						margin-left: 20rpx;
						background-color: #ffffff;
						border-radius: 4rpx 20rpx 4rpx 20rpx;
						box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2); /* 软阴影 */
						border: 0.666667rpx solid #EBEEF5;
						// justify-content: center;
						.t89hfws{ //选择区域
							// width: 100%;
							height: 70rpx;
							// background-color: #c0e5f8;
							align-items: center;
							// justify-content: center;
							display: flex;
							padding-left: 20rpx;
							.tzx8hh{ //图片
								width: 50rpx;
								height: 50rpx;
							}
							.t7uj9{ //文字
								font-size: 25rpx;
							}
							.t8hj0i{ //选择器
								// color: #ffffff;
								// width: 90%;
							}
						}
						
						// .t98h9uh{ //常居地
						// 	width: 100%;
						// 	height: 70rpx;
						// 	display: flex;
						// 	align-items: center;
						// 	justify-content: flex-start;
						// 	.b9yh{ //选择照片
						// 		width: 100%;
						// 		height: 100%;
						// 		font-size: 25rpx;
						// 	}
						// }
					}
					
				}
			}
			
			.m23rhj{ //地图1
				width: 100%;
				height: 35%;
			}
			.t9gh9hu{ //间隔
				width: 100%;
				// height: 20rpx;
				background-color: #f1f7fb;	
				.i69yhu9{ // 图片
					// width: 55%;
					height: 0rpx;
				}
			}
			.m23rh0{ //地图2
				width: 100%;
				height: 40%;
			}
			::v-deep .mapLabelInfo {
			    color: #414141; /* 字体颜色 */
			    background-color: #ffffff; /* 背景颜色 */
			    padding: 1px 1px; /* 内边距 */
			    border-radius: 4px; /* 圆角 */
			    font-size: 10px; /* 字体大小 */
				font-weight: bold;
				font-family: Arial;
			}
			.h09h{ // 底部弹出层 (上传表单)
				width: 100%;
				height: 100%; // x
				.popup-content{ // '发现小猫'上传表单
					width: 90%;
					height: 900rpx;
					margin-top: 40rpx;
					margin-left: 40rpx;
					.t9hkz{ // 标题
						display: flex;
						align-items: center; //  竖直方向 居中
						justify-content: center; // 水平方向 居中
						font-size: 40rpx;
					}
					.form1{
						width: 100%; // x
						height: 100%; // x
						margin-top: 30rpx;
					}
				}
			}
		}
	}
</style>
