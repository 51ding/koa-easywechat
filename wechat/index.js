var is=require("is");
var HttpRequest=require("../common/request");
var {api,wechatApi}=require("../api");

function WeChat(opts) {
    opts = opts || {};
    validateOpts(opts);
    this.appID = opts.appID;
    this.appsecret = opts.appsecret;
    this.token = opts.token;
    this.mode = opts.mode;
    this.encodingAESKey = opts.encodingAESKey;
    this.accessToken = null;
    this.expiresIn = null;
}


/**
 * 功能：获取access_Token
 */
WeChat.prototype.getAccessToken = async function () {
    if (!this.isValidateAccessToken()) {
        var token = await this.updateAccessToken();
        return token;
    }
    else {
        return this.accessToken;
    }
}

/**
 * 功能：判断是否是合法的jsApiTicket
 */
WeChat.prototype.isValidateAccessToken =  function() {
    if( !this.accessToken || !this.expiresIn)
        return false;
    else if(Date.now() > this.expiresIn)
        return false
    else
        return true;
}


/**
 * 功能：如果access_token不合法或者过期则向微信服务器发送请求，更新accsee_Token
 */
WeChat.prototype.updateAccessToken = async function () {
    var url = api.accseeToken + `&appid=${this.appID}&secret=${this.appsecret}`;
    var data = await HttpRequest.get(url);
    this.accessToken = data.access_token;
    this.expiresIn = Date.now() + (data.expires_in - 20) * 1000;
    return this.accessToken;
}


function validateOpts(opts) {
    var {mode, encodingAESKey} = opts;
    ["appID", "appsecret", "token", "mode"].forEach(item => {
        if (!opts[item] || !is.string(opts[item])) throw new Error(`无效的【${item}】参数!`);
    })
    checkMode(mode);
    if ((mode == "compatible" || mode == "safe") && !encodingAESKey)
        throw new Error("兼容模式和安全模式需要提供【encodingAESKey】参数！");

}


/**
 * @param [string] mode 消息加解密方式
 *   - clear：明文模式
 *   - compatible：兼容模式
 *   - safe：安全模式
 */
function checkMode(mode) {
    const enableMode = ["clear", "compatible", "safe"];
    if (!enableMode.includes(mode))
        throw new Error(`无效的消息加解密方式,有效值为["clear","compatible","safe"],当前值为${mode}`);
}

/*
* 功能:给WeChat.prototype上挂载微信的方法
*/
Object.assign(WeChat.prototype,wechatApi());

module.exports = WeChat;