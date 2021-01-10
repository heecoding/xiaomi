## nvue 要求比较严格！weex模式编译
## dom 模块用于对 weex 页面里的组件节点进行一部分特定操作。
##	const domModule = weex.requireModule('dom')
	

## css注意事项：
+   1. 单位只支持PX (不支持em、rem、pt、%、upx)
+	2. 宽高：宽750px = 100%，高1250px = 100%
+	手机屏幕phone678，750x1334 px
+		 把屏幕宽分为 750px（100%）
+		 一半为750/2 = 375px（50%）
+	3. 默认flex布局  div 默认（display:flex; flex-direction:column; flex-wrap:nowrap）
+	4. 不能合着写 (border:1px solid #ccc)=>(border-width:1px; border-style: solid; border-color: red;)
+		(margin: 10px 20px)=>(margin: 10px;)(margin-top:10px; margin-right:20px; margin-bottom:10px;)
+	5. 背景颜色只能用background-color
+	6. 选择器只支持单类 (不允许、class>div)
+	7. 样式引入：<style src="@/common/common.css"></style>
#组件的注意事项
+   1. 文本必须在text标签内 ，标签内不能换行！ ，div根节点
+   2. <list> 的子组件只能包括以下四种组件或是 fix 定位的组件
+   	<cell>：用于定义列表中的子列表项，类似于HTML中的UL之li，Weex会对 <cell> 进行高效的内存回收以达到更好的性能。
+   	<header> ：当 <header> 到达屏幕顶部时，吸附在屏幕顶部。
+   	<refresh> : 用于给列表添加下拉刷新的功能。
+   	<loading> :用法与特性和 <refresh> 类似，用于给列表添加上拉加载更多
+   3. 图片要给固定宽高。
+   
+   
#####    nvue 和 vue 间的通讯（一）
#####     // 接收信息的页面 uni.$on , uni.$emit 的方式进行页面通讯
    // $on(eventName, callback)  
    uni.$on('page-popup', (data) => {  
        console.log('标题：' + data.title)
        console.log('内容：' + data.content)
    })  

    // 发送信息的页面
    // $emit(eventName, data)  
    uni.$emit('page-popup', {  
        title: '我是title',  
        content: '我是content'  
    });
#####    过期1. 在 nvue 使用 uni.postMessage(data) 发送数据通讯，data 为 JSON格式（键值对的值仅支持String）。
#####    过期2. 在 APP.vue 里使用 onUniNViewMessage 进行监听。
  
###   vue 和 nvue 间的通讯（二）
###    1. 在 vue 里使用 plus.webview.postMessageToUninView(data,nvueId) 发消息，data 为 JSON 格式（键值对的值仅支持String），nvueId 为 nvue 所在webview 的 id ，webview 的 id 获取方式参考： $getAppWebview() 。
###    2. 在 nvue 里引用 globalEvent 模块监听 plusMessage 事件
    
##    vue 和 nvue 间的通讯（三）共享的变量和数据
##     nvue 不支持 vuex
 
##    1. uni.storage  vue 和 nvue 页面可以使用相同的 uni.storage 存储。 这个存储是持久化的。比如登录状态可以保存在这里。
##    2. globbalData 小程序有 global机制，这套机制在 uni-app里里也可以使用，全端通用。在 App.vue 文件里定义 globalData ，通过 getApp().globalData 获取数据。