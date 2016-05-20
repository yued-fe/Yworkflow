/**
 * @fileOverview
 * @author  yangye
 * Created: 2016-5-10
 */
LBF.define('/qd/js/error/index.js', function(require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('/qd/js/component/ajaxSetting.js'),
        //report = require('/qd/js/component/report.js'),
        BrowserSupport = require('/qd/js/component/browserSupport.js'),
        PinNav = require('/qd/js/component/pinNav.js'),
        Cookie = require('util.Cookie'),
        Url = require('/qd/js/component/url.js'),
        Login = require('/qd/js/index/login.js'),

    exports = module.exports = Node.inherit({
        /**
         * Default UI proxy Element
         * @protected
         */
        el: 'body',
        /**
         * Default UI events
         * @property events
         * @type Object
         * @protected
         */
        events: {
        },

        /**
         * Nodes default UI element，this.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {},

        /**
         * Render node
         * Most node needs overwritten this method for own logic
         * @method render
         * @chainable
         */
        render: function() {

            // 设置UI Node proxy对象，chainable method，勿删
            this.setElement(this.el);

            // 页面逻辑入口
            this.init();

            // 返回组件
            return this;
        },

        /**
         * 页面逻辑入口
         */
        init: function() {
            //上报系统
            //report.send();

        }
    })
});
