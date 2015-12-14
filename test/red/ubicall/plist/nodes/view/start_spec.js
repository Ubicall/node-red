var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var start = require("../../../../../../red/ubicall/plist/nodes/view/start.js");

describe("ubicall/plist/3rd/nodes/view/start", function() {

  describe("#createStart()", function() {
    var node, _start, flow;
    beforeEach(function() {
      node = nodes_mock.getStartNode();
      flow = nodes_mock.getFlow();
    });

    it("start node should have one wire", function() {
      node.wires.should.have.length(1);
    });

    it("Flow should be an Array", function() {
      flow.Nodes.should.be.an.instanceOf(Array);
    });
    it("Flow should be an Object", function() {
      flow.should.be.an.instanceOf(Object);
    });

  });
});