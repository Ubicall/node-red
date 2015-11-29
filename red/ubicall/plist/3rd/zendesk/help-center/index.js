var when = require("when");
var log = require("../../../../../log");
var plistUtils = require('../../../nodes/utils.js');
var hcNodes = require('./nodes');
var build = require("./build");

function fetchKnowledgebase(zd_cred, nodes) {
  return when.promise(function(resolve, reject) {
    if (plistUtils.hasZendeskKBNodes(nodes) && !zd_cred) {
      return reject("You add zendesk components but you not configure your zendesk account yet!!");
    } else if (plistUtils.hasZendeskKBNodes(nodes)) {
      build.kb(zd_cred).then(hcNodes.createKbNodes).then(function(kbNodes) {
        return resolve(plistUtils.concat(nodes, kbNodes));
      }).otherwise(function(err) {
        return reject(err);
      });
    } else {
      // has no zendesk credintials or zendesk knowledge base components, well done
      return resolve(nodes);
    }
  });
}

module.exports = {
  fetchKnowledgebase: fetchKnowledgebase
}