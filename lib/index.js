const WeChat = require("./wechat");
let MatchMessage = require("./message/matchMessage");
let Message = require("./message/receiveMessage/message");
let Config = require("./config");

function Core(options, message) {
  let config = new Config(options);
  let wechat = new WeChat(config);
  return async function(ctx, next) {
    ctx.wechat = wechat;
    try {
      await next();
      await requestHandler.call(ctx, options.token, message);
    } catch (error) {
      throw error;
    }
  }
}
Core.Message = MatchMessage;
module.exports = Core;
async function requestHandler(token, matchMessage) {
  let ctx = this;
  let {
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
      let message = new Message(ctx);
      let obj = await message.getMessage(ctx);
      if (matchMessage && matchMessage instanceof MatchMessage) {
        matchMessage.actionInvoke(obj, ctx);
      }
    } else {}
  }
}