//测试消息解密

var WXBizMsgCrypt = require("../lib/WXBizMsgCrypt");
var fs=require("fs");

//官方demo
// var wxcpt = new WXBizMsgCrypt({
//   sToken: "QDG6eK",
//   sCorpID: "wx5823bf96d3bd56c7",
//   sEncodingAESKey: "jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C"
// });
//
// var sReqMsgSig = "477715d11cdb4164915debcba66cb864d751f3e6";
//
// var sReqTimeStamp = "1409659813";
//
// var sReqNonce = "1372623149";
//
// var sReqData = "<xml><ToUserName><![CDATA[wx5823bf96d3bd56c7]]></ToUserName><Encrypt><![CDATA[RypEvHKD8QQKFhvQ6QleEB4J58tiPdvo+rtK1I9qca6aM/wvqnLSV5zEPeusUiX5L5X/0lWfrf0QADHHhGd3QczcdCUpj911L3vg3W/sYYvuJTs3TUUkSUXxaccAS0qhxchrRYt66wiSpGLYL42aM6A8dTT+6k4aSknmPj48kzJs8qLjvd4Xgpue06DOdnLxAUHzM6+kDZ+HMZfJYuR+LtwGc2hgf5gsijff0ekUNXZiqATP7PF5mZxZ3Izoun1s4zG4LUMnvw2r+KqCKIw+3IQH03v+BCA9nMELNqbSf6tiWSrXJB3LAVGUcallcrw8V2t9EL4EhzJWrQUax5wLVMNS0+rUPA3k22Ncx4XXZS9o0MBH27Bo6BpNelZpS+/uh9KsNlY6bHCmJU9p8g7m3fVKn28H3KDYA5Pl/T8Z1ptDAVe0lXdQ2YoyyH2uyPIGHBZZIs2pDBS8R07+qN+E7Q==]]></Encrypt><AgentID><![CDATA[218]]></AgentID></xml>";
//
// var x=wxcpt.DecryptMsg(sReqMsgSig,sReqTimeStamp,sReqNonce,sReqData);
//
// x.then(function(data){
//   console.log(data);
// }).catch(err =>{
//   console.log(err);
// })

var wxcpt = new WXBizMsgCrypt({
  sToken: "",
  sCorpID: "",
  sEncodingAESKey: ""
});
var sReqMsgSig = "bc2a59c0fd5796c4eb1e4cf5dd98096e87a8786c";
var sReqTimeStamp = "1525938898";
var sReqNonce = "412741175";
var sReqData = "<xml><ToUserName><![CDATA[gh_83f653daba05]]></ToUserName><Encrypt><![CDATA[cj5sEpG1X9eEUlMPC0zhIvrpIFd8gONPNTdI5E4/ZyRf6JchLAQbBXOSXVDBvpNYkhkuBSnktSKLtJOGNmpp+koAzJwVw58Oy2toIaBXP2Rw5cdXNvfX11XQ5TMj1r2c3wlG1LniBnLFAtBQiRDvxH8RA3Zjx2N/SvlK/Hffrfqcp65vy9HCFJtjPtv36RarsYvXpTUtifXHdJlRiov7UX1USAdbLptaqwk7Jka4B71QBkALMRs5EVBbkfMmVe7OprL0RneC62voK0++OGlzdiQKnWLMVyw4AjCZMy7ICO+8f9aRrfQGE3tX2NxmR2AjpLgkxckke5HvidtiKlibTjox1cHdXkfqGyKWgF2HYQ9iXbvka8W5LELXYFgPF0XkRXRVTo+pRKXvZWfYFGYZW/MhsT4kymc/iN71xOPscmo=]]></Encrypt></xml>"
var x=wxcpt.DecryptMsg(sReqMsgSig,sReqTimeStamp,sReqNonce,sReqData);
x.then(function(data){
  console.log(data);
}).catch(err =>{
  console.log(err);
})