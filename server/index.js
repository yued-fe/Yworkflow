'use strict';

/**
 * Yworkflow 启动 server
 * @module server/index
 */

const path = require('path');

const entry = require('./serverProxy.js');
const PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置

const dynamic_routes = require(path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, PROJECT_CONFIG.server.routermap_file));

// 提取走本地的静态路由
let staticMap = PROJECT_CONFIG.paths.static,
    localStaticMap = {};
if (typeof staticMap === 'string') {
    localStaticMap = staticMap;
} else {
    for (let route of Object.keys(staticMap)) {
        // 没有有http的需要本地
        if (!staticMap[route].startsWith('http')) {
            localStaticMap[route] = path.join(PROJECT_CONFIG.absPath, staticMap[route]);
        }
    }
}

// mock路由
const mockAjax = PROJECT_CONFIG.ajax;
mockAjax.push('/page', '/mpage');

// 启动
entry({
    // 主端口
    port: PROJECT_CONFIG.port,
    masterhost: PROJECT_CONFIG.master_host,
    // 域名转换
    alias: PROJECT_CONFIG.alias,
    // 需要走yworkflow的host
    hosts: PROJECT_CONFIG.hosts,
    // mock转发路由
    ajax: mockAjax,
    // 静态化路由
    staticMap: staticMap,
    // /ejs 代理
    ejsRewriteRouter: PROJECT_CONFIG.paths.ejs_rewrite_router ||  '/ejs',

    mockConf: {
        port: PROJECT_CONFIG.port + 1,
        jsonPath: path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.json),
        publicJsonPath: path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.public_json),
        proxyForce: PROJECT_CONFIG.proxy_force,
        proxyServer: PROJECT_CONFIG.proxy_server
    },
    staticConf: {
        port: PROJECT_CONFIG.port + 2,
        staticMap: localStaticMap
    },
    yuenodeConf: {
        proxyServer: PROJECT_CONFIG.proxy_server,
        NODE_SITE: PROJECT_CONFIG.node_site,
        ENV_TYPE: 'local',
        port: PROJECT_CONFIG.port + 3,
        path: path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path),
        server_conf_file: PROJECT_CONFIG.server.server_conf_file,
        routermap_file: PROJECT_CONFIG.server.routermap_file,
        extends_file: PROJECT_CONFIG.server.extends_loader_file,
        character_conversion: true
    }
});