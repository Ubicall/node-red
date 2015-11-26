var tickets = require('./tickets');
var hc = require('./help-center');



module.exports = {
  fetchZendeskFields: tickets.fetchTicketsFields,
  fetchTicketsFields: tickets.fetchTicketsFields,
  fetchKnowledgebase: hc.fetchKnowledgebase
}