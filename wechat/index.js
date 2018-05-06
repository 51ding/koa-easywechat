var sha1 = require("sha1");
var util = require("util");
var getRawBody = require("raw-body");
var WeChat = require("./wechat");
var tool = require("../lib/tool");

module.exports = function (options, handler) {
  var wechat = new WeChat(options);
  return async function (ctx, next) {
    ctx.app.context.wechat = wechat;
    //处理接入微信和消息回复逻辑
    if(ctx.path === "\/"){

      if(ctx.method=="GET"){
        wechat.gi
      }
      else if(ctx.method=="POST"){

      }else{
        await next();
      }
    }

    if (ctx.path === "\/" && ctx.method == "GET") {
      var {signature, timestamp, nonce, echostr} = ctx.query;
      var token = options.token;
      var encryption = sha1([token, timestamp, nonce].sort().join(""));
      if (encryption === signature) {
        ctx.body = echostr;
      }
      else {
        ctx.body = "只接受来自微信的请求!";
      }
    }
    else if (ctx.path === "\‌/" && ctx.method == "POST") {
      var {signature, timestamp, nonce, echostr} = ctx.query;
      var token = options.token;
      var encryption = sha1([token, timestamp, nonce].sort().join(""));
      if (encryption === signature) {
        var text = await getRawBody(ctx.req, {
          length: ctx.length,
          limit: "1mb",
          encoding: "utf8"
        })
        var xmlObject = await tool.parseXmlToObject(text)
        var message = tool.formatMessage(xmlObject.xml);
        ctx.receiveMessage = message;
        //改变执行上下文
        await handler.call(ctx, next);
        //回复消息
        wechat.reply.call(ctx);
      }
      else {
        ctx.body = "只接受来自微信的请求!";
      }
    }
    else {
      await next();
    }
  }
}





