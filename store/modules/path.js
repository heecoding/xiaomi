export default{
	state:{
		list:[
			{
				name:'姓名',
				phone:'188****8888',
				path:'河南省 郑州市 金水区',
				detailPath:'CBD',
				isDefault:false
			},
			{
				name:'姓名',
				phone:'188****8888',
				path:'河南省 郑州市 金水区',
				detailPath:'CBD',
				isDefault:false
			}
		],
	},
	getters:{
		//获取默认地址状态
		defaultPath:(state) => {
			return state.list.filter(v => v.isDefault )
		}
	},
	mutations:{
		//创建收货地址
		createPath(state,item){
			state.list.unshift(item)
		},
		//删除收货地址
		delPath(state,index){
			state.list.splice(index,1)
		},
		//修改收货地址
		updataPath(state,{index,item}){
			for(let key in item){
				state.list[index][key] = item[key]
			}
		},
		//取消默认地址    (使默认地址唯一)
		removeDefault(state){
			state.list.forEach(v =>{
				if(v.isDefault){
					v.isDefault = false
				}
			})
		}
	},
	actions:{
		//修改地址 并改变默认
		updataPathAction({commit},obj){
			if(obj.item.isDefault){
				commit('removeDefault')
			}
			commit('updataPath',obj)
		},
		//修改地址 并改变默认
		createPathAction({commit},item){
			if(item.isDefault){
				commit('removeDefault')
			}
			commit('createPath',item)
		}
	}
}