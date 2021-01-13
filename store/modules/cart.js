import $H from '@/common/lib/request.js'
import $U from '@/common/lib/util.js'

export default{
	state:{//数据源
		list:[],
		//选中列表(存放选中的id)
		selectedList:[],
		//popup显示
		popupShow:'none',
		//操作商品的索引 开始未选中-1
		popupIndex:-1,
		popupData:{}
	},
	getters:{//计算属性,可处理数据,省去页面数据处理
		//判断是否全选
		checkedAll:(state) =>{
			return state.list.length === state.selectedList.length
		},
		//合计
		totalPrice:(state) =>{
			let total = 0
			state.list.forEach(v =>{
				if(state.selectedList.indexOf(v.id) > -1){
					total += v.pprice*v.num
				}
			})
			return total
		},
		//购物车无商品时禁用全选按钮
		disableSelectAll:(state) =>{
			return state.list.length === 0
		},
		//购物车商品数量
		cartCount:(state)=>{
			if(state.list.length <= 99){
				return state.list.length
			}
			return '99+'
		}
	},
	mutations:{//唯一改变数据源方法，同步
		//初始化list
		initCartList(state,list){
			state.list = list
			//tabbar角标
			$U.updateCartBadge(state.list.length)
		},
		//选中或取消选中单个商品
		selectItem(state,index){
			let id = state.list[index].id
			let i = state.selectedList.indexOf(id)
			//若之前是选中的，取消选中
			if(i > -1){
				//取消当前商品的选中状态
				state.list[index].checked = false
				//移除选中列表中的当前商品
				return state.selectedList.splice(i,1)
			}
			//之前是未选中的，改成选中
			state.list[index].checked = true
			state.selectedList.push(id)
		},
		//全选
		selectAll(state){
			state.selectedList = state.list.map(v =>{
				//设置选中状态
				v.checked = true
				return v.id
			})
		},
		//取消全选
		unSelectAll(state){
			state.list.forEach(v =>{
				//设置选中状态
				v.checked = false
			})
			state.selectedList = []
		},
		//删除选中
		delGoods(state){
			state.list = state.list.filter(v =>{
				return state.selectedList.indexOf(v.id) === -1
			})
		},
		//当前商品索引popupIndex    初始化popupIndex
		initPopupIndex(state,index){
			state.popupIndex = index
		},
		//加入购物车
		addGoodsToCart(state,goods){
			state.list.unshift(goods)
			//tabbar角标
			$U.updateCartBadge(state.list.length)
		},
		//清空购物车
		clearCart(state){
			state.list = []
			state.selectedList = []
			$U.updateCartBadge(state.list.length)
		}
	},
	actions:{//异步方法，分发mutation
	//传参->解构赋值 { }
		//更新购物车列表
		updateCartList({state,commit}){
			return new Promise((resolve,reject)=>{
				$H.get('/cart',{},{
					token:true,
					toast:false
				}).then(res=>{
					//取消选中状态
					commit('unSelectAll')
					//赋值
					commit('initCartList',res)
					resolve(res)
				}).catch(err =>{
					reject(err)
				})
			})
		},
		//全选
		doSelectAll({commit,getters}){
			getters.checkedAll ? commit('unSelectAll'):commit('selectAll')
		},
		doDelGoods({commit,state}){
			//未选中商品
			if(state.selectedList.length === 0){
				return uni.showToast({
					title:'请选择要删除的商品',
					icon:'none'
				})
			}
			uni.showModal({
				content: '确定删除选中？',
				success: (res) =>{
					if (res.confirm) {
						$H.post('/cart/delete',{
							shop_ids:state.selectedList.join(',')
						},{
							token:true
						}).then(res=>{
							commit('delGoods')
							//删除后取消选中状态
							commit('unSelectAll')
							uni.showToast({
								title: '删除成功'
							})
						})
					}
				}
			})
			//tabbar角标
			$U.updateCartBadge(state.list.length)
		},
		//popup的显示
		doShowPopup({state,commit},{index,data}){
			//获取初始商品索引popupIndex
			commit('initPopupIndex',index)
			state.popupData = data
			state.popupData.item = state.list[index]
			state.popupShow = 'show'
		},
		//popup的隐藏
		doHidePopup({state,commit}){
			state.popupShow = 'hide'
			setTimeout(()=>{
				state.popupShow = 'none'
				//隐藏初始商品索引popupIndex
				commit('initPopupIndex',-1)
			},200)
		},
	}
}