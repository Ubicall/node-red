var should = require("should");
var sinon = require("sinon");
var when = require("when");

var utils = require("../../../../../red/ubicall/plist/nodes/utils.js");
console.log(utils);

describe('Node', function() {
describe('isZendeskFormNode',function(){
    var node;
    before(function(){      
      node={
      id: "a87a0834.5785f8",
      name: "aassss",
      type: "view-choice"
      };
    });
    
    after(function() {});
  it("isZendeskNode should return true",function(){
    should.equal(true,utils.isZendeskNode(node));
  });
  it("isZendeskNode should return false",function(){
    should.equal(false,utils.isZendeskNode(node));
  });
});
});

describe('Node ', function() {
describe('isZendeskFormNode',function(){
    var node;
    beforeEach(function() {
    });
    before(function(){
      
      node={
      id: "a87a0834.5785f8",
      name: "aassss",
      type: "view-choice"
      };
    });
    
    after(function() {});
    
  it("should be a node of type view/action zendesk ticket", function() {
        should.equal(true,utils.isZendeskFormNode(node));
  });
  it("shouldn't be a node of type view/action zendesk ticket", function() {
        should.equal(false,utils.isZendeskFormNode(node));
  });
  
});
});


describe('Node',function(){
  describe('isZendeskKBNode',function(){
      var node;
      before(function(){
        node={
        id: "a87a0834.5785f8",
        name: "aassss",
        type: "view-zendesk"
        };
      });
      
      after(function() {});
      
    it("should be a node of type view-zendesk-knowledge-base", function() {
          should.equal(true,utils.isZendeskKBNode(node));
    });
    it("shouldn't be a node of type view-zendesk-knowledge-base", function() {
          should.equal(false,utils.isZendeskKBNode(node));
    });
    
  });
});


describe('Nodes',function(){
  var nodes;
  describe('#Array',function(){
    beforeEach(function () {
       nodes=[
            {
              id: "3ead6122.c1529e",
              name: "submit issuedd",
              type: "view-zendesk-ticket-form",
              wires: [["5409b2ac.abf64c"]],
              x:"1111",
              y:"1111",
              z:"111",
        },
        {
          id: "b5d7b189.4a285",
          name: "",
          type: "view-zendesk-ticket-form",
          wires: [[]],
          x: 371,
          y: 76,
          z: "8e492b56.71b6d8"  
        }
      ];
       });
       it("Nodes should be an array", function () {
        should(nodes).be.an.instanceOf(Array);
       });
  });
  describe('#getZendeskTicketFormNodes',function(){
  //should.equal(true,utils.getZendeskTicketFormNodes(nodes));
  });
});

describe('Nodes',function(){
      var nodes;
  beforeEach(function () {
     nodes=[
          {
            id: "3ead6122.c1529e",
            name: "submit issuedd",
            type: "view-choice",
            wires: [["5409b2ac.abf64c"]],
            x:"1111",
            y:"1111",
            z:"111",
      },
      {
        id: "b5d7b189.4a285",
        name: "",
        type: "view-choice",
        wires: [[]],
        x: 371,
        y: 76,
        z: "8e492b56.71b6d8"  
      }
    ];
     });
  describe('#Array',function(){  
       it("Nodes should be an array", function () {
        should(nodes).be.an.instanceOf(Array);
       });
  });
  describe('#hasZendeskNodes',function(){
    var node;
    it("should return true", function() {
          should(utils.hasZendeskNodes(nodes)).equal(true);
    });
    it("should return false", function() {
          should(utils.hasZendeskNodes(nodes)).equal(false);
    });
  });
  describe('#hasZendeskKBNodes',function(){
    var node;
    it("should return true", function() {
          should(utils.hasZendeskNodes(nodes)).equal(true);
    });
    it("should return false", function() {
          should(utils.hasZendeskNodes(nodes)).equal(false);
    });
  });
});


describe('Node',function(){
  describe('#getNodeWithId()',function(){
    var flow;
    var   nodes=[{id: "3ead6122.c1529e",name: "submit issuedd",type: "view-zendesk-ticket-form",wires: [["5409b2ac.abf64c"]],
          x:"1111",
          y:"1111",
          z:"111"},{id: "b5d7b189.4a285",name: "",type: "view-form",wires: [[]],x: 371,y: 76,z: "8e492b56.71b6d8"  }];
    before(function() {
      flow:{
        Nodes:nodes
      }
    });
    it('flow should be an Object',function(){
    //  should.equal(1,flow.instanceOf(Object));
    });
    it('should return Node ID',function() {
      //utils.getNodeWithId(flow,"3ead6122.c1529e").should.be.an.instanceOf(Object);
    });
  });
});

describe('Node',function(){
  describe('#getStartNode',function(){
      this.timeout(50000);
      var flow;
      before(function(){
      flow={
        nodes:[{
          id: "d5c313ef.2a3cf",
        meta: [{type: "file"}, {type: "text", value: "Red", key: "Theme"}],
        type: "start"
        }]
      };
      });
      it('should have flow of type object',function(){
      //  flow.should.be.an.instanceOf(Object);
      });
      it('should return node of type start',function(){
      //  var node_type=utils.getStartNode(flow).type;
    //    should.equal("type",node_type);
      });
  });
});



describe('Array',function(done){
  describe('#concat()',function(){
    var Array1,Array2;
    before(function() {
    Array1=['1','2','3'];
  Array2=['{3}','{6}'];
  });
  it('should return an array of Array1+Array2 elements',function(){
    utils.concat(Array1,Array2).should.be.an.instanceOf(Array);
  });
});
});