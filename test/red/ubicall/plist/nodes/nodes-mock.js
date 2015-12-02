var faker = require('faker');
/**
 * @param {Array} choices - choice text i.e. ["sales", "CEO"]
 * @param {Array} wires - next connections i.e. ["xxxx.xxx", "yyyy.yyyyy"]
 **/

function getChoiceScreen(choices, wires) {
  var _choices=[];
  var _wires=[];
  if (choices && choices instanceof Array) {
    choices = choices.map(function(choice) {
      return {
        text: choice
      };
    });
  } else {
    _choices.push({text : faker.name.prefix() });
      choices = _choices;
  }

  if (wires && wire instanceof Array) {
    wires = wires.map(function(wire) {
      return [wire];
    });
  } else {
    _wires.push([faker.random.number()]);
    wires = _wires;
  }
    return {
      id: faker.random.number(),
      name: faker.name.prefix(),
      choices: choices,
      outputs:choices.length,
      type: "view-choice",
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number(),
      wires: wires
    };
}

function connectNodes(node1,node2){
  node1.wires.push([node2.id]);
  node1.choices.push({"text":node2.name});
}

function getZendeskTicketViewNode() {
    return {
      id: faker.random.number(),
      name: faker.name.prefix(),
      type: "view-zendesk-ticket-form",
      choices:[],
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number(),
      wires:[]
    };    
}

function getZendeskKBNode() {
    return {
      id: faker.random.number(),
      name: faker.name.prefix(),
      type: "view-zendesk-knowledge-base",
      choices:[],
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number(),
      wires:[]
    };
}

function getZendeskTicketActionNode() {
  return {
    id: faker.random.number(),
    name: faker.name.prefix(),
    type: "action-submit-zendesk-ticket",
    choices:[],
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number(),
    wires:[]
  };
}

function getNodes() {
  var nodes=[];
  var zendesk_view_ticket=getZendeskTicketViewNode();
  var zendesk_kb=getZendeskKBNode();
  var zendesk_action_ticket=getZendeskTicketActionNode(); 
  connectNodes(zendesk_view_ticket,zendesk_kb);
  connectNodes(zendesk_kb,zendesk_action_ticket);
  nodes.push(zendesk_view_ticket);
  nodes.push(zendesk_kb);
  nodes.push(zendesk_action_ticket);
  //console.log(JSON.stringify(nodes));
  return nodes;
}
getNodes();

module.exports = {
  getChoiceScreen: getChoiceScreen,
  getZendeskKBNode: getZendeskKBNode,
  getZendeskTicketViewNode: getZendeskTicketViewNode,
  getZendeskTicketActionNode: getZendeskTicketActionNode,
  getAllNodes: getNodes
}