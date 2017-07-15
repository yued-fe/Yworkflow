'use strict';

/**
 * Yworkflow server
 * 
 * @module server/yuenode
 */

const yuenode = require('yuenode-core');
const cookies = require('cookie');
const url = require('url');
const path = require('path');

const utils = require('./utils.js');
const PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置

// yuenode 启动参数
const opt = {
    NODE_SITE: PROJECT_CONFIG.node_site,
    ENV_TYPE: 'local',
    port: PROJECT_CONFIG.port,
    path: path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path),
    server_conf_file: PROJECT_CONFIG.server.server_conf_file,
    routermap_file: PROJECT_CONFIG.server.routermap_file,
    extends_file: PROJECT_CONFIG.server.extends_loader_file,
    character_conversion: true
};

// yworkflow 可以传入 getConfigs 所需参数进行启动，不依赖环境变量
const getConfigs = require('./lib/getConfigs.js')(opt);
const routerMap = getConfigs.getDynamicRouterMap();        // 动态路由
const siteConf = getConfigs.getSiteConf();
const serverConf = getConfigs.getServerConf();
const envType = getConfigs.getEnv();

/**
 * stateInfo
 * 动态静态路由都需要的渲染资料
 */
const stateInfo = {
    // 静态文件配置
    staticConf: serverConf.static || {},
    envType: envType || '',
    extends: getConfigs.getExtendsLoader()
};

const config = {
    yuenodeConf: siteConf,
    middlewares: [
        // 请求记录中间件
        {
            name: 'logger',
            options: {}
        },
        // 错误处理中间件
        {
            name: 'errorHandler',
            options: {
                // 渲染错误页要用的数据
                errorInfo: {
                    envType: envType || '',
                    staticConf: serverConf.static || {},
                    defaultSearch: { 'keywords': '' }
                }
            }
        },
        // 处理host
        function* (next) {
            // 处理 ip 和 localhost 访问
            const ipReg = /\d+\.\d+\.\d+\.\d(:\d+)?/i;
            const localReg = /localhost(:\d+)?/i;
            if (ipReg.test(this.host) || localReg.test(this.host)) {
                this.request.header.host = PROJECT_CONFIG.master_host;
            }
            // 去除 local 和 端口
            this.request.header.host = this.host.replace(/^local/i, '').replace(/:\d*$/, '');

            yield next;
        },
        // 判断代理域名，不符合转发出去
        function* (next) {
            if (PROJECT_CONFIG.hosts.includes(this.host)) {
                yield next;
            } else {
                // 转发请求
                const result = yield utils.proxyReq({
                    uri: this.protocol + '://' + this.host.replace(/^http(s)?:\/\//i,'') + utils.getRealUrl(this.url)
                }, this);
            }
        },
        // alias
        function* (next) {
            // alias
            if (PROJECT_CONFIG.alias[this.host]) {
                this.request.header.host = PROJECT_CONFIG.alias[this.host];
            }

            yield next;
        },
        // cors
        function* (next) {
            yield next;

            if (!this.header['Access-Control-Allow-Origin']) {
                this.set('Access-Control-Allow-Origin', '*');
            }
            if (!this.header['Access-Control-Allow-Headers']) {
                this.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
            }
        },
        // 针对旧有的 /ejs /ejs/qd 反向代理做特殊处理指向 /qd
        function* (next) {
            if (PROJECT_CONFIG.paths.ejs_rewrite_router && this.path.startsWith(PROJECT_CONFIG.paths.ejs_rewrite_router)) {
                this.request.path = this.request.path.replace(new RegExp('^' + PROJECT_CONFIG.paths.ejs_rewrite_router + '(/qd)?', 'i'),'/qd');
            }

            yield next;
        },
        // favicon
        {
            name: 'favicon',
            options: {
                root: serverConf.views.path
            }
        },
        // 简繁体转换
        {
            name: 'characterConversion',
            options: {
                conversionOn: siteConf.character_conversion,
            }
        },
        /**
         * 将模板渲染方法render注入koa，需要渲染时调用 this.render(views, cgiData);
         * 模板文件统一默认配置使用.html结尾
         * 为了提高服务器性能,默认配置开启cache
         * 模板发布后框架机通过后置脚本重启,所以无需考虑内存缓存问题
         */
        {
            name: 'addEjsRender',
            options: {
                root: PROJECT_CONFIG.paths.views ? path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.views) : serverConf.views.path
            }
        },
        // 兼容旧项目，将 COOKIE,UA,URL 等信息、自定义扩展、静态文件配置注入
        {
            name: 'addOldRenderInfo',
            options: {
                staticConf: serverConf.static || {},
                extendsLoader: getConfigs.getExtendsLoader()
            }
        },
    ],
    routers: [
        // mock 路由
        require('./router/mockRouter.js')({
            ajax: (() => {
                const mockAjax = PROJECT_CONFIG.ajax;
                mockAjax.push('/page', '/mpage');
                return mockAjax;
            })(),
            jsonPath: path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.json),
            publicJsonPath: path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.public_json),
            proxyForce: PROJECT_CONFIG.proxy_force,
            proxyServer: PROJECT_CONFIG.proxy_server
        }),
        // static 路由
        require('./router/staticRouter.js')({
            staticMap: (() => {
                for (let route of Object.keys(PROJECT_CONFIG.paths.static)) {
                    // 没有有http的需要本地
                    if (!PROJECT_CONFIG.paths.static[route].startsWith('http')) {
                        PROJECT_CONFIG.paths.static[route] = path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.static[route]);
                    }
                }
                return PROJECT_CONFIG.paths.static;
            })()
        }),
        // 启用模版渲染路由
        {
            name: 'dynamicRouter',
            options: {
                // 动态路由配置
                routerMap: routerMap,
                // 获取请求ip
                getRequestIP: function* (ctx) {
                    /**
                     * 如果在站点配置中开启L5，则通过L5获得后台服务IP或者域名，否则默认使用配置文件中的ip地址
                     * 由于L5需要服务器环境支持(依赖底层库),本地调试不载入L5模块防止出错。
                     */
                    if (siteConf.l5_on) {
                        const L5 = require('./lib/co-l5.js');
                        let reqHost = yield L5.getAddr(ctx, serverConf.cgi.L5);
                        return reqHost ? reqHost : serverConf.cgi.ip;
                    }
                    return 'localhost:' + PROJECT_CONFIG.port;
                },
                // 注入请求header
                getHeader: (header, ctx) => {
                    return Object.assign({
                        'x-host': ctx.header['x-host'] ? ctx.header['x-host'] : ctx.host,
                        'x-url': ctx.url,
                    }, header);
                },
                // 注入渲染数据
                getRenderData: (body, ctx) => {
                    const clientHost = ctx.header['x-host'] ? ctx.header['x-host'] : ctx.host;
                    const userClientUrl = ctx.protocol + '://' + clientHost + ctx.url;

                    // 将业务中较常使用到的信息作为通用信息抛给前端业务方使用
                    body.YUE = Object.assign(body.YUE || {}, stateInfo, {
                        ua: ctx.header['user-agent'],
                        location: url.parse(userClientUrl, true, true),
                        cookie: ctx.header.cookie,
                        cookieObj: cookies.parse(ctx.header.cookie),
                    });

                    return body;
                },
            }
        }
    ]
};

// 启动
yuenode(config);




