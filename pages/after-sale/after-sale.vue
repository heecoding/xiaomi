<template>
	<view>
		<card headTitle="申请售后的产品" cardStyle="background:#ffffff">
			<view class="d-flex a-center px-3 py-2 bg-white">
				<image src="/static/images/s8.jpg" mode="widthFix" style="width: 100rpx; height: 100rpx;"></image>
				<view class="flex-1 ml-3">
					<view class="font-md">小米100</view>
					<view class="font-md text-light-muted">维修服务：剩余999天</view>
				</view>
			</view>
		</card>
		<myline></myline>
		<card headTitle="服务类型" bodyPadding cardStyle="background:#ffffff">
			<ZradioGroup :radioLabel="label1" :selected.sync="label1.selected" />
		</card>
		<myline></myline>
		<card headTitle="问题描述" bodyPadding cardStyle="background:#ffffff">
			<view class="position-relative">
				<textarea placeholder="请详细描述一下你遇到的问题" :maxlength="maxlength" style="width: 100%; height: 400rpx; box-sizing: border-box;" class="border rounded p-2" v-model="content" />
				<view class="position-absolute font" style="right: 10rpx; bottom: 5rpx;" :class="remain >= 0? 'text-light-muted':'text-danger'">{{remain+5}}/{{maxlength}}</view>
			</view>
		</card>
		<view class="p-3">
			<view class="rounded main-bg-color text-white text-center py-2 font-md" hover-class="main-bg-hover-color">下一步</view>
		</view>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue'
	import ZradioGroup from '@/components/common/radio-group.vue'
	
	export default {
		components:{
			card,
			ZradioGroup
		},
		data() {
			return {
				maxlength:200,
				content:'',
				label1:{
					selected:0,
					list:[
						{name:'维修'}
					]
				}
			}
		},
		computed:{
			//剩余可输入个数
			remain(){
				return this.maxlength - this.content.length-5
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
