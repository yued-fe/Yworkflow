'use strict'


require('require-dir')('./tasks');

const PROJECT_CONFIG = require('./yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon'); // server自动重启
const chalk = require('chalk');
const figlet = require('figlet');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const fs = require('fs');

gulp.task('nodemon', function() {
    let configFile = gutil.env.path ? gutil.env.path : '../.yconfig';
    // 如果没有配置,则直接返回原始数据
    if (!fs.existsSync(path.join(PROJECT_CONFIG.absPath, '.eslintignore'))) {
        console.log(chalk.red('[初始]自动创建 .eslintignore 文件'));
        fs.writeFileSync(path.join(PROJECT_CONFIG.absPath, '.eslintignore'),'.cache');
    }

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
        script: 'server/index.js' ,
        nodeArgs: ['--harmony'],
        ext: 'js html',
        args:['--path', path.resolve(configFile)],
        watch: [
            path.join('./'), // 监听Yworkflow目录
            path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path ,'./**/*'),// 监听服务配置相关
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
    let configFile = gutil.env.path ? gutil.env.path : '../.yconfig';
    console.log('启动参数' + configFile);
    if (process.env.NODE_ENV === 'production') {
        runSequence('clean', Object.keys(PROJECT_CONFIG.tasks), 'html:tricky', done);
    } else {
        runSequence('clean', Object.keys(PROJECT_CONFIG.tasks), done);
    }
});
