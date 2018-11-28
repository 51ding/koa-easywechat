const WeChat = require("./wechat");
const ReceivceMessage = require("./message/receiveMessage");
let Message = require("./message/message");
let Config = require("./config");

function Core(options, message) {
  let config = new Config(options);
  let wechat = new WeChat(config);
  return async function(ctx, next) {
    ctx.wechat = wechat;
    try {
      await next();
      requestHandler.call(ctx, options.token);
    } catch (error) {
      throw error;
    }
  }
}
Core.Message = ReceivceMessage;
module.exports = Core;
async function requestHandler(token) {
  let ctx = this;
  var {
    signature,
    timestamp,
    nonce,
    echostr,
    encrypt_type,
    msg_signature
  } = ctx.query;
  if (WeChat.isRequestFromWechat(ctx, token)) {
    //接入微信
    if (ctx.method === "GET") {
      ctx.body = echostr;
    }
    //接收消息
    else if (ctx.method === "POST") {
      let message = new Message();
      var obj = await message.getMessage(ctx);
      console.log(obj);
    } else {}
  }
}