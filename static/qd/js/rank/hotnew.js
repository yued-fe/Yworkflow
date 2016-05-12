/**
 * @fileOverview
 * @author  luolei
 * Created: 2016-04-08
 */
LBF.define('/qd/js/rank/hotnew.js', function(require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ComboBox = require('ui.widget.ComboBox.ComboBox'),
        ajaxSetting = require('/qd/js/component/ajaxSetting.js'),
        //report = require('site.component.report'),
        Header = require('/qd/js/component/header.js'),
        BrowserSupport = require('/qd/js/component/browserSupport.js'),
        Pagination = require('ui.Nodes.Pagination'),
        Cookie = require('util.Cookie'),
        Url = require('/qd/js/component/url.js'),
        Login = require('/qd/js/index/login.js'),
        Addbook = require('/qd/js/freeaddBook.js');
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
            'click .type-list a': 'chanIdSwitch',
            'click .rank-tab-box a': 'switchRankTab'
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
            //report.send();

            //初始化日期下拉组件
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
            var _curentUrl = location.href;

            var _updateDateRankType = target.attr('data-rank-type');
            var _updateUrl = Url.setParam(_curentUrl, 'dateType', _updateDateRankType);
            location.href = _updateUrl;

        },


        /**
         * 初始化日期下拉组件
         * @method dateDropDown
         */
        dateDropDown: function() {
            if ($('body').hasClass('rank-type-1') && $('body').attr('id') != 0 ) {
                var yearDrop = new ComboBox({
                    selector: $('#year'),
                    className: 'year',
                    events: {
                        click: function(e) {

                            var _curentUrl = location.href;
                            var _currentYear = parseInt($('#year a').attr('data-value')),
                                _currentMonth = parseInt($('#month a').attr('data-value'));
                            var _this = $(e.target);
                            var _updateYear = yearDrop.val(); //即将更新的年
                            //此处逻辑微调，改为不等于第一个值的时候才进行操作，如果写return false的话，点击旁边的下拉框，此下拉框不会消失，因为阻止了组件的事件 by-yangye
                            if (_updateYear !== $('#year a').attr('data-value')) {
                                _updateUrl = Url.setParam(_curentUrl, 'year', yearDrop.val());

                                if (_currentYear < 2016) {
                                    console.log('当前年是老的');
                                    console.log(_currentMonth);
                                    if (_updateYear >= 2016 && _currentMonth >= 4) {
                                        _updateUrl = Url.setParam(_updateUrl, 'chn', -1);
                                        console.log(_updateUrl);
                                    }
                                }
                                console.log('更新' + _updateUrl);
                                location.href = _updateUrl;
                            }
                        }
                    }
                });
                var monthDrop = new ComboBox({
                    selector: $('#month'),
                    className: 'month',
                    maxDisplay: 13,
                    events: {
                        click: function(e) {
                            var _currentYear = parseInt($('#year a').attr('data-value')),
                                _currentMonth = parseInt($('#month a').attr('data-value'));
                            var _this = $(e.target);
                            var _updateMonth = monthDrop.val(); //即将更新的月份
                            // console.log(_updateMonth);
                            // return false;

                            //此处逻辑微调，改为不等于第一个值的时候才进行操作，如果写return false的话，点击旁边的下拉框，此下拉框不会消失，因为阻止了组件的事件 by-yangye
                            if (_updateMonth !== $('#month a').attr('data-value')) {
                                var _curentUrl = location.href;
                                var _updateUrl = Url.setParam(_curentUrl, 'month', monthDrop.val());
                                console.log('demo:' + _updateUrl);
                                if (_currentYear >= 2016 && _currentMonth < 4) {
                                    //console.log('当前是老的');
                                    if (_updateMonth >= 4) {
                                        _updateUrl = Url.setParam(_updateUrl, 'chn', -1);
                                    }
                                }
                                //console.log('更新' + _updateUrl);
                                location.href = _updateUrl;
                            }
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
            var _updateUrl = Url.setParam(_curentUrl, 'style', 1),
                _updateUrl = Url.setParam(_updateUrl, 'page', 1);
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
            _updateUrl = Url.setParam(_updateUrl, 'page', 1);
            console.log('更新' + _updateUrl);
            location.href = _updateUrl;
        },

        /**
         * 切换分类
         */

        chanIdSwitch: function(e) {
            var _this = $(e.target);
            var _thisId = _this.attr('data-chanid');
            console.log('切换列表');
            //将列表模式的值设置到cookie中
            var _curentUrl = location.href;
            var _updateUrl = Url.setParam(_curentUrl, 'chn', _thisId),
                _updateUrl = Url.setParam(_updateUrl, 'page', 1);

            if (_this.hasClass('current-month')) {
                _updateUrl = Url.setParam(_updateUrl, 'month', '');
            }

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
