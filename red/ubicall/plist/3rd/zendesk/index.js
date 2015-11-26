var tickets = require('./tickets');
var hc = require('./help-center');



module.exports = {
  fetchTicketsFields: tickets.fetchTicketsFields,
  fetchKnowledgebase: hc.fetchKnowledgebase
}