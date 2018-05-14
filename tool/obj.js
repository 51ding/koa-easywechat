/*
 *将 source对象上的属性挂载到 destination 对象上
 *@param source 【Object】
 *@param destination 【Object】
*/

exports.copyProperty = function copyProperty(source, destination) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object") {
        destination[key] = Array.isArray(source[key]) ? [] : {};
        copyProperty(source[key], destination[key]);
      }
      else {
        destination[key] = source[key];
      }
    }
  }
}
