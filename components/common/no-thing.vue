<template>
	<!-- <view class="position-relative border w-100" style="height: 400rpx;"> -->
		<view class="position-absolute d-flex flex-column a-center j-center top-0 right-0 bottom-0 left-0" style="background-color: #F5F5F5;">
			<image :src="getIcon" mode="widthFix" style="width: 250rpx;"></image>
			<view class="text-light-muted font-md">{{this.msg}}</view>
		</view>
	<!-- </view> -->
</template>

<script>
	export default{
		props:{
			icon:{
				type:String,
				default:'noComment'
			},
			msg:{
				type:String,
				default:'为空~'
			}
		},
		computed:{
			getIcon(){
				return `/static/images/nothing/${this.icon}.png`
			}
		}
	}
</script>

<style>
</style>
