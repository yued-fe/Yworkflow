 /**
  * 起点改造静态化服务路由
  *
  * key值为node server暴露给后端的api
  * /api/v1/setdata/:key
  * 对应value为views的路径和最终在server上生成的文件夹和文件实体路径
  * 注:务必严格按照下列规范书写路由规则
  * 若为子频道页面,统一使用  channel/index.html 方式
  * 若为具体的单独页面,则使用 channel/name.html 方式
  *
  */

 var routerMap = {
     '/home': '/index.html',
     '/rank': '/rank/index.html',
     '/erciyuan': '/erciyuan/index.html',
     '/rankshow': '/rank/a/show.html',
     '/free': '/free/index.html',
     '/channel': '/channel/index.html'
 }


 module.exports = routerMap;
