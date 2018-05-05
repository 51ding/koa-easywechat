exports.getReplyMeaageTemplate=function(replyContent,receiveMessage) {
	var info=formatReplyContent(replyContent,receiveMessage);
	var xml="";
	//回复文本消息
	if(info.msgType=="text"){
		xml=`<xml><ToUserName><![CDATA[${info.ToUserName}]]></ToUserName><FromUserName><![CDATA[${info.FromUserName}]]></FromUserName><CreateTime>${info.CreateTime}</CreateTime><MsgType><![CDATA[${info.msgType}]]></MsgType><Content><![CDATA[${info.content}]]></Content></xml>`;
	}
	//回复图片消息
	else if(info.msgType=="image"){
		xml=`<xml><ToUserName><![CDATA[${info.ToUserName}]]></ToUserName><FromUserName><![CDATA[${info.FromUserName}]]></FromUserName><CreateTime>${info.CreateTime}</CreateTime><MsgType><![CDATA[${info.msgType}]]></MsgType><Image><MediaId><![CDATA[${info.content.media_id}]]></MediaId></Image></xml>`;
	}
	else if(info.msgType=="voice"){
		xml=`<xml><ToUserName><![CDATA[${info.ToUserName}]]></ToUserName><FromUserName><![CDATA[${info.FromUserName}]]></FromUserName><CreateTime>${info.CreateTime}</CreateTime><MsgType><![CDATA[${info.msgType}]]></MsgType><Voice><MediaId><![CDATA[${info.content.media_id}]]></MediaId></Voice></xml>`;
	}
	else if(info.msgType=="video"){
		xml=`<xml><ToUserName><![CDATA[${info.ToUserName}]]></ToUserName><FromUserName><![CDATA[${info.FromUserName}]]></FromUserName><CreateTime>${info.CreateTime}</CreateTime><MsgType><![CDATA[${info.msgType}]]></MsgType><Video><MediaId><![CDATA[${info.content.media_id}]]></MediaId><Title><![CDATA[${info.content.title}]]></Title><Description><![CDATA[${info.content.description}]]></Description></Video></xml>`;
	}
	else if(info.msgType=="music"){
		xml=`<xml><ToUserName><![CDATA[${info.ToUserName}]]></ToUserName><FromUserName><![CDATA[${info.FromUserName}]]></FromUserName><CreateTime>${info.CreateTime}</CreateTime><MsgType><![CDATA[${info.msgType}]]></MsgType><Music><Title><![CDATA[${info.content.Title}]]></Title><Description><![CDATA[${info.content.Description}]]></Description><MusicUrl><![CDATA[${info.content.MUSIC_Url}]]></MusicUrl><HQMusicUrl><![CDATA[${info.content.HQ_MUSIC_Url}]]></HQMusicUrl><ThumbMediaId><![CDATA[${info.content.media_id}]]></ThumbMediaId></Music></xml>`;
	}
	else if(info.msgType=="news"){
		var artical="";
		info.content.forEach(r=>{
			artical+=`<item><Title><![CDATA[${r.title}]]></Title><Description><![CDATA[${r.description}]]></Description><PicUrl><![CDATA[${r.picurl}]]></PicUrl><Url><![CDATA[${r.url}]]></Url></item>`
		})
		xml=`<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>${info.CreateTime}</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>${info.content.length}</ArticleCount><Articles>${artical}</Articles></xml>`;
	}

  return xml;
}


function formatReplyContent(replyContent,receiveMessage){
	var info={};
	var type="text";
	info.ToUserName=receiveMessage.FromUserName;
	info.FromUserName=receiveMessage.ToUserName;
	info.CreateTime=Date.now();
	if(Array.isArray(replyContent)){
		type="news";
	}
	type=replyContent.type || type;
	info.content=replyContent;
	info.msgType=type;
	return info;
}
