/**
 * 定制Combo合并路径
 */

var envType = "local";
var gulp = require('gulp');
var del = require('del');
var combo = require('../lib/util/combo');

var serverConf = require('../views/node-config/server');
var staticConf = serverConf[envType]['static'];
var dateFormat = require('dateformat');


gulp.task('combo', function() {
    var _updateTime = dateFormat((new Date()).getTime(),'yyyymmddHHMM');
    console.log(_updateTime);
    var baseUri = '<%= staticConf.staticDomain %>/c/=';
    gulp.src('_previews/**/*.html')
        .pipe(combo(baseUri, {
            splitter: ',',
            async: false,
            ignorePathVar: '<%= staticConf.staticPath %>',
            assignPathTag: 'activity',
            updateTime:_updateTime
        }, {
            max_age:31536000
        }))
        .pipe(gulp.dest('_previews'));
})