var when = require("when");
var plistUtils = require('../../nodes/utils.js');

module.exports = {
  integrate: function(zopim_cred, nodes) {
    return when.promise(function(resolve, reject) {
      if (plistUtils.hasZopimNodes(nodes) && !zopim_cred) {
        return reject("You add Zopim components but you not configure your Zopim account yet!!");
      } else if (plistUtils.hasZopimNodes(nodes)) {
        nodes.forEach(function(node) {
          if (plistUtils.isZopimNode(node)) {
            node.settings = node.settings || {};
            node.settings.token = zopim_cred.token;
          }
        });
        return resolve(nodes);
      } else {
        // has no zopim credintials or zopim components, well done
        return resolve(nodes);
      }
    });
  }
}