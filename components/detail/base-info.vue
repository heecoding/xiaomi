<template>
	<view class="p-2 ">
		<view class="font-lg">{{details.title}}</view>
		<view class="font text-light-muted mb-3 line-h-sm">{{details.desc}}</view>
		<price priceSize="font-lg" unitSize="font">{{showPrice}}</price>
	</view>
</template>

<script>
	import price from '@/components/common/price.vue'
	
	export default{
		components:{
			price
		},
		props:['details','showPrice']
	}
</script>

<style>
</style>
