<template>
	<view style="width: 372.5upx;" @click="openDetail">
		<image :src="item.cover" mode="widthFix" lazy-load ></image>
		<view class="p-2 pt-1 column a-center j-center mt-auto">
			<view class="font-md">{{item.title}}</view>
			<view class="flex-1 font text-light-muted">{{item.desc}}</view>
			<view class="d-flex my-1">
				<price>{{item.pprice}}</price>
				<view class="font-sm text-light-muted line-through a-self-end ml-1 line-h">￥{{item.oprice}}</view>
			</view>
			<view class="column j-center a-center" style="width: 200upx; height: 60upx; background-color: #ea625b; color: #FFFFFF; border-radius: 5upx;">
				立即购买
			</view>
		</view>
	</view>
</template>

<script>
	import price from "@/components/common/price.vue";
	
	export default{
		components:{
			price
		},
		props:{
			item:Object,
			index:Number
		},
		methods:{
			openDetail(){
				//重定向，避免打开太多窗口，返回关闭窗口
				uni.redirectTo({
					//GET传参方式，把参数带到子页
					url:'/pages/detail/detail?detail='+JSON.stringify(this.item)
				})
			}
		}
	}
</script>

<style>
</style>
