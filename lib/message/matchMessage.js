/*微信消息匹配*/
class MatchMessage {
  constructor() {
    this.messageQueue = new Map();
  }
  register(msgType, handler, keyWords) {
    if (msgType === "text") {
      let keyWordMap = this.messageQueue.get("text");
      if (!keyWordMap) {
        keyWordMap = new Map();
      }
      if (Array.isArray(keyWords)) {
        keyWords.forEach(keyword => {
          keyWordMap.set(keyword, handler);
        })
      } else {
        keyWordMap.set(keyWords, handler);
      }
      this.messageQueue.set(msgType, keyWordMap);
    } else {
      this.messageQueue.set(msgType, handler);
    }
  }
  actionInvoke(message, ctx) {
    let msgType = message.MsgType;
    let keyword = message.Content;
    let handler;
    if (msgType == "text") {
      let keyWordsMap = this.messageQueue.get("text");
      if (keyWordsMap) {
        handler = keyWordsMap.get(keyword);
      }
    } else {
      handler = this.messageQueue.get(msgType);
    }
    if (handler) {
      handler.call(ctx, message);
    } else {
      this.default.apply(ctx);
    }
  }
  default () {
    this.body = "";
  }
}
["text", "image", "voice", "video", "shortvideo", "location", "link"].forEach(msgType => {
  MatchMessage.prototype[msgType] = function() {
    let handler;
    let keyWords;
    if (msgType === "text") {
      keyWords = arguments[0];
      if (Array.isArray(keyWords)) {}
      handler = arguments[1];
    } else {
      handler = arguments[0];
    }
    this.register(msgType, handler, keyWords);
  }
})
module.exports = MatchMessage;