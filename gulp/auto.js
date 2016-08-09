/**
 * 命令行选择工具
 * Author: Luolei
 */
var LOCAL_FOLDER = __dirname.split('Yworkflow/')[0];
process.chdir(LOCAL_FOLDER)


var fs = require('fs');
var _ = require('lodash');

// var PROJECT_CONFIG = require('../../.yconfig'); //载入项目基础配置

var gulp = require('gulp');
var del = require('del');
var gulp = require('gulp');
var del = require('del');
var chalk = require('chalk'); // 美化日志
var prettify = require('gulp-jsbeautifier');
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠

var prompt = require('gulp-prompt');





gulp.task('auto-test', function() {

    gulp.src('../.yconfig')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'task',
            message: 'Which task would you like to run?'
        }, function(res) {
            console.log(res);
            //value is in res.task (the name option gives the key)
        }));


})


gulp.task('init', function() {
    console.log(chalk.red('检查本机器依赖配置'));
    /**
     * 首先初始化项目,设置项目在系统中的路径
     * @type {[type]}
     */
    var _localProjectFolderPath = __dirname.replace('/Yworkflow/gulp', '');
    var _localConfig = {}
    _localConfig.projectLoaclPath = _localProjectFolderPath;

    try {
        // Query the entry
        console.log('.yconfig配置已存在');
        stats = fs.lstatSync(LOCAL_FOLDER + '.yconfig');

        // Is it a directory?
        if (stats.isDirectory()) {
            // Yes it is
        }
    } catch (e) {
    	console.log('.yconfig配置不存在');
        // ...
    }
    /**
     * .local配置只记录当前开发者本机的环境,无需入库
     */
    fs.writeFileSync(_localProjectFolderPath + '/.local', JSON.stringify(_localConfig, null, 4));



})
