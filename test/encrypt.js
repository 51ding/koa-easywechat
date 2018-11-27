var assert =require("assert");
var WXBizMsgCrypt =require("../lib/encrypt/wxBizMsgCrypt");

describe("微信消息加解密",function () {
    it("微信消息解密",function (done) {
        var sToken = "QDG6eK";
        var  sAppID = "wx5823bf96d3bd56c7";
        var sEncodingAESKey = "jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C";

        var wxcpt = new WXBizMsgCrypt(sToken,sEncodingAESKey,sAppID);

        var  sReqMsgSig = "477715d11cdb4164915debcba66cb864d751f3e6";
        var sReqTimeStamp = "1409659813";
        var sReqNonce = "1372623149";
        var sReqData = "<xml><ToUserName><![CDATA[wx5823bf96d3bd56c7]]></ToUserName><Encrypt><![CDATA[RypEvHKD8QQKFhvQ6QleEB4J58tiPdvo+rtK1I9qca6aM/wvqnLSV5zEPeusUiX5L5X/0lWfrf0QADHHhGd3QczcdCUpj911L3vg3W/sYYvuJTs3TUUkSUXxaccAS0qhxchrRYt66wiSpGLYL42aM6A8dTT+6k4aSknmPj48kzJs8qLjvd4Xgpue06DOdnLxAUHzM6+kDZ+HMZfJYuR+LtwGc2hgf5gsijff0ekUNXZiqATP7PF5mZxZ3Izoun1s4zG4LUMnvw2r+KqCKIw+3IQH03v+BCA9nMELNqbSf6tiWSrXJB3LAVGUcallcrw8V2t9EL4EhzJWrQUax5wLVMNS0+rUPA3k22Ncx4XXZS9o0MBH27Bo6BpNelZpS+/uh9KsNlY6bHCmJU9p8g7m3fVKn28H3KDYA5Pl/T8Z1ptDAVe0lXdQ2YoyyH2uyPIGHBZZIs2pDBS8R07+qN+E7Q==]]></Encrypt></xml>";
        var sMsg = "";  //解析之后的明文

        var ret=wxcpt.DecryptMsg(sReqMsgSig,sReqTimeStamp,sReqNonce,sReqData);
        ret.then(data =>{
            console.log("data",data.sMsg);
            done();
        }).catch(err=>{
            console.log(err);
        })
    })
    
    it("微信消息加密",function () {
        var sRespData = "<xml><ToUserName><![CDATA[mycreate]]></ToUserName><FromUserName><![CDATA[wx582测试一下中文的情况，消息长度是按字节来算的396d3bd56c7]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[this is a test]]></Content><MsgId>1234567890123456</MsgId></xml>";
        var sEncryptMsg = ""; //xml格式的密文
        
        var sToken = "QDG6eK";
        var  sAppID = "wx5823bf96d3bd56c7";
        var sEncodingAESKey = "jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C";

        var wxcpt = new WXBizMsgCrypt(sToken,sEncodingAESKey,sAppID);
        var sReqTimeStamp = "1409659813";
        var sReqNonce = "1372623149";
        var ret = wxcpt.EncryptMsg(sRespData,sReqTimeStamp,sReqNonce);
        console.log(ret);
    })
    
})