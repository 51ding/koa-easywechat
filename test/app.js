var Koa=require("koa");

var WeChat =require("../lib/index");
var message = require("./replyMessage");
var app=new Koa();

var options= {
	appid:"wx2ea795e409b2c674",
	appsecret:"e4632492abb3de0943fc7ca20c4b27d0",
	token:"test",
	issafe:false
};

app.use(WeChat(options,message));


app.listen(3000,()=>{
	console.log("server is running!");
})