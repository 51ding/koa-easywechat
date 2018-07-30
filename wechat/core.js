var sha1=require("sha1");

/*验证消息的确来自微信服务器*/
function isMessageFfromWeChat(ctx) {
    if (!ctx) return;
    var {signature, timestamp, nonce, echostr} = ctx.query;
    var {token} = ctx.wechat;
    var encryption = sha1([token, timestamp, nonce].sort().join(""));
    return encryption === signature;
}


module.exports = {
    isMessageFfromWeChat
}