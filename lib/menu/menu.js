const api = require("../../api");
const rp = require("request-promise");
/**
 * 功能：创建自定义菜单
 * @param [String] menuObject 菜单对象，对象的格式请参照微信开发文档，格式不对会抛出异常
 */
async function createMenu(menuObject) {
  var accessToken = await this.getAccessToken();
  var url = api.menu.createMenu + `access_token=${accessToken}`;
  var options = {
    method: "POST",
    uri: url,
    body: menuObject,
    json: true
  }
  var response = await rp(options);
  if (response.errcode != 0) {
    throw new Error(`errcode:${response.errcode},errmsg:${response.errmsg}`);
  }
}


module.exports = {
    createMenu
}