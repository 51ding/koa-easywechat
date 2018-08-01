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
    vl: "view_limited",
    //小程序类型
    mini:"miniprogram",
    //指定一个一级菜单类型，只需要name参数即可
    first:"first"
}

const MAX_FIRST_MENU = 3;
const MAX_SECOND_MENU = 5;

function RootMenu() {
    this.button = [];
}

/*添加一级菜单*/
RootMenu.prototype.add = function (menu) {
    if (!(menu instanceof Menu)) throw new Error("参数类型必须是Menu");
    if (this.button.length == MAX_FIRST_MENU) throw new Error(`只支持${MAX_FIRST_MENU}个一级菜单！`);
    this.button.push(menu);
    return this;
}


function Menu(type, params) {
    params=params || {};
    if (!Object.values(menuType).some(r => r == type)) throw new Error("无效的菜单类型！");
    if(type !== menuType.first)  this.type=type;
    MenuFactory.call(this, type,params);
}

Menu.prototype.add = function (menu) {
    if (!(menu instanceof Menu)) throw new Error("无效的菜单，参数必须是Menu的实例！");
    if(!this.sub_button) this.sub_button=[];
    if (this.sub_button.length === MAX_SECOND_MENU) throw new Error(`只支持${MAX_SECOND_MENU}个一级菜单！`);
    this.sub_button.push(menu);
    return this;
}

function MenuFactory(type,params) {
    var {name,key,url,media_id,appid,pagepath}=params;
    if(!name) throw new Error("参数name无效，请指定一个菜单名！");
    this.name=name;
    switch(type){
        case menuType.click:
        case menuType.push:
        case menuType.waitmsg:
        case menuType.photo:
        case menuType.album:
        case menuType.pwx:
        case menuType.location:
            if(!key) throw new Error("click,scancode_push,scancode_waitmsg,pic_sysphoto,pic_photo_or_album,pic_weixin类型的菜单必须指定key参数！");
            this.key=key;
            break;
        case menuType.view:
            if(!url) throw new Error("View类型的菜单必须指定url参数！");
            this.url=url;
            break;
        case menuType.media:
        case menuType.vl:
            if(!media_id) throw new  Error("media_id，view_limited类型的菜单必须指定media_id参数！");
            this.media_id=media_id;
            break;
        case menuType.mini:
            if(!appid) throw new Error("miniprogram类型的菜单必须指定appid参数！");
            if(!pagepath) throw new Error("miniprogram类型的菜单必须指定pagepath参数！");
            if(key) this.key=key;
            break;
        case menuType.first:
            break;
        default:
            throw  new Error("无效的菜单类型！");
    }
}

module.exports={
    menuType,
    RootMenu,
    Menu
}

