export default{
	state:{//数据源
		list:[
			{
				checked:false,
				id:11,
				title:'商品标题11',
				cover:'/static/images/s7.jpg',
				//选中商品属性
				attrs:[
					{
						title:'颜色',
						selected:0,
						list: [{ name: '火焰红' }, { name: '珊瑚蓝' }, { name: '珍珠白' }]
					},
					{
						title: '容量',
						selected: 0,
						list: [{ name: '128GB' }, { name: '256GB' }, { name: '520GB' }]
					},
					{
						title: '套餐',
						selected: 0,
						list: [{ name: '标配' }, { name: '套餐一' }, { name: '套餐二' }]
					}
				],
				pprice:1399,
				num:1,
				minnum:1,
				maxnum:10
			},
			{
				checked:false,
				id:12,
				title:'商品标题11',
				cover:'/static/images/s7.jpg',
				//选中商品属性
				attrs:[
					{
						title:'颜色',
						selected:0,
						list: [{ name: '火焰红' }, { name: '珊瑚蓝' }, { name: '珍珠白' }]
					},
					{
						title: '容量',
						selected: 0,
						list: [{ name: '128GB' }, { name: '256GB' }, { name: '520GB' }]
					},
					{
						title: '套餐',
						selected: 0,
						list: [{ name: '标配' }, { name: '套餐一' }, { name: '套餐二' }]
					}
				],
				pprice:1399,
				num:1,
				minnum:1,
				maxnum:10
			},
			{
				checked:false,
				id:13,
				title:'商品标题11',
				cover:'/static/images/s7.jpg',
				//选中商品属性
				attrs:[
					{
						title:'颜色',
						selected:0,
						list: [{ name: '火焰红' }, { name: '珊瑚蓝' }, { name: '珍珠白' }]
					},
					{
						title: '容量',
						selected: 0,
						list: [{ name: '128GB' }, { name: '256GB' }, { name: '520GB' }]
					},
					{
						title: '套餐',
						selected: 0,
						list: [{ name: '标配' }, { name: '套餐一' }, { name: '套餐二' }]
					}
				],
				pprice:1399,
				num:1,
				minnum:1,
				maxnum:10
			}
		],
		selectedList:[],
		//popup显示
		popupShow:'none',
		//操作商品的索引 开始未选中-1
		popupIndex:-1
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
		popupData:(state)=>{
			return state.popupIndex > -1 ? state.list[state.popupIndex] : {}
		}
	},
	mutations:{//唯一改变数据源方法，同步
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
		}
	},
	actions:{//异步方法，分发mutation
	//传参->解构赋值 { }
		doSelectAll({commit,getters}){
			getters.checkedAll ? commit('unSelectAll'):commit('selectAll')
		},
		doDelGoods({commit}){
			uni.showModal({
				content: '确定删除选中？',
				success: (res) =>{
					if (res.confirm) {
						commit('delGoods')
						uni.showToast({
							title: '删除成功'
						});
					}
				}
			});
		},
		//popup的显示
		doShowPopup({state,commit},index){
			//获取初始商品索引popupIndex
			commit('initPopupIndex',index)
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