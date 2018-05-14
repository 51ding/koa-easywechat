const Koa = require('koa')
const app = new Koa();
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const wechat = require("./wechat");
const weixin = require("./weixin");
var path=require("path");
var fs=require("fs");
onerror(app)
app.use(logger())
app.use(wechat({
  appID: "wx914e18b87ddbc384",
  appsecret: "45d3ef8915d29189fd249a3a00ec2f3a",
  token: "houhanbin",
  isSafeModel:false
}, async function () {
  var message = this.message;
  var wechat = this.wechat;
  if (message.MsgType == "text") {
    if (message.Content == 1) {
      this.reply = {
        type: "text",
        content: "回复的文本内容"
      }
    }
    else if (message.Content == 2) {
       var data=await wechat.uploadTemporaryMaterial("image",fs.createReadStream(path.join(__dirname,"./1.jpg")));
       this.reply={
         type:"text",
         content:data.media_id
       }

    }
    else if (message.Content == 3) {
      this.reply = {
        type: "voice",
        content: {
          mediaid: "ILZ2gSlgltb9sw8FV8quH-KIwCzBlzQxp4bdys3yaux7V6_CZGDFY_o7weT5YaAH"
        }
      }
    }
    else if (message.Content == 4) {
      this.reply = {
        type: "video",
        content: {
          mediaid: "MeOhqAIKN6DTALRERW19eq6E-xmcvBG1hSvBYQqwAoK1JWfcOFXva4b_M5GhdbgM",
          title: "视频标题",
          description: "视频描述"
        }
      }
    }
    else if (message.Content == 5) {
      this.reply = {
        type: "music",
        content: {
          title: "音乐标题",
          description: "音乐的描述",
          MUSIC_Url: "http://win.web.ri01.sycdn.kuwo.cn/8890c802945d78a2f7456e05ca4e4922/5aeebd44/resource/n1/12/26/3683856931.mp3",
          ThumbMediaId: "_CDwFnJm3_TauWDSkmm2Jmb4f_3mpgonMzEvacdVGqZ2_sUPHwCAesPmDdhQ4Nfl"
        }
      }
    }
    else if (message.Content == 6) {
      this.reply = {
        type: "news",
        content: [{
          title: "Github",
          description: "koa-easywechat",
          picurl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526194643&di=ec73dcd5cb6a12e1d38984c612edaaae&imgtype=jpg&er=1&src=http%3A%2F%2Fpic34.photophoto.cn%2F20150313%2F0005018304394138_b.jpg",
          url: "https://github.com/51ding/koa-easywechat"
        }, {
          title: "Github",
          description: "",
          picurl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526194643&di=ec73dcd5cb6a12e1d38984c612edaaae&imgtype=jpg&er=1&src=http%3A%2F%2Fpic34.photophoto.cn%2F20150313%2F0005018304394138_b.jpg",
          url: "https://github.com/51ding/koa-easywechat"
        }]
      }
    }
    //生成菜单
    else if (message.Content == 7) {
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
      }
      var msg = "菜单生成成功！";
      try {
        await wechat.createMenu(menu);
      }
      catch (err) {
        msg = err.message;
      }
      this.reply = {
        type: "text",
        content: msg
      }
    }
    //获取菜单
    else if (message.Content == 8) {
      var menu = await wechat.getMenu();
      this.reply = {
        type: "text",
        content: menu
      }
    }
    //删除菜单
    else if (message.Content == 9) {
      var menu = await wechat.deleteMenu();
      this.reply = {
        type: "text",
        content: "删除成功！"
      }
    }
    //回复加密的内容
    else if(message.Content == 10){
      this.reply = {
        type: "text",
        content: "删除成功！"
      }
    }
    else {
      var token = await wechat.getAccessToken();
      this.reply = {
        type: "text",
        content: token
      }
    }
  }
}));

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())

app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(3000, () => {
  console.log("server is running...");
})
