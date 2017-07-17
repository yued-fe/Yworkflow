'use strict'


require('require-dir')('./tasks');

const PROJECT_CONFIG = require('./yworkflow').getConfig(); //载入项目基础配置
const path = require('path');
const gulp = require('gulp');
const chalk = require('chalk');
const figlet = require('figlet');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const fs = require('fs');

if (PROJECT_CONFIG.tasks.render && fs.existsSync( path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.tasks.render.render_routermap_file))) {
    var render_routermap_file =  path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.tasks.render.render_routermap_file);
}else{
    var render_routermap_file = '';
}

gulp.task('nodemon', function() {
    const nodemon = require('gulp-nodemon'); // server自动重启
    let configFile = gutil.env.path ? gutil.env.path : '../.yconfig';
    // 如果没有配置,则直接返回原始数据
    if (!fs.existsSync(path.join(PROJECT_CONFIG.absPath, '.eslintignore'))) {
        console.log(chalk.red('[初始]自动创建 .eslintignore 文件'));
        fs.writeFileSync(path.join(PROJECT_CONFIG.absPath, '.eslintignore'), '.cache');
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
        script: 'server/index.js',
        nodeArgs: ['--harmony'],
        ext: 'js html',
        args: ['--path', path.resolve(configFile)],
        ignore: [
           render_routermap_file, // 监听服务配置相关
        ],
        watch: [
            path.join('./'), // 监听Yworkflow目录
            path.join(PROJECT_CONFIG.absPath, PROJECT_CONFIG.server.path, './**/*'), // 监听服务配置相关
            path.resolve(configFile),
        ],
        env: {
            NODE_ENV: PROJECT_CONFIG.env
        }
    }).on('restart', function(changeFiles) {
        if (changeFiles) {
            changeFiles.forEach(function(file) {
                console.log(chalk.red('[文件变化]') + chalk.green(file));
            })
        }
    })

});

/**
 * 设置默认任务
 * @param  {[type]} done){} [description]
 * @return {[type]}           [description]
 */
gulp.task('build', function(done) {
    let configFile = gutil.env.path ? gutil.env.path : '../.yconfig';
    var keys = Object.keys(PROJECT_CONFIG.tasks);
    keys = keys.map(function (key) {
        return key + ':build';
    });
    var tasks = ['clean'];
    tasks = tasks.concat(keys);
    if (process.env.NODE_ENV === 'production') {
        tasks.push('html:tricky');
        tasks.push(done);
        runSequence.apply(runSequence, tasks);
    } else {
        tasks.push(done);
        runSequence.apply(runSequence, tasks);
    }
});


/**
 * 设置默认任务
 * @param  {[type]} done){} [description]
 * @return {[type]}           [description]
 */
gulp.task('dev', ['nodemon'], function(done) {
    let configFile = gutil.env.path ? gutil.env.path : '../.yconfig';
    var tasks = ['clean'];
    tasks = tasks.concat(Object.keys(PROJECT_CONFIG.tasks));
    if (process.env.NODE_ENV === 'production') {
        tasks.push('html:tricky');
        tasks.push(done);
        runSequence.apply(runSequence, tasks);
    } else {
        tasks.push(done);
        runSequence.apply(runSequence, tasks);
    }
});

gulp.task('default', ['dev']);