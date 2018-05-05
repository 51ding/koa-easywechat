var xml2js = require("xml2js");

/**
 *功能：xml数据转成对象
 */
exports.parseXmlToObject = function (xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, obj) => {
      if (err) return reject(err);
      resolve(obj);
    })
  })
}

/**
 *功能：格式化消息
 */
function formatMessage(obj) {
  var message = {};
  if (typeof obj === "object") {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var item = obj[key];
      if (!(item instanceof Array) || item.length===0){
        continue;
      }
      if (item.length == 1) {
        var val = item[0];
        if(typeof val === "object"){
          message[key] =formatMessage(val);
        }
        else{
          message[key]=val || "";
        }
      }
      else{
        message[key]=[];
        for(var j=0,k=item.length;j<k;j++){
          message[key].push(formatMessage(item[j]));
        }
      }
    }
  }
  return message;
}

exports.formatMessage = formatMessage;