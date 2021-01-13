<template>
	<view>
		<uniStatusBar />
		<view class="d-flex a-center j-sb py-2 px-3 text-light-muted">
			<view class="iconfont icon-cuo" @click="goBack"></view>
			<view class="font-md" @click="forget">忘记密码</view>
		</view>
		<view class="p-5">
			<view class="font-big mb-4">密码登录</view>
			<input type="text" placeholder="请输入手机号/邮箱/账号" v-model="username" placeholder-class="text-light-muted" class="border-bottom mb-4 uni-input px-0" @focus="inputFocus('username')" @blur="inputBlur('username')" :class="focusClass.username ? 'border-warning':''" />
			<input type="text" placeholder="请输入密码" v-model="password" placeholder-class="text-light-muted" class="border-bottom mb-4 uni-input px-0" @focus="inputFocus('password')" @blur="inputBlur('password')" :class="focusClass.password ? 'border-warning':''" />
			<view class="py-2 w-100 d-flex a-center j-center main-bg-color text-white rounded font-md mb-4" hover-class="main-bg-hover-color" @click="submit">登录</view>
			<label class="checkbox d-flex a-center" @click="check = !check">
				<checkbox :checked="check" />
				<text class=" text-light-muted font">已阅读并同意xxxxxx协议</text>
			</label>
		</view>
		
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	import uniStatusBar from '@/components/uni-ui/uni-status-bar/uni-status-bar.vue'
	export default {
		components:{
			uniStatusBar
		},
		data() {
			return {
				username:'',
				password:'',
				check:true,
				// 验证规则
				rules:{
					username:[
						// {
						// 	rule:/^[a-zA-Z]\w{5,17}$/,
						// 	msg:'以字母开头，长度在6~18之间,只能包含字母、数字、下划线'
						// }
					],
					password:[
						// {
						// 	rule:/^.{5,20}$/,
						// 	msg:'长度为5-20的所有字符'
						// }
					]
				},
				focusClass:{
					username:false,
					password:false
				}
			}
		},
		methods: {
			...mapMutations([
				'login'
			]),
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			//表单验证
			valdata(key){
				var check = true
				this.rules[key].forEach((v)=>{
					//验证失败
					if(!(v.rule).test(this[key])){
						uni.showToast({ title:v.msg,icon:'none' })
						check = false
						return false
					}
				})
				return check
			},
			//提交表单//正则 验证
			//	/^[a-zA-Z]\w{5,17}$/		//以字母开头，长度在6~18之间,只能包含字母、数字、下划线
			//	/^.{5,20}$/			//长度为5-20的所有字符
			submit(){
				// 验证用户名
				if(!this.valdata('username')) return;
				// 验证密码
				if(!this.valdata('password')) return;
				//验证协议
				if(!this.check){
					return uni.showToast({
						title:'请同意xxxxx协议',
						icon:'none'
					})
				}
				uni.showLoading({
					title:'登陆中...',
					// mask防止用户点击多次
					mask:true
				})
				//user2/zcmcss
				this.$H.post('/login',{
					username:this.username,
					password:this.password
				}).then(res=>{
					//登陆状态存储
					this.login(res)
					//刷新购物车
					uni.$emit('updateCart')
					
					//隐藏并返回
					uni.hideLoading()
					uni.showToast({
						title:'登录成功'
					})
					uni.navigateBack({
						delta:1
					})
				})
			},
			forget(){
				
			},
			inputFocus(key){
				this.focusClass[key] = true
			},
			inputBlur(key){
				this.focusClass[key] = false
			}
		}
	}
</script>

<style>
</style>
