<template>
	<view class="container">
	  <view class="layout">
		<!-- 顶部导航搜索返回区 -->
		<view class="search-header">
		  <view class="back-btn" @click="handlerGoback">
			<img src="../static/goback.png" class="back-icon"/>
		  </view>
		  <view class="search-bar">
			<uni-search-bar
			  v-model="searchValue"
			  placeholder="搜索帖子/猫猫名字/猫猫ID"
			  :focus="true"
			  maxlength="30"
			  @input="input"
			  @confirm="search"
			  radius="100"
			  cancelButton="none"
			  bgColor="#f5f6f7"
			/>
		  </view>
		</view>
  
		<!-- 主体内容区 -->
		<scroll-view 
		  :scroll-top="scrollTop" 
		  scroll-y="true"
		  class="main-content"
		  show-scrollbar="false"
		  @scroll="handleScroll"
		>
		  <!-- 猫咪卡片展示区 -->
		  <view v-if="catList && catList.length > 0" class="cat-cards-section">
			<view class="section-title">相关猫咪</view>
			<scroll-view 
			  scroll-x="true"
			  class="cards-scroll"
			  show-scrollbar="false"
			>
			  <view class="cards-wrapper">
				<view 
				  class="cat-card"
				  v-for="cat in catList" 
				  :key="cat.catId"
				  @click="handleClickCard(cat.catId)"
				>
				  <image 
					class="cat-avatar"
					:src="`${pic_general_request_url}/cat_avatar/${cat.avatar}${Suffix_1001}`"
					mode="aspectFill"
				  />
				  <view class="cat-info">
					<text class="cat-name">{{ cat.catname }}</text>
					<text class="cat-detail">{{ cat.age }}个月 · {{ cat.gender === 1 ? '公' : '母' }}</text>
				  </view>
				</view>
			  </view>
			</scroll-view>
		  </view>
  
		  <!-- 帖子展示区 -->
		  <view v-if="posts && posts.length > 0" class="posts-section">
			<view class="section-title">相关帖子</view>
			<view class="posts-grid">
			  <view 
				class="post-card"
				v-for="post in posts" 
				:key="post.postId"
				@click="handlerClickPost(post.postId)"
			  >
				<image 
				  class="post-cover"
				  :src="`${pic_general_request_url}/post_pics/${post.coverPicture}${Suffix_1001}`"
				  mode="aspectFill"
				/>
				<view class="post-content">
				  <text class="post-title">{{ post.title }}</text>
				  <view class="post-footer">
					<view class="author">
					  <image 
						class="author-avatar"
						:src="`${pic_general_request_url}/user_avatar/${post.authorAvatar}${Suffix_1001}`"
						mode="aspectFill"
					  />
					  <text class="author-name">{{ post.authorNickname }}</text>
					</view>
					<view class="likes">
					  <uni-icons type="heart" size="12" color="#ff6b6b"/>
					  <text class="like-count">{{ post.likeCount }}</text>
					</view>
				  </view>
				</view>
			  </view>
			</view>
		  </view>
  
		  <!-- 无搜索结果展示 -->
		  <view v-if="(!catList || !catList.length) && (!posts || !posts.length)" class="no-result">
			<img src="../static/emp-common-empty state.png" class="no-result-icon"/>
			<text class="no-result-text">暂无相关搜索结果</text>
		  </view>
		</scroll-view>
	  </view>
	</view>
  </template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { API_general_request_url, pic_general_request_url, Suffix_1001 } from '@/src/config/index.js'
    import { STATUS_CODE } from '@/src/constant/constant.js'
    import { useAppStore } from '@/store/modules/app'
    const appStore = useAppStore()
	
	const catList = ref([]);
	const posts = ref([]);
	const searchValue = ref('');
	const scrollTop = ref(0);
	
	// 处理滚动事件
	function handleScroll(e) {
		scrollTop.value = e.detail.scrollTop;
	}
	
	// 输入事件
	function input(e) {
		console.log('input:', e);
	}
	
	onLoad((options) => {
		if (options && options.searchWords) {
			searchValue.value = decodeURIComponent(options.searchWords);
			console.log("接收到的参数 searchWords:", searchValue.value);
		}
	});
	
	onMounted(() => {
		try {
			// const searchResultData = uni.getStorageSync('searchResultData');
            const searchResultData = appStore.searchResultData;
			if (searchResultData) {
				// 先处理猫猫数据
				if (searchResultData.cats && searchResultData.cats.length > 0) {
					catList.value = searchResultData.cats;
				}
				// 再处理帖子数据
				if (searchResultData.posts && searchResultData.posts.records) {
					posts.value = searchResultData.posts.records;
				}
			}
		} catch (error) {
			console.error('获取搜索结果失败:', error);
		}
	});
	
	// 返回搜索页
	function handlerGoback() {
		uni.redirectTo({
			url: 'Search'
		});
	}
	
	// 点击猫咪卡片
	function handleClickCard(catId) {
		uni.navigateTo({
			url: `Card?catId=${catId}`
		});
	}
	
	// 点击帖子
	function handlerClickPost(postId) {
		uni.navigateTo({
			url: `Post?postId=${postId}`
		});
	}
	
	// 搜索事件
	function search(words) {
		const token = uni.getStorageSync('token');
		if (!token) {
			uni.showToast({
				title: '请登录后再搜索',
				icon: 'none'
			});
			return;
		}
		
		uni.request({
			url: `${API_general_request_url.value}/api/search/search?words=${searchValue.value}`,
			method: 'GET',
			header: {
				'Authorization': `Bearer ${token}`
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data.code === STATUS_CODE.SUCCESS) {
					// 存储搜索结果
					uni.setStorageSync('searchResultData', res.data.data);
					
					// 先处理猫猫数据
					if (res.data.data.cats && res.data.data.cats.length > 0) {
						catList.value = res.data.data.cats;
					} else {
						catList.value = [];
					}
					
					// 再处理帖子数据
					if (res.data.data.posts && res.data.data.posts.records) {
						posts.value = res.data.data.posts.records;
					} else {
						posts.value = [];
					}
				} else {
					uni.showToast({
						title: res.data.msg || '搜索失败',
						icon: 'none'
					});
				}
			},
			fail: () => {
				uni.showToast({
					title: '请求失败,请重试',
					icon: 'none'
				});
			}
		});
	}
</script>

<style lang="scss" scoped>
// 文本省略混入
@mixin text-ellipsis($line: 1) {
  overflow: hidden;
  text-overflow: ellipsis;
  @if $line == 1 {
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $line;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
}

// 隐藏滚动条
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

.container {
  min-height: 100vh;
  background: #f8f9fa;
  
  .layout {
    .search-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: #fff;
      box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
      
      .back-btn {
        padding: 20rpx;
        
        .back-icon {
          width: 40rpx;
          height: 40rpx;
        }
      }
      
      .search-bar {
        flex: 1;
        
        :deep(.uni-searchbar) {
          padding: 0;
          
          .uni-searchbar__box {
            border-radius: 100rpx;
          }
        }
      }
    }
    
    .main-content {
      margin-top: 120rpx;
      height: calc(100vh - 120rpx);
      
      .section-title {
        padding: 30rpx 30rpx 20rpx;
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }
      
      .cat-cards-section {
        padding-bottom: 30rpx;
        background: #fff;
        margin-bottom: 20rpx;
        
        .cards-scroll {
          .cards-wrapper {
            display: flex;
            padding: 0 20rpx;
            
            .cat-card {
              flex-shrink: 0;
              width: 280rpx;
              margin-right: 20rpx;
              border-radius: 20rpx;
              background: #fff;
              box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
              overflow: hidden;
              transition: transform 0.3s ease;
              
              &:active {
                transform: scale(0.98);
              }
              
              .cat-avatar {
                width: 100%;
                height: 280rpx;
              }
              
              .cat-info {
                padding: 20rpx;
                
                .cat-name {
                  font-size: 28rpx;
                  font-weight: 500;
                  color: #333;
                }
                
                .cat-detail {
                  font-size: 24rpx;
                  color: #999;
                  margin-top: 8rpx;
                }
              }
            }
          }
        }
      }
      
      .posts-section {
        background: #fff;
        
        .posts-grid {
          padding: 0 20rpx;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20rpx;
          
          .post-card {
            border-radius: 16rpx;
            background: #fff;
            box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
            overflow: hidden;
            transition: transform 0.3s ease;
            
            &:active {
              transform: scale(0.98);
            }
            
            .post-cover {
              width: 100%;
              height: 340rpx;
            }
            
            .post-content {
              padding: 20rpx;
              
              .post-title {
                font-size: 26rpx;
                color: #333;
                line-height: 1.4;
                @include text-ellipsis(2);
              }
              
              .post-footer {
                margin-top: 16rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
                .author {
                  display: flex;
                  align-items: center;
                  
                  .author-avatar {
                    width: 36rpx;
                    height: 36rpx;
                    border-radius: 50%;
                  }
                  
                  .author-name {
                    margin-left: 10rpx;
                    font-size: 24rpx;
                    color: #666;
                    @include text-ellipsis;
                  }
                }
                
                .likes {
                  display: flex;
                  align-items: center;
                  
                  .like-count {
                    margin-left: 6rpx;
                    font-size: 24rpx;
                    color: #999;
                  }
                }
              }
            }
          }
        }
      }
      
      .no-result {
        padding-top: 200rpx;
        text-align: center;	
		display: flex;
		flex-direction: column;
		align-items: center;
        
        .no-result-icon {
          width: 200rpx;
          height: 200rpx;
          opacity: 0.5;
        }
        
        .no-result-text {
          margin-top: 30rpx;
          font-size: 28rpx;
          color: #999;
        }
      }
    }
  }
}
</style>
