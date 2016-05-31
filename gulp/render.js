/**
 * ejs转纯html 静态化
 * Author: Luolei
 */
'use strict'

var fs = require('fs');
var _ = require('underscore');


var PROJECT_CONFIG = require('../.yconfig'); //载入项目基础配置
var gulp = require('gulp');
var del = require('del');
var gulp = require('gulp');
var del = require('del');
var chalk = require('chalk'); // 美化日志
var combo = require('gulp-combo');
var prettify = require('gulp-jsbeautifier');
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠

var RevAll = require('gulp-rev-custom-tag');
var revReplace = require('gulp-rev-replace');
var bust = require('gulp-buster');
var gulpCopy = require('gulp-copy');


var ejs = require('gulp-ejs');
var gutil = require('gulp-util');


const envType = "build"; //全局环境
var serverConf = require('../src/node-config/server');
var staticConf = serverConf[envType]['static'];


var paths = {
    sass: 'src/static/**/*.scss',
    build: 'build',
    prelease: '_prelease'
};


//node-config下的routermap.js十分重要，是线上框架机的路由依赖文件
var routerMap = require('../src/node-config/local_dev_routermap.js');
// console.log(routerMap);
//获取后端请求的路径与模板路径
var getRouterDomain = function(originHost, routerKey, val) {
    let routerVal, views, cgi;
    let useDefault = false; //使用默认当前目录
    console.log(originHost);
    console.log(domainAlias[originHost]);
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



var _osPath = __dirname;
_osPath = gulpSlash(_osPath); // 这里处理一下windows下路径的兼容
var _currentFolderPath = _osPath.split('/');
var _srcFolderPath = _currentFolderPath.slice(0, _currentFolderPath.length - 1).join('/') + '/src';



gulp.task('ejs', function(cb) {
    // console.log(_srcFolderPath);
    console.log(staticConf);
    var _routers = [],
        _domains = [];
    for (var k in routerMap) {
        _routers.push(k);
        var _thisDomain = k.split('/')[0];
        if (_domains.indexOf(_thisDomain) == -1) {
            _domains.push(_thisDomain)
        }
    }
    console.log(chalk.green('共有' + _domains.length + '子站'));
    console.log(chalk.green('共有' + _routers.length + '条路由'));
    // console.log(routerMap);
    var i = 0;
    for (i; i < _routers.length; i++) {
        // console.log(_routers[i]);
        // console.log(_routers[i]);
        var _thisTpl = _routers[i];
        // console.log(_thisTpl);
        // console.log(_thisTpl);
        var _thisRouterDomain = _thisTpl.split('/')[0]; //先找到当前路由的主域名
        var _thisViewsFileName = routerMap[_thisTpl]['views']
        var _tplViewsPath = _thisRouterDomain + _thisViewsFileName + '.html'

        // console.log(_tplViewsPath);
        var _thisCgi = routerMap[_thisTpl]['cgi'];
        // console.log(_tplViewsPath); //获得原来的数据
        // console.log('cgi: ' + _thisCgi);
        // console.log(_srcFolderPath + '/views/' + _tplViewsPath);
        // console.log(_srcFolderPath + '/json' + _thisCgi + '.json');

        var _thisRenderString = fs.readFileSync(_srcFolderPath + '/json' + _thisCgi + '.json', 'utf-8', function(err, data) {
        });
        // console.log('读取文件');
        var data = JSON.parse(_thisRenderString);
        //console.log('读取数据' + JSON.stringify(data));
        // 拉取到数据后再渲染页面
        data.envType = 'local';
        data.pageUpdateTime = "";
        data.staticConf = staticConf;
        data.pageUpdateTime = '';
        // console.log('原文件:' + _srcFolderPath + '/views/' + _tplViewsPath);
        try {
            gulp.src(_srcFolderPath + '/views/' + _tplViewsPath)
                .pipe(ejs(data))
                .pipe(gulp.dest('./_html/' + _thisRouterDomain));
        } catch (e) {
            console.log(e);
        }



    }

});
