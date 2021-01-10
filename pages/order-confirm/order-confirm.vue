<template>
	<view style="background-color: #F5F5F5; min-height: 100%; height: auto;">
		<!-- 地址选择 -->
		<view class="main-bg-color text-white d-flex a-center px-3" style="height: 250rpx;" hover-class="main-bg-hover-color" @click="openPathList">
			<view>
				<!-- 默认地址判断渲染 -->
				<template v-if="path">
					<view class="font-lg font-weight d-flex a-center">
						{{path.name}}{{path.phone}}<view class="border border-white rounded px-1 font ml-2" v-if="path.isdefault">默认</view>
					</view>
					<view class="font">{{path.path}}{{path.detailPath}}</view>
				</template>
				<template v-else>
					<view class="font-lg font-weight d-flex a-center">
						请选择收货地址
					</view>
				</template>
			</view>
			<view class="iconfont icon-you1 ml-auto font-md"></view>
		</view>
		<view style="border-top-left-radius: 40rpx 25rpx; border-top-right-radius: 40rpx 25rpx; margin-top: -25rpx; overflow: hidden;">
			<view class="bg-white">
				<uniListItem showArrow>
					<view class="d-flex a-center">
						<image src="/static/images/s9.jpg" class="rounded mr-2" style="width: 100rpx; height: 100rpx;"></image>
						<image src="/static/images/s9.jpg" class="rounded mr-2" style="width: 100rpx; height: 100rpx;"></image>
						<image src="/static/images/s9.jpg" class="rounded mr-2" style="width: 100rpx; height: 100rpx;"></image>
					</view>
					<view slot="rightContent">共3件</view>
					<view slot="right" class="iconfont icon-you1"></view>
				</uniListItem>
				<uniListItem title="商品总价" :showArrowIcon="true">
					<view slot="rightContent">
						<price color="text-dark">2000.00</price>
					</view>
				</uniListItem>
				<uniListItem title="运费" :showArrowIcon="true">
					<view slot="rightContent">包邮</view>
				</uniListItem>
				<navigator url="../order-coupon/order-coupon">
					<uniListItem title="优惠券">
						<view slot="rightContent" class="text-light-muted">没有可用</view>
						<view slot="right" class="iconfont icon-you1"></view>
					</uniListItem>
				</navigator>
				<uniListItem :showArrowIcon="true">
					<text class="main-text-color">小计</text>
					<view slot="rightContent">
						<price>2000.00</price>
					</view>
				</uniListItem>
				<myline></myline>
				<uniListItem  title="发票" extraWidth="50%" @click="openOrderInvoice">
					<view slot="rightContent">电子发票-个人</view>
					<view slot="right" class="iconfont icon-you1"></view>
				</uniListItem>
				
				<!-- 底部导航 -->
				<view class="position-fixed d-flex a-center border right-0 bottom-0 left-0 bg-white p-2">
					<view class="row a-center font-md ml-auto">合计：<price>2000.00</price></view>
					<view class="px-3 py-1 ml-2 main-bg-color text-white" hover-class="main-bg-hover-color" style=" border-radius: 80rpx;" @click="openPayMethods">去支付</view>
				</view>
			</view>
		</view>
		
		
		
		
		
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	
	export default {
		components:{
			uniListItem,
			price
		},
		data() {
			return {
				path:false
			}
		},
		onLoad() {
			if(this.defaultPath){
				this.path = this.defaultPath[0]
			}
			// 开启监听 选择收货地址事件
			uni.$on('choosePath',(res) =>{
				this.path = res
			})
		},
		onUnload() {
			// 关闭监听 选择收货地址事件
			uni.$off('choosePath',(e)=>{
				console.log('关闭监听',e)
			})
		},
		computed:{
			...mapGetters(['defaultPath'])
		},
		methods: {
			openPathList(){
				uni.navigateTo({
					url:'../user-path-list/user-path-list?type=choose'
				})
			},
			openOrderInvoice(){
				uni.navigateTo({
					url:'../order-invoice/order-invoice'
				})
			},
			openPayMethods(){
				uni.navigateTo({
					url:'../pay-methods/pay-methods'
				})
			}
		}
	}
</script>

<style>

</style>
