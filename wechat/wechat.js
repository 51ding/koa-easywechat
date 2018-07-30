var request = require("request");
var rp = require("request-promise");
var reply = require("../message/reply");
var fs = require("fs");
var sha1 = require("sha1");
var util = require("util");
var getRawBody = require("raw-body");
var tool = require("../lib/tool");
var WXBizMsgCrypt = require("../lib/WXBizMsgCrypt.js");
var lib=require("../lib");
var {copyProperty}=require("../tool/obj");


function WeChat(options) {
  var {appID, appsecret, token, isSafeModel, encodingAESKey} = options;
  if ([appID, appsecret, token].some(v => !v)) throw new Error("config配置不全，appID，appsecret，token为必填项！");
  if (isSafeModel === true && encodingAESKey === undefined) throw new Error("开启安全模式，需要填写加解密的秘钥[encodingAESKey！");

  this.appID = options.appID;
  this.appsecret = options.appsecret;
  this.token = options.token;
  this.isSafeModel = options.isSafeModel || false;
  this.encodingAESKey = options.encodingAESKey;
  this.accessToken = null;
  this.expiresIn = null;
  this.jsApiTicket = null;
  this.jsApiTicketExpiresIn = null;
  //开启安全模式
  if (this.isSafeModel == true) {
    this.wxcpt = new WXBizMsgCrypt({
      sToken: this.token,
      sCorpID: this.appID,
      sEncodingAESKey: this.encodingAESKey
    });
  }
}

/*给wechat对象注册方法*/
copyProperty(lib,WeChat.prototype);

/*挂载微信的方法*/
// (
//     function mountWeChatApi(obj) {
//       for(var key in obj){
//         if(obj.hasOwnProperty(key)){
//           if(typeof obj[key] === "object"){
//             mountWeChatApi(obj[key]);
//           }
//           else{
//             WeChat.prototype.key=obj[key];
//           }
//         }
//       }
//     }
// )(lib)

/**
 * 功能：验证消息的确来自微信服务器
 */
WeChat.prototype.isMessageFromWeChat = async function (handler) {
    var ctx = this;
    var wechat = ctx.wechat;
    var {signature, timestamp, nonce, echostr, encrypt_type, msg_signature} = ctx.query;
    var token = wechat.token;
    var encryption = sha1([token, timestamp, nonce].sort().join(""));
    if (encryption === signature) {
      //接入微信
    if (ctx.method == "GET") {
      ctx.body = echostr;
    }
    else if (ctx.method == "POST") {
      wechat.validateWechatRequest(encrypt_type, msg_signature);
      var text = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: "1mb",
        encoding: "utf8"
      })
      var message;
      //安全模式下，对消息进行加解密
      if (wechat.isSafeModel == true) {
        var result = await  wechat.decryptionMessage(msg_signature, timestamp, nonce, text);
        message = tool.formatMessage(result.sMsg);
      }
      else {
        var xmlObject = await tool.parseXmlToObject(text);
        message = tool.formatMessage(xmlObject.xml);
      }
      ctx.message = message;
      await handler.call(ctx);
      wechat.reply.call(ctx, timestamp, nonce);
    }
  }
}
//
//
WeChat.prototype.validateWechatRequest = function (encrypt_type, msg_signature) {
  if (this.isSafeModel == true && !encrypt_type && !msg_signature) {
    throw new Error("当前正处于明文模式,config.isSafeModel应该配置为false");
  }
  if (!this.isSafeModel && encrypt_type && msg_signature) {
    throw new Error("当前正处于安全模式,config.isSafeModel应该配置为true");
  }
}

/**
 * 功能：在开启安全时候，需要对微信发送过来的消息进行解密
 */
WeChat.prototype.decryptionMessage = async function (signature, timestamp, nonce, text) {
  var result = await this.wxcpt.DecryptMsg(signature, timestamp, nonce, text);
  return result;
}
//
// /**
//  * 功能：获取access_Token
//  */
// WeChat.prototype.getAccessToken = async function () {
//   if (!this.isValidateAccessToken()) {
//
//     var token = await this.updateAccessToken();
//     return token;
//   }
//   else {
//     return this.accessToken;
//   }
// }
//
// /**
//  * 功能：获取jsapi_ticket,用于微信网页开发
//  */
// WeChat.prototype.getJsApiTicket = async function () {
//   if (!this.isValidateJsApiTicket()) {
//     var token = await this.updateJsApiTicket();
//     return token;
//   }
//   else {
//     return this.jsApiTicket;
//   }
// }
//
//
// /**
//  * 功能：判断是否是合法的access_Token
//  */
// WeChat.prototype.isValidateAccessToken = function () {
//   if (!this.accessToken || !this.expiresIn) return false;
//
// }
//
// /**
//  * 功能：判断是否是合法的jsApiTicket
//  */
// WeChat.prototype.isValidateJsApiTicket = function () {
//   if (!this.jsApiTicket || !this.jsApiTicketExpiresIn) return false;
//   return this.jsApiTicketExpiresIn > Date.now();
// }
//
// /**
//  * 功能：如果access_token不合法或者过期则向微信服务器发送请求，更新accsee_Token
//  */
// WeChat.prototype.updateAccessToken = async function () {
//   var url = api.accseeToken + `&appid=${this.appID}&secret=${this.appsecret}`;
//   try {
//     var result = await rp(url);
//     var data = JSON.parse(result);
//     this.accessToken = data.access_token;
//     this.expiresIn = Date.now() + (data.expires_in - 20) * 1000;
//     return this.accessToken;
//   }
//   catch (err) {
//     throw err;
//   }
// }
//
// /**
//  * 功能：更新jsApiTikcet
//  */
// WeChat.prototype.updateJsApiTicket = async function () {
//   var accessToken = await this.getAccessToken();
//   var url = api.jsApiTicket + `access_token=${accessToken}&type=jsapi`;
//   try {
//     var result = await rp(url);
//     var data = JSON.parse(result);
//     this.jsApiTicket = data.ticket;
//     this.jsApiTicketExpiresIn = Date.now() + (data.expires_in - 20) * 1000;
//     return this.jsApiTicket;
//   }
//   catch (err) {
//     throw err;
//   }
// }
//
//
WeChat.prototype.reply = function (timestamp, nonce) {
  var ctx = this;
  //回复的内容
  var content = ctx.reply;
  //接收微信消息（有普通消息和事件消息两种类型）
  var message = ctx.message;
  var xml = reply.getReplyMeaageTemplate(content, message);
  if (this.wechat.isSafeModel == true) {
    xml = this.wechat.wxcpt.EncryptMsg(xml, timestamp, nonce).sEncryptMsg
  }
  ctx.status = 200;
  ctx.type = "application/xml";
  ctx.body = xml;
}
//

//
// /**
//  * 功能：创建自定义菜单
//  * @param [String] menuObject 菜单对象，对象的格式请参照微信开发文档，格式不对会抛出异常
//  */
// WeChat.prototype.createMenu = async function (menuObject) {
//   var accessToken = await this.getAccessToken();
//   var url = api.menu.createMenu + `access_token=${accessToken}`;
//   var options = {
//     method: "POST",
//     uri: url,
//     body: menuObject,
//     json: true
//   }
//   var response = await rp(options);
//   if (response.errcode != 0) {
//     throw new Error(`errcode:${response.errcode},errmsg:${response.errmsg}`);
//   }
// }
//
//
// /**
//  * 功能：自定义菜单查询
//  * @param [String] menuObject 菜单对象
//  * 返回值：菜单的自定菜单的json数据
//  */
// WeChat.prototype.getMenu = async function () {
//   var accessToken = await this.getAccessToken();
//   var url = api.menu.getMenu + `access_token=${accessToken}`;
//
//   var response = await rp(url);
//   return response;
// }
//
//
// /**
//  * 功能：删除自定义菜单
//  */
// WeChat.prototype.deleteMenu = async function () {
//   var accessToken = await this.getAccessToken();
//   var url = api.menu.deleteMenu + `access_token=${accessToken}`;
//
//   var response = await rp(url);
//
//   if (JSON.parse(response).errcode != 0) {
//     throw new Error(`errcode:${response.errcode},errmsg:${response.errmsg}`);
//   }
// }


module.exports = WeChat;