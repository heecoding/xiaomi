<template>
	<view>
		<!-- 搜索列表 -->
		<view class="d-flex border-top border-bottom a-center font-md position-fixed top-0 left-0 right-0 bg-white" style="height: 100upx; z-index: 100;">
			<view class="flex-1 d-flex a-center j-center" v-for="(item,index) in screen.list" :key="index" @tap="changeScreen(index)">
				<text :class="screen.currentIndex === index ? 'main-text-color':'text-muted'">{{item.name}}</text>
				<view>
					<view :class="item.status ===1 ? 'main-text-color':'text-light-muted'" class="iconfont icon-shang1" style="line-height: .7;"></view>
					<view :class="item.status === 2 ? 'main-text-color':'text-light-muted'" class="iconfont icon-xiala" style="line-height: .7;"></view>
				</view>
			</view>
			
			<view class="flex-1 d-flex a-center j-center text-muted" @tap="showRigth = true">筛选</view>
		</view>
		<!-- 占位 -->
		<view style="height: 100upx;"></view>
		<!-- 列表 -->
		<block v-for="(item,index) in list" :key="index">
			<searchList :item="item" :index="index"></searchList>
		</block>
		<!-- 没有数据 -->
		<noThing v-if="list.length === 0" msg="空空如也"></noThing>
		
		<myline />
		<!-- 上拉加载更多 -->
		<view class="d-flex a-center j-center text-light-muted font-md py-3">{{loadingText}}</view>
		
		<!-- 右侧 抽屉 -->
		<uni-drawer :visible="showRigth" mode="right" @close="closeDrawer" @tap="showDrawer" bodyStyle="width:75%">
			<view class="">
				<!-- 服务 -->
				<card headTitle="价格范围" :headBorderBottom="false" :bodyPadding="true" :headTitleWWeight="false">
					<!-- 单选按钮组 -->
					<ZradioGroup :radioLabel="label" :selected.sync="label.selected" />
					<!-- <ZradioGroup :radioLable="label" @change="radioChande" /> -->
				</card>
				
				<!-- 底部按钮 -->
				<view class="d-flex position-fixed bottom-0 right-0 w-100 border-top border-light-secondary">
					<view class="flex-1 main-bg-color text-white font-md py-2 text-center" hover-class="main-bg-hover-color" @click="confirm">确定</view>
					<view class="flex-1 font-md py-2 text-center" hover-class="bg-light-secondary" @click="reset">重置</view>
				</view>
			</view>
		</uni-drawer>
		
	</view>
</template>

<script>
	import uniDrawer from '@/components/uni-ui/uni-drawer/uni-drawer.vue';
	import card from '@/components/common/card.vue';
	import ZradioGroup from '@/components/common/radio-group.vue';
	import searchList from '@/components/search-list/search-list.vue';
	import noThing from '@/components/common/no-thing.vue';
	
	export default{
		components:{
			uniDrawer,
			card,
			ZradioGroup,
			searchList,
			noThing
		},
		data(){
			return {
				//1.上拉加载更多 2.加载中。。。 3.没有更多了
				loadingText:'上拉加载更多',
				page:1,
				keyword:'',
				showRigth:false,
				screen:{
					currentIndex: 0,
					list:[
						{ name: '综合',status: 1, key:'all' },
						{ name: '销量',status: 0, key:'sale_count' },
						{ name: '价格',status: 0, key:'min_price' }
					]
				},
				label:{
					selected:0,
					list:[
						{name:'不限',rule:false,value:false},
						{name:'0-100',rule:'between',value:'0,100'},
						{name:'100-500',rule:'between',value:'100,500'},
						{name:'500-1000',rule:'between',value:'500,1000'},
						{name:'1000-2000',rule:'between',value:'1000,2000'},
						{name:'大于2000',rule:'between',value:'2000'}
					]
				},
				list:[],
				condition:{},
				//多筛选可用数组
				oldSelected:0
			}
		},
		computed:{
			//排序相关
			options(){
				//当前所处排序
				let obj = this.screen.list[this.screen.currentIndex]
				let value = obj.status ===1? 'asc':'desc'
				return {
					[obj.key]:value
				}
			}
		},
		onNavigationBarSearchInputChanged() {
			this.keyword = e.text
		},
		//搜索监听，从新获取数据
		onNavigationBarSearchInputConfirmed() {
			this.search()
		},
		//按钮监听
		onNavigationBarButtonTap() {
			this.search()
		},
		onLoad(e) {
			this.keyword = e.keyword
			//刷新数据
			this.getData()
		},
		onReachBottom() {
			//是否处在加载中
			if(this.loadingText !== '上拉加载更多')return;
			//改变加载状态
			this.loadingText = '加载中...'
			this.page++
			//加载数据
			this.getData(false)
		},
		onPullDownRefresh() {
			//刷新数据 传入回调关闭状态
			this.getData(true,()=>{
				uni.showToast({
					title:'刷新成功',
					icon:'none'
				})
				//关闭刷新状态
				uni.stopPullDownRefresh()
			})
		},
		methods:{
			//初始化搜索
			initSearch(){
				this.label.selected = 0
				this.condition = {}
				this.page = 1
			},
			//搜索
			search(){
				if(this.keyword === ''){
					return uni.showToast({
						title:'关键词不能为空',
						icon:'none'
					})
				}
				//app隐藏软键盘
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				// #ifndef APP-PLUS
				uni.hideKeyboard()
				// #endif
				this.addHistory()
				this.initSearch()
				this.getData()
			},
			addHistory(){
				//拿到所有的搜索历史
				let history = uni.getStorageSync('searchHistory')
				history = history ? JSON.parse(history) : []
				//判断之前是否有该搜索记录
				let index = history.indexOf(this.keyword)
				if(index === -1){
					history.unshift(this.keyword)
				}else{
					//搜索输入内容检索置顶
					history.unshift(history.splice(index,1)[0])
				}
				//存储到本地(同步)
				uni.setStorageSync('searchHistory',JSON.stringify(history))
			},
			//加载数据
			getData(refresh = true,callback = false){
				this.$H.post('/goods/search',{
					title:this.keyword,
					page:this.page,
					...this.options,
					...this.condition
				}).then((res)=>{
					let page = refresh ? 1 : this.page
					let list = this.forma(res)
					//给标识判断刷新还是加载数据
					this.list = refresh? [...list] : [...this.list,...list]
					//恢复加载状态
					this.loadingText =res.length < 10 ? '没有更多了':'上拉加载更多'
					if(typeof callback === 'function'){
						callback()
					}
				})
			},
			//格式化
			forma(res){
				return res.map(item=>{
					let good_num = (item.comments_count === 0 ? 0:(item.comments_good_count / item.comments_count) * 100).toFixed(2) +'%'
					return{
						id:item.id,
						title:item.title,
						titlepic:item.cover,
						desc:item.desc,
						pprice:item.min_price,
						comment_num:item.comments_count,
						good_num:good_num
					}
				})
			},
			changeScreen(index){
				//当前点击是否已经激活
				let oldIndex = this.screen.currentIndex;
				let oldItem = this.screen.list[oldIndex];
				if (oldIndex === index) {
					oldItem.status = oldItem.status === 1 ? 2 : 1;
					this.getData()
					return;
				}
				let newItem = this.screen.list[index];
				//移除旧激活状态，变成新的激活状态
				oldItem.status = 0;
				this.screen.currentIndex = index;
				//增加新激活状态
				newItem.status = 1;
				//刷新数据
				this.getData()
			},
			// radioChande(index){ //单选框change触发事件
			// 	this.label.selected = index;
			// }
			//打开筛选抽屉
			showDrawer(){
				this.showRigth = true
				//记录已选的值
				this.oldSelected = this.label.selected
			},
			//筛选的确定事件
			confirm(){
				//组织筛选条件
				this.getCondition()
				//刷新数据
				this.getData()
				//关闭抽屉
				this.showRigth = false
			},
			//组织筛选条件
			getCondition(){
				let item = this.label.list[this.label.selected]
				this.condition = item.rule && item.value ? { price:item.rule+','+item.value } : {}
			},
			//关闭抽屉
			closeDrawer(){
				//恢复原来选中
				this.label.selected = this.oldSelected
				//关闭抽屉
				this.showRigth = false
				//重置
				this.oldSelected = 0
			},
			//重置筛选
			reset(){
				this.condition = {}
				this.label.selected = 0
				//刷新数据
				this.getData()
				//关闭抽屉
				this.showRigth = false
			}
		}
	}
</script>

<style>
	
</style>
