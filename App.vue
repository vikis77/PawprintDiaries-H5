<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
	const toBeDeveloped = () => {
		uni.showToast({
			title: '待开发',
			icon: 'error'
		})
	}
	onMounted() {
	    const icons = [
	        '/static/home.svg',
<!-- 	        'path/to/icon2.png',
	        'path/to/icon3.png',
	        'path/to/icon4.png', -->
	        '/static/home-active.svg',
<!-- 	        'path/to/icon2_active.png',
	        'path/to/icon3_active.png',
	        'path/to/icon4_active.png' -->
	    ];
	    icons.forEach(src => {
	        const img = new Image();
	        img.src = src; // 预加载图标
	    });
	}
<style>
	/*每个页面公共css */
	@media only screen and (min-width: 500px) {
			page {
				//background-color: red !important;
				width: 500px;
				margin: 0 auto;
			}
		}
</style>
