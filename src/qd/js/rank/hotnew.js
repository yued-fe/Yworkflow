/**
 * @fileOverview
 * @author  luolei
 * Created: 2016-04-08
 */
LBF.define('site.rank.hotnew', function(require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ComboBox = require('ui.widget.ComboBox.ComboBox'),
        ajaxSetting = require('site.component.ajaxSetting'),
        report = require('site.component.report'),
        Header = require('site.component.header'),
        BrowserSupport = require('site.component.browserSupport'),
        Pagination = require('ui.Nodes.Pagination'),
        Cookie = require('util.Cookie'),
        Url = require('site.component.url'),
        Login = require('site.index.login'),
        Addbook = require('site.free.addBook');
    // Login = require('site.index.login');

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
            'click .img-text': 'imgTextMode',
            'click .only-text': 'onlyTextMode',
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

            //热门作品排行榜、新书排行榜的下拉UI组件
            this.dateDropDown();

            //初始化分页
            this.pagiNation();
        },
        /**
         *  周月总切换tab
         *  @method switchRankTab
         *  @param e 当前点击的事件对象
         */
        switchRankTab: function(e) {
            var target = $(e.target);
            target.addClass('act').siblings().removeClass();
            //遍历tab-list下的3个榜单列表，按照周月总顺序切换显示
            $('.tab-list > .book-list').eq($('.tab-wrap a').index(target)).show().siblings().hide();
        },
        /**
         * 初始化日期下拉组件
         * @method dateDropDown
         */
        dateDropDown: function() {
            if ($('body').hasClass('rank-type-1') == true || $('body').hasClass('rank-type-3') == true || $('body').hasClass('rank-type-4') || $('body').hasClass('rank-type-9') == true) {
                // console.log('time load');
                var yearDrop = new ComboBox({
                    selector: $('#year'),
                    className: 'year',
                    events: {
                        click: function(e) {
                            var _this = $(e.target);
                            var _updateYear = _this.html().slice(0, 4);
                            if(_updateYear == $('#year a').attr('data-value')){
                                return false;
                            }

                            var _curentUrl = location.href;
                            var _updateUrl = Url.setParam(_curentUrl, 'year', yearDrop.val());
                            console.log('更新' + _updateUrl);
                            location.href = _updateUrl;
                            // console.log(_this.html());
                        }
                    }
                });
                var monthDrop = new ComboBox({
                    selector: $('#month'),
                    className: 'month',
                    events: {
                        click: function(e) {
                            var _this = $(e.target);
                            var _updateMonth = _this.html().slice(0, 2);
                            // console.log(_updateMonth);
                            // return false;
                            if(_updateMonth == $('#month a').attr('data-value')){
                                return false;
                            }
                            var _curentUrl = location.href;
                            var _updateUrl = Url.setParam(_curentUrl, 'month', monthDrop.val());
                            console.log('更新' + _updateUrl);
                            location.href = _updateUrl;
                        }
                    }
                });
            }


        },
        /**
         * 加入书架
         * @method addToBookShelf
         */
        addToBookShelf: function(e) {
            //引用Addbook.js中的加入书架方法
            Addbook.addToBookShelf(e, 'blue-btn', 'in-shelf');
        },
        /**
         * 切换到图文模式
         * @method imgTextMode
         */
        imgTextMode: function() {
            console.log('切换图文');
            //将图文模式的值设置到cookie中
            var _curentUrl = location.href;
            var _updateUrl = Url.setParam(_curentUrl, 'style', 1);
            console.log('更新' + _updateUrl);
            location.href = _updateUrl;
        },
        /**
         * 切换到列表模式
         * @method onlyTextMode
         */
        onlyTextMode: function() {
            console.log('切换列表');
            //将列表模式的值设置到cookie中
            var _curentUrl = location.href;
            var _updateUrl = Url.setParam(_curentUrl, 'style', 2);
            console.log('更新' + _updateUrl);
            location.href = _updateUrl;
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
            var _updateUrl = Url.setParam(_curentUrl, 'chn', _thisId),
              _updateUrl = Url.setParam(_updateUrl, 'page', 1);
            console.log('更新' + _updateUrl);
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
