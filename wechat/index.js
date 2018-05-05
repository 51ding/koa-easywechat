var sha1 = require("sha1");
var util=require("util");
var getRawBody=require("raw-body");
var WeChat = require("./wechat");
var tool=require("../lib/tool");

module.exports = function (options) {
  var wechat = new WeChat(options);
  return async function (ctx, next) {
    //接入
    if (ctx.method == "GET") {
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
    else if (ctx.method == "POST") {
      var {signature, timestamp, nonce, echostr} = ctx.query;
      var token = options.token;
      var encryption = sha1([token, timestamp, nonce].sort().join(""));
      if (encryption === signature) {
        var text=await getRawBody(ctx.req,{
          length:ctx.length,
          limit:"1mb",
          encoding:"utf8"
        })
        var xmlObject=await tool.parseXmlToObject(text)
        var message=tool.formatMessage(xmlObject.xml);
        ctx.receiveMessage=message;
        reply.call(ctx);
      }
      else {
        ctx.body = "只接受来自微信的请求!";
      }
    }
    else {

    }

  }
}





