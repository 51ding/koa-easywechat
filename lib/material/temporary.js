/*临时素材相关接
 */

const api=require("../../api");
const request=require("../../tool/request");
/**
 * 功能：上传临时素材
 * @param [String] type 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb，主要用于视频与音乐格式的缩略图）
 * @param [Stream] stream 一个可读的文件流，例如fs.createReadStream(filePath)
 */
async function uploadTemporaryMaterial(type,stream) {
  var accessToken = await this.getAccessToken();
  var url = api.material.uploadTemporaryMaterial + `access_token=${accessToken}&type=${type}`
  var formData={media:stream};
  var response = await request.post(url,true,formData);
  return response;
}


module.exports={
  uploadTemporaryMaterial
}