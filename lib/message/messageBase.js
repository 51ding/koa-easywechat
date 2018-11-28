let xml2js = require("xml2js");
let getRawBody = require("raw-body");
let Util = require("../common/util");
module.exports = class MessageBase {
  constructor() {}
  async getMessage(ctx) {
    let text = await getRawBody(ctx.req, {
      length: ctx.length,
      limit: "1mb",
      encoding: "utf8"
    })；
    let xmlObject = await Util.parseXmlToObject(text); 
    return xmlObject;
  }
}