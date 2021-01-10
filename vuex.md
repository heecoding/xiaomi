####vuex模块化
//都写在同一个index.js内代码较多，后期维护难度较大

+ 在store内新建.js文件，并在index.js内引入
	import cart from "./modules/cart.js"
//挂载到实例上
	export default new Vuex.Store({
		modules:{
			cart
		}
	})
	
this.$store.state.cart.[]

//模块化改变的是数据源，this.$store.state.cart.[]
+	//调用数据源时，加上模块名
+	//其他（getters报错，调用前一个，mutations，actions两个同名方法都会被调用），注意命名冲突！

##根目录创建store文件>index.js文件
#	index.js >
	import Vue from 'vue'
	import Vuex from 'vuex'
	
	Vue.use(Vuex)
	
	export default new Vuex.Store({
		state:{//数据源
			list:[
				{
					id:1,
					name:'sss',
					status:false
				},
				{
					id:1,
					name:'sss',
					status:true
				}
			]
		},
		getters:{//计算属性
			
		},
		mutations:{//唯一改变数据源的方法，同步
			
		},
		action:{//异步分发dispatch mutations
			
		},
		module:{//分管store
			
		}
	})
	
#	main.js >
	//引入store
	import store from './store'
	//绑定store
	Vue.prototype.$store = store
	//挂载到实例
	const app = new Vue({
		...App,
		store
	})
	app.$mount()
	
####数据调用state
##1.直接调用
	this.$store.state[]
##2.数据导入形式
+	页面引入Vuex,解构赋值，小写的vuex
+	import {mapState} from 'vuex'
	
+	computed:mapState({
		//接收数据并赋值给list
		lsit: state => state.list 
	}),
	//this.list拿数据
	
+	computed:mapState({
		//数据对应字符串'list'接收数据并赋值给list
		lsit:'list'
	}),
	//this.list拿数据
	
+	computed:mapState({
		//接收数据过滤并赋值给newList
		newList(state){
			return state.list.filter(v => v.status)
		} 
	}),
	//this.newList拿数据
	
##	computed:{
		//不影响计算属性
		...mapState({
			//接收数据过滤并赋值给newList
			newList(state){
				return state.list.filter(v => v.status)
			} 
		}),
		
	}
	//this.newList拿数据
	
##	computed:{
		//不影响计算属性
		//数据对应字符串'list'接收数据 [] 对应数组数据
		...mapState([
			//多个数据可同时获取，原名称''
			'list','',''
		]),
		
	}
	//this.list拿数据

####数据调用getters
+	1.直接调用
+	this.$store.getters.noActiveList
	
+	2.页面引入Vuex,解构赋值，小写的vuex
+	import {mapState,mapGetters} from 'vuex'

+	computed:{
		//不影响计算属性
		...mapState({
			//接收数据过滤并赋值给newActive
			newActive:'activeList',
			newnoActiveList:'noActiveList'
		}),
		
	}
	//this.newActive拿数据

+	computed:{
		//不影响计算属性
		//数据对应字符串'activeList'接收数据 [] 对应数组数据
		...mapState([
			//多个数据可同时获取，原名称''
			'activeList','noActiveList'
		]),
		
	}
	//this.activeList拿数据
+ 	//传参
+ 	//getters内
		getById:(state) => (id) => {
			return state.list.filter(v => v.id === id)
		}
	//组件内
	computed:{
		...mapGetters({
			activeList:'activeList',
			noActiveList:'noActiveList',
			getList:'getList',
			getById:'getById'
		}),
	},
	//this.getById(1)
	
####数据调用mutations 同步
+	1.直接调用
+	this.$store.mutations.inc
	
+	2.页面引入Vuex,解构赋值，小写的vuex
+	import {mapState,mapGetters,mapMutations} from 'vuex'

+	methods:{
		//不影响方法
		...mapMutations({
			//接收数据过滤并赋值给inc
			inc:'inc'
		}),
		
	}
	//this.inc改数据

+	methods:{
		//不影响计算属性
		//数据对应字符串'activeList'接收数据 [] 对应数组数据
		...mapMutations([
			//多个数据可同时获取，原名称''
			'inc',''
		]),
		
	}
	//this.inc改数据
	
+ 	//传参
+ 	//mutations内
		inc(state,n){
			state.num += n
			console.log(state.num)
		}
	//组件内
	methods:{
		...mapMutations({
			inc:'inc'
		}),
	},
	//this.inc(10)
	
####数据调用actions 异步
	actions:{//异步方法，分发mutation
		AsyncInc(context,n){
			console.log(n)
			//等同于this.$store.commit()
			setInterval(() => {
				context.commit('inc',n)
				
			},2000)
		}
	}
+	1.直接调用
+	this.$store.dispatch('AsyncInc')
	
+	2.页面引入Vuex,解构赋值，小写的vuex
+	import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'

+	methods:{
		//不影响方法
		...mapActions({
			//接收数据过滤并赋值给AsyncInc
			AsyncInc:'AsyncInc'
		}),
		
	}
	//this.AsyncInc改数据

+	methods:{
		//不影响计算属性
		//数据对应字符串'activeList'接收数据 [] 对应数组数据
		...mapActions([
			//多个数据可同时获取，原名称''
			'AsyncInc',''
		]),
		
	}
	//this.AsyncInc改数据
	
+ 	//传参
+ 	//actions内
		AsyncInc(context,n){
			console.log(n)
			//等同于this.$store.commit()
			setInterval(() => {
				context.commit('inc',n)
				
			},2000)
		}
	//组件内
	methods:{
		...mapActions({
			AsyncInc:'AsyncInc'
		}),
	},
	//this.AsyncInc(10)
	
	解构简洁表达
	//actions内
		AsyncInc({commit,state},n){
			console.log(n)
			setInterval(() => {
				commit('inc',n)
				console.log(state.num)
			},2000)
		}