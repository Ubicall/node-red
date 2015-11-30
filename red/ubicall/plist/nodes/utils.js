function isZendeskFormNode(node) {
  return (node.hasOwnProperty('type') && node.type == 'view-zendesk-ticket-form');
}

function isZendeskNode(node) {
  return (isZendeskFormNode(node) ||
    ((node.hasOwnProperty('type') && node.type == 'action-submit-zendesk-ticket'))
  )
}

function isZendeskKBNode(node) {
  return ((node.hasOwnProperty('type') && node.type == 'view-zendesk-knowledge-base'))
}

function getZendeskTicketFormNodes(nodes) {
  return nodes.filter(isZendeskFormNode);
}

function getZendeskKBNodes(nodes) {
  return nodes.filter(isZendeskKBNode);
}

function hasZendeskNodes(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (isZendeskNode(nodes[i])) {
      return true;
    }
  }
  return false;
}

function hasZendeskKBNodes(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (isZendeskKBNode(nodes[i])) {
      return true;
    }
  }
  return false;
}

/**
 * check if node has link to another
 * @param {Object} node
 * @param [Array] nodes
 **/
function nodeHasLink(node, another) {
  node.wires = node.wires || [];
  var wires = node.wires.map(function(element) {
    return element[0];
  });

  if (another instanceof Array) {
    for (var i = 0; i < another.length; i++) {
      if (!another[i].id) {
        continue;
      }
      return wires.indexOf(another[i].id) > -1;
    }
    return false;
  } else if (another.id) {
    return wires.indexOf(another.id) > -1
  }
  return false;
}

/**
 * replace node a wire with another
 * @param {Object} node - any node-red node
 * @param String aWire - what wire should be replaced
 * @param String another - value used to replace @param aWire
 **/
function replaceWireWithAnother(node, awire, another) {
  node.wires = node.wires || [];
  node.wires = node.wires.map(function(wire) {
    return (wire[0] === awire) ? [another] : wire
  });
  return node;
}

/**
 * get nodes has any wires equal wire
 * replace any input nodes for zd kb node to start node
 **/
function bridgeNodesWithKbStart(nodes, start) {

  var zdKBNodes = getZendeskKBNodes(nodes);
  var zdKBNodesIDs = zdKBNodes.map(function(node) {
    return node.id;
  });

  var kbInputNodes = nodes.filter(function(node) {
    return nodeHasLink(node, zdKBNodes)
  });

  kbInputNodes.forEach(function(node) {
    node.wires = node.wires || [];
    node.wires.forEach(function(wire) {
      if (zdKBNodesIDs.indexOf(wire[0]) > -1) {
        replaceWireWithAnother(node, wire[0], start.id);
      }
    });
  });

  return nodes;
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
  if (!dest instanceof Array) {
    dest = [dest];
  }
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
  hasZendeskKBNodes: hasZendeskKBNodes,
  isZendeskKBNode: isZendeskKBNode,
  bridgeNodesWithKbStart: bridgeNodesWithKbStart,
  replaceWireWithAnother: replaceWireWithAnother,
  getNodeWithId: getNodeWithId,
  getStartNode: getStartNode,
  concat: _concat
}