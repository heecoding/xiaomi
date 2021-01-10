export default{
	data(){
		return {
			beforeReady:true
		}
	},
	onReady() {
		//页面渲染好后才执行的方法
		this.$nextTick(()=>{
			this.beforeReady = false
		})
	}
}