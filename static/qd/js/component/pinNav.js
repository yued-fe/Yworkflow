/**
 * @fileOverview
 * @author yangye
 * Created: 16-04-13
 */
LBF.define('site.component.pinNav', function (require, exports, module) {
    var $ = require('lib.jQuery');

    var report = {};
    var envType = g_data.envType;
    var pageId = g_data.pageId;

    var pinTopNav = {
        init: function () {
            // 处理导航交互：固定、显示隐藏
            this.pinTopNav();
        },
        /**
         * 处理导航交互：固定、显示隐藏
         * @methed pinTopNav
         */
        pinTopNav: function () {
            var PinNav = $('#pin-nav');
            var PinSearch = $('#pin-search');
            var PinInput = $('#pin-input');

            //判断滚动条位置显示固定导航
            function showPinNav() {
                if ($(window).scrollTop() > 500) {
                    PinNav.addClass('show');
                } else {
                    PinNav.removeClass('show');
                }
            }

            //滚动事件显示固定导航
            $(window).scroll(function () {
                showPinNav();
            });

            //页面刷新后再次判断显示顶部导航
            showPinNav();

            //固定滚动条hover事件
            PinNav.on('mouseenter', '.site-nav li, li.sign-in', function () {
                $('#pin-nav').find('li').removeClass('act');
                $(this).addClass('act');
            });
            PinNav.on('mouseleave','li', function () {
                $(this).removeClass('act');
            });

            PinSearch.mouseenter(function () {
                if (PinInput.hasClass('hide')) {
                    PinInput.animate({width: '170px', opacity: '1'}).removeClass('hide');
                }
            }).click(function () {
                if (PinInput.val() == '') {
                    PinInput.val(PinInput.attr('placeholder'))
                }
                var url = 'http://sosu.qidian.com/searchresult.aspx?keyword=' + encodeURIComponent(PinInput.val());
                $(this).attr('href', url);
                return true;
            });

            // 支持enter键搜索
            PinInput.on('keydown', function (evt) {
                if (evt.keyCode == 13) {
                    //判断值是否是空，是空去取placeholder值后带着值传给搜索页
                    if (PinInput.val() == '') {
                        PinInput.val(PinInput.attr('placeholder'))
                    }
                    var url = '//sosu.qidian.com/searchresult.aspx?keyword=' + encodeURIComponent(PinInput.val());
                    var el = document.createElement("a");
                    document.body.appendChild(el);
                    el.href = url;
                    el.target = '_blank';
                    el.click();
                    document.body.removeChild(el);
                }
            });

            //简单搜索失去焦点时滑动隐藏
            $(document).on("click", function (e) {
                var target = $(e.target);
                if (target.closest('#pin-input, #pin-search').length == 0) {
                    PinInput.stop().animate({width: "40px", opacity: '0'}).addClass('hide');
                }
            });
        }
    };
    pinTopNav.init();
});
