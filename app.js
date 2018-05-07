const Koa = require('koa')
const app = new Koa();
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const wechat=require("./wechat");
const weixin=require("./weixin");


onerror(app)
app.use(logger())
app.use(wechat({
  appID:"wx2ea795e409b2c674",
  appsecret:"e4632492abb3de0943fc7ca20c4b27d0",
  token:"houhanbin"
},function () {
  var message=this.message;
  if(message.MsgType=="text"){
    this.reply={
      type:"text",
      content:"dasdasdas"
    }
  }
}));

app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
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

app.listen(3000,()=>{
  console.log("server is running...");
})
