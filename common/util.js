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


/**
 *功能：生成指定位数的随机字符串
 * @@param [Number] digits 随机字符串的位数
 */
exports.generateRandomNumer=function(digits){
    var str="";
    var charArray=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var arrLength=charArray.length;
    for(var i=0;i<digits;i++){
        var index=Math.round(Math.random() * (arrLength-1));
        str+=charArray[index];
    }
    return str;
}

/**
 *功能：生成时间戳
 */
exports.getTimstamp=function(){
    return Math.floor(Date.now()/1000);
}


//截取数组
/*
 @@param sourceArray 包含要复制的数据
 @@param sourceIndex sourceArray中复制开始处的索引
 @@param sourceArray 接收数据的数组
 @@param destinationIndex 它表示 destinationArray 中存储开始处的索引
 @@param length 它表示要复制的元素数目
 * */
exports.arrayCopy=function(sourceArray,sourceIndex,length){
    if(!Buffer.isBuffer(sourceArray))
        throw new Error("不是Buffer类型！");

    var destinationArray=sourceArray.slice(sourceIndex,sourceIndex+length);

    return destinationArray;

}

exports.converNumberToByteArray=function (number) {
    //数字转换成字节数组
    function intFromBytes(long) {

        var byteArray = [0, 0, 0, 0];

        for (var index = 0; index < byteArray.length; index++) {
            var byte = long & 0xff;
            byteArray[index] = byte;
            long = (long - byte) / 256;
        }

        return byteArray;
    };

    return  Buffer.from(intFromBytes(number));

}

/*判断一个函数是不是async函数*/
exports.isAsyncFunction=function (fn){
    var toString=Object.prototype.toString;
    var type=toString.call(fn);
    return type === "[object AsyncFunction]"
}

