/**
 * @fileOverview
 * @author rainszhang
 * Created: 16-03-28
 */
LBF.define('site.component.report', function (require, exports, module) {
    var $ = require('lib.jQuery');

    var report = {};
    var envType = g_data.envType;
    var pageId = g_data.pageId;
    var cgi = 'http://i.qidian.com/qreport';

    /**
     * 发送统计请求
     * @methed send
     */
    report.send = function(){

        // 只有运营环境才发送统计
        if(envType === 'pro'){

            // 页面加载后单独发请求统计PV
            $(document).ready(function() {

                var url = cgi + '?';
                var obj = {

                    path: 'pclog',

                    // P 浏览行为
                    logtype: 'P',

                    // 页面ID
                    pageid: pageId || '',

                    // 当前页面url
                    pageUrl: window.location.href,

                    // 来源referrer
                    referer: document.referrer
                };

                // 合并url：http://i.qidian.com/qreport?path=pclog&logtype=P&pageid=qd_p_qidian&pageUrl=&referer=&
                $.each( obj, function( key, value ) {
                    url = url + key + '=' + value + '&';
                });

                // 去除最后一个&
                url = url.substring(0, url.length-1);

                createSender(url);
            });

            // 点击链接
            $(document).on('click.report', function(e){
                var target = $(e.target);

                var url = cgi + '?';
                var obj = {

                    // 平台类型
                    path: 'pclog',

                    // A 点击行为
                    logtype: 'A',

                    // 页面ID，每个页面hardcode
                    pageid: pageId,

                    // 当前页面url
                    pageUrl: window.location.href,

                    // 来源referrer
                    referer: document.referrer,

                    // 页面模块标识
                    eventid: '',

                    // 书籍ID
                    bookid: '',

                    // 章节信息
                    chapterUrl: '',

                    // 标签名
                    tid: '',

                    // 列表序号
                    rankid: '',

                    // 横坐标
                    x: e.clientX + $('body').scrollLeft() || '',

                    // 纵坐标
                    y: e.clientY + $('body').scrollTop() || '',

                    // 分辨率横屏
                    sw: screen.width,

                    // 分辨率竖屏
                    sh: screen.height
                };

                var currentElement = target;

                while(currentElement.get(0).tagName != 'BODY'){

                    // 如果获取的是列表index，直接return了
                    // 因为使用冒泡方式去获取数据，在首页aid有多地方是代表模块容器的，在其他页面aid并未如此，譬如列表里aid绑定的是a标签，而rankid绑在a标签的容器上，决定了rankid比aid后冒泡
                    if(currentElement.data('rankid')){
                        obj.tid = currentElement.data('rankid');
                        break;
                    }

                    // 如果获取到模块ID，直接return
                    if(currentElement.data('aid')){
                        obj.eventid = currentElement.data('aid');
                        break;
                    }


                    // 如果点击的是书籍
                    if(currentElement.data('bid')){
                        obj.bookid = currentElement.data('bid');
                    }

                    // 如果点击的是章节
                    if(currentElement.data('chapterurl')){
                        obj.chapterUrl = currentElement.data('chapterurl');
                    }

                    // 如果点击的是标签
                    if(currentElement.data('tid')){
                        obj.tid = currentElement.data('tid');
                    }

                    currentElement = currentElement.parent();
                }

                // 合并url：http://i.qidian.com/qreport?logtype=A&pageid=qd_p_qidian&pageUrl=&referer=&eventid=qd_A102&bookid=&chapterUrl=&tid=&rankid=&x=177&y=1142&sw=1440&sh=900&
                $.each( obj, function( key, value ) {
                    url = url + key + '=' + value + '&';
                });

                // 去除最后一个&
                url = url.substring(0, url.length-1);

                // 防刷
                if(obj.eventid == '' && obj.bookid == '' && obj.tid == ''&& obj.chapterUrl == '' && obj.rankid == ''){
                    return;
                }

                createSender(url);
            });
        }
    };

    /**
     * 创建发送请求器
     * @method createSender
     * @param url 发送的请求
     */
    function createSender(url){
        var img = new Image();
        img.onload = img.onerror = function(){
            img = null;
        };
        img.src = url;
    }

    return report;
});
