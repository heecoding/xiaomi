<template>
	<view>
		<card v-if="loginStatus" headTitle="账号管理" bodyStyle="background:#ffffff;">
			<uniListItem title="个人资料" :showExtraIcon="true">
				<view slot="right" class="iconfont icon-you text-light-muted"></view>
			</uniListItem>
			<uniListItem title="收货地址" :showExtraIcon="true" @click="navigate('user-path-list')">
				<view slot="right" class="iconfont icon-you text-light-muted"></view>
			</uniListItem>
		</card>
		
		<card headTitle="关于" bodyStyle="background:#ffffff;">
			<uniListItem :title="item.title" :showExtraIcon="true" v-for="(item,index) in list" :key="index" @click="navigate(item.path)">
				<view slot="right" class="iconfont icon-you text-light-muted"></view>
			</uniListItem>
		</card>
		
		<view v-if="loginStatus" class="p-3">
			<button type="default" class="bg-white" @click="loginoutEvent">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex'
	import card from '@/components/common/card.vue'
	import myline from '@/components/common/myline.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	
	export default {
		components:{
			card,
			myline,
			uniListItem
		},
		data() {
			return {
				list:[
					{title:'关于商城', path:'about'},
					{title:'意见反馈', path:''},
					{title:'协议规则', path:''},
					{title:'资质证件', path:''},
					{title:'用户协议', path:''},
					{title:'隐私政策', path:''}
				]
			}
		},
		computed:{
			//分modules，提取state内值时要定位具体
			...mapState({
				token:state =>state.user.token,
				loginStatus:state => state.user.loginStatus
			})
		},
		methods: {
			...mapMutations(['loginout','clearCart']),
			navigate(path){
				if(!path) return{};
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				});
			},
			//退出登录 ( 清除服务端的 token )
			loginoutEvent(){
				//user-vuex拿到token后设置请求头
				this.$H.post('/logout',{},{
						//添加请求头
						token:true,
						//需携带token
						checkToken:true,
						//自定义错误提示(隐藏)
						toast:false
					}).then(res =>{
					//定义新的事件，触发清除user-vuex数据的同时，做出下一步动作
					this.loginout()
					//清空购物车
					this.clearCart()
					uni.showToast({
						title:'退出成功',
						success: () => {
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},500)
						}
					})
				})
			}
		}
	}
</script>

<style>
	page{
		background: #EEEEEE;
	}
</style>
