let xml2js = require("xml2js");
let getRawBody = require("raw-body");
let Util = require("../../common/util");
module.exports = class MessageBase {
  constructor(ctx) {
    this.ctx = ctx;
  }
  async getMessage() {
    let text = await getRawBody(this.ctx.req, {
      length: this.ctx.length,
      limit: "1mb",
      encoding: "utf8"
    });
    let xmlObject = await Util.parseXmlToObject(text);
    let formatMessageObj = this.formatMessage(xmlObject.xml);
    this.message = formatMessageObj;
    return formatMessageObj;
  };
  /*
    格式化微信消息
   */
  formatMessage(obj) {
    let message = {};
    if (typeof obj === "object") {
      let keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let item = obj[key];
        if (!(item instanceof Array) || item.length === 0) {
          continue;
        }
        if (item.length == 1) {
          let val = item[0];
          
          if (typeof val === "object") {
            message[key] = formatMessage(val);
          } else {
            message[key] = val || "";
          }
        } else {
          message[key] = [];
          for (let j = 0, k = item.length; j < k; j++) {
            message[key].push(formatMessage(item[j]));
          }
        }
      }
    }
    return message;
  }
}