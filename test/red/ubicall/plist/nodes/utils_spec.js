var should = require("should");
var when = require("when");
var utils = require("../../../../../red/ubicall/plist/nodes/utils.js");

var nodes_mock = require("./nodes-mock");

describe("ubicall/plist/3rd/nodes/utils", function() {
  describe('#isZendeskFormNode()', function() {
    var node;
    before(function() {
      node = nodes_mock.getZendeskTicketViewNode();
    });
    it("isZendeskNode should return true", function() {
      utils.isZendeskNode(node).should.equal(true);
    });

  });

  describe('#isZendeskKBNode()', function() {
    var node;
    before(function() {
      node = nodes_mock.getZendeskKBNode();
    });

    it("should be a node of type view-zendesk-help-center", function() {
      utils.isZendeskKBNode(node).should.equal(true);
    });

  });
  describe('#isZopimNode()', function() {
    var node;
    before(function() {
      node = nodes_mock.getZopimNode();
    });

    it("should be a node of type view-zopim-chat", function() {
      utils.isZopimNode(node).should.equal(true);
    });

  });

  describe('#hasZendeskNodes()', function() {
    var nodes;
    before(function() {
      nodes = nodes_mock.getAllNodes();
    });
    it("should return true", function() {
      utils.hasZendeskNodes(nodes).should.be.equal(true);
    });
  });

  describe('#hasZendeskKBNodes()', function() {
    var nodes;
    before(function() {
      nodes = nodes_mock.getAllNodes();
    });
    it("should return true", function() {
      utils.hasZendeskNodes(nodes).should.be.equal(true);
    });
  });
  describe('#hasZopimNodes()', function() {
    var nodes;
    before(function() {
      nodes = nodes_mock.getAllNodes();
    });
    it("should return true", function() {
      utils.hasZendeskNodes(nodes).should.be.equal(true);
    });
  });

  describe('#getNodeWithId()', function() {
    var flow;
    var nodes = [{
      id: "3ead6122.c1529e",
      name: "submit issuedd",
      type: "view-zendesk-ticket-form",
      wires: [
        ["5409b2ac.abf64c"]
      ],
      x: "1111",
      y: "1111",
      z: "111"
    }, {
      id: "b5d7b189.4a285",
      name: "",
      type: "view-form",
      wires: [
        []
      ],
      x: 371,
      y: 76,
      z: "8e492b56.71b6d8"
    }];
    before(function() {
      flow: {
        Nodes: nodes
      }
    });
    it('flow should be an Object', function() {
      //  should.equal(1,flow.instanceOf(Object));
    });
    it('should return Node ID', function() {
      //utils.getNodeWithId(flow,"3ead6122.c1529e").should.be.an.instanceOf(Object);
    });
  });

  describe('#getStartNode', function() {
    this.timeout(50000);
    var flow;
    before(function() {
      flow = {
        nodes: [{
          id: "d5c313ef.2a3cf",
          meta: [{
            type: "file"
          }, {
            type: "text",
            value: "Red",
            key: "Theme"
          }],
          type: "start"
        }]
      };
    });
    it('should have flow of type object', function() {
      //  flow.should.be.an.instanceOf(Object);
    });
    it('should return node of type start', function() {
      //  var node_type=utils.getStartNode(flow).type;
      //    should.equal("type",node_type);
    });
  });

  describe('#concat()', function() {
    var Array1, Array2;
    before(function() {
      Array1 = ['1', '2', '3'];
      Array2 = ['{3}', '{6}'];
    });
    it('should return an array of Array1+Array2 elements', function() {
      utils.concat(Array1, Array2).should.be.an.instanceOf(Array);
    });
  });
});