/**
 * 读取路由映射,做转换处理
 * Module dependencies.
 * Author:luolei@yuewen.com
 */

'use strict';
const _ = require('lodash');

const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const parse = require('url-parse'); // 获得URL处理模块

const routes = {};
const domainList = [];
// 首先读取动态路由
const dynamic_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.routermap_file))

// 读取静态化路由:本地均当成动态路由来进行模拟
const static_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.static_routemap_file))


const staticViews = Object.keys(static_routes).map(function(routeKey) {
    return static_routes[routeKey].views.replace(/^\/|\.html$/g, ''); // 将静态化路由的views转换成和动态化路由的views一致
});


Object.keys(dynamic_routes).forEach(function(routeKey) {
    const delimiterIndex = routeKey.indexOf('/');
    const routeHost = routeKey.slice(0, delimiterIndex);
    const routePath = routeKey.slice(delimiterIndex);

    if (!routes[routePath]) {
        routes[routePath] = {};
    }
    let thisDomain = routeKey.split('/')[0]

    if(domainList.indexOf(thisDomain) === -1 ){
        domainList.push(thisDomain)
    }

    routes[routePath][routeHost] = dynamic_routes[routeKey];
});

/**
 * 获得该业务使用到的所有域名列表
 * @param  {[type]} routerMap [description]
 * @return {[type]}           [description]
 */
exports.getDomainsList = function(routerMap){
    return domainList;
}


/**
 * 对配置的路由做兼容处理,统一转成带完整路由 和 完整路径views模式
 * @param  {[type]} originHost [description]
 * @param  {[type]} routerKey  [description]
 * @param  {[type]} val        [description]
 * @return {[type]}            [description]
 */
exports.parseRouterMap = function(routerMap) {
    var routers = {};
    for (var routerVal in routerMap) {

        var _fixRouterConf = {
            views: "",
            cgi: ""
        };
        var _thisRouterView = routerMap[routerVal]['views'];
        //域名不做处理,如果没有cgi,则默认补全
        _fixRouterConf.cgi = !!(routerMap[routerVal]['cgi']) ? routerMap[routerVal]['cgi'] : '';

        var reqPath = "";
        var domain = "_"; //未定义domain
        var pos = routerVal.indexOf("/");

        //如开以 / 开头,则理解成无配置域名
        if (pos === 0) { //path
            reqPath = routerVal;
            _fixRouterConf = routerMap[routerVal];
        } else { //域名

            domain = routerVal.substr(0, pos);
            reqPath = routerVal.substr(pos);
            //如果views没有补全域名,则补全域名
            if (!!_thisRouterView && (_thisRouterView).indexOf('/') === 0 && _thisRouterView.indexOf(domain) === -1) {
                _fixRouterConf.views = domain + _thisRouterView;
            } else {
                _fixRouterConf.views = _thisRouterView;
            }

        }

        if (!routers[reqPath]) {
            routers[reqPath] = {};
        }

        routers[reqPath][domain] = _fixRouterConf;
    }
    return routers;

}
