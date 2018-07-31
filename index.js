var WeChat = require("./wechat/index");
var core = require("./wechat/core");
var RequestMessage = require("./wechat/RequestMessage");
var ResponseMessage = require("./wechat/ResponseMessage");
var util = require("./common/util");

module.exports = function (options, replyHandler) {
    var wechat = new WeChat(options);
    if (replyHandler && !util.isAsyncFunction(replyHandler)) throw new Error("第二个参数请传入一个async函数");
    return async function (ctx, next) {
        ctx.app.context.wechat = wechat;
        try {
            await next();
            await handler.call(ctx, replyHandler);
        }
        catch (err) {
            throw err;
        }
    }
}

async function handler(replyHandler) {
    var ctx = this;
    var wechat = ctx.wechat;
    var {signature, timestamp, nonce, echostr, encrypt_type, msg_signature} = ctx.query;
    //只处理来自微信服务器的请求
    if (core.isMessageFfromWeChat(ctx)) {
        //接入微信
        if (ctx.method === "GET")
            ctx.body = echostr;
        //接收消息
        else if (ctx.method === "POST") {
            //获取用户消息
            var message = await RequestMessage.call(ctx);
            ctx.message = message;
            if (replyHandler) {
                await replyHandler.call(this);
                //回复消息
                await ResponseMessage.call(this);
            }
            else
                this.body = "";
        }
    }

}
