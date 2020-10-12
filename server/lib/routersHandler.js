/**
 * 读取路由映射,做转换处理
 * Module dependencies.
 * Author:luolei@yuewen.com
 */

'use strict';
const _ = require('lodash');
const PROJECT_CONFIG = require('../../yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const fs = require('fs');
const parse = require('url-parse'); // 获得URL处理模块

const routes = {};
const domainList = [];
// 首先读取动态路由
const dynamic_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.routermap_file))

// 读取线上静态化路由:本地均当成动态路由来进行模拟
const static_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.static_routemap_file))

// 读取本地静态化路由:本地均当成动态路由来进行模拟
if (PROJECT_CONFIG.tasks.render && fs.existsSync( path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.tasks.render.render_routermap_file))) {
    var render_routes =  require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.tasks.render.render_routermap_file));
}else{
    var render_routes = {};
}

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
 * 获得本地静态化业务路由
 * @param  {[type]} routerMap [description]
 * @return {[type]}           [description]
 */
exports.getRenderList = function(routerMap){
    return render_routes;
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

        var fixRouterConf = {
            views: "",
            cgi: ""
        };
        var thisRouterView = routerMap[routerVal]['views'];
        //域名不做处理,如果没有cgi,则默认补全
        fixRouterConf.cgi = !!(routerMap[routerVal]['cgi']) ? routerMap[routerVal]['cgi'] : '';
        if (routerMap[routerVal]['localcgi']) {
            fixRouterConf.cgi = !!(routerMap[routerVal]['localcgi']) ? routerMap[routerVal]['localcgi'] : '';
        }

        // 注入 GQL 需要的参数
        if (routerMap[routerVal]['schema']) {
            fixRouterConf['schema'] = routerMap[routerVal]['schema'];
            fixRouterConf['args'] = routerMap[routerVal]['args'];
            fixRouterConf['variables'] = routerMap[routerVal]['variables'];
            fixRouterConf['handlerWithData'] = routerMap[routerVal]['handlerWithData'];
        }

        var reqPath = "";
        var domain = "_"; //未定义domain
        var pos = routerVal.indexOf("/");

        //如开以 / 开头,则理解成无配置域名
        if (pos === 0) { //path
            reqPath = routerVal;
            fixRouterConf = routerMap[routerVal];
        } else { //域名
            domain = routerVal.substr(0, pos);
            reqPath = routerVal.substr(pos);
            //如果views没有补全域名,则补全域名
            if (!!thisRouterView && (thisRouterView).indexOf('/') === 0 && thisRouterView.indexOf(domain) === -1) {
                fixRouterConf.views = domain + thisRouterView;
            } else {
                fixRouterConf.views = thisRouterView;
            }

        }

        if (!routers[reqPath]) {
            routers[reqPath] = {};
        }

        routers[reqPath][domain] = fixRouterConf;
    }
    return routers;

}
