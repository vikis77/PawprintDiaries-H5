<!-- 猫猫信息卡片详情页
 
 -->
 <template>
	<view class="container">
		<!-- 全局遮罩层 -->
		<view v-if="showMenu" class="mask" @click.stop="showMenu = false"></view>
		
		<scroll-view scroll-y="true" class="scroll-container">
			<view class="layout">
				<!-- 头部导航 -->
				<view class="header animate-slide-in">
					<uni-row class="header-row" :width="750">
						<uni-col :span="8" class="header-left">
							<img src="../static/goback.png" @click="handleGoback" class="header-icon"/>
						</uni-col>
						<uni-col :span="8" class="header-center">
							<text class="header-title">小猫卡片</text>
						</uni-col>
						<uni-col :span="8" class="header-right">
							<view class="more-menu">
								<img src="../static/more.png" @click.stop="toggleMenu" class="header-icon"/>
								<!-- 悬浮菜单 -->
								<view class="floating-menu" v-if="showMenu">
									<view class="menu-item" @click.stop="handleEdit">
										<text>编辑信息</text>
									</view>
									<view class="menu-item" @click.stop="toggleDonateMenu">
										<text>捐赠/领养</text>
									</view>
									<view class="menu-item" @click.stop="handleDelete">
										<text>删除小猫</text>
									</view>
								</view>
							</view>
						</uni-col>
					</uni-row>
				</view>

				<!-- 加载中提示 -->
				<view v-if="!isDataLoaded" class="loading-container">
					<uni-load-more status="loading" :content-text="loadingText"></uni-load-more>
				</view>

				<!-- 主要内容区域，只在数据加载完成后显示 -->
				<template v-else>
					<!-- 主题信息展示 -->
					<view class="t2 animate-fade-in">
						<!-- 左边图片区域 -->
						<view class="tyh90p"> 
							<view class="t87kza">
								<image :src="`${pic_general_request_url}/cat_avatar/${cat.avatar}${Suffix_1002}`" mode="aspectFill" @click="previewImage([`${pic_general_request_url}/cat_avatar/${cat.avatar}${Suffix_1000}`])"></image>
							</view>
							<!-- 添加互动区域 -->
							<view class="interaction-area">
								<view class="interaction-item" @click="handleLike">
									<uni-icons :type="isLiked ? 'heart-filled' : 'heart'" size="24" :color="isLiked ? '#ff4d4f' : '#666'"></uni-icons>
									<text :class="{'liked': isLiked}" class="like-count">{{cat.likeCount}}</text>
								</view>
								<view class="interaction-item">
									<uni-icons type="fire" size="24" color="#ff9c6e"></uni-icons>
									<text class="trending-count">{{cat.trending || 0}}</text>
								</view>
								<view class="interaction-item" @click="showComments">
									<uni-icons type="chat" size="24" color="#666"></uni-icons>
									<text class="comment-count">{{commentCount}}</text>
								</view>
								<view class="interaction-item" @click="handleShare">
									<uni-icons type="paperplane" size="24" color="#666"></uni-icons>
								</view>
							</view>
						</view>
						<!-- 右边信息区域 -->
						<view class="tz8ue">
							<view class="t79zqw">
								<view class="tzv88">
									<text class="cat-name">名字：{{ cat.catname }}</text>
								</view>
								<view class="tzv88">
									<text class="cat-age">年龄：{{ cat.age }}月</text>
								</view>
								<view class="tzv88">
									<text class="cat-gender">性别：{{ cat.gender === 1 ? '雄性' : '雌性' }}</text>
								</view>
								<view class="tzv88">
									<text class="cat-adopt-status" :class="{'adopted': cat.isAdopted === 1}">状态：{{ cat.isAdopted === 1 ? '已被领养' : '等待领养' }}</text>
								</view>
								<view class="timeline-btn" @click="showTimeline">
									<uni-icons type="flag" size="24" color="#666"></uni-icons>
									<text>小猫时间轴</text>
								</view>
								<view class="search-btn" @click="handleSearch">
									<uni-icons type="search" size="20" color="#666"></uni-icons>
									<text>查找相关内容</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 详细信息 -->
					<view class="t3 animate-slide-up">
						<view class="section-title">
							<text>详细信息</text>
						</view>
						<view class="th80hj0">
							<view class="tzv8mkm">
								<view class="lefttzv00">
									<text class="info-label">是否已绝育</text>
									<text class="info-value">{{ cat.sterilizationStatus }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="righttzv00">
									<text class="info-label">是否接种疫苗</text>
									<text class="info-value">{{ cat.vaccinationStatus }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="lefttzv00">
									<text class="info-label">健康状况</text>
									<text class="info-value">{{ cat.healthStatus }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="righttzv00">
									<text class="info-label">性格</text>
									<text class="info-value">{{ cat.catCharacter }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="lefttzv00">
									<text class="info-label">食物偏好</text>
									<text class="info-value">{{ cat.food }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="righttzv00">
									<text class="info-label">忌讳</text>
									<text class="info-value">{{ cat.taboo }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="lefttzv00">
									<text class="info-label">品种</text>
									<text class="info-value">{{ cat.breed || '暂无' }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="righttzv00">
									<text class="info-label">常住地</text>
									<text class="info-value">{{ cat.area }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="lefttzv00">
									<text class="info-label">撸猫指南</text>
									<text class="info-value">{{ cat.catGuide || '暂无' }}</text>
								</view>
							</view>
							<view class="tzv8mkm">
								<view class="righttzv00">
									<text class="info-label">不良行为记录</text>
									<text class="info-value">{{ cat.badRecord }}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 照片墙 -->
					<view class="t4 animate-fade-in">
						<view class="t00zc">
							<view class="t23rx">
								<uni-section class="t8qfv" title="照片（最多展示8张）" type="square" ></uni-section>
								<view class="t9hz9">
									<view class="t09row">
										<!-- 添加上传按钮 -->
										<view class="t9j0a upload-box" @click="handleUpload" v-if="isAdmin">
											<view class="upload-content">
												<uni-icons type="plusempty" size="40" color="#999"></uni-icons>
												<text>上传图片（管理员）</text>
											</view>
										</view>
										<view class="t9j0a" v-for="(item, index) in picUrlDatas" :key="index">
											<view class="image-container">
												<image class="i23qh" :src="`${pic_general_request_url}/cat_pics/${item.url}${Suffix_1002}`" mode="aspectFill" @click="previewImage(picUrlDatas.map(pic => `${pic_general_request_url}/cat_pics/${pic.url}`), index)"></image>
												<!-- 添加图片操作按钮 -->
												<view class="image-actions" v-if="isAdmin">
													<view class="action-btn edit-btn" @click.stop="handleEditImage(index)">
														<uni-icons type="compose" size="20" color="#fff"></uni-icons>
													</view>
													<view class="action-btn delete-btn" @click.stop="handleDeleteImage(index)">
														<uni-icons type="trash" size="20" color="#fff"></uni-icons>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</template>
				
				<!-- 底部上拉评论区提示条 -->
				<view class="comment-hint" 
					@touchstart.stop="touchStart" 
					@touchmove.stop="touchMove" 
					@touchend.stop="touchEnd">
					<view class="hint-content">
						<text>上滑查看评论区</text>
						<uni-icons type="top" size="14" color="#999"></uni-icons>
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
			<!-- 捐赠/领养选择弹窗 -->
			<uni-popup ref="popupSelect" type="center" background-color="transparent">
				<view class="donate-section">
					<view class="donate-card" @click="handleClickAdopt">
						<img class="card-icon" src="/static/hover.png" mode="aspectFit"/>
						<text class="card-title">我要领养</text>
						<text class="card-desc">给流浪猫一个温暖的家</text>
					</view>
					
					<view class="donate-card" @click="handleClickDonate">
						<img class="card-icon" src="/static/donate.png" mode="aspectFit"/>
						<text class="card-title">我要捐赠</text>
						<text class="card-desc">为流浪猫献上一份爱心</text>
					</view>
				</view>
			</uni-popup>

			<!-- 领养弹窗 -->
			<uni-popup ref="popupAdopt" type="center">
				<view class="popup-box">
					<view class="popup-title">领养申请</view>
					<view class="form-content">
						<uni-forms :model="adoptFormsData">
							<uni-forms-item label="您想领养的猫咪？" required labelWidth="70">
								<uni-data-select
									v-model="adoptFormsData.catName"
									:localdata="catSelectList"
									placeholder="请选择想领养的猫咪"
									@change="handleCatSelect"
								/>
							</uni-forms-item>
							<uni-forms-item label="您的姓名" required label-width="70">
								<uni-easyinput v-model="adoptFormsData.name" placeholder="" />
							</uni-forms-item>
							<uni-forms-item label="您的班级" required label-width="70">
								<uni-easyinput v-model="adoptFormsData.class" placeholder="" />
							</uni-forms-item>
							<uni-forms-item label="您的籍贯" required label-width="70">
								<uni-easyinput v-model="adoptFormsData.origin" placeholder="" />
							</uni-forms-item>
							<uni-forms-item label="手机号码" required label-width="70">
								<uni-easyinput v-model="adoptFormsData.phone" placeholder="" />
							</uni-forms-item>
							<uni-forms-item label="微信号" required label-width="70">
								<uni-easyinput v-model="adoptFormsData.wechat" placeholder="" />
							</uni-forms-item>
						</uni-forms>
					</view>
					<view class="popup-buttons">
						<button class="btn-cancel" @click="closeAdoptPopup">取消</button>
						<button class="btn-submit" @click="submitAdoptForm">提交</button>
					</view>
				</view>
			</uni-popup>

			<!-- 捐赠弹窗 -->
			<uni-popup ref="popupDonate" type="center">
				<view class="popup-box">
					<view class="popup-title">爱心捐赠</view>
					<view class="qr-content">
						<view class="qr-item">
							<text class="qr-title">微信支付</text>
							<img class="qr-image" src="../static/cat.png" mode="aspectFit"/>
						</view>
						<view class="qr-item">
							<text class="qr-title">支付宝</text>
							<img class="qr-image" src="../static/cat.png" mode="aspectFit"/>
						</view>
					</view>
					<view class="donate-note">
						<text>说明：</text>
						<text>1. 您的每一笔捐赠都将用于校园猫咪的日常护理</text>
						<text>2. 资金使用情况将定期公示</text>
						<text>3. 感谢您的爱心支持！</text>
					</view>
					<view class="popup-buttons">
						<button class="btn-cancel" @click="closeDonatePopup">关闭</button>
					</view>
				</view>
			</uni-popup>
			<!-- 评论弹窗 -->
			<uni-popup ref="commentPopup" type="bottom" background-color="#fff">
				<view class="comment-popup" 
					@touchstart.stop="touchStart" 
					@touchmove.stop="touchMove" 
					@touchend.stop="touchEnd">
					<!-- 顶部拖动条 -->
					<view class="drag-bar">
						<view class="drag-bar-inner"></view>
					</view>
					<view class="popup-header">
						<text class="title">猫友评论（已通过审核）</text>
						<uni-icons type="closeempty" size="24" @click="closeComments"></uni-icons>
					</view>
					<scroll-view scroll-y="true" class="comments-container" :show-scrollbar="false">
						<view class="comment-item" v-for="(comment, index) in comments" :key="index">
							<img class="commenter-avatar" :src="`${pic_general_request_url}/user_avatar/${comment.avatar}${Suffix_1002}`" mode="aspectFill"></img>
							<view class="comment-content">
								<view class="comment-header">
									<text class="commenter-name">{{comment.nickName}}</text>
									<text class="comment-time">{{comment.createTime}}</text>
								</view>
								<text class="comment-text">{{comment.commentContext}}</text>
								<view class="comment-actions">
									<view class="action-item" @click="likeComment(index)">
										<uni-icons :type="comment.isLiked ? 'heart-filled' : 'heart'" size="14" :color="comment.isLiked ? '#ff4d4f' : '#999'"></uni-icons>
										<text>{{comment.likeCount}}</text>
									</view>
									<view class="action-item" @click="replyComment(index)">
										<uni-icons type="chat" size="14" color="#999"></uni-icons>
										<text>回复</text>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="comment-input">
						<input type="text" 
							v-model="newComment" 
							:placeholder="replyTo ? `回复 ${replyTo}` : '说点什么...'"
							@confirm="submitComment"/>
						<button class="submit-btn" @click="submitComment">发送</button>
					</view>
				</view>
			</uni-popup>
			
			<!-- 时间轴弹窗 -->
			<uni-popup ref="timelinePopup" type="center">
				<view class="timeline-popup">
					<view class="timeline-header">
						<text class="title">时间轴记录</text>
						<view class="header-actions">
							<button class="add-btn" @click="showAddEventForm" v-if="isAdmin">添加记录</button>
							<uni-icons type="closeempty" size="24" @click="closeTimeline"></uni-icons>
						</view>
					</view>
					<scroll-view scroll-y="true" class="timeline-content">
						<view class="timeline-list">
							<view class="timeline-item" v-for="(event, index) in timelineEvents" :key="index">
								<view class="timeline-dot"></view>
								<view class="timeline-card">
									<view class="event-header">
										<text class="event-time">{{event.date}}</text>
										<view class="event-actions" v-if="isAdmin">
											<uni-icons type="compose" size="20" color="#666" @click="editEvent(index)"></uni-icons>
											<uni-icons type="trash" size="20" color="#666" @click="deleteEvent(index)"></uni-icons>
										</view>
									</view>
									<text class="event-title">{{event.title}}</text>
									<text class="event-desc">{{event.description}}</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</uni-popup>
			
			<!-- 添加/编辑事件弹窗 -->
			<uni-popup ref="eventFormPopup" type="center">
				<view class="event-form">
					<view class="form-header">
						<text class="title">{{isEditingEvent ? '编辑记录（管理员）' : '添加记录（管理员）'}}</text>
						<uni-icons type="closeempty" size="24" @click="closeEventForm"></uni-icons>
					</view>
					<view class="form-content">
						<uni-forms :model="eventForm">
							<uni-forms-item label="日期" required>
								<uni-datetime-picker v-model="eventForm.date" type="date" />
							</uni-forms-item>
							<uni-forms-item label="标题" required>
								<uni-easyinput v-model="eventForm.title" placeholder="请输入事件标题" />
							</uni-forms-item>
							<uni-forms-item label="描述" required>
								<uni-easyinput v-model="eventForm.description" type="textarea" placeholder="请输入事件描述" />
							</uni-forms-item>
						</uni-forms>
					</view>
					<view class="form-footer">
						<button class="cancel-btn" @click="closeEventForm">取消</button>
						<button class="submit-btn" @click="submitEvent">确定</button>
					</view>
				</view>
			</uni-popup>
		</scroll-view>

		<!-- 分享弹窗 -->
		<uni-popup ref="sharePopup" type="bottom" background-color="#fff">
			<view class="share-popup">
				<view class="share-header">
					<text class="title">分享到</text>
					<view class="close-btn" @click="closeSharePopup">
						<uni-icons type="closeempty" size="24" color="#666"></uni-icons>
					</view>
				</view>
				<view class="share-options">
					<view class="share-item" @click="qrCode">
						<image src="https://cdn.luckyiur.com/catcat/static_image/二维码分享.png" mode="aspectFit" class="share-icon"></image>
						<text>二维码分享</text>
					</view>
					<view class="share-item" @click="copyLink">
						<image src="https://cdn.luckyiur.com/catcat/static_image/link.png" mode="aspectFit" class="share-icon"></image>
						<text>复制链接</text>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 二维码预览弹窗 -->
		<uni-popup ref="qrCodePopup" type="center" background-color="#fff">
			<view class="qrcode-popup">
				<view class="qrcode-header">
					<text class="title">分享二维码</text>
					<view class="close-btn" @click="closeQrCodePopup">
						<uni-icons type="closeempty" size="24" color="#666"></uni-icons>
					</view>
				</view>
				<view class="qrcode-content">
					<image v-if="qrCodeUrl" :src="qrCodeUrl" mode="aspectFit" class="qrcode-image"></image>
					<text class="qrcode-tip">扫描二维码查看详情</text>
				</view>
				<view class="qrcode-footer">
					<button class="download-btn" @click="downloadQrCode">保存二维码，微信请长按或截图</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { API_general_request_url, pic_general_request_url, Suffix_1000, Suffix_1001, Suffix_1002 } from '@/src/config/index.js'
    import { STATUS_CODE } from '@/src/constant/constant.js'
	const appStore = useAppStore()
	import QRCode from 'qrcode'
	
	// 添加数据加载状态
	const isDataLoaded = ref(false);
	const loadingText = {
		contentdown: '加载中...',
		contentrefresh: '加载中...',
		contentnomore: '没有更多'
	};
	
	const showMenu = ref(false);
	const cat = ref(null);
	const picUrlDatas = ref([]);
	const showDonateMenu = ref(false);
	
	// 添加新的响应式数据
	const popupSelect = ref(null);
	const popupAdopt = ref(null);
	const popupDonate = ref(null);
	const catSelectList = ref([]);
	const adoptFormsData = ref({
		catName: '',
		name: '',
		class: '',
		origin: '',
		phone: '',
		wechat: ''
	});
	
	const isLiked = ref(false);
	const likeCount = ref(0);
	const commentCount = ref(0);
	const comments = ref([]);
	const newComment = ref('');
	const replyTo = ref('');
	const commentPopup = ref(null);
	const touchStartY = ref(0);
	const touchMoveY = ref(0);
	const popupTranslateY = ref(0);
	const touchStartTime = ref(0);
	const isPopupOpen = ref(false);
	const lastMoveTime = ref(0);
	const moveSpeed = ref(0);
	
	// 时间轴相关
	const timelinePopup = ref(null);
	const eventFormPopup = ref(null);
	const isEditingEvent = ref(false);
	const currentEditIndex = ref(-1);
	const isAdmin = ref(true); // 这里应该根据实际用户权限来设置
	
	// 模拟的时间轴数据
	const timelineEvents = ref([
		{
            id: 1,
			date: '2024-01-15',
			title: '首次发现',
			description: '在图书馆门口第一次发现这只小猫'
		},
		{
            id: 2,
			date: '2024-01-20',
			title: '绝育手术',
			description: '完成绝育手术，恢复状况良好'
		},
		{
            id: 3,
			date: '2024-02-01',
			title: '疫苗接种',
			description: '完成第一针疫苗接种'
		}
	]);
	
	// 事件表单数据
	const eventForm = ref({
        catId: '',
		date: '',
		title: '',
		description: ''
	});
	
	const sharePopup = ref(null);  // 添加分享弹窗引用
	const qrCodePopup = ref(null); // 添加二维码弹窗引用
	const qrCodeUrl = ref('');     // 添加二维码URL引用
	
	onShow(async () => {
		try {
			let catId;
			// #ifdef H5
			const options = getCurrentPages().pop().options;
			catId = options.catId;
			// #endif
			
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			catId = page.$page.fullPath.split('?')[1].split('=')[1];
			// #endif
			
			console.log(catId)
			// 调用全局方法：获取全部猫猫详情
			await getCatInfoDetail();
			
			const catList = appStore.catList
			console.log(catList)
			// 根据 catId 查找对应的小猫信息
			const selectedCat = catList.find(cat => cat.catId === parseInt(catId));
			
			if (!selectedCat) {
				throw new Error('未找到对应的猫咪信息');
			}
			
			// 将选中的猫信息存储到响应式数据中
			cat.value = selectedCat;
			
			// 初始化点赞状态和数量
			isLiked.value = selectedCat.isLikedToday || false;
			likeCount.value = selectedCat.likeCount || 0;
			
			// 处理猫咪选择列表数据
			catSelectList.value = catList.map(cat => ({
				value: cat.catname,
				text: `${cat.catname} - ${cat.gender === 1 ? '公' : '母'} - ${cat.age}个月`
			}));
			
			// 设置当前猫猫为默认选中
			adoptFormsData.value.catName = selectedCat.catname;
			
			// 获取猫猫照片
			await new Promise((resolve, reject) => {
				uni.request({
					url: `${API_general_request_url.value}/api/cat/photo/${catId}`,
					method: 'GET',
					success: (response) => {
						if (response.statusCode === 200 && response.data.code === STATUS_CODE.SUCCESS) {
							picUrlDatas.value = response.data.data;
							console.log('获取小猫图片成功')
                            console.log(picUrlDatas.value)
							resolve();
						} else {
							uni.showToast({
								title: response.data.msg || '获取小猫图片失败',
								icon: 'none'
							});
							reject(new Error(response.data.msg || '获取小猫图片失败'));
						}
					},
					fail: (error) => {
						uni.showToast({
							title: '请求获取小猫图片失败，请重试',
							icon: 'none'
						});
						reject(error);
					}
				});
			});
			
			// 获取点赞和评论数据
			await getComments();
			
			// 所有数据加载完成后，设置加载状态为true
			isDataLoaded.value = true;
			
		} catch (error) {
			console.error('数据加载失败:', error);
			uni.showToast({
				title: '数据加载失败，请重试',
				icon: 'none'
			});
		}
	});
	
	function handleGoback() {
        
		const pages = getCurrentPages();
		if (pages.length > 1) {
			uni.navigateBack();
		} else {
			uni.reLaunch({
				url:"CatClaw"
			});
		}
	}
	
	function toggleMenu() {
		showMenu.value = !showMenu.value;
	}
	
	function handleEdit() {
        if (!checkLogin()) {
            return
        }
		showMenu.value = false;
		const catId = cat.value.catId;
		uni.navigateTo({
			url: `catEdit?catId=${catId}`
		});
	}
	
	function toggleDonateMenu() {
		showMenu.value = false; // 关闭更多菜单
		if (showDonateMenu.value) {
			popupSelect.value.close();
		} else {
			popupSelect.value.open();
		}
		showDonateMenu.value = !showDonateMenu.value;
	}
	
	function handleClickAdopt() {
		popupSelect.value.close();
		showDonateMenu.value = false;
		setTimeout(() => {
			popupAdopt.value.open();
		}, 100);
	}
	
	function handleClickDonate() {
		popupSelect.value.close();
		showDonateMenu.value = false;
		setTimeout(() => {
			popupDonate.value.open();
		}, 100);
	}
	
	function closeAdoptPopup() {
		popupAdopt.value.close();
		// 清空表单但保留当前猫猫选择
		const currentCat = adoptFormsData.value.catName;
		adoptFormsData.value = {
			catName: currentCat,
			name: '',
			class: '',
			origin: '',
			phone: '',
			wechat: ''
		};
	}
	
	function closeDonatePopup() {
		popupDonate.value.close();
	}
	
	function handleCatSelect(value) {
		adoptFormsData.value.catName = value;
	}
	
	// 表单验证函数
	function validateName(name) {
		if (!name) return '姓名不能为空';
		if (name.length < 2 || name.length > 20) return '姓名长度应在2-20个字符之间';
		return '';
	}
	
	function validateClass(className) {
		if (!className) return '班级不能为空';
		// 可以根据实际需求调整班级格式验证规则
		if (className.length < 2 || className.length > 30) return '班级格式不正确';
		return '';
	}
	
	function validateOrigin(origin) {
		if (!origin) return '籍贯不能为空';
		if (origin.length < 2 || origin.length > 50) return '籍贯长度应在2-50个字符之间';
		return '';
	}
	
	function validatePhone(phone) {
		if (!phone) return '手机号不能为空';
		const phoneRegex = /^1[3-9]\d{9}$/;
		if (!phoneRegex.test(phone)) return '请输入有效的11位手机号';
		return '';
	}
	
	function validateWechat(wechat) {
		if (!wechat) return '微信号不能为空';
		if (wechat.length < 6 || wechat.length > 20) return '微信号长度应在6-20个字符之间';
		return '';
	}
	
	function submitAdoptForm() {
		// 表单验证
		const nameError = validateName(adoptFormsData.value.name);
		const classError = validateClass(adoptFormsData.value.class);
		const originError = validateOrigin(adoptFormsData.value.origin);
		const phoneError = validatePhone(adoptFormsData.value.phone);
		const wechatError = validateWechat(adoptFormsData.value.wechat);
		
		// 收集所有错误信息
		const errors = [];
		if (nameError) errors.push(nameError);
		if (classError) errors.push(classError);
		if (originError) errors.push(originError);
		if (phoneError) errors.push(phoneError);
		if (wechatError) errors.push(wechatError);
		
		// 如果有错误，显示第一个错误信息并返回
		if (errors.length > 0) {
			uni.showToast({
				title: errors[0],
				icon: 'none',
				duration: 2000
			});
			return;
		}
		
		// 发送领养申请
		uni.request({
			url: `${API_general_request_url.value}/api/cat/adopt/apply`,
			method: 'POST',
			data: adoptFormsData.value,
			header: {
				'Authorization': `Bearer ${uni.getStorageSync('token')}`
			},
			success: (res) => {
				if (res.data.code === STATUS_CODE.SUCCESS) {
					uni.showToast({
						title: '申请提交成功',
						icon: 'success',
						duration: 2000 // 显示2秒后自动关闭
					});
                    setTimeout(() => {
                        closeAdoptPopup();
					}, 2000);
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '提交失败，请稍后重试',
					icon: 'none'
				});
			}
		});
	}
	
	function handleDelete() {
		showMenu.value = false;
		uni.showModal({
			title: '确认删除（仅管理员）',
			content: '确定要删除这只小猫的信息吗？此操作不可恢复。',
			success: function (res) {
				if (res.confirm) {
					// 发送删除请求
					uni.request({
						url: `${API_general_request_url.value}/api/cat/${cat.value.catId}`,
						method: 'DELETE',
						header: {
							'Authorization': `Bearer ${uni.getStorageSync('token')}`
						},
						success: (response) => {
							if (response.statusCode === 200 && response.data.code === STATUS_CODE.SUCCESS) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								// 删除成功后返回上一页
								setTimeout(() => {
									handleGoback();
								}, 1500);
							} else {
								uni.showToast({
									title: response.data.msg || '删除失败',
									icon: 'none'
								});
							}
						},
						fail: (error) => {
							uni.showToast({
								title: '删除请求失败，请重试',
								icon: 'none'
							});
						}
					});
				}
			}
		});
	}
	
	// 添加图片预览函数
	function previewImage(urls, current = 0) {
		uni.previewImage({
			urls: urls,
			current: current,
			loop: true,
			indicator: 'number'
		});
	}
	
	// 获取评论列表
	function getComments() {
		// console.log(cat.value.catId)
		uni.request({
			url: `${API_general_request_url.value}/api/cat/comment/get/${cat.value.catId}`,
			method: 'GET',
			header: {
				'Authorization': `Bearer ${uni.getStorageSync('token')}`
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
					comments.value = res.data.data;
					commentCount.value = res.data.data.length || 0;
                    console.log('获取小猫评论列表成功')
                    console.log(res.data.data)
				} else {
					uni.showToast({
						title: res.data.msg || '获取小猫评论列表失败',
						icon: 'none'
					});
				}
			}
		})
	}
	
	// 处理点赞
	function handleLike() {
		// 检查登录
		if (!checkLogin()) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			return;
		}
		
		// 如果今天已经点赞过了
		if (isLiked.value) {
			uni.showToast({
				title: '今天已经点赞过了',
				icon: 'none'
			});
			return;
		}

		uni.request({
			url: `${API_general_request_url.value}/api/cat/like/${cat.value.catId}`,
			method: 'POST',
			header: {  
				'Authorization': `Bearer ${uni.getStorageSync('token')}`  
			},
			success: (res) => {	
				if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    console.log(res.data)
					// 更新本地状态
					isLiked.value = true;
					likeCount.value += 1;
					
					// 更新store中的数据
					const catList = appStore.catList;
					const catIndex = catList.findIndex(c => c.catId === cat.value.catId);
					if (catIndex !== -1) {
						catList[catIndex].isLikedToday = true;
						catList[catIndex].likeCount = likeCount.value;
						appStore.setCatList([...catList]);
					}
					
					uni.showToast({
						title: '点赞成功',
						icon: 'success'
					});
				}
			}
		});
	}
	
	// 显示评论弹窗
	function showComments() {
		commentPopup.value.open();
		isPopupOpen.value = true;
	}
	
	// 关闭评论弹窗
	function closeComments() {
		commentPopup.value.close();
		isPopupOpen.value = false;
		replyTo.value = '';
		newComment.value = '';
	}
	
	// 点赞评论
	function likeComment(index) {
		const comment = comments.value[index];
		comment.isLiked = !comment.isLiked;
		comment.likes += comment.isLiked ? 1 : -1;
		// TODO: 发送评论点赞请求到后端
	}
	
	// 回复评论
	function replyComment(index) {
		// 获取当前评论的username
		replyTo.value = comments.value[index].username;
	}
	
	// 提交评论
	async function submitComment() {
		// 检查登录
		if (!checkLogin()) {
			return;
		}
		// 检查评论是否为空
		if (!newComment.value.trim()) return;
		// 获取当前用户信息
        console.log(appStore.userInfo)
        if (appStore.userInfo == null) {
            // 尝试获取用户信息
            await getUserInfo()
        }
		const comment = {
			nickName: appStore.userInfo.nickName, // 应该使用实际的用户信息
			avatar: appStore.userInfo.avatar,
			commentContext: newComment.value,
			time: new Date().toLocaleDateString(),
			likeCount: 0,
			liked: false // 默认未点赞
		};
		console.log(newComment.value);
		uni.request({
			url: `${API_general_request_url.value}/api/cat/comment/add`,
			method: 'POST',
			data: {
				catId: cat.value.catId,
				commentContext: newComment.value,
				isTop: 0 // 0表示不置顶，1表示置顶
			},
			header: {
				'Authorization': `Bearer ${uni.getStorageSync('token')}`
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    // 添加评论到列表
					comments.value.unshift(comment); // 添加到列表
					commentCount.value++; // 增加评论计数
					newComment.value = ''; // 清空评论输入框
					replyTo.value = ''; // 清空回复对象
					uni.showToast({
						title: '评论成功',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: res.data.msg || '评论失败',
						icon: 'none'
					});
				}
			}
		})
		
	}
	
	// 触摸开始
	const touchStart = (e) => {
		touchStartY.value = e.touches[0].clientY;
		touchStartTime.value = Date.now();
		moveSpeed.value = 0;
	};
	
	// 触摸移动
	const touchMove = (e) => {
		const currentY = e.touches[0].clientY;
		const moveDistance = currentY - touchStartY.value;
		const currentTime = Date.now();
		
		// 计算移动速度 (像素/毫秒)
		if (lastMoveTime.value) {
			const timeDiff = currentTime - lastMoveTime.value;
			const distanceDiff = currentY - touchMoveY.value;
			moveSpeed.value = Math.abs(distanceDiff / timeDiff);
		}
		
		lastMoveTime.value = currentTime;
		touchMoveY.value = currentY;

		// 如果评论区已打开，处理下滑关闭
		if (isPopupOpen.value && moveDistance > 0) {
			popupTranslateY.value = moveDistance;
			e.preventDefault(); // 阻止滚动
		}
		// 如果评论区未打开，处理上滑打开
		else if (!isPopupOpen.value && moveDistance < -50) {
			showComments();
		}
	};
	
	// 触摸结束
	const touchEnd = (e) => {
		const endY = e.changedTouches[0].clientY;
		const moveDistance = endY - touchStartY.value;
		const moveTime = Date.now() - touchStartTime.value;
		
		// 判断是否为快速滑动（速度阈值可以调整）
		const isQuickSlide = moveSpeed.value > 0.3; // 每毫秒0.3像素以上视为快速滑动
		
		if (isPopupOpen.value) {
			// 评论区已打开时，处理下滑关闭，滑动距离大于300px或快速滑动时关闭弹窗
			if (moveDistance > 300 || (moveDistance > 0 && isQuickSlide)) {
				closeComments();
			} else {
				// 回弹
				popupTranslateY.value = 0;
			}
		} else {
			// 评论区未打开时，处理上滑打开
			if (moveDistance < -100 || (moveDistance < 0 && isQuickSlide)) {
				showComments();
			}
		}
		
		// 重置状态
		moveSpeed.value = 0;
		lastMoveTime.value = 0;
		touchMoveY.value = 0;
		popupTranslateY.value = 0;
	};
	
	function handleSearch() {
		// uni.navigateTo({
		// 	url: `/src/pages/Search?keyword=${cat.value.catname}`
		// });
        // 调用全局方法：搜索
        console.log('搜索关键词：', cat.value.catname)
        globalSearch(cat.value.catname) // 搜索完成后，会跳转到搜索结果页
	}
	
	// 显示时间轴
	async function showTimeline() {
        // 调用全局方法：获取小猫时间轴数据
        const timelineData = await getCatTimeline(cat.value.catId)
        timelineEvents.value = timelineData
		timelinePopup.value.open();
	}
	
	// 关闭时间轴
	function closeTimeline() {
		timelinePopup.value.close();
	}
	
	// 显示添加事件表单
	function showAddEventForm() {
		isEditingEvent.value = false;
		eventForm.value = {
			date: new Date().toISOString().split('T')[0],
			title: '',
			description: ''
		};
		eventFormPopup.value.open();
	}
	
	// 显示编辑事件表单
	function editEvent(index) {
		isEditingEvent.value = true;
		currentEditIndex.value = index;
		const event = timelineEvents.value[index];
		eventForm.value = { ...event };
		eventFormPopup.value.open();
	}
	
	// 删除事件
	function deleteEvent(index) {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这条记录吗？',
			success: function (res) {
				if (res.confirm) {
                    uni.request({
                        url: `${API_general_request_url.value}/api/cat/timeline/delete/${timelineEvents.value[index].id}`,
                        method: 'DELETE',
                        header: {
                            'Authorization': `Bearer ${uni.getStorageSync('token')}`
                        },
                        success: async (res) => {
                            if(res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS){
                                console.log('删除事件成功')
                                console.log(res.data)
                                timelineEvents.value.splice(index, 1);
                                uni.showToast({
                                    title: '删除成功',
                                    icon: 'success'
                                });
                                // 调用全局方法：刷新时间轴
                                const timelineData = await getCatTimeline(cat.value.catId)
                                timelineEvents.value = timelineData
                            }
                            else{
                                console.log('删除事件失败')
                                console.log(res.data)
                                uni.showToast({
                                    title: res.data.msg || '删除失败',
                                    icon: 'none'
                                });
                            }
                        },
                        fail: (err) => {
                            console.log('删除事件失败')
                            console.log(err)
                        }
                    })
				}
			}
		});
	}
	
	// 关闭事件表单
	function closeEventForm() {
		eventFormPopup.value.close();
		eventForm.value = {
			date: '',
			title: '',
			description: ''
		};
		currentEditIndex.value = -1;
	}
	
	// 提交事件
	function submitEvent() {
        if (!checkLogin()) {
            return;
        }
		if (!eventForm.value.date || !eventForm.value.title || !eventForm.value.description) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			});
			return;
		}
		if (isEditingEvent.value) {
            console.log('更新现有事件')
            console.log(eventForm.value)
            eventForm.value.id = timelineEvents.value[currentEditIndex.value].id // 添加当前事件的ID到表单数据中
            uni.request({
                url: `${API_general_request_url.value}/api/cat/timeline/update`,
                method: 'PUT',
                data: eventForm.value,
                header: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`
                },
                success: async (res) => {
                    if(res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS){
                        console.log('更新现有事件成功')
                        console.log(res.data)
                        closeEventForm();
                        // 更新现有事件
			            // timelineEvents.value[currentEditIndex.value] = { ...eventForm.value };
                        uni.showToast({
                            title: '编辑成功',
                            icon: 'success'
                        });
                        // 调用全局方法：刷新时间轴
                        const timelineData = await getCatTimeline(cat.value.catId)
                        timelineEvents.value = timelineData
                    }
                    else{
                        console.log('更新现有事件失败')
                        console.log(res.data)
                        uni.showToast({
                            title: res.data.msg || '编辑失败',
                            icon: 'none'
                        });
                    }
                },
                fail: (err) => {
                    console.log('更新现有事件失败')
                    console.log(err)
                }
            })
		} else {
            console.log('添加新事件')
            console.log(eventForm.value)
            eventForm.value.catId = cat.value.catId // 添加当前猫咪的ID到表单数据中
            uni.request({
                url: `${API_general_request_url.value}/api/cat/timeline/add`,
                method: 'POST',
                data: eventForm.value,
                header: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`
                },
                success: async (res) => {
                    if(res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS){
                        console.log('添加新事件成功')
                        console.log(res.data)
                        closeEventForm();
                        // 添加新事件
			            // timelineEvents.value.push({ ...eventForm.value });
                        uni.showToast({
                            title: '添加成功',
                            icon: 'success'
                        });
                        // 调用全局方法：刷新时间轴
                        const timelineData = await getCatTimeline(cat.value.catId)
                        timelineEvents.value = timelineData
                    }
                    else{
                        console.log('添加新事件失败')
                        console.log(res.data)
                        uni.showToast({
                            title: res.data.msg || '添加失败',
                            icon: 'none'
                        });
                    }
                },
                fail: (err) => {
                    console.log('添加新事件失败')
                    console.log(err)
                }

            })
		}
		
		// 按日期排序
		timelineEvents.value.sort((a, b) => new Date(b.date) - new Date(a.date));
		
		
	}

	// 图片操作相关函数：上传
	async function handleUpload() {
		// 检查登录状态
		if (!checkLogin()) {
			return;
		}
		
		// 计算当前还可以上传的图片数量
		const remainingSlots = 8 - picUrlDatas.value.length;
		if (remainingSlots <= 0) {
			uni.showToast({
				title: '最多只能上传8张图片',
				icon: 'none'
			});
			return;
		}

		uni.chooseImage({
			count: remainingSlots, // 最多可选择的图片数量为剩余槽位数
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				const tempFilePaths = res.tempFilePaths;
				const tempFiles = res.tempFiles;
				console.log('上传图片')
				console.log(tempFilePaths)
				console.log(tempFiles)
				
				// 遍历选择的图片进行上传
				for (let i = 0; i < tempFiles.length; i++) {
					const tempFilePath = tempFilePaths[i];
					const tempFile = tempFiles[i];
					
					try {
						// 1. 先获取文件名映射
						const uploadResponse = await uni.request({
							url: `${API_general_request_url.value}/api/cat/photo/upload/${cat.value.catId}`,
							method: 'POST',
							header: {
								'Authorization': `Bearer ${uni.getStorageSync('token')}`,
								'Content-Type': 'application/json'
							},
							data: {
								pictrueName: tempFile.name
							}
						});
						
						if (uploadResponse.statusCode !== 200 || uploadResponse.data.code !== STATUS_CODE.SUCCESS) {
							uni.showToast({
								title: uploadResponse.data.msg || '获取文件名映射失败',
								icon: 'none'
							});
							continue; // 跳过当前图片，继续处理下一张
						}
						
						const convertedFileName = uploadResponse.data.data.fileNameConvertMap;
						console.log('文件名映射：')
						console.log(convertedFileName)
						const fileName = convertedFileName[tempFile.name]
						console.log('转换后的文件名：')
						console.log(fileName)
						
						// 2. 获取七牛云上传凭证
						const tokenResponse = await uni.request({
							url: `${API_general_request_url.value}/api/upload/qiniuUploadToken`,
							method: 'GET',
							header: {
								'Authorization': `Bearer ${uni.getStorageSync('token')}`
							}
						});
						
						if (tokenResponse.statusCode !== 200 || tokenResponse.data.code !== STATUS_CODE.SUCCESS) {
							uni.showToast({
								title: tokenResponse.data.msg || '获取上传凭证失败',
								icon: 'none'
							});
							continue;
						} else {
							console.log('获取上传凭证成功')
						}
						
						const qiniuToken = tokenResponse.data.data.qiniuToken;
						
						// 3. 上传文件到七牛云
						await uni.uploadFile({
							url: 'https://upload-z2.qiniup.com',
							filePath: tempFilePath,
							name: 'file',
							formData: {
								token: qiniuToken,
								key: `catcat/cat_pics/${fileName}`
							},
							success: (res) => {
								if (res.statusCode === 200) {
									if (i === tempFiles.length - 1) {
										// 所有图片上传完成后显示提示
										uni.showToast({
											title: '上传成功',
											icon: 'success'
										});
										// 刷新图片列表
										refreshPicList();
									}
								} else {
									uni.showToast({
										title: '图片上传失败',
										icon: 'none'
									});
								}
							},
							fail: (err) => {
								uni.showToast({
									title: '图片上传失败',
									icon: 'none'
								});
							}
						});
						
					} catch (error) {
						console.error('上传过程中发生错误:', error);
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						});
					}
				}
			}
		});
	}

	// 图片操作相关函数：修改
	async function handleEditImage(index) {
		// 检查登录状态
		if (!checkLogin()) {
			return;
		}
		
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				const tempFilePath = res.tempFilePaths[0];
				const tempFile = res.tempFiles[0];
				console.log('修改图片')
				console.log(tempFilePath)
				console.log(tempFile)
				try {
					// 1. 先删除原图片，获取新的文件名映射，路径参数为原图片ID，data为新文件名
					const updateResponse = await uni.request({
						url: `${API_general_request_url.value}/api/cat/photo/update/${picUrlDatas.value[index].id}`,
						method: 'PUT',
						header: {
							'Authorization': `Bearer ${uni.getStorageSync('token')}`,
							'Content-Type': 'application/json'
						},
						data: {
							pictrueName: tempFile.name
						}
					});
					console.log('更新图片')
                    console.log(updateResponse)

					if (updateResponse.statusCode !== 200 || updateResponse.data.code !== STATUS_CODE.SUCCESS) {
                        uni.showToast({
                            title: updateResponse.data.msg || '更新图片失败',
                            icon: 'none'
                        });
					}
					
					const convertedFileName = updateResponse.data.data.fileNameConvertMap;
					console.log('文件名映射：')
                    console.log(convertedFileName)
                    const fileName = convertedFileName[tempFile.name]
                    console.log('转换后的文件名：')
                    console.log(fileName)
					
					// 2. 获取七牛云上传凭证
					const tokenResponse = await uni.request({
						url: `${API_general_request_url.value}/api/upload/qiniuUploadToken`,
						method: 'GET',
						header: {
							'Authorization': `Bearer ${uni.getStorageSync('token')}`
						}
					});
					
					if (tokenResponse.statusCode !== 200 || tokenResponse.data.code !== STATUS_CODE.SUCCESS) {
						uni.showToast({
							title: tokenResponse.data.msg || '获取上传凭证失败',
							icon: 'none'
						});
					}
					
					const qiniuToken = tokenResponse.data.data.qiniuToken;
					
					// 3. 上传新文件到七牛云
					await uni.uploadFile({
						url: 'https://upload-z2.qiniup.com',
						filePath: tempFilePath,
						name: 'file',
						formData: {
							token: qiniuToken,
							key: `catcat/cat_pics/${fileName}`
						},
						success: (res) => {
							if (res.statusCode === 200) {
								uni.showToast({
									title: '修改成功',
									icon: 'success'
								});
								// 刷新图片列表
								refreshPicList();
							} else {
								uni.showToast({
									title: '图片上传失败',
									icon: 'none'
								});
							}
						},
						fail: (err) => {
							uni.showToast({
								title: '图片上传失败',
								icon: 'none'
							});
						}
					});
					
				} catch (error) {
					console.error('修改过程中发生错误:', error);
					// 如果出错，刷新列表以确保显示正确的状态
					refreshPicList();
				}
			}
		});
	}

	// 图片操作相关函数：删除
	function handleDeleteImage(index) {
		// 检查登录状态
		if (!checkLogin()) {
			return;
		}
		
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这张图片吗？',
			success: (res) => {
				if (res.confirm) {
					uni.request({
						url: `${API_general_request_url.value}/api/cat/photo/delete/${picUrlDatas.value[index].id}`,
						method: 'DELETE',
						header: {
							'Authorization': `Bearer ${uni.getStorageSync('token')}`
						},
						success: (res) => {
							if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								// 刷新图片列表
								refreshPicList();
							} else {
								uni.showToast({
									title: res.data.msg || '删除失败',
									icon: 'none'
								});
							}
						},
						fail: (err) => {
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							});
						}
					});
				}
			}
		});
	}

	// 刷新图片列表
	function refreshPicList() {
		uni.request({
			url: `${API_general_request_url.value}/api/cat/photo/${cat.value.catId}`,
			method: 'GET',
			success: (response) => {
				if (response.statusCode === 200 && response.data.code === STATUS_CODE.SUCCESS) {
					picUrlDatas.value = response.data.data;
					console.log('刷新小猫图片列表成功')
				} else {
					uni.showToast({
						title: response.data.msg || '获取小猫图片失败',
						icon: 'none'
					});
				}
			},
			fail: (error) => {
				uni.showToast({
					title: '请求获取小猫图片失败，请重试',
					icon: 'none'
				});
			}
		});
	}

    // 分享功能
    const handleShare = () => {
        sharePopup.value.open();
    };

    // 关闭分享弹窗
    const closeSharePopup = () => {
        sharePopup.value.close();
    };

    // 二维码分享
    const qrCode = async () => {
        try {
            // 获取当前猫咪页面URL
            const url = `${window.location.origin}/pages/Card?catId=${cat.value.catId}`;
            
            uni.showLoading({
                title: '生成二维码中...'
            });
            
            // 使用QRCode生成二维码数据URL
            const dataUrl = await QRCode.toDataURL(url, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            
            // 保存二维码URL并显示弹窗
            qrCodeUrl.value = dataUrl;
            uni.hideLoading();
            closeSharePopup();
            qrCodePopup.value.open();
        } catch (error) {
            console.error('生成二维码失败:', error);
            uni.hideLoading();
            uni.showToast({
                title: '生成二维码失败',
                icon: 'none'
            });
        }
    };

    // 复制链接
    const copyLink = () => {
        const shareOriginUrl = `catId=${cat.value.catId}`;
        uni.request({
            url: `${API_general_request_url.value}/api/shotLinkShare/getShotLinkShare?url=${shareOriginUrl}`,
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
                    uni.setClipboardData({
                        data: res.data.data.urlString,
                        success: function () {
                            uni.showToast({
                                title: '链接已复制，请分享给你的好友吧！',
                                icon: 'none'
                            });
                            closeSharePopup();
                        }
                    });
                    console.log("复制链接成功");
                    console.log(res.data);
                } else {
                    uni.showToast({
                        title: res.data.msg || '复制链接失败',
                        icon: 'none'
                    });
                }
            },
            fail: (err) => {
                console.log(err);
                uni.showToast({
                    title: '复制链接失败',
                    icon: 'none'
                });
            }
        })
    };

    // 关闭二维码弹窗
    const closeQrCodePopup = () => {
        qrCodePopup.value.close();
    };

    // 下载二维码
    const downloadQrCode = () => {
        if (!qrCodeUrl.value) {
            uni.showToast({
                title: '二维码未生成',
                icon: 'none'
            });
            return;
        }

        // #ifdef H5
        const a = document.createElement('a');
        a.href = qrCodeUrl.value;
        a.download = `qrcode_${cat.value.catId}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        uni.showToast({
            title: '二维码已下载，如果在微信中，会下载失败',
            icon: 'none'
        });
        // #endif

        // #ifdef APP-PLUS || MP-WEIXIN
        // 将base64转换为本地临时文件
        const base64Data = qrCodeUrl.value.split(',')[1];
        const arrayBuffer = uni.base64ToArrayBuffer(base64Data);
        const tempFilePath = `_doc/qrcode_${Date.now()}.png`;
        
        // 写入文件
        plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
            fs.root.getFile(tempFilePath, { create: true }, (fileEntry) => {
                fileEntry.createWriter((writer) => {
                    writer.onwrite = () => {
                        // 保存到相册
                        uni.saveImageToPhotosAlbum({
                            filePath: fileEntry.fullPath,
                            success: () => {
                                uni.showToast({
                                    title: '二维码已保存到相册',
                                    icon: 'none'
                                });
                            },
                            fail: () => {
                                uni.showToast({
                                    title: '保存二维码失败',
                                    icon: 'none'
                                });
                            }
                        });
                    };
                    writer.onerror = () => {
                        uni.showToast({
                            title: '保存二维码失败',
                            icon: 'none'
                        });
                    };
                    writer.write(new Blob([arrayBuffer]));
                });
            });
        });
        // #endif
    };
</script>

<style lang="scss" scoped>
	.container{
		width: 750rpx;
		height: 100vh;
		position: relative;
		
		.layout{
			width: 100%;
			min-height: 100%;
			background-color: #f1f4f7;
			background: linear-gradient(to right, #fdeda9, #fffce2);
			
			.header {
				position: sticky;
				top: 0;
				z-index: 100;
				background-color: #fff;
				box-shadow: 0 2px 8px rgba(0,0,0,0.06);
				
				&-row {
					height: 100rpx;
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
							box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 3px 1px; /* 软影 */
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
						// padding-top: 60rpx;
						.tzv88{ //文字view
							width: 100%;
							height: 50rpx;
							display: flex;
							align-items: center;
							padding-left: 80rpx;
							font-size: 30rpx;
							font-weight: 700;
                            .cat-name{
                                font-size: 32rpx;
                                font-weight: 700;
                                color: #333;
                                position: relative;
                                padding-left: 20rpx;
                                
                                &::before {
                                    content: '';
                                    position: absolute;
                                    left: 0;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    width: 6rpx;
                                    height: 24rpx;
                                    background: linear-gradient(to bottom, #C13584, #E1306C);
                                    border-radius: 3rpx;
                                }
                            }
                            .cat-age{
                                font-size: 32rpx;
                                font-weight: 700;
                                color: #f56040;
                                position: relative;
                                padding-left: 20rpx;
                                
                                &::before {
                                    content: '';
                                    position: absolute;
                                    left: 0;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    width: 6rpx;
                                    height: 24rpx;
                                    background: linear-gradient(to bottom, #f56040, #ff9c6e);
                                    border-radius: 3rpx;
                                }
                            }
                            .cat-gender{
                                font-size: 32rpx;
                                font-weight: 700;
                                color: #8d5da3;
                                position: relative;
                                padding-left: 20rpx;
                                
                                &::before {
                                    content: '';
                                    position: absolute;
                                    left: 0;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    width: 6rpx;
                                    height: 24rpx;
                                    background: linear-gradient(to bottom, #8d5da3, #a679c7);
                                    border-radius: 3rpx;
                                }
                            }
                            .cat-adopt-status {
                                font-size: 32rpx;
                                font-weight: 700;
                                color: #ff9c6e;
                                position: relative;
                                padding-left: 20rpx;
                                
                                &::before {
                                    content: '';
                                    position: absolute;
                                    left: 0;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    width: 6rpx;
                                    height: 24rpx;
                                    background: linear-gradient(to bottom, #ff9c6e, #ffd591);
                                    border-radius: 3rpx;
                                }
                                
                                &.adopted {
                                    color: #52c41a;
                                    
                                    &::before {
                                        background: linear-gradient(to bottom, #52c41a, #95de64);
                                    }
                                }
                            }
						}
						.timeline-btn {
							width: calc(100% - 100rpx);
							height: 70rpx;
							margin: 20rpx auto 10rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 10rpx;
							background: linear-gradient(135deg, #8d5da3, #a679c7);
							border-radius: 35rpx;
							box-shadow: 0 4rpx 12rpx rgba(141, 93, 163, 0.2);
							transition: all 0.3s ease;
							
							text {
								color: #FFFFFF;
								font-size: 26rpx;
								font-weight: normal;
							}
							
							&:active {
								transform: scale(0.98);
								box-shadow: 0 2rpx 8rpx rgba(141, 93, 163, 0.15);
							}
						}
						.search-btn {
							width: calc(100% - 100rpx);
							height: 70rpx;
							margin: 20rpx auto 0;
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 10rpx;
							background: linear-gradient(135deg, #C13584, #E1306C);
							border-radius: 35rpx;
							box-shadow: 0 4rpx 12rpx rgba(193, 53, 132, 0.2);
							transition: all 0.3s ease;
							
							text {
								color: #FFFFFF;
								font-size: 26rpx;
								font-weight: normal;
							}
							
							&:active {
								transform: scale(0.98);
								box-shadow: 0 2rpx 8rpx rgba(193, 53, 132, 0.15);
							}
						}
					}
				}
			}
			.t3{ //<!-- 详细信息 -->
				width: 100%;
				min-height: 400rpx;
				background: linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%);
				border-radius: 40rpx 40rpx 0 0;
				padding: 20rpx 0;
				margin-top: 15rpx;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 80rpx;
					height: 4rpx;
					background: linear-gradient(90deg, #C13584, #E1306C, #F56040);
					border-radius: 2rpx;
				}

				.section-title {
					text-align: center;
					margin-bottom: 15rpx;
					font-size: 40rpx;
					font-weight: 600;
					background: linear-gradient(90deg, #C13584, #E1306C);
					-webkit-background-clip: text;
					color: transparent;
					letter-spacing: 6rpx;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					
					&::before,
					&::after {
						content: "";
						position: absolute;
						height: 2rpx;
						width: 100rpx;
						background: linear-gradient(90deg, transparent, rgba(193, 53, 132, 0.2));
						top: 50%;
					}
					
					&::before {
						right: calc(50% + 100rpx);
					}
					
					&::after {
						left: calc(50% + 100rpx);
						transform: rotate(180deg);
					}
				}

				.th80hj0{
					width: 90%;
					margin: 0 auto;
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 15rpx 30rpx;
					padding: 0 0rpx;
					
					.tzv8mkm{
						width: 100%;
						position: relative;
						
						.lefttzv00,
						.righttzv00 { 
							width: 90%;
							min-height: 80rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
							gap: 2rpx;
							font-size: 28rpx;
							color: #262626;
							background: #FFFFFF;
							border-radius: 16rpx;
							padding: 8rpx 16rpx;
							margin: 0;
							box-shadow: 
								0 4rpx 24rpx rgba(0, 0, 0, 0.06),
								0 1rpx 2rpx rgba(0, 0, 0, 0.04);
							position: relative;
							overflow: hidden;
							transition: all 0.3s ease;
							
							&::before {
								content: '';
								position: absolute;
								top: 0;
								left: 0;
								width: 4rpx;
								height: 100%;
								opacity: 0.9;
							}
							
							.info-label {
								font-size: 24rpx;
								color: #666;
								font-weight: normal;
							}
							
							.info-value {
								font-size: 30rpx;
								color: #262626;
								font-weight: 600;
							}
							
							&:hover {
								transform: translateY(-2rpx);
								box-shadow: 
									0 8rpx 30rpx rgba(0, 0, 0, 0.08),
									0 2rpx 4rpx rgba(0, 0, 0, 0.06);
							}
						}
						
						.lefttzv00 {
							background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
							&::before {
								background: linear-gradient(180deg, #C13584, #E1306C);
							}
						}
						
						.righttzv00 {
							background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
							&::before {
								background: linear-gradient(180deg, #F56040, #E1306C);
							}
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
							// width: 100%;
							height: auto;
							display: flex;
							flex-wrap: wrap; // 允许自动换行
							justify-content: space-between; // 保持间距均匀
                            margin: 0 10rpx;
							.t09row{ //一张张照片
								width: 100%;
								height: auto;
								display: flex;
								flex-wrap: wrap; // 保证换行
								justify-content: flex-start;
								.t9j0a{ //image-box
									// width: 30%; // 设置每张照片盒子的宽度为容器的 32% (保证三张照片加间距不超出100%)
									height: 230rpx;
                                    width: 230rpx;
									// margin-bottom: 10rpx; // 图片之间的垂直间距
                                    margin: 5rpx 5rpx;
									.i23qh{ //image
										width: 230rpx;
										height: 230rpx;
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
		z-index: 20;
	}
	
	.floating-menu {
		position: absolute;
		top: 100%;
		right: 0;
		background-color: #fff;
		border-radius: 8rpx;
		box-shadow: 0 2px 12px rgba(0,0,0,0.15);
		z-index: 20;
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
	
	.donate-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.donate-section {
		display: flex;
		gap: 40rpx;
		padding: 40rpx;
		animation: slideUp 0.3s ease-out;
		background-color: transparent;
	}
	
	.donate-card {
		width: 300rpx;
		height: 360rpx;
		background-color: #fff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
		
		&:active {
			transform: scale(0.98);
		}
		
		.card-icon {
			width: 120rpx;
			height: 120rpx;
		}
		
		.card-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
		}
		
		.card-desc {
			font-size: 24rpx;
			color: #666;
			text-align: center;
			padding: 0 20rpx;
		}
	}
	
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(60rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	// 导航菜单弹窗遮罩层
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.1);
		// backdrop-filter: blur(2px); // 模糊效果
	}
	
	.popup-box {
		background-color: #ffffff;
		border-radius: 20rpx;
		width: 650rpx;
		padding: 30rpx;
		
		.popup-title {
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 30rpx;
			color: #333333;
		}
		
		.form-content {
			margin-bottom: 30rpx;
			
			.uni-forms-item {
				margin-bottom: 20rpx;
				
				.uni-forms-item__label {
					font-size: 28rpx;
					color: #333333;
				}
				
				.uni-easyinput__content {
					height: 80rpx;
					background-color: #f8f9fa;
					border-radius: 12rpx;
				}
			}
		}
		
		.qr-content {
			display: flex;
			justify-content: space-around;
			margin: 30rpx 0;
			
			.qr-item {
				text-align: center;
				
				.qr-title {
					font-size: 28rpx;
					color: #333333;
					margin-bottom: 20rpx;
				}
				
				.qr-image {
					width: 240rpx;
					height: 240rpx;
					border: 2rpx solid #eeeeee;
					border-radius: 12rpx;
				}
			}
		}
		
		.donate-note {
			background-color: #f8f9fa;
			padding: 20rpx;
			border-radius: 12rpx;
			margin: 30rpx 0;
			
			text {
				display: block;
				font-size: 24rpx;
				color: #666666;
				line-height: 1.6;
				
				&:first-child {
					color: #333333;
					font-weight: bold;
					margin-bottom: 12rpx;
				}
			}
		}
		
		.popup-buttons {
			display: flex;
			justify-content: center;
			gap: 30rpx;
			
			button {
				width: 180rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border-radius: 35rpx;
				font-size: 28rpx;
				
				&.btn-cancel {
					background-color: #f5f5f5;
					color: #666666;
				}
				
				&.btn-submit {
					background-color: #8d5da3;
					color: #ffffff;
				}
			}
		}
	}
	
	.interaction-area {
		display: flex;
		// justify-content: space-around;
        justify-content: center;
		padding: 20rpx 0;
		margin-top: 20rpx;
        margin-left: 45rpx;
		
		.interaction-item {
			display: flex;
			align-items: center;
			gap: 0rpx;
            padding: 0 5rpx;
			text {
				font-size: 28rpx;
				color: #666;
				
				&.liked {
					color: #ff4d4f;
				}
			}
            
		}
	}
	
	.comments-section {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		
		.section-header {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			.section-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.comment-count {
				font-size: 28rpx;
				color: #999;
				margin-left: 10rpx;
			}
		}
	}
	
	.comments-list {
		.comment-item {
			display: flex;
			padding: 20rpx 0;
			border-bottom: 1px solid #f0f0f0;
			
			.commenter-avatar {
				width: 64rpx;
				height: 64rpx;
				border-radius: 32rpx;
				margin-right: 20rpx;
			}
			
			.comment-content {
				flex: 1;
				
				.comment-header {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10rpx;
					
					.commenter-name {
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
					}
					
					.comment-time {
						font-size: 24rpx;
						color: #999;
					}
				}
				
				.comment-text {
					font-size: 28rpx;
					color: #666;
					line-height: 1.5;
				}
			}
		}
		
		.view-more {
			text-align: center;
			padding: 20rpx 0;
			color: #8d5da3;
			font-size: 28rpx;
		}
	}
	
	.comment-popup {
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		height: 60vh;
		display: flex;
		flex-direction: column;
		transform: translateY(v-bind(popupTranslateY + 'px'));
		transition: transform 0.3s ease-out;
		
		.drag-bar {
			width: 100%;
			height: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			touch-action: none;
			
			&-inner {
				width: 60rpx;
				height: 6rpx;
				background-color: #ddd;
				border-radius: 3rpx;
			}
		}
		
		.popup-header {
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #f0f0f0;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
		}
		
		.comments-container {
			flex: 1;
			width: 92%;
			padding: 0 30rpx;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			
			// 隐藏滚动条
			&::-webkit-scrollbar {
				display: none;
			}
			-ms-overflow-style: none; /* IE and Edge */
			scrollbar-width: none; /* Firefox */
			
			// 适配 scroll-view
			:deep(.uni-scroll-view::-webkit-scrollbar) {
				display: none;
			}
			
			.comment-item {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1px solid #f0f0f0;
				
				.commenter-avatar {
					width: 64rpx;
					height: 64rpx;
					border-radius: 32rpx;
					margin-right: 20rpx;
				}
				
				.comment-content {
					flex: 1;
					
					.comment-header {
						display: flex;
						justify-content: space-between;
						margin-bottom: 10rpx;
						
						.commenter-name {
							font-size: 28rpx;
							color: #333;
							font-weight: 500;
						}
						
						.comment-time {
							font-size: 24rpx;
							color: #999;
						}
					}
					
					.comment-text {
						font-size: 28rpx;
						color: #666;
						line-height: 1.5;
					}
					
					.comment-actions {
						display: flex;
						gap: 30rpx;
						margin-top: 10rpx;
						
						.action-item {
							display: flex;
							align-items: center;
							gap: 6rpx;
							
							text {
								font-size: 24rpx;
								color: #999;
							}
						}
					}
				}
			}
		}
		
		.comment-input {
			padding: 20rpx 30rpx;
			border-top: 1px solid #f0f0f0;
			display: flex;
			align-items: center;
			gap: 20rpx;
			background-color: #fff;
			
			input {
				flex: 1;
				height: 72rpx;
				background-color: #f5f5f5;
				border-radius: 36rpx;
				padding: 0 30rpx;
				font-size: 28rpx;
			}
			
			.submit-btn {
				background-color: #8d5da3;
				color: #fff;
				border-radius: 36rpx;
				height: 72rpx;
				line-height: 72rpx;
				padding: 0 40rpx;
				font-size: 28rpx;
			}
		}
	}
	
	.comment-hint {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		background: transparent;
		z-index: 99;
		
		.hint-content {
			background-color: #fff;
			min-width: 300rpx;
			height: 70rpx;
			border-radius: 35rpx 35rpx 0 0;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10rpx;
			box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
			padding: 0 40rpx;
			touch-action: none;
			
			text {
				font-size: 26rpx;
				color: #999;
			}
		}
	}
	
	// 为了防止底部内容被提示条遮挡，给容器添加底部内边距
	.container {
		padding-bottom: 100rpx;
	}
	
	// 时间轴弹窗样式
	.timeline-popup {
		width: 680rpx;
		height: 800rpx;
		background-color: #fff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		
		.timeline-header {
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #f0f0f0;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.header-actions {
				display: flex;
				align-items: center;
				gap: 20rpx;
				
				.add-btn {
					background: linear-gradient(135deg, #8d5da3, #a679c7);
					color: #fff;
					font-size: 26rpx;
					padding: 10rpx 30rpx;
					border-radius: 30rpx;
					border: none;
					
					&:active {
						opacity: 0.9;
					}
				}
			}
		}
		
		.timeline-content {
			flex: 1;
			padding: 30rpx;
			overflow-y: auto;
			
			.timeline-list {
				position: relative;
				
				&::before {
					content: '';
					position: absolute;
					left: 15rpx;
					top: 0;
					bottom: 0;
					width: 2rpx;
					background-color: #e0e0e0;
				}
				
				.timeline-item {
					position: relative;
					padding-left: 50rpx;
					margin-bottom: 30rpx;
					padding-right: 20rpx; // 添加右边距
					
					.timeline-dot {
						position: absolute;
						left: 8rpx;
						top: 20rpx;
						width: 16rpx;
						height: 16rpx;
						background-color: #8d5da3;
						border-radius: 50%;
						z-index: 1;
					}
					
					.timeline-card {
						background-color: #f8f9fa;
						border-radius: 12rpx;
						padding: 20rpx;
						box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
						width: 95%; // 设置宽度为100%
						box-sizing: border-box; // 确保padding不会增加总宽度
						
						.event-header {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-bottom: 10rpx;
							
							.event-time {
								font-size: 24rpx;
								color: #666;
								flex-shrink: 0; // 防止日期被压缩
							}
							
							.event-actions {
								display: flex;
								gap: 20rpx;
								flex-shrink: 0; // 防止操作按钮被压缩
							}
						}
						
						.event-title {
							font-size: 28rpx;
							font-weight: bold;
							color: #333;
							margin-bottom: 8rpx;
							word-break: break-all; // 允许在任意字符间断行
							overflow-wrap: break-word; // 允许长单词断行
						}
						
						.event-desc {
							font-size: 26rpx;
							color: #666;
							line-height: 1.5;
							word-break: break-all; // 允许在任意字符间断行
							overflow-wrap: break-word; // 允许长单词断行
						}
					}
				}
			}
		}
	}
	
	// 事件表单弹窗样式
	.event-form {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		
		.form-header {
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #f0f0f0;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
		}
		
		.form-content {
			padding: 30rpx;
			
			:deep(.uni-forms-item) {
				margin-bottom: 20rpx;
				
				.uni-forms-item__label {
					font-size: 28rpx;
					color: #333;
				}
				
				.uni-easyinput__content {
					background-color: #f8f9fa;
					border-radius: 12rpx;
				}
			}
		}
		
		.form-footer {
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: flex-end;
			gap: 20rpx;
			border-top: 1px solid #f0f0f0;
			
			button {
				width: 160rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border-radius: 35rpx;
				font-size: 28rpx;
				
				&.cancel-btn {
					background-color: #f5f5f5;
					color: #666;
				}
				
				&.submit-btn {
					background: linear-gradient(135deg, #8d5da3, #a679c7);
					color: #fff;
				}
			}
		}
	}
    /* 添加新的样式规则 */
    :deep(.interaction-item text) {
        font-size: 35rpx !important;
        color: #ff6b81 !important;
        margin-left: 6rpx !important;
        font-weight: 500 !important;
    }

	// 添加动画相关样式
	@keyframes slideIn {
		from {
			transform: translateX(-30px);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(30px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-slide-in {
		animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		animation-fill-mode: both;
	}

	.animate-fade-in {
		animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		animation-fill-mode: both;
		animation-delay: 0.1s;
	}

	.animate-slide-up {
		animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		animation-fill-mode: both;
		animation-delay: 0.2s;
	}

	// 为弹出层添加动画
	.popup-box {
		animation: popIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes popIn {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	// 为评论项添加动画
	.comment-item {
		animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		animation-fill-mode: both;
	}

	@keyframes fadeInUp {
		from {
			transform: translateY(15px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	// 为时间轴项添加动画
	.timeline-item {
		animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		animation-fill-mode: both;
	}

	@keyframes slideInRight {
		from {
			transform: translateX(20px);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	// 为照片添加动画
	.t9j0a {
		 animation: zoomIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		 animation-fill-mode: both;
		 animation-delay: 0.3s;
	}

	@keyframes zoomIn {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	// 为互动区域添加动画
	.interaction-item {
		animation: bounceIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		animation-fill-mode: both;
		animation-delay: 0.2s;
	}

	@keyframes bounceIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		70% {
			transform: scale(1.05);
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	// 添加加载中样式
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40rpx;
		min-height: 400rpx;
	}

	// 在 style 部分添加以下样式
	.upload-box {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		border: 2rpx dashed #ddd;
		border-radius: 12rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		
		&:active {
			background-color: #e8e8e8;
		}
		
		.upload-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10rpx;
			
			text {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
	
	.image-container {
		position: relative;
		width: 100%;
		height: 100%;
		
		.image-actions {
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			display: flex;
			gap: 16rpx;
			opacity: 0;
			transition: opacity 0.3s ease;
			
			.action-btn {
				width: 60rpx;
				height: 60rpx;
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: rgba(0, 0, 0, 0.6);
				backdrop-filter: blur(5px);
				transition: all 0.3s ease;
				
				&:active {
					transform: scale(0.95);
				}
				
				&.edit-btn {
					background-color: rgba(141, 93, 163, 0.8);
				}
				
				&.delete-btn {
					background-color: rgba(245, 108, 108, 0.8);
				}
			}
		}
		
		&:hover {
			.image-actions {
				opacity: 1;
			}
		}
		
		.i23qh {
			width: 100%;
			height: 100%;
			border-radius: 12rpx;
			transition: transform 0.3s ease;
			
			&:hover {
				transform: scale(1.02);
			}
		}
	}
	
	// 修改原有的图片网格样式以适应新的布局
	.t9j0a {
		width: 32%;
		height: 240rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	// 添加分享弹窗样式
	.share-popup {
		padding: 30rpx;
		
		.share-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #f0f0f0;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.close-btn {
				padding: 10rpx;
			}
		}
		
        .share-options {
            display: flex;
            justify-content: space-around;
            padding: 40rpx 0;
            
            .share-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10rpx;
                
                .share-icon {
                    width: 40rpx;
                    height: 40rpx;
                    // border-radius: 50%;
                }
                
                text {
                    font-size: 24rpx;
                    color: #666;
                }
            }
        }
	}

	// 添加二维码弹窗样式
	.qrcode-popup {
		width: 600rpx;
		padding: 40rpx;
		border-radius: 20rpx;
		background-color: #fff;
		
		.qrcode-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.close-btn {
				padding: 10rpx;
			}
		}
		
		.qrcode-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx 0;
			
			.qrcode-image {
				width: 400rpx;
				height: 400rpx;
				margin-bottom: 20rpx;
			}
			
			.qrcode-tip {
				font-size: 26rpx;
				color: #666;
			}
		}
		
		.qrcode-footer {
			margin-top: 30rpx;
			
			.download-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background: #8d5da3;
				color: #fff;
				border-radius: 40rpx;
				font-size: 28rpx;
				
				&:active {
					opacity: 0.9;
				}
			}
		}
	}
</style>
</```
rewritten_file>