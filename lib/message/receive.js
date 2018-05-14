/*接受微信发送的消息*/
var sha1=require("sha1");

/*
 *功能：验证消息的确来自微信服务器
 *@param [String] signature 微信加密签名
 *@param [String] timestamp 时间戳
 *@param [String] nonce 随机数
 */
function checkSignature(signature, timestamp, nonce) {
  var token=this.token;
  var encryption = sha1([token, timestamp, nonce].sort().join(""));
  return encryption === signature;
}

module.exports={
  checkSignature
}