/**
 * Created by renjiale on 2016/4/26.
 *
 * views: 模板文件
 * cgi: 后端地址 ，同时在做local环境时，去除/xxx ，取后续对应的文件.json
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
    'rank.qidian.com/yuepiao': { 'views': '/hotnew', 'cgi': '/page/rank/fy' },//风云榜
    'rank.qidian.com/daily': { 'views': '/hotnew', 'cgi': '/page/rank/dailyHot' },//24小时热销榜
    'rank.qidian.com/vip': { 'views': '/hotnew', 'cgi': '/page/rank/vipClick' },//会员点击榜
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
	'search.qidian.com/': { 'views': '/index', 'cgi': '/page/Search/getByKeyword' }//搜索接口
}


module.exports = routerMap;
