<template>
	<view class="p-2">
		<scroll-view scroll-x class="scroll-row">
			
			<view class="scroll-row-item rounded bg-light-secondary mr-2 p-2" style="width: 620rpx; height: 380rpx;" v-for="(item,index) in comments" :key="index">
				<view class="d-flex a-center mb-1">
					<image :src="item.userpic" class="main-bg-color rounded-circle" style="width: 70rpx; height: 70rpx;" mode="widthFix"></image>
					<view class="ml-2">
						<text class="font-md line-h">{{item.username}}</text>
						<text class="d-block font text-light-muted line-h">{{item.create_time}}</text>
						<!-- 过滤器 -->
						<!-- {{item.create_time | formaTime}} -->
					</view>
					<view class="iconfont icon-zan1 text-light-muted font pl-1 ml-auto">
						{{item.good_num}}
					</view>
				</view>
				
				<text class="d-block font-md mb-2">{{item.context}}</text>
				
				<view class="row">
					<view class="span24-8 px-2" v-for="(item2,index2) in item.imageList" :key="index2">
						<image :src="item2" class="main-bg-color rounded" style=" height: 115rpx;" mode="widthFix"></image>
					</view>
				</view>
				
			</view>
		</scroll-view>
		<view class="d-flex j-center a-center py-2 text-primary" hover-class="bg-light-secondary" @click="openDetailComments">
			更多评论
			<view class="iconfont icon-you"></view>
		</view>
	</view>
</template>

<script>
	//时间戳转换
	import $T from '@/common/lib/time.js'
	
	export default{
		props:['comments','goods_id'],
		filters:{
			formaTime(value){
				return $T.gettime(value)
			}
		},
		methods:{
			openDetailComments(){
				uni.navigateTo({
					url:'/pages/detail-comment/detail-comment?id='+this.goods_id
				})
			}
		}
	}
</script>

<style>
</style>
