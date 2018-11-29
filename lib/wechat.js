let sha1 =require("sha1");

class Wechat {
    constructor(config) {
        let {
            appid,
            appsecret,
            token,
            isSafe
        } = config;
        this.appid = appid;
        this.appsecret = appsecret;
        this.token = token;
        this.isSafe = isSafe;
    }
    /*
     判断请求是否来自微信
     */
    static isRequestFromWechat(ctx,token) {
        let {
            signature,
            timestamp,
            nonce,
            echostr
        } = ctx.query;
        var str = [token, timestamp, nonce].sort().join("");
        return sha1(str) === signature;
    }

}

module.exports = Wechat;