var Router=require("koa-router");

var router=new Router();

router.get("/",async (ctx,nect)=>{
  ctx.body="nimeide";
});

module.exports=router;