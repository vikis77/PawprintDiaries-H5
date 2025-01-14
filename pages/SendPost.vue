<!-- 发布帖子页面 -->
<template>
	<view class="container">
		<view class="layout">
			<NavBar1001
				title="发布帖子"
				:showLeft="true"
				:showRight="true"
                @onRightClick = "uploadImages"
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
				<!-- <button class="submit-btn" @click="uploadImages">
					<text class="btn-text">立即发表</text>
				</button> -->
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

            console.log('原始文件名顺序：')
            console.log(postData.files)
			// 3. 处理文件名映射
			const fileNameConvertMap = postResponse.data.data.fileNameConvertMap;
            console.log('后端拿到的文件名映射1：')
            console.log(fileNameConvertMap)
			const convertedFiles = postData.files.map(file => {
                // 使用原始文件名作为key去查找转换后的文件名
                const convertedName = fileNameConvertMap[file.name];
                if (!convertedName) {
                    console.error(`未找到文件 ${file.name} 对应的转换名称`);
                }
                return {
                    ...file,
                    name: convertedName
                };
            });
            console.log('转换后的文件名：')
            console.log(convertedFiles)
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
						success: async (res) => {
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

    // 点击子组件后，触发父组件的handleSendPost
    // const handleSendPost = () => {
    //     return uploadImages()
    // }
	
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

		// 先返回上一页,再在后台处理上传
		uni.navigateBack();
		// 发送发帖成功通知,让My页面重新获取数据
		uni.$emit('postUploadSuccess');

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
		background-color: #ffffff;
		box-sizing: border-box;
		
		.layout {
			width: 100%;
			min-height: 100vh;
			background-color: #ffffff;
			padding: 0;
			box-sizing: border-box;
			position: relative;
		}
	}

	.input-section {
		margin: 20rpx 32rpx;
		position: relative;
		
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 1px;
			background-color: #f2f2f2;
		}
	}

	::v-deep .uni-easyinput {
		margin: 16rpx 0;
		
		.uni-easyinput__content {
			background-color: #ffffff;
			padding: 24rpx 0;
			border: none;
			
			&:focus-within {
				background-color: #ffffff;
				box-shadow: none;
			}
		}
		
		.uni-easyinput__placeholder-class {
			color: #bbbbc2;
			font-size: 32rpx;
			font-weight: 400;
		}

		textarea {
			font-size: 32rpx;
			color: #333333;
			line-height: 1.5;
			font-weight: 400;
		}
	}

	.title-input {
		::v-deep .uni-easyinput__content {
			padding: 24rpx 0 16rpx 0 !important;
			
			.uni-easyinput__content-textarea {
				min-height: 48rpx;
				font-size: 36rpx;
				font-weight: 500;
			}
		}
	}

	.word-count {
		font-size: 24rpx;
		color: #bbbbc2;
		margin-right: 0;
		position: absolute;
		right: 0;
		bottom: 16rpx;
		
		&--limit {
			color: #ff4d4f;
		}
	}

	.upload-section {
		margin: 32rpx;
	}

	::v-deep .uni-section {
		.uni-section-header {
			padding: 24rpx 0;
			
			.uni-section-header__content {
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
				padding-left: 0;
				
				&::before {
					display: none;
				}
			}
		}
	}

	.example-body {
		padding: 0;
		background: #ffffff;
		
		::v-deep .uni-file-picker {
			.is-add {
				border: 1px dashed #e5e5e5;
				border-radius: 8rpx;
				
				&:hover {
					border-color: #666666;
				}
			}

			.file-picker__box-content {
				border-radius: 8rpx;
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
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 98rpx;
		background: #7db3f4;
		border: none;
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 99;
		
		&::before {
			display: none;
		}
		
		&:active {
			opacity: 0.9;
		}
		
		.btn-text {
			color: #ffffff;
			font-size: 32rpx;
			font-weight: 400;
			letter-spacing: 2rpx;
		}
	}

	// 安全区适配
	.safe-area-inset-bottom {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
</```
rewritten_file>