const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const tree = {}
/**
 * 映射 d 文件夹下的文件为模块
 */
const mapDir = d => {


  // 获得当前文件夹下的所有的文件夹和文件
  const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory());
  //映射文件夹
  dirs.forEach(dir => {
    mapDir(path.join(d, dir))
  })

  // 映射文件
  files.forEach(file => {
    if (path.extname(file) === '.js') {
      var obj = require(path.join(d, file));
      var keys = Object.keys(obj);
      for (i = 0; i < keys.length; i++) tree[keys[i]] = obj[keys[i]];
    }
  })
}

mapDir(path.join(__dirname));
// 默认导出当前文件夹下的映射

module.exports =tree ;
