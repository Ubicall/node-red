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
      var allPromises = [];
      plistUtils.getZendeskKBNodes(nodes).forEach(function(node) {
        // if node is zendeskKBNode
        //  check it type
        //    build all
        //    bridge with KB Node
        //    concat all
        switch (node.fetch) {
          case "category":
            allPromises.push(build.kbCategory(zd_cred, node.category).then(function(bld) {
              return when.resolve(hcNodes.createKBNodesFromCategory(bld));
            }).then(function(kbNodesFromCategory) {
              plistUtils.replaceNode(nodes, node, kbNodesFromCategory.categoryNode);
              plistUtils.concat(nodes, [kbNodesFromCategory.categoryNode]);
              plistUtils.concat(nodes, kbNodesFromCategory.sectionsNodes);
              plistUtils.concat(nodes, kbNodesFromCategory.articlesNodes);
            }));
            break;
          case "section":
            allPromises.push(build.kbSection(zd_cred, node.section).then(function(bld) {
              return when.resolve(hcNodes.createKBNodesFromSection(bld));
            }).then(function(kbNodesFromSection) {
              plistUtils.replaceNode(nodes, node, kbNodesFromSection.sectionNode);
              plistUtils.concat(nodes, [kbNodesFromSection.sectionNode]);
              plistUtils.concat(nodes, kbNodesFromSection.articlesNodes);
            }));
            break;
          default:
            allPromises.push(build.kb(zd_cred).then(function(bld) {
              return when.resolve(hcNodes.createKbNodes(bld));
            }).then(function(kbNodes) {
              plistUtils.replaceNode(nodes, node, kbNodes.start);
              plistUtils.concat(nodes, kbNodes.kbScreens);
            }));
        }
      });

      when.all(allPromises).then(function() {
        return resolve(nodes);
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