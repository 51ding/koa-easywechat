var request=require("request");
var rp=require("request-promise");
var api=require("./api");
var reply=require("../message/reply");
function WeChat(options) {
  this.appID = options.appID;
  this.appsecret = options.appsecret;
  this.accessToken;
  this.expiresIn;
}

/**
 * 功能：获取access_Token
 */
WeChat.prototype.getAccessToken =async function () {
  if(!this.isValidateAccessToken()){

    var token=await this.updateAccessToken();
    return token;
  }
  else{
    return this.accessToken;
  }
}

/**
 * 功能：判断是否是合法的access_Token
 */
WeChat.prototype.isValidateAccessToken =function () {
  if (!this.accessToken || !this.expiresIn) return false;
  return this.expiresIn > Date.now();
}

/**
 * 功能：如果access_token不合法或者过期则向微信服务器发送请求，更新accsee_Token
 */
WeChat.prototype.updateAccessToken = async function () {
  var url=api.accseeToken+`&appid=${this.appID}&secret=${this.appsecret}`;
  try{
    var result=await rp(url);
    var data=JSON.parse(result);
    this.accessToken=data.access_token;
    this.expiresIn=Date.now()+(data.expires_in-20)*1000;
    return this.accessToken;
  }
  catch(err){
    throw err;
  }
}

Wechat.prototype.reply=function () {
  var content="";
  var message=this.receiveMessage;
  var xml=reply.getReplyMeaageTemplate(content,message);
  ctx.status=200;
  ctx.type="application/xml";
  ctx.body=xml;
}


module.exports=WeChat;