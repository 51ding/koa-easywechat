var menuType = {
    //点击推送事件
    click: "click",
    //跳转到网页
    view: "view",
    //扫一扫
    push: "scancode_push",
    waitmsg: "scancode_waitmsg",
    //系统拍照发图
    photo: "pic_sysphoto",
    //拍照或者相册发图
    album: "pic_photo_or_album",
    //微信相册发图
    pwx: "pic_weixin",
    //发送位置
    location: "location_select",
    //发送除文本类型的消息
    media: "media_id",
    //发送图文信息
    vl: "view_limited"
}

const MAX_FIRST_MENU = 3;
const MAX_SECOND_MENU = 5;

function RootMenu() {
    this.menus = [];
}

/*添加一级菜单*/
RootMenu.prototype.add = function (menu) {
    if (!(menu instanceof Menu)) throw new Error("参数类型必须是Menu");
    if (this.menus.length == MAX_FIRST_MENU) throw new Error(`只支持${MAX_FIRST_MENU}个一级菜单！`);
    this.menus.push(menu);
}


function Menu(type, params) {
    if (!Object.values(menuType).some(r => r == type)) throw new Error("无效的菜单类型！");
    this.subMenus = [];
    MenuFactory.call(this, params);
}

Menu.prototype.add = function (menu) {
    if (!(menu instanceof Menu)) throw new Error("无效的菜单");
    if (this.subMenus.length === MAX_SECOND_MENU) throw new Error(`只支持${MAX_SECOND_MENU}个一级菜单！`);
    this.subMenus.push(menu);
}

Menu.prototype.bindProperty=function () {
    var {name,key,url,media_id,appid,pagepath}=params;
    switch(this.type){
        case "click":
            if(!key) throw new Error("Click类型的菜单必须指定key参数");
            this.key=key;
    }
}





