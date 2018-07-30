const ErrorCode=require("./constants");

var  WeChatError= (function () {
  function WeChatError(errcode) {
    Error.captureStackTrace(this,WeChatError);
    var message=ErrorCode[errcode] ? ErrorCode[errcode] : "";
    Error.call(this, message);
    this.errcode = errcode;
    this.message = message;

  }

  WeChatError.prototype = new Error();
  WeChatError.prototype.constructor = WeChatError;

  return WeChatError;
})();


module.exports=WeChatError;