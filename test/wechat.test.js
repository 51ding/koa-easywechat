var {expect} = require("chai");
var WeChat = require("../wechat/ok");

describe("微信构造函数相关测试", function () {
    describe("初始化", function () {
        it("参数不齐抛出异常", function () {
            var opts = {
                appID: "wx914e18b87ddbc384",
                appsecret: "45d3ef8915d29189fd249a3a00ec2f3a",
                token: "houhanbin",
                mode:"safe"
            }
            var wechat=new WeChat(opts);
        })

        it("参数齐全，不应该抛出异常",function () {
            var opts = {
                appID: "wx914e18b87ddbc384",
                appsecret: "45d3ef8915d29189fd249a3a00ec2f3a",
                token: "houhanbin",
                mode:"safe",
                encodingAESKey:"jo2MhVyQIe2E19rBBwdBMJPI3SsQwXmY82iW2ToOmuG"
            }
            var wechat=new WeChat(opts);
        })
    })
})


