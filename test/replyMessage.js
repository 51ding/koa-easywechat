let Message =require("../lib/index").Message;


let message =new Message();

message.text("1",async function(content){
	console.log("内容",content);
})

message.text("2",function(){
	console.log("您好");
})



message.text("3",function(){
	console.log("欢迎ing光临");
})


message.image(function(content){
	console.log(content);
})

module.exports = message;