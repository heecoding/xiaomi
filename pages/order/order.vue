<template>
	<view style="background-color: #F5F5F5;">
		<!-- 头部导航 -->
		<view class="d-flex bg-white a-center font-md text-muted border-top border-bottom border-light-secondary">
			<view class="flex-1 d-flex a-center j-center py-2" v-for="(item,index) in tabBars" :key="index" :class="tabIndex === index ? 'tabActive' : ''" @tap="changeTab(index)">{{item.name}}</view>
		</view>
		
		<!-- 订单列表 -->
		<block v-for="(tab,tabI) in tabBars" :key="tabI">
			<view class="position-relative" v-show="tabI === tabIndex" style="min-height: 450rpx;">
				<template v-if="tab.list.length > 0">
					<!-- 有订单内容 -->
					<block v-for="(item,index) in tab.list" :key="index" >
						<!-- 监听，刷新列表页$emit->update -->
						<orderList :item="item" :index="index" @update="getOrderList"></orderList>
					</block>
				</template>
				<template v-else>
					<!-- 无订单内容  默认 -->
					<noThing :icon="tab.nothing" :msg="tab.msg"></noThing>
				</template>
				
			</view>
		</block>
		
		
		<view class="text-center main-text-color font-md font-weight mt-5">为你推荐</view>
		<view class="position-relative d-flex a-center j-center text-secondarymb-3 pt-3 pb-2">
			<view style="background: #F5F5F5; z-index: 2;" class="px-2 position-absolute">买的人还买了</view>
			<view class="position-absolute bg-dark" style="height: 1rpx; left: 0; right: 0; background: #dddddd;"></view>
		</view>
		<!-- 猜你喜欢 -->
		<view class="row j-sb bg-white">
			<commonList v-for="(item,index) in loveList" :key="index" :item="item" :index="index"></commonList>
		</view>
	</view>
</template>

<script>
	import commonList from '@/components/common/commonList.vue'
	import noThing from '@/components/common/no-thing.vue'
	import orderList from '@/components/order/order-list.vue'
	
	export default {
		components:{
			commonList,
			noThing,
			orderList
		},
		data() {
			return {
				tabIndex:0,
				tabBars:[
					{ 
						name:'全部',
						id:0,
						nothing:'noPay',
						msg:'您还没有订单',
						key:'all',
						list:[]
					},
					{
						name:'待付款',
						id:1,
						nothing:'noPay',
						msg:'您还没有待付款订单',
						key:'paying',
						list:[]
					},
					{
						name:'待收货',
						id:2,
						nothing:'noReceiving',
						msg:'您还没有待收货订单',
						key:'receiving',
						list:[]
					},
					{
						name:'待评价',
						id:3,
						nothing:'noComment',
						msg:'您还没有待评价订单',
						key:'reviewing',
						list:[]
					}
				],
				loveList: [
					{
						cover: '/static/images/s6.jpg',
						title: 'Redmi K30 4G',
						desc: '120Hz流速屏，全速热爱',
						oprice: 2699,
						pprice: 1399
					},
					{
						cover: '/static/images/s7.jpg',
						title: 'Redmi K30 4G',
						desc: '120Hz流速屏，全速热爱',
						oprice: 2699,
						pprice: 1399
					},
					{
						cover: '/static/images/s8.jpg',
						title: 'Redmi K30 4G',
						desc: '120Hz流速屏，全速热爱',
						oprice: 2699,
						pprice: 1399
					},
					{
						cover: '/static/images/s9.jpg',
						title: 'Redmi K30 4G',
						desc: '120Hz流速屏，全速热爱',
						oprice: 2699,
						pprice: 1399
					}
				]
			}
		},
		computed:{
			key(){
				return this.tabBars[this.tabIndex].key
			}
		},
		onLoad(e) {
			if(e.tabIndex){
				this.tabIndex = parseInt(e.tabIndex)
			}
			this.getHostList()
		},
		onShow() {
			this.getOrderList()
		},
		methods: {
			// 切换选项卡
			changeTab(index){
				this.tabIndex = index
				this.getOrderList()
			},
			getHostList(){
				//获取热门推荐数据
				this.$H.get('/goods/hotlist').then(res=>{
					this.hotList = res.map(v=>{
						return {
							id: v.id,
							cover: v.cover,
							title: v.title,
							desc: v.desc,
							oprice: v.min_oprice,
							pprice: v.min_price
						}
					})
				})
			},
			getOrderList(){
				let index = this.tabIndex
				this.$H.post('/order/'+this.key,{},{
					token:true
				}).then(res =>{
					this.tabBars[index].list = res.map(item =>{
						let order_item = item.order_items.map(v =>{
							let attrs = []
							if(v.skus_type === 1 && v.goods_skus && v.goods_skus.skus){
								let skus = v.goods_skus.skus
								for(let k in skus){
									attrs.push(skus[k].value)
								}
							}
							return {
								id:v.goods_id,
								cover:v.goods_item.cover,
								title:v.goods_item.title,
								pprice:v.price,
								attrs:attrs.join(','),
								num:v.num
							}
						})
						return {
							id:item.id,
							createTime:item.create_time,
							status:this.$U.formatStatus(item),
							orderItem:order_item,
							totalPrice:item.total_price
						}
					})
				}).catch(err =>{
					console.log('huoqushibai')
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
