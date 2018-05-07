var WeChat = require("./wechat");

module.exports = function (options, handler) {
  var wechat = new WeChat(options);
  return async function (ctx, next) {
    ctx.app.context.wechat = wechat;
    await wechat.isMessageFromWeChat.call(ctx,handler,next);
  }
}





