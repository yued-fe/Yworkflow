'use strict'

const qs = require('qs');

/**
 * 检查query字符串是否有问号开头
 * @param  {[type]} queryString [description]
 * @return {[type]}             [description]
 */
function queryStartMarkChecker(queryString){
    return  queryString = (queryString && queryString.indexOf('?') === -1 ) ? '?' + queryString : queryString ;
}


/**
 * 根据路由配置,重构proxy中的参数
 * 可以将路由中的通配符号转成 query 值
 * 'm.qidian.com/book/:bookId/:someId/forum': { views: 'm.qidian.com/book/forum', cgi: '/mpage/forum/getBookForum' },
 * 后台CGI转成 http://{CGI-SERVER}/mpage/forum/getBookForum?bookId={具体参数}&someId={具体参数}&others=...
 */
module.exports = function(searchQuery, params) {
	// 如果请求的实际路由与配置路由不相同,则对参数做rewrite处理
		let proxyQueryResult = Object.assign(searchQuery, params);
		searchQuery = qs.stringify(proxyQueryResult, {
			encode: false // 为方便调试,关闭encode
		})
	// 如果query值存在且开头无问号,则自动补全
	searchQuery = queryStartMarkChecker(searchQuery);
	console.log(searchQuery)
	return searchQuery;
};
