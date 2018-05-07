##koa-easywechat

> koa-easywechat是一个微信公众号开发中间件.
>
> 由于使用的是koa2,异步开发使用async/await的写法，所以请保证你的node版本>=7.6

### 安装

```shell
$ npm install koa-easywechat -S
```

### API

#####快速开始

```javascript
var Koa=require("koa");
var WeChat=require("koa-easywechat");
var app=new Koa();
app.use(WeChat({
  appID:"",
  appsecret:"",
  token:""
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

上面这段代码用于

#### WeChat(config , replyHandler);

##### config

- appID :第三方用户唯一凭证
- appsecret:第三方用户唯一凭证密钥
- token:令牌用于验证，用于验证请求是否来自微信服务器

以上三个参数缺一不可，注意属性的大小写，不要写错了

##### replyHandler:是一个async函数,用于开发者自己实现自己的自动回复业务逻辑

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

#####message 对象封装了微信发来的【普通消息】和【事件推送消息】,若要查看message对象的详细信息，请点击 这里[message对象](https://github.com/51ding/koa-easywechat/wiki/message%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%A1%A8)

#####wechat 对象是这个中间件中最核心的，后续将做详细的介绍



#####this.reply 对象是将要回复的内容




































