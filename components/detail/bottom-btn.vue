<template>
	<view>
		<view style="height: 100rpx;"></view>
		<view class="d-flex a-stretch bg-white position-fixed left-0 bottom-0 right-0" style="height: 100rpx; z-index: 100;">
			<view class="d-flex flex-1 flex-column a-center j-center line-h-md" hover-class="bg-light-secondary">
				<view class="iconfont icon-guanzhu4 text-muted line-h-md"></view>收藏
			</view>
			<view class="d-flex flex-1 flex-column a-center j-center line-h-md position-relative" hover-class="bg-light-secondary" @tap="ToCart">
				<view class="iconfont icon-gouwuchekong text-muted line-h-md"></view>
				<view class="position-absolute" style="top: 0; left: 100rpx;" v-if="cartCount ==='99+' || cartCount > 0">
					<uniBadge :text="cartCount" type="error" size="small"></uniBadge>
				</view>
				购物车
			</view>
			<view class="d-flex a-center j-center line-h-md font-md main-bg-color text-white" style="flex: 2.5;" hover-class="main-bg-hover-color" @tap="$emit('show')">
				加入购物车
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	import uniBadge from '../uni-ui/uni-badge/uni-badge.vue'
	export default{
		components:{
			uniBadge
		},
		computed:{
			...mapGetters(['cartCount'])
		},
		methods:{
			ToCart(){
				uni.switchTab({
					url: '../../pages/cart/cart'
				})
			}
		}
	}
</script>

<style>
</style>
