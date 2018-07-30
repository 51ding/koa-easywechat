const api = require("../../api");
const request = require("../../tool/request");

async function semantic() {
  var accessToken = await this.getAccessToken();
  var url = api.ai.semantic + `access_token=${accessToken}`;
  var body = {
    query: "查一下明天从北京到上海的南航机票",
    city: "北京",
    category: "flight,hotel",
    appid: "wxaaaaaaaaaaaaaaaa",
    uid: "123456"
  }
  return await request.post(url,false,body);
}

/*
* 功能：语音识别
*/
async function voiceToText() {
  var url=api.ai
}

/*
* 功能：汉译音
*/
async function chineseToEnglish(stream) {
  var accessToken = await this.getAccessToken();
  var url=api.ai.translate+`access_token=${accessToken}&lfrom=zh_CN&lto=en_US`;
  console.log(url);
  var formData={
    file:{
      value:stream
    }
  };
  var response=await request.post(url,true,formData);
  return response;
}



module.exports={
  semantic,
  chineseToEnglish
}

