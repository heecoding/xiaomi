<template>
	<view class="">
		<!-- 商品大图 -->
		<swiperImage :swiperData="banners" height="750" preview />
		<!-- 基础详情 -->
		<baseInfo :details="details" :show-price="showPrice" />
		<!-- 滚动商品 -->
		<scrollAttr :baseAttrs="baseAttrs" />
		<!-- 属性选择 -->
		<view class="p-2 ">
			<view class="rounded border bg-light-secondary">
				<uniListItem @click="show('attr')" v-if="details.sku_type === 1">
					<view class="d-flex">
						<text class="text-muted mr-2">已选</text>
						<text>{{checkedSkus}}</text>
					</view>
				</uniListItem>
				<uniListItem @click="show('express')">
					<view class="d-flex">
						<text class="text-muted mr-2">配送</text>
						<text class="mr-2">河南 郑州</text>
						<text class="main-text-color">现配</text>
					</view>
				</uniListItem>
				<uniListItem showArrow extraStyle="width:5%;" @click="show('service')">
					<view class="d-flex a-center flex-wrap">
						<view class="text-muted font d-flex a-center mr-2">
							<view class="iconfont icon-dui1 main-text-color"></view>
							<view class="d-flex flex-shrink">小米自营</view>
						</view>
						<view class="text-muted font d-flex a-center mr-2">
							<view class="iconfont icon-dui1 main-text-color"></view>
							<view class="d-flex flex-shrink">小米发货</view>
						</view>
						<view class="text-muted font d-flex a-center mr-2">
							<view class="iconfont icon-dui1 main-text-color"></view>
							<view class="d-flex flex-shrink">七天无理由退换</view>
						</view>
					</view>
				</uniListItem>
			</view>
		</view>
		<!-- 横向评论 -->
		<scrollComments :goods_id="details.id" :comments="comments" />
		<!-- 商品详情 -->
		<view class="py-2"><uParse className="u-Parse" :content="contextHtml" @preview="preview" @navigate="navigate"></uParse></view>
		<!-- 热门推荐 -->
		<card headTitle="猜你喜欢" :headTitleWWeight="false" :headBorderBottom="false">
			<view class="row j-sb">
				<commonList v-for="(item, index) in loveList" :key="index" :item="item" :index="index"></commonList>
			</view>
		</card>
		<!-- 底部操作 -->
		<bottomBtn @show="show('attr')"></bottomBtn>
		<!--模态框 弹出框 -->
		<commonPopup :popupClass="Tpopup.attr" @hide="hide('attr')">
			<!-- 商品图片 -->
			<view class="d-flex a-center" style="height: 275rpx;">
				<image src="/static/images/s6.jpg" mode="widthFix" style="width: 180rpx; height: 180rpx;" class="border rounded"></image>
				<view class="pl-2">
					<price priceSize="font-lg" unitSize="font">{{showPrice}}</price>
					<text class="d-block">{{checkedSkus}}</text>
				</view>
			</view>
			<!-- 表单 -->
			<scroll-view scroll-y class="w-100" style="height: 660rpx;">
				<card :headTitle="item.title" :headTitleWWeight="false" :headBorderBottom="false" v-for="(item, index) in selects" :key="index">
					<ZradioGroup :radioLabel="item" :selected.sync="item.selected"></ZradioGroup>
				</card>
				<view class="d-flex j-sb a-center p-2 border-top border-light-secondary">
					<text>购买数量</text>
					<uniNumberBox :min="1" :max="maxStock" :value="details.num" @change="details.num = $event"></uniNumberBox>
				</view>
			</scroll-view>
			<!-- 按钮 -->
			<view
				class="main-bg-color text-white font-md d-flex j-center a-center"
				style="height: 100rpx; margin-left: -30rpx; margin-right: -30rpx;"
				hover-class="main-bg-hover-color"
				@tap.stop="addCart"
			>
				加入购物车
			</view>
		</commonPopup>
		<!-- 收货地址 -->
		<commonPopup :popupClass="Tpopup.express" @hide="hide('express')">
			<view class="d-flex a-center j-center font-md border-bottom border-light-secondary" style="height: 100rpx;">收货地址</view>
			<scroll-view scroll-y class="w-100" style="height: 835rpx;">
				<uniListItem v-for="(item,index) in pathList" :key="index">
					<view class="iconfont icon-dingwei font-weight font-md">{{item.name}}</view>
					<view class="font text-light-muted">{{item.path}}{{item.detailPath}}</view>
				</uniListItem>
			</scroll-view>
			<!-- 按钮 -->
			<view
				class="main-bg-color text-white font-md d-flex j-center a-center"
				style="height: 100rpx; margin-left: -30rpx; margin-right: -30rpx;"
				hover-class="main-bg-hover-color"
				@tap.stop="openCreatePath"
			>
				选择新地址
			</view>
		</commonPopup>
		<!-- 服务说明 -->
		<commonPopup :popupClass="Tpopup.service" @hide="hide('service')">
			<view class="d-flex a-center j-center font-md border-bottom border-light-secondary" style="height: 100rpx;">服务说明</view>
			<scroll-view scroll-y class="w-100" style="height: 835rpx;">
				<view class="py-1">
					<view class="d-flex a-center">
						<view class="iconfont icon-dui1 main-text-color mr-1"></view>
						小米自营
					</view>
					<text class="text-light-muted">全场不包邮</text>
				</view>
				<view class="py-1">
					<view class="d-flex a-center">
						<view class="iconfont icon-dui1 main-text-color mr-1"></view>
						小米自营
					</view>
					<text class="text-light-muted">全场不包邮</text>
				</view>
				<view class="py-1">
					<view class="d-flex a-center">
						<view class="iconfont icon-dui1 main-text-color mr-1"></view>
						小米自营
					</view>
					<text class="text-light-muted">全场不包邮</text>
				</view>
			</scroll-view>
			<!-- 按钮 -->
			<view
				class="text-white font-md d-flex j-center a-center"
				style="height: 100rpx; margin-left: -30rpx; margin-right: -30rpx;"
				:hover-class="maxStock !== 0 ? 'main-bg-hover-color':''" :class="maxStock === 0 ? 'bg-secondary':'main-bg-color'"
				@tap.stop="addCart"
			>
				{{maxStock === 0 ? '暂时无货':'加入购物车'}}
			</view>
		</commonPopup>
	</view>
</template>

<script>
import uParse from '../../components/uni-ui/uParse/src/wxParse.vue';
import {mapState,mapMutations} from 'vuex';

import swiperImage from '@/components/index/index-swiper.vue';
import baseInfo from '@/components/detail/base-info.vue';
import scrollAttr from '@/components/detail/scroll-attr.vue';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
import scrollComments from '@/components/detail/scroll-comments.vue';
import card from '@/components/common/card.vue';
import commonList from '@/components/common/commonList.vue';
import bottomBtn from '@/components/detail/bottom-btn.vue';
import commonPopup from '@/components/common/common-popup.vue';
import price from '@/components/common/price.vue';
import ZradioGroup from '@/components/common/radio-group.vue';
import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue';

export default {
	components: {
		uParse,
		swiperImage,
		baseInfo,
		scrollAttr,
		uniListItem,
		scrollComments,
		card,
		commonList,
		bottomBtn,
		commonPopup,
		price,
		ZradioGroup,
		uniNumberBox
	},
	data() {
		return {
			selects: [],
			Tpopup: {
				attr: 'none',
				express: 'none',
				service: 'none'
			},
			contextHtml:'',
			comments: [],
			banners: [],
			details: {
				id:20,
				title: 'Redmi Note 9',
				desc:"一亿像素夜景相机 \/ 国内首发骁龙 750G处理器 \/ 6.67'' 小孔径全面屏 \/ 120Hz六档变速高刷屏 \/ 全场景AI四摄 \/ 线性马达 \/ 4820mAh+33W闪充 \/ 立体声双扬声器 \/ 多功能NFC",
				cover:'/static/images/s8.jpg',
				pprice: 1999,
				num: 1,
				max: 100
			},
			baseAttrs: [],
			loveList: []
		};
	},
	// 监听页面返回事件
	onBackPress() {
		//****** 当返回true时，阻止了返回键的默认事件，此前进行关闭模态框
		for (let key in this.Tpopup) {
			if (this.Tpopup[key] !== 'none') {
				this.hide(key);
				return true;
			}
		}
	},
	computed:{
		...mapState({
			pathList:state => state.path.list
		}),
		// 选中的Skus
		checkedSkus(){
			//拿到选中的skus组成的字符串（组织后数据）
			let checkedSkus = this.selects.map(v=>{
				return v.list[v.selected].name
			})
			return checkedSkus.join(',')
		},
		// 选中的skus的索引
		checkedSkusIndex(){
			if(!Array.isArray(this.details.goodsSkus)){
				return -1
			}
			// findIndex数组方法，传入判断条件（函数）返回查到索引
			let index = this.details.goodsSkus.findIndex((item) => {
				return item.skusText === this.checkedSkus
			})
			return index
		},
		//显示价格
		showPrice(){
			//if(this.checkedSkusIndex < 0){} 会报错 ！bug！！(findIndex()前只能是数组)
			
			if(!this.checkedSkus){
				return this.details.min_price || 0.00
			}
			return this.details.goodsSkus[this.checkedSkusIndex].pprice
		},
		//最大库存
		maxStock(){
			if(this.details.sku_type === 0){
				return this.details.stock
			}
			if(!Array.isArray(this.details.goodsSkus)){
				return 100
			}
			//给默认值(无效) return this.details.goodsSkus[this.checkedSkusIndex].stock || 100
			return this.details.goodsSkus[this.checkedSkusIndex].stock || 100
		}
	},
	onLoad(e) {
		if(e.detail){
			this.__init(JSON.parse(e.detail))
		}
	},
	methods: {
		...mapMutations([
			'addGoodsToCart'
		]),
		//初始化页面的方法
		__init(data){
			this.$H.get('/goods/'+data.id).then((res)=>{
				//轮播图 转化后台数据
				this.banners = res.goodsBanner.map((v)=>{
					return {
						src: v.url
					}
				})
				// console.log(this.banners)
				//初始化基本信息
				this.details = res
				this.details.num = 1
				//修改原生导航栏标题
				uni.setNavigationBarTitle({
					title: res.title,
				})
				//滚动商品属性
				this.baseAttrs = res.goodsAttrs.map(v =>{
					return {
						iconTu: 'icon-cpu_icon',
						title: v.name,
						desc: v.value
					}
				})
				//热门评论
				this.comments = res.hotComments.map(v=>{
					return {
						id:v.id,
						user_id: v.user.id,
						userpic: v.user.avatar,
						username: v.user.nickname,
						createTtime: v.review_time,
						good_num: v.goods_num,
						context: v.review.data,
						imageList: v.review.image
					}
				})
				//商品详情
				this.contextHtml = res.content
				//热门推荐
				this.loveList = res.hotList.map(v=>{
					return {
						id: v.id,
						cover: v.cover,
						title: v.title,
						desc: v.desc,
						oprice: v.min_oprice,
						pprice: v.min_price
					}
				})
				if(this.details.sku_type === 1){
					//规格选项
					this.selects = res.goodsSkusCard.map(v=>{
						let list = v.goodsSkusCardValue.map(v1=>{
							return {
								id: v1.id,
								name: v1.value
							}
						})
						return {
							id: v.id,
							title: v.name,
							selected: 0,
							list: list
						}
					})
					//商品规格价格
					this.details.goodsSkus.forEach(item=>{
						let arr = []
						for(let key in item.skus){
							arr.push(item.skus[key].value)
						}
						//组织对比 （计算属性）
						item.skusText = arr.join(',')
					})
				}
			})
		},
		addCart(){ //加入购车
			//无库存
			if(this.maxStock === 0){
				return;
			}
			this.$H.post('/cart',{
				shop_id:this.details.sku_type === 0 ? this.details.id : this.details.goodsSkus[this.checkedSkusIndex].id,
				skus_type:this.details.sku_type,
				num:this.details.num
			},{
				token:true
			}).then(res=>{
				//通知购物车页面更新商品
				uni.$emit('updateCart')
				//隐藏筛选框
				this.hide('attr')
				//成功的提示
				uni.showToast({
					title: '加入成功'
				})
			})
			
			
			//组织数据
			// let goods = this.details;
			// goods['checked'] = false;
			// goods['attrs'] = this.selects;
			// //加入购物车
			// this.addGoodsToCart(goods);
			// //隐藏筛选框
			// this.hide('attr');
			// //成功的提示
			// uni.showToast({
			// 	title: '加入成功'
			// });
		},
		openCreatePath(){
			uni.navigateTo({
				url:'../user-path-edit/user-path-edit'
			})
			this.hide('express')
		},
		hide(key) {
			this.Tpopup[key] = 'hide';
			setTimeout(() => {
				this.Tpopup[key] = 'none';
			}, 200);
		},
		show(key) {
			this.Tpopup[key] = 'show';
		},
		preview(src, e) {
			//do something
			console.log('src:' + src);
		},
		navigate(href, e) {
			//如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			console.log('href:' + href);
			uni.showModal({
				content: '点击链接为:' + href,
				showCancel: false
			});
		}
	}
};
</script>

<style>
.u-Parse view {
	line-height: 0 !important;
}
.u-Parse .p {
	padding: 0 !important;
}
</style>
