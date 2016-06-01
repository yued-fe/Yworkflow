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


const envType = "local"; //全局环境
var serverConf = require('../src/node-config/server');
var staticConf = serverConf[envType]['static'];


var paths = {
    sass: 'src/static/**/*.scss',
    build: 'build',
    prelease: '_prelease'
};


//node-config下的routermap.js十分重要，是线上框架机的路由依赖文件
var routerMap = require('../src/node-config/local_dev_routermap.js');

var _osPath = __dirname;
_osPath = gulpSlash(_osPath); // 这里处理一下windows下路径的兼容
var _currentFolderPath = _osPath.split('/');
var _srcFolderPath = _currentFolderPath.slice(0, _currentFolderPath.length - 1).join('/') + '/src';

gulp.task('static-html', function(cb) {
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
    console.log(chalk.red('====静态转换模板文件==== Start'));
    console.log(chalk.green('共有' + _domains.length + '子站'));
    console.log(chalk.green('共有' + _routers.length + '条路由'));
    // console.log(routerMap);
    var i = 0;
    for (i; i < _routers.length; i++) {
        var _thisTpl = _routers[i];

        var _thisRouterDomain = _thisTpl.split('/')[0]; //先找到当前路由的主域名
        var _thisViewsFileName = routerMap[_thisTpl]['views']
        var _tplViewsPath = _thisRouterDomain + _thisViewsFileName + '.html'
            // console.log(_tplViewsPath);
        var _thisCgi = routerMap[_thisTpl]['cgi'];

        if (!!_thisCgi) {
            var _thisRenderString = fs.readFileSync(_srcFolderPath + '/json' + _thisCgi + '.json', 'utf-8');
            var data = JSON.parse(_thisRenderString);
        } else {
            var data = {};
        }
        //console.log('读取数据' + JSON.stringify(data));
        // 拉取到数据后再渲染页面

        var _evnVar = gutil.env.envConf ? gutil.env.envConf : 'local';
        console.log('设置的变量是' + _evnVar);
        var staticConf = serverConf[_evnVar]['static'];
        data.envType = _evnVar;
        data.pageUpdateTime = "";
        data.staticConf = staticConf;
        data.pageUpdateTime = '';
        console.log('原文件:' + _srcFolderPath + '/views/' + _tplViewsPath);
        try {
            // console.log(_srcFolderPath + '/_previews/' + _tplViewsPath);
            gulp.src('./_previews/' + _tplViewsPath)
                .pipe(ejs(data))
                .pipe(gulp.dest('./_html/' + _thisRouterDomain));
        } catch (e) {
            console.log(e);
        }



    }
    console.log(chalk.red('====静态转换模板文件==== End'));

});


/**
 * ARS在发布模板的同时,顺便把node-config发布到同一目录(ars就不用重复建单)
 */

gulp.task('copy-prelease',function(){
        console.log(chalk.red('复制[node-config]配置文件到 _previews/ 目录' ));
        gulp.src('src/node-config/**/*')
        .pipe(gulp.dest('./_previews/node-config'))
})
