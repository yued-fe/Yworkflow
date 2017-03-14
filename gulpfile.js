'use strict'



require('require-dir')('./tasks');


var PROJECT_CONFIG = require('./yworkflow').getConfig(); //载入项目基础配置

var path = require('path');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon'); // server自动重启
var chalk = require('chalk');
var figlet = require('figlet');
var runSequence = require('run-sequence');

gulp.task('nodemon', function() {
    figlet('Yworkflow', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(chalk.bold.green(data))
    });
    // 自动监听
    nodemon({
        script: 'server/index.js',
        nodeArgs: ['--harmony'],
        ext: 'js html',
        watch: [
            path.join('./'), // 监听Yworkflow目录
            path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path),// 监听服务配置相关
            path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.paths.views), // 监听模板文件变化
            path.join(PROJECT_CONFIG.absPath, '.yconfig'),
        ],
        env: process.env.NODE_ENV
    }).on('restart', function(changeFiles) {
        if (changeFiles) {
            changeFiles.forEach(function(file) {
                console.log(chalk.red('[文件变化]') + chalk.green(file));
            })
        }
    });

});

/**
 * 设置默认任务
 * @param  {[type]} done){} [description]
 * @return {[type]}           [description]
 */
gulp.task('dev', ['nodemon'], function(done) {

    if (process.env.NODE_ENV === 'production') {
        runSequence('clean', Object.keys(PROJECT_CONFIG.tasks), 'html:tricky', done);
    } else {
        runSequence('clean', Object.keys(PROJECT_CONFIG.tasks), done);
    }

});