<!-- 猫猫信息卡片详情页
 
 -->
 <template>
	<view class="container">
		<view class="layout">
			<!-- 头部导航 -->
			<view class="header">
				<uni-row class="header-row" :width="750">
					<uni-col :span="8" class="header-left">
						<img src="../static/返回.png" @click="handleGoback" class="header-icon"/>
					</uni-col>
					<uni-col :span="8" class="header-center">
						<text class="header-title">小猫卡片</text>
					</uni-col>
					<uni-col :span="8" class="header-right">
						<view class="more-menu">
							<img src="../static/更多.png" @click="toggleMenu" class="header-icon"/>
							<!-- 悬浮菜单 -->
							<view class="floating-menu" v-if="showMenu">
								<view class="menu-item" @click="handleEdit">
									<text>编辑信息</text>
								</view>
							</view>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<!-- 主题信息展示 -->
			<view class="t2">
				<!-- 左边图片区域 -->
				<view class="tyh90p"> 
					<view class="t87kza">
						<image :src="`${pic_general_request_url}/cat_avatar/${cat.avatar}`" mode="aspectFill"></image>
					</view>
				</view>
				<!-- 右边信息区域 -->
				<view class="tz8ue">
					<view class="t79zqw">
						<view class="tzv88">
							<text>名字：{{ cat.catname }}</text>
						</view>
						<view class="tzv88">
							<text>年龄：{{ cat.age }}月</text>
						</view>
						<view class="tzv88">
							<text>性别：{{ cat.gender === 1 ? '雄性' : '雌性' }}</text>
						</view>
						<view class="tzv88">
							<text>种类：</text>
						</view>
						<view class="tzv8u">
							<image class="tz8888" src="../static/猫包.png" mode=""></image>
							<image class="tz8888" src="../static/猫包.png" mode=""></image>
							<image class="tz8888" src="../static/猫包.png" mode=""></image>
						</view>
						
					</view>
				</view>
			</view>
			<!-- 详细信息 -->
			<view class="t3">
				<view class="th80hj0">
					<view class="tzv8mkm">
						<text class="tzv00">是否已绝育：{{ cat.sterilizationStatus }}</text>
					</view>
					<view class="tzv8mkm">
						<text class="tzv00">是否接种疫苗：{{ cat.vaccinationStatus }}</text>
					</view>
					<view class="tzv8mkm">
						<text class="tzv00">健康状况：{{ cat.healthStatus }}</text>
					</view>
					<view class="tzv8mkm">
						<text class="tzv00">性格：{{ cat.catCharacter }}</text>
					</view>
					<view class="tzv8mkm">
						<text class="tzv00">食物偏好：{{ cat.food }}</text>
					</view>
					<view class="tzv8mkm">
						<text class="tzv00">忌讳：{{ cat.taboo }}</text>
					</view>
					<view class="tzv8mkm">
						<text class="tzv00">不良行为记录：{{ cat.badRecord }}</text>
					</view>
					<view class="tzv8mkm">
						<text class="tzv00">常住地：{{cat.area}}</text>
					</view>
					<view class="tzv8mkm">
						<text class="tzv00">撸猫指南：</text>
					</view>
				</view>
			</view>
			<!-- 照片墙 -->
			<view class="t4">
				<view class="t00zc">
					<view class="t23rx">
						<uni-section class="t8qfv" title="照片" type="square" ></uni-section>
						<view class="t9hz9">
							<view class="t09row">
								<view class="t9j0a" v-for="(item, index) in picUrlDatas" :key="index">
									<image class="i23qh" :src="`${pic_general_request_url}/cat_pics/${item.url}`" mode="aspectFill"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 添加侧边弹出菜单 -->
		<uni-popup ref="popup" type="right">
			<view class="popup-content">
				<view class="menu-item" @click="handleEdit">
					<uni-icons type="compose" size="20"></uni-icons>
					<text>编辑信息</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import uniRow from '@dcloudio/uni-ui/lib/uni-row/uni-row.vue';
	import uniCol from '@dcloudio/uni-ui/lib/uni-col/uni-col.vue';
	import uniSection from '@dcloudio/uni-ui/lib/uni-section/uni-section.vue';
	import uniGrid from '@dcloudio/uni-ui/lib/uni-grid/uni-grid.vue';
	import uniGridItem from '@dcloudio/uni-ui/lib/uni-grid-item/uni-grid-item.vue';
	
	const API_general_request_url = ref('');
	const pic_general_request_url = ref('');
	const showMenu = ref(false);
	const cat = ref(null);
	const picUrlDatas = ref([]);
	
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
	
	onMounted(() => {
		const options = getCurrentPages().pop().options; // 获取页面传递的参数
		const catId = options.catId; // 获取传递过来的 catId
		console.log(catId)
		const catList = uni.getStorageSync('catList'); // 获取猫猫列表
		console.log(catList)
		// 根据 catId 查找对应的小猫信息
		const selectedCat = catList.find(cat => cat.catId === parseInt(catId));
		// 将选中的猫信息存储到响应式数据中
		cat.value = selectedCat;
		
		// 获取猫猫照片
		uni.request({
			url: `${API_general_request_url.value}/api/cat/findPhotoByIdforPage?catId=${catId}`,
			method: 'GET,',
			success: (response) => {
				if (response.statusCode === 200 && response.data.code === '2000'){
					picUrlDatas.value = response.data.data;
				}else{
					uni.showToast({
						title: response.data.msg || '获取小猫图片失败',
						icon: 'none'
					})
				}
				console.log(response)
			},
			fail: (e) => {
				uni.showToast({
					title: '请求获取小猫图片失败，请重试',
					icon: 'none'
				});
			}
		})
	});
	
	function handleGoback() {
		const pages = getCurrentPages();
		if (pages.length > 1) {
			uni.navigateBack();
		} else {
			uni.reLaunch({
				url:"/pages/CatClaw"
			});
		}
	}
	
	function toggleMenu() {
		showMenu.value = !showMenu.value;
	}
	
	function handleEdit() {
		showMenu.value = false;
		const catId = cat.value.catId;
		uni.navigateTo({
			url: `/pages/catEdit?catId=${catId}`
		});
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 750rpx;
		height: 100vh;
		// .layout::before {
		//   content: "";
		//   position: absolute;
		//   top: 300rpx; /* 控制图片的垂直位置 */
		//   left: -100rpx; /* 控制图片的水平位置 */
		//   width: 300px; /* 控制图片宽度 */
		//   height: 300px; /* 控制图片高度 */
		//   background-image: url('../static/猫包.png');
		//   background-size: cover; /* 填充整个伪元素 */
		//   background-repeat: no-repeat; /* 不重复 */
		//   transform: rotate(45deg); /* 旋转45度 */
		//   z-index: 0; /* 确保图片在渐变之下 */
		// }
		.layout{
			// position: absolute;
			width: 100%;
			height: 100%;
			// margin-top: 40rpx;
			background-color: #f1f4f7;
			background: linear-gradient(to right, #fdeda9, #fffce2); /* 渐变背景 */
			// overflow: hidden; /* 防止旋转的内容溢出 */
			// background: linear-gradient(to right, #fdeda9, #fffce2); /* 渐变背景 */
			// background: url('../static/猫包.png'),linear-gradient(to right, #fdeda9, #fffce2);
			// // background-size: cover; //* 背景图充满容器 */
			// background-position: 400rpx 200rpx , center; //* 背景图居中 */
			// background-repeat: no-repeat; //* 背景图不重复
			// transform: rotate(45deg); /* 旋转45度 */
			
			.header {
				position: sticky;
				top: 0;
				z-index: 100;
				background-color: #fff;
				box-shadow: 0 2px 8px rgba(0,0,0,0.06);
				
				&-row {
					height: 180rpx;
					display: flex;
					align-items: center;
				}
				
				&-icon {
					width: 48rpx;
					height: 48rpx;
				}
				
				&-title {
					font-size: 36rpx;
					font-weight: 600;
					color: #333;
				}
				
				&-left, &-center, &-right {
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			
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
							width: 55rpx;
							height: 55rpx;
						}
					}
					.tgq89{ // 中间文字
						width: 100%;
						height: 200rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						text{
							font-size: 55rpx;
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
							width: 50rpx;
							height: 50rpx;
						}
					}
				}
			}
			.t2{ //主题信息展示
				width: 100%;
				height: 400rpx;
				display: flex;
				margin-top: 100rpx;
				.tyh90p{ //	<!-- 左边图片区域 -->
					width: 50%;
					height: 100%;
					.t87kza{
						width: 100%;
						height: 300rpx;
						padding-left: 50rpx;
						image{
							width: 300rpx;
							height: 300rpx;
							border-radius: 20rpx;
							border: 12rpx solid #ffffff;
							box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 3px 1px; /* 软阴影 */
						}
					}
				}
				.tz8ue{ //<!-- 右边信息区域 -->
					width: 50%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					.t79zqw{
						width: 100%;
						height: 100%;
						flex-direction: column;
						.tzv88{ //文字
							width: 100%;
							height: 74rpx;
							display: flex;
							align-items: center;
							// justify-content: center;
							padding-left: 80rpx;
							font-size: 30rpx;
							font-weight: 700;
						}
						.tzv8u{ //猫包
							width: 100%;
							height: 100%;
							margin-left: 60rpx;
							.tz8888{ //image
								width: 100rpx;
								height: 100rpx;
							}
						}
					}
				}
			}
			.t3{ //<!-- 详细信息 -->
				width: 100%;
				height: 450rpx;
				background-color: #f3f7fd;
				// display: flex;
				// align-items: center;
				// justify-content: center;
				// flex-direction: column;
				border-radius: 50rpx 50rpx 0rpx 0rpx;
				border: 2rpx solid #dbdbdb;
				box-shadow: 0rpx -10rpx 40rpx rgba(0, 0, 0, 0.1);
				.th80hj0{
					width: 100%;
					height: 100%;
					// align-items: center;
					// justify-content: center;
					// flex-direction: column;
					display: flex;
					flex-wrap: wrap;
					// align-items: center;
					justify-content: center;
					.tzv8mkm{
						width: 50%;
						// height: 70rpx;
						// flex-direction: column;
						.tzv00{ //文字
							width: 100%;
							height: 100%;
							display: flex;
							align-items: center;
							padding-left: 60rpx;
							// justify-content: center;
							font-size: 30rpx;
							font-weight: bold;
						}
					}
				}
			}
			.t4{ //<!-- 照片墙 -->
				width: 100%;
				// height: 100vh;
				padding-bottom: 50rpx;
				background-color: #ffffff;
				// display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				border: 2rpx solid #dbdbdb;
				.t00zc{
					width: 100%;
					height: 100%;
					// display: flex;
					.t23rx{
						width: 100%;
						height: 100%;
						.t8qfv{
							width: 100%;
							height: 100rpx;
						}
						.t9hz9{ //照片box
							width: 100%;
							height: auto;
							display: flex;
							flex-wrap: wrap; // 允许自动换行
							justify-content: space-between; // 保持间距均匀
							.t09row{ //一张张照片
								width: 100%;
								height: auto;
								display: flex;
								flex-wrap: wrap; // 保证换行
								justify-content: space-between;
								.t9j0a{ //image-box
									width: 32%; // 设置每张照片盒子的宽度为容器的 32% (保证三张照片加间距不超出100%)
									height: 240rpx;
									margin-bottom: 10rpx; // 图片之间的垂直间距
									.i23qh{ //image
										width: 240rpx;
										height: 240rpx;
									}
								}
							}
						}
						
					}
				}
			}
		}
	}
	
	.popup-content {
		width: 200rpx;
		background-color: #fff;
		padding: 20rpx 0;
		border-radius: 16rpx 0 0 16rpx;
		box-shadow: -2px 0 10px rgba(0,0,0,0.1);
		
		.menu-item {
			display: flex;
			align-items: center;
			padding: 24rpx 32rpx;
			gap: 16rpx;
			
			&:active {
				background-color: #f5f5f5;
			}
			
			text {
				font-size: 28rpx;
				color: #333;
			}
		}
	}
	
	.more-menu {
		position: relative;
	}
	
	.floating-menu {
		position: absolute;
		top: 100%;
		right: 0;
		background-color: #fff;
		border-radius: 8rpx;
		box-shadow: 0 2px 12px rgba(0,0,0,0.15);
		z-index: 999;
		margin-top: 10rpx;
		min-width: 160rpx;
		
		&::before {
			content: '';
			position: absolute;
			top: -16rpx;
			right: 24rpx;
			border: 8rpx solid transparent;
			border-bottom-color: #fff;
		}
		
		.menu-item {
			padding: 20rpx 32rpx;
			text-align: center;
			
			&:active {
				background-color: #f5f5f5;
			}
			
			text {
				font-size: 28rpx;
				color: #333;
				white-space: nowrap;
			}
		}
	}
</style>