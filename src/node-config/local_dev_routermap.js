/**
 * 本地调试使用的路由map
 * 动态和静态混合使用
 */

var routerMap = {
	//免费
    'free.qidian.com/limit': {'views': '/limit', 'cgi': '/page/free/index'},
    'free.qidian.com/all': {'views': '/index', 'cgi': '/page/bookStore/free'},
	'free.qidian.com/'	   : {'views': '/limit', 'cgi': '/page/free/index'},

	//全部
    'all.qidian.com/index':  {'views': '/index', 'cgi': '/page/bookStore/index'},
	'all.qidian.com/'     :  {'views': '/index', 'cgi': '/page/bookStore/index'},

	//完本
	'finish.qidian.com/index':  {'views': '/index', 'cgi': '/page/bookStore/finish'},
	'finish.qidian.com/'  :  {'views': '/index', 'cgi': '/page/bookStore/finish'},

    //排行榜单
    'rank.qidian.com/': { 'views': '/hot/index', 'cgi': '/page/rank/index'},//人气榜单
    'rank.qidian.com/yuepiao': { 'views': '/hotnew', 'cgi': '/page/rank/fy' },//原创风云榜
    'rank.qidian.com/hotsales': { 'views': '/hotnew', 'cgi': '/page/rank/dailyHot' },//24小时热销榜
    'rank.qidian.com/click': { 'views': '/hotnew', 'cgi': '/page/rank/vipClick' },//会员点击榜
    'rank.qidian.com/recom': { 'views': '/hotnew', 'cgi': '/page/rank/recom' },//推荐票榜
    'rank.qidian.com/collect': { 'views': '/hotnew', 'cgi': '/page/rank/collect' },//收藏榜
    'rank.qidian.com/vipup': { 'views': '/hotnew', 'cgi': '/page/rank/vipUpd' },//VIP更新榜
    'rank.qidian.com/vipcollect': { 'views': '/hotnew', 'cgi': '/page/rank/vipCollect' },//VIP收藏
    'rank.qidian.com/vipreward': { 'views': '/hotnew', 'cgi': '/page/rank/vipReward' },//VIP打赏
    'rank.qidian.com/fin': { 'views': '/hotnew', 'cgi': '/page/rank/fin' },//完本榜
    'rank.qidian.com/signnewbook': { 'views': '/hotnew', 'cgi': '/page/rank/signNewBk' },// 签约作家新书榜
    'rank.qidian.com/pubnewbook': { 'views': '/hotnew', 'cgi': '/page/rank/pubNewBk' },//公众作者新书榜
    'rank.qidian.com/newsign': { 'views': '/hotnew', 'cgi': '/page/rank/newSign' },//新人签约新书榜
    'rank.qidian.com/newauthor': { 'views': '/hotnew', 'cgi': '/page/rank/newAuthor' },//新人作家新书榜
    'rank.qidian.com/fans': { 'views': '/community', 'cgi': '/page/rank/rewardFans' },//打赏粉丝

    //搜索
    'search.qidian.com/index': { 'views': '/index', 'cgi': '/page/Search/getByKeyword' }, //搜索接口
	'search.qidian.com/': { 'views': '/index', 'cgi': '/page/Search/getByKeyword' },//搜索接口

    //频道页
    /* 玄幻 - 大频道 */
    'channel.qidian.com/xuanhuan':{ 'views': '/xuanhuan', 'cgi': '/page/channel/big' },
    /* 武侠 - 定制频道  */
    'channel.qidian.com/wuxia':{ 'views': '/wuxia', 'cgi': '/page/channel/wuxia' },

    /* 军事 - 小频道 */
    'channel.qidian.com/junshi':{ 'views': '/junshi', 'cgi': '/page/channel/big' },

    //下面实际为静态页面,请勿把静态路由放到了 dynamic_routermap.js厘米
    'erciyuan.qidian.com/':{ 'views': '/index', 'cgi': '/page/Search/getByKeyword' },
    'www.qidian.com/':{'views':''}

};


module.exports = routerMap;
