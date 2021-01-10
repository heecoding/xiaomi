<template>
	<view class="bg-white">
		<!-- #ifdef MP -->
		<!-- 自定义导航 微信小程序 -->
		<view class="d-flex a-center " style="height: 90rpx;">
			<!-- 左边 -->
			<view class="d-flex a-center j-center" style="width: 85rpx;">
				<text class="iconfont icon-xiazai16"></text>
			</view>
			<!-- 中间 -->
			<view class="flex-1 bg-light rounded d-flex a-center text-light-muted" style="height: 65rpx;">
				<text class="iconfont icon-sousuo mx-2"></text>
				智能积木
			</view>
			<!-- 右边 -->
			<view class="d-flex a-center j-center" style="width: 85rpx;">
				<text class="iconfont icon-saoyisao"></text>
			</view>
		</view>
		<!-- #endif -->
		
		<!-- 顶部选项卡 -->
		<scroll-view :scroll-with-animation="true" :scroll-into-view="scrollinto" scroll-x class="border-bottom scroll-row" style="height: 80upx;">
			<view
				:id="'tab' + index"
				@click="changeTab(index)"
				class="scroll-row-item px-3"
				style="height: 80upx; line-height: 80upx;"
				v-for="(item, index) in tabBars"
				:key="index"
				:class="tabIndex === index ? 'main-text-color border-bottom border-danger' : ''"
			>
				<text class="font-md">{{ item.name }}</text>
			</view>
		</scroll-view>
		<!-- 上下滑动的滑块，给固定高度才能滑动(PX) -->
		<swiper :duration="200" :current="tabIndex" :style="'height:' + scrollH + 'px'" @change="onChangeTab">
			<swiper-item v-for="(itemL, itemIndex) in newItems" :key="itemIndex">
				<scroll-view scroll-y="true" :style="'height:' + scrollH + 'px'" @scrolltolower="loadMore(itemIndex)">
					
					<template v-if="itemL.list.length > 0">
						<block v-for="(listData,listIndex) in itemL.list" :key="listIndex">
							
							<!-- 轮播组件 -->
							<indexSwiper v-if="listData.type === 'swiper'" :swiperData="listData.data" />
							<!-- 分类组件 -->
							<template v-else-if="listData.type === 'indexnavs'">
								<indexNav :navData="listData.data" />
								<!-- 全局分割线组件 -->
								<myline />
							</template>
							<!-- threeImg组件 -->
							<template v-else-if="listData.type === 'threeAdv'">
								<indexThreeImg :indexThreeImg="listData.data" />
								<myline style="background-color: #fff;" />
							</template>
							<!-- 卡片组件：标题+内容 -->
							<!-- <card headTitle="热门" bodyCover="/static/images/s4.webp" /> -->
							<!-- <card :showHead="false"> -->
								<!--绑定属性控制标题-->
								<!-- <block slot="cardTitle">猜你喜欢</block>
								<image src="/static/images/s4.webp" mode=""></image>
							</card>
							<myline />
							<card :showHead="false" bodyCover="/static/images/s5.webp" mode="widthFix" /> -->
							<!-- <myline /> -->
							<!-- 公共列表组件（单列组件x2+5间隙） 750-5=745/2=372.5-->
							<view class="row j-sb" v-else-if="listData.type === 'list'">
								<block  v-if="listData.type === 'list'" v-for="(item2, index2) in listData.data" :key="index2"><commonList :item="item2" :index="index2"></commonList></block>
							</view>
						</block>
						
						<template>
							<myline />
							<!-- 上拉加载更多 -->
							<view class="d-flex a-center j-center text-light-muted font-md py-3">{{itemL.loadingText}}</view>
						</template>
					</template>
					<template v-else-if="itemL.firstLoad === 'before' || itemL.firstLoad === 'ing'">
						<view class="d-flex j-center a-center pt-5">
							<text class="font-md text-light-muted">加载中...</text>
						</view>
					</template>
					<template v-else>
						<!-- 空数据 -->
						<view class="d-flex j-center a-center pt-5">
							<text class="font-md text-light-muted">暂无数据</text>
						</view>
					</template>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	
//引入组件，再注册组件
import indexSwiper from "@/components/index/index-swiper.vue" ;
import indexNav from "@/components/index/index-nav.vue";
import indexThreeImg from "@/components/index/index-threeImg.vue";
import card from "@/components/common/card.vue";
import commonList from "@/components/common/commonList.vue";
// import commonList from "@/components/common/commonList.vue"

export default {
	components:{ //注册组件
		indexSwiper,
		indexNav,
		indexThreeImg,
		card,
		commonList
	},
	data() {
		return {
			scrollinto:'',
			scrollH:500,
			tabIndex:0,
			tabBars:[],
			newItems:[]
		}
	},
	onLoad() {
		uni.getSystemInfo({
			success:(res) =>{
				// 条件编译自定义导航栏的高度(微信端)
				// #ifndef MP
				var navbarH = 0;
				// #endif
				// #ifdef MP
				var navbarH = uni.upx2px(90);
				// #endif
				
				// 获得可视区的高
				this.scrollH = res.windowHeight - uni.upx2px(80) - navbarH;
			}
		});
		// 初始化事件
		this.WXinit();
	},
	methods: {
		// 初始化页面事件
		WXinit(){
			//获取顶部选项卡
			this.$H.get('/index_category/data').then((res) =>{
				this.tabBars = res.category
				//根据顶部选项卡生成页面
				let arr = []
				for(let i = 0; i< this.tabBars.length; i++){
					//首屏数据已经初始化，特殊处理，标识已经完成 减少数据请求
					let firstLoad = i === 0 ? 'after' : "before"
					let obj = {
						list:[],
						loadingText:'上拉加载更多',
						//减少数据请求标识 首次加载：before加载前 after加载后
						firstLoad:firstLoad
					}
					//获取首屏数据
					if(i === 0){
						obj.list = res.data
					}
					arr.push(obj)
				}
				this.newItems = arr
			})
		},
		changeTab(index){//顶部菜单切换
			if(this.tabIndex === index) return;
			this.tabIndex = index;
			this.scrollinto = 'tab'+index //联动
			//判断请求
			if(this.newItems[index].firstLoad === 'after'){
				return
			}
			this.addData()
		},
		onChangeTab(e){//滑块列表监听
			this.changeTab(e.detail.current)
		},
		// 加载数据
		async addData(callback = false){
			//拿到当前索引
			let index = this.tabIndex
			//保存变量
			let obj = this.newItems[index]
			//拿到当前分类的id
			let id = this.tabBars[index].id;
			//拿到当前分类分页码  data内数据5条 0->1   3->2  5->2
			let page = Math.ceil(obj.list.length/5) + 1;
			//请求前
			if(page === 1){
				obj.firstLoad = 'ing'
			}
			//请求数据库
			let data = await this.$H.get('/index_category/'+id+'/data/'+page)
			//请求后
			if(page === 1){
				//请求完数据改变请求标识
				obj.firstLoad = 'after'
			}
			if(data){
				//合并 赋值
				obj.list = [...obj.list,...data]
				//状态恢复 没有更多
				if(data){
					obj.loadingText = data.length < 5? '没有更多了': '上拉加载更多'
				}
			}
			if(typeof callback === 'function'){
				callback()
			}
		},
		loadMore(index){//触底加载
			if(this.newItems[index].loadingText !== '上拉加载更多'){//能否加载
				return 
			}
			//上拉加载
			this.newItems[index].loadingText = '加载中...'
			this.addData(()=>{
				uni.showToast({
					title:'加载成功',
					icon:'none'
				})
			})
		}
	}
}
</script>

<style></style>
