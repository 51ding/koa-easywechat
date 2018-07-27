var is = require("is");

function Wechat(opts) {
    opts = opts || {};
    validateOpts(opts);

}


function validateOpts(opts) {
    var {mode,encodingAESKey} = opts;
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

module.exports =Wechat;