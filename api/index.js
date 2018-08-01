var prefix = "https://api.weixin.qq.com/cgi-bin/"
const fs = require('fs');
const path = require('path');
var glob = require("glob");

exports.api = {
    //获取AccessToken
    accseeToken: prefix + "token?grant_type=client_credential",
    //获取jsApiTicket
    jsApiTicket: prefix + "ticket/getticket?",
    //素材相关接口
    material: {
        //上传临时素材
        uploadTemporaryMaterial: prefix + "media/upload?",
        //上传永久素材
        uoloadPermanentMaterial: prefix + "material/add_news?",
        //上传图文消息内的图片获取URL
        uploadImage: prefix + "media/uploadimg?"
    },
    //用户相关接口
    user: {},
    //账号管理
    account: {},
    menu: {
        createMenu: prefix + "menu/create?",
        getMenu: prefix + "menu/get?",
        deleteMenu: prefix + "menu/delete?"
    },
    ai: {
        semantic: "https://api.weixin.qq.com/semantic/semproxy/search?",
        translate: prefix + "media/voice/translatecontent?"
    }

}

/*把api文件下所有文件里所有exports的对象挂在一个对象上*/
function wechatApi() {
    var fnObj = {};
    var files = glob.sync(path.join(__dirname, "*/*.js"));
    files.forEach(file => {
        var obj = require(file);
        var keys = Object.keys(obj);
        for (i = 0; i < keys.length; i++) fnObj[keys[i]] = obj[keys[i]];
    })
    return fnObj;
}

exports.wechatApi = wechatApi;
