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
							<coupon :item="item1" :index="index1" v-for="(item1,index1) in tab.list" :key="index1"></coupon>
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
				tabIndex:0,
				tabBars:[
					{ 
						name:'可用',
						id:0,
						nothing:'noPay',
						msg:'没有可用的优惠券',
						list:[
							{
								title:'立减100元',
								start_time:'2020-12-01',
								end_time:'2021-01-01',
								price:100,
								desc:'满300元使用',
								status:true,
								disabled:false
							},
							{
								title:'立减100元',
								start_time:'2020-12-01',
								end_time:'2021-01-01',
								price:50,
								desc:'满200元使用',
								status:true,
								disabled:true
							},
							{
								title:'立减100元',
								start_time:'2020-12-01',
								end_time:'2021-01-01',
								price:10,
								desc:'满100元使用',
								status:true,
								disabled:true
							}
						]
					},
					{
						name:'已失效',
						id:1,
						nothing:'noPay',
						msg:'您还没有优惠券',
						list:[
							{
								title:'立减100元',
								start_time:'2020-12-01',
								end_time:'2021-01-01',
								price:50,
								desc:'满200元使用',
								status:false,
								disabled:true
							},
							{
								title:'立减100元',
								start_time:'2020-12-01',
								end_time:'2021-01-01',
								price:10,
								desc:'满100元使用',
								status:false,
								disabled:true
							}
						]
					}
				]
			}
		},
		methods: {
			// 切换选项卡
			changeTab(index){
				this.tabIndex = index
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
