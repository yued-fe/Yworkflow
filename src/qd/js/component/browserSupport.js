/**
 * @fileOverview
 * @author yangye
 * Created: 16-04-07
 */
LBF.define('/qd/js/component/browserSupport.js', function (require, exports, module) {
    var $ = require('lib.jQuery');

    var report = {};
    var envType = g_data.envType;
    var pageId = g_data.pageId;

    var BrowserSupport = {
        init: function () {
            // 通用模块 处理浏览器特性支持差异
            this.browserSupport();
        },
        /**
         * 通用模块 处理浏览器特性支持差异
         * @menthod browserSupport
         */
        browserSupport: function () {
            // 处理placeholder兼容性问题，兼容IE10以下placeholder
            $(function () {
                // 判断浏览器是否支持 placeholder
                if (!('placeholder' in document.createElement('input'))) {
                    $('[placeholder]').focus(function () {
                        var input = $(this);
                        if (input.val() == input.attr('placeholder')) {
                            input.val('');
                            input.removeClass('placeholder');
                        }
                    }).blur(function () {
                        var input = $(this);
                        if (input.val() == '' || input.val() == input.attr('placeholder')) {
                            input.addClass('placeholder');
                            input.val(input.attr('placeholder'));
                        }
                    }).blur();
                }
            });

            // 处理IE9下不支持3d旋转，导致书页和阴影外露的问题
            if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
                $('.book-cover img').css({width: 60});
                $('.book-cover span').hide();
            }
        }
    };
    BrowserSupport.init();
});
