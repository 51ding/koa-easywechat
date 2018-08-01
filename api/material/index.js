/*
 * 素材相关接口
 */

var Stream=require("stream");
var request=require("../../common/request");
var {api}=require("../");

//支持的临时素材类型
var allowTemporaryType={
    //图片
    image:"image",
    //语音
    voice:"voice",
    //视频
    video:"video",
    //缩略图
    thumb:"thumb"
}


/*
* 功能：上传临时素材
* @param [string] type 临时素材类型
* @param [Stream] fileStream 需要上传的文件流
*/
async function uploadTemporaryMaterial(type,fileStream) {
    if(!type || !fileStream) throw new Error("参数不全！");
    if(!(fileStream instanceof Stream)) throw new Error("请传入文件流");
    if(!Object.values(allowTemporaryType).some(r=> r==type)) throw new Error("无效的临时素材类型");
    var token =await this.getAccessToken();
    var url=`${api.material.uploadTemporaryMaterial}access_token=${token}&type=${type}`;
    return await request.post(url,{media:fileStream},true)
}



module.exports={
    uploadTemporaryMaterial
}