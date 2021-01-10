<template>
	<view>
		<view class="d-flex flex-column a-center j-center py-5 my-3">
			<image src="/static/images/haibao1.jpg" mode="widthFix" style="width: 100rpx; height: 100rpx;"></image>
			<view class="text-light-muted font-md">版本：1.11.1</view>
		</view>
		<view class="bg-white">
			<uniListItem title="版本更新"><view slot="right" class="iconfont icon-you text-light-muted"></view></uniListItem>
			<uniListItem title="了解小米"><view slot="right" class="iconfont icon-you text-light-muted"></view></uniListItem>
			<uniListItem title="官方微博"><view slot="right" class="iconfont icon-you text-light-muted"></view></uniListItem>
			<uniListItem title="米粉社区"><view slot="right" class="iconfont icon-you text-light-muted"></view></uniListItem>
			<uniListItem title="分享APP"><view slot="right" class="iconfont icon-you text-light-muted"></view></uniListItem>
		</view>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	export default {
		components:{
			uniListItem
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
page{
	background-color: #EEEEEE;
}
</style>
