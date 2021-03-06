// http://stackoverflow.com/a/17037371/5318264
Array.prototype.flatten = function() {
  return this.reduce(function(prev, cur) {
    var more = [].concat(cur).some(Array.isArray);
    return prev.concat(more ? cur.flatten() : cur);
  }, []);
};


function isZendeskFormNode(node) {
  return (node.hasOwnProperty('type') && node.type == 'view-zendesk-ticket-form');
}

function isZendeskNode(node) {
  return (isZendeskFormNode(node) ||
    ((node.hasOwnProperty('type') && node.type == 'action-submit-zendesk-ticket'))
  )
}

function isZendeskKBNode(node) {
  return ((node.hasOwnProperty('type') && node.type == 'view-zendesk-help-center'))
}

function isZopimNode(node) {
  return ((node.hasOwnProperty('type') && node.type == 'view-zopim-chat'))
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

function hasZopimNodes(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (isZopimNode(nodes[i])) {
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

/**
 * replace @param inode with @param rnode in @param nodes
 * @param Array nodes - all nodes
 * @param Object inode - replace this node
 * @param Object rnode - replace with this node
 **/
function replaceNode(nodes, inode, rnode) {
  var shouldReplaced = nodes.filter(function(node) {
    node.wires = node.wires || []; // some nodes has no wires
    return node.wires.flatten().indexOf(inode.id) > -1;
  });

  shouldReplaced.forEach(function(node) {
    node.wires.forEach(function(wire) {
      wire[0] = (wire[0] === inode.id) ? rnode.id : wire[0];
    });
  });
}

/**
 * get fields which already existed in @param zdfrmflds
 * @param Array frmFlds - fields of a zendesk form
 * @param Array tktFlds - actual zendesk form fields with full details
 **/
function getFieldsOfZendeskForm(frmFlds, tktFlds) {
  var _flds = [];
  for (var i = 0; i < tktFlds.length; i++) {
    if (frmFlds.indexOf(tktFlds[i].id) > -1) {
      _flds.push(tktFlds[i]);
    }
  }
  return _flds;
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
    "action-submit-zendesk-ticket": "SubmitZendeskTicket",
    "view-zendesk-help-center": "ZendeskHC",
    "view-zopim-chat": "ZopimChat"
  },
  isZendeskFormNode: isZendeskFormNode,
  isZendeskNode: isZendeskNode,
  isZopimNode: isZopimNode,
  getZendeskTicketFormNodes: getZendeskTicketFormNodes,
  hasZendeskNodes: hasZendeskNodes,
  hasZendeskKBNodes: hasZendeskKBNodes,
  hasZopimNodes: hasZopimNodes,
  isZendeskKBNode: isZendeskKBNode,
  getZendeskKBNodes: getZendeskKBNodes,
  bridgeNodesWithKbStart: bridgeNodesWithKbStart,
  replaceNode: replaceNode,
  getFieldsOfZendeskForm: getFieldsOfZendeskForm,
  replaceWireWithAnother: replaceWireWithAnother,
  getNodeWithId: getNodeWithId,
  getStartNode: getStartNode,
  concat: _concat
}