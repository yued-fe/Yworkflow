/**
 * @fileOverview
 * @author rainszhang & luolei
 * Created: 16-5-12
 */

// key: ajax路由名称
// value: 对应的模拟json基于 dev/ 文件夹的路径
var routerMap ={

	// 加入书架
	'/ajax/BookShelf/add': '/ajax/BookShelf/add',

	// 拉取限时免费时间戳
	'/ajax/Free/getSysTime': '/ajax/Free/getSysTime',

	// 搜索自动完成
	'/ajax/Search/AutoComplete': '/ajax/Search/AutoComplete',

	// 拉取用户信息
	'/ajax/UserInfo/GetUserInfo': '/ajax/UserInfo/GetUserInfo'
};

module.exports = routerMap;

