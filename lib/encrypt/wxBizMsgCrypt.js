const sha1 = require("sha1");
const Cryptography = require("./Cryptography");
const xml2js = require("xml2js");
/*
 * 微信企业号加解密相关方法
 */
//加解密的返回码
var WXBizMsgCryptErrorCode = {
  WXBizMsgCrypt_OK: 0,
  //签名验证错误
  WXBizMsgCrypt_ValidateSignature_Error: -40001,
  //xml解析失败
  WXBizMsgCrypt_ParseXml_Error: -40002,
  //sha加密生成签名失败
  WXBizMsgCrypt_ComputeSignature_Error: -40003,
  //AESKey 非法
  WXBizMsgCrypt_IllegalAesKey: -40004,
  //corpid 校验错误
  WXBizMsgCrypt_ValidateCorpid_Error: -40005,
  //AES 加密失败
  WXBizMsgCrypt_EncryptAES_Error: -40006,
  //AES 解密失败
  WXBizMsgCrypt_DecryptAES_Error: -40007,
  //解密后得到的buffer非法
  WXBizMsgCrypt_IllegalBuffer: -40008,
  //base64加密失败
  WXBizMsgCrypt_EncodeBase64_Error: -40009,
  //base64解密失败
  WXBizMsgCrypt_DecodeBase64_Error: -40010,
  //生成xml失败
  WXBizMsgCrypt_CreateXML_Error: -40011
}
class WXBizMsgCrypt {
  constructor(m_sToken, m_sEncodingAESKey, m_sCorpID) {
    if (!(this instanceof WXBizMsgCrypt)) return new WXBizMsgCrypt(config);
    this.m_sToken = m_sToken;
    this.m_sEncodingAESKey = m_sEncodingAESKey;
    this.m_sCorpID = m_sCorpID;
  }
  //**验证URL
  // @param sMsgSignature: 签名串，对应URL参数的msg_signature
  // @param sTimeStamp: 时间戳，对应URL参数的timestamp
  // @param sNonce: 随机串，对应URL参数的nonce
  // @param sEchoStr: 随机串，对应URL参数的echostr
  // @param sReplyEchoStr: 解密之后的echostr，当return返回0时有效
  // @return：成功0，失败返回对应的错误码
  //**
  VerifyURL(sMsgSignature, sTimeStamp, sNonce, sEchoStr) {
    var ret = 0;
    if (this.m_sEncodingAESKey.length != 43) return {
      errcode: WXBizMsgCryptErrorCode.WXBizMsgCrypt_IllegalAesKey,
      echoStr: ""
    };
    ret = WXBizMsgCrypt.VerifySignature(this.m_sToken, sTimeStamp, sNonce, sEchoStr, sMsgSignature);
    if (ret != 0) {
      return {
        errcode: ret,
        echoStr: ""
      };
    }
    var cpid = "";
    var aesResult = Cryptography.AES_decrypt(sEchoStr, this.m_sEncodingAESKey);
    if (aesResult.corpid != this.m_sCorpID) return {
      errcode: WXBizMsgCryptErrorCode.WXBizMsgCrypt_ValidateCorpid_Error,
      echoStr: ""
    };
    return {
      errcode: 0,
      echoStr: aesResult.oriMsg
    };
  }
  // 检验消息的真实性，并且获取解密后的明文
  // @param sMsgSignature: 签名串，对应URL参数的msg_signature
  // @param sTimeStamp: 时间戳，对应URL参数的timestamp
  // @param sNonce: 随机串，对应URL参数的nonce
  // @param sPostData: 密文，对应POST请求的数据
  // @param sMsg: 解密后的原文，当return返回0时有效
  // @return: 成功0，失败返回对应的错误码
  DecryptMsg(sMsgSignature, sTimeStamp, sNonce, sPostData) {
    if (this.m_sEncodingAESKey.length != 43) return Promise.reject({
      errcode: WXBizMsgCryptErrorCode.WXBizMsgCrypt_IllegalAesKey,
      sMsg: ""
    });
    var raw = "";
    var sEncryptMsg = "";
    return new Promise((resolve, reject) => {
      xml2js.parseString(sPostData, (err, result) => {
        if (err) reject({
          errcode: WXBizMsgCryptErrorCode.WXBizMsgCrypt_ParseXml_Error,
          sMsg: ""
        });
        var sEncryptMsg = result.xml.Encrypt[0];
        var ret = 0;
        ret = WXBizMsgCrypt.VerifySignature(this.m_sToken, sTimeStamp, sNonce, sEncryptMsg, sMsgSignature);
        if (ret != 0) reject({
          errcode: ret,
          sMsg: ""
        })
        var cpid = "";
        var data;
        try {
          data = Cryptography.AES_decrypt(sEncryptMsg, this.m_sEncodingAESKey);
        } catch (exception) {
          reject({
            errcode: WXBizMsgCryptErrorCode.WXBizMsgCrypt_DecryptAES_Error,
            sMsg: ""
          })
        }
        if (data.corpid != this.m_sCorpID) reject({
          errcode: WXBizMsgCryptErrorCode.WXBizMsgCrypt_ValidateCorpid_Error,
          sMsg: ""
        });
        //返回解密以后的消息体对象
        xml2js.parseString(data.oriMsg, (err, xmlResult) => {
          resolve({
            errcode: ret,
            sMsg: xmlResult.xml
          });
        })
      })
    })
  }
  //将回复的xml消息加密
  // @param sReplyMsg: 待回复用户的消息，xml格式的字符串
  // @param sTimeStamp: 时间戳，可以自己生成，也可以用URL参数的timestamp
  // @param sNonce: 随机串，可以自己生成，也可以用URL参数的nonce
  // @param sEncryptMsg: 加密后的可以直接回复用户的密文，包括msg_signature, timestamp, nonce, encrypt的xml格式的字符串,
  //                        当return返回0时有效
  // return：成功0，失败返回对应的错误码
  EncryptMsg(sReplyMsg, sTimeStamp, sNonce) {
    if (this.m_sEncodingAESKey.length != 43) return {
      errcode: WXBizMsgCryptErrorCode.WXBizMsgCrypt_IllegalAesKey,
      sEncryptMsg: ""
    }
    try {
      var raw = Cryptography.AES_encrypt(sReplyMsg, this.m_sEncodingAESKey, this.m_sCorpID);
    } catch (err) {
      return {
        errcode: WXBizMsgCryptErrorCode.WXBizMsgCrypt_EncryptAES_Error,
        sEncryptMsg: ""
      }
    }
    var MsgSigature = WXBizMsgCrypt.GenarateSinature(this.m_sToken, sTimeStamp, sNonce, raw);
    var sEncryptMsg = "";
    var EncryptLabelHead = "<Encrypt><![CDATA[";
    var EncryptLabelTail = "]]></Encrypt>";
    var MsgSigLabelHead = "<MsgSignature><![CDATA[";
    var MsgSigLabelTail = "]]></MsgSignature>";
    var TimeStampLabelHead = "<TimeStamp><![CDATA[";
    var TimeStampLabelTail = "]]></TimeStamp>";
    var NonceLabelHead = "<Nonce><![CDATA[";
    var NonceLabelTail = "]]></Nonce>";
    sEncryptMsg = sEncryptMsg + "<xml>" + EncryptLabelHead + raw + EncryptLabelTail;
    sEncryptMsg = sEncryptMsg + MsgSigLabelHead + MsgSigature + MsgSigLabelTail;
    sEncryptMsg = sEncryptMsg + TimeStampLabelHead + sTimeStamp + TimeStampLabelTail;
    sEncryptMsg = sEncryptMsg + NonceLabelHead + sNonce + NonceLabelTail;
    sEncryptMsg += "</xml>";
    return {
      errcode: 0,
      sEncryptMsg: sEncryptMsg
    };
  }
  /**
   * 校验签名
   **/
  static VerifySignature(sToken, sTimeStamp, sNonce, sMsgEncrypt, sSigture) {
    let hash = "";
    let ret = 0;
    hash = WXBizMsgCrypt.GenarateSinature(sToken, sTimeStamp, sNonce, sMsgEncrypt);
    if (hash == sSigture) {
      return 0
    } else {
      return WXBizMsgCryptErrorCode.WXBizMsgCrypt_ValidateSignature_Error;
    }
  }
  /**
   * 静态方法生成签名
   * return
   **/
  static GenarateSinature(sToken, sTimeStamp, sNonce, sMsgEncrypt) {
    var sVerifyEchoStr = "";
    let AL = [];
    AL.push(sToken);
    AL.push(sTimeStamp);
    AL.push(sNonce);
    AL.push(sMsgEncrypt);
    AL = AL.sort();
    let raw = "";
    for (let i = 0; i < AL.length; i++) {
      raw += AL[i];
    }
    var hash = "";
    var dataToHash = Buffer.from(raw, "ascii");
    hash = sha1(dataToHash);
    //生成的签名既是这个哈希值
    return hash;
  }
}
module.exports = WXBizMsgCrypt;