var when = require("when");
var tickets = require('./tickets');
var hc = require('./help-center');



module.exports = {
  integrate: function(zd_cred, nodes) {
    return when.promise(function(resolve, reject) {
      tickets.fetchTicketsFields(zd_cred, nodes).then(function(nodes) {
        hc.fetchKnowledgebase(zd_cred, nodes).then(function(nodes) {
          return resolve(nodes)
        }).otherwise(function(error) {
          return reject(error);
        });
      }).otherwise(function(error) {
        return reject(error);
      });
    });
  }
}