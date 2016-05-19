/**
 * @fileOverview
 * @author  yangye
 * Created: 2016-4-14
 */
LBF.define('site.search.index_0_1', function(require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('site.component.ajaxSetting'),
        report = require('site.component.report'),
        Header = require('site.component.header_0_1'),
        BrowserSupport = require('site.component.browserSupport'),
        Pagination = require('ui.Nodes.Pagination'),
        PinNav = require('site.component.pinNav_0_1'),
        Cookie = require('util.Cookie'),
        Url = require('site.component.url'),
        Login = require('site.index.login'),
        Addbook = require('site.free.addBook_0_1');

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
            'click .add-book': 'addToBookShelf',
            'click .sort-switcher a': 'switchSortType'
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
            report.send();

            //初始化分页
            this.pagiNation();
        },
        addToBookShelf: function(e) {
            //引用Addbook.js中的加入书架方法
            Addbook.addToBookShelf(e, 'blue-btn', 'in-shelf');
        },


        switchSortType: function(e) {
            var _this = $(e.target)
            var _currentSortType = _this.attr('data-type');
            console.log(_currentSortType);
            var _updateType = 1;

            switch (_currentSortType) {
                case 'time':
                    _updateType = 1;
                    break;
                case 'click':
                    _updateType = 2;
                    break;
                case 'recom':
                    _updateType = 3;
                    break;
                case 'wordscnt':
                    _updateType = 4;
                    break;
            }
            var _curentUrl = location.href;
            var _updateUrl = Url.setParam(_curentUrl,'sort',_updateType);
            _updateUrl = Url.setParam(_updateUrl,'page',1);
            location.href = _updateUrl;

        },

        /**
         * 分页
         * @method pagiNation
         */
        pagiNation: function() {
            var that = this;
            var pagination = new Pagination({
                container: '#page-container',
                startPage: 1,
                endPage: parseInt($('#page-container').attr('data-pageMax')),
                page: parseInt($('#page-container').attr('data-page')),
                isShowJump: true,
                headDisplay: 1,
                tailDisplay: 1,
                prevText: '&lt;',
                nextText: '&gt;',
                events: {
                    'change:page': function(e, page) {
                        that.currentPage = page;
                        var _curentUrl = location.href;
                        var _updateUrl = Url.setParam(_curentUrl, 'page', that.currentPage);
                        console.log('更新' + _updateUrl);
                        location.href = _updateUrl;
                    }
                }
            });
        }
    })
});
