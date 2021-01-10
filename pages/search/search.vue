<template>
	<view>
		<card headTitle="搜索发现" bodyCover="../../static/images/search1.jpg"></card>
		<!-- 多色按钮 -->
		<view class="px-1 mb-2">
			<colorTag v-for="(item,index) in searchHost" :key="index" :item = "item" @click="quickSearch(item.name)" />
		</view>	
		<!-- 常用分类 -->
		<card headTitle="常用分类" :bodyPadding="true" :headBorderBottom="false">
			<colorTag v-for="(item,index) in searchCate" :key="index" :item = "item" :color="false" @click="quickSearch(item.name)" />
		</card>
		<template v-if="historyList.length > 0">
			<!-- 分割线 -->
			<myline />
			<!-- 搜索记录 -->
			<card headTitle="搜索记录">
				<view slot="right" class="font text-primary" @click="clearHistory">清除记录</view>
				<uni-list-item v-for="(item,index) in historyList" :key="index" :title="item" :showArrow="false" @click="quickSearch(item)"></uni-list-item>
			</card>
		</template>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue';
	import colorTag from '@/components/search/color-tag.vue';
	import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue";
	
	
	export default{
		components:{
			card,
			colorTag,
			uniListItem
		},
		data(){
			return{
				historyList:[],
				keyword:'',
				searchHost:[
					{name: '王一博同款手机'},
					{name: '手机选购指南'},
					{name: 'Note 9 新品'},
					{name: '小米10'},
					{name: 'Redmi K30 Pro'},
					{name: '出行'},
					{name: '家电'},
					{name: '全部商品'},
					{name: '卡丁车'},
					{name: '耳机'}
				],
				searchCate:[
					{name: '耳机'},
					{name: '手机'},
					{name: '音响'},
					{name: '手表'},
					{name: '配件'},
					{name: '健康'},
					{name: '家电'},
					{name: '笔记本'},
					{name: '空调'}
				]
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index === 0){
				uni.navigateTo({
					url:'../search-list/search-list',
				})
			}
		},
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text
		},
		onNavigationBarSearchInputConfirmed() {
			this.search()
		},
		onNavigationBarButtonTap() {
			this.search()
		},
		//onLoad只加载一次，onShow可重复
		onShow() {
			//加载搜索记录
			let history = uni.getStorageSync('searchHistory')
			this.historyList = history? JSON.parse(history):[]
		},
		methods:{
			//快捷搜索
			quickSearch(name){
				this.keyword = name
				this.search()
			},
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
				
				//携带搜索数据跳转
				uni.navigateTo({
					url:'../search-list/search-list?keyword='+this.keyword
				})
				setTimeout(()=>{
					//加入搜索记录(置顶效果隐藏)
					this.addHistory()
				},500)
			},
			//加入搜索记录
			addHistory(){
				let index = this.historyList.indexOf(this.keyword)
				if(index === -1){
					this.historyList.unshift(this.keyword)
				}else{
					//搜索输入内容检索置顶
					this.historyList.unshift(this.historyList.splice(index,1)[0])
				}
				//大于n条(6) 移除最后一条
				if(this.historyList.length > 6){
					this.historyList.splice((this.historyList.length - 1),1)
				}
				//存储到本地(同步)
				uni.setStorageSync('searchHistory',JSON.stringify(this.historyList))
			},
			//清除搜索记录
			clearHistory(){
				uni.showModal({
					title:'提示',
					content:'确认清除所有搜索记录吗',
					cancelText:'取消',
					confirmText:'清除',
					success: (res) => {
						if(res.confirm){
							this.historyList = []
							//单个移除
							uni.removeStorageSync('searchHistory')
							//清除所有(所有存储，用户登录等)
							// uni.clearStorageSync()
						}
					}
					
				})
			}
		}
	}
</script>

<style>
</style>
