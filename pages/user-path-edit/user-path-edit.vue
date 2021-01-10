<template>
	<view>
		<view class="p-2 border-bottom d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">收货人：</view>
			<input class="px-1 font-md flex-1" type="text" v-model="from.name" />
		</view>
		<view class="p-2 d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">手机号：</view>
			<input class="px-1 font-md flex-1" type="text" v-model="from.phone" />
		</view>
		<myline></myline>
		<view class="p-2 border-bottom d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">所在地区：</view>
			<!-- 禁用input并给提示信息disabled -->
			<input class="px-1 font-md flex-1"  type="text" disabled @click="showMulLinkageThreePicker" placeholder="选择所在地区" :value="from.path" />
			<!-- 地址的三级联动  input触发联动显示-->
			<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="pickerValue" @onConfirm="onConfirm"></mpvue-city-picker>
			
		</view>
		<view class="p-2 d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">详细地址：</view>
			<input class="px-1 font-md flex-1" type="text" v-model="from.detailPath" />
		</view>
		<myline></myline>
		<view class="p-2 d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">设为默认地址：</view>
			<switch :checked="from.isDefault" color="#FD6801" class="ml-auto" @change="from.isDefault=$event.detail.value" />
		</view>
		<myline></myline>
		<view class="p-3">
			<view class="text-center w-100 main-bg-color text-white font-md rounded py-2" hover-class="main-bg-hover-color" @click="submit">保 存</view>
		</view>
	</view>
</template>

<script>
	import myline from '@/components/common/myline.vue'
	import mpvueCityPicker from '@/components/uni-ui/mpvue-citypicker/mpvueCityPicker.vue'
	import {mapMutations,mapActions} from 'vuex'
	
	export default {
		components:{
			myline,
			mpvueCityPicker
		},
		data() {
			return {
				index:-1,
				isedit:false,
				themeColor: '#007AFF',
				pickerValue: [0, 0, 1],
				from:{
					path:'',
					name:'',
					phone:'',
					detailPath:'',
					isDefault:false
				}
			}
		},
		onLoad(e) {
			if(e.data){
				let result = JSON.parse(e.data)
				this.from = result.item
				this.index = result.index
				this.isedit = true
				uni.setNavigationBarTitle({
					title:'修改收货地址'
				})
			}
		},
		// 监听返回,优先关闭联动
		onBackPress() {
		  if (this.$refs.mpvueCityPicker.showPicker) {
		  	this.$refs.mpvueCityPicker.pickerCancel();
		    return true;
		  }
		},
		// 页面卸载 ,优先关闭联动
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		methods: {
			//三级联动的确定
			onConfirm(e) {
				this.from.path = e.label
				this.pickerValue = e.value
			},
			//显示三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			//引入vuex的方法
			...mapActions(['updataPathAction','createPathAction']),
			//提交数据
			submit(){
				//验证表单
				//修改
				if(this.isedit){
					this.updataPathAction({
						index:this.index,
						item:this.from
					})
					uni.showToast({
						title: '修改成功'
					})
					return uni.navigateBack({ delta:1 });
				}
				//创建地址
				this.createPathAction(this.from);
				uni.showToast({
					title: '创建成功'
				});
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					});
				},500)
			}
		}
	}
</script>

<style>
	page{
		background: #EEEEEE;
	}
</style>
