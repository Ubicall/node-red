var should = require("should");
var utils = require("../../../../../../red/ubicall/plist/nodes/utils.js");
var nodes_mock = require('../nodes-mock');
var call = require("../../../../../../red/ubicall/plist/nodes/view/call.js");
var sinon = require('sinon');

describe("ubicall/plist/3rd/nodes/view/call", function() {
  describe("#createDestination(destination)", function() {
    var dest;
    before(function() {
      dest = nodes_mock.getDestination();
    });
    it("Parameter destination should be an Object", function() {
      dest.should.be.an.instanceOf(Object);
    });
  });

  describe("#createViewCall(node)", function() {
    var call_node_with_wire, call_node_without_wire;
    var call_with_wire, call_without_wire;
    var expected_mobile_endPoint_wired_node, expected_web_endPoint_wired_node;
    var expected_mobile_endPoint_not_wired_node, expected_web_endPoint_not_wired_node;
    var createDestfunc;

    before(function() {
      call_node_with_wire = nodes_mock.getCallNodeWithWire();
      call_node_without_wire = nodes_mock.getCallNodeWithoutWire();
      call_with_wire = call.createViewCall(call_node_with_wire);
      call_without_wire = call.createViewCall(call_node_without_wire);
    });

    it("should return an Object", function() {
      call_with_wire.should.an.instanceOf(Object);
      call_without_wire.should.an.instanceOf(Object);
    });

    it("ScreenTitle should be same as Input Node Name", function() {
      call_with_wire.ScreenTitle.should.be.equal(call_node_with_wire.name);
      call_without_wire.ScreenTitle.should.be.equal(call_node_without_wire.name);
    });

    it("Next ID should be same as Input Node wire ID", function() {
      call_with_wire.__next.id.should.be.equal(call_node_with_wire.wires[0][0]);
    });
  });

});