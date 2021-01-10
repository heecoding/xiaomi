<template>
	<view>
		<swiper indicator-dots autoplay :interval="4000" :duration="200" circular :style="getStyle">
			<block v-for="(item,index) in swiperData" :key="index">
				<swiper-item>
					<view class="swiper-item" @tap="swiperEvent(item,index)">
						<image :src='item.src' lazy-load :style="getStyle" ></image>
					</view>
				</swiper-item>
			</block>
		</swiper>
	</view>
</template>

<script>
	export default{
		props:{
			swiperData:[Array, Object],
			height:{
				type:String,
				default:'350rpx'
			},
			preview:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			getStyle(){
				return `height: ${this.height}rpx;`
			},
			// getUrls(){
			// 	return this.swiperData.map((v) => v.src)
			// }
		},
		methods:{
			swiperEvent(item,index){
				if(this.preview){
					return uni.previewImage({
						current:index,
						urls:this.getUrls,
						indicator:"default"
					})
				}
			}
		}
	}
</script>

<style>
</style>
