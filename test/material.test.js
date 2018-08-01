var material=require("../api/material");
var {expect}=require("chai")
var fs=require("fs");
var path=require("path");

describe("素材测试",function () {
    it("限制上传文件的大小",function (done) {
        var stream=fs.createReadStream(path.join(__dirname,"./menu.test.js"));
        var total=0;
        stream.on("data",function (chunk) {
            total+=chunk.length;
        })
        stream.on("end",function () {
            console.log("大小",total);
        })
         done()
    })
})