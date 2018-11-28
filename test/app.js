var Koa=require("koa");

var WeChat =require("../lib/index");

var app=new Koa();

var options= {
	appid:"",
	appsecret:"",
	token:"",
	issafe:false
};

//app.use(WeChat(options))


app.listen(3000,()=>{
	console.log("server is running!");
})