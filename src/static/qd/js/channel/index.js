/**
 * @fileOverview
 * @author  yangye
 * Created: 2016-4-14
 */
LBF.define('/qd/js/channel/index.js', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('/qd/js/component/ajaxSetting.js'),
    //report = require('/qd/js/component/report.js'),
        Header = require('/qd/js/component/header.js'),
        BrowserSupport = require('/qd/js/component/browserSupport.js'),
        PinNav = require('/qd/js/component/pinNav.js'),
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
                'click .add-book': 'addToBookShelf'
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
                // 最新更新模块
                this.initUpdateMod();

            },
            /**
             * 最新更新模块
             * @method initUpdateMod
             */
            initUpdateMod: function () {
                var updateTab = $('#update-tab a');
                var updateList = $('#update-list');

                updateTab.on('click', function () {
                    $(this).addClass('act').siblings().removeClass('act');
                    updateList.find('.update-table').eq(updateTab.index(this)).show().siblings().hide();
                });
            }


        })
});
