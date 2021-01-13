<template>
	<view class="animated fadeIn faster" style="background: #F5F5F5;">
		
		<loading-plus v-if="beforeReady"></loading-plus>
		
		<uni-nav-bar :rightText="isedit? '完成':'编辑'" title="购物车" statusBar :shadow="false" @click-right="isedit = !isedit" fixed></uni-nav-bar>
		<!-- 购物车为空 -->
		<view class="py-5 d-flex a-center j-center bg-white" v-if="disableSelectAll">
			<view class="iconfont icon-gouwuche text-light-muted" style="font-size: 50rpx;"></view>
			<text class="mx-2 text-light-muted">购物车是空的</text>
			<view class="px-2 py-1 border border-light-secondary rounded" hover-class="bg-light-secondary">
				去逛逛
			</view>
		</view>
		
		<!-- 购物车商品列表 -->
		<view class="px-2 bg-white" v-else>
			<view class="d-flex a-center py-3 border-bottom border-light-secondary" v-for="(item,index) in list" :key="index">
				<!-- 单选实现复选效果 -->
				<label class="radio d-flex a-center j-center flex-shrink" style="width: 80rpx; height: 100rpx;" @click="selectItem(index)">
					<!--错误提示[Vue warn]: Invalid prop: type check failed for prop "value". Expected String with value "10", got Number with value 10. 解决：强类型转换成字符串 (item.id+'') -->
					<radio :value="item.id+''" color="#FD6801" :checked="item.checked" />
				</label>
				<image :src="item.cover" class="border border-light-secondary rounded p-2 flex-shrink" style="height: 150rpx; width: 150rpx;" mode="widthFix"></image>
				<view class="flex-1 d-flex flex-column pl-2">
					<view class="text-dark" style="font-size: 35rpx;">
						{{item.title}}
					</view>
					
					<!-- 编辑状态下 规格属性变化 -->
					<view class="d-flex text-light-muted mb-1" :class="isedit? 'p-1 bg-light-secondary mb-2':''" @tap.stop="showPopup(index,item)" v-if="item.skus_type === 1">
						{{item.skusText}}
						<view class="iconfont icon-icon-arrow-bottom2 font ml-auto" v-if="isedit"></view>
					</view>
					<view class="mt-auto d-flex j-sb">
						<price>{{item.pprice}}</price>
						<view class="a-self-end">
							<!-- @change="item.num = $event" -->
							<uniNumberBox :min="item.minnum" :max="item.maxnum" :value="item.num+''" @change="changeNum($event,item,index)"></uniNumberBox>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="text-center main-text-color font-md font-weight mt-5">为你推荐</view>
		<view class="position-relative d-flex a-center j-center text-secondary mb-3 pt-3">
			<view style="background: #F5F5F5; z-index: 2;" class="px-2 position-absolute">买的人还买了</view>
			<view class="position-absolute bg-dark" style="height: 1rpx; left: 0; right: 0; background: #dddddd;"></view>
		</view>
		<!-- 猜你喜欢 -->
		<view class="row j-sb bg-white">
			<commonList v-for="(item,index) in hotList" :key="index" :item="item" :index="index"></commonList>
		</view>
		
		<!-- 占位 -->
		<view style="height: 100rpx; background: #F5F5F5;"></view>
		<!-- 合计 -->
		<view class="d-flex a-center position-fixed left-0 right-0 bottom-0 border-top border-light-secondary a-stretch bg-white" style="height: 100rpx; z-index: 999;">
			<label class="radio d-flex a-center j-center flex-shrink" style="width: 120rpx;" @click="doSelectAll">
				<radio color="#FD6801" :checked="checkedAll"  :disabled="disableSelectAll" />
			</label>
			<!-- 判断处于编辑状态 并对应显示渲染-->
			<template v-if="!isedit">
				<view class="flex-1 d-flex a-center j-center font-md">
					合计<price>{{totalPrice}}</price>
				</view>
				<view class="flex-1 d-flex a-center j-center main-bg-color text-white font-md" hover-class="main-bg-hover-color" @tap="orderConfirm">
					结算
				</view>
			</template>
			<template v-else>
				<view class="flex-1 d-flex a-center j-center font-md main-bg-color text-white">
					移入收藏
				</view>
				<view class="flex-1 d-flex a-center j-center bg-danger text-white font-md" hover-class="main-bg-hover-color" @tap="doDelGoods">
					删除
				</view>
			</template>
		</view>
		
		<!-- 属性筛选 -->
		<sku-popup></sku-popup>
	</view>
</template>

<script>
	import loading from '@/common/mixin/loading.js'
	
	import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue'
	import price from '@/components/common/price.vue'
	import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue'
	import commonList from '@/components/common/commonList.vue'
	import skuPopup from '@/components/cart/sku-popup.vue'
		
	export default{
		mixins:[loading],
		components:{
			uniNavBar,
			price,
			uniNumberBox,
			commonList,
			skuPopup
		},
		data(){
			return{
				isedit:false,
				hotList: []
			}
		},
		onLoad(){
			this.getData()
		},
		beforeDestroy() {
			//卸载添加购物车的全局监听
			uni.$off('updateCart')
		},
		onPullDownRefresh() {
			this.getData()
		},
		computed:{
			...mapState({
				list:state => state.cart.list,
				selectedList:state =>state.cart.selectedList
			}),
			...mapGetters([
				'checkedAll','totalPrice','disableSelectAll'
			])
		},
		methods:{
			changeNum(e,item,index){
				//数据和数据库一样则不需要改变
				if(item.num === e) return;
				uni.showLoading({
					title:'加载中...'
				})
				//改变商品数量并使数据保存到数据库
				this.$H.post('/cart/updatenumber/'+item.id,{ num:e },{
					token:true
				}).then(res=>{
					//视图显示
					item.num = e
					uni.hideLoading()
				})
			},
			...mapActions([
				'doSelectAll','doDelGoods','doShowPopup','updateCartList'
			]),
			...mapMutations([
				'selectItem','initCartList','unSelectAll'
			]),
			//订单结算
			orderConfirm(){
				if(this.selectedList.length === 0){
					return uni.showToast({
						title:'请选择要结算的商品',
						icon:'none'
					})
				}
				uni.navigateTo({
					url:'/pages/order-confirm/order-confirm?detail='+JSON.stringify(this.selectedList)
				})
			},
			showPopup(index,item){
				//非编辑状态下禁止操作
				if(!this.isedit){
					return;
				}
				//根据点击去拿数据库里的数据，减少数据展示
				this.$H.get('/cart/'+item.id+'/sku',{},{
					token:true
				}).then(res=>{
					//规格选项
					let check = item.skusText.split(',')
					res.selects = res.goods_skus_card.map((v,i)=>{
						let selected = 0
						let list = v.goods_skus_card_value.map((v1,i1)=>{
							if(check[i] === v1.value){
								selected = i1
							}
							return {
								id: v1.id,
								name: v1.value
							}
						})
						return {
							id: v.id,
							title: v.name,
							selected: selected,
							list: list
						}
					})
					//商品规格价格
					res.goods_skus.forEach(item=>{
						let arr = []
						for(let key in item.skus){
							arr.push(item.skus[key].value)
						}
						//组织对比 （计算属性）
						item.skusText = arr.join(',')
					})
					if(this.isedit){
						console.log(res)
						this.doShowPopup({
							index,
							data:res
						})
					}
				})
			},
			//获取数据
			getData(){
				//获取购物车数据
				this.updateCartList().then(res =>{
					uni.stopPullDownRefresh()
				}).catch(err =>{
					uni.stopPullDownRefresh()
				})
				// this.$H.get('/cart',{},{
				// 	token:true,
				// 	toast:false
				// }).then(res=>{
				// 	//取消选中状态
				// 	this.unSelectAll()
				// 	//赋值
				// 	this.initCartList(res)
				// 	uni.stopPullDownRefresh()
				// }).catch(err =>{
				// 	uni.stopPullDownRefresh()
				// })
				
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
			}
		}
	}
</script>

<style>
</style>
