var request=require("request");
var rp=require("request-promise");
var api=require("./api");
var reply=require("../message/reply");
var fs=require("fs");
function WeChat(options) {
  this.appID = options.appID;
  this.appsecret = options.appsecret;
  this.accessToken;
  this.expiresIn;
  this.jsApiTicket;
  this.jsApiTicketExpiresIn;
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
 * 功能：获取jsapi_ticket,用于微信网页开发
 */
WeChat.prototype.getJsApiTicket =async function () {
  if(!this.isValidateJsApiTicket()){
    console.log("第一次");
    var token=await this.updateJsApiTicket();
    return token;
  }
  else{
    console.log("其他");
    return this.jsApiTicket;
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
 * 功能：判断是否是合法的jsApiTicket
 */
WeChat.prototype.isValidateJsApiTicket =function () {
  if (!this.jsApiTicket || !this.jsApiTicketExpiresIn) return false;
  return this.jsApiTicketExpiresIn > Date.now();
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

/**
 * 功能：更新jsApiTikcet
 */
WeChat.prototype.updateJsApiTicket = async function () {
  var accessToken=await this.getAccessToken();
  var url=api.jsApiTicket+`access_token=${accessToken}&type=jsapi`;
  try{
    var result=await rp(url);
    var data=JSON.parse(result);
    this.jsApiTicket=data.ticket;
    this.jsApiTicketExpiresIn=Date.now()+(data.expires_in-20)*1000;
    return this.jsApiTicket;
  }
  catch(err){
    throw err;
  }
}


WeChat.prototype.reply=function () {
	var ctx=this;
	//回复的内容
  var content=ctx.replyContent;
  //接收微信消息（有普通消息和事件消息两种类型）
  var message=ctx.receiveMessage;
  var xml=reply.getReplyMeaageTemplate(content,message);
  ctx.status=200;
  ctx.type="application/xml";
  ctx.body=xml;
}

/**
 * 功能：上传临时素材
 * @param [String] type 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb，主要用于视频与音乐格式的缩略图）
 * @param [Stream] stream 一个可读的文件流，例如fs.createReadStream(filePath)
 */
WeChat.prototype.uploadTemporaryMaterial=async function(type,filePath){
  var supportType=["image","voice","video","thumb"];
  if(!supportType.includes(type)) throw new Error(`无效的素材类型，仅支持${supportType.join(",")}`);
  var accessToken=await this.getAccessToken();
  var url=api.material.uploadTemporaryMaterial+`access_token=${accessToken}&type=${type}`
  var options={
    method:"POST",
    uri:url,
    formData:{
      media:fs.createReadStream(filePath)
    }
  }
  try{
    var response=await rp(options);
    return response;
  }
  catch(err){
    throw err;
  }

}

module.exports=WeChat;