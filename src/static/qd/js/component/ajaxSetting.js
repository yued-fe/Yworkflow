/**
 * @fileOverview
 * @author rainszhang
 * Created: 16-03-18
 */
LBF.define('site.component.ajaxSetting', function (require, exports, module) {
    var $ = require('lib.jQuery');
    // var JSON = require('lang.JSON');
    var Cookie = require('util.Cookie');

    (function(){
        $.ajaxSetup({
            data: {
                "_csrfToken": Cookie.get('_csrfToken') || ''
            },
            dataType: 'json'
            /*
            error: function(){
                new LightTip({
                    content: '服务器发生异常，请重试'
                }).error();
            }
            */
        });
    })();
});
