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
					maxlength="30" 
					placeholder="添加标题" 
					class="title-input"
				></uni-easyinput>
				<uni-easyinput 
					:inputBorder="false" 
					type="textarea" 
					autoHeight 
					v-model="uploadArticle" 
					maxlength="800"
					placeholder="添加内容"
					class="content-input"
				></uni-easyinput>
			</view>
			<!-- 图片上传区 -->
			<view class="upload-section">
				<uni-section title="请选择要上传的图片" type="line">
					<view class="example-body">
						<uni-file-picker 
							limit="9" 
							title="最多选择9张图片"
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
	import { ref } from 'vue';
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
	import NavBar1001 from '@/src/components/common/NavBar1001.vue'

	const selectedTempFilePaths = ref([]); // 存储已选择的图片的路径
	const selectedTempFiles = ref([]); // 存储已选择的图片信息
	const uploadTitle = ref(''); // 标题
	const uploadArticle = ref(''); //内容
	const uploadToken = ref(''); // 上传凭证
	
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
	
	// 处理发布逻辑
	const uploadImages = async () => {  


	    console.log('标题：', uploadTitle.value);  
	    console.log('内容：', uploadArticle.value);  
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
	  
	    try {
			// 服务器持久化帖子  
	        const names = selectedTempFiles.value.map(file => file.name);
			console.log(names)
	        const postResponse = await uni.request({  
	            url: `${API_general_request_url.value}/api/post/addpost`,  
	            method: 'POST',  
	            header: {  
	                'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					'Content-Type': 'application/json'  // 添加 Content-Type 声明
	            },  
	            data: {  
	                'title': uploadTitle.value,  
	                'article': uploadArticle.value,  
	                'pictrueList': names  
	            }  
	        });  
	        if (postResponse.statusCode === 200 && postResponse.data.code === '2000') {  
	            console.log('已完成持久化帖子', postResponse);  
	            
	        } else {  
	            console.log('无法持久化', postResponse);  
	            uni.showToast({  
	                title: '发布失败',  
	                icon: 'error'  
	            });  
				return;
	        } 

	        // 获取上传凭证  
	        const response = await uni.request({  
	            url: `${API_general_request_url.value}/api/upload/qiniuUploadToken`,  
	            method: 'GET',  
	            header: {  
	                'Authorization': `Bearer ${uni.getStorageSync('token')}`  
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
	                        key: `catcat/post_pics/${file.name}`  
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
			
			uni.showToast({  
	                title: '发布成功',  
	                icon: 'success'  
	            });  
				uni.navigateBack()
	         
	    } catch (error) {  
	        console.error('发布过程中发生错误:', error);  
	        uni.showToast({  
	            title: '发布失败',  
	            icon: 'error'  
	        });  
	    }  
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
			height: 80rpx !important;
			padding: 10rpx 24rpx !important;
			
			&:focus-within {
				border-bottom-color: #9370db;
			}
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