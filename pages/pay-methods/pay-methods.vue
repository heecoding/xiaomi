<template>
	<view>
		<view class="d-flex flex-column a-center j-center py-5 my-3">
			<text class="text-light-muted font-md">支付金额</text>
			<price priceSize="font-lg" uniSize="font-md">{{detail.totalPrice}}</price>
		</view>
		<view class="px-5">
			<radio-group @change="change">
				<label v-for="(item,index) in options" :key="index">
					<uniListItem :showExtraIcon="true" leftIconStyle="font-size:60rpx;" :leftIcon="item.icon" :title="item.title" :note="item.note">
						<radio slot="right" :value="item.value" color="#FD6801" :checked="payMethod === item.value" />
					</uniListItem>
				</label>
			</radio-group>
			<view class="text-white font-md w-100 py-2 rounded text-center mt-3" :class="loading ? 'bg-secondary':'main-bg-color'" hover-class="main-bg-hover-color" @click="submitPay">{{loading ? '支付中':'确认支付'}}</view>
		</view>
	</view>
</template>

<script>
	import price from '@/components/common/price.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	export default {
		components:{
			price,
			uniListItem
		},
		data() {
			return {
				loading:false,
				detail:{
					id:0,
					totalPrice:0
				},
				payMethod:'alipay',
				options:[]
			}
		},
		onLoad(e) {
			if(!e.detail){
				return uni.showToast({
					title:'支付失败',
					icon:'none'
				})
			}
			this.detail = JSON.parse(e.detail)
			
			// #ifdef APP-PLUS
			this.options = [{
				title:'支付宝支付',
				note:'推荐使用支付宝支付',
				icon:'icon-zhifubao text-primary',
				value:'alipay'
			},{
				title:'微信支付',
				note:'',
				icon:'icon-weixinzhifu text-success',
				value:'wxpay'
			}]
			// #endif
			
			// #ifdef MP-WEIXIN
			this.options = [{
				title:'微信支付',
				note:'推荐使用微信支付',
				icon:'icon-weixinzhifu text-success',
				value:'wxpay'
			}]
			// #endif
		},
		methods: {
			submitPay(){
				//防止重复支付
				if(this.loading) return;
				this.loading = true
				//条件编译
				// #ifdef APP-PLUS
				this.appPay()
				// #endif
				// #ifdef MP-WEIXIN
				this.weixinMpPay()
				// #endif
			},
			//微信小程序支付
			weixinMpPay(){
				//请求接口
				uni.login({
					success: (e) => {
						//拿到code去拿openid
						this.$H.get('/payment/'+this.detail.id+'/wxmppay/'+e.code,{},{
							token:true,
							native:true
						}).then(res =>{
							console.log(res.data)
							//发起小程序支付
							let payMentData = res.data
							uni.requestPayment({
							    timeStamp: payMentData.timeStamp,
							    nonceStr: payMentData.nonceStr,
							    package: payMentData.package,
							    signType: 'MD5',
							    paySign: payMentData.paySign,
							    success: function (result) {
									this.loading = false
									//重定向，防止重复支付
									uni.redirectTo({
										url:'../pay-result/pay-result'
									})
							        console.log('success:' + JSON.stringify(result));
							    },
							    fail: function (err) {
									this.loading = false
									uni.showModal({
							       	content:'支付失败原因为：'+res.errMsg,
									showCancel:false
							       })
							    },
								complete: () => {
									this.loading = false
								}
							})
						})
					},
					fail: (e) => {
						this.loading = false
						uni.showModal({
							title:'支付失败',
							showCancel:false
						})
						console.log('fail:' + JSON.stringify(err));
					}
				})
			},
			//app支付
			appPay(){
				this.$H.get('/payment/'+this.detail.id+this.payMethod,{},{
					token:true,
					native:true
				}).then(res =>{
					//官方支付接口
					uni.requestPayment({
					    provider: this.payMethod,
					    orderInfo: res.data, //微信、支付宝订单数据
					    success: (res) => {
							this.loading = false
							//重定向防止重复支付
							uni.redirectTo({
								url:'../pay-result/pay-result'
							})
					    },
					    fail: (err) => {
							this.loading = false
							uni.showModal({
								title:'支付失败',
								showCancel:false
							})
					        console.log('fail:' + JSON.stringify(err));
					    },
						complete: () => {
							this.loading = false
						}
					});
				}).catch(err =>{
					console.log('支付请求失败')
				})
			},
			//切换支付方式
			change(e){
				this.payMethod = e.detail.value
			}
		}
	}
</script>

<style>

</style>
