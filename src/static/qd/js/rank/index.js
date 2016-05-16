/**
 * @fileOverview
 * @author  luolei
 * Created: 2016-04-08
 */
LBF.define('/qd/js/rank/index.js', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ComboBox = require('ui.widget.ComboBox.ComboBox'),
        ajaxSetting = require('/qd/js/component/ajaxSetting.js'),
        report = require('/qd/js/component/report.js'),
        Header = require('/qd/js/component/header.js'),
        BrowserSupport = require('/qd/js/component/browserSupport.js'),
         Url = require('/qd/js/component/url.js'),
        Login = require('/qd/js/index/login.js');

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
            'click .tab-wrap a': 'switchRankTab',
            'click .sort-switcher a':'switchSortType',
           'click .type-list a': 'chanIdSwitch'
        },

        /**
         * Nodes default UI element，this.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {
            'btnRankMore': '#btn-more'
        },

        /**
         * Render node
         * Most node needs overwritten this method for own logic
         * @method render
         * @chainable
         */


         switchSortType:function(e){
            console.log('1');
         },

        /**
         * 切换分类
         */

         chanIdSwitch:function(e){
            var _this = $(e.target);
            var _thisId = _this.attr('data-chanid');
            console.log('切换列表');
            //将列表模式的值设置到cookie中
            var _curentUrl = location.href;
            var _updateUrl = Url.setParam(_curentUrl, 'chn', _thisId);
            console.log('更新' + _updateUrl);
            location.href = _updateUrl;
         },

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
            report.send();
        },
        /**
         *  周月总切换tab
         *  @method switchRankTab
         *  @param e 当前点击的事件对象
         */
        switchRankTab: function (e) {
            var target = $(e.target);
            target.addClass('act').siblings().removeClass();
            //遍历tab-list下的3个榜单列表，按照周月总顺序切换显示
            $('.tab-list > .book-list').eq($('.tab-wrap a').index(target)).show().siblings().hide();
        }
    })
});