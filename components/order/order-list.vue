<template>
	<view class="bg-white" @click.stop="openDetail">
		<myline></myline>
		<!-- 头部 -->
		<view class="d-flex a-center p-2 border-bottom border-light-secondary">
			<text class="text-light-muted font-md">{{item.createTime}}</text>
			<text class="main-text-color ml-auto font-md">{{item.status}}</text>
		</view>
		<!-- 中间 -->
		<view class="px-2">
			<block v-for="(order,orderIndex) in item.orderItem" :key="orderIndex">
				<orderListItem :item="order" :index="orderIndex"></orderListItem>
			</block>
		</view>
		<!-- 底部 -->
		<view class="d-flex a-center p-2">
			<text class="text-dark font-md ml-auto">共{{item.orderItem.length}}间商品，合计：￥{{item.totalPrice}}</text>
		</view>
		<view class="d-flex a-center px-3 pb-2 w-100" style="flex-direction: row-reverse; box-sizing: border-box;">
			<template v-if="item.status === '待支付'">
				<commonButton @click="openPayMethods">去支付</commonButton>
				<commonButton @click="closeOrder">取消订单</commonButton>
			</template>
			<template v-else-if="item.status === '待发货'">
				<commonButton>提醒发货</commonButton>
				<commonButton @click="applyRefund">申请退款</commonButton>
			</template>
			<template v-else-if="item.status === '待收货'">
				<commonButton @click="openLogistics">查看物流</commonButton>
				<commonButton @click="received">确认收货</commonButton>
			</template>
			<template v-else>
				<commonButton @click="openDetail">查看详情</commonButton>
			</template>
		</view>
	</view>
</template>

<script>
	import orderListItem from '@/components/order/order-list-item.vue'
	import commonButton from '@/components/common/common-button.vue'
	
	export default{
		components:{
			orderListItem,
			commonButton
		},
		props:{
			item:Object,
			index:Number
		},
		methods:{
			//去支付
			openPayMethods(){
				//跳转支付页面
				uni.navigateTo({
					url:'../pay-methods/pay-methods?detail='+JSON.stringify({
						id:this.item.id,
						price:this.item.total_price
					})
				})
			},
			//取消订单
			closeOrder(){
				uni.showModal({
					content:'是否要取消该订单？',
					success: (res) => {
						if(res.confirm){
							uni.showLoading({
								title:'取消订单中...',
								mask:false
							})
							this.$H.post('/closeorder/'+this.item.id,{},{
								token:true
							}).then(res =>{
								uni.hideLoading()
								uni.showToast({
									title:'取消订单成功',
									icon:'none'
								})
								//返回时再次请求数据
								this.$emit('update')
							}).catch(err =>{
								uni.hideLoading()
							})
						}
					}
				})
			},
			//申请退款
			applyRefund(){
				uni.navigateTo({
					url:'../../pages/order-refund/order-refund?detail='+JSON.stringify({
						id:this.item.id
					})
				})
			},
			
			//查看物流
			openLogistics(){
				uni.navigateTo({
					url:'/pages/logistics-detail/logistics-detail?detail='+JSON.stringify({
						id:this.item.id
					})
				})
			},
			//确认收货
			received(){
				uni.showModal({
					title:'是否要确认收货',
					success: (res) => {
						if(res.confirm){
							uni.showLoading({
								title:'确认收获中...',
								mask:false
							})
							this.$H.post('/order/'+this.item.id+'/received',{},{
								token:true
							}).then(res =>{
								uni.hideLoading()
								uni.showToast({
									title:'确认收获成功',
									icon:'none'
								})
								//通知order页刷新数据
								this.$emit('update')
								console.log(res)
								
							}).catch(err =>{
								uni.hideLoading()
								uni.showToast({
									title:'确认收获失败',
									icon:"none"
								})
							})
						}
					}
				})
			},
			//查看详情
			openDetail(){
				uni.navigateTo({
					url:'/pages/order-detail/order-detail?id='+this.item.id
				})
			},
			//查看订单详情
			openOrderDetail(){
				uni.navigateTo({
					url:'/pages/order-detail/order-detail'
				})
			},
			//售后服务
			openAfterSale(){
				uni.navigateTo({
					url:'/pages/after-sale/after-sale'
				})
			}
		}
	}
</script>

<style>
</style>
