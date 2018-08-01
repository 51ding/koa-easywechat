var {menuType,RootMenu,Menu} =require("../business/menu");
var fs=require("fs");
var path=require("path");

console.log(Object.values(menuType).some(r => r == "click"));


describe("创建菜单",function () {
    it("创建菜单实例",function () {
        //根菜单
        var rootMenu=new RootMenu();
        //构造一级菜单
        var firstLevelMenu1=new Menu(menuType.first,{name:"一级菜单1"});
        var secondLevelMenu1=new Menu(menuType.view,{name:"二级菜单1",url:"https://www.baidu.com"});
        var secondLevelMenu2=new Menu(menuType.push,{name:"二级菜单2",key:"test1"});
        var secondLevelMenu3=new Menu(menuType.waitmsg,{name:"二级菜单3",key:"test1"});
        firstLevelMenu1.add(secondLevelMenu1).add(secondLevelMenu2).add(secondLevelMenu3);

        //构建二级菜单
        var firstLevelMenu2=new Menu(menuType.first,{name:"一级菜单2"});
        var secondLevelMenu11=new Menu(menuType.location,{name:"二级菜单1",key:"location"});
        var secondLevelMenu22=new Menu(menuType.photo,{name:"二级菜单2",key:"photo"});
        var secondLevelMenu33=new Menu(menuType.pwx,{name:"二级菜单3",key:"pwx"});
        var secondLevelMenu44=new Menu(menuType.pwx,{name:"二级菜单1",key:"11111111"});
        firstLevelMenu2.add(secondLevelMenu11).add(secondLevelMenu22).add(secondLevelMenu33).add(secondLevelMenu44);

        //构建三级菜单
        var firstLevelMenu3=new Menu(menuType.first,{name:"一级菜单3"})
        var secondLevelMenu111=new Menu(menuType.view,{name:"二级菜单1",url:"https://www.baidu.com"});
        var secondLevelMenu222=new Menu(menuType.push,{name:"二级菜单2",key:"test1"});
        var secondLevelMenu333=new Menu(menuType.view,{name:"二级菜单3",url:"https://www.baidu.com"});
        var secondLevelMenu444=new Menu(menuType.view,{name:"二级菜单1",url:"https://www.baidu.com"});
        firstLevelMenu3.add(secondLevelMenu111).add(secondLevelMenu222).add(secondLevelMenu333).add(secondLevelMenu444);

        rootMenu.add(firstLevelMenu1).add(firstLevelMenu2).add(firstLevelMenu3);

        fs.writeFile(path.join(__dirname,"./testMenuJson.txt"),JSON.stringify(rootMenu),(err) => {
            if(err) return console.log(err.message);
            console.log("保存成功！");
        })
    })
})
