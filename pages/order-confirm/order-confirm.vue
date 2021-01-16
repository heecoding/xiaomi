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
					<view class="font">{{path.province}} {{path.city}} {{path.district}} {{path.address}}</view>
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
						<image :src="item.cover" class="rounded mr-2" style="width: 100rpx; height: 100rpx;" v-for="(item,index) in goodsList" :key="index"></image>
					</view>
					<view slot="rightContent">共{{goodsList.length}}件</view>
					<view slot="right" class="iconfont icon-you1"></view>
				</uniListItem>
				<uniListItem title="商品总价" :showArrowIcon="true">
					<view slot="rightContent">
						<price color="text-dark">{{totalPrice}}</price>
					</view>
				</uniListItem>
				<uniListItem title="运费" :showArrowIcon="true">
					<view slot="rightContent">包邮</view>
				</uniListItem>
				<uniListItem title="优惠券" extraWidth="50%" @click="openOrderCoupon">
					<view slot="rightContent" :class="couponCount > 0 ? 'main-text-color':'text-light-muted'">
						<text v-if="coupon.id > 0">{{coupon.type === 0 ? '-'+coupon.value+'元' : '打'+coupon.value+'折'}}</text>
						<text class="font" v-else>{{couponCount === 0 ? '没有可用优惠券':couponCount+'张可用'}}</text>
					</view>
					<view slot="right" class="iconfont icon-you1"></view>
				</uniListItem>
				<uniListItem :showArrowIcon="true">
					<text class="main-text-color">小计</text>
					<view slot="rightContent">
						<price>{{price}}</price>
					</view>
				</uniListItem>
				<myline></myline>
				<uniListItem  title="发票" extraWidth="50%" @click="openOrderInvoice">
					<view slot="rightContent">电子发票-个人</view>
					<view slot="right" class="iconfont icon-you1"></view>
				</uniListItem>
				
				<!-- 底部导航 -->
				<view class="position-fixed d-flex a-center border right-0 bottom-0 left-0 bg-white p-2">
					<view class="row a-center font-md ml-auto">合计：<price>{{price}}</price></view>
					<view class="px-3 py-1 ml-2 text-white" :class="loading? 'bg-secondary':'main-bg-color'" hover-class="main-bg-hover-color" style=" border-radius: 80rpx;" @click="openPayMethods">{{loading? '加载中':'去支付'}}</view>
				</view>
			</view>
		</view>
		
		
		
		
		
	</view>
</template>

<script>
	import {mapGetters,mapState} from 'vuex'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	
	export default {
		components:{
			uniListItem,
			price
		},
		data() {
			return {
				loading:false,
				path:false,
				items:[],
				couponCount:0,
				coupon:{
					id:0,
					type:0,
					value:0
				},
				order_id:0
			}
		},
		onLoad(e) {
			if(!e.detail){
				uni.showToast({
					title:'请选择要付款的商品',
					icon:'none'
				})
				return uni.navigateBack({
					delta:1
				})
			}
			//路由传参，cart传来的数据
			this.items = JSON.parse(e.detail)
			
			if(this.defaultPath){
				this.path = this.defaultPath[0]
			}
			//创建监听 选择收货地址事件$on--$emit(去收货地址页拿数据并返回)
			uni.$on('choosePath',(res) =>{
				this.path = res
			})
			//创建监听 选择优惠卷事件$on--$emit(去优惠券页拿数据并返回)
			uni.$on('couponUser',(res) =>{
				this.coupon = res
			})
			//计算当前价格有多少张可用优惠券
			this.getCouponCount()
		},
		onUnload() {
			// 关闭监听 选择收货地址事件
			uni.$off('choosePath',(e)=>{
				console.log('关闭监听',e)
			})
			// 关闭监听 选择优惠卷事件
			uni.$off('couponUser',(e)=>{
				console.log('关闭监听',e)
			})
		},
		computed:{
			...mapState({
				list:state => state.cart.list
			}),
			...mapGetters([
				'defaultPath','totalPrice'
			]),
			//根据cart传来的id组转化出商品列表
			goodsList(){
				return this.items.map(id =>{
					return this.list.find(v => v.id === id)
				})
			},
			//最终价格
			price(){
				//无优惠卷
				if(this.coupon.id === 0){
					return this.totalPrice
				}
				//toFixed(2)保留2位小数
				return (this.coupon.type === 0 ? this.totalPrice - this.coupon.value :( this.totalPrice*this.coupon.value/10).toFixed(2))
			}
		},
		onShow() {
			//如果已经提交过订单，重定向到订单详情页
			if(this.order_id > 0){
				uni.redirectTo({
					url:'../order-detail/order-detail?id='+this.order_id
				})
			}
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
			//下单去支付
			openPayMethods(){
				//添加标识支付状态，防止多次点击支付
				if(this.loading){
					return;
				}
				//判断是否有收货地址
				if(!this.path){
					return uni.showToast({
						title:'请选择收货地址',
						icon:'none'
					})
				}
				let options = {
					user_addresses_id:this.path.id,
					items:this.items.join(',')
				}
				//是否有优惠券
				if(this.coupon.id > 0){
					options.coupon_user_id = this.coupon.id
				}
				//添加标识支付状态，防止多次点击支付
				this.loading = true
				
				this.$H.post('/order',options,{
					token:true
				}).then(res=>{
					this.loading = false
					//跳转支付页面
					uni.navigateTo({
						url:'../pay-methods/pay-methods?detail='+JSON.stringify({
							id:res.id,
							price:res.total_price
						})
					})
					//保存订单id
					this.order_id = res.id
					//通知购物车更新数据$emit->App.vue
					uni.$emit('updateCart')
				}).catch(err=>{
					this.loading = false
					uni.showToast({
						title:'创建订单失败',
						icon:'none'
					})
				})
			},
			//选择优惠券
			openOrderCoupon(){
				uni.navigateTo({
					url:'../order-coupon/order-coupon?detail='+JSON.stringify({price:this.totalPrice})
				})
			},
			//计算当前价格有多少张可用优惠券
			getCouponCount(){
				this.$H.post('/coupon_count',{
					price:this.totalPrice
				},{
					token:true
				}).then(res=>{
					this.couponCount = 0
				}).catch(err=>{
					uni.showToast({
						title:'获取可用优惠券数量失败',
						icon:'none'
					})
				})
			}
		}
	}
</script>

<style>

</style>
