var prefix="https://api.weixin.qq.com/cgi-bin/"

module.exports={
  //获取AccessToken
  accseeToken:prefix+"token?grant_type=client_credential",
  //获取jsApiTicket
  jsApiTicket:prefix+"ticket/getticket?",
  //素材相关接口
  material:{
    //上传临时素材
    uploadTemporaryMaterial:prefix+"media/upload?",
    //上传永久素材
    uoloadPermanentMaterial:prefix+"material/add_news?",
    //上传图文消息内的图片获取URL
    uploadImage:prefix+"media/uploadimg?"
  },
  //用户相关接口
  user:{

  },
  //账号管理
  account:{

  }

}