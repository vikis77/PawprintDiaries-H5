<!-- 猫猫信息卡片详情页
 
 -->
 <template>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-container">
			<view class="layout">
				<!-- 头部导航 -->
				<view class="header">
					<uni-row class="header-row" :width="750">
						<uni-col :span="8" class="header-left">
							<img src="../../static/goback.png" @click="handleGoback" class="header-icon"/>
						</uni-col>
						<uni-col :span="8" class="header-center">
							<text class="header-title">小猫卡片</text>
						</uni-col>
						<uni-col :span="8" class="header-right">
							<view class="more-menu">
								<img src="../../static/more.png" @click.stop="toggleMenu" class="header-icon"/>
								<!-- 遮罩层 -->
								<view v-if="showMenu" class="mask" @click.stop="showMenu = false"></view>
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
				<!-- 主题信息展示 -->
				<view class="t2">
					<!-- 左边图片区域 -->
					<view class="tyh90p"> 
						<view class="t87kza">
							<image :src="`${pic_general_request_url}/cat_avatar/${cat.avatar}`" mode="aspectFill" @click="previewImage([`${pic_general_request_url}/cat_avatar/${cat.avatar}`])"></image>
						</view>
						<!-- 添加互动区域 -->
						<view class="interaction-area">
							<!-- 点赞 -->
							<view class="interaction-item" @click="handleLike">
								<uni-icons :type="isLiked ? 'heart-filled' : 'heart'" size="24" :color="isLiked ? '#ff4d4f' : '#666'"></uni-icons>
								<text :class="{'liked': isLiked}">{{cat.likeCount}}</text>
							</view>
							<!-- 热度 -->
							<view class="interaction-item">
								<uni-icons type="fire" size="24" color="#ff9c6e"></uni-icons>
								<text>{{cat.trending || 0}}</text>
							</view>
							<!-- 评论 -->
							<view class="interaction-item" @click="showComments">
								<uni-icons type="chat" size="24" color="#666"></uni-icons>
								<text>{{commentCount}}</text>
							</view>
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
							<!-- <view class="tzv8u">
								<image class="tz8888" src="../../static/catbag.png" mode=""></image>
								<image class="tz8888" src="../../static/catbag.png" mode=""></image>
								<image class="tz8888" src="../../static/catbag.png" mode=""></image>
							</view> -->
							
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
										<image class="i23qh" :src="`${pic_general_request_url}/cat_pics/${item.url}`" mode="aspectFill" @click="previewImage(picUrlDatas.map(pic => `${pic_general_request_url}/cat_pics/${pic.url}`), index)"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
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
							<img class="qr-image" src="../../static/cat.png" mode="aspectFit"/>
						</view>
						<view class="qr-item">
							<text class="qr-title">支付宝</text>
							<img class="qr-image" src="../../static/cat.png" mode="aspectFit"/>
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
							<img class="commenter-avatar" :src="`${pic_general_request_url}/user_avatar/${comment.avatar}`" mode="aspectFill"></img>
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
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { API_general_request_url, pic_general_request_url } from '@/src/config/index.js'
	const appStore = useAppStore()
	
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
	
	onShow(() => {
		const options = getCurrentPages().pop().options; // 获取页面传递的参数
		const catId = options.catId; // 获取传递过来的 catId
		console.log(catId)
		// const catList = uni.getStorageSync('catList'); // 获取猫猫列表
		const catList = appStore.catList
		console.log(catList)
		// 根据 catId 查找对应的小猫信息
		const selectedCat = catList.find(cat => cat.catId === parseInt(catId));
		// 将选中的猫信息存储到响应式数据中
		cat.value = selectedCat;
		
		// 初始化点赞状态和数量
		if (selectedCat) {
			isLiked.value = selectedCat.isLikedToday || false;
			likeCount.value = selectedCat.likeCount || 0;
		}
		
		// 处理猫咪选择列表数据
		catSelectList.value = catList.map(cat => ({
			value: cat.catname,
			text: `${cat.catname} - ${cat.gender === 1 ? '公' : '母'} - ${cat.age}个月`
		}));
		
		// 设置当前猫猫为默认选中
		if (selectedCat) {
			adoptFormsData.value.catName = selectedCat.catname;
		}
		
		// 获取猫猫照片
		uni.request({
			url: `${API_general_request_url.value}/api/cat/photo/${catId}`,
			method: 'GET,',
			success: (response) => {
				if (response.statusCode === 200 && response.data.code === '2000'){
					picUrlDatas.value = response.data.data;
                    console.log('获取小猫图片成功')
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
		
		// 获取点赞和评论数据
		getComments();
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
	
	function submitAdoptForm() {
		// 验证表单是否填写完整
		if (!adoptFormsData.value.catName || 
			!adoptFormsData.value.name || 
			!adoptFormsData.value.class || 
			!adoptFormsData.value.origin || 
			!adoptFormsData.value.phone || 
			!adoptFormsData.value.wechat) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			});
			return;
		}
		
		// 发送领养申请
		uni.request({
			url: `${API_general_request_url.value}/adopt/apply`,
			method: 'POST',
			data: adoptFormsData.value,
			success: (res) => {
				if (res.data.code === 200) {
					uni.showToast({
						title: '申请提交成功',
						icon: 'success'
					});
					closeAdoptPopup();
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
			title: '确认删除',
			content: '确定要删除这只小猫的信息吗？此操作不可恢复。',
			success: function (res) {
				if (res.confirm) {
					// 发送删除请求
					uni.request({
						url: `${API_general_request_url.value}/api/cat/${cat.value.catId}`,
						method: 'DELETE',
						success: (response) => {
							if (response.statusCode === 200 && response.data.code === '2000') {
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
			// header: {
			// 	'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// },
			success: (res) => {
				if (res.statusCode === 200 && res.data.code === '2000') {
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
				if (res.statusCode === 200 && res.data.code === '2000') {
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
	function submitComment() {
		// 检查登录
		if (!checkLogin()) {
			return;
		}
		// 检查评论是否为空
		if (!newComment.value.trim()) return;
		// 获取当前用户信息
        console.log(appStore.userInfo)
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
				if (res.statusCode === 200 && res.data.code === '2000') {
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
		e.stopPropagation();
		touchStartY.value = e.touches[0].clientY;
		touchStartTime.value = Date.now();
		moveSpeed.value = 0;
	};
	
	// 触摸移动
	const touchMove = (e) => {
		e.stopPropagation();
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

		// 只有在向下滑动时才处理
		if (moveDistance > 0) {
			const scrollTop = e.currentTarget.scrollTop;
			
			// 如果已经滚动到顶部，则允许下拉关闭
			if (scrollTop <= 0) {
				popupTranslateY.value = moveDistance;
				e.preventDefault(); // 阻止滚动
			}
		}
	};
	
	// 触摸结束
	const touchEnd = (e) => {
		e.stopPropagation();
		const endY = e.changedTouches[0].clientY;
		const moveDistance = endY - touchStartY.value;
		const moveTime = Date.now() - touchStartTime.value;
		
		// 判断是否为快速滑动（速度阈值可以调整）
		const isQuickSlide = moveSpeed.value > 0.3; // 每毫秒0.3像素以上视为快速滑动
		
		if (moveDistance > 0) { // 向下滑动
			if (moveDistance > 300 || isQuickSlide) {
				// 滑动距离大于300px或快速滑动时关闭弹窗
				closeComments();
			} else {
				// 否则回弹
				popupTranslateY.value = 0;
			}
		}
		
		// 重置状态
		moveSpeed.value = 0;
		lastMoveTime.value = 0;
		touchMoveY.value = 0;
		popupTranslateY.value = 0;
	};
</script>

<style lang="scss" scoped>
	.container{
		width: 750rpx;
		height: 100vh;
		position: relative;
		overflow-x: hidden;
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
	
	// 添加新的样式
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 998;
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
		justify-content: space-around;
		padding: 20rpx 0;
		margin-top: 20rpx;
		
		.interaction-item {
			display: flex;
			align-items: center;
			gap: 8rpx;
			
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
</style>
</```
rewritten_file>