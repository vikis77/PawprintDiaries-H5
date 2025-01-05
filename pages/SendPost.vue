<!-- 发布帖子页面 -->
<template>
	<view class="container">
		<view class="layout">
			<NavBar1001
				title="发布帖子"
				:showLeft="true"
				:showRight="false"
			/>
			<view class="input-section">
				<uni-easyinput 
					:inputBorder="false" 
					v-model="uploadTitle"  
					type="textarea"
					autoHeight
					:styles="{
						minHeight: '80rpx',
						maxHeight: '160rpx'
					}"
					placeholder="添加标题" 
					class="title-input"
					@input="handleTitleInput"
					@keydown="handleTitleKeydown"
					:maxlength="30"
					trim="true"
					confirmType="done"
				>
					<template #right>
						<text class="word-count" :class="{ 'word-count--limit': titleLength >= 30 }">{{titleLength}}/30</text>
					</template>
				</uni-easyinput>
				<uni-easyinput 
					:inputBorder="false" 
					type="textarea" 
					autoHeight 
					v-model="uploadArticle" 
					maxlength="800"
					placeholder="添加内容"
					class="content-input"
					@input="handleArticleInput"
					@keydown="handleArticleKeydown"
					trim="true"
					confirmType="done"
				>
					<template #right>
						<text class="word-count" :class="{ 'word-count--limit': articleLength >= 800 }">{{articleLength}}/800</text>
					</template>
				</uni-easyinput>
			</view>
			<!-- 图片上传区 -->
			<view class="upload-section">
				<uni-section title="请选择要上传的图片" type="line">
					<view class="example-body">
						<uni-file-picker 
							limit="9" 
							title="至少选择1张，最多选择9张"
							:auto-upload="false"
							fileMediatype="image" 
							mode="grid" 
							@delete="handleDelete"
							@select="select" 
							@success="success" 
							@fail="fail" 
						></uni-file-picker>
					</view>
				</uni-section>
				<button class="submit-btn" @click="uploadImages">
					<text class="btn-text">立即发表</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
    import { STATUS_CODE } from '@/src/constant/constant.js'
	import NavBar1001 from '@/src/components/common/NavBar1001.vue'

	const selectedTempFilePaths = ref([]); // 存储已选择的图片的路径
	const selectedTempFiles = ref([]); // 存储已选择的图片信息
	const uploadTitle = ref(''); // 标题
	const uploadArticle = ref(''); //内容
	const uploadToken = ref(''); // 上传凭证
	
	// 计算标题字数
	const titleLength = computed(() => {
		return uploadTitle.value.length;
	});
	
	// 计算内容字数
	const articleLength = computed(() => {
		return uploadArticle.value.length;
	});
	
	// 监听标题输入前
	const handleTitleKeydown = (e) => {
		// 如果已经达到字数限制，且不是删除键或方向键
		if (uploadTitle.value.length >= 30 && 
			!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
			e.preventDefault(); // 阻止输入
			uni.showToast({
				title: '标题最多30个字',
				icon: 'none'
			});
			return false;
		}
	};
	
	// 监听内容输入前
	const handleArticleKeydown = (e) => {
		// 如果已经达到字数限制，且不是删除键或方向键
		if (uploadArticle.value.length >= 800 && 
			!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
			e.preventDefault(); // 阻止输入
			uni.showToast({
				title: '内容最多800个字',
				icon: 'none'
			});
			return false;
		}
	};
	
	// 监听标题输入（作为备用验证）
	const handleTitleInput = (e) => {
		const value = e;
		uploadTitle.value = value.slice(0, 30);
	};
	
	// 监听内容输入（作为备用验证）
	const handleArticleInput = (e) => {
		const value = e;
		uploadArticle.value = value.slice(0, 800);
	};
	
	// 新增选择图片
	const select = (files) => {
		// console.log('已选择图片：',files)
	  selectedTempFilePaths.value.push(...files.tempFilePaths)
	  selectedTempFiles.value.push(...files.tempFiles)
	  console.log("已选择的文件路径列表:", selectedTempFilePaths.value);
	  console.log("已选择的文件列表:", selectedTempFiles.value);
	}
	
	// 删除图片
	const handleDelete = (files) => {
	  const { index } = files; // 获取要删除的文件索引
	  console.log('已删除图片：', files);
	
	  // 从选中的文件路径和文件列表中删除
	  if (index >= 0 && index < selectedTempFilePaths.value.length) {
	    selectedTempFilePaths.value.splice(index, 1);
	    selectedTempFiles.value.splice(index, 1);
	    console.log("删除后文件路径列表:", selectedTempFilePaths.value);
	    console.log("删除后文件列表:", selectedTempFiles.value);
	  } else {
	    console.error('索引不合法，无法删除文件。');
	  }
	}
	
	// 异步处理上传逻辑
	const handleAsyncUpload = async (postData) => {
		try {
			// 2. 服务器持久化帖子
			const names = postData.files.map(file => file.name);
			const postResponse = await uni.request({
				url: `${API_general_request_url.value}/api/post/addpost`,
				method: 'POST',
				header: {
					'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					'Content-Type': 'application/json'
				},
				data: {
					'title': postData.title,
					'article': postData.article,
					'pictrueList': names
				}
			});

			if (postResponse.statusCode !== 200 || postResponse.data.code !== STATUS_CODE.SUCCESS) {
				throw new Error('帖子创建失败');
			}

			// 3. 处理文件名映射
			const fileNameConvertMap = postResponse.data.data.fileNameConvertMap;
			const convertedFiles = postData.files.map((file, index) => {
				const convertedName = Object.values(fileNameConvertMap)[index];
				return {
					...file,
					name: convertedName
				};
			});

			// 4. 获取七牛云上传凭证
			const tokenResponse = await uni.request({
				url: `${API_general_request_url.value}/api/upload/qiniuUploadToken`,
				method: 'GET',
				header: {
					'Authorization': `Bearer ${uni.getStorageSync('token')}`
				}
			});

			if (tokenResponse.statusCode !== 200 || tokenResponse.data.code !== STATUS_CODE.SUCCESS) {
				throw new Error('获取上传凭证失败');
			}

			const qiniuToken = tokenResponse.data.data.qiniuToken;

			// 5. 上传文件到七牛云
			const uploadPromises = convertedFiles.map(file => {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: 'https://upload-z2.qiniup.com',
						filePath: file.path,
						name: 'file',
						formData: {
							token: qiniuToken,
							key: `catcat/post_pics/${file.name}`
						},
						success: (res) => {
							if (res.statusCode === 200) {
								resolve(res);
							} else {
								reject(new Error('图片上传失败'));
							}
						},
						fail: reject
					});
				});
			});

			await Promise.all(uploadPromises);

			// 6. 上传成功，发送全局通知
			uni.$emit('postUploadSuccess', {
				message: '发布成功'
			});

		} catch (error) {
			console.error('发布过程中发生错误:', error);
			throw error;
		}
	};
	
	// 处理发布逻辑
	const uploadImages = async () => {
		// 1. 输入验证
		if (!uploadTitle.value?.trim()) {
			uni.showToast({
				title: '请输入标题',
				icon: 'none'
			});
			return;
		}

		if (!uploadArticle.value?.trim()) {
			uni.showToast({
				title: '请输入内容',
				icon: 'none'
			});
			return;
		}

		if (selectedTempFiles.value.length === 0) {
			uni.showToast({
				title: '至少要选择一张图片噢！',
				icon: 'none'
			});
			return;
		}

		if (!checkLogin()) {
			return;
		}

		// 立即显示发布中的提示
		uni.showToast({
			title: '发布中...',
			icon: 'loading',
			duration: 1500
		});

		// 保存当前的表单数据
		const postData = {
			title: uploadTitle.value,
			article: uploadArticle.value,
			files: [...selectedTempFiles.value]
		};

		// 立即返回上一页
		uni.navigateBack();

		// 在后台异步处理上传
		handleAsyncUpload(postData).catch(error => {
			console.error('后台上传失败:', error);
			// 如果上传失败，通过全局事件通知用户
			uni.$emit('postUploadFailed', {
				message: '帖子上传失败，请重试'
			});
		});
	};
	
	// 返回事件
	function handleGoback(){
		// uni.switchTab({
		// 	url: 'Home'
		// })
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 750rpx;
		min-height: 100vh;
		background: linear-gradient(135deg, #f6f8fa 0%, #e8edf2 100%);
		padding: 20rpx 0;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		
		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: -50%;
			width: 200%;
			height: 200%;
			background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%);
			animation: rotate 45s linear infinite;
			z-index: 1;
		}
		
		.layout {
			width: 94%;
			margin: 0 auto;
			min-height: calc(100vh - 40rpx);
			background-color: #ffffff;
			border-radius: 40rpx;
			box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
			padding: 30rpx;
			box-sizing: border-box;
			position: relative;
			z-index: 2;
			animation: slideUp 0.6s ease-out;
		}
	}

	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(40rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.input-section {
		margin: 30rpx 0;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
		position: relative;
		overflow: hidden;
		
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 2rpx;
			background: linear-gradient(90deg, 
				rgba(116, 185, 255, 0) 0%,
				rgba(116, 185, 255, 0.5) 50%,
				rgba(116, 185, 255, 0) 100%
			);
		}
	}

	::v-deep .uni-easyinput {
		margin: 20rpx 0;
		
		.uni-easyinput__content {
			background-color: #f8f9fa;
			border-radius: 16rpx;
			padding: 24rpx;
			border: 2rpx solid #e9ecef;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			
			&:focus-within {
				background-color: #fff;
				box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
				border-color: #74b9ff;
				transform: translateY(-2rpx) scale(1.002);
			}
		}
		
		.uni-easyinput__placeholder-class {
			color: #adb5bd;
			font-size: 28rpx;
			transition: all 0.3s ease;
		}

		textarea {
			font-size: 30rpx;
			color: #2d3436;
			line-height: 1.6;
		}
	}

	.title-input {
		::v-deep .uni-easyinput__content {
			background-color: #fff;
			border-bottom: 2rpx solid #e9ecef;
			margin-bottom: 20rpx;
			padding: 20rpx 24rpx !important;
			
			&:focus-within {
				border-bottom-color: #9370db;
			}

			.uni-easyinput__content-textarea {
				min-height: 60rpx;
				max-height: 120rpx;
				line-height: 1.5;
			}
		}
	}

	.word-count {
		font-size: 24rpx;
		color: #999;
		margin-right: 20rpx;
		position: absolute;
		right: 0;
		bottom: 10rpx;
		transition: all 0.3s ease;
		
		&--limit {
			color: #ff6b6b;
			font-weight: 500;
			transform: scale(1.05);
		}
	}

	.upload-section {
		margin-top: 40rpx;
		animation: fadeIn 0.6s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	::v-deep .uni-section {
		.uni-section-header {
			padding: 24rpx 20rpx;
			
			.uni-section-header__content {
				font-size: 32rpx;
				font-weight: 600;
				color: #2d3436;
				position: relative;
				padding-left: 24rpx;
				
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 6rpx;
					height: 32rpx;
					background: linear-gradient(45deg, #0984e3, #74b9ff);
					border-radius: 6rpx;
					transition: all 0.3s ease;
				}
				
				&:hover::before {
					height: 40rpx;
					background: linear-gradient(45deg, #0984e3, #00a8ff);
				}
			}
		}
	}

	.example-body {
		padding: 30rpx;
		background: #ffffff;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;
		
		&:hover {
			box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
			transform: translateY(-2rpx);
		}
		
		::v-deep .uni-file-picker {
			.is-add {
				border: 2rpx dashed #74b9ff;
				border-radius: 16rpx;
				transition: all 0.3s ease;
				cursor: pointer;
				
				&:hover {
					background-color: rgba(241, 243, 245, 0.8);
					border-color: #0984e3;
				}
			}

			.file-picker__box-content {
				border-radius: 16rpx;
				overflow: hidden;
				
				image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
	}

	.submit-btn {
		width: 40%;
		height: 88rpx;
		margin: 60rpx auto 30rpx;
		background: #9370db;
		border: none;
		border-radius: 12rpx;
		box-shadow: 0 6rpx 16rpx rgba(147, 112, 219, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		
		&:hover {
			transform: translateY(-2rpx);
			box-shadow: 0 8rpx 20rpx rgba(147, 112, 219, 0.2);
			background: #8a2be2;
		}
		
		&:active {
			transform: translateY(2rpx);
			box-shadow: 0 4rpx 12rpx rgba(147, 112, 219, 0.15);
		}
		
		.btn-text {
			color: #fff;
			font-size: 32rpx;
			font-weight: 500;
			letter-spacing: 4rpx;
			font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
		}
	}
</style>
</```
rewritten_file>