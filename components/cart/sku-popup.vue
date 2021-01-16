<template>
	<!-- 属性筛选 -->
	<commonPopup :popupClass="popupShow" @hide="doHidePopup">
		<!-- 商品图片 -->
		<view class="d-flex a-center" style="height: 275rpx;">
			<image :src="popupData.cover" mode="widthFix" style="width: 180rpx; height: 180rpx;" class="border rounded"></image>
			<view class="pl-2">
				<price priceSize="font-lg" unitSize="font" v-if="popupData.goods_skus">{{showPrice}}</price>
				<view>
					{{checkedSkus}}
				</view>
			</view>
		</view>
		<!-- 表单 -->
		<scroll-view scroll-y class="w-100" style="height: 660rpx;">
			<card :headTitle="itemS.title" :headTitleWWeight="false" :headBorderBottom="false" v-for="(itemS, index) in popupData.selects" :key="index">
				<ZradioGroup :radioLabel="itemS" :selected.sync="itemS.selected"></ZradioGroup>
			</card>
			<view class="d-flex j-sb a-center p-2 border-top border-light-secondary">
				<text>购买数量</text>
				<uni-number-box v-if="popupData.item" :min="1" :max="maxStock" :value="popupData.item.num" @change="popupData.item.num = $event"></uni-number-box>
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
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import commonPopup from '@/components/common/common-popup.vue'
	import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue'
	import card from '@/components/common/card.vue'
	import ZradioGroup from '@/components/common/radio-group.vue'
	import price from '@/components/common/price.vue'
	export default{
		components:{
			commonPopup,
			uniNumberBox,
			card,
			ZradioGroup,
			price
		},
		computed:{
			...mapState({
				popupShow:state => state.cart.popupShow,
				popupData:state =>state.cart.popupData
			}),
			// 选中的Skus
			checkedSkus(){
				if(!Array.isArray(this.popupData.selects) && !this.popupData.selects){
					return ''
				}
				//拿到选中的skus组成的字符串（组织后数据）
				let checkedSkus = this.popupData.selects.map(v=>{
					return v.list[v.selected].name
				})
				return checkedSkus.join(',')
			},
			// 选中的skus的索引
			checkedSkusIndex(){
				if(!Array.isArray(this.popupData.goods_skus) && !this.popupData.goods_skus){
					return -1
				}
				let index = this.popupData.goods_skus.findIndex((item) => {
					return item.skusText === this.checkedSkus
				})
				return index
			},
			//显示价格
			showPrice(){
				if(this.checkedSkusIndex < 0){
					return this.popupData.item ? this.popupData.item.pprice : 0.00
				}
				return this.popupData.goods_skus[this.checkedSkusIndex].pprice
			},
			//最大库存
			maxStock(){
				if(this.popupData){
					if(!Array.isArray(this.popupData.goods_skus)){
						return 100
					}
					return this.popupData.goods_skus[this.checkedSkusIndex].stock
				}
			}
		},
		methods:{
			...mapActions([
				'doHidePopup'
			])
		}
	}
</script>

<style>
</style>
