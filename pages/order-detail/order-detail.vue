<template>
	<view>
		<view class="main-bg-color text-white p-4 d-flex a-end j-sb" style="height: 300rpx;">
			<view class="mb-3">
				<view class="font-lg">{{status}}</view>
				<view class="font">{{timeDownText}}</view>
			</view>
			<view class="iconfont icon-daishouhuo line-h mb-3" style="font-size: 100rpx;"></view>
		</view>
		<view class="p-3 bg-white">
			<view class="text-light-muted">
				<text class="font-md text-dark mr-2">{{address.name}}</text>
				{{address.phone}}
			</view>
			<view class="text-light-muted font-md">
				{{path}}
			</view>
		</view>
		<myline></myline>
		<view class="px-2">
			<block v-for="(item,index) in order_items" :key="index">
				<orderListItem :item="item" :index="index"></orderListItem>
			</block>
		</view>
		<myline></myline>
		<uniListItem>
			<text class="font-md text-light-muted">商品总价</text>
			<view slot="right" class="font-md text-light-muted">{{zprice}}</view>
		</uniListItem>
		<uniListItem>
			<text class="font-md text-light-muted">快递</text>
			<view slot="right" class="font-md text-light-muted">包邮</view>
		</uniListItem>
		<uniListItem>
			<text class="font-md text-light-muted">优惠卷</text>
			<view slot="right" class="font-md text-light-muted">{{coupon}}</view>
		</uniListItem>
		<uniListItem>
			<text class="font-md main-text-color">实际付款</text>
			<view slot="right" class="font-md text-light-muted">
				<price>{{total_price}}</price>
			</view>
		</uniListItem>
		<myline></myline>
		<card headTitle="订单信息">
			<uniListItem title="订单编号">
				<view slot="right" class="font-md text-light-muted">{{no}}</view>
			</uniListItem>
		</card>
		<card headTitle="退款相关">
			<uniListItem title="申请退款">
				<view v-if="extra" slot="right" class="font-md text-light-muted">{{extra.refund_reason}}</view>
			</uniListItem>
		</card>
		
		<view v-if="status === '待支付' || status === '待发货' || status === '待收货'" style="height: 80rpx;"><!-- 占位 --></view>
		<view  v-if="status === '待支付' || status === '待发货' || status === '待收货'" class="position-fixed bottom-0 left-0 right-0 d-flex a-center bg-white px-3" style="height: 80rpx; flex-direction: row-reverse; box-sizing: border-box;">
			<template v-if="status === '待支付'">
				<commonButton @click="openPayMethods">去支付</commonButton>
				<commonButton @click="closeOrder">取消订单</commonButton>
			</template>
			<template v-else-if="status === '待发货'">
				<commonButton>提醒发货</commonButton>
				<commonButton @click="applyRefund">申请退款</commonButton>
			</template>
			<template v-else-if="status === '待收货'">
				<commonButton @click="openLogistics">查看物流</commonButton>
				<commonButton @click="received">确认收货</commonButton>
			</template>
		</view>
	</view>
</template>

<script>
	var timer = null
	import orderListItem from '@/components/order/order-list-item.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	import card from '@/components/common/card.vue'
	import commonButton from '@/components/common/common-button.vue'
	import $T from '@/common/lib/time.js'
	
	export default {
		components:{
			orderListItem,
			uniListItem,
			price,
			card,
			commonButton
		},
		data() {
			return {
				id: 612,
				no: "20210104162107694429",
				address: {
					province: "北京",
					city: "北京市",
					district: "大兴区",
					address: "11",
					zip: 222,
					name: "QQ",
					phone: "13511111111"
				},
				total_price: 0,
				remark: "",
				paid_time: 1609748475,
				payment_method: "alipay",
				payment_no: "2021010422001401561402331139",
				refund_status: "applied",
				ship_status: "pending",
				extra: {
					refund_reason: "sadasdasdsadsa"
				},
				create_time: "",
				update_time: "",
				reviewed: 0,
				order_items:[],
				couponUserItem: [],
				end_time:0,
				timeDown:''
			}
		},
		computed:{
			//总价
			zprice(){
				let p = 0
				this.order_items.forEach(item =>{
					p += item.pprice * item.num
				})
				return p.toFixed(2)
			},
			//收货地址
			path(){
				let {province,city,district,address} = this.address
				return `${province} ${city} ${district} ${address}`
			},
			//订单状态
			status(){
				return this.$U.formatStatus({
					paid_time:this.paid_time,
					refund_status:this.refund_status,
					ship_status:this.ship_status
				})
			},
			// couponValue(){
			// 	return this.couponUserItem.coupon.value
			// },
			//优惠券
			coupon(){
				if(Array.isArray(this.couponUserItem) && this.couponUserItem.length === 0){
					return '未使用'
				}
				let {type,value} = this.couponUserItem.coupon
				if(type === 0){
					return '-￥'+value
				}else{
					return '打'+value+'折'
				}
			},
			//订单时间显示
			timeDownText(){
				let msg = ''
				switch(this.status){
					case '待支付':
					msg = '取消'
						break;
					case '待收货':
					msg = '确认'
						break;
					case '待发货':
					return '等待商家发货'
						break;
					case '退款中':
					return '等待商家审核'
						break;
					case '已签收':
					return '订单已签收'
						break;
				}
				if(msg !== '' && this.timeDown !== ''){
					return `还差${this.timeDown} 自动${msg}`
				}
				return ''
			}
		},
		onLoad(e) {
			if(!e.id){
				uni.showToast({
					title:'订单不存在',
					icon:'none'
				})
				return uni.navigateBack({
					delta:1
				})
			}
			this.id = e.id
		},
		onUnload() {
			if(timer){
				clearInterval(timer)
			}
		},
		onShow() {
			//获取订单详情
			this.getData()
		},
		methods: {
			getData(){
				this.$H.get('/order/'+this.id,{},{
					token:true
				}).then(res =>{
					this.end_time = res.end_time ? res.end_time : 0
					this.id = res.id
					this.no = res.no
					this.address = res.address
					this.total_price = res.total_price
					this.remark = res.remark
					this.paid_time = res.paid_time
					this.payment_method = res.payment_method
					this.payment_no = res.payment_no
					this.refund_status = res.refund_status
					this.ship_status = res.ship_status
					this.extra = res.extra
					this.create_time = res.create_time
					this.update_time = res.update_time
					this.reviewed = res.reviewed
					//整理商品类表数据
					let order_items = res.orderItems.map(v =>{
						let attrs = []
						if(v.skus_type === 1 && v.goodsSkus && v.goodsSkus.skus){
							let skus = v.goodsSkus.skus
							for(let k in skus){
								attrs.push(skus[k].value)
							}
						}
						return {
							id:v.goods_id,
							cover:v.goodsItem.cover,
							title:v.goodsItem.title,
							pprice:v.price,
							attrs:attrs.join(','),
							num:v.num
						}
					})
					//定时器（未支付订单）
					this.openTimeDown()
					this.order_items = order_items
					this.couponUserItem = res.couponUserItem
				})
			},
			//开启定时器
			openTimeDown(){
				if(timer){
					clearInterval(timer)
				}
				//自动确认支付和收货
				if(this.status === '待支付' || this.status === '待收货'){
					timer = setInterval(()=>{
						let now = (new Date().getTime())/1000
						if(now > this.end_time){
							uni.switchTab({
								url:'/pages/index/index'
							})
							uni.showToast({
								title: this.status === '待支付'? '订单已关闭':'订单已确认',
								icon:'none'
							})
							return clearInterval(timer)
						}
						//倒计时
						this.timeDown = $T.timeDown(this.end_time)
					},1000)
				}
			},
			//去支付
			openPayMethods(){
				//跳转支付页面
				uni.navigateTo({
					url:'/pages/pay-methods/pay-methods?detail='+JSON.stringify({
						id:this.id,
						price:this.total_price
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
							this.$H.post('/closeorder/'+this.id,{},{
								token:true
							}).then(res =>{
								uni.hideLoading()
								uni.navigateBack({
									delta:1
								})
								uni.showToast({
									title:'取消订单成功',
									icon:'none'
								})
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
						id:this.id
					})
				})
			},
			
			//查看物流
			openLogistics(){
				uni.navigateTo({
					url:'/pages/logistics-detail/logistics-detail?detail='+JSON.stringify({
						id:this.id
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
							this.$H.post('/order/'+this.id+'/received',{},{
								token:true
							}).then(res =>{
								uni.hideLoading()
								uni.navigateBack({
									delta:1
								})
								uni.showToast({
									title:'确认收获成功',
									icon:'none'
								})
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
					url:'/pages/order-detail/order-detail?id='+this.id
				})
			}
		}
	}
</script>

<style>

</style>
