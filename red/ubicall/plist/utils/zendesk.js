var zendesk = require("node-zendesk");
var when = require("when");
var log = require("../../../log");
var plistUtils = require('../nodes/utils.js')

function getTicketFields(zd_cred) {
  return when.promise(function(resolve, reject) {
    var client = zendesk.createClient(zd_cred);
    client.ticketfields.list(function(err, statusList, body, responseList, resultList) {
      if (err) return reject(err);
      else return resolve(resultList[0].ticket_fields);
    });
  });
}


function fetchZendeskFields(zd_cred, nodes) {
  return when.promise(function(resolve, reject) {
    if (plistUtils.hasZendeskNodes(nodes) && !zd_cred) {
      return reject("You add zendesk components but you not configure your zendesk account yet!!");
    } else if (plistUtils.hasZendeskNodes(nodes)) {
      getTicketFields(zd_cred).then(function(tikFlds) {
        nodes.forEach(function(node) {
          if (plistUtils.isZendeskFormNode(node)) {
            node.fields = tikFlds;
          }
        });
        return resolve(nodes);
      }).otherwise(function(err) {
        return reject(err);
      });
    } else {
      // has no zendesk credintials or zendesk components, well done
      return resolve(nodes);
    }
  });
}


module.exports = {
  fetchZendeskFields: fetchZendeskFields
}