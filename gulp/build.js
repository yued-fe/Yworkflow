/**
 * 发布和编译
 * Author: Luolei
 */
var gulpSlash = require('gulp-slash'); //处理windows和unix文件夹斜杠
var LOCAL_FOLDER = gulpSlash(__dirname).split('Yworkflow/')[0];
process.chdir(LOCAL_FOLDER)

var PROJECT_CONFIG = require('../../.yconfig'); //载入项目基础配置
var gulp = require('gulp');
var del = require('del');
var gulp = require('gulp');
var del = require('del');
var chalk = require('chalk'); // 美化日志
var prettify = require('gulp-jsbeautifier');


var rename = require('gulp-rename')

var RevAll = require('gulp-rev-custom-tag');
var revReplace = require('gulp-rev-replace');
var bust = require('gulp-buster');
var gulpCopy = require('gulp-copy');

var gutil = require('gulp-util');


var paths = {
    sass: 'src/static/**/*.scss',
    build: 'build',
    prelease: '_prelease'
};

/**
 * 生成带版本号的静态文件
 */

gulp.task('rev', function(cb) {
    var _skipReversion = !!(gutil.env.skipV) ? true : false;
    if (!!_skipReversion) {
        console.log(chalk.green('[处理]版本号变化') + chalk.red('关闭'));
    } else {
        console.log(chalk.green('[处理]版本号变化') + chalk.blue('开启'));
    }


    var revAll = new RevAll({
        prefix: '', //自动增加url路径
        dontRenameFile: [/^\/favicon.ico$/g, '.html', '.json'],
        hashLength: 5,
        hashTagMapPath: 'hash-tag-map', //这里可以自定义配置hashTag映射表的目录
        skipVersion: _skipReversion
    });

    var ignoredFiles = {
        // sprites:paths.dist.
    };

    gulp.src('build/' + PROJECT_CONFIG.gtimgName + '/**')
        .pipe(gulpSlash())
        .pipe(revAll.revision())
        .pipe(gulp.dest('_prelease'))
        .pipe(revAll.manifestFile()) //创建静态资源hash映射表
        .pipe(gulp.dest('hash-tag-map'))
        .pipe(revAll.verionIdFile()) //创建递增id映射表
        .pipe(gulp.dest('hash-tag-map'))

    cb()
});


gulp.task('copy-hash-map', function(cb) {
    gulp.src('hash-tag-map/rev-HashMap.json')
        .pipe(gulpSlash())
        .pipe(rename('rev-HashMap-last.json'))
        .pipe(gulp.dest('hash-tag-map'))
    cb()
})



/**
 * 进行js的依赖递归版本处理,若编译之后的文件有变化,则通过分析依赖.deps.json文件,递归修改父js版本号
 * 由于只有js存在递归依赖问题,这里只处理js文件
 */

gulp.task('rev-build-js', function(cb) {
    var _skipReversion = !!(gutil.env.skipV) ? true : false;

    /**
     * 首先备份原有的rev-HashMap.json,做比较用
     */

    var revAll = new RevAll({
        prefix: '', //自动增加url路径
        dontRenameFile: [/^\/favicon.ico$/g, '.html', '.json'],
        hashLength: 5,
        hashTagMapPath: 'hash-tag-map-build', //这里可以自定义配置hashTag映射表的目录
        skipVersion: _skipReversion,
        recursiveRev: true //进行递归版本叠加
    });
    var ignoredFiles = {
        // sprites:paths.dist.
    };
    gulp.src('_prelease/' + '/**/*.js')
        .pipe(gulpSlash())
        .pipe(revAll.revision())
        .pipe(revAll.verionRevFile()) //创建静态资源hash映射表
        .pipe(gulp.dest('hash-tag-map'))

    cb()
});

/**
 * 检查所有的静态资源HASH是否有变动
 * @param  {[type]} cb) {               var _skipReversion [description]
 * @return {[type]}     [description]
 */
gulp.task('rev-build-all', function(cb) {
    var _skipReversion = !!(gutil.env.skipV) ? true : false;

    /**
     * 首先备份原有的rev-HashMap.json,做比较用
     */

    var revAll = new RevAll({
        prefix: '', //自动增加url路径
        dontRenameFile: [/^\/favicon.ico$/g, '.html', '.json'],
        hashLength: 5,
        hashTagMapPath: 'hash-tag-map-build', //这里可以自定义配置hashTag映射表的目录
        skipVersion: _skipReversion,
        recursiveRev: true //进行递归版本叠加
    });
    var ignoredFiles = {
        // sprites:paths.dist.
    };

    gulp.src('_prelease/' + '/**/*')
        .pipe(revAll.revision())
        .pipe(revAll.verionRevFile()) //创建静态资源hash映射表
        .pipe(gulp.dest('hash-tag-map'))

    cb()
});

/**
 * 二次替换,防止js和css中有url没有被替换
 */

gulp.task('rev-fix', function() {
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src(['_prelease/**/*.{js,ejs,css}']) // Minify any CSS sources
        .pipe(gulpSlash())
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('_prelease'))
});



gulp.task('tmp-store', function() {
    return gulp.src(['_prelease/**/*']) // Minify any CSS sources
        .pipe(gulpSlash())
        .pipe(gulp.dest('_tmp'))
})


/**
 * 替换模板文件中的静态资源引入路径
 */
gulp.task('rev-views', function(cb) {
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src("src/views/**/*.html") // Minify any CSS sources
        .pipe(gulpSlash())
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('_previews'))
    cb()
});




/**
 * 二次替换,防止js和css中有url没有被替换
 */

gulp.task('rev-fix-deps', function() {
     del(['_prelease/**/*'])
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src(['_tmp/**/*.{js,ejs,css}']) // Minify any CSS sources
        .pipe(gulpSlash())
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('_prelease'))
});


/**
 * 替换模板文件中的静态资源引入路径
 */
gulp.task('rev-views-deps', function(cb) {
    var manifest = gulp.src("hash-tag-map/rev-verionId.json");
    return gulp.src("src/views/**/*.html") // Minify any CSS sources
        .pipe(gulpSlash())
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('_previews'))
    cb()
});



/**
 * ARS在发布模板的同时,顺便把node-config发布到同一目录(ars就不用重复建单)
 */

gulp.task('copy-config', function() {
    console.log(chalk.red('[处理]复制node-config配置文件到 _previews/ 目录'));
    gulp.src('src/node-config/**/*')
        .pipe(gulpSlash())
        .pipe(gulp.dest('_previews/node-config'))
})


/**
 * 生成不需要增加版本号的静态资源,直接将编译后的静态资源复制到_prelease目录
 * 本地调试用
 */
gulp.task('copy-no-rev', function() {
    // del(['_tmp/**/*'])
    gulp.src('build/**/*')
        .pipe(gulpSlash())
        .pipe(gulp.dest('_prelease'))
        // cb()
})
