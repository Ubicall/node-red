var zendesk = require("node-zendesk");
var when = require("when");
var log = require("../../../log");
var plistUtils = require('../nodes/utils.js')

function getTicketFields(credentials) {
  return when.promise(function(resolve, reject) {
    var client = zendesk.createClient({
      username: credentials.username,
      password: credentials.password,
      remoteUri: 'https://' + credentials.domain + '.zendesk.com/api/v2'
    });
    client.ticketfields.list(function(err, statusList, body, responseList, resultList) {
      if (err) return reject(err);
      else return resolve(resultList[0].ticket_fields);
    });
  });
}


function fetchZendeskFields(credentials, nodes) {
  return when.promise(function(resolve, reject) {
    var zendeskFormNodes = plistUtils.getZendeskTicketFormNodes(nodes);
    if (zendeskFormNodes.length > 0) {
      getTicketFields(credentials).then(function(tikFlds) {
        for (var zdNode in zendeskFormNodes) {
          zdNode.fields = tikFlds;
        }
        return resolve(nodes);
      }).otherwise(function(err) {
        return reject(err);
      });
    }
    return resolve(nodes);
  });
}


module.exports = {
  fetchZendeskFields: fetchZendeskFields
}