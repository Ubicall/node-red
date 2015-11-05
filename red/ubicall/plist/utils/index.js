module.exports = {

  plistMapper: {
    
  },
  getZendeskTicketFormNode :function(flow) {
    return flow.Nodes.filter(function(node) {
      return (node.hasOwnProperty('type') && node.type == 'view-zendesk-ticket-form');
    });
  },
  getNodeWithId: function(flow, id) {
    //get first one , id attribute doesn't duplicate
    return flow.Nodes.filter(function(node) {
      return (id && node.hasOwnProperty('id') && node.id == id);
    })[0];
  },
  getStartNode: function (flow){
    return flow.Nodes.filter(function(node) {
      // TODO : if it has no start point through exception
      return (node.hasOwnProperty('type') && node.type == 'start');
    })[0];
  }
}