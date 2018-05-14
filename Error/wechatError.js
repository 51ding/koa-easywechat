const ErrorCode=require("./constants");

var  WeChatError= (function () {
  function WeChatError(errcode) {
    var message=ErrorCode[errcode];
    Error.call(this, message);
    this.errcode = errcode;
    this.message = message;
  }

  WeChatError.prototype = new Error();
  WeChatError.prototype.constructor = WeChatError;

  return WeChatError;
})();


module.exports=WeChatError;