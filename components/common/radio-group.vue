<template>
	<view class="row">
		<view class="span24-8 px-2 mb-2" v-for="(item,index) in radioLabel.list" :key="index">
			<view class="px-2 py-1 bg-light-secondary font-md d-flex j-center border border-light-secondary rounded" :class="radioLabel.selected === index? 'radio-active':''" @tap="radioChande(index)">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			radioLabel:Object
		},
		methods:{
			radioChande(index){
				this.$emit('update:selected',index);
				// this.$emit('change',index) //上推触发radio-group change事件
			}
		}
	}
</script>

<style scoped>
	.radio-active{
		background: #fce0d5!important;
		color: #eb7320!important;
		border: 1upx solid #eb7320!important;
		
	}
</style>
