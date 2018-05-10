//消息加密
var Cryptography= require("../lib/Cryptography");
var input="<xml><ToUserName><![CDATA[mycreate]]></ToUserName><FromUserName><![CDATA[wx582396d3bd56c7]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[this is a test]]></Content><MsgId>1234567890123456</MsgId><AgentID>128</AgentID></xml>";
var EncodingAESKey="jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C";
var corpid="wx5823bf96d3bd56c7";

// Cryptography.AES_encrypt(input,EncodingAESKey,corpid)


var WXBizMsgCrypt = require("../lib/WXBizMsgCrypt");

var wxcpt = new WXBizMsgCrypt({
  sToken: "QDG6eK",
  sCorpID: "wx5823bf96d3bd56c7",
  sEncodingAESKey: "jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C"
});
var sReqTimeStamp = "1409659813";
var sReqNonce = "1372623149";
console.log(wxcpt.EncryptMsg(input,sReqTimeStamp,sReqNonce).sEncryptMsg);



