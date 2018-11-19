const Koa = require('koa')
const app = new Koa();
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
//const wechat = require("../wechat/index");
const wechat = require("./index");
var path = require("path");
var fs = require("fs");
var menuData = require("./business/menu/menuData");
onerror(app)
app.use(logger())
app.use(wechat({
    appID: "wx2ea795e409b2c674",
    appsecret: "e4632492abb3de0943fc7ca20c4b27d0",
    token: "houhanbin",
    mode: "clear",
    encodingAESKey: "jo2MhVyQIe2E19rBBwdBMJPI3SsQwXmY82iW2ToOmuG"
}, async function() {
    var wechat = this.wechat;
    var token = await wechat.getAccessToken();
    var message = this.message.Content;
    if (message == "1") {
        this.reply = {
            type: "text",
            content: token
        }
    } else if (message == "2") {
        wechat.expiresIn = Date.now() - 100000;
        this.reply = {
            type: "text",
            content: "更新成功"
        }
    }
    //创建菜单
    else if (message == "3") {
        var result = await wechat.createMenu(menuData);
        console.log(result);
    } else if (message == "4") {
        var result = await wechat.getMenu();
        this.reply = {
            type: "text",
            content: JSON.stringify(result)
        }
    } else if (message == "5") {
        var result = await wechat.deleteMenu();
        this.reply = {
            type: "text",
            content: JSON.stringify(result)
        }
    } else if (message == "6") {
        var result = await wechat.uploadTemporaryMaterial("image", fs.createReadStream("./test.jpeg"));
        this.reply = {
            type: "text",
            content: JSON.stringify(result)
        }
    }
}))
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