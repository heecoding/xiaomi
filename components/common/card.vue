<template>
	<view class="card" :style="cardStyle">
		<view v-if="showHead" class="d-flex a-center j-sb p-2 main-border-color" :class="getHeadClass">
			<slot name="cardTitle">
				<text v-if="headTitle" class="font-md" :class="headTitleWWeight? 'font-weight':''">{{headTitle}}</text>
			</slot>
			<slot name="right">
				
			</slot>
		</view>
		
		<view :class="getBodyClass" :style="bodyStyle">
			<image v-if="bodyCover" :src="bodyCover" mode="widthFix"></image>
			<slot />
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			bodyStyle:String,
			showHead:{
				type:Boolean,
				default:true
			},
			headTitle:String,
			bodyCover:String,
			//头部标题是否显示下边线
			headBorderBottom:{
				type:Boolean,
				default:true
			},
			//头部标题是否字体加粗
			headTitleWWeight:{
				type:Boolean,
				default:true
			},
			//是否给内容body加padding
			bodyPadding:{
				type:Boolean,
				default:false
			},
			cardStyle:{
				type:String,
				default:''
			}
		},
		computed:{
			getHeadClass(){
				let BorderBottom = this.headBorderBottom ? 'border-bottom':'';
				return `${BorderBottom}`
			},
			getBodyClass(){
				let BodyPadding = this.bodyPadding ? 'p-2':'';
				return `${BodyPadding}`
			}
		}
	}
</script>

<style>
</style>
