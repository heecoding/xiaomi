<template>
	<view class="d-flex border-top border-light-secondary animated fadeIn faster" style="height: 100%; box-sizing: border-box;">
		
		<loading-plus v-if="beforeReady"></loading-plus>
		
		<scroll-view id="leftScroll" scroll-y class="flex-1 border-right border-light-secondary" style="height: 100%;" :scroll-top="leftScrollTop">
			<view class="border-bottom border-light-secondary py-1 left-scroll-item" hover-class="bg-light-secondary" v-for="(item,index) in cate" :key="index" @tap="classChange(index)">
				<view class="d-flex py-1 font-md j-center" :class="activeIndex === index? 'class-active':''">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y :scroll-with-animation="true" style="flex:3.5; height: 100%;" :scroll-top="rightScrollTop" @scroll="onRightScroll">
			<view class="row right-scroll-item" v-for="(item,index) in list" :key="index">
				<view class="span24-8 text-center py-2"  v-for="(listItem,listIndex) in item.list" :key="listIndex" @click="openDetail(listItem)">
					<image :src="listItem.cover" style="width: 120upx; height: 120upx;" mode="widthFix"></image>
					<text class="d-block">{{listItem.name}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import loading from '@/common/mixin/loading.js'
	
	export default{
		mixins:[loading],
		data(){
			return{
				//当前选中索引
				activeIndex:0,
				cate:[],
				list:[],
				//存放滑块到顶部距离
				leftDomsTop:[],
				rightDomsTop:[],
				leftScrollTop:0,
				rightScrollTop:0,
				//记录分类的高度
				cateItemHeight:0
				
			}
		},
		onLoad() {
			this.getData()
		},
		watch:{
			async activeIndex(newValue,oldValue){
				//获取scroll-view高度和scrollTop(节点信息)
				let data = await this.getElInfo({
					size:true,
					scrollOffset:true
				})
				let H = data.height;
				let ST = data.scrollTop;
				//处于最下边时
				// itemHeight + itemTop > height + scroll-top
				if((this.leftDomsTop[newValue]+this.cateItemHeight) > (H+ST)){
					return this.leftScrollTop = this.leftDomsTop[newValue]+this.cateItemHeight-H;
					//(leftScrollTop滚动到的位置)  (leftDomsTop[newValue]当前top值) (cateItemHeight一个分类的高度)  (H,ST scroll-view高度,Top)
				}
				//处于最上边时
				if(ST > this.cateItemHeight){
					this.leftScrollTop = this.leftDomsTop[newValue];
				}
			}
		},
		methods:{
			//获取节点信息
			getElInfo(obj={}){
				return new Promise((resolve,reject) =>{
					let option = {
						size:obj.size? true:false,
						rect:obj.rect? true:false,
						scrollOffset:obj.scrollOffset? true:false,
					}
					const query = uni.createSelectorQuery().in(this);
					let q =obj.all? query.selectAll(`.${obj.all}-scroll-item`):query.select('#leftScroll');
					q.fields(option,data =>{
						resolve(data)
					}).exec();
				})
			},
			getData(){
				this.$H.get('/category/app_category').then((res)=>{
					let cate = []
					let list = []
					res.forEach(v =>{
						cate.push({
							id:v.id,
							name:v.name
						})
						list.push({
							list:v.app_category_items
						})
					})
					this.cate = cate
					this.list = list
					//联动
					this.$nextTick(()=>{
						this.getElInfo({
							all:'left',
							size:true,
							rect:true
						}).then(data =>{
							this.leftDomsTop = data.map(v =>{
								//获每一个分类的高度
								this.cateItemHeight = v.height;
								return v.top
							});
						});
						this.getElInfo({
							all:'right',
							size:false,
							rect:true
						}).then(data =>{
							this.rightDomsTop = data.map(v =>v.top);
						})
					})
				})
				
			},
			//点击左边分类菜单
			classChange(index){
				this.activeIndex = index;
				//右边scroll-view滚动到对应的区块
				this.rightScrollTop = this.rightDomsTop[index];
			},
			//监听右边滚动事件
			async onRightScroll(e){
				//匹配当前scrollTop所处的索引
				this.rightDomsTop.forEach((v,k) =>{
					//此处bug(点击左边分类，触发滚动监听改变索引，左边分类条会有向上退一格的效果)，解决：给判断条件多加几个像素如3
					if(v < e.detail.scrollTop+3){
						this.activeIndex = k;
						return false
					}
				})
			},
			//打开详情页
			openDetail(item){
				uni.navigateTo({
					//GET传参方式，把参数带到子页
					url:'/pages/detail/detail?detail='+JSON.stringify({
						id:item.goods_id,
						title:item.name
					})
				})
			}
		}
	}
</script>

<style>
	.class-active{
		border-left: 8upx solid #FD6801;
		color: #FD6801!important;
	}
	.class-noactive{
		border-left: 8upx solid #FFFFFF;
		color: #6c757d!important;
	}
</style>
