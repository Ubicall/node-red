var should = require("should");
var sinon = require("sinon");
var when = require("when");
var faker = require('faker');
var utils = require("../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('./nodes-mock');

describe('Node should be of type view-zendesk-ticket-form', function() {
  describe('#isZendeskFormNode()', function() {
    it("Node with view-zendesk-ticket-form type should return true", function(done) {
      var node = nodes_mock.getZendeskTicketViewNode();
      utils.isZendeskFormNode(node).should.be.equal(true);
      done();
    });
    it("Node with action-zendesk-ticket-form type should return false", function(done) {
      var node = nodes_mock.getZendeskTicketActionNode();
      utils.isZendeskFormNode(node).should.be.equal(false);
      done();
    });
  });
});

describe('Node should be of type zendesk ', function() {
  describe('#isZendeskNode()', function() {
    it("Node should be a node of type view/action zendesk ticket", function(done) {
      var node = nodes_mock.getZendeskTicketViewNode();
      utils.isZendeskNode(node).should.be.equal(true);
      done();
    });
  });
});

describe('Node should be of type view-zendesk-knowledge-base', function() {
  describe('#isZendeskKBNode()', function() {
    it("Node should be a node of type view-zendesk-knowledge-base", function() {
      var node = nodes_mock.getZendeskKBNode();
      utils.isZendeskKBNode(node).should.be.equal(true);
    });
    it("Node shouldn't be a node of type view-zendesk-knowledge-base", function() {
      var node = nodes_mock.getZendeskTicketViewNode();
      utils.isZendeskKBNode(node).should.be.equal(false);
    });

  });
});

describe('Array of nodes Zendesk Ticket type', function() {
  describe('#getZendeskTicketFormNodes()', function() {
    it("Nodes should be an array", function(done) {
      var nodes = nodes_mock.getAllNodes();
      nodes.should.be.an.instanceOf(Array);
      utils.getZendeskTicketFormNodes(nodes).should.be.instanceOf(Array);
      done();
    });
  });
});

describe('check on zendesk Nodes', function() {
  var nodes;
  beforeEach(function() {
    nodes = nodes_mock.getAllNodes();
  });
  it("input should be an array", function(done) {
    nodes.should.be.an.instanceOf(Array);
    done();
  });
  describe('#hasZendeskNodes()', function() {
    it("Array should have zendesk nodes ", function(done) {
      var x = utils.hasZendeskNodes(nodes).should.be.equal(true);
      done();
    });
  });
  describe('#hasZendeskKBNodes()', function() {
    it("Array should have zendesk nodes ", function(done) {
      var x = utils.hasZendeskKBNodes(nodes).should.be.equal(true);
      done();
    });
  });
});

describe('Bribridge Nodes Array With Knowledgebase StartNode ', function() {
  describe('#bridgeNodesWithKbStart()', function() {
    var nodes =
      before(function() {
        nodes = nodes_mock.getAllNodes();
      });
  });
});


describe('Get Node by Its ID', function() {
  describe('#getNodeWithId()', function() {
    var flow;
    var nodes = nodes_mock.getAllNodes();
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

describe('Return Node of type Start', function() {
  describe('#getStartNode()', function() {
    this.timeout(50000);
    var flow, nodes;
    nodes = nodes_mock.getAllNodes();
    flow = {
      nodes: nodes
    };
    it('should have flow of type object', function(done) {

      flow.should.be.an.instanceOf(Object);
      done();
    });
    it('should return node of type start', function(done) {
      //utils.getStartNode(flow.nodes);
      //    should.equal("type",node_type);
      done();
    });
  });
});



describe('Concatinating 2 different Arrays', function(done) {
  describe('#concat()', function() {
    var Array1, Array2;
    before(function() {
      Array1 = ['1', '2', '3'];
      Array2 = ['{3}', '{6}'];
    });
    it('should return an array of Array1+Array2 elements', function(done) {
      utils.concat(Array1, Array2).should.be.an.instanceOf(Array);
      done();
    });
  });
});