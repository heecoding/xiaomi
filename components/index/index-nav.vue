<template>
	<view>
		<view class="row j-center m-2">
			<block v-for="(item,index) in navData" :key="index">
				<view class="span-4 d-flex flex-column j-center a-center py-1" @tap="navEvent(item)">
					<image :src="item.src" style="height: 60upx; width: 60upx;" mode="widthFix"></image>
					<text class="font-sm">{{item.text}}</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			navData:[Object,Array]
		},
		methods:{
			navEvent(item){
				console.log('点击了nav的'+item)
			}
		}
	}
</script>

<style>
</style>
