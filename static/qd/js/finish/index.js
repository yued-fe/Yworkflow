/**
 * @fileOverview
 * @author  yangye
 * Created: 2016-4-11
 */
LBF.define('site.finish.index', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('site.component.ajaxSetting'),
        //report = require('site.component.report'),
        Header = require('site.component.header'),
        BrowserSupport = require('site.component.browserSupport'),
        Login = require('site.index.login');

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
            'click .tab-wrap a': 'switchRankTab'
        },

        /**
         * Nodes default UI element，this.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {
        },

        /**
         * Render node
         * Most node needs overwritten this method for own logic
         * @method render
         * @chainable
         */
        render: function () {

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
        init: function () {
            //上报系统
            //report.send();
        }
    })
});