module.exports =  function (baseUrl, routes) {
    var Table = require('cli-table');
    var table = new Table({ head: ["Method", "Path"] });
    console.log('\n代理ajax路由转发列表 ' + baseUrl);
    console.log('********************************************');
    for (var key in routes) {
        if (routes.hasOwnProperty(key)) {
            var val = routes[key];
            if(val.route) {
                val = val.route;
                var _o = {};
                var _method = val.stack[0].method ? val.stack[0].method : '*'
                _o[_method]  = [baseUrl + val.path];
                table.push(_o);
            }
        }
    }

    console.log(table.toString());
    return table;
};
