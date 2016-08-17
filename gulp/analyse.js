/**
 * 分析js中的依赖关系
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


var RevAll = require('gulp-rev-custom-tag');
var revReplace = require('gulp-rev-replace');
var bust = require('gulp-buster');
var gulpCopy = require('gulp-copy');

var gutil = require('gulp-util');
var resolveDependencies = require('gulp-resolve-dependencies');
var concat = require('gulp-concat');

var madge = require('madge');
var fs = require('fs');
var _ = require('lodash');



var paths = {
    sass: 'src/static/**/*.scss',
    build: 'build',
    prelease: '_prelease'
};

/**
 * 遍历所有的js依赖,分析依赖关系
 */

gulp.task('ana', function(cb) {
    console.log('[Start]遍历js 分析依赖关系');
    var dependencyObject = madge(LOCAL_FOLDER + 'build/' + PROJECT_CONFIG.gtimgName + '/js');
    var _depsTree = dependencyObject.tree;

    var _modifyTree = {};
    Object.keys(_depsTree).forEach(function(key) {
        // console.log(key);
        _key = 'js/' + key + '.js';

        var _jsListExt = _depsTree[key];
        var _newJsListExt = [];
        for (var i = 0; i < _jsListExt.length; i++) {
            _newJsListExt.push(_jsListExt[i] + '.js')
        }

        _modifyTree[_key] = _newJsListExt;

    })
    _depsTree = _modifyTree;
    var _replaceStaticTag = new RegExp(PROJECT_CONFIG.gtimgName + '/', 'g')
    _depsTreeString = JSON.stringify(_depsTree, null, 4).replace(/\.\.\//g, '').replace(_replaceStaticTag, '')

    /**
     * 为了与re
     * @param  {[type]} key) {                       if (_AllJavascriptFile.indexOf(key) [description]
     * @return {[type]}      [description]
     */
    fs.writeFile(LOCAL_FOLDER + 'hash-tag-map/deps.json', _depsTreeString, (err) => {
        if (err) throw err;
        // console.log('It\'s saved!');
        var _affectedParents = [];
        var _projectAllJsList = {};
        for (var key in _depsTree) {
            // console.log(key);
            var _jsList = _depsTree[key];
            _jsListEach = _depsTree[key];
            // console.log(_jsList);


        }

        var _outPutDeps = require('../../hash-tag-map/deps.json');
        var _outPutKeyLength = Object.keys(_outPutDeps).length
            // console.log(Object.keys(_outPutDeps)[i]);
            /**
             * 首先遍历所有的key和array,抽离出项目中存在依赖关系的所有js文件
             */
        var _AllJavascriptFile = [];

        Object.keys(_outPutDeps).forEach(function(key) {
            if (_AllJavascriptFile.indexOf(key) == -1) {
                // console.log(chalk.green(key));
                _AllJavascriptFile.push(key)
            }
        })

        //构建一个空的对象空间,用来储存反向依赖
        var _reverseJS = {};

        //遍历所有的value array,过滤所有的业务js出来
        for (var i = 0; i < _outPutKeyLength; i++) {

            var _inKeyJsFile = _outPutDeps[Object.keys(_outPutDeps)[i]];

            console.log(chalk.blue('[分析]') + 'js子依赖数量:[' + chalk.red(_inKeyJsFile.length) + '] ' + chalk.green(Object.keys(_outPutDeps)[i]));
            for (var p = 0; p < _inKeyJsFile.length; p++) {
                if (_AllJavascriptFile.indexOf(_inKeyJsFile[p]) == -1) {
                    if (_inKeyJsFile[p].indexOf('js/') == 0) {
                        _AllJavascriptFile.push(_inKeyJsFile[p]);
                    }
                }
            }
        }
        console.log(chalk.red('\n业务存在依赖关系的js共有[') + chalk.green(_AllJavascriptFile.length) + chalk.red(']个'));

        //生成一个js表单,列出本项目中所有的业务js
        fs.writeFileSync(LOCAL_FOLDER + 'hash-tag-map/js-list.json', JSON.stringify(_AllJavascriptFile, null, 4));

        /**
         * 接下来构建反向JS依赖表,key为项目js,value数组为所有依赖该js的父js。
         */
        var _allJsFile = require('../../hash-tag-map/js-list.json');
        var _allJsFileLength = _allJsFile.length;
        var _countRelatedJsNum = 0;
        // console.log('start');
        for (var i = 0; i < _allJsFile.length; i++) {
            var _thisFile = _allJsFile[i];
            console.log(chalk.blue('[分析]') + '依赖关系:' + chalk.green(_thisFile));
            //构建一个临时的数组
            var _thisFileParents = [];
            for (var p = 0; p < _allJsFileLength; p++) {
                var _inKeyJsFile = _outPutDeps[Object.keys(_outPutDeps)[p]];
                // console.log(_inKeyJsFile.indexOf(_thisFile));
                // console.log(_inKeyJsFile);
                if (_inKeyJsFile.indexOf(_thisFile) > -1) {
                    // console.log('包含这个js');
                    _thisFileParents.push(Object.keys(_outPutDeps)[p])
                } else {
                    // console.log('木有');
                }
            }
            //过滤掉无父js的依赖
            if (_thisFileParents.length > 0) {
                _reverseJS[_thisFile] = _thisFileParents;
                _countRelatedJsNum += 1;
            }
        }

        /**
         * 生成实体的反向js依赖文件,供reversion反查用
         */

        fs.writeFileSync(LOCAL_FOLDER + 'hash-tag-map/reverse-js.json', JSON.stringify(_reverseJS, null, 4));
        var _lastList = require('../../hash-tag-map/reverse-js.json');
        // var _outPutKeyLength = Object.keys(_outPutDeps).length
        console.log(chalk.blue('[分析结果]\n共存在反向关联的js[') + chalk.red(_countRelatedJsNum) + chalk.blue(']个'));
        console.log(chalk.blue('\n下列js文件的修改会影响到其他文件版本号:\n') + chalk.blue('==================================\n') + chalk.green(JSON.stringify(Object.keys(_lastList), null, 4)) + chalk.blue('\n=================================='));



    });


});



gulp.task('fs-test', function() {

        fs.rename('/Volumes/Macintosh HD/Users/yuewen-luolei/Yuewen/Shenzhen-SVN/qidian_proj/trunk/v2/_prelease/js/rank/index.0.38.js', '/Volumes/Macintosh HD/Users/yuewen-luolei/Yuewen/Shenzhen-SVN/qidian_proj/trunk/v2/_prelease/js/rank/hotnew.0.39.js', function(err) {
            if (err) {
                console.log(err);
            }
        })

})


/**
 * 根据gulp rev-build任务生成出来的编译后进行二次版本处理
 */


gulp.task('deps-update', function(cb) {
    console.log(chalk.red('[Start]分析编译后的资源版本HASH变动'));
    //首先获得上一次的业务js编译后的hash值
    var _lastBuildHashMap = require('../../hash-tag-map/rev-HashMap-last.json');
    var _currentBuildHashMap = require('../../hash-tag-map/rev-HashMap.json');
    var _currentIdMap = require('../../hash-tag-map/rev-verionId.json'),
        _currentIdMapRevert = _.invert(_currentIdMap);
    var _reverseJs = require('../../hash-tag-map/reverse-js.json');
    //创建一个临时数据储存变化了的js名
    var _changedJsFiles = [],
        _changedJsSourceFiles = [];

    // console.log(Object.keys(_lastBuildHashMap));
    for (var i = 0; i < Object.keys(_currentBuildHashMap).length; i++) {
        var _checkJsFileName = Object.keys(_currentBuildHashMap)[i];
        // console.log('HASH对比:' + _checkJsFileName);
        if (!!_lastBuildHashMap[_checkJsFileName]) {
            var _oldHash = !!_lastBuildHashMap[_checkJsFileName] ? _lastBuildHashMap[_checkJsFileName] : 00000;
            var _newHash = !!_currentBuildHashMap[_checkJsFileName] ? _currentBuildHashMap[_checkJsFileName] : 11111;
            //如果hash值发生了变化,则可以理解成依赖文件有变,接下来处理相关依赖
            if (_lastBuildHashMap[_checkJsFileName] !== _currentBuildHashMap[_checkJsFileName]) {
                console.log('[Hash比较] ' + chalk.green(_oldHash) + chalk.blue(' / ') + chalk.red(_newHash) + ' 文件:' + _checkJsFileName);
                _changedJsSourceFiles.push(_currentIdMapRevert[_checkJsFileName])
                _changedJsFiles.push(_checkJsFileName);
            }
        } else {

            console.log('[Hash比较] ' + chalk.green(_oldHash) + chalk.blue(' / ') + chalk.green(_newHash) + ' 文件:' + _checkJsFileName);
            _changedJsFiles.push(_checkJsFileName);
            console.log(_checkJsFileName);
            _changedJsSourceFiles.push(_currentIdMapRevert[_checkJsFileName])
        }

    }

    for (var i = 0; i < Object.keys(_lastBuildHashMap).length; i++) {
        var _checkJsFileName = Object.keys(_lastBuildHashMap)[i];
        if (!_currentBuildHashMap[_checkJsFileName]) {
            console.log('旧的发生了变化:' + _checkJsFileName);
        }
    }


    console.log(_changedJsFiles);
    // console.log(_.invert(_currentIdMap));


    if (_changedJsFiles.length > 0) {
        console.log(chalk.red('[结果]后续发生了变化的prelease文件是:') + '\n' + JSON.stringify(_changedJsFiles, null, 4));
        console.log(chalk.red('[结果]发生变化js对应的源文件是:') + '\n' + JSON.stringify(_changedJsSourceFiles, null, 4));
    } else {
        console.log(chalk.blue('[分析]没有js发生变化'));
    }


    //接下来去检查所有的需要更新的
    var _updateJsFiles = [];

    for (var i = 0; i < _changedJsSourceFiles.length; i++) {
        var _thisFile = _changedJsSourceFiles[i];
        //如果检查的js在反向依赖js表中,则进行遍历查询
        console.log(chalk.blue('[检查]js的反向依赖:') + _thisFile);

        if (!!_reverseJs[_thisFile]) {
            // console.log(_reverseJs[_thisFile].length);
            // console.log(_reverseJs[_thisFile]);
            var _thisList = _reverseJs[_thisFile];
            for (var p = 0; p < _thisList.length; p++) {
                if (_updateJsFiles.indexOf(_thisList[p])) {
                    _updateJsFiles.push(_thisList[p])
                }
            }
        }

    }
    _updateJsFiles = _.uniq(_updateJsFiles);
    if (_.uniq(_updateJsFiles).length > 0) {
        console.log(chalk.red('[结果] 最终影响的js共有') + _.uniq(_updateJsFiles).length + chalk.red('个'));
        console.log(JSON.stringify(_updateJsFiles, null, 4));
    } else {
        console.log(chalk.blue('[结果]没有相关依赖js的变化'));
    }


    /**
     * 接下来替换rev-verionId.json里面的版本文件
     */

    var _currentFileString = JSON.stringify(_currentIdMap, null, 4);
    var _updateFileString = '';
    // console.log(_currentFileString);
    for (var i = 0; i < _updateJsFiles.length; i++) {
        var _lastId = _currentIdMap[_updateJsFiles[i]];
        // console.log('当前版本:' + _currentIdMap[_updateJsFiles[i]]);
        var _lastFileNameTag = _lastId.split('/').pop().split('.').slice(-3);
        // console.log(_lastFileNameTag);
        var _startVerNum = _lastFileNameTag[0],
            _secVerNum = _lastFileNameTag[1];
        var _currentVerNum = _startVerNum + '.' + _secVerNum;

        var _updateStartVernum = parseFloat(_startVerNum),
            _updateSecVerNum = parseFloat(_secVerNum);

        if (_updateSecVerNum < 99) {
            _updateSecVerNum = parseFloat(_updateSecVerNum) + 1;
        } else {
            _updateSecVerNum = '0';
            _updateStartVernum += 1;
        }

        // var _updateFileString=
        var _updateVerNum = _updateStartVernum + '.' + _updateSecVerNum;
        // console.log('更新版本号' + _updateVerNum);
        var _updateFileName = _lastId.replace(_currentVerNum + '.js', _updateVerNum + '.js');
        // console.log('更新版本号的文件' + _updateFileName);
        console.log(chalk.blue('[处理]更新:') + chalk.green(_lastId) + chalk.blue(' ==> ') + chalk.green(_updateFileName));
        // console.log('检查demo:' + _lastId);
        // console.log('检查2' + _updateFileName);
        _currentFileString = _currentFileString.replace(_lastId, _updateFileName);


        fs.rename(LOCAL_FOLDER + '_tmp/' + _lastId, LOCAL_FOLDER + '_prelease/' + _updateFileName, function(err) {
            if (err) {
                console.log(err);
            }
        })


    }

    var _updateFileStringBk = JSON.parse(_currentFileString);
    if (_.uniq(_updateJsFiles).length > 0) {
        console.log(chalk.green('[完成]更新rev-verionId.json中的文件版本号'));
    } else {
        console.log(chalk.green('[完成]最终rev-verionId.json生成'));
    }

    fs.writeFileSync(LOCAL_FOLDER + 'hash-tag-map/rev-verionId.json', JSON.stringify(_updateFileStringBk, null, 4));



});


gulp.task('deps-update-all', function(cb) {
    console.log(chalk.red('[Start]分析编译后的资源版本HASH变动'));
    //首先获得上一次的业务js编译后的hash值
    var _lastBuildHashMap = require('../../hash-tag-map/rev-HashMap-last.json');
    var _currentBuildHashMap = require('../../hash-tag-map/rev-HashMap.json');
    var _currentIdMap = require('../../hash-tag-map/rev-verionId.json'),
        _currentIdMapRevert = _.invert(_currentIdMap);
    // var _reverseJs = require('../../hash-tag-map/reverse-js.json');
    //创建一个临时数据储存变化了的js名
    var _changedJsFiles = [],
        _changedJsSourceFiles = [];

    // console.log(Object.keys(_lastBuildHashMap));
    for (var i = 0; i < Object.keys(_currentBuildHashMap).length; i++) {
        var _checkJsFileName = Object.keys(_currentBuildHashMap)[i];
        //
        if (!!_lastBuildHashMap[_checkJsFileName]) {
            var _oldHash = !!_lastBuildHashMap[_checkJsFileName] ? _lastBuildHashMap[_checkJsFileName] : 00000;
            var _newHash = !!_currentBuildHashMap[_checkJsFileName] ? _currentBuildHashMap[_checkJsFileName] : 11111;
            //如果hash值发生了变化,则可以理解成依赖文件有变,接下来处理相关依赖
            if (_lastBuildHashMap[_checkJsFileName] !== _currentBuildHashMap[_checkJsFileName]) {
                console.log('[Hash比较] ' + chalk.green(_oldHash) + chalk.blue(' / ') + chalk.red(_newHash) + ' 文件:' + _checkJsFileName);
                _changedJsSourceFiles.push(_currentIdMapRevert[_checkJsFileName])
                _changedJsFiles.push(_checkJsFileName);
            }
        } else {

            console.log('[Hash比较] ' + chalk.green(_oldHash) + chalk.blue(' / ') + chalk.green(_newHash) + ' 文件:' + _checkJsFileName);
            _changedJsFiles.push(_checkJsFileName);
            console.log(_checkJsFileName);
            // _changedJsSourceFiles.push(_currentIdMapRevert[_checkJsFileName])
        }

    }

    for (var i = 0; i < Object.keys(_lastBuildHashMap).length; i++) {
        var _checkJsFileName = Object.keys(_lastBuildHashMap)[i];
        if (!_currentBuildHashMap[_checkJsFileName]) {
            console.log(chalk.green('[新增文件]') + '' + _checkJsFileName);
        }
    }


    if (_changedJsFiles.length > 0) {
        console.log(chalk.red('\n[结果]本次编译后变化的所有编译文件(含新增):') + '\n' + JSON.stringify(_changedJsFiles, null, 4));
        console.log(chalk.red('[结果]发生变化源文件是(HASH变化 版本号未变):') + '\n' + JSON.stringify(_changedJsSourceFiles, null, 4));
    } else {
        console.log(chalk.blue('[分析]没有文件发生变化'));
    }


    //接下来去检查所有的需要更新的
    var _updateJsFiles = [];
    var _updatdeAllTypeFiles = [];
    for (var i = 0; i < _changedJsSourceFiles.length; i++) {
        var _thisFile = _changedJsSourceFiles[i];
        //如果检查的js在反向依赖js表中,则进行遍历查询
        console.log(chalk.blue('[检查]编译后变化的文件:') + _thisFile);

        _updatdeAllTypeFiles.push(_thisFile)


    }
    _updatdeAllTypeFiles = _.uniq(_updatdeAllTypeFiles);
    console.log(_updatdeAllTypeFiles.length);
    if (_updatdeAllTypeFiles.length) {
        console.log(chalk.red('[结果] 二次检查后需要增加版本号的文件共有下列') + _.uniq(_updatdeAllTypeFiles).length + chalk.red('个'));
        console.log(JSON.stringify(_updatdeAllTypeFiles, null, 4));
    } else {
        console.log(chalk.blue('[结果]编译文件没有变化'));
    }


    /**
     * 接下来替换rev-verionId.json里面的版本文件
     */

    var _currentFileString = JSON.stringify(_currentIdMap, null, 4);
    var _updateFileString = '';
    // console.log(_currentFileString);
    for (var i = 0; i < _updatdeAllTypeFiles.length; i++) {
        var _lastId = _currentIdMap[_updatdeAllTypeFiles[i]];
        // console.log('当前版本:' + _currentIdMap[_updateJsFiles[i]]);
        var _lastFileNameTag = _lastId.split('/').pop().split('.').slice(-3);
        // console.log('TAG检查:' + _lastFileNameTag);
        var _startVerNum = _lastFileNameTag[0],
            _secVerNum = _lastFileNameTag[1],
            _fileExt = _lastFileNameTag[2];
        var _currentVerNum = _startVerNum + '.' + _secVerNum;

        var _updateStartVernum = parseFloat(_startVerNum),
            _updateSecVerNum = parseFloat(_secVerNum);

        if (_updateSecVerNum < 99) {
            _updateSecVerNum = parseFloat(_updateSecVerNum) + 1;
        } else {
            _updateSecVerNum = '0';
            _updateStartVernum += 1;
        }

        // var _updateFileString=
        var _updateVerNum = _updateStartVernum + '.' + _updateSecVerNum;
        // console.log('更新版本号' + _updateVerNum);
        //  var _updateFileName = _lastId.replace(_currentVerNum + '.js', _updateVerNum + '.js');
        var _updateFileName = _lastId.replace(_currentVerNum + '.' + _fileExt, _updateVerNum + '.' + _fileExt);
        console.log(chalk.blue('[处理]更新:') + chalk.green(_lastId) + chalk.blue(' ==> ') + chalk.green(_updateFileName));
        // console.log('检查demo:' + _lastId);
        // console.log('检查2' + _updateFileName);
        _currentFileString = _currentFileString.replace(_lastId, _updateFileName);

        console.log(chalk.red('替换Path:') + LOCAL_FOLDER + '_prelease/' + _lastId);
        console.log(chalk.blue('为新的名:' + LOCAL_FOLDER + '_prelease/' + _updateFileName));

        fs.renameSync(LOCAL_FOLDER + '_tmp/' + _lastId, LOCAL_FOLDER + '_tmp/' + _updateFileName)


    }

    var _updateFileStringBk = JSON.parse(_currentFileString);
    if (_.uniq(_updatdeAllTypeFiles).length > 0) {
        console.log(chalk.green('[完成]更新rev-verionId.json中的文件版本号'));
    } else {
        console.log(chalk.green('[完成]最终rev-verionId.json生成'));
    }

    fs.writeFileSync(LOCAL_FOLDER + 'hash-tag-map/rev-verionId.json', JSON.stringify(_updateFileStringBk, null, 4));



});