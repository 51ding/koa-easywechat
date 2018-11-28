var xml2js = require("xml2js");
module.exports = class util {
  static parseXmlToObject(xml) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, (err, obj) => {
        if (err) return reject(err);
        resolve(obj);
      })
    })
  }
}