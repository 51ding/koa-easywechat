var WeChat = require("./wechat");
var lib=require("../lib");
var WeChatError=require("../Error/wechatError");
module.exports = function (options, handler) {

  var wechat=new WeChat(options);
  return async function (ctx, next) {
    try{
      ctx.app.context.wechat = wechat;
      await next();
      var token=await wechat.getAccessToken();
      await wechat.isMessageFromWeChat.call(ctx,handler);
    }
    catch(e){
      ctx.status = 200;
      console.log(e);
      ctx.body = {
        code:(e instanceof WeChatError)? -1:e.errcode,
        errmsg: e && e.message ? e.message : e.toString()
      }
    }
  }
}





