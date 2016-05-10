/**
 * Created by renjiale on 2016/4/22.
 */
/**
 * @fileOverview
 * @author  renjiale
 * Created: 2016-4-11
 */
LBF.define('site.free.limitedFree', function (require, exports, module) {
    var $ = require('lib.jQuery'),
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('site.component.ajaxSetting'),
        Checkbox = require('ui.Nodes.Checkbox'),
    //report = require('site.component.report'),
        Header = require('site.component.header'),
        BrowserSupport = require('site.component.browserSupport'),
        Pagination = require('ui.Nodes.Pagination'),
    //addBook.js中已经引用了login.js，因此引用了它则无需再引用login.js
        Addbook = require('site.free.addBook'),
        Cookie = require('util.Cookie'),
        LightTip = require('ui.widget.LightTip.LightTip');

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
            'click #free-type-tab li': 'freeTypeSwitch',
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
            //限免倒计时
            this.freeCountDown();
        },
        /**
         * 免费种类切换
         * @method freeTypeSwitch
         * @param e:事件对象
         */
        freeTypeSwitch: function (e) {
            var target = $(e.target);
            var pageType = parseInt(target.attr('type'));
            if (pageType == 1) {
                location.href = g_data.targetUrl;
            } else {
                location.href = g_data.targetUrl + '/all';
            }

            //target.addClass('act').siblings().removeClass('act');
            //$('#free-channel-wrap > div').eq($('#free-type-tab li').index(target)).show().siblings().hide();
        },
        /**
         * 限免倒计时
         * @method freeCountDown
         */
        freeCountDown: function () {
            $.ajax({
                type: 'GET',
                url: '/ajax/Free/getSysTime',
                dataType: 'json',
                success: function (d) {
                    var _d = d;
                    //服务器系统时间
                    var sysTime = _d.data.sysTime;
                    //从html模板中获取结束时间
                    var end_time = $('#time-box').attr('data-endtime');

                    //按照结束时间开启计算，生成到html显示剩余时间
                    $(function () {
                        countDown(end_time, "#time-box .day", "#time-box .hour", "#time-box .minute", "#time-box .second");
                    });

                    //计算倒计时
                    function countDown(endTime, day_elem, hour_elem, minute_elem, second_elem) {
                        //剩余时间 = 结束时间 - 服务器系统时间
                        var remaining = end_time / 1000;
                        var timer = setInterval(function () {
                            if (remaining > 0) {
                                remaining -= 1;
                                var day = Math.floor((remaining / 3600) / 24);
                                var hour = Math.floor((remaining / 3600) % 24);
                                var minute = Math.floor((remaining / 60) % 60);
                                var second = Math.floor(remaining % 60);
                                day_elem && $(day_elem).text(day);
                                $(hour_elem).text(hour < 10 ? "0" + hour : hour);
                                $(minute_elem).text(minute < 10 ? "0" + minute : minute);
                                $(second_elem).text(second < 10 ? "0" + second : second);
                                if (remaining <= 0) {
                                    //给免费阅读加上disabled样式
                                    $('#limit-list li a.red-btn').addClass('disabled');
                                    //如果是disabled，点击无法跳转
                                    $('#limit-list li a.disabled').click(function () {
                                        return false;
                                    });
                                }
                            } else {
                                clearInterval(timer);
                            }
                        }, 1000);
                    }
                }
            });
        },
        /**
         * 加入书架
         * @method addToBookShelf
         */
        addToBookShelf: function (e) {
            //引用Addbook.js中的加入书架方法
            Addbook.addToBookShelf(e, 'blue-btn', 'in-shelf');
        }
    })
});