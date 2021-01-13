<template>
	<view class="d-flex flex-column" style="height: 100%;">
		<!-- 选项卡 -->
		<view class="d-flex bg-white a-center font-md text-muted border-top border-bottom border-light-secondary flex-shrink">
			<view class="flex-1 d-flex a-center j-center py-2" v-for="(item,index) in tabBars" :key="index" :class="tabIndex === index ? 'tabActive' : ''" @tap="changeTab(index)">{{item.name}}</view>
		</view>
		
		<scroll-view scroll-y class="flex-1 " style="background-color: #F5F5F5;">
			<!-- 订单列表 -->
			<block v-for="(tab,tabI) in tabBars" :key="tabI">
				<view class="position-relative" v-show="tabI === tabIndex" style="min-height: 450rpx;">
					<template v-if="tab.list.length > 0">
						<view class="p-3">
							<coupon :item="item1" :index="index1" v-for="(item1,index1) in tab.list" :key="index1" @click="chooseCoupon(item1)">
								<text v-if="item.disabled">已使用</text>
								<text v-else>{{item.status ? '去使用': validText}}</text>
							</coupon>
						</view>
					</template>
					<template v-else>
						<!-- 无订单内容  默认 -->
						<noThing :icon="tab.nothing" :msg="tab.msg"></noThing>
					</template>
					
				</view>
			</block>
		</scroll-view>
		
	</view>
</template>

<script>
	import noThing from '@/components/common/no-thing.vue'
	import coupon from '@/components/order-coupon/coupon.vue'
	export default {
		components:{
			noThing,
			coupon
		},
		data() {
			return {
				price:0,
				tabIndex:0,
				tabBars:[
					{ 
						name:'可用',
						id:0,
						page:1,
						key:'valid',
						firstLoad:false,
						nothing:'noPay',
						msg:'没有可用的优惠券',
						list:[]
					},
					{
						name:'已失效',
						id:1,
						page:1,
						key:'invalid',
						firstLoad:false,
						nothing:'noPay',
						msg:'您还没有优惠券',
						list:[]
					}
				]
			}
		},
		onLoad(e) {
			//接收订单确定页传的price
			if(e.detail){
				this.price = (JSON.parse(e.detail)).price
			}
			this.getData()
		},
		computed:{
			//当前页码
			page(){
				return this.tabBars[this.tabIndex].page
			},
			//是否失效
			isvalid(){
				return this.tabBars[this.tabIndex].key
			},
			validText(){
				return this.tabIndex === 0 ? '不可用' : '已失效'
			}
		},
		methods: {
			getData(){
				//保存索引(异步)
				let index = this.tabIndex
				this.$H.get('/usercoupon/'+this.page+'/'+this.isvalid,{},{
					token:true
				}).then(res =>{
					this.tabBars[index].list = res.map(item=>{
						let status = (index === 0) && (this.price >= parseFloat(item.coupon.min_price))
						return {
								id:item.id,
								title:item.coupon.name,
								start_time:item.coupon.start_time,
								end_time:item.coupon.end_time,
								price:item.coupon.value,
								desc:item.coupon.desc,
								status:status,
								disabled:item.used,
								type:item.coupon.type
							}
					})
					this.tabBars[index].firstLoad = true
				}).catch(err =>{
					console.log(err)
				})
			},
			// 切换选项卡
			changeTab(index){
				this.tabIndex = index
				if(this.tabBars[index].firstLoad){
					this.getData()
				}
			},
			//选择优惠券
			chooseCoupon(item){
				//已使用
				if(item.disabled){
					return uni.showToast({
						title:'该优惠券已经使用过',
						icon:'none'
					})
				}
				//已失效/不可用
				if(!item.status){
					return uni.showToast({
						title:'该优惠券已经'+this.validText,
						icon:'none'
					})
				}
				uni.$emit('couponUser',{
					id:item.id,
					type:item.type,
					value:item.price
				})
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>
.tabActive{
		border-bottom: 5rpx solid #FD6801;
		color: #FD6801;
		margin-bottom: -1rpx;
	}
</style>
