<template>
	<view class="d-flex j-center bg-white">
		<image :src="indexThreeImg[0].src" lazy-load style="width: 375upx; height: 530upx; border-right: 2upx solid #FFFFFF;" mode="widthFix" @tap="threeEventB($event)"></image>
		<view class="d-flex flex-column">
			<image :src="indexThreeImg[1].src" style="width: 375upx; height: 264upx; border-bottom: 2upx solid #FFFFFF;" mode="widthFix" @tap="threeEventSt($event)"></image>
			<image :src="indexThreeImg[2].src" style="width: 375upx; height: 264upx;" mode="widthFix" @tap="threeEventSb($event)"></image>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			indexThreeImg:Object
		},
		methods:{
			threeEventB(e){
				var e=e || window.event
				console.log('threebigimg B'+e)
			},
			threeEventSt(e){
				var e=e || window.event
				console.log('threebigimg St'+e)
			},
			threeEventSb(e){
				console.log('threebigimg Sb'+e)
			}
		}
	}
</script>

<style>
</style>
