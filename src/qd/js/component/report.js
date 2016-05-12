/**
 * @fileOverview
 * @author rainszhang
 * Created: 16-03-28
 */
LBF.define('/qd/js/component/report.js', function (require, exports, module) {
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

            // 页面加载后发请求统计PV
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
                var currentElement = target;

                while(currentElement.get(0).tagName != 'BODY'){

                    if(currentElement.data('aid')){
                        eventid = currentElement.data('aid');
                        break;
                    }

                    if(currentElement.data('bid')){
                        bookid = currentElement.data('bid');
                    }

                    // JQ data自动转小写
                    if(currentElement.data('chapterurl')){
                        chapterUrl = currentElement.data('chapterurl');
                    }

                    currentElement = currentElement.parent();
                }

                // path | pclog 区分平台类型
                // logtype | A 点击行为 | P 浏览行为
                // eventid 页面模块标识
                // bookid 书籍ID
                // chapterUrl 章节信息
                var url = cgi + '?path=pclog&' + 'logtype=' + logtype + '&eventid=' + eventid + '&bookid=' + bookid + '&chapterUrl=' + chapterUrl;

                // 防刷
                if(eventid == '' && bookid == ''&& chapterUrl == ''){
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
