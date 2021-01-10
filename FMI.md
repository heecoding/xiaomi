
##单位
####   upx  等同于微信小程序rpx   等同nvue的px
   #  以750宽为基准的自适应单位
   ##  将设计稿放进PS中，重新设计宽度为750px 高等比例，切图时直接按照切出来的尺寸+upx
   





## App.vue引入全局公共样式zz.css仿bootstrap样式
####1.引入样式库
		uni.css      //官方ui库
		animate.css  //css动画库
		icon.css     //图标库
		common.css	 //公共样式库
####2.设置全局样式
	*1.page{
		height :100%;  //不设置影响滑块视图、swiper的样式显示
		font-size: 28upx;
		line-height: 1.8;
		background: #ffffff;
	}
	*2. image{    //图片默认100%宽度
		 width: 100%;
	}
	###image属性设置mode=''时，图片加载不好，会闪动，不如直接设置高度流畅（750x350）
	
	
	
	####构思数据
	顶部菜单--几种数据对象--以类型key：value+data:[{},{}]的形式构建数据
	
###   首页  (tabBar)加载（白屏优化）********（uniapp本身性能的问题 ->nvue原生渲染）
#1、添加组件显示正在加载中...//给页面一个进入动画（淡入）更快