var getRawBody = require("raw-body");
var util = require("../common/util");
var WXBizMsgCrypt=require("../common/encrpyt/WXBizMsgCrypt");

async function MessageFactory() {
    var ctx = this;
    /*判断是否加密*/
    var text = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: "1mb",
        encoding: "utf8"
    })
    var {encrypt_type, msg_signature} = ctx.query;
    var mode=encrypt_type && msg_signature && ctx.wechat.mode == "safe" ? "safe" :"clear";
    return ModeFactory(mode).getMessage.call(ctx,text);
}


/*明文模式*/
var clearMode = {
    async getMessage(text) {
        var xmlObj = await util.parseXmlToObject(text);
        var message = util.formatMessage(xmlObj.xml);
        return message;
    }
}

/*兼容模式*/
var safeMode = {
    async getMessage(text) {
        var {msg_signature, timestamp, nonce}=this.query;
        var {token,appID,encodingAESKey}=this.wechat;
        var wxcpt=new WXBizMsgCrypt({
            sToken: token,
            sCorpID:appID,
            sEncodingAESKey:encodingAESKey
        });
        try{
            var message = await wxcpt.DecryptMsg(msg_signature, timestamp, nonce, text);
        }
        catch(err){
            throw new Error("解密错误，请检查encodingAESKey是否正确！");
        }
        message = util.formatMessage(message.sMsg);
        return message;
    }
}


function ModeFactory(modeType) {
    var mode;
    switch(modeType){
        case "clear":
            mode=clearMode;
            break;
        case "compatible":
            mode=clearMode;
            break;
        case "safe":
            mode=safeMode;
            break;
        default:
            throw new Error("无效的消息加解密类型！");
    }
    return mode;
}


module.exports = MessageFactory;