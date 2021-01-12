import Vue from 'vue'
import App from './App'
import store from './store'

//绑定仓库
Vue.prototype.$store = store
// 全局组件line 多用
import myline from './components/common/myline.vue'
// 全局组件loading 多用
import loadingPlus from './common/mixin/loading-plus.vue'

// 引入request库
import $H from '@/common/lib/request.js'
Vue.prototype.$H = $H

//权限跳转（登录）（拦截：原型上添加方法，调用时传参并判断操作，进行合理跳转）
Vue.prototype.navigateTo = (options)=>{
	//判断是否已经登录
	if(!store.state.user.loginStatus){
		uni.showToast({
			title:'请先登录',
			icon:'none'
		})
		return uni.navigateTo({
			url:'/pages/login/login'
		})
	}
	uni.navigateTo(options)
}
//更新tabbar角标
import $U from './common/lib/util.js'
Vue.prototype.$U = $U

Vue.component('myline',myline)
Vue.component('loading-plus',loadingPlus)

Vue.config.productionTip = false

App.mpType = 'app'

//挂在到实例上
const app = new Vue({
	store,
    ...App
})
app.$mount()
