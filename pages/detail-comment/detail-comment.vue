<template>
	<view>
		<view class="p-2">
			<view class="d-flex a-center py-2 border-bottom border-light-secondary">
				<text class="text-muted">用户评价({{total}})</text>
				<text class="main-text-color ml-auto mr-1">{{(good_rate*100)+'%'}}</text>
				<text class="text-muted">满意</text>
			</view>
			<view class="d-flex flex-wrap pt-2" style="margin-right: -20rpx;">
				<view class="px-2 py border rounded mr-2 mb-2 cate-item" v-for="(item,index) in cateList" :key="index" :class="cateIndex === index? 'active':''"
				@tap="cateChange(index)"
				>
					{{item.name}}
				</view>
			</view>
		</view>
		
		<myline />
		
		<view class="p-2 d-flex a-start border-bottom border-light-secondary" v-for="(item,index) in list" :key="index">
			<image :src="item.user.avatar" style="width: 90rpx; height: 90rpx;" class="rounded main-bg-color flex-shrink" mode="widthFix"></image>
			<view class="pl-2 flex-1">
				<view class="d-flex a-center">
					<text class="font-md text-primary font-weight">{{item.user.nickname}}</text>
					<view class="iconfont icon-xinheart118 main-text-color ml-auto">
						<text class="pl-1 font">{{item.rating | rating}}</text>
					</view>
				</view>
				<view class="line-h-md font-md">
					{{item.review.data}}
				</view>
				<view class="row" v-if="item.review.image.length > 0">
					<view class="span24-8 px pb" v-for="(img,imgIndex) in item.review.image" :key="imgIndex">
						<image :src="img" mode="widthFix" style="height: 100rpx;"></image>
					</view>
				</view>
				<view class="d-flex a-center">
					<text class="text-light-muted mr-auto">{{item.review_time | formaTime}}</text>
					<view class="d-flex text-light-muted ml-auto a-center mr-1">
						{{item.goods_num}} <text class="iconfont icon-zan1 text-muted ml-1"></text>
					</view>
					<view class="d-flex text-light-muted a-center mr-1">
						666 <text class="iconfont icon-comment text-muted ml-1"></text>
					</view>
				</view>
				<!-- 客服回复 -->
				<view class="bg-light-secondary rounded p-2 d-flex flex-wrap a-center mt-1" v-for="(item2,index2) in item.extra" :key="index2">
					<template v-if="!item2.isuser">
						<text class="main-text-color">官方回复：</text>
						{{item2.data}}
						<view class="iconfont icon-zan1 text-light-muted line-h-md font ml-2 ml-auto">
							<text class="text-muted pl-1">赞客服{{item2.goods_num}}</text>
						</view>
					</template>
				</view>
			</view>
		</view>
		<myline />
		<!-- 上拉加载更多 -->
		<view class="d-flex a-center j-center text-light-muted font-md py-3">{{loadingText}}</view>
	</view>
</template>

<script>
	import myline from '@/components/common/myline.vue'
	import $T from '@/common/lib/time.js'
	
	export default {
		components:{
			myline
		},
		data() {
			return {
				id:0,
				cateIndex:0,
				cateList:[
					{ name:"全部",value:"" },
					{ name:"好评",value:"/good" },
					{ name:"中评",value:"/middle" },
					{ name:"差评",value:"/bad" }
				],
				total:0,
				good_rate:0,
				list:[],
				page:1,
				loadingText:'没有更多了'
			}
		},
		onLoad(e) {
			this.id = e.id
			//拿到上页id后做初始化数据
			this.__init()
		},
		//页面生命周期 监听触底拉动事件
		onReachBottom() {
			if(this.loadingText !== '上拉加载更多')return;
			console.log('上拉加载')
			this.page++
			this.loadingText = '加载中...'
			this.getData()
		},
		onPullDownRefresh() {
			this.getData((res) =>{
				uni.showToast({
					title:'刷新成功',
					icon:'none'
				})
				uni.stopPullDownRefresh()
			},true)
		},
		filters:{
			formaTime(value){
				return $T.gettime(value)
			},
			rating(value){
				if(value === 3){
					return '中评'
				}else if(value > 3){
					return '好评'
				}else{
					return '差评'
				}
			}
		},
		methods: {
			// 初始化数据
			__init(){
				this.getData()
			},
			//加载数据
			getData(callback = false,refresh = false){
				let value = this.cateList[this.cateIndex].value
				this.$H.get('/goods/'+this.id+'/comments'+value+'?'+this.page).then(res =>{
					this.total = res.total
					this.good_rate = res.good_rate
					//添/增 加
					this.list = !refresh? [...this.list,...res.list]:[...res.list]
					this.loadingText = res.list.length < 10 ? '没有更多数据了':'上拉加载更多'
					if(typeof callback === 'function'){
						callback(true)
					}
				})
			},
			cateChange(index){
				this.cateIndex = index;
				//跳转优化
				uni.showLoading({
					title:'加载中...'
				})
				this.getData((res) =>{
					uni.hideLoading()
					uni.showToast({
						title:'加载成功',
						icon:'none'
					})
				},true)
			}
		}
	}
</script>

<style>
.cate-item{
	background: #ffebea;
	color: #7b6d6c;
	border-color: #f4e0e1;
}
.cate-item.active{
	background: #ff6801!important;
	color: #FFFFFF!important;
	border-color: #de7232!important;
}
</style>
