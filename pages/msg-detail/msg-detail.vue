<template>
	<view>
		<!-- 标题 -->
		<view class="font-lg text-dark my-3 p-2">{{detail.title}}</view>
		<!-- 内容 -->
		<view>
			<uParse className="u-Parse" :content="contextHtml" @preview="preview" @navigate="navigate"></uParse>
		</view>
	</view>
</template>

<script>
	import uParse from '@/components/uni-ui/uParse/src/wxParse.vue'
	
	
	let htmlString = `<p>
				<img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/22c1c7124e7d80049f108e36b7beb6cb.jpg?w=1080&h=1700&bg=20204">
				<img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/da5125cf669159eb2c46eb8728779b0e.jpg?w=1080&h=1453&bg=FFFFFF">
				<img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/006ca0e31eb01237a2d9630f47195dec.jpg?w=1080&h=960&bg=D4B072">
				<img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c20e02f4eab3f0469f2b9b9dd5c4812a.jpg?w=1080&h=1321&bg=DDDDDD">
			</p>`;
	export default {
		components:{
			uParse
		},
		data() {
			return {
				detail:{},
				contextHtml: htmlString,
			}
		},
		onLoad(e) {
			if(!e.detail){
				return uni.navigateBack({
					delta:1
				})
			}
			//初始化数据
			this.detail = JSON.parse(e.detail)
			// 设置页面标题
			uni.setNavigationBarTitle({
				title:this.detail.title
			})
		},
		methods: {
			preview(src, e) {
				//do something
				console.log('src:' + src);
			},
			navigate(href, e) {
				//如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				console.log('href:' + href);
				uni.showModal({
					content: '点击链接为:' + href,
					showCancel: false
				});
			}
		}
	}
</script>

<style>
page{
	overflow-x: hidden;
}
.u-Parse view {
	line-height: 0 !important;
}
.u-Parse .p {
	padding: 0 !important;
}
</style>
