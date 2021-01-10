export default{
	state:{
		//登陆状态
		loginStatus:false,
		//token
		token:null,
		//用户信息
		userInfo:{}
	},
	getters:{
		
	},
	mutations:{
		//APP.vue初始化登录(应用关闭后再次访问)
		initUser(state){
			let resInfo = uni.getStorageSync('userInfo')
			if(resInfo){
				resInfo = JSON.parse(resInfo)
				state.userInfo = resInfo
				state.token = resInfo.token
				state.loginStatus = true
			}
		},
		//登录
		login(state,userInfo){
			state.userInfo = userInfo
			state.loginStatus = true
			state.token = userInfo.token
			//持久化存储(localStorage) (同步)
			uni.setStorageSync('userInfo',JSON.stringify(userInfo))
		},
		//退出登录
		loginout(state){
			state.userInfo = {}
			state.loginStatus = false
			state.token = null
			//清除持久数据
			uni.removeStorageSync('userInfo')
		}
	}
}