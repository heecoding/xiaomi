<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			//初始化登陆状态
			this.$store.commit('initUser')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*引入外部样式*/
	@import url("/common/uni.css");
	@import url("/common/animate.min.css");
	@import url("/common/icon.css");
	@import url("/common/common.css");
	@import url("/common/zz-main.css");
	
	/*每个页面公共css */
	
</style>
