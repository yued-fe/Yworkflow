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
            $(document).ready(function(){

                // P 浏览行为
                var logtype = 'P';
                var eventid = pageId;
                var url = cgi + '?path=pclog&' + 'logtype=' + logtype + '&eventid=' + eventid;
                createSender(url);
            });

            // 点击链接
            $(document).on('click.report', function(e){
                var target = $(e.target);

                // A 点击行为
                var logtype = 'A';
                var eventid = '';
                var bookid = '';
                var chapterUrl = '';
                var tid = '';
                var rankid = '';
                var x = '';
                var y = '';
                var currentElement = target;

                // x = e.clientX;
                // y = e.clientY;

                while(currentElement.get(0).tagName != 'BODY'){

                    // 如果获取到模块ID，直接return
                    if(currentElement.data('aid')){
                        eventid = currentElement.data('aid');
                        break;
                    }

                    // 如果点击的是书籍
                    if(currentElement.data('bid')){
                        bookid = currentElement.data('bid');
                    }

                    // 如果点击的是章节
                    if(currentElement.data('chapterurl')){
                        chapterUrl = currentElement.data('chapterurl');
                    }

                    // 如果点击的是标签
                    if(currentElement.data('tid')){
                        tid = currentElement.data('tid');
                    }

                    // 如果点击的是列表，获取被点击的序号
                    if(currentElement.data('rankid')){
                        tid = currentElement.data('rankid');
                    }

                    currentElement = currentElement.parent();
                }

                // path | pclog 区分平台类型
                // logtype | A 点击行为 | P 浏览行为
                // eventid 页面模块标识
                // bookid 书籍ID
                // chapterUrl 章节信息
                // tid 标签名;
                // rankid 列表序号;
                // x 横坐标;
                // y 纵坐标
                var url = cgi + '?path=pclog&' + 'logtype=' + logtype + '&eventid=' + eventid + '&bookid=' + bookid + '&chapterUrl=' + chapterUrl;

                // 防刷
                if(eventid == '' && bookid == '' && tid == ''&& chapterUrl == '' && rankid == ''){
                    return;
                }

                createSender(url);
            });
        }
    };

    function createSender(url){
        var img = new Image();
        img.onload = img.onerror = function(){
            img = null;
        };
        img.src = url;
    }

    return report;
});
