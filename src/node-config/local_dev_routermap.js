/**
 * 本地调试使用的路由map
 * 动态和静态混合使用
 */

var routerMap = {
	//免费
    'yued.qidian.com/': {'views': '/index', 'cgi': '/page/yued/index'},
     'yued.qidian.com/demo': {'views': '/demo', 'cgi': ''} //可以把cgi置空,直接渲染原始html
    //下面实际为静态页面区域
}


module.exports = routerMap;
