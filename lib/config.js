class Config {
  constructor(options) {
    this.options = options;
    let {
      appid,
      appsecret,
      token,
      issafe,
      encodingAESKey
    } = this.options;
    this.appid = appid;
    this.appsecret = appsecret;
    this.token = token;
    this.issafe = issafe === void(0) ? false : issafe;
    this.encodingAESKey = encodingAESKey;
    this.validateOptions();
  }
  static init(options) {
    Config.instance = new Config(options);
  }
  validateOptions() {
    ["appid", "appsecret", "token"].forEach(r => {
      if (this[r] === void(0)) {
        throw new Error(`缺少配置项${r}`);
      }
    })
    if (this.issafe === true && this.encodingAESKey === void(0)) {
      throw new Error("在安全模式下必须提供消息加解密秘钥-EncodingAESKey");
    }
  }
  static getInstance() {
    return Config.instance;
  }
}
module.exports = Config;