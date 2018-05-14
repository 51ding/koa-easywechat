var api=require("../api");
var request=require("../tool/request");
/**
 * 功能：获取access_Token
 */
async function getAccessToken() {
  if (!isValidateAccessToken.call(this)) {
    var token = await updateAccessToken.call(this);
    return token;
  }
  else {
    return this.accessToken;
  }
}

/**
 * 功能：判断是否是合法的access_Token
 */
function isValidateAccessToken() {
  if (!this.accessToken || !this.expiresIn) return false;
  return this.expiresIn > Date.now();
}


/**
 * 功能：如果access_token不合法或者过期则向微信服务器发送请求，更新accsee_Token
 */
async function updateAccessToken() {
  var url = api.accseeToken + `&appid=${this.appID}&secret=${this.appsecret}`;
  try {
    var result = await request.get(url);
    this.accessToken = result.access_token;
    this.expiresIn = Date.now() + (result.expires_in - 20) * 1000;
    return this.accessToken;
  }
  catch (err) {
    throw err;
  }
}

module.exports = {
  getAccessToken
};