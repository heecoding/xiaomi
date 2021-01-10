<template>
	<view class="Tpopup" :class="popupClass">
		<view class="Tmask" @tap.stop="$emit('hide')" @touchmove.stop.prevent="movehandle"></view>
		<view class="Tbody">
			<slot />
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			popupClass:{
				type:String,
				default:'none'
			}
		},
		methods:{
			movehandle(){
				
			}
		}
	}
</script>

<style scoped>
	.Tpopup,.Tmask{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.Tpopup{
		z-index: 2000;
		display: none;
	}
	.Tmask{
		z-index: 2002;
		background: rgba(0,0,0,.5);
	}
	.Tpopup .Tbody{
		border-radius: 20rpx 20rpx 0 0;
		width: 92%;
		padding: 0 4%;
		height: 1035rpx;
		background: #FFFFFF;
		position: fixed;
		z-index: 2020;
		bottom: -1035rpx;
		display: flex;
		flex-direction: column;
	}
	.Tpopup.show{/* 同一个view组件上,同级不能加空格 */
		display: block;
	}
	.Tpopup.hide{
		display: block;
	}
	.show .Tmask{
		animation: showPopupMask 0.2s linear both;
	}
	.hide .Tmask{
		animation: hidePopupMask 0.2s linear both;
	}
	.show .Tbody{
		animation: showPopupBody 0.2s linear both;
	}
	.hide .Tbody{
		animation: hidePopupBody 0.2s linear both;
	}
	@keyframes showPopup{
		0%{ opacity: 0;}
		100%{ opacity: 1;}
	}
	@keyframes showPopupMask{
		0%{ opacity: 0;}
		100%{ opacity: 1;}
	}
	@keyframes showPopupMask{
		0%{ opacity: 0;}
		100%{ opacity: 1;}
	}
	@keyframes showPopupBody{
		0%{ transform: translateY(0);}
		100%{ transform: translateY(-100%);}
	}
	@keyframes hidePopupBody{
		0%{ transform: translateY(-100%);}
		100%{ transform: translateY(0);}
	}
	.Tpopup.none{
		display: none;
	}
</style>
