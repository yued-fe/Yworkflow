/**
 * Created by renjiale on 2016/4/26.
 * 共线上DynamticNodeServer使用的动态路由
 * 注意此路由必须是动态render的路由，本地调试静态化请使用local_dev_routermap.js
 */

var fs = require('fs');


var routerCombine = {};

function extend(obj) {
    var args = [].slice.call(arguments, 1);
    if (args.length === 0) {
        return obj;
    }
    args.forEach(function(arg) {
        var keys = Object.keys(arg);
        var i = keys.length;

        while (i--) {
            obj[keys[i]] = arg[keys[i]];
        }
    });

    return obj;
}

/**
 * 忽略掉本地的_local_static.js 路由
 */
require('fs').readdirSync(__dirname + '/dynamic_routers').forEach(function(file) {
    console.log(file);
    if (file.match(/\.js$/) !== null && file !== '_local_static.js') {
        extend(routerCombine, require(__dirname + '/dynamic_routers/' + file) );
    }
});

module.exports = routerCombine;
