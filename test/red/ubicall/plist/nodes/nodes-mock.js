var faker = require('faker');
/**
 * @param {Array} choices - choice text i.e. ["sales", "CEO"]
 * @param {Array} wires - next connections i.e. ["xxxx.xxx", "yyyy.yyyyy"]
 **/

function getChoiceScreen(choices, wires) {
  var _choices = [];
  var _wires = [];
  if (choices && choices instanceof Array) {
    choices = choices.map(function(choice) {
      return {
        text: choice
      };
    });
  } else {
    _choices.push({
      text: faker.name.prefix()
    });
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
    outputs: choices.length,
    type: "view-choice",
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number(),
    wires: wires
  };
}

function connectNodes(node1, node2) {
  var i;
  if(node1.length >0){
    for(i=0;i<node1.wires.length;i++){
      if(node2.id != node1.wires[i][0]){
          node1.wires.push([node2.id]);
          node1.choices.push({
            "text": node2.name
          });
      }
    }
  }
  else{
    node1.wires.push([node2.id]);
    node1.choices.push({
      "text": node2.name
    });
  }
  }


/**
 * @return {Array} Nodes 
 */
function getAllNodes() {
  var result = [];
  result.push(getZendeskTicketViewNode());
  result.push(getZendeskKBNode());
  result.push(getZendeskTicketActionNode());
  return result;
}

/**
* @param -{Array} Shuffles the array
*/
function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

/**
* @param {Array}-Nodes Design
*/
function createDesign(nodes) {
  var design = [];
  var i;
  for (i = 0; i < nodes.length; i++) {
    var node1 = nodes[Math.floor(Math.random() * nodes.length)];
    var node2 = nodes[Math.floor(Math.random() * nodes.length)];
    if (node1 != node2) {
      connectNodes(node1, node2);
      design.push(node1, node2);
    }
  }
var design = design.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
});
//console.log(JSON.stringify(design));
return design;
}

function getZendeskTicketViewNode() {
  return {
    name : faker.name.title(),
    help : faker.name.jobDescriptor(),
    id: faker.random.number(),
    type: "view-zendesk-ticket-form",
    wires: [[faker.random.number()]],
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number(),
  };

}

function getZendeskKBNode() {
  return {
    id: faker.random.number(),
    name: faker.name.lastName(),
    type: "view-zendesk-knowledge-base",
    choices: [],
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number(),
    wires: []
  };
}

function getZendeskTicketActionNode() {
  return {
    id: faker.random.number(),
    name: faker.name.prefix(),
    type: "action-submit-zendesk-ticket",
    choices: [],
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number(),
    wires: []
  };
}

function generateWire(){
  return faker.random.number();
}

function urlNodeWithWire(){
  var _wires=[];
  var id=generateWire();
    _wires.push([id]);
  return   {
      id: faker.random.number(),
      type: "url",
      url: faker.internet.url(),
      name: faker.internet.domainName(),
      wires:_wires,
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number()
    };
}

function urlNodeWithoutWire(){
  return   {
      id: faker.random.number(),
      type: "url",
      url: faker.internet.url(),
      wires:[],
      name: faker.internet.domainName(),
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number()
    };
}

function getInfoNodeWithWire(){
  var _wires=[];
  var next=faker.random.number();
  _wires.push([next]);
  return   {
      id: faker.random.number(),
      type: "view-info",
      name: faker.name.title(),
      help:faker.lorem.paragraph(),
      wires:_wires,
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number()
    };
}

function getInfoNodeWithoutWire(){
  return   {
      id: faker.random.number(),
      type: "view-info",
      name: faker.name.title(),
      help:faker.lorem.paragraph(),
      wires:[],
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number()
    };
}

function getCallNodeWithWire(){
  var _wires=[];
  var next=faker.random.number();
  _wires.push([next]);
  return  {
    id: faker.random.number(),
    type: "view-submit-call",
    name : faker.name.title,
    destination: {id : faker.random.number() , name: faker.name.prefix()},
    wires: [ _wires],
    x: faker.random.number(),
    y:faker.random.number(),
    z: faker.random.number()
  };
}

function getCallNodeWithoutWire(){
  return  {
    id: faker.random.number(),
    type: "view-submit-call",
    name : faker.name.title,
    destination: {id : faker.random.number() , name: faker.name.prefix()},
    wires: [],
    x: faker.random.number(),
    y:faker.random.number(),
    z: faker.random.number()
  };
}

function getChoiceScreen(){
  return {
    choices: [
      {text : faker.name.prefix()},
      {text : faker.name.prefix()},
      {text : faker.name.prefix()}
    ],
    id: faker.random.number(),
    outputs: 3,
    name: faker.name.title(),
    type: "view-choice",
    wires: [[faker.random.number()], [faker.random.number()] , [faker.random.number()]],
    x: faker.random.number(),
    y:faker.random.number(),
    z: faker.random.number
    
  }
};

function getFormScreen(){
  return {
    name : faker.name.title(),
    help : faker.name.prefix(),
    id: faker.random.number(),
    type: "view-form",
    wires: [[faker.random.number()]],
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number(),
    fields:[
        {
          label: "Name",
          value: "Name",
          type: "Text",
          required: true,
          description: faker.name.firstName()
        },
        {
          label: "Email",
          value: "Email",
          type: "Text",
          required: true,
          description:faker.internet.email()
        },
        {
          label: "Birth Date",
          value: "Birth Date",
          type: "Date",
          required: true,
          description: faker.date.recent()
        },
        {
          label: "Max Price",
          value: "Max Price",
          type: "Decimal",
          required: true,
          description: faker.finance.amount()
        }
      ]
  };
}

function getGridScreen(){
  return {
    choices: [
      {text : faker.name.prefix() , icon: "https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png"},
      {text : faker.name.prefix(), icon: "https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png"},
      {text : faker.name.prefix(), icon: "https://designer-dev.ubicall.com/uploads/b32ed83fef8be9a9a3d735e752610413.png"}
    ],
    id: faker.random.number(),
    outputs: 3,
    name: faker.name.title(),
    type: "view-grid",
    wires: [[faker.random.number()], [faker.random.number()] , [faker.random.number()]],
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number()
  };
}

function getStartNode(){
  return {
    id: faker.random.number(),
    meta: [
      {type: "file", value: "Default", key: "Font"},
      {type: "text", value: "Orange", key: "Theme"}
    ],
    type: "start",
    wires: [[faker.random.number()]],
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number(),
  };
}

function getDestination(){
  return { 
      id : faker.random.number(), 
      name: faker.name.prefix()
    };
}

function getNodes() {
var nodes=getAllNodes();
var design=createDesign(nodes);
  return design;
}
//getNodes();

module.exports = {
  getChoiceScreen: getChoiceScreen,
  getZendeskKBNode: getZendeskKBNode,
  getZendeskTicketViewNode: getZendeskTicketViewNode,
  getZendeskTicketActionNode: getZendeskTicketActionNode,
  getDesign: getNodes,
  getAllNodes: getAllNodes,
  urlNodeWithWire:urlNodeWithWire,
  urlNodeWithoutWire:urlNodeWithoutWire,
  getInfoNodeWithWire:getInfoNodeWithWire,
  getInfoNodeWithoutWire:getInfoNodeWithoutWire,
  getCallNodeWithWire:getCallNodeWithWire,
  getCallNodeWithoutWire:getCallNodeWithoutWire,
  getDestination:getDestination,
  getFormScreen:getFormScreen,
  getStartNode:getStartNode,
  getGridScreen:getGridScreen
}