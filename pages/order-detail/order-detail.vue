<template>
	<view>
		<view class="main-bg-color text-white p-4 d-flex a-end j-sb" style="height: 300rpx;">
			<view class="mb-3">
				<view class="font-lg">卖家已发货</view>
				<view class="font">还差7天12时自动确认</view>
			</view>
			<view class="iconfont icon-daishouhuo line-h mb-3" style="font-size: 100rpx;"></view>
		</view>
		<view class="p-3 bg-white">
			<view class="text-light-muted">
				<text class="font-md text-dark mr-2">米粉</text>
				188****8888
			</view>
			<view class="text-light-muted font-md">
				河南省 郑州市 金水区 CBD
			</view>
		</view>
		<myline></myline>
		<view class="px-2">
			<block v-for="(item,index) in orderItems" :key="index">
				<orderListItem :item="item" :index="index"></orderListItem>
			</block>
		</view>
		<myline></myline>
		<uniListItem>
			<text class="font-md text-light-muted">商品总价</text>
			<view slot="right" class="font-md text-light-muted">￥888.88</view>
		</uniListItem>
		<uniListItem>
			<text class="font-md text-light-muted">快递</text>
			<view slot="right" class="font-md text-light-muted">￥10.00</view>
		</uniListItem>
		<uniListItem>
			<text class="font-md text-light-muted">优惠卷</text>
			<view slot="right" class="font-md text-light-muted">-￥100.00</view>
		</uniListItem>
		<uniListItem>
			<text class="font-md main-text-color">实际付款</text>
			<view slot="right" class="font-md text-light-muted">
				<price>788.00</price>
			</view>
		</uniListItem>
		<myline></myline>
		<card headTitle="订单信息">
			<uniListItem title="订单编号">
				<view slot="right" class="font-md text-light-muted">123123123</view>
			</uniListItem>
		</card>
	</view>
</template>

<script>
	import orderListItem from '@/components/order/order-list-item.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	import card from '@/components/common/card.vue'
	
	export default {
		components:{
			orderListItem,
			uniListItem,
			price,
			card
		},
		data() {
			return {
				create_time:'2020-12-01 10:20',
				status:'已发货',
				orderItems:[
					{
						cover:'/static/images/s6.jpg',
						title:'小米10',
						pprice:'3999.00',
						attrs:'蓝色 标配',
						num:1
					}
				],
				total_num:3,
				total_price:788.00
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
