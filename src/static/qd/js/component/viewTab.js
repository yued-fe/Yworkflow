/**
 * @fileOverview
 * @author yangye
 * Created: 16-04-11
 */
LBF.define('site.component.viewTab', function (require, exports, module) {
    var $ = require('lib.jQuery');

    /**
     * 榜单 完本 免费 通用 作品列表视图模式切换
     */
    $('#view-mode a').click(function () {
        $(this).addClass('act').siblings().removeClass('act');
        $('#rank-view-list > div').eq($('#view-mode a').index(this)).show().siblings().hide();
    });
});
