var zendesk = require("node-zendesk");
var when = require("when");
var log = require("../../../log");
var util = require('./index.js')

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


function mapToZendesk(credentials, flows) {
  return when.promise(function(resolve, reject) {
      var zendeskFormNodes = util.getZendeskTicketFormNode(flows);
      if (zendeskFormNodes.length > 0) {
        getTicketFields(credentials).then(function(tikFlds) {
          for (var zdNode in zendeskFormNodes) {
            zdNode.fields = tikFlds;
          }
          return resolve(flows);
        }).otherwise(function(err) {
          return reject(err);
        });
      });
  }
}


module.exports = {
  mapToZendesk: mapToZendesk
}