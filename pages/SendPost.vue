<!-- 发布帖子页面 -->
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
							<text>发布帖子</text>
						</view>
					</uni-col>
					<uni-col class="t56f7" :span="8">
						<img src="../static/更多.png" alt="" />
					</uni-col>
				</uni-row>
			</view>
			<view>
				<uni-easyinput :inputBorder="false" v-model="uploadTitle"  type="textarea" maxlength="30" 
					placeholder="添加标题" :style="{ height: '70rpx'}"
				></uni-easyinput>
				<uni-easyinput :inputBorder="false" type="textarea" autoHeight v-model="uploadArticle" maxlength="800"
					placeholder="添加内容"
				></uni-easyinput>
			</view>
			<!-- 图片上传区 -->
			<view>
				<uni-section title="请选择要上传的图片" type="line">
					<view class="example-body">
						<uni-file-picker 
							limit="9" 
							title="最多选择9张图片"
							:auto-upload = "false"
							fileMediatype="image" 
							mode="grid" 
							@delete="handleDelete"
							@select="select" 
							@success="success" 
							@fail="fail" 
						></uni-file-picker>
					</view>
				</uni-section>
				<uni-button @click="uploadImages" 
					style="background-color: aquamarine; margin-top: 30rpx; width: 350rpx;"
				>立即发表</uni-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	
	const API_general_request_url = ref('');
	const pic_general_request_url = ref('');
	console.log("当前 NODE_ENV:", process.env.NODE_ENV);
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
	  
	    const token = uni.getStorageSync('token');  
	    if (!token) {  
	        uni.showToast({  
	            title: '未找到有效的登录令牌',  
	            icon: 'error'  
	        });  
	        return;  
	    }  
	  
	    try {  
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
	  
	        // 完成服务持久化记录  
	        const names = selectedTempFiles.value.map(file => file.name);
			console.log(names)
	        const postResponse = await uni.request({  
	            url: `${API_general_request_url.value}/api/post/addpost`,  
	            method: 'POST',  
	            header: {  
	                'Authorization': `Bearer ${token}`,
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
	            uni.showToast({  
	                title: '发布成功',  
	                icon: 'success'  
	            });  
				uni.navigateBack()
	        } else {  
	            console.log('无法持久化', postResponse);  
	            uni.showToast({  
	                title: '发布失败',  
	                icon: 'error'  
	            });  
	        }  
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
		uni.switchTab({
			url: '/pages/Home'
		})
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 750rpx;
		height: 100vh;
		.layout{
			width: 95%;
			height: 100%;
			padding-left: 20rpx;
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
		}
	}
</style>