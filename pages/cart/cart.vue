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
					<view class="d-flex text-light-muted mb-1" :class="isedit? 'p-1 bg-light-secondary mb-2':''" @tap.stop="doShowPopup(index)">
						<text class="mr-1" v-for="(item2,index2) in item.attrs" :key="index2">{{item2.list[item2.selected].name}}</text>
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
		<view class="position-relative d-flex a-center j-center text-secondarymb-3 pt-3">
			<view style="background: #F5F5F5; z-index: 2;" class="px-2 position-absolute">买的人还买了</view>
			<view class="position-absolute bg-dark" style="height: 1rpx; left: 0; right: 0; background: #dddddd;"></view>
		</view>
		<!-- 猜你喜欢 -->
		<view class="row j-sb bg-white">
			<commonList v-for="(item,index) in loveList" :key="index" :item="item" :index="index"></commonList>
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
		<commonPopup :popupClass="popupShow" @hide="doHidePopup">
			<!-- 商品图片 -->
			<view class="d-flex a-center" style="height: 275rpx;">
				<image src="/static/images/s6.jpg" mode="widthFix" style="width: 180rpx; height: 180rpx;" class="border rounded"></image>
				<view class="pl-2">
					<price priceSize="font-lg" unitSize="font">1399</price>
					<view>
						<text class="mr-1" v-for="(attr,attrIndex) in popupData.attrs" :key="attrIndex">{{attr.list[attr.selected].name}}</text>
					</view>
				</view>
			</view>
			<!-- 表单 -->
			<scroll-view scroll-y class="w-100" style="height: 660rpx;">
				<card :headTitle="item.title" :headTitleWWeight="false" :headBorderBottom="false" v-for="(item, index) in popupData.attrs" :key="index">
					<ZradioGroup :radioLabel="item" :selected.sync="item.selected"></ZradioGroup>
				</card>
				<view class="d-flex j-sb a-center p-2 border-top border-light-secondary">
					<text>购买数量</text>
					<uniNumberBox :min="popupData.minnum" :max="popupData.maxnum" :value="popupData.num+''" @change="popupData.num = $event"></uniNumberBox>
				</view>
			</scroll-view>
			<!-- 按钮 -->
			<view
				class="main-bg-color text-white font-md d-flex j-center a-center"
				style="height: 100rpx; margin-left: -30rpx; margin-right: -30rpx;"
				hover-class="main-bg-hover-color"
				@tap.stop="doHidePopup"
			>
				确定
			</view>
		</commonPopup>
	</view>
</template>

<script>
	import loading from '@/common/mixin/loading.js'
	import ff from '@/common/mixin/loading.js'
	
	import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue'
	import price from '@/components/common/price.vue'
	import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue'
	import card from '@/components/common/card.vue'
	import ZradioGroup from '@/components/common/radio-group.vue'
	import commonPopup from '@/components/common/common-popup.vue'
	import commonList from '@/components/common/commonList.vue'
		
	export default{
		mixins:[loading],
		components:{
			uniNavBar,
			price,
			uniNumberBox,
			card,
			ZradioGroup,
			commonPopup,
			commonList
		},
		data(){
			return{
				isedit:false,
				loveList: [
					{
						cover: '/static/images/s6.jpg',
						title: 'Redmi K30 4G',
						desc: '120Hz流速屏，全速热爱',
						oprice: 2699,
						nprice: 1399
					},
					{
						cover: '/static/images/s7.jpg',
						title: 'Redmi K30 4G',
						desc: '120Hz流速屏，全速热爱',
						oprice: 2699,
						nprice: 1399
					},
					{
						cover: '/static/images/s8.jpg',
						title: 'Redmi K30 4G',
						desc: '120Hz流速屏，全速热爱',
						oprice: 2699,
						nprice: 1399
					},
					{
						cover: '/static/images/s9.jpg',
						title: 'Redmi K30 4G',
						desc: '120Hz流速屏，全速热爱',
						oprice: 2699,
						nprice: 1399
					}
				]
			}
		},
		computed:{
			...mapState({
				list:state => state.cart.list,
				popupShow:state => state.cart.popupShow
			}),
			...mapGetters([
				'checkedAll','totalPrice','disableSelectAll','popupData'
			])
		},
		methods:{
			changeNum(e,item,index){
				item.num = e
			},
			...mapActions([
				'doSelectAll','doDelGoods','doShowPopup','doHidePopup'
			]),
			...mapMutations([
				'selectItem'
			]),
			//订单结算
			orderConfirm(){
				uni.navigateTo({
					url:'/pages/order-confirm/order-confirm'
				})
			}
		}
	}
</script>

<style>
</style>
