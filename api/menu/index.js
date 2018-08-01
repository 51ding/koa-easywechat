/*
 * 菜单相关接口
 */
var {api}=require("..");
var request=require("../../common/request");
/*
* 功能：生成菜单
* @param [Object] menuObject
* */
async function createMenu(menuObject) {
    var token =await this.getAccessToken();
    var url=`${api.menu.createMenu}access_token=${token}`;
    return await  request.post(url,menuObject);
}


/*
* 功能：菜单查询
* @param [Object] menuObject
* */
async function getMenu(){
    var token =await this.getAccessToken();
    var url=`${api.menu.getMenu}access_token=${token}`;
    return await  request.get(url);
}

async function deleteMenu(){
    var token =await this.getAccessToken();
    var url=`${api.menu.deleteMenu}access_token=${token}`;
    return await  request.get(url);
}

module.exports={
    createMenu,
    getMenu,
    deleteMenu
}