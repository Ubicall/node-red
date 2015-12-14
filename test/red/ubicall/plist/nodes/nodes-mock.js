var faker = require('faker');
/**
 * @param {Array} choices - choice text i.e. ["sales", "CEO"]
 * @param {Array} wires - next connections i.e. ["xxxx.xxx", "yyyy.yyyyy"]
 **/

/**
* @return {Object} flow -flow of nodes 
*/
function getFlow(){
  return   {
    _id:faker.random.number(),
    key:"e6053eb8d35e02ae40beeeacef203c1a",
    version:faker.random.number(),
    __v:0,
    Nodes:[{label:"Sheet 1",id:faker.random.number(),type:"tab"},
    {id:faker.random.number(),type:"view-choice",name:"see",choices:[{text:"what"},{text:faker.name.prefix()},
    {"text":"sign up"}],
    outputs:3,
    x:faker.random.number(),
    y:faker.random.number(),
    z:faker.random.number(),wires:[[faker.random.number()],[],[faker.random.number()]]},
    {id:faker.random.number(),type:"start",meta:[{"key":"Font","value":"https://designer-dev.ubicall.com/uploads/meta/9c4026d559afaa0df2085a9f8674b056.ttf","type":"file"},
    {"key":"Theme","value":"Blue","type":"text"}],
    x:faker.random.number(),
    y:faker.random.number(),
    z:faker.random.number(),
    wires:[[faker.random.number()]]},{id:faker.random.number(),type:"view-url",name:"ubicall",url:"http://ubicall.com",
    x:faker.random.number(),
    y:faker.random.number(),
    z:faker.random.number(),wires:[[]]},
    {id:faker.random.number(),
    type:"view-form",
    name:"sign up",
    help:"sign up",
    fields:[{"description":"i.e. John Smith","editable":true,"required":false,"type":"Text Field","value":"Name","label":"Name"}],
    x:faker.random.number(),
    y:faker.random.number(),
    z:faker.random.number(),
    wires:[[faker.random.number()]]},
    {id:faker.random.number(),type:"action-submit-email",name:"add user",destination:{name:faker.name.prefix(),id:faker.random.number()},
    x:faker.random.number(),
    y:faker.random.number(),
    z:faker.random.number(),wires:[[]]}],
    created:"2015-12-07T11:13:54.459Z",
    deploy:1449486834459
  };
}
/**
* @param {Array} choices -choice text i.e. ["sales","CEO"]
* @param {Array} wires -next connections i.e. ["xxxx.xxx","yyyy.yyyy"]
* @return {Object} flow -flow of nodes 
*/
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

/** 
* @param {Object} node1
* @param {Object} node2
*/
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
  result.push(getStartNode());
  result.push(getZendeskTicketViewNode());
  result.push(getZendeskKBNode());
  result.push(getZendeskTicketActionNodeWithoutWires());
  result.push(getZendeskTicketActionNodeWithoutWires());
  result.push(urlNodeWithWire());
  result.push(urlNodeWithoutWire());
  result.push(getEmailWithWire());
  result.push(getEmailWithoutWire());
  result.push(getFormScreen());
  result.push(getGridScreen());
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

/**
*@return {Object} node of type view-zendesk-ticket-form
*/
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

/**
*@return {Object} node of type view-zendesk-knowledge-base
*/
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

/**
*@return {Object} node of type action-submit-zendesk-ticket
*/
function getZendeskTicketActionNodeWithoutWires() {
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

/**
*@return {Object} node of type action-submit-zendesk-ticket
*/
function getZendeskTicketActionNodeWithWires() {
  var _wires=[];
  var next=faker.random.number();
  _wires.push([next]);
  return {
    id: faker.random.number(),
    name: faker.name.prefix(),
    type: "action-submit-zendesk-ticket",
    choices: [],
    x: faker.random.number(),
    y: faker.random.number(),
    z: faker.random.number(),
    wires: [[_wires]]
  };
}

function generateWire(){
  return faker.random.number();
}
/**
*@return {Object} node of type url 
*/
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

/**
*@return {Object} node of type url 
*/
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

/**
*@return {Object} node of type view-info 
*/
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

/**
*@return {Object} node of type view-info 
*/
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

/**
*@return {Object} node of type view-submit-call 
*/
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

/**
*@return {Object} node of type view-submit-call 
*/

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

/**
*@return {Object} node 
*/
function getEmailWithWire(){
  var _wires=[];
  var next=faker.random.number();
  _wires.push([next]);
  return {
      id: faker.random.number(),
      name: faker.lorem.words(),
      destination: {id : faker.random.number() , name: faker.name.prefix()},
      wires: [[_wires]],
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number()
  };
}

function getEmailWithoutWire(){
  return {
      id: faker.random.number(),
      name: faker.lorem.words(),
      destination: {id : faker.random.number() , name: faker.name.prefix()},
      wires: [[]],
      x: faker.random.number(),
      y: faker.random.number(),
      z: faker.random.number()
  };
}

/**
*@return {Object} node of type view-choice
*/
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

/**
*@return {Object} node of type view-form
*/
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

/**
*@return {Object} node of type view-grid
*/
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

/**
*@return {Object} node of type start
*/
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

/**
*@return {Object} destination 
*/
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
module.exports = {
  getChoiceScreen: getChoiceScreen,
  getZendeskKBNode: getZendeskKBNode,
  getZendeskTicketViewNode: getZendeskTicketViewNode,
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
  getGridScreen:getGridScreen,
  getFlow:getFlow,
  getZendeskTicketActionNodeWithWires:getZendeskTicketActionNodeWithWires,
  getZendeskTicketActionNodeWithoutWires:getZendeskTicketActionNodeWithoutWires,
  getEmailWithWire:getEmailWithWire,
  getEmailWithoutWire:getEmailWithoutWire
}