/*请求相关方法
*/
var rp = require("request-promise")
var WeChatError = require("../Error/wechatError");


/*
*功能：发起普通的get请求
* @param  url [String] 请求url
* @param  headers [Object] 额外的请求头，可空
*/
async function get(url, headers) {
    var option = {};
    option.uri = url;
    if (headers) option.headers = headers;
    option.json = true;
    return await responseHandled(option);
}


/*
*功能：发起普通的post请求
* @param  url [String] 请求url
* @param isformData [Boolean] 是否是表单数据
* @param body [Object] post请求体携带的数据
* @param  headers [Object] 额外的请求头，可空
*/
async function post(url,body,isformData,headers) {
    var option = {};
    option.uri = url;
    option.method = "POST";
    if (headers) option.headers = headers;
    if(isformData){
        option.formData=body;
        //option.headers["content-type"]="application/x-www-form-urlencoded";
    }
    else{
        option.body=body;
    }
    option.json = true;
    return await responseHandled(option);
}



async function responseHandled(option) {
    try {
        var response = await rp(option);
        rp(option);
    }
    catch (err) {
        throw err;
    }
    if (response.errcode && response.errcode != 0)
        throw new WeChatError(response.errcode);
    return response;
}


module.exports = {
    get,
    post
}

