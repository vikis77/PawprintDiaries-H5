<template>
  <view class="box">
    <view class="tz8y">
    	<uni-forms ref="t23sxx" :modelValue="baseFormData">
    		<uni-forms-item label="姓名" required>
    			<uni-easyinput  placeholder="请输入姓名" />
    		</uni-forms-item>
    		<uni-forms-item label="年龄" required>
    			<uni-easyinput  placeholder="请输入年龄" />
    		</uni-forms-item>
    		<uni-forms-item label="性别" required>
    			<uni-data-checkbox  :localdata="sexs" />
    		</uni-forms-item>
    		<uni-forms-item label="兴趣爱好" required>
    			<uni-data-checkbox  multiple :localdata="hobbys" />
    		</uni-forms-item>
    		<uni-forms-item label="自我介绍">
    			<uni-easyinput type="textarea"  placeholder="请输入自我介绍" />
    		</uni-forms-item>
    		<uni-forms-item label="日期时间">
    			<uni-datetime-picker type="datetime" return-type="timestamp" />
    		</uni-forms-item>
    	</uni-forms>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'; 
// import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
import uniForms from '@dcloudio/uni-ui/lib/uni-forms/uni-forms.vue';
import uniFormsItem from '@dcloudio/uni-ui/lib/uni-forms-item/uni-forms-item.vue';
import uniEasyInput from '@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.vue';
import uniDataCheckbox from '@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.vue';
import uniDatetimePicker from '@dcloudio/uni-ui/lib/uni-datetime-picker/uni-datetime-picker.vue';
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';

console.log("当前 NODE_ENV:", process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development'){
	
}
	
const popupAdopt = ref(null);

const handleClickAdopt = () => {
  popupAdopt.value.open();
};
</script>

<style lang="scss" scoped>
// .box {
//   width: 600rpx;
//   height: 600rpx;
// }
// .t7 {
//   display: flex; /* 添加flex布局 */
//   align-items: center;
//   justify-content: center;
//   width: 100vw;
//   height: 100vh;
//   background-color: #777;
// }
// .t5235 {
//   width: 100rpx;
//   height: 100rpx;
//   margin: 0 5px;
//   border-radius: 5px;
//   background-color: #aaa;
// }
</style>
