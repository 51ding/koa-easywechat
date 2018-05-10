//指定回复策略
var fs=require("fs");
var path=require("path");
exports.reply=async function(next){
	var receiveMessage=this.message;
	var wechat=this.wechat;
  if(receiveMessage.MsgType=="text"){

    if(receiveMessage.Content==1){
      this.reply={
        type:"text",
        content:"新的写法"
      }
    }
    else if(receiveMessage.Content==2){
      this.reply={
        type:"text",
        content:"这也是新的写法！"
      };
    }
    else if(receiveMessage.Content==3){
      this.reply={
        type:"news",
        content:[
          {
            title:"我是王大锤",
            description:"这是描述",
            picurl:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526194643&di=ec73dcd5cb6a12e1d38984c612edaaae&imgtype=jpg&er=1&src=http%3A%2F%2Fpic34.photophoto.cn%2F20150313%2F0005018304394138_b.jpg",
            url:"https://cnodejs.org/"
          }
        ]
      }
    }
    else if(receiveMessage.Content==4){
      var type="image";
      var data=await wechat.uploadTemporaryMaterial(type,path.join(__dirname,"./public/images/1.jpg"));
      this.reply={
        type:"text",
        content:"上传图片成功！"
      };
    }
    else if(receiveMessage.Content==5){
      var mediaId='_CDwFnJm3_TauWDSkmm2Jmb4f_3mpgonMzEvacdVGqZ2_sUPHwCAesPmDdhQ4Nfl';
      this.reply={
        type:"image",
        content:{
          media_id:mediaId
        }
      }
    }
    else if(receiveMessage.Content==6){
      var type="video";
      var data=await wechat.uploadTemporaryMaterial(type,path.join(__dirname,"./public/images/1.mp4"));
      this.reply="dadsadsadsa";
    }
    else if(receiveMessage.Content==7){
      var mediaId='y72canGSdS3GI4_LI3zlDPfrr6ymNDs0wvwTOJNWlNcT5TI9NfYDouqjQBbsIbTV';
      this.reply={
        type:"video",
        media_id:mediaId
      }
    }
    else if(receiveMessage.Content==8){
      this.reply={
        type:"music",
        Title:"好听",
        Description:"一首歌",
        MUSIC_Url:"http://win.web.ri01.sycdn.kuwo.cn/8890c802945d78a2f7456e05ca4e4922/5aeebd44/resource/n1/12/26/3683856931.mp3",
        ThumbMediaId:"_CDwFnJm3_TauWDSkmm2Jmb4f_3mpgonMzEvacdVGqZ2_sUPHwCAesPmDdhQ4Nfl"
      }
    }
    else if(receiveMessage.Content==9){
      var jsTicket=await wechat.getJsApiTicket();
      this.reply={
        type:"text",
        content:jsTicket
      }
    }
    else if(receiveMessage.Content==10){
      var token=await wechat.getAccessToken();
      this.reply={
        type:"text",
        content:token
      }
    }
    else{
      this.reply="你说什么我听不懂！";
    }
  }
}