<template>
	<view class="container">
		<view class="layout">
			<!-- 头部导航 -->
			<NavBar1001 
				:title="catId ? '猫猫编辑' : '添加猫猫'"
				:showRight="false"
			/>
			
			<!-- 表单区域 -->
			<view class="form-container">
				<uni-forms ref="baseForm" :modelValue="catBaseFormData" class="cat-form">
					<!-- 基本信息 -->
					<view class="form-section">
						<view class="section-title">基本信息 提示：仅限管理员编辑保存</view>
						<uni-forms-item label="猫名" required>
							<uni-easyinput 
								v-model="catBaseFormData.catname" 
								placeholder="请输入姓名"
								class="custom-input"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="头像" required class="avatar-item">
							<uni-file-picker
								ref="filePicker"
								mode="image"
								:file-mediatype="['image']"
								limit="1"
								:auto-upload="false"
								:value="selectedTempFiles"
								@upload-success="onUploadSuccess"
								@upload-fail="onUploadFail"
								@select="selectAvator"
								class="avatar-picker"
							>
								<template v-slot>
									<view v-if="selectedTempFilePaths.length > 0" class="avatar-preview-container" @click="handleReselect">
										<image 
											:src="selectedTempFilePaths[0]" 
											mode="aspectFill" 
											class="avatar-preview"
										/>
										<view class="avatar-hover-mask">
											<text class="hover-text">点击重新选择</text>
										</view>
									</view>
									<view v-else-if="catBaseFormData.avatar" class="avatar-preview-container" @click="handleReselect">
										<image 
											:src="`${pic_general_request_url}/cat_avatar/${catBaseFormData.avatar}${Suffix_1002}`" 
											mode="aspectFill" 
											class="avatar-preview"
										/>
										<view class="avatar-hover-mask">
											<text class="hover-text">点击重新选择</text>
										</view>
									</view>
									<view v-else class="avatar-placeholder">
										<image src="/static/images/default-avatar.png" mode="aspectFill" class="default-avatar"/>
										<text class="placeholder-text">点击上传头像</text>
									</view>
								</template>
							</uni-file-picker>
						</uni-forms-item>
						
						<uni-forms-item label="年龄" required>
							<uni-easyinput 
								v-model="catBaseFormData.age" 
								placeholder="请输入年龄(月)"
								class="custom-input"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="性别" required>
							<uni-data-checkbox 
								v-model="catBaseFormData.gender" 
								:localdata="sexs"
								class="custom-checkbox"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="品种" required>
							<uni-easyinput 
								v-model="catBaseFormData.breed" 
								placeholder="请输入猫咪品种"
								class="custom-input"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="常居地" required>
							<uni-easyinput 
								v-model="catBaseFormData.area" 
								placeholder="请输入猫咪常居地"
								class="custom-input"
							/>
						</uni-forms-item>
					</view>
					
					<!-- 健康信息 -->
					<view class="form-section">
						<view class="section-title">健康信息</view>
						<uni-forms-item label="绝育情况" required>
							<uni-data-checkbox 
								v-model="catBaseFormData.sterilizationStatus" 
								:localdata="sterilizationStatusList"
								class="custom-checkbox"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="疫苗接种" required>
							<uni-data-checkbox 
								v-model="catBaseFormData.vaccinationStatus" 
								:localdata="vaccinationStatusList"
								class="custom-checkbox"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="健康状态" required>
							<uni-data-checkbox 
								v-model="catBaseFormData.healthStatus" 
								:localdata="healthStatusList"
								class="custom-checkbox"
							/>
						</uni-forms-item>
					</view>
					
					<!-- 性格与习性 -->
					<view class="form-section">
						<view class="section-title">性格与习性</view>
						<uni-forms-item label="性格特征" required>
							<uni-easyinput 
								v-model="catBaseFormData.catCharacter" 
								placeholder="请描述猫猫性格"
								class="custom-input"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="食物偏好" required>
							<uni-easyinput 
								v-model="catBaseFormData.food" 
								placeholder="喜欢吃什么呢？"
								class="custom-input"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="禁忌" required>
							<uni-easyinput 
								v-model="catBaseFormData.taboo" 
								placeholder="有什么需要注意的吗？"
								class="custom-input"
							/>
						</uni-forms-item>
					</view>
					
					<!-- 其他信息 -->
					<view class="form-section">
						<view class="section-title">其他信息</view>
						<uni-forms-item label="不良记录">
							<uni-easyinput 
								type="textarea" 
								v-model="catBaseFormData.badRecord" 
								placeholder="记录一下不良行为..."
								class="custom-textarea"
							/>
						</uni-forms-item>
						
						<uni-forms-item label="撸猫指南">
							<uni-easyinput 
								type="textarea" 
								v-model="catBaseFormData.catGuide" 
								placeholder="如何正确撸猫呢..."
								class="custom-textarea"
							/>
						</uni-forms-item>
					</view>
					
					<!-- 提交按钮 -->
					<view class="form-buttons">
						<button class="submit-btn" @click="submitForm">保存修改</button>
						<button class="cancel-btn" @click="handleGoback">取消</button>
					</view>
				</uni-forms>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, nextTick } from 'vue';
	import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
	import NavBar1001 from '@/src/components/common/NavBar1001.vue'
    import { STATUS_CODE } from '@/src/constant/constant.js'
	
	const catId = ref(null);
	const catBaseFormData = ref({
		catname: '',
		gender: 2,
		age: '',
		food: '',
		taboo: '',
		catCharacter: '',
		healthStatus: '健康',
		sterilizationStatus: '未绝育',
		vaccinationStatus: '未接种',
		badRecord: '',
		catGuide: '',
		avatar: [],
		breed: '',
		area: ''
	});
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
	const filePicker = ref(null);
	
	onMounted(() => {
		const urlCatId = new URLSearchParams(window.location.search).get('catId');
		if (urlCatId) {
			catId.value = urlCatId;
			uni.showLoading({ title: '加载中...' });
			fetchCatDetails(urlCatId);
		}
	});
	
	// 请求猫的详细信息
	function fetchCatDetails(catId) {
		uni.request({
			url: `${API_general_request_url.value}/api/cat/${catId}`,
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
				} else if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
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
	
	// 处理重新选择
	const handleReselect = (e) => {
		e.stopPropagation(); // 阻止事件冒泡
		// 先清空数据
		selectedTempFilePaths.value = [];
		selectedTempFiles.value = [];
		// 等待DOM更新
		nextTick(() => {
			// 再调用选择器
			filePicker.value?.choose();
		});
	}
	
	// 选择新头像
	const selectAvator = (files) => {
		selectedTempFilePaths.value = files.tempFilePaths;
		selectedTempFiles.value = files.tempFiles;
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
	
	// 处理提交表单
	const submitForm = async() => {
		const token = uni.getStorageSync('token');  
		if (!checkLogin()) {
			return;
		}

		console.log(catBaseFormData.value)
		// 校验必填项
		if (!catBaseFormData.value.catname || !catBaseFormData.value.age 
			|| !catBaseFormData.value.food || !catBaseFormData.value.taboo || !catBaseFormData.value.catCharacter 
			|| !catBaseFormData.value.healthStatus || !catBaseFormData.value.sterilizationStatus 
			|| !catBaseFormData.value.vaccinationStatus || !catBaseFormData.value.breed || !catBaseFormData.value.area) {
			uni.showToast({
				title: '请填写所有必填项',
				icon: 'none'
			});
			return;
		}
		// 是否选择头像
		if (!catId.value && (!selectedTempFiles.value || selectedTempFiles.value.length === 0)) {
			// 新增猫咪时必须上传头像
			uni.showToast({
				title: '请选择头像',
				icon: 'none'
			});
			return;
		}

		let postData = {
			'catname': catBaseFormData.value.catname,
			'gender': catBaseFormData.value.gender,
			'age': catBaseFormData.value.age,
			'food': catBaseFormData.value.food,
			'taboo': catBaseFormData.value.taboo,
			'catCharacter': catBaseFormData.value.catCharacter,
			'healthStatus': catBaseFormData.value.healthStatus,
			'sterilizationStatus': catBaseFormData.value.sterilizationStatus,
			'vaccinationStatus': catBaseFormData.value.vaccinationStatus,
			'badRecord': catBaseFormData.value.badRecord,
			'catGuide': catBaseFormData.value.catGuide,
			'breed': catBaseFormData.value.breed,
			'area': catBaseFormData.value.area,
            'birthday': catBaseFormData.value.birthday
		};
		if (catId.value) {
			postData.catId = catId.value;
		}
		
		// 只有在选择了新头像时才更新头像信息
		if (selectedTempFiles.value && selectedTempFiles.value.length > 0) {
			postData.avatar = selectedTempFiles.value[0].name;
		}
		
		// 1、服务器持久化数据
		try {
			const postResponse = await uni.request({  
				url: `${API_general_request_url.value}/api/cat`,  
				method: catId.value ? 'PUT' : 'POST',  // 根据是否有catId决定是更新还是新增
				header: {  
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},  
				data: postData
			});  
			if (postResponse.statusCode === 200 && postResponse.data.code === STATUS_CODE.SUCCESS) {
                // 请求一次获取猫猫详情
                fetchCatDetails(catId.value);
				console.log("持久化完成")  
			} else {
				console.log(postResponse.data)
				uni.showToast({
					title: postResponse.data.msg || '提交失败',
					icon: 'none'
				});
				return;
			}

			// 2、如果选择了新头像，则上传到七牛云
			if (selectedTempFiles.value && selectedTempFiles.value.length > 0) {
                // 2.1、处理文件名映射
                const fileNameConvertMap = postResponse.data.data.fileNameConvertMap;
                const convertedFiles = selectedTempFiles.value.map((file, index) => {
                    const convertedName = Object.values(fileNameConvertMap)[index];
                    return {
                        ...file,
                        name: convertedName
                    };
                });
				// 2.2、获取上传凭证
				const response = await uni.request({  
					url: `${API_general_request_url.value}/api/upload/qiniuUploadToken`,  
					method: 'GET',  
					header: {  
						'Authorization': `Bearer ${token}`  
					}  
				});  
				
				if (response.statusCode == 200 && response.data.code == STATUS_CODE.SUCCESS) {  
					const uploadToken = response.data.data.qiniuToken;  
					try {
						// 2.3、上传文件到七牛云  
						const uploadRes = await new Promise((resolve, reject) => {  
							uni.uploadFile({  
								url: 'https://upload-z2.qiniup.com',  
								filePath: convertedFiles[0].path,  
								name: 'file',  
								formData: {  
									token: uploadToken,  
									key: `catcat/cat_avatar/${convertedFiles[0].name}`  
								},  
								success: (res) => {  
									if (res.statusCode === 200) {  
										resolve(res);  
									} else {  
										reject(new Error(`图片上传失败: ${res.data || '未知错误'}`));  
									}  
								},  
								fail: (error) => reject(new Error(`上传请求失败: ${error.errMsg || '未知错误'}`))
							});  
						});
					} catch (error) {
						uni.showToast({
							title: `头像上传失败: ${error.msg}`,
							icon: 'none',
							duration: 2000
						});
						return;
					}
				} else {
					uni.showToast({
						title: '获取上传凭证失败',
						icon: 'none',
						duration: 2000
					});
					return;
				}
			}
			
			// 全部操作成功后显示成功提示并返回
			uni.showToast({  
				title: catId.value ? '更新成功' : '添加成功',  
				icon: 'success',
				duration: 1500
			});  
			
			// 延迟返回，确保用户能看到成功提示
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
			
		} catch (error) {
			uni.showToast({
				title: `操作失败: ${error.msg || '未知错误'}`,
				icon: 'none',
				duration: 2000
			});
		}
	};

	// 返回
	const handleGoback = () => {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #f5f7fa;
	
	.form-container {
		padding: 30rpx;
		
		.cat-form {
			background: #fff;
			border-radius: 16rpx;
			padding: 40rpx 30rpx;
			box-shadow: 0 2px 12px rgba(0,0,0,0.04);
		}
		
		.form-section {
			margin-bottom: 48rpx;
			
			.section-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 24rpx;
				padding-left: 16rpx;
				border-left: 6rpx solid #8d5da3;
			}
		}
		
		.custom-input {
			background-color: #f8f9fa;
			border-radius: 8rpx;
			border: 2rpx solid #e9ecef;
			
			:deep(input) {
				font-size: 28rpx;
				color: #495057;
			}
		}
		
		.custom-textarea {
			background-color: #f8f9fa;
			border-radius: 8rpx;
			border: 2rpx solid #e9ecef;
			min-height: 180rpx;
			
			:deep(textarea) {
				font-size: 28rpx;
				color: #495057;
			}
		}
		
		.custom-checkbox {
			:deep(.uni-data-checklist) {
				display: flex;
				flex-wrap: wrap;
				gap: 16rpx;
			}
		}
		
		.avatar-item {
			:deep(.uni-file-picker__container) {
				width: 180rpx !important;
				height: 180rpx !important;
			}
			
			:deep(.uni-file-picker__box) {
				border-radius: 90rpx !important;
				overflow: hidden;
				border: 2rpx solid #e0e0e0;
			}
			
			// 隐藏文件名信息
			:deep(.file-picker__progress) {
				display: none !important;
			}
			
			:deep(.uni-file-picker__lists) {
				display: none !important;
			}
			
			.avatar-preview {
				width: 180rpx;
				height: 180rpx;
				border-radius: 90rpx;
				object-fit: cover;
				border: 2rpx solid #e0e0e0;
			}
			
			.avatar-placeholder {
				width: 180rpx;
				height: 180rpx;
				border-radius: 90rpx;
				background-color: #f8f9fa;
				border: 2rpx solid #e0e0e0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 8rpx;
				
				.default-avatar {
					width: 80rpx;
					height: 80rpx;
					opacity: 0.5;
				}
				
				.placeholder-text {
					font-size: 24rpx;
					color: #999;
					margin-top: 8rpx;
				}
			}
			
			.upload-tip {
				font-size: 24rpx;
				color: #999;
				margin-top: 8rpx;
			}
		}
		
		.form-buttons {
			margin-top: 60rpx;
			display: flex;
			gap: 24rpx;
			padding: 0 40rpx;
			
			button {
				flex: 1;
				height: 88rpx;
				border-radius: 44rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.submit-btn {
				background: linear-gradient(45deg, #8d5da3, #b876d9);
				color: #fff;
				border: none;
			}
			
			.cancel-btn {
				background: #fff;
				color: #666;
				border: 2rpx solid #ddd;
			}
		}
	}
}

// 添加过渡动画
.form-section {
	animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.avatar-preview-container {
	position: relative;
	width: 180rpx;
	height: 180rpx;
	border-radius: 90rpx;
	overflow: hidden;
	
	.avatar-hover-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		
		.hover-text {
			color: #fff;
			font-size: 24rpx;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		}
	}
}
</style>
