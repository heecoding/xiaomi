<template>
	<view class="animated fadeIn faster">
		<loading-plus v-if="beforeReady"></loading-plus>
		<!-- 头部 -->
		<view class="position-relative d-flex a-center" style="height: 320rpx;">
			<!-- 消息列表 -->
			<view class="iconfont icon-xiazai16 position-absolute text-white" style="font-size: 50rpx; top: 75rpx; right: 20rpx; z-index: 100;" @click="navigate('msg-list',true)"></view>
			<image src="/static/images/bg.jpg" style="height: 320rpx; width: 100%;"></image>
			
			<view class="d-flex a-center position-absolute left-0 right-0" style="bottom: 50rpx;">
				<image :src="loginStatus ? userInfo.avatar : '/static/images/logo.png'" style="width: 145rpx; height: 145rpx; border: 5rpx solid;" class="rounded-circle border-light ml-4" @click="navigate('user-userinfo')"></image>
				<view class="ml-2 text-white font-md" @click="openLogin">{{loginStatus ? userInfo.nickname : '登录/注册'}}</view>
				<view class="d-flex a-center j-center a-self-end ml-auto px-2" style="height: 70rpx; background: #ffd43f; color: #cc4a00; border-top-left-radius: 35rpx; border-bottom-left-radius: 35rpx;">
					<view class="line-h iconfont icon-huangguan mr-1">会员积分0.00</view>
				</view>
			</view>
		</view>
		
		<card>
			<view slot="cardTitle" class="d-flex a-center j-sb w-100">
				<text class="font-md font-weight">我的订单</text>
				<view class="text-secondary font" hover-class="bg-light-secondary" @click="navigate('order',true)">
					全部订单<text class="iconfont icon-you font"></text>
				</view>
			</view>
			<view class="d-flex a-center" @click="navigate('order',true)">
				<view class="flex-1 d-flex flex-column a-center j-center py-3" hover-class="bg-light-secondary" v-for="(item,index) in orders" :key="index" @click.stop="openOrder(item)">
					<view class="iconfont font-lg line-h" :class="item.icon"></view>
					<view>{{item.name}}</view>
				</view>
			</view>
		</card>
		<myline></myline>
		
		<uniListItem title="小米会员" :showExtraIcon="true" leftIcon="icon-VIP" leftIconStyle="color:#fdbf2e">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
		<uniListItem title="会员中心" :showExtraIcon="true" leftIcon="icon-huangguan" leftIconStyle="color:#fcbe2d">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
		<uniListItem title="服务中心" :showExtraIcon="true" leftIcon="icon-fuwu1" leftIconStyle="color:#fa6c5e">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
		<uniListItem title="小米之家" :showExtraIcon="true" leftIcon="icon-home" leftIconStyle="color:#fe8b42">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
		<uniListItem title="更多功能" :showExtraIcon="true" leftIcon="icon-gengduo1" leftIconStyle="color:#9ed45a">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
		<myline></myline>
		<uniListItem title="更多设置" :showExtraIcon="true" leftIcon="icon-shezhi" leftIconStyle="color:#808c98" @click="navigate('user-set')">
			<view slot="right" class="iconfont icon-you text-light-muted"></view>
		</uniListItem>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import loading from '@/common/mixin/loading.js'
	
	import card from '@/components/common/card.vue'
	import myline from '@/components/common/myline.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	
	export default{
		mixins:[loading],
		components:{
			card,
			myline,
			uniListItem
		},
		data(){
			return{
				orders:[
					{
						name:'待付款',
						icon:'icon-weibiaoti-',
						index:1
					},
					{
						name:'待收货',
						icon:'icon-daishouhuo',
						index:2
					},
					{
						name:'待评价',
						icon:'icon-pinglun',
						index:3
					},
					{
						name:'待退修',
						icon:'icon-weixiu'
					}
				]
			}
		},
		computed:{
			...mapState({
				loginStatus:state=>state.user.loginStatus,
				userInfo:state=>state.user.userInfo
			})
		},
		methods:{
			navigate(path,check = false){
				if(!path) return{};
				////权限跳转（登录）（拦截：原型上添加方法，调用时传参并判断操作，进行合理跳转）
				if(check){
					return this.navigateTo({url: `/pages/${path}/${path}`})
				}
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				})
			},
			openLogin(){
				if(!this.loginStatus){
					uni.navigateTo({
						url:'../login/login'
					})
				}
			},
			openOrder(item){
				if(item.index){
					this.navigateTo({
						url:'/pages/order/order?tabIndex='+item.index
					})
				}
				uni.redirectTo({
					
				})
			}
		}
	}
</script>

<style>
</style>
