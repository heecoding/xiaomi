<template>
	<view>
		<myline></myline>
		<uniListItem title="头像">
			<block slot="right">
				<image src="../../static/images/logo.png"  class="rounded-circle border border-light-secondary main-bg-color" style="width: 90rpx; height: 90rpx;"></image>
			</block>
		</uniListItem>
		<uniListItem title="姓名">
			<block slot="right">
				xiaomi
			</block>
		</uniListItem>
		<uniListItem title="性别">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
		<uniListItem title="生日">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
		<myline></myline>
		<uniListItem title="修改密码">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
		<uniListItem title="密保手机">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
	</view>
</template>

<script>
	import myline from '@/components/common/myline.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	
	export default {
		components:{
			myline,
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

</style>
