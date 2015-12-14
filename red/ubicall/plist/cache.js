var cache = require('memory-cache');
var log = require('../../log');

function get(licence, version) {
  var key = licence + "." + version;
  var res = cache.get(key);
  log.info(res ? "fetching " + key + " from cache successfully" : key + " not found in cache");
  return res;
}

function put(licence, version, plist) {
  var key = licence + "." + version;
  var res = cache.put(key, plist);
  log.info(res ? "adding " + key + " to cache successfully" : key + " not add to cache!!!");
  return res;
}

function del(licence, version) {
  var key = licence + "." + version;
  var res = cache.del(key);
  log.info(res ? "deleting " + key + " from cache successfully" : key + " not deleted from cache!!!");
  return res;
}

function clear(){
  cache.clear();
}


module.exports = {
  get: get,
  put: put,
  delete: del,
  clear: clear
}