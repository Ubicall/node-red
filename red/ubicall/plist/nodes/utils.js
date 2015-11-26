function isZendeskFormNode(node) {
  return (node.hasOwnProperty('type') && node.type == 'view-zendesk-ticket-form');
}

function isZendeskNode(node) {
  return (isZendeskFormNode(node) ||
    ((node.hasOwnProperty('type') && node.type == 'action-submit-zendesk-ticket'))
  )
}

function getZendeskTicketFormNodes(nodes) {
  return nodes.filter(isZendeskFormNode);
}

function hasZendeskNodes(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (isZendeskNode(nodes[i])) {
      return true;
    }
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

/**
 * push elements of @param source to @param dest
 * _concat([] , [{},{}])
 * @param {Array} dest
 * @param {Array} source
 * @return {Array} dest
 **/
function _concat(dest, source) {
  if (!dest instanceof Array) dest = [dest]
  if (source instanceof Array) {
    source.forEach(function(item) {
      dest.push(item);
    });
  } else {
    dest.push(source);
  }
  return dest;
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
  isZendeskFormNode: isZendeskFormNode,
  isZendeskNode: isZendeskNode,
  getZendeskTicketFormNodes: getZendeskTicketFormNodes,
  hasZendeskNodes: hasZendeskNodes,
  getNodeWithId: getNodeWithId,
  getStartNode: getStartNode,
  concat: _concat
}