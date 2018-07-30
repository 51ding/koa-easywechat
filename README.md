## koa-easywechat

> koa-easywechat是一个基于koa2的微信公众号开发中间件
>
> 由于使用的是koa2,异步开发使用async/await的写法，所以请保证你的node版本>=7.6
>
> 点击查看[更新日志](https://github.com/51ding/koa-easywechat/wiki/%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97)

### 安装

```shell
$ npm install koa-easywechat -S
```

### API

#### 快速开始

**注意：koa-easywechat中间件要写在最前面，也就是要第一个use，因为我在ctx上挂载了一个wechat对象，这个对象实现了大部分的微信接口，这样才能保证开发者在自己的写路由里，获取到ctx.wechat进行自己的业务开发**

```javascript
var Koa=require("koa");
var WeChat=require("koa-easywechat");
var app=new Koa();
app.use(WeChat({
  appID:"",
  appsecret:"",
  token:"",
  isSafeModel:false,
  encodingAESKey:""
},async function (next){
  this.reply={
      type:"text",
      content:"回复一段文字吧"
    }
  }
}));
app.listen(3000,()=>{
  console.log("server is running")
});
```

上面这段代码用于回复一段文字

#### WeChat(config , replyHandler);

##### config【Object】

- appID【String】 : 第三方用户唯一凭证
- appsecret【String】: 第三方用户唯一凭证密钥
- token【String】: 令牌用于验证，用于验证请求是否来自微信服务器
- isSafeModel【Boolean】: 消息加解密方式,值为true时，使用安全模式，值为false时，使用明文模式，当不配置的时候，默认值为false
- encodingAESKey【string】:消息加解密密钥，当config.isSafeModel=true时，必须配置encodingAESKey

##### replyHandler:是一个async函数,用于开发者自己实现自动回复业务逻辑

```javascript
async replyHandler(next){
  var message=this.message;
  var wechat=this.wechat;
  this.reply={
      type:"text",
      content:"回复一段文字吧"
    }
}
```
如果没有回复的业务逻辑，可以调用next()将控制权交给之后的中间件处理
```javascript
async replyHandler(next){
  await next();
}
```

在这个函数里，this就是koa框架中的上下文(ctx)的引用，我在ctx对象上挂载了两个对象**wechat**和**message**

#### 1、message 对象封装了微信发来的【普通消息】和【事件推送消息】,若要查看message对象的详细信息，请点击 这里[message对象](https://github.com/51ding/koa-easywechat/wiki/message%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%A1%A8)

#### 2、this.reply 对象是将要回复的内容，这个对象的属性要严格按照要求书写，具体规则在这里[回复对象](https://github.com/51ding/koa-easywechat/wiki/this.reply%E5%9B%9E%E5%A4%8D%E5%AF%B9%E8%B1%A1%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%E5%8F%8A%E6%A1%88%E4%BE%8B)

#### 3、wechat 对象是这个中间件中最核心的，实现了大部分的功能

### 现在已经实现的接口有：

#### wechat.getAccessToken

​	功能：获取accessToken。因为调用accessToken的接口每天的调用频率是有上限的，不能频繁调用，所以这里实现了accessToken的自管理，开发者不必关心accessToken是否过期，过期之后会自动去微信服务器请求并更新最新的accessToken。

```javascript
var wechat=ctx.wechat;
var token=await ctx.getAccessToken();
```

#### wechat.getJsApiTicket()

​	功能：获取jsapi_ticketj,sapi_ticket是公众号用于调用微信JS接口的临时票据。jsapi_ticket与token类似，在微信网页开发中需要用到，也需要全局缓存。

```javascript
var wechat=ctx.wechat;
var jsApiTicket=await ctx.getJsApiTicket();
```



#### wechat.uploadTemporaryMaterial(type,filePath)

功能：上传临时素材

参数

|    属性    |   类型   |               说明                |
| :------: | :----: | :-----------------------------: |
|   type   | String | 支持的值有image, voice, video, thumb |
| filePath | String |            多媒体文件的路径             |

返回值（json）

|     属性     |                    说明                    |
| :--------: | :--------------------------------------: |
|    type    | 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb，主要用于视频与音乐格式的缩略图） |
|  media_id  |               媒体文件上传后，获取标识               |
| created_at |                媒体文件上传时间戳                 |

```javascript
var wechat=ctx.wechat;
var media=await ctx.uploadTemporaryMaterial("image","文件的路径");
```

#### wechat.createMenu(menuObj)

功能：创建自定义菜单

参数：

|   属性    |   类型   |       说明        |
| :-----: | :----: | :-------------: |
| menuObj | Object | 菜单对象，格式要符合规定的格式 |

```javascript
 var menu = {
        button: [
          {
            type: "click",
            name: "今日歌曲",
            key: "V1001_TODAY_MUSIC"
          },
          {
            name: "菜单",
            sub_button: [
              {
                type: "view",
                name: "搜索",
                url: "http://www.soso.com/"
              },
              {
                type: "click",
                name: "赞一下我们",
                key: "V1001_GOOD"
              }]
          }]
      };
var wechat=ctx.wechat;
await wechat.createMenu(menu);
```



#### wechat.getMenu()

功能：获取json格式的自定义菜单

```javascript
var wechat=ctx.wechat;
var menu=await wechat.getMenu();
```

#### wechat.deleteMenu()

功能：删除自定义菜单

```javascript
var wechat=ctx.wechat;
var menu=await wechat.deleteMenu();
```





-----------------------------------------------------------------------------------------------------------------------------------------------------------
完结，撒花~~~~~~~~~~~~~~~







































