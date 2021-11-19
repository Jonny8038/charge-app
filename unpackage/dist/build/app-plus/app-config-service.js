
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/newsList/newsList","pages/systemInfo/systemInfo","pages/server/server","pages/videoplay/videoplay","pages/faultInfo/faultInfo","pages/mapSite/mapSite","pages/login/login","pages/register/register","pages/registerUser/registerUser","pages/approveCar/approveCar","pages/approveUser/approveUser","pages/city/city","pages/my/my","pages/jyRecord/jyRecord","pages/carInfo/carInfo","pages/updateCar/updateCar","pages/balance/balance","pages/userInfo/userInfo","pages/yyRecord/yyRecord","pages/hdRecord/hdRecord","pages/cell/cell","pages/about/about","pages/system/system","pages/updatePassword/updatePassword","pages/fjwd/fjwd","pages/detaile/detaile","pages/itemDetaile/itemDetaile"],"window":{"navigationBarTextStyle":"black","navigationBarBackgroundColor":"#fff","backgroundColor":"#fff"},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"咔咔换电","compilerVersion":"3.2.9","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true},"window":{"navigationBarTitleText":"换电"}},{"path":"/pages/newsList/newsList","meta":{},"window":{"navigationBarTitleText":"新闻资讯"}},{"path":"/pages/systemInfo/systemInfo","meta":{},"window":{"navigationBarTitleText":"系统消息"}},{"path":"/pages/server/server","meta":{},"window":{"navigationBarTitleText":"服务"}},{"path":"/pages/videoplay/videoplay","meta":{},"window":{"navigationBarTitleText":"播放视频"}},{"path":"/pages/faultInfo/faultInfo","meta":{},"window":{"navigationBarTitleText":"故障信息"}},{"path":"/pages/mapSite/mapSite","meta":{},"window":{"navigationBarTitleText":"地图站点","subNVues":[{"id":"popup_detaile","path":"pages/mapSite/subNVue/popDetaile","type":"popup","style":{"position":"absolute","left":"0","right":"0","bottom":"0","zindex":2,"width":"750rpx","height":"788rpx"}},{"id":"popup_tk","path":"pages/mapSite/subNVue/popTk","type":"popup","style":{"position":"absolute","right":"0","bottom":"0","width":"100%","height":"100%","zindex":3,"background":"rgba(0,0,0,0.5)"}}]}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTextStyle":"white","navigationStyle":"custom","titleNView":false}},{"path":"/pages/register/register","meta":{},"window":{"navigationBarTitleText":"注册"}},{"path":"/pages/registerUser/registerUser","meta":{},"window":{"navigationBarTitleText":"注册"}},{"path":"/pages/approveCar/approveCar","meta":{},"window":{"navigationBarTitleText":"车辆认证"}},{"path":"/pages/approveUser/approveUser","meta":{},"window":{"navigationBarTitleText":"用户认证"}},{"path":"/pages/city/city","meta":{},"window":{"navigationBarTitleText":"选择城市"}},{"path":"/pages/my/my","meta":{},"window":{"navigationBarBackgroundColor":"#212D43","navigationBarTitleText":"我的","navigationBarTextStyle":"white"}},{"path":"/pages/jyRecord/jyRecord","meta":{},"window":{"navigationBarTitleText":"账单"}},{"path":"/pages/carInfo/carInfo","meta":{},"window":{"navigationBarTitleText":"车辆详情"}},{"path":"/pages/updateCar/updateCar","meta":{},"window":{"navigationBarTitleText":"更换车辆"}},{"path":"/pages/balance/balance","meta":{},"window":{"navigationBarTitleText":"我的余额","navigationStyle":"custom","titleNView":false}},{"path":"/pages/userInfo/userInfo","meta":{},"window":{"navigationBarTitleText":"个人资料"}},{"path":"/pages/yyRecord/yyRecord","meta":{},"window":{"navigationBarTitleText":"预约记录"}},{"path":"/pages/hdRecord/hdRecord","meta":{},"window":{"navigationBarTitleText":"换电记录"}},{"path":"/pages/cell/cell","meta":{},"window":{"navigationBarTitleText":"我的电池"}},{"path":"/pages/about/about","meta":{},"window":{"navigationBarTitleText":"关于我们"}},{"path":"/pages/system/system","meta":{},"window":{"navigationBarTitleText":"系统设置"}},{"path":"/pages/updatePassword/updatePassword","meta":{},"window":{"navigationBarTitleText":"修改密码"}},{"path":"/pages/fjwd/fjwd","meta":{},"window":{"navigationBarTitleText":"服务网点"}},{"path":"/pages/detaile/detaile","meta":{},"window":{"navigationBarTitleText":"站内详情"}},{"path":"/pages/itemDetaile/itemDetaile","meta":{},"window":{"navigationBarTitleText":"站内资讯"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
