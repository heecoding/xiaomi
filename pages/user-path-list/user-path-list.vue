<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<uni-swipe-action :options="options"  @click="bindClick($event,index)">
				<uniListItem @click="choose(item)">
					<view slot="right" class="iconfont icon-you text-light-muted"></view>
					
					<view class="text-secondary">
						<view class="d-flex a-center">
							<text class="main-text-color">{{item.name}}</text>{{item.phone}}<text class="main-text-color" v-if="item.isDefault">[默认]</text>
						</view>
						<view>{{item.path}}</view>
						<view>{{item.detailPath}}</view>
					</view>
				</uniListItem>
			</uni-swipe-action>
		</block>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action.vue'
	export default {
		components:{
			uniListItem,
			uniSwipeAction
		},
		//头部导航(+)监听
		onNavigationBarButtonTap(e) {
			if(e.index === 0){
				uni.navigateTo({
					url: '/pages/user-path-edit/user-path-edit'
				});
			}
		},
		data() {
			return {
				isChoose:false,
				options: [{
					text: '修改',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			}
		},
		onLoad(e) {
			//接收从订单页面传来的数据
			if(e.type === 'choose'){
				this.isChoose = true
			}
		},
		computed:{
			...mapState({
				list:state =>state.path.list
			})
		},
		methods: {
			...mapMutations([
				'delPath'
			]),
			bindClick(value,index) {
				switch(value.index){
					case 0://点击修改
						let obj = JSON.stringify({index:index,item:this.list[index]})
						setTimeout(() =>{//让点击过的效果恢复
							uni.navigateTo({
								url:'../user-path-edit/user-path-edit?data='+obj
							},50)
						})
					break;
					case 1://点击了删除
						uni.showModal({
							content:'要删除该收获地址吗',
							success:(res) =>{
								if(res.confirm){
									this.delPath(index)
									uni.showToast({
										title:'删除成功'
									})
								}
							}
						})
					break;
				}
			},
			// 选择收货地址
			choose(item){
				if(this.isChoose){
					// 通知订单提交页修改收货地址
					uni.$emit('choosePath',item)
					this.isChoose = false
					// 关闭当前页面
					uni.navigateBack({
						delta:1
					})
				}
			}
		}
	}
</script>

<style>

</style>
