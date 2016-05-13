/**
 * Project: www.qidian.com
 * Author: Luolei & Rainszhang
 */

'use strict'

var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var compress = require('compression'); // 压缩资源 放在顶部
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var morgan = require('morgan'); // http请求日志用
var chalk = require('chalk'); // 美化日志
var fs = require('fs');
var dateFormat = require('dateformat'); //时间戳转换
const envType = "local"; //全局环境
const templatePathPrefix = "local"; //去除域名前缀

var comboAnswer = require('koa-combo-answer');
var _ = require('underscore');

//载入静态资源相关配置
var serverConf = require('./src/node-config/server');
var staticConf = serverConf[envType]['static'];

//域名别名，在本地环境读取实际目录用
var domainAlias = {
    'f.qidian.com': 'free.qidian.com',
    'a.qidian.com': 'all.qidian.com',
    's.qidian.com': 'search.qidian.com',
    'fin.qidian.com': 'finish.qidian.com',
    'r.qidian.com': 'rank.qidian.com',
    'i.qidian.com': 'www.qidian.com'
};

// 基础配置
// app.use(compress()); // 启用Gizp压缩,放在顶部
app.use(morgan('dev')); // 日志
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// 允许资源跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


app.use(cookieParser());


// app.use(express.static(path.join(__dirname, 'src/json'))); //设置本地模拟ajax读取的json路径

app.set('port', process.env.PORT || 3234); // 设置默认端口

if (process.env.NODE_ENV == 'local') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.set('views', path.join(__dirname, 'src/views')); // 设置模板页面 本地测试
}

if (process.env.NODE_ENV == 'preview') {
    app.use(express.static(path.join(__dirname, '_tmp')));
    app.set('views', path.join(__dirname, '_previews')); // 设置preview模板页面
}

app.set('view engine', 'ejs'); // 载入ejs模板
app.engine('html', require('ejs').renderFile);


// 设置当前环境 - 这个配置文件，每个环境都不一样

/*
 * 本地：local
 * 开发：dev
 * 测试：oa
 * 生产：pro
 */


console.log(chalk.red('当前环境') + chalk.red(process.env.NODE_ENV));
// app.set('env', 'local');


/**
 * ================================================
 * 路由区域
 * ================================================
 */




/**
 * 载入通配路由规则
 */

//node-config下的routermap.js十分重要，是线上框架机的路由依赖文件
var routerMap = require('./src/node-config/dynamic_routermap.js');

//ajaxmap仅供本地调试用,约定好格式即可
var ajaxMap = require('./src/json/ajaxmap.js');

//目前本地开发基本上只有GET和POST两种请求方式，暂时提供这两种的同用配置
var ajaxPostMap = require('./src/json/ajaxpostmap.js');

/**
 * 处理cgi路由闭包
 */

//获取后端请求的路径与模板路径
var getRouterDomain = function(originHost, routerKey, val) {
    let routerVal, views, cgi;
    let useDefault = false; //使用默认当前目录

    if (domainAlias && domainAlias[originHost]) {
        originHost = domainAlias[originHost];
    }

    //先判断routes中是否有对应域名的配置，如果没有则认为是默认SITE，无域名目录，请求当前模板目录
    if (typeof val[originHost] !== "undefined") {
        routerVal = val[originHost]
    } else {
        //没有找到域名，取默认值_
        routerVal = val['_'];
        useDefault = true;
    }

    if (!routerVal) {
        return false;
    }

    if (typeof routerVal == "object" && routerVal) {
        views = routerVal['views'];
        cgi = routerVal['cgi'];
    } else {
        views = routerKey; //使用默认request path
        cgi = routerVal;
    }

    if (!useDefault) {
        views = "/" + originHost + views;
    }
    let ret = { "views": views, "cgi": cgi };
    // console.log(ret);
    return ret;
}

var configRouter = function(val) {

    return function(req, res, next) {
        console.log("match route:" + req.url);
        var that = this;
        var rawHeaders = {}; //获得默认header头,透传
        Object.assign(rawHeaders, req.headers);
        var originHost = rawHeaders['host'];

        //如果配了前缀域名，例如local.或者dev等，域名需要去除这个
        if (templatePathPrefix) {
            var pos = originHost.indexOf(templatePathPrefix);
            if (pos === 0) {
                originHost = originHost.substr(templatePathPrefix.length);
            }

            //去除端口
            var _tmp = originHost.split(":");
            originHost = _tmp[0];
        }

        var routerDomain = getRouterDomain(originHost, req.url, val);
        if (false === routerDomain) {
            console.log("no domain find");
            return next();
        }
        var templateFileName = routerDomain['views'];
        console.log("模板：" + templateFileName);
        var _cgiVal = routerDomain['cgi'];

        console.log("读取文件：" + __dirname + '/src/json' + _cgiVal + '.json')
        fs.readFile(__dirname + '/src/json' + _cgiVal + '.json', function(err, data) {
            if (err) throw err;
            var data = JSON.parse(data);
            //console.log('读取数据' + JSON.stringify(data));
            // 拉取到数据后再渲染页面
            data.envType = app.get('env');
            data.pageUpdateTime = "";
            data.staticConf = staticConf;
            var viewsPath = ''

            if (process.env.NODE_ENV == 'preview') {
                viewsPath = '/_previews'
            } else {
                viewsPath = 'src/views'
            }
            console.log('当前目录' + viewsPath)
            res.render(__dirname + viewsPath +templateFileName + '.html', data);
        });
    }
}


/**
 * ajax GET路由闭包
 */


var ajaxRouter = function(val) {
    var that = this;
    var _routerVal = val,
        _cgiVal = ajaxMap[_routerVal];
    // console.log('模拟ajax路由:' + _routerVal);
    // console.log('模拟ajax接口:' + _cgiVal);
    var _templateFileName = _.last(_routerVal.split('/'));
    return function(req, res, next) {
        console.log('路径是' + __dirname + '/src/json' + _cgiVal + '.json');
        fs.readFile(__dirname + '/src/json' + _cgiVal + '.json', function(err, data) {
            if (err) throw err;
            var data = JSON.parse(data);
            console.log('读取数据' + JSON.stringify(data));
            // 拉取到数据后再渲染页面
            res.send(data);
        });
    }
}


/**
 * ajax POST路由闭包
 */

var ajaxPostRouter = function(val) {
    var that = this;
    var _routerVal = val,
        _cgiVal = ajaxPostMap[_routerVal];
    console.log(chalk.red('模拟POST路由:') + _routerVal);
    console.log(chalk.red('模拟POST路由:') + _cgiVal);
    var _templateFileName = _.last(_routerVal.split('/'));
    return function(req, res, next) {
        console.log('路径是' + __dirname + '/src/json' + _cgiVal + '.json');
        fs.readFile(__dirname + '/src/json' + _cgiVal + '.json', function(err, data) {
            if (err) throw err;
            var data = JSON.parse(data);
            console.log('读取数据' + JSON.stringify(data));
            res.send(data);
        });
    }
}



/**
 * 遍历routermap.js 文件,所有的路由均有指定cgi接口匹配
 * 注意:路由对应指定cgi接口,请尤其注意
 */

//根据域名处理routerMap
function parseRouterMap(routerMap) {
    var routers = {};
    for (var routerVal in routerMap) {
        var reqPath = "";
        var domain = "_"; //未定义domain
        var pos = routerVal.indexOf("/");
        if (pos === 0) { //path
            reqPath = routerVal;
        } else { //域名
            domain = routerVal.substr(0, pos);
            reqPath = routerVal.substr(pos);
        }

        if (!routers[reqPath]) {
            routers[reqPath] = {};
        }
        routers[reqPath][domain] = routerMap[routerVal]
    }
    return routers;
}


var routes = parseRouterMap(routerMap);
console.log(routes);
for (var routerVal in routes) {
    app.get(routerVal, configRouter(routes[routerVal]));
    // var _routerVal = routerVal,
    //     _cgiVal = routerMap[routerVal];
    // app.get(_routerVal, configRouter(_routerVal))
}


// 首页
app.get("/", function(req, res, next) {
    var UA = req.headers['user-agent'];
    /**
     * 本地可以使用json文件调试
     */
    // fs.readFile(__dirname + '/dev/page/index.json', function(err, data) {
    //     if (err) throw err;
    //     var data = JSON.parse(data);
    //     // 拉取到数据后再渲染页面
    //     data.pageUpdateTime = dateFormat(data.timeStamp,"yyyy年mm月dd日,HH:MM:ss")
    //     data.envType = app.get('env'); //设置环境变量
    //     data.staticConf = staticConf;
    //     res.render('limit.html', data);
    // });
    var _res = res;
    request('http://devi.qidian.com/mockup/home.json', function(err, res, data) {
        if (err) throw err;
        var data = JSON.parse(data);
        // 拉取到数据后再渲染页面
        data.pageUpdateTime = dateFormat(data.timeStamp, "yyyy年mm月dd日,HH:MM:ss")
        data.envType = app.get('env'); //设置环境变量
        data.staticConf = staticConf;
        _res.render('index.html', data);
    })
});



/**
 * 遍历ajaxmap.js 文件
 * 注意,此接口为本地模拟ajax请求调试用
 */

for (var ajaxVal in ajaxMap) {

    console.log(ajaxVal + ':' + ajaxMap[ajaxVal]);
    // console.log(routerVal);
    var _ajaxVal = ajaxVal,
        _cgiVal = ajaxMap[ajaxVal];
    // console.log('ajax接口' + _ajaxVal);
    app.get(_ajaxVal, ajaxRouter(_ajaxVal))
}


/**
 * 遍历ajaxmap.js 文件
 * 注意,此接口为本地模拟ajax POST请求调试用
 */

console.log(ajaxPostMap);
for (var ajaxVal in ajaxPostMap) {

    console.log(ajaxVal + ':' + ajaxPostMap[ajaxVal]);
    // console.log(routerVal);
    var _ajaxVal = ajaxVal,
        _cgiVal = ajaxPostMap[ajaxVal];
    // console.log('ajax接口' + _ajaxVal);
    app.post(_ajaxVal, ajaxPostRouter(_ajaxVal))
}

app.get('/404', function(req, res) {
    res.render('404.html');
});




// 启动server

app.listen(app.get('port'), function() {
    console.log(chalk.green('[服务器启动],端口: ' + app.get('port')));
});
