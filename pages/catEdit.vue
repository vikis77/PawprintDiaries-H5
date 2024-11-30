<template>
	<view class="container">
		<view class="layout">
			<!-- 头部 -->
			<view class="t1">
				<uni-row class="t9zdf" :width="750">
					<uni-col class="tpk0u" :span="8">
						<img src="../static/返回.png" alt="" @click="handleGoback" class="img"/>
					</uni-col>
					<uni-col class="tgq89" :span="8">
						<view class="t9gh9gh9">
							<text>猫猫编辑</text>
						</view>
					</uni-col>
					<uni-col class="t56f7" :span="8">
						<img src="../static/更多.png" alt="" />
					</uni-col>
				</uni-row>
			</view>
			
			<view class="v43ta">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="baseForm" :modelValue="catBaseFormData">
					<uni-forms-item label="猫名" required>
						<uni-easyinput v-model="catBaseFormData.catname" placeholder="请输入姓名" />
					</uni-forms-item>
					<!-- 上传头像 -->
					<uni-forms-item label="头像" required class="hu00h">
						<uni-file-picker
							mode="image"
							:file-mediatype="['image']"
							limit="1"
							:auto-upload = "false"
							:file-list="catBaseFormData.avatar"
							@upload-success="onUploadSuccess"
							@upload-fail="onUploadFail"
							@select="selectAvator"
						>
							<view v-if="catBaseFormData.avatar.length > 0">
								<image :src="`${pic_general_request_url}/cat_avatar/${catBaseFormData.avatar}`" mode="aspectFill" class="avatar-preview" />
							</view>
							<view v-else class="upload-placeholder">点击上传头像</view>
							<view>如上传新头像，不需要等待上传，继续填写，提交即可</view>
						</uni-file-picker>
					</uni-forms-item>
					<uni-forms-item label="年龄(月)" required>
						<uni-easyinput v-model="catBaseFormData.age" placeholder="请输入年龄" />
					</uni-forms-item>
					<uni-forms-item label="性别" required>
						<uni-data-checkbox v-model="catBaseFormData.gender" :localdata="sexs" />
					</uni-forms-item>
					<uni-forms-item label="种类" required>
						<uni-easyinput v-model="catBaseFormData.gender" placeholder="请输入品种" />
					</uni-forms-item>
					<uni-forms-item label="常住地" required>
						<uni-easyinput v-model="catBaseFormData.area" placeholder="请输入区域" />
					</uni-forms-item>
					<uni-forms-item label="绝育" required>
						<uni-data-checkbox v-model="catBaseFormData.sterilizationStatus" :localdata="sterilizationStatusList" />
					</uni-forms-item>
					<uni-forms-item label="疫苗" required>
						<uni-data-checkbox v-model="catBaseFormData.vaccinationStatus" :localdata="vaccinationStatusList" />
					</uni-forms-item>
					<uni-forms-item label="健康状态" required>
						<uni-data-checkbox v-model="catBaseFormData.healthStatus" :localdata="healthStatusList" />
					</uni-forms-item>
					<uni-forms-item label="性格" required>
						<uni-easyinput v-model="catBaseFormData.catCharacter" placeholder="请输入猫猫性格" />
					</uni-forms-item>
					<uni-forms-item label="食物偏好" required>
						<uni-easyinput v-model="catBaseFormData.food" placeholder="请输入偏好" />
					</uni-forms-item>
					<uni-forms-item label="忌讳" required>
						<uni-easyinput v-model="catBaseFormData.taboo" placeholder="请输入忌讳" />
					</uni-forms-item>
					<uni-forms-item label="不良行为记录">
						<uni-easyinput type="textarea" v-model="catBaseFormData.badRecord" placeholder="请输入不良行为记录" />
					</uni-forms-item>
					<uni-forms-item label="撸猫指南">
						<uni-easyinput type="textarea" v-model="catBaseFormData.catGuide" placeholder="请输入撸猫指南" />
					</uni-forms-item>
					<uni-forms-item label="生日">
						<uni-datetime-picker type="datetime" return-type="timestamp" v-model="catBaseFormData.brithday"/>
					</uni-forms-item>
					
					<!-- 提交按钮 -->
					<view class="form-buttons">
						<button type="primary" @click="submitForm">提交</button>
					</view>
				</uni-forms>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	
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
	
	const catBaseFormData = ref(null)
	const selectedTempFilePaths = ref([]); // 存储已选择的图片的路径
	const selectedTempFiles = ref([]); // 存储已选择的图片信息
	const sexs =ref(
		[{
			text: '雄性',
			value: 0
		}, {
			text: '雌性',
			value: 1
		}, {
			text: '保密/不确定',
			value: 2
		}]
	)
	const sterilizationStatusList =ref(
		[{
			text: '已绝育',
			value: "已绝育"
		}, {
			text: '未绝育',
			value: '未绝育'
		}]
	)
	const vaccinationStatusList =ref(
		[{
			text: '已接种',
			value: "已接种"
		}, {
			text: '未接种',
			value: '未接种'
		}]
	)
	const healthStatusList =ref(
		[{
			text: '健康',
			value: "健康"
		}, {
			text: '肥胖',
			value: '肥胖'
		}, {
			text: '营养不良',
			value: '营养不良'
		}, {
			text: '疾病',
			value: '疾病'
		}]
	)
	
	onMounted(() => {
		uni.showLoading({ title: '加载中...' });
		const catId = new URLSearchParams(window.location.search).get('catId');  // 获取 URL 中的 catId 参数
		console.log('Received catId:', catId);
		fetchCatDetails(catId);  // 请求猫的详细信息
	});
	
	// 请求猫的详细信息
	function fetchCatDetails(catId) {
		uni.request({
			url: `${API_general_request_url.value}/api/cat/findById?ID=${catId}`,
			method: 'GET',
			header: {  
			    'Authorization': `Bearer ${uni.getStorageSync('token')}` 	 
			},
			success: (res) => {
				console.log(res.data.data)
				if (res.statusCode === 200 && res.data.code === '2001'){
					uni.showToast({
						title: res.data.msg || '身份信息过期，请重新登录',
						icon: 'none'
					})
				} else if (res.statusCode === 200 && res.data.code === '2000') {
					catBaseFormData.value = res.data.data;
					console.log(catBaseFormData.value);
				}else{
					uni.showToast({
						title: res.data.msg || '获取小猫信息失败',
						icon: 'none'
					})
				}
				console.log(res)
			},
			fail: (e) => {
				uni.showToast({
					title: '请求获取小猫信息失败，请重试',
					icon: 'none'
				});
			}
		})
		console.log(catBaseFormData.value)
		uni.hideLoading();
	}
	
	const handleGoback =()=>{
		uni.navigateBack()
	}
	
	// 选择新头像
	const selectAvator = (files)=>{
		selectedTempFilePaths.value = files.tempFilePaths
		selectedTempFiles.value = files.tempFiles
		console.log("已选择的文件路径列表:", selectedTempFilePaths.value);
		console.log("已选择的文件列表:", selectedTempFiles.value);
	}
	// 上传成功回调
	const onUploadSuccess = (event) => {
		const { tempFilePath, fileList } = event.detail;
		catBaseFormData.value.avatar = fileList;
		console.log('上传成功:', tempFilePath);
	};
	
	// 上传失败回调
	const onUploadFail = (error) => {
		console.error('上传失败:', error);
	};
	
	// 提交表单
	const submitForm = async() => {
		// catBaseFormData.value.avatar = selectedTempFiles.value.name;
		const baseForm = catBaseFormData.value;
		console.log(catBaseFormData.value.avatar)
		const token = uni.getStorageSync('token');  
		if (!token) {  
			uni.showToast({  
				title: '未找到有效的登录令牌',  
				icon: 'error'  
			});  
			return;  
		}  
	  
		try {  
			// 只有选择新头像才进行上传
			if (selectedTempFilePaths.value != null) {
				// 获取上传凭证
				const response = await uni.request({  
					url: `${API_general_request_url.value}/api/upload/qiniuUploadToken`,  
					method: 'GET',  
					header: {  
						'Authorization': `Bearer ${token}`  
					}  
				});  
					  
				if (response.statusCode !== 200 || response.data.code !== '2000') {  
					throw new Error('获取上传凭证失败');  
				}  
					  
				const uploadToken = response.data.data.qiniuToken;  
					  
				// 上传文件到七牛云  
				const uploadPromises = selectedTempFiles.value.map(file => {  
					return new Promise((resolve, reject) => {  
						uni.uploadFile({  
							url: 'https://upload-z2.qiniup.com',  
							filePath: file.path,  
							name: 'file',  
							formData: {  
								token: uploadToken,  
								key: `catcat/cat_avatar/${file.name}`  
							},  
							success: (uploadRes) => {  
								if (uploadRes.statusCode === 200) {  
									resolve(uploadRes);  
								} else {  
									reject(new Error('图片上传失败'));  
								}  
							},  
							fail: (err) => {  
								reject(err);  
							}  
						});  
					});  
				});  
					  
				// 等待所有文件上传完成  
				const uploadResults = await Promise.all(uploadPromises);  
				console.log('所有图片上传成功:', uploadResults);
				
				// 猫猫信息持久化
				const postResponse = await uni.request({  
					url: `${API_general_request_url.value}/api/cat/update`,  
					method: 'POST',  
					header: {  
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'  // 添加 Content-Type 声明
					},  
					data: {
						'catId': catBaseFormData.value.catId, // 猫 ID
						'catname': catBaseFormData.value.catname, // 猫名
						'gender': catBaseFormData.value.gender, // 性别 (1: 雄性, 0: 雌性)
						'age': catBaseFormData.value.age, // 年龄 (单位: 月)
						'brithday': catBaseFormData.value.datetimesingle, // 生日 (时间戳格式)
						'avatar': selectedTempFiles.value[0].name, // 头像名
						'food': catBaseFormData.value.food, // 食物偏好
						'taboo': catBaseFormData.value.taboo, // 忌讳
						'catCharacter': catBaseFormData.value.catCharacter, // 性格
						'healthStatus': catBaseFormData.value.healthStatus, // 健康状况
						'sterilizationStatus': catBaseFormData.value.sterilizationStatus, // 绝育情况
						'vaccinationStatus': catBaseFormData.value.vaccinationStatus, // 疫苗接种情况
						'badRecord': catBaseFormData.value.badRecord, // 不良行为记录
						'area': catBaseFormData.value.area, // 常住地
						'catGuide': catBaseFormData.value.catGuide // 撸猫指南
					},
				});  
					  
				if (postResponse.statusCode === 200 && postResponse.data.code === '2000') {  
					console.log('已完成持久化猫猫', postResponse);  
					uni.showToast({  
						title: '提交成功',  
						icon: 'success'  
					});  
					uni.navigateBack()
				} else {  
					console.log('无法持久化', postResponse);  
					uni.showToast({  
						title: '提交失败',  
						icon: 'error'  
					});  
				}
			}
		} catch (error) {  
			console.error('提交过程中发生错误:', error);  
			uni.showToast({  
				title: '提交失败',  
				icon: 'error'  
			});  
		}  
		
		console.log('表单数据:', baseForm);
		uni.showToast({ title: '提交成功', icon: 'success' });
		
		
	};
</script>

<style lang="scss" scoped>
	.container{
		width: 750rpx;
		height: 100vh;
		.layout{
			width: 100%;
			height: 100%;
			// background-color: #55ff7f;
			.t1{ //t头部
				width: 100%;
				height: 200rpx;
				display: flex;
				.t9zdf{ // uni-row
					width: 100%;
					height: 200rpx;
					display: flex;
					// align-items: center;
					.tpk0u{ //返回
						width: 100%;
						height: 200rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							width: 60rpx;
							height: 60rpx;
						}
					}
					.tgq89{ // 中间文字
						width: 100%;
						height: 200rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						text{
							font-size: 40rpx;
							color: #333333;
						}
					}
					.t56f7{ // 更多按钮
						width: 100%;
						height: 200rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							width: 60rpx;
							height: 60rpx;
						}
					}
				}
			}
			
			.v43ta{ // 表单区域
				margin-left: 40rpx;
				width: 90%;
				display: flex;
				align-items: center;
				justify-content: center;
				// background-color: #333333;
				.avatar-preview{ // 头像图片
					max-width: 200rpx;
					max-height: 200rpx
				}
				.hu00h{ // 头像提示上传文字
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
			}
		}
	}
</style>
