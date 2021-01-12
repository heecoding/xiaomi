<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<uni-swipe-action :options="options"  @click="bindClick($event,index)">
				<uniListItem @click="choose(item)">
					<view slot="right" class="iconfont icon-you text-light-muted"></view>
					
					<view class="text-secondary">
						<view class="d-flex a-center">
							<text class="main-text-color mr-1">{{item.name}}</text>{{item.phone}}<text class="main-text-color" v-if="index === 0 && item.last_used_time !== null">[默认]</text>
						</view>
						<view>{{item.province}} {{item.city}} {{item.district}}</view>
						<view>{{item.address}}</view>
					</view>
				</uniListItem>
			</uni-swipe-action>
		</block>
		<!-- 没有数据 -->
		<noThing v-if="list.length === 0" msg="空空如也"></noThing>
		
		<myline />
		<!-- 上拉加载更多 -->
		<view class="d-flex a-center j-center text-light-muted font-md py-3">{{loadingText}}</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action.vue'
	import noThing from '@/components/common/no-thing.vue'
	export default {
		components:{
			uniListItem,
			uniSwipeAction,
			noThing
		},
		data() {
			return {
				//1.上拉加载更多 2.加载中。。。 3.没有更多了
				loadingText:'上拉加载更多',
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
				}],
				page:1
			}
		},
		//头部导航(+)监听
		onNavigationBarButtonTap(e) {
			if(e.index === 0){
				uni.navigateTo({
					url: '/pages/user-path-edit/user-path-edit'
				});
			}
		},
		onPullDownRefresh() {
			//监听下拉刷新
			this.page =1
			this.getData(()=>{
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			//是否处在加载中
			if(this.loadingText !== '上拉加载更多')return;
			//改变加载状态
			this.loadingText = '加载中...'
			this.page++
			//加载数据
			this.getData()
		},
		onLoad(e) {
			//接收从订单页面传来的数据
			if(e.type === 'choose'){
				this.isChoose = true
			}
			//初始化
			this.getData()
			
			//注册一个监听事件（修改默认地址后）
			uni.$on('updateUserPathList',()=>{
				this.page =1
				this.getData()
			})
		},
		onUnload() {
			//关闭/卸载 监听事件
			uni.$off('updateUserPathList')
		},
		computed:{
			...mapState({
				list:state =>state.path.list
			})
		},
		methods: {
			...mapMutations([
				'delPath','updatePathList'
			]),
			//获取初始数据
			getData(callback = false){
				this.$H.get('/useraddresses/'+this.page,{},{
					token:true
				}).then(res=>{
					// this.page === 1? true : false
					let refresh = this.page === 1
					this.updatePathList({
						refresh:refresh,
						list:res
					})
					this.loadingText =res.length < 10 ? '没有更多了': '上拉加载更多'
					if(typeof callback === 'function'){
						uni.showToast({
							title:'刷新成功',
							icon:'none'
						})
						callback()
					}
				}).catch((err)=>{//失败时
					if(typeof callback === 'function'){
						callback()
					}
					//页码回归上一页
					if(Page > 1){
						this.page--
						this.loadingText = '上拉加载更多'
					}
				})
			},
			bindClick(value,index) {
				switch(value.index){
					case 0://点击修改
						let obj = {
								index:index,
								item:this.list[index]
							}
						//确认是否默认
						obj.item.default = (index === 0 && obj.item.last_used_time !== null) ? 1 : 0
						
						setTimeout(() =>{//让点击过的效果恢复
							uni.navigateTo({
								url:'../user-path-edit/user-path-edit?data='+JSON.stringify(obj)
							},50)
						})
					break;
					case 1://点击了删除
						uni.showModal({
							content:'要删除该收获地址吗',
							success:(res) =>{
								if(res.confirm){
									//调用删除请求
									this.$H.del('/useraddresses/'+this.list[index].id,{},{
										token:true
									}).then(res=>{
										this.delPath(index)
										uni.showToast({
											title:'删除成功'
										})
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
