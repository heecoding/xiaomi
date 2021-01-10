<template>
	<view class="d-flex border-bottom border-light-secondary" @click.stop="openDetail">
		<view class="d-flex a-center py-2">
			<image :src="item.cover" mode="widthFix" style="width: 150rpx; height: 150rpx;" class="rounded mx-2 flex-shrink"></image>
		</view>
		<view class="flex-1">
			<view class="d-flex a-center pt-3">
				<text class="font-md text-dark">{{item.title}}</text>
				<text class="font-md text-light-muted ml-auto">￥{{item.pprice}}</text>
			</view>
			<view class="d-flex a-center">
				<text class="font text-light-muted">{{item.attrs}}</text>
				<text class="font text-light-muted ml-auto">x{{item.num}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			item:Object,
			index:Number
		},
		methods:{
			openDetail(){
				uni.navigateTo({
					url:'../../pages/detail/detail'
				})
			}
		}
	}
</script>

<style>
</style>
