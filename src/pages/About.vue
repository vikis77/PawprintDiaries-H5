<template>
  <view class="container" @touchmove.stop.prevent="handleTouchMove">
    <NavBar1001 
        :title="'软件和开发者'"
        :showLeft="true"
        :showRight="false"
    />

    <scroll-view 
      class="content-container" 
      scroll-y 
      :scroll-x="false"
      :show-scrollbar="false"
      :enable-flex="true"
      @touchmove.stop="() => {}"
    >
      <!-- 软件信息部分 -->
      <view class="card">
        <view class="card-title">关于 PawPrint Diaries</view>
        <view class="card-content">
          <view class="version-info">当前测试版本：v2.0.0 PawPrint Diaries</view>
          <view class="app-desc">
            一个结合校园流浪猫救助管理和社交分享的社区平台，通过记录和分享学校流浪猫的信息，
            连接爱猫人士，共同为猫猫创造更好的生活环境，为救助工作提供信息支持，为学校管理提供数据参考。
          </view>
        </view>
      </view>

      <!-- 更新日志部分 -->
      <view class="card">
        <view class="card-title">更新日志</view>
        <view class="card-content">
          <view class="update-item">
            <view class="update-version">v2.0.2 (2024-12-24)</view>
            <view class="update-list">
              <view class="update-point">• 新增帖子图片下载功能</view>
              <view class="update-point">• </view>
              <view class="update-point"></view>
            </view>
            <view class="update-version">v2.0.1 (2024-12-22)</view>
            <view class="update-list">
              <view class="update-point">• 修复若干已知问题</view>
              <view class="update-point">• 优化系统性能</view>
              <view class="update-point"></view>
            </view>
            <view class="update-version">v2.0.0 (2024-12)</view>
            <view class="update-list">
              <view class="update-point">• 全面优化界面</view>
              <view class="update-point">• 新增猫咪信息管理</view>
              <view class="update-point">• 新增帖子管理</view>
              <view class="update-point">• 新增上传地图定位</view>
              <view class="update-point">• 新增拍猫识别</view>
              <view class="update-point"></view>
            </view>
            <view class="update-version">v1.0.0 (2024-9)</view>
            <view class="update-list">
              <view class="update-point">• 首次上线1.0测试版本</view>
              <view class="update-point">• 实现基础的猫咪信息展示</view>
              <view class="update-point">• 首页帖子展示</view>
              <view class="update-point">• 集成地图定位，可显示小猫位置</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 开发者信息部分 -->
      <view class="card">
        <view class="card-title">开发者信息：qinruibiao</view>
        <view class="card-content">
          <view class="info-section">
            <view class="info-label">项目链接（前端、后端、预测模型）：</view>
            <view class="info-links">
                <view class="contact-item">
                  GitHub: <text class="link" @click="openUrl('https://github.com/vikis77')">https://github.com/vikis77</text>
                </view>
            </view>
          </view>
          <view class="info-section">
            <view class="info-label">联系方式：</view>
            <view class="contact-item">
                  Blog: <text class="link" @click="openUrl('https://luckyiur.com')">https://luckyiur.com</text>
            </view>
            <view class="contact-item">
                Email: <text class="link" @click="openUrl('mailto:qin2607994895@gmail.com')">qin2607994895@gmail.com</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 版权声明部分 -->
      <view class="card">
        <view class="card-title">版权声明</view>
        <view class="card-content">
          <view class="declaration-text">
            <view class="intro">本应用程序为演示应用，旨在展示个人学习和开发的项目。特此声明：</view>
            
            <view class="declaration-header" @click="toggleDeclaration">
              <text>查看详细声明</text>
              <text class="toggle-icon" :class="{ 'expanded': isDeclarationExpanded }">{{ isDeclarationExpanded ? '▼' : '▶' }}</text>
            </view>

            <view class="declaration-list" :class="{ 'expanded': isDeclarationExpanded }">
              <view class="declaration-item">1. 非商业用途：本项目仅用于学习和展示，所有功能和内容均为个人开发，不用于商业目的。</view>
              <view class="declaration-item">2. 知识产权：项目中使用的所有第三方库、组件和资源均归其合法拥有者所有。项目不对其知识产权的合法性负责。</view>
              <view class="declaration-item">3. 数据隐私：本项目未涉及用户数据的收集和存储，用户在使用过程中请勿输入敏感个人信息。开发者不对任何因使用本应用而导致的隐私泄露或数据安全问题负责。</view>
              <view class="declaration-item">4. 功能稳定性：本应用处于学习开发阶段，可能存在不稳定或未完善的功能，使用者需自行承担风险。</view>
              <view class="declaration-item">5. 免版权资源：项目中的所有图片资源均为免版权可使用，展示的数据均为测试数据，不涉及任何真实用户或实际情况。</view>
              <view class="declaration-item">6. 反馈与建议：欢迎用户提供反馈和建议，以帮助开发者不断改进本项目。</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import NavBar1001 from '@/src/components/common/NavBar1001.vue'
import { ref } from 'vue';

const isDeclarationExpanded = ref(false);

const handleTouchMove = (e) => {
  e.preventDefault();
};

const toggleDeclaration = () => {
  isDeclarationExpanded.value = !isDeclarationExpanded.value;
};

const openUrl = (url) => {
  if (url.startsWith('mailto:')) {
    // 处理邮件链接
    window.location.href = url;
  } else {
    // 使用系统浏览器打开链接
    // #ifdef APP-PLUS
    plus.runtime.openURL(url);
    // #endif
    
    // #ifdef H5
    window.open(url, '_blank');
    // #endif
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
  overflow: hidden;
}

.content-container {
  flex: 1;
  padding: 12px;
  width: 94vw;
  -webkit-overflow-scrolling: touch;
}

.card {
  background-color: #fff;
  margin-bottom: 12px;
  padding: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.card-content {
  font-size: 14px;
  color: #666;
}

.version-info {
  color: #007AFF;
  margin-bottom: 8px;
}

.app-desc {
  line-height: 1.5;
}

.update-item {
  .update-version {
    color: #007AFF;
    margin-bottom: 8px;
  }

  .update-list {
    .update-point {
      margin-bottom: 6px;
      line-height: 1.4;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.info-section {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  .info-label {
    margin-bottom: 8px;
  }

  .info-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .link {
    color: #007AFF;
    text-decoration: none;
    
    &:active {
      opacity: 0.7;
    }
  }

  .info-content {
    color: #666;
  }
}

.declaration-text {
  .intro {
    margin-bottom: 12px;
    font-weight: 500;
  }

  .declaration-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background-color: #f8f8f8;
    border-radius: 6px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #333;

    .toggle-icon {
      font-size: 12px;
      color: #666;
      transition: transform 0.3s ease;

      &.expanded {
        transform: rotate(0deg);
      }
    }
  }

  .declaration-list {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;

    &.expanded {
      height: auto;
    }

    .declaration-item {
      margin-bottom: 12px;
      line-height: 1.6;
      text-align: justify;
      padding-left: 12px;
      border-left: 2px solid #eee;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.test-account-section {
  margin-top: 24px;

  .section-title {
    font-weight: 500;
    margin-bottom: 12px;
  }

  .account-list {
    .account-item {
      background-color: #f8f8f8;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 8px;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.contact-section {
  margin-top: 24px;

  .section-title {
    font-weight: 500;
    margin-bottom: 12px;
  }

  .contact-list {
    .contact-item {
      margin-bottom: 8px;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

      .link {
        color: #007AFF;
        text-decoration: none;
        
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
}
</style> 