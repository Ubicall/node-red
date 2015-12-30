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

      // if node is zendeskKBNode
      //  check it type
      //    case all
      //      build all
      //      bridge with KB Node
      //      concat all
      //    case category
      //      build kb from this category
      //      bridge with KB Node
      //      concat all
      //    case section
      //      build kb from this section
      //      bridge with KB Node
      //      concat all

      var allPromises = [];
      nodes.forEach(function(node) {
        if (isZendeskKBNode(node)) {
          switch (node.fetch) {
            case "all":
              allPromises.push(build.kb(zd_cred).then(hcNodes.createKbNodes));
              break;
            case "category":
              allPromises.push(build.kbCategory(zd_cred, node.category).then(hcNodes.createKBNodesFromCategory));
              break;
            case "section":
              allPromises.push(build.kbSection(zd_cred, node.section).then(hcNodes.createKBNodesFromSection));
              break;
            default:
              allPromises.push(build.kb(zd_cred).then(hcNodes.createKbNodes));
          }
        }
      });

      build.kb(zd_cred).then(hcNodes.createKbNodes).then(function(kbNodes) {
        // make bridge between input of zendesk knowledge base component and kb start screen
        nodes = plistUtils.bridgeNodesWithKbStart(nodes, kbNodes.start);
        return resolve(plistUtils.concat(nodes, kbNodes.kbScreens));
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