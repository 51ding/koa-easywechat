/**
 * AES加密解密
 */
var crypto = require('crypto');
var util = require("../../common/util");
class Cryptography {
  /*
   ******************************************************************************
   *解密相关方法
   * ******************************************************************************
   */
  /*
  解密方法
  @param Input 密文
  @param EncodingAESKey Aes加密字符串
  @param corpid
 */
  static AES_decrypt(Input, EncodingAESKey) {
    var oriMsg = "";
    var Key = Buffer.from(EncodingAESKey + "=", "base64");
    //截取前16个字节
    var Iv = Key.slice(0, 16);
    var btmpMsg = Cryptography.AES_decryptArray(Input, Iv, Key);
    var len = btmpMsg.readInt32LE(16);
    len = Cryptography.NetworkToHostOrder(len.toString());
    var bMsg = util.arrayCopy(btmpMsg, 20, len);
    var bCorpid = util.arrayCopy(btmpMsg, 20 + len, btmpMsg.length - 20 - len);
    var oriMsg = bMsg.toString("utf8");
    var corpid = bCorpid.toString("utf8");
    return {
      oriMsg: oriMsg,
      corpid: corpid
    };
  }
  /*
  使用Rijndael算法解密数据
   */
  static AES_decryptArray(Input, Iv, Key) {
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-256-cbc', Key, Iv);
    decipher.setAutoPadding(false);
    cipherChunks.push(decipher.update(Input, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    var xXml = Buffer.from(cipherChunks.join(''));
    var xBuff = Cryptography.decode2(xXml);
    return xBuff;
  }
  static decode2(decrypted) {
    var pad = decrypted[decrypted.length - 1];
    if (pad < 1 || pad > 32) {
      pad = 0;
    }
    var res = Buffer.alloc(decrypted.length - pad);
    res = util.arrayCopy(decrypted, 0, decrypted.length - pad)
    return res;
  }
  /*
 将整数值由网络字节顺序转换为主机字节顺序。
 * */
  static NetworkToHostOrder(network) {
    //数字转换成字节数组
    function intFromBytes(long) {
      var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
      for (var index = 0; index < byteArray.length; index++) {
        var byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
      }
      return byteArray;
    };
    var buf = Buffer.from(intFromBytes(network));
    return buf.readInt32BE();
  }
  /*
   ******************************************************************************
   *加密相关方法
   * ******************************************************************************
   */
  /*
    加密方法
    @param Input 密文
    @param EncodingAESKey Aes加密字符串
    @param corpid 微信唯一标识
   */
  static AES_encrypt(Input, EncodingAESKey, corpid) {
    var Key = Buffer.from(EncodingAESKey + "=", "base64");
    var Iv = Key.slice(0, 16);
    var Randcode = util.generateRandomNumer(16);
    var bRand = Buffer.from(Randcode);
    var bCorpid = Buffer.from(corpid);
    var btmpMsg = Buffer.from(Input);
    var order = Cryptography.HostToNetworkOrder(btmpMsg.length);
    var bMsgLen = util.converNumberToByteArray(order);
    var bMsg = Buffer.concat([bRand, bMsgLen, btmpMsg, bCorpid], bRand.length + bMsgLen.length + btmpMsg.length + bCorpid.length);
    return Cryptography.AES_Encrypt(bMsg, Iv, Key)
  }
  static AES_Encrypt(bMsg, Iv, Key) {
    var Key = Buffer.from(EncodingAESKey + "=", "base64");
    var Iv = Key.slice(0, 16);
    var Randcode = util.generateRandomNumer(16);
    var bRand = Buffer.from(Randcode);
    var bCorpid = Buffer.from(corpid);
    var btmpMsg = Buffer.from(Input);
    var order = Cryptography.HostToNetworkOrder(btmpMsg.length);
    var bMsgLen = util.converNumberToByteArray(order);
    var bMsg = Buffer.concat([bRand, bMsgLen, btmpMsg, bCorpid], bRand.length + bMsgLen.length + btmpMsg.length + bCorpid.length);
    return Cryptography.AES_Encrypt(bMsg, Iv, Key)
  }
  /*
   *进行PKCS7补位
   */
  static KCS7Encoder(text_length) {
    var block_size = 32;
    // 计算需要填充的位数
    var amount_to_pad = block_size - (text_length % block_size);
    if (amount_to_pad == 0) {
      amount_to_pad = block_size;
    }
    // 获得补位所用的字符
    var pad_chr = Cryptography.chr(amount_to_pad);
    var tmp = "";
    for (var index = 0; index < amount_to_pad; index++) {
      tmp += pad_chr;
    }
    return Buffer.from(tmp);
  }
  /*
   *将数字转化成ASCII码对应的字符，用于对明文进行补码
   */
  static chr(a) {
    var target = String.fromCharCode(a);
    return target;
  }
  static HostToNetworkOrder(inval) {
    var outval = 0;
    for (var i = 0; i < 4; i++) {
      outval = (outval << 8) + ((inval >> (i * 8)) & 255);
    }
    return outval;
  }
}
module.exports = Cryptography;