<template>
	<view class="p-2">
		<view class="bg-white rounded" v-for="(item,index) in list" :key="index">
			<view class="mb-2 p-2 rounded" hover-class="bg-secondary" @click="openMsgDetail(item)">
				<view class="text-dark font-md">{{item.title}}</view>
				<view class="font text-light-muted">{{item.desc}}</view>
				<view class="font text-light-muted">{{item.create_time}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						title:'仿小米商城',
						desc:'由uniapp nvue加vue编写',
						create_time:'12月份'
					},
					{
						title:'仿小米商城1',
						desc:'由uniapp nvue加vue编写1',
						create_time:'12月份1'
					}
				]
			}
		},
		methods: {
			openMsgDetail(item){
				uni.navigateTo({
					url:'../msg-detail/msg-detail?detail='+JSON.stringify(item)
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #EEEEEE;
}
</style>
