import Vue from "vue"
import Vuex from "vuex"

//引入创建的vuex模块
import cart from "./modules/cart.js"
import path from "./modules/path.js"
import user from "./modules/user.js"

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		cart,
		path,
		user
	}
})