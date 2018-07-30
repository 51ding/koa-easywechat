/*用户发送消息*/
const RequestMsgType={
    /*文本消息*/
    text:"text",
    /*图片消息*/
    image:"image",
    /*语音消息*/
    voice:"voice",
    /*视频消息*/
    video:"video",
    /*小视频消息*/
    shortvideo:"shortvideo",
    /*地理位置消息*/
    location:"location",
    /*链接消息*/
    link:"link",
    /*事件消息*/
    event:RequestEventMsType
}

/*事件类型*/
const RequestEventMsgType={
    /*关注事件*/
    subscribe:"subscribe",
    /*取消关注事件*/
    unsubscribe:"unsubscribe",
    /*扫描二维码*/
    SCAN:"SCAN",
    /*上报地理位置事件*/
    LOCATION:"LOCATION",
    /*自定义菜单事件*/
    CLICK:"CLICK"
}

exports.RequestMsgType=RequestMsgType;

