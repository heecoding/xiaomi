<template>
	<view class="bg-white rounded border border-light-secondary d-flex a-center mb-3">
		<view class="flex-1 d-flex flex-column j-center px-3">
			<view class="font-md" :class="item.disabled || !item.status ? 'text-light-muted':''">{{item.title}}</view>
			<view class="font text-light-muted">{{item.start_time}}~{{item.end_time}}</view>
		</view>
		<view class="text-white d-flex flex-column a-center j-center" style="width: 220rpx; height: 200rpx;" :class="item.disabled || !item.status ? 'bg-secondary':'main-bg-color'">
			<view class="font-lg">{{item.price}}<text class="font">元</text></view>
			<view>{{item.desc}}</view>
			<view class="rounded w-50 text-center" :class="item.disabled ? 'text-light-muted':'text-white'" :hover-class="item.disabled || !item.status ? 'bg-light':'main-bg-hover-color'">{{item.status ? '去使用':'已失效'}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			item:Object,
			index:Number
		}
	}
</script>

<style>
</style>
