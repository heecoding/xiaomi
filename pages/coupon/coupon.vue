<template>
	<view class="p-3">
		<coupon v-for="(item,index) in list" :key="index" :item="item" :index="index" @click="getCoupon(item)">
			<text v-if="item.status">已失效</text>
			<text v-else-if="item.disabled">已领取</text>
			<text v-else>马上领取</text>
		</coupon>
		<myline />
		<!-- 上拉加载更多 -->
		<view v-if="list.length > 0" class="d-flex a-center j-center text-light-muted font-md py-3">{{loadingText}}</view>
		<no-thing v-else msg="暂无优惠卷"></no-thing>
	</view>
</template>

<script>
	import coupon from '@/components/order-coupon/coupon.vue'
	import noThing from '@/components/common/no-thing.vue'
	export default {
		components:{
			coupon,
			noThing
		},
		data() {
			return {
				page:1,
				list:[],
				loadingText:'上拉加载更多'
			}
		},
		onLoad() {
			this.getData()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getData(true).then(res=>{
				uni.stopPullDownRefresh()
			}).catch(err=>{
				uni.stopPullDownRefresh()
			})
			
		},
		//上拉加载
		onReachBottom() {
			if(this.loadingText !== '上拉加载更多'){
				return;
			}
			this.page++
			this.loadingText = '加载中...'
			this.getData()
		},
		methods: {
			//获取数据
			getData(refresh = false){
				return new Promise((resolve,reject)=>{
					this.$H.get('/coupon/'+this.page,{},{
						token:true
					}).then(res=>{
						let list = res.map(item=>{
							let time =(new Date()).getTime()
							let status = (item.end_time > time/1000) || item.status
							return {
								id:item.id,
								title:item.name,
								start_time:item.start_time,
								end_time:item.end_time,
								price:item.value,
								desc:item.desc,
								status:status,
								disabled:(item.coupon_user.length > 0)
							}
						})
						this.list = refresh ?[ ...list] : [...this.list,...list]
						this.loadingText = res.length === 10 ? '上拉加载更多' : '没有更多了'
						resolve(res)
					}).catch(err=>{
						this.page--
						reject(err)
					})
				})
			},
			//领取优惠卷
			getCoupon(item){
				this.$H.post('/getcoupon/'+item.id,{},{
					token:true
				}).then(res=>{
					//设为已领取状态
					item.disabled = true
					uni.showToast({
						title:'领取成功',
						icon:'none'
					})
				})
			}
		}
	}
</script>

<style>

</style>
