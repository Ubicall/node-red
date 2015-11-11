function getZendeskTicketFormNodes(nodes) {
  return nodes.filter(function(node) {
    return (node.hasOwnProperty('type') && node.type == 'view-zendesk-ticket-form');
  });
}

function hasZendeskTicketFormNodes(nodes) {
  if (nodes.filter(function(node) {
      return (node.hasOwnProperty('type') && node.type == 'view-zendesk-ticket-form');
    })[0]) {
    return true;
  }
  return false;
}

function getNodeWithId(flow, id) {
  //get first one , id attribute doesn't duplicate
  return flow.Nodes.filter(function(node) {
    return (id && node.hasOwnProperty('id') && node.id == id);
  })[0];
}

function getStartNode(flow) {
  return flow.Nodes.filter(function(node) {
    // TODO : if it has no start point through exception
    return (node.hasOwnProperty('type') && node.type == 'start');
  })[0];
}

module.exports = {
  // every ivr node with type as key will be mapped to plist element type as value
  NodePlistMapper: {
    "view-choice": "Choice",
    "view-form": "Form",
    "view-grid": "Grid",
    "view-info": "Info",
    "view-url": "URL",
    "view-zendesk-ticket-form": "ZendeskForm",
    "view-submit-call": "SubmitCall",
    "action-submit-email": "SendEmail",
    "action-submit-zendesk-ticket": "SubmitZendeskTicket"
  },
  getZendeskTicketFormNodes: getZendeskTicketFormNodes,
  hasZendeskTicketFormNodes: hasZendeskTicketFormNodes,
  getNodeWithId: getNodeWithId,
  getStartNode: getStartNode,
}